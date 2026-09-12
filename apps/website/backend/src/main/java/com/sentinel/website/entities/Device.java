package com.sentinel.website.entities;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "devices", indexes = {
        @Index(name = "idx_device_sentinel_user", columnList = "sentinelUserId"),
        @Index(name = "idx_device_id", columnList = "deviceId", unique = true)
})
public class Device {

    @Id
    @Column(length = 36)
    private String id;

    @Column(nullable = false)
    private String sentinelUserId;

    @Column(nullable = false, unique = true)
    private String deviceId;

    private String deviceName;

    private String operatingSystem;

    private String appVersion;

    @Column(nullable = false, updatable = false)
    private Instant firstSeen;

    @Column(nullable = false)
    private Instant lastSeen;

    @Column(nullable = false)
    private String status;

    public Device() {}

    public Device(String id, String sentinelUserId, String deviceId, String deviceName, String operatingSystem, String appVersion, Instant firstSeen, Instant lastSeen, String status) {
        this.id = id;
        this.sentinelUserId = sentinelUserId;
        this.deviceId = deviceId;
        this.deviceName = deviceName;
        this.operatingSystem = operatingSystem;
        this.appVersion = appVersion;
        this.firstSeen = firstSeen;
        this.lastSeen = lastSeen;
        this.status = status;
    }

    @PrePersist
    protected void onCreate() {
        if (id == null || id.isBlank()) {
            id = java.util.UUID.randomUUID().toString();
        }
        Instant now = Instant.now();
        if (firstSeen == null) firstSeen = now;
        if (lastSeen == null) lastSeen = now;
        if (status == null) status = "ACTIVE";
    }

    @PreUpdate
    protected void onUpdate() {
        lastSeen = Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getSentinelUserId() { return sentinelUserId; }
    public void setSentinelUserId(String sentinelUserId) { this.sentinelUserId = sentinelUserId; }

    public String getDeviceId() { return deviceId; }
    public void setDeviceId(String deviceId) { this.deviceId = deviceId; }

    public String getDeviceName() { return deviceName; }
    public void setDeviceName(String deviceName) { this.deviceName = deviceName; }

    public String getOperatingSystem() { return operatingSystem; }
    public void setOperatingSystem(String operatingSystem) { this.operatingSystem = operatingSystem; }

    public String getAppVersion() { return appVersion; }
    public void setAppVersion(String appVersion) { this.appVersion = appVersion; }

    public Instant getFirstSeen() { return firstSeen; }
    public void setFirstSeen(Instant firstSeen) { this.firstSeen = firstSeen; }

    public Instant getLastSeen() { return lastSeen; }
    public void setLastSeen(Instant lastSeen) { this.lastSeen = lastSeen; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public static DeviceBuilder builder() {
        return new DeviceBuilder();
    }

    public static class DeviceBuilder {
        private String id;
        private String sentinelUserId;
        private String deviceId;
        private String deviceName;
        private String operatingSystem;
        private String appVersion;
        private Instant firstSeen;
        private Instant lastSeen;
        private String status = "ACTIVE";

        public DeviceBuilder id(String id) { this.id = id; return this; }
        public DeviceBuilder sentinelUserId(String sentinelUserId) { this.sentinelUserId = sentinelUserId; return this; }
        public DeviceBuilder deviceId(String deviceId) { this.deviceId = deviceId; return this; }
        public DeviceBuilder deviceName(String deviceName) { this.deviceName = deviceName; return this; }
        public DeviceBuilder operatingSystem(String operatingSystem) { this.operatingSystem = operatingSystem; return this; }
        public DeviceBuilder appVersion(String appVersion) { this.appVersion = appVersion; return this; }
        public DeviceBuilder firstSeen(Instant firstSeen) { this.firstSeen = firstSeen; return this; }
        public DeviceBuilder lastSeen(Instant lastSeen) { this.lastSeen = lastSeen; return this; }
        public DeviceBuilder status(String status) { this.status = status; return this; }

        public Device build() {
            return new Device(id, sentinelUserId, deviceId, deviceName, operatingSystem, appVersion, firstSeen, lastSeen, status);
        }
    }
}
