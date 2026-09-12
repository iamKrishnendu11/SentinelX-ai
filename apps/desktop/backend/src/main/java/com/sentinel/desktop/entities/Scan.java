package com.sentinel.desktop.entities;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "scans", indexes = {
        @Index(name = "idx_scan_sentinel_user_id", columnList = "sentinelUserId"),
        @Index(name = "idx_scan_project_id", columnList = "project_id")
})
public class Scan {

    @Id
    @Column(length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(nullable = false)
    private String sentinelUserId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ScanStatus status;

    private Instant startedAt;

    private Instant completedAt;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    public Scan() {}

    public Scan(String id, Project project, String sentinelUserId, ScanStatus status, Instant startedAt, Instant completedAt, Instant createdAt) {
        this.id = id;
        this.project = project;
        this.sentinelUserId = sentinelUserId;
        this.status = status;
        this.startedAt = startedAt;
        this.completedAt = completedAt;
        this.createdAt = createdAt;
    }

    @PrePersist
    protected void onCreate() {
        if (id == null || id.isBlank()) {
            id = java.util.UUID.randomUUID().toString();
        }
        if (createdAt == null) createdAt = Instant.now();
        if (status == null) status = ScanStatus.QUEUED;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }

    public String getSentinelUserId() { return sentinelUserId; }
    public void setSentinelUserId(String sentinelUserId) { this.sentinelUserId = sentinelUserId; }

    public ScanStatus getStatus() { return status; }
    public void setStatus(ScanStatus status) { this.status = status; }

    public Instant getStartedAt() { return startedAt; }
    public void setStartedAt(Instant startedAt) { this.startedAt = startedAt; }

    public Instant getCompletedAt() { return completedAt; }
    public void setCompletedAt(Instant completedAt) { this.completedAt = completedAt; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public static ScanBuilder builder() {
        return new ScanBuilder();
    }

    public static class ScanBuilder {
        private String id;
        private Project project;
        private String sentinelUserId;
        private ScanStatus status = ScanStatus.QUEUED;
        private Instant startedAt;
        private Instant completedAt;
        private Instant createdAt;

        public ScanBuilder id(String id) { this.id = id; return this; }
        public ScanBuilder project(Project project) { this.project = project; return this; }
        public ScanBuilder sentinelUserId(String sentinelUserId) { this.sentinelUserId = sentinelUserId; return this; }
        public ScanBuilder status(ScanStatus status) { this.status = status; return this; }
        public ScanBuilder startedAt(Instant startedAt) { this.startedAt = startedAt; return this; }
        public ScanBuilder completedAt(Instant completedAt) { this.completedAt = completedAt; return this; }
        public ScanBuilder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }

        public Scan build() {
            return new Scan(id, project, sentinelUserId, status, startedAt, completedAt, createdAt);
        }
    }
}
