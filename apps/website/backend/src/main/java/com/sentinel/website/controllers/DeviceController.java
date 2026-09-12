package com.sentinel.website.controllers;

import com.sentinel.website.entities.Device;
import com.sentinel.website.repositories.DeviceRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/devices")
public class DeviceController {

    private final DeviceRepository deviceRepository;

    public DeviceController(DeviceRepository deviceRepository) {
        this.deviceRepository = deviceRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> registerDevice(@Valid @RequestBody DeviceRegisterRequest request) {
        Optional<Device> existingOpt = deviceRepository.findByDeviceId(request.getDeviceId());
        Device device;

        if (existingOpt.isPresent()) {
            device = existingOpt.get();
            device.setDeviceName(request.getDeviceName());
            device.setOperatingSystem(request.getOperatingSystem());
            device.setAppVersion(request.getAppVersion());
            device.setSentinelUserId(request.getSentinelUserId());
            device.setLastSeen(Instant.now());
        } else {
            device = Device.builder()
                    .deviceId(request.getDeviceId())
                    .sentinelUserId(request.getSentinelUserId())
                    .deviceName(request.getDeviceName())
                    .operatingSystem(request.getOperatingSystem())
                    .appVersion(request.getAppVersion())
                    .firstSeen(Instant.now())
                    .lastSeen(Instant.now())
                    .status("ACTIVE")
                    .build();
        }

        Device saved = deviceRepository.save(device);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "deviceId", saved.getDeviceId(),
                "status", saved.getStatus()
        ));
    }

    @PostMapping("/heartbeat")
    public ResponseEntity<Map<String, Object>> heartbeat(@Valid @RequestBody DeviceHeartbeatRequest request) {
        Optional<Device> deviceOpt = deviceRepository.findByDeviceId(request.getDeviceId());
        if (deviceOpt.isPresent()) {
            Device device = deviceOpt.get();
            device.setLastSeen(Instant.now());
            deviceRepository.save(device);
            return ResponseEntity.ok(Map.of("success", true));
        }
        return ResponseEntity.notFound().build();
    }

    public static class DeviceRegisterRequest {
        @NotBlank(message = "deviceId is required")
        private String deviceId;

        @NotBlank(message = "sentinelUserId is required")
        private String sentinelUserId;

        private String deviceName;
        private String operatingSystem;
        private String appVersion;

        public String getDeviceId() { return deviceId; }
        public void setDeviceId(String deviceId) { this.deviceId = deviceId; }

        public String getSentinelUserId() { return sentinelUserId; }
        public void setSentinelUserId(String sentinelUserId) { this.sentinelUserId = sentinelUserId; }

        public String getDeviceName() { return deviceName; }
        public void setDeviceName(String deviceName) { this.deviceName = deviceName; }

        public String getOperatingSystem() { return operatingSystem; }
        public void setOperatingSystem(String operatingSystem) { this.operatingSystem = operatingSystem; }

        public String getAppVersion() { return appVersion; }
        public void setAppVersion(String appVersion) { this.appVersion = appVersion; }
    }

    public static class DeviceHeartbeatRequest {
        @NotBlank(message = "deviceId is required")
        private String deviceId;

        public String getDeviceId() { return deviceId; }
        public void setDeviceId(String deviceId) { this.deviceId = deviceId; }
    }
}

