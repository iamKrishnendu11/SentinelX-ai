package com.sentinel.desktop.services;

import com.sentinel.desktop.entities.GitHubAccount;
import com.sentinel.desktop.entities.Project;
import com.sentinel.desktop.repositories.GitHubAccountRepository;
import com.sentinel.desktop.repositories.ProjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class DesktopProjectService {

    private final ProjectRepository projectRepository;
    private final GitHubAccountRepository gitHubAccountRepository;

    public DesktopProjectService(ProjectRepository projectRepository, GitHubAccountRepository gitHubAccountRepository) {
        this.projectRepository = projectRepository;
        this.gitHubAccountRepository = gitHubAccountRepository;
    }

    public List<Project> getProjectsForUser(String sentinelUserId) {
        return projectRepository.findBySentinelUserIdAndActiveTrue(sentinelUserId);
    }

    public Optional<Project> getProjectForUser(String sentinelUserId, String projectId) {
        return projectRepository.findBySentinelUserIdAndId(sentinelUserId, projectId);
    }

    @Transactional
    public Project addProject(
            String sentinelUserId,
            String githubRepositoryId,
            String repositoryName,
            String repositoryFullName,
            String ownerLogin,
            String description,
            boolean privateRepository,
            String defaultBranch,
            String htmlUrl,
            String localPath) {

        GitHubAccount gitHubAccount = gitHubAccountRepository.findBySentinelUserIdAndActiveTrue(sentinelUserId)
                .orElseThrow(() -> new IllegalStateException("Active GitHub account is required to connect a project."));

        // Check duplicate repository
        Optional<Project> existingOpt = projectRepository.findBySentinelUserIdAndGithubRepositoryId(sentinelUserId, githubRepositoryId);
        if (existingOpt.isPresent()) {
            Project existing = existingOpt.get();
            existing.setActive(true);
            existing.setRepositoryName(repositoryName);
            existing.setRepositoryFullName(repositoryFullName);
            existing.setOwnerLogin(ownerLogin);
            existing.setDescription(description);
            existing.setPrivateRepository(privateRepository);
            existing.setDefaultBranch(defaultBranch != null ? defaultBranch : "main");
            existing.setHtmlUrl(htmlUrl);
            existing.setLocalPath(localPath);
            existing.setUpdatedAt(Instant.now());
            return projectRepository.save(existing);
        }

        Project newProject = Project.builder()
                .gitHubAccount(gitHubAccount)
                .sentinelUserId(sentinelUserId)
                .githubRepositoryId(githubRepositoryId)
                .repositoryName(repositoryName)
                .repositoryFullName(repositoryFullName)
                .ownerLogin(ownerLogin)
                .description(description)
                .privateRepository(privateRepository)
                .defaultBranch(defaultBranch != null ? defaultBranch : "main")
                .htmlUrl(htmlUrl)
                .localPath(localPath)
                .connectedAt(Instant.now())
                .updatedAt(Instant.now())
                .active(true)
                .build();

        return projectRepository.save(newProject);
    }

    @Transactional
    public boolean deleteProject(String sentinelUserId, String projectId) {
        Optional<Project> projectOpt = projectRepository.findBySentinelUserIdAndId(sentinelUserId, projectId);
        if (projectOpt.isPresent()) {
            Project project = projectOpt.get();
            project.setActive(false);
            projectRepository.save(project);
            return true;
        }
        return false;
    }
}
