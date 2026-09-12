package com.sentinel.website.controllers;

import com.sentinel.website.entities.TelemetryEvent;
import com.sentinel.website.repositories.TelemetryEventRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api/telemetry")
public class TelemetryController {

    private final TelemetryEventRepository telemetryEventRepository;

    public TelemetryController(TelemetryEventRepository telemetryEventRepository) {
        this.telemetryEventRepository = telemetryEventRepository;
    }

    @PostMapping("/events")
    public ResponseEntity<Map<String, Object>> logTelemetryEvent(@Valid @RequestBody TelemetryEventRequest request) {
        // Enforce privacy rule: Reject any payload attempting to log sensitive keys
        if (request.getMetadataJson() != null) {
            String lower = request.getMetadataJson().toLowerCase();
            if (lower.contains("password") || lower.contains("token") || lower.contains("secret") || lower.contains("sourcecode")) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Sensitive metadata rejected."));
            }
        }

        TelemetryEvent event = TelemetryEvent.builder()
                .deviceId(request.getDeviceId())
                .sentinelUserId(request.getSentinelUserId())
                .eventType(request.getEventType())
                .appVersion(request.getAppVersion())
                .operatingSystem(request.getOperatingSystem())
                .durationMs(request.getDurationMs())
                .metadataJson(request.getMetadataJson())
                .timestamp(Instant.now())
                .build();

        telemetryEventRepository.save(event);
        return ResponseEntity.ok(Map.of("success", true));
    }

    public static class TelemetryEventRequest {
        @NotBlank(message = "eventType is required")
        private String eventType;

        private String deviceId;
        private String sentinelUserId;
        private String appVersion;
        private String operatingSystem;
        private Long durationMs;
        private String metadataJson;

        public String getEventType() { return eventType; }
        public void setEventType(String eventType) { this.eventType = eventType; }

        public String getDeviceId() { return deviceId; }
        public void setDeviceId(String deviceId) { this.deviceId = deviceId; }

        public String getSentinelUserId() { return sentinelUserId; }
        public void setSentinelUserId(String sentinelUserId) { this.sentinelUserId = sentinelUserId; }

        public String getAppVersion() { return appVersion; }
        public void setAppVersion(String appVersion) { this.appVersion = appVersion; }

        public String getOperatingSystem() { return operatingSystem; }
        public void setOperatingSystem(String operatingSystem) { this.operatingSystem = operatingSystem; }

        public Long getDurationMs() { return durationMs; }
        public void setDurationMs(Long durationMs) { this.durationMs = durationMs; }

        public String getMetadataJson() { return metadataJson; }
        public void setMetadataJson(String metadataJson) { this.metadataJson = metadataJson; }
    }
}

