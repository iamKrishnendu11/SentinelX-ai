package com.sentinel.website.entities;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "error_reports", indexes = {
        @Index(name = "idx_error_report_device", columnList = "deviceId")
})
public class ErrorReport {

    @Id
    @Column(length = 36)
    private String id;

    private String deviceId;

    private String sentinelUserId;

    @Column(nullable = false)
    private String errorType;

    @Column(length = 2000, nullable = false)
    private String sanitizedMessage;

    private String appVersion;

    private String operatingSystem;

    @Column(nullable = false)
    private Instant timestamp;

    public ErrorReport() {}

    public ErrorReport(String id, String deviceId, String sentinelUserId, String errorType, String sanitizedMessage, String appVersion, String operatingSystem, Instant timestamp) {
        this.id = id;
        this.deviceId = deviceId;
        this.sentinelUserId = sentinelUserId;
        this.errorType = errorType;
        this.sanitizedMessage = sanitizedMessage;
        this.appVersion = appVersion;
        this.operatingSystem = operatingSystem;
        this.timestamp = timestamp;
    }

    @PrePersist
    protected void onCreate() {
        if (id == null || id.isBlank()) {
            id = java.util.UUID.randomUUID().toString();
        }
        if (timestamp == null) timestamp = Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getDeviceId() { return deviceId; }
    public void setDeviceId(String deviceId) { this.deviceId = deviceId; }

    public String getSentinelUserId() { return sentinelUserId; }
    public void setSentinelUserId(String sentinelUserId) { this.sentinelUserId = sentinelUserId; }

    public String getErrorType() { return errorType; }
    public void setErrorType(String errorType) { this.errorType = errorType; }

    public String getSanitizedMessage() { return sanitizedMessage; }
    public void setSanitizedMessage(String sanitizedMessage) { this.sanitizedMessage = sanitizedMessage; }

    public String getAppVersion() { return appVersion; }
    public void setAppVersion(String appVersion) { this.appVersion = appVersion; }

    public String getOperatingSystem() { return operatingSystem; }
    public void setOperatingSystem(String operatingSystem) { this.operatingSystem = operatingSystem; }

    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }

    public static ErrorReportBuilder builder() {
        return new ErrorReportBuilder();
    }

    public static class ErrorReportBuilder {
        private String id;
        private String deviceId;
        private String sentinelUserId;
        private String errorType;
        private String sanitizedMessage;
        private String appVersion;
        private String operatingSystem;
        private Instant timestamp;

        public ErrorReportBuilder id(String id) { this.id = id; return this; }
        public ErrorReportBuilder deviceId(String deviceId) { this.deviceId = deviceId; return this; }
        public ErrorReportBuilder sentinelUserId(String sentinelUserId) { this.sentinelUserId = sentinelUserId; return this; }
        public ErrorReportBuilder errorType(String errorType) { this.errorType = errorType; return this; }
        public ErrorReportBuilder sanitizedMessage(String sanitizedMessage) { this.sanitizedMessage = sanitizedMessage; return this; }
        public ErrorReportBuilder appVersion(String appVersion) { this.appVersion = appVersion; return this; }
        public ErrorReportBuilder operatingSystem(String operatingSystem) { this.operatingSystem = operatingSystem; return this; }
        public ErrorReportBuilder timestamp(Instant timestamp) { this.timestamp = timestamp; return this; }

        public ErrorReport build() {
            return new ErrorReport(id, deviceId, sentinelUserId, errorType, sanitizedMessage, appVersion, operatingSystem, timestamp);
        }
    }
}

