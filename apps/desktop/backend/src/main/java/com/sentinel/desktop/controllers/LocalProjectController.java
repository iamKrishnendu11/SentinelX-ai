package com.sentinel.desktop.controllers;

import com.sentinel.desktop.entities.Project;
import com.sentinel.desktop.services.DesktopProjectService;
import com.sentinel.desktop.services.DesktopUserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
public class LocalProjectController {

    private final DesktopProjectService projectService;
    private final DesktopUserService userService;

    public LocalProjectController(DesktopProjectService projectService, DesktopUserService userService) {
        this.projectService = projectService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<Project>> getProjects() {
        String activeUserId = userService.getActiveSentinelUserId();
        List<Project> projects = projectService.getProjectsForUser(activeUserId);
        return ResponseEntity.ok(projects);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> addProject(@Valid @RequestBody AddProjectRequest request) {
        String activeUserId = userService.getActiveSentinelUserId();
        try {
            Project project = projectService.addProject(
                    activeUserId,
                    request.getGithubRepositoryId(),
                    request.getRepositoryName(),
                    request.getRepositoryFullName(),
                    request.getOwnerLogin(),
                    request.getDescription(),
                    request.isPrivateRepository(),
                    request.getDefaultBranch(),
                    request.getHtmlUrl(),
                    request.getLocalPath()
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "success", true,
                    "project", project
            ));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteProject(@PathVariable("id") String id) {
        String activeUserId = userService.getActiveSentinelUserId();
        boolean deleted = projectService.deleteProject(activeUserId, id);
        if (deleted) {
            return ResponseEntity.ok(Map.of("success", true));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("success", false, "message", "Project not found."));
    }

    public static class AddProjectRequest {
        @NotBlank(message = "githubRepositoryId is required")
        private String githubRepositoryId;

        @NotBlank(message = "repositoryName is required")
        private String repositoryName;

        @NotBlank(message = "repositoryFullName is required")
        private String repositoryFullName;

        @NotBlank(message = "ownerLogin is required")
        private String ownerLogin;

        private String description;
        private boolean privateRepository;
        private String defaultBranch;
        private String htmlUrl;
        private String localPath;

        public AddProjectRequest() {}

        public String getGithubRepositoryId() { return githubRepositoryId; }
        public void setGithubRepositoryId(String githubRepositoryId) { this.githubRepositoryId = githubRepositoryId; }

        public String getRepositoryName() { return repositoryName; }
        public void setRepositoryName(String repositoryName) { this.repositoryName = repositoryName; }

        public String getRepositoryFullName() { return repositoryFullName; }
        public void setRepositoryFullName(String repositoryFullName) { this.repositoryFullName = repositoryFullName; }

        public String getOwnerLogin() { return ownerLogin; }
        public void setOwnerLogin(String ownerLogin) { this.ownerLogin = ownerLogin; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public boolean isPrivateRepository() { return privateRepository; }
        public void setPrivateRepository(boolean privateRepository) { this.privateRepository = privateRepository; }

        public String getDefaultBranch() { return defaultBranch; }
        public void setDefaultBranch(String defaultBranch) { this.defaultBranch = defaultBranch; }

        public String getHtmlUrl() { return htmlUrl; }
        public void setHtmlUrl(String htmlUrl) { this.htmlUrl = htmlUrl; }

        public String getLocalPath() { return localPath; }
        public void setLocalPath(String localPath) { this.localPath = localPath; }
    }
}
