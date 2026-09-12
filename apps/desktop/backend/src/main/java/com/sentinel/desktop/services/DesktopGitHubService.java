package com.sentinel.desktop.services;

import com.sentinel.desktop.entities.GitHubAccount;
import com.sentinel.desktop.entities.Project;
import com.sentinel.desktop.entities.User;
import com.sentinel.desktop.repositories.GitHubAccountRepository;
import com.sentinel.desktop.repositories.ProjectRepository;
import com.sentinel.desktop.repositories.UserRepository;
import com.sentinel.desktop.security.SecureCredentialStore;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class DesktopGitHubService {

    private final GitHubAccountRepository gitHubAccountRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final SecureCredentialStore credentialStore;

    private static final String KEY_GITHUB_ACCESS_TOKEN_PREFIX = "github_access_token_";

    public DesktopGitHubService(
            GitHubAccountRepository gitHubAccountRepository,
            ProjectRepository projectRepository,
            UserRepository userRepository,
            SecureCredentialStore credentialStore) {
        this.gitHubAccountRepository = gitHubAccountRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.credentialStore = credentialStore;
    }

    public Optional<GitHubAccount> getActiveGitHubAccount(String sentinelUserId) {
        return gitHubAccountRepository.findBySentinelUserIdAndActiveTrue(sentinelUserId);
    }

    public Optional<String> getGitHubAccessToken(String sentinelUserId) {
        return Optional.ofNullable(credentialStore.getCredential(KEY_GITHUB_ACCESS_TOKEN_PREFIX + sentinelUserId));
    }

    @Transactional
    public GitHubAccount connectGitHubAccount(
            String sentinelUserId,
            String githubUserId,
            String username,
            String displayName,
            String email,
            String avatarUrl,
            String profileUrl,
            String rawAccessToken) {

        User user = userRepository.findBySentinelUserId(sentinelUserId)
                .orElseGet(() -> userRepository.save(User.builder()
                        .sentinelUserId(sentinelUserId)
                        .name(username)
                        .email(email != null ? email : username + "@github.local")
                        .emailVerified(true)
                        .createdAt(Instant.now())
                        .updatedAt(Instant.now())
                        .build()));

        // Enforce Single Active GitHub Account rule: Deactivate any existing active accounts
        List<GitHubAccount> existingAccounts = gitHubAccountRepository.findBySentinelUserId(sentinelUserId);
        for (GitHubAccount account : existingAccounts) {
            account.setActive(false);
            gitHubAccountRepository.save(account);
        }

        GitHubAccount newAccount = GitHubAccount.builder()
                .user(user)
                .sentinelUserId(sentinelUserId)
                .githubUserId(githubUserId)
                .username(username)
                .displayName(displayName)
                .email(email)
                .avatarUrl(avatarUrl)
                .profileUrl(profileUrl)
                .connectedAt(Instant.now())
                .updatedAt(Instant.now())
                .active(true)
                .build();

        GitHubAccount saved = gitHubAccountRepository.save(newAccount);

        // Store GitHub access token securely in OS Secure Credential Store (NOT SQLite!)
        if (rawAccessToken != null && !rawAccessToken.isBlank()) {
            credentialStore.saveCredential(KEY_GITHUB_ACCESS_TOKEN_PREFIX + sentinelUserId, rawAccessToken);
        }

        return saved;
    }

    @Transactional
    public void disconnectGitHubAccount(String sentinelUserId) {
        // Mark GitHub account inactive
        gitHubAccountRepository.findBySentinelUserIdAndActiveTrue(sentinelUserId).ifPresent(account -> {
            account.setActive(false);
            gitHubAccountRepository.save(account);
        });

        // Mark associated projects inactive
        List<Project> userProjects = projectRepository.findBySentinelUserIdAndActiveTrue(sentinelUserId);
        for (Project project : userProjects) {
            project.setActive(false);
            projectRepository.save(project);
        }

        // Remove sensitive tokens from secure credential store
        credentialStore.deleteCredential(KEY_GITHUB_ACCESS_TOKEN_PREFIX + sentinelUserId);
    }
}
