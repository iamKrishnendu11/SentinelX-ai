package com.sentinel.website.entities;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "github_connection_metadata", indexes = {
        @Index(name = "idx_github_meta_sentinel_user", columnList = "sentinelUserId")
})
public class GitHubMetadata {

    @Id
    @Column(length = 36)
    private String id;

    @Column(nullable = false)
    private String sentinelUserId;

    @Column(nullable = false)
    private String githubUserId;

    @Column(nullable = false)
    private String username;

    private String avatarUrl;

    @Column(nullable = false)
    private Instant connectedAt;

    @Column(nullable = false)
    private String status;

    public GitHubMetadata() {}

    public GitHubMetadata(String id, String sentinelUserId, String githubUserId, String username, String avatarUrl, Instant connectedAt, String status) {
        this.id = id;
        this.sentinelUserId = sentinelUserId;
        this.githubUserId = githubUserId;
        this.username = username;
        this.avatarUrl = avatarUrl;
        this.connectedAt = connectedAt;
        this.status = status;
    }

    @PrePersist
    protected void onCreate() {
        if (id == null || id.isBlank()) {
            id = java.util.UUID.randomUUID().toString();
        }
        if (connectedAt == null) connectedAt = Instant.now();
        if (status == null) status = "CONNECTED";
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getSentinelUserId() { return sentinelUserId; }
    public void setSentinelUserId(String sentinelUserId) { this.sentinelUserId = sentinelUserId; }

    public String getGithubUserId() { return githubUserId; }
    public void setGithubUserId(String githubUserId) { this.githubUserId = githubUserId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public Instant getConnectedAt() { return connectedAt; }
    public void setConnectedAt(Instant connectedAt) { this.connectedAt = connectedAt; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public static GitHubMetadataBuilder builder() {
        return new GitHubMetadataBuilder();
    }

    public static class GitHubMetadataBuilder {
        private String id;
        private String sentinelUserId;
        private String githubUserId;
        private String username;
        private String avatarUrl;
        private Instant connectedAt;
        private String status = "CONNECTED";

        public GitHubMetadataBuilder id(String id) { this.id = id; return this; }
        public GitHubMetadataBuilder sentinelUserId(String sentinelUserId) { this.sentinelUserId = sentinelUserId; return this; }
        public GitHubMetadataBuilder githubUserId(String githubUserId) { this.githubUserId = githubUserId; return this; }
        public GitHubMetadataBuilder username(String username) { this.username = username; return this; }
        public GitHubMetadataBuilder avatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; return this; }
        public GitHubMetadataBuilder connectedAt(Instant connectedAt) { this.connectedAt = connectedAt; return this; }
        public GitHubMetadataBuilder status(String status) { this.status = status; return this; }

        public GitHubMetadata build() {
            return new GitHubMetadata(id, sentinelUserId, githubUserId, username, avatarUrl, connectedAt, status);
        }
    }
}
