package com.sentinel.desktop.entities;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "github_accounts", indexes = {
        @Index(name = "idx_github_sentinel_user_id", columnList = "sentinelUserId")
})
public class GitHubAccount {

    @Id
    @Column(length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String sentinelUserId;

    @Column(nullable = false)
    private String githubUserId;

    @Column(nullable = false)
    private String username;

    private String displayName;

    private String email;

    private String avatarUrl;

    private String profileUrl;

    @Column(nullable = false)
    private Instant connectedAt;

    @Column(nullable = false)
    private Instant updatedAt;

    @Column(nullable = false)
    private boolean active;

    public GitHubAccount() {}

    public GitHubAccount(String id, User user, String sentinelUserId, String githubUserId, String username, String displayName, String email, String avatarUrl, String profileUrl, Instant connectedAt, Instant updatedAt, boolean active) {
        this.id = id;
        this.user = user;
        this.sentinelUserId = sentinelUserId;
        this.githubUserId = githubUserId;
        this.username = username;
        this.displayName = displayName;
        this.email = email;
        this.avatarUrl = avatarUrl;
        this.profileUrl = profileUrl;
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
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getSentinelUserId() { return sentinelUserId; }
    public void setSentinelUserId(String sentinelUserId) { this.sentinelUserId = sentinelUserId; }

    public String getGithubUserId() { return githubUserId; }
    public void setGithubUserId(String githubUserId) { this.githubUserId = githubUserId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public String getProfileUrl() { return profileUrl; }
    public void setProfileUrl(String profileUrl) { this.profileUrl = profileUrl; }

    public Instant getConnectedAt() { return connectedAt; }
    public void setConnectedAt(Instant connectedAt) { this.connectedAt = connectedAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public static GitHubAccountBuilder builder() {
        return new GitHubAccountBuilder();
    }

    public static class GitHubAccountBuilder {
        private String id;
        private User user;
        private String sentinelUserId;
        private String githubUserId;
        private String username;
        private String displayName;
        private String email;
        private String avatarUrl;
        private String profileUrl;
        private Instant connectedAt;
        private Instant updatedAt;
        private boolean active = true;

        public GitHubAccountBuilder id(String id) { this.id = id; return this; }
        public GitHubAccountBuilder user(User user) { this.user = user; return this; }
        public GitHubAccountBuilder sentinelUserId(String sentinelUserId) { this.sentinelUserId = sentinelUserId; return this; }
        public GitHubAccountBuilder githubUserId(String githubUserId) { this.githubUserId = githubUserId; return this; }
        public GitHubAccountBuilder username(String username) { this.username = username; return this; }
        public GitHubAccountBuilder displayName(String displayName) { this.displayName = displayName; return this; }
        public GitHubAccountBuilder email(String email) { this.email = email; return this; }
        public GitHubAccountBuilder avatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; return this; }
        public GitHubAccountBuilder profileUrl(String profileUrl) { this.profileUrl = profileUrl; return this; }
        public GitHubAccountBuilder connectedAt(Instant connectedAt) { this.connectedAt = connectedAt; return this; }
        public GitHubAccountBuilder updatedAt(Instant updatedAt) { this.updatedAt = updatedAt; return this; }
        public GitHubAccountBuilder active(boolean active) { this.active = active; return this; }

        public GitHubAccount build() {
            return new GitHubAccount(id, user, sentinelUserId, githubUserId, username, displayName, email, avatarUrl, profileUrl, connectedAt, updatedAt, active);
        }
    }
}
