package com.sentinel.website.entities;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "telemetry_events", indexes = {
        @Index(name = "idx_telemetry_event_type", columnList = "eventType"),
        @Index(name = "idx_telemetry_device_id", columnList = "deviceId")
})
public class TelemetryEvent {

    @Id
    @Column(length = 36)
    private String id;

    private String deviceId;

    private String sentinelUserId;

    @Column(nullable = false)
    private String eventType;

    private String appVersion;

    private String operatingSystem;

    @Column(nullable = false)
    private Instant timestamp;

    private Long durationMs;

    @Column(columnDefinition = "TEXT")
    private String metadataJson;

    public TelemetryEvent() {}

    public TelemetryEvent(String id, String deviceId, String sentinelUserId, String eventType, String appVersion, String operatingSystem, Instant timestamp, Long durationMs, String metadataJson) {
        this.id = id;
        this.deviceId = deviceId;
        this.sentinelUserId = sentinelUserId;
        this.eventType = eventType;
        this.appVersion = appVersion;
        this.operatingSystem = operatingSystem;
        this.timestamp = timestamp;
        this.durationMs = durationMs;
        this.metadataJson = metadataJson;
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

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }

    public String getAppVersion() { return appVersion; }
    public void setAppVersion(String appVersion) { this.appVersion = appVersion; }

    public String getOperatingSystem() { return operatingSystem; }
    public void setOperatingSystem(String operatingSystem) { this.operatingSystem = operatingSystem; }

    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }

    public Long getDurationMs() { return durationMs; }
    public void setDurationMs(Long durationMs) { this.durationMs = durationMs; }

    public String getMetadataJson() { return metadataJson; }
    public void setMetadataJson(String metadataJson) { this.metadataJson = metadataJson; }

    public static TelemetryEventBuilder builder() {
        return new TelemetryEventBuilder();
    }

    public static class TelemetryEventBuilder {
        private String id;
        private String deviceId;
        private String sentinelUserId;
        private String eventType;
        private String appVersion;
        private String operatingSystem;
        private Instant timestamp;
        private Long durationMs;
        private String metadataJson;

        public TelemetryEventBuilder id(String id) { this.id = id; return this; }
        public TelemetryEventBuilder deviceId(String deviceId) { this.deviceId = deviceId; return this; }
        public TelemetryEventBuilder sentinelUserId(String sentinelUserId) { this.sentinelUserId = sentinelUserId; return this; }
        public TelemetryEventBuilder eventType(String eventType) { this.eventType = eventType; return this; }
        public TelemetryEventBuilder appVersion(String appVersion) { this.appVersion = appVersion; return this; }
        public TelemetryEventBuilder operatingSystem(String operatingSystem) { this.operatingSystem = operatingSystem; return this; }
        public TelemetryEventBuilder timestamp(Instant timestamp) { this.timestamp = timestamp; return this; }
        public TelemetryEventBuilder durationMs(Long durationMs) { this.durationMs = durationMs; return this; }
        public TelemetryEventBuilder metadataJson(String metadataJson) { this.metadataJson = metadataJson; return this; }

        public TelemetryEvent build() {
            return new TelemetryEvent(id, deviceId, sentinelUserId, eventType, appVersion, operatingSystem, timestamp, durationMs, metadataJson);
        }
    }
}
