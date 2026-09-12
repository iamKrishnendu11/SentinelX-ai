package com.sentinel.desktop.entities;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "sentinel_users", indexes = {
        @Index(name = "idx_sentinel_user_id", columnList = "sentinelUserId", unique = true)
})
public class User {

    @Id
    @Column(length = 36)
    private String id;

    @Column(nullable = false, unique = true)
    private String sentinelUserId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private boolean emailVerified;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    public User() {}

    public User(String id, String sentinelUserId, String name, String email, boolean emailVerified, Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.sentinelUserId = sentinelUserId;
        this.name = name;
        this.email = email;
        this.emailVerified = emailVerified;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    @PrePersist
    protected void onCreate() {
        if (id == null || id.isBlank()) {
            id = java.util.UUID.randomUUID().toString();
        }
        Instant now = Instant.now();
        if (createdAt == null) createdAt = now;
        if (updatedAt == null) updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getSentinelUserId() { return sentinelUserId; }
    public void setSentinelUserId(String sentinelUserId) { this.sentinelUserId = sentinelUserId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public boolean isEmailVerified() { return emailVerified; }
    public void setEmailVerified(boolean emailVerified) { this.emailVerified = emailVerified; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

    public static UserBuilder builder() {
        return new UserBuilder();
    }

    public static class UserBuilder {
        private String id;
        private String sentinelUserId;
        private String name;
        private String email;
        private boolean emailVerified;
        private Instant createdAt;
        private Instant updatedAt;

        public UserBuilder id(String id) { this.id = id; return this; }
        public UserBuilder sentinelUserId(String sentinelUserId) { this.sentinelUserId = sentinelUserId; return this; }
        public UserBuilder name(String name) { this.name = name; return this; }
        public UserBuilder email(String email) { this.email = email; return this; }
        public UserBuilder emailVerified(boolean emailVerified) { this.emailVerified = emailVerified; return this; }
        public UserBuilder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }
        public UserBuilder updatedAt(Instant updatedAt) { this.updatedAt = updatedAt; return this; }

        public User build() {
            return new User(id, sentinelUserId, name, email, emailVerified, createdAt, updatedAt);
        }
    }
}
