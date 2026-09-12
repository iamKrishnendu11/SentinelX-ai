package com.sentinel.desktop.controllers;

import com.sentinel.desktop.entities.GitHubAccount;
import com.sentinel.desktop.services.DesktopGitHubService;
import com.sentinel.desktop.services.DesktopUserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/github")
public class LocalGitHubController {

    private final DesktopGitHubService gitHubService;
    private final DesktopUserService userService;

    @Value("${github.client-id:}")
    private String clientId;

    @Value("${github.client-secret:}")
    private String clientSecret;

    private final RestTemplate restTemplate = new RestTemplate();

    public LocalGitHubController(DesktopGitHubService gitHubService, DesktopUserService userService) {
        this.gitHubService = gitHubService;
        this.userService = userService;
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getGitHubStatus() {
        String activeUserId = userService.getActiveSentinelUserId();
        Optional<GitHubAccount> accountOpt = gitHubService.getActiveGitHubAccount(activeUserId);

        if (accountOpt.isPresent()) {
            GitHubAccount account = accountOpt.get();
            return ResponseEntity.ok(Map.of(
                    "connected", true,
                    "username", account.getUsername(),
                    "avatarUrl", account.getAvatarUrl() != null ? account.getAvatarUrl() : "",
                    "displayName", account.getDisplayName() != null ? account.getDisplayName() : "",
                    "status", "connected"
            ));
        }

        return ResponseEntity.ok(Map.of(
                "connected", false,
                "status", "disconnected"
        ));
    }

    @PostMapping("/connect")
    public ResponseEntity<Map<String, Object>> connectGitHub() {
        if (clientId != null && !clientId.isBlank()) {
            String oauthUrl = "https://github.com/login/oauth/authorize?client_id=" + clientId + "&scope=repo,read:user,user:email";
            return ResponseEntity.ok(Map.of("url", oauthUrl));
        }
        return ResponseEntity.status(404).body(Map.of("error", "GitHub Client ID not configured on backend"));
    }

    @PostMapping("/callback")
    public ResponseEntity<Map<String, Object>> handleCallback(@RequestBody Map<String, String> payload) {
        String activeUserId = userService.getActiveSentinelUserId();
        String code = payload.get("code");

        if (code == null || code.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Missing OAuth authorization code"));
        }

        String accessToken = null;
        String githubUserId = null;
        String username = null;
        String displayName = "GitHub User";
        String email = null;
        String avatarUrl = "https://github.com/ghost.png";
        String profileUrl = "https://github.com";

        if (clientSecret == null || clientSecret.isBlank()) {
            if (code.startsWith("ghp_") || code.startsWith("github_pat_")) {
                accessToken = code;
            } else {
                return ResponseEntity.badRequest().body(Map.of(
                        "error", "GitHub Client Secret is not configured on the backend. Please configure github.client-secret or provide a GitHub Personal Access Token."
                ));
            }
        } else {
            try {
                // 1. Exchange OAuth authorization code for GitHub Access Token
                Map<String, String> tokenReq = Map.of(
                        "client_id", clientId,
                        "client_secret", clientSecret,
                        "code", code
                );

                HttpHeaders headers = new HttpHeaders();
                headers.setAccept(List.of(MediaType.APPLICATION_JSON));
                HttpEntity<Map<String, String>> tokenEntity = new HttpEntity<>(tokenReq, headers);

                ResponseEntity<Map> tokenResp = restTemplate.postForEntity(
                        "https://github.com/login/oauth/access_token", tokenEntity, Map.class);

                if (tokenResp.getStatusCode().is2xxSuccessful() && tokenResp.getBody() != null) {
                    accessToken = (String) tokenResp.getBody().get("access_token");
                }
            } catch (Exception e) {
                System.err.println("[LocalGitHubController] Error exchanging OAuth code: " + e.getMessage());
            }
        }

        if (accessToken == null || accessToken.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to obtain valid GitHub access token"));
        }

        try {
            HttpHeaders userHeaders = new HttpHeaders();
            userHeaders.setBearerAuth(accessToken);
            userHeaders.set("User-Agent", "SentinelX-Desktop");
            HttpEntity<Void> userEntity = new HttpEntity<>(userHeaders);

            ResponseEntity<Map> userResp = restTemplate.exchange(
                    "https://api.github.com/user", HttpMethod.GET, userEntity, Map.class);

            if (userResp.getStatusCode().is2xxSuccessful() && userResp.getBody() != null) {
                Map<String, Object> userMap = userResp.getBody();
                if (userMap.get("id") != null) githubUserId = String.valueOf(userMap.get("id"));
                if (userMap.get("login") != null) username = (String) userMap.get("login");
                if (userMap.get("name") != null) displayName = (String) userMap.get("name");
                if (userMap.get("email") != null) email = (String) userMap.get("email");
                if (userMap.get("avatar_url") != null) avatarUrl = (String) userMap.get("avatar_url");
                if (userMap.get("html_url") != null) profileUrl = (String) userMap.get("html_url");
            }
        } catch (Exception e) {
            return ResponseEntity.status(502).body(Map.of("error", "Failed to fetch GitHub profile with provided token: " + e.getMessage()));
        }

        if (githubUserId == null || username == null) {
            return ResponseEntity.status(502).body(Map.of("error", "Could not retrieve GitHub profile details"));
        }

        // Save real GitHub account in local SQLite and store access token securely in OS SecureCredentialStore
        GitHubAccount account = gitHubService.connectGitHubAccount(
                activeUserId,
                githubUserId,
                username,
                displayName,
                email,
                avatarUrl,
                profileUrl,
                accessToken != null ? accessToken : code
        );

        return ResponseEntity.ok(Map.of(
                "success", true,
                "username", account.getUsername(),
                "avatarUrl", account.getAvatarUrl()
        ));
    }

    @GetMapping("/repositories")
    public ResponseEntity<Map<String, Object>> getRepositories() {
        String activeUserId = userService.getActiveSentinelUserId();
        Optional<GitHubAccount> accountOpt = gitHubService.getActiveGitHubAccount(activeUserId);

        if (accountOpt.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("error", "GitHub account not connected"));
        }

        Optional<String> tokenOpt = gitHubService.getGitHubAccessToken(activeUserId);

        if (tokenOpt.isEmpty() || tokenOpt.get().isBlank()) {
            return ResponseEntity.status(401).body(Map.of("error", "GitHub access token missing. Please reconnect GitHub."));
        }

        try {
            String token = tokenOpt.get();
            HttpHeaders userHeaders = new HttpHeaders();
            userHeaders.setBearerAuth(token);
            userHeaders.set("User-Agent", "SentinelX-Desktop");
            HttpEntity<Void> userEntity = new HttpEntity<>(userHeaders);

            // Fetch real user repositories from GitHub API
            ResponseEntity<List> reposResp = restTemplate.exchange(
                    "https://api.github.com/user/repos?per_page=100&sort=updated&type=all",
                    HttpMethod.GET,
                    userEntity,
                    List.class
            );

            if (reposResp.getStatusCode().is2xxSuccessful() && reposResp.getBody() != null) {
                List<Map<String, Object>> rawRepos = reposResp.getBody();
                List<Map<String, Object>> formattedRepos = rawRepos.stream().map(repo -> {
                    String id = repo.get("id") != null ? String.valueOf(repo.get("id")) : "";
                    String name = repo.get("name") != null ? String.valueOf(repo.get("name")) : "";
                    String owner = repo.get("owner") instanceof Map ? String.valueOf(((Map<?, ?>) repo.get("owner")).get("login")) : accountOpt.get().getUsername();
                    boolean isPrivate = Boolean.TRUE.equals(repo.get("private"));
                    String htmlUrl = repo.get("html_url") != null ? String.valueOf(repo.get("html_url")) : "";
                    String defaultBranch = repo.get("default_branch") != null ? String.valueOf(repo.get("default_branch")) : "main";
                    String description = repo.get("description") != null ? String.valueOf(repo.get("description")) : "";
                    String fullName = repo.get("full_name") != null ? String.valueOf(repo.get("full_name")) : owner + "/" + name;

                    Map<String, Object> map = new java.util.HashMap<>();
                    map.put("id", id);
                    map.put("name", name);
                    map.put("fullName", fullName);
                    map.put("owner", owner);
                    map.put("private", isPrivate);
                    map.put("htmlUrl", htmlUrl);
                    map.put("defaultBranch", defaultBranch);
                    map.put("description", description);
                    return map;
                }).toList();

                return ResponseEntity.ok(Map.of("repositories", formattedRepos));
            }
        } catch (Exception e) {
            System.err.println("[LocalGitHubController] Failed to query GitHub repos API: " + e.getMessage());
            return ResponseEntity.status(502).body(Map.of("error", "GitHub API request failed: " + e.getMessage() + ". Please reconnect GitHub account."));
        }

        return ResponseEntity.ok(Map.of("repositories", List.of()));
    }

    @PostMapping("/disconnect")
    public ResponseEntity<Map<String, Object>> disconnectGitHub() {
        String activeUserId = userService.getActiveSentinelUserId();
        gitHubService.disconnectGitHubAccount(activeUserId);
        return ResponseEntity.ok(Map.of("success", true, "message", "GitHub account disconnected."));
    }
}


