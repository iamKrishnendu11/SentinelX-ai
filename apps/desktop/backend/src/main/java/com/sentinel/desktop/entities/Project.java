package com.sentinel.desktop.entities;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "projects", indexes = {
        @Index(name = "idx_project_sentinel_user_id", columnList = "sentinelUserId"),
        @Index(name = "idx_project_repo_user", columnList = "sentinelUserId, githubRepositoryId", unique = true)
})
public class Project {

    @Id
    @Column(length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "github_account_id", nullable = false)
    private GitHubAccount gitHubAccount;

    @Column(nullable = false)
    private String sentinelUserId;

    @Column(nullable = false)
    private String githubRepositoryId;

    @Column(nullable = false)
    private String repositoryName;

    @Column(nullable = false)
    private String repositoryFullName;

    @Column(nullable = false)
    private String ownerLogin;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private boolean privateRepository;

    @Column(nullable = false)
    private String defaultBranch;

    private String htmlUrl;

    private String localPath;

    @Column(nullable = false)
    private Instant connectedAt;

    @Column(nullable = false)
    private Instant updatedAt;

    @Column(nullable = false)
    private boolean active;

    public Project() {}

    public Project(String id, GitHubAccount gitHubAccount, String sentinelUserId, String githubRepositoryId, String repositoryName, String repositoryFullName, String ownerLogin, String description, boolean privateRepository, String defaultBranch, String htmlUrl, String localPath, Instant connectedAt, Instant updatedAt, boolean active) {
        this.id = id;
        this.gitHubAccount = gitHubAccount;
        this.sentinelUserId = sentinelUserId;
        this.githubRepositoryId = githubRepositoryId;
        this.repositoryName = repositoryName;
        this.repositoryFullName = repositoryFullName;
        this.ownerLogin = ownerLogin;
        this.description = description;
        this.privateRepository = privateRepository;
        this.defaultBranch = defaultBranch != null ? defaultBranch : "main";
        this.htmlUrl = htmlUrl;
        this.localPath = localPath;
        this.connectedAt = connectedAt;
        this.updatedAt = updatedAt;
        this.active = active;
    }

    @PrePersist
    protected void onCreate() {
        if (id == null || id.isBlank()) {
            id = java.util.UUID.randomUUID().toString();
        }
        Instant now = Instant.now();
        if (connectedAt == null) connectedAt = now;
        if (updatedAt == null) updatedAt = now;
        if (defaultBranch == null) defaultBranch = "main";
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public GitHubAccount getGitHubAccount() { return gitHubAccount; }
    public void setGitHubAccount(GitHubAccount gitHubAccount) { this.gitHubAccount = gitHubAccount; }

    public String getSentinelUserId() { return sentinelUserId; }
    public void setSentinelUserId(String sentinelUserId) { this.sentinelUserId = sentinelUserId; }

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

    public Instant getConnectedAt() { return connectedAt; }
    public void setConnectedAt(Instant connectedAt) { this.connectedAt = connectedAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public static ProjectBuilder builder() {
        return new ProjectBuilder();
    }

    public static class ProjectBuilder {
        private String id;
        private GitHubAccount gitHubAccount;
        private String sentinelUserId;
        private String githubRepositoryId;
        private String repositoryName;
        private String repositoryFullName;
        private String ownerLogin;
        private String description;
        private boolean privateRepository;
        private String defaultBranch = "main";
        private String htmlUrl;
        private String localPath;
        private Instant connectedAt;
        private Instant updatedAt;
        private boolean active = true;

        public ProjectBuilder id(String id) { this.id = id; return this; }
        public ProjectBuilder gitHubAccount(GitHubAccount gitHubAccount) { this.gitHubAccount = gitHubAccount; return this; }
        public ProjectBuilder sentinelUserId(String sentinelUserId) { this.sentinelUserId = sentinelUserId; return this; }
        public ProjectBuilder githubRepositoryId(String githubRepositoryId) { this.githubRepositoryId = githubRepositoryId; return this; }
        public ProjectBuilder repositoryName(String repositoryName) { this.repositoryName = repositoryName; return this; }
        public ProjectBuilder repositoryFullName(String repositoryFullName) { this.repositoryFullName = repositoryFullName; return this; }
        public ProjectBuilder ownerLogin(String ownerLogin) { this.ownerLogin = ownerLogin; return this; }
        public ProjectBuilder description(String description) { this.description = description; return this; }
        public ProjectBuilder privateRepository(boolean privateRepository) { this.privateRepository = privateRepository; return this; }
        public ProjectBuilder defaultBranch(String defaultBranch) { this.defaultBranch = defaultBranch; return this; }
        public ProjectBuilder htmlUrl(String htmlUrl) { this.htmlUrl = htmlUrl; return this; }
        public ProjectBuilder localPath(String localPath) { this.localPath = localPath; return this; }
        public ProjectBuilder connectedAt(Instant connectedAt) { this.connectedAt = connectedAt; return this; }
        public ProjectBuilder updatedAt(Instant updatedAt) { this.updatedAt = updatedAt; return this; }
        public ProjectBuilder active(boolean active) { this.active = active; return this; }

        public Project build() {
            return new Project(id, gitHubAccount, sentinelUserId, githubRepositoryId, repositoryName, repositoryFullName, ownerLogin, description, privateRepository, defaultBranch, htmlUrl, localPath, connectedAt, updatedAt, active);
        }
    }
}
