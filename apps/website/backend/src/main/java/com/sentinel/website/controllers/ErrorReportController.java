package com.sentinel.website.controllers;

import com.sentinel.website.entities.ErrorReport;
import com.sentinel.website.repositories.ErrorReportRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Map;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/errors")
public class ErrorReportController {

    private final ErrorReportRepository errorReportRepository;
    private static final Pattern SENSITIVE_TOKEN_PATTERN = Pattern.compile("(?i)(token|password|bearer|key|secret)=[^\\s&]+");

    public ErrorReportController(ErrorReportRepository errorReportRepository) {
        this.errorReportRepository = errorReportRepository;
    }

    @PostMapping("/report")
    public ResponseEntity<Map<String, Object>> reportError(@Valid @RequestBody ErrorReportRequest request) {
        String sanitizedMsg = sanitizeErrorMessage(request.getMessage());

        ErrorReport report = ErrorReport.builder()
                .deviceId(request.getDeviceId())
                .sentinelUserId(request.getSentinelUserId())
                .errorType(request.getErrorType() != null ? request.getErrorType() : "GenericError")
                .sanitizedMessage(sanitizedMsg)
                .appVersion(request.getAppVersion())
                .operatingSystem(request.getOperatingSystem())
                .timestamp(Instant.now())
                .build();

        errorReportRepository.save(report);
        return ResponseEntity.ok(Map.of("success", true));
    }

    private String sanitizeErrorMessage(String rawMessage) {
        if (rawMessage == null) return "Unknown Error";
        // Strip sensitive credentials/tokens matching patterns
        String sanitized = SENSITIVE_TOKEN_PATTERN.matcher(rawMessage).replaceAll("$1=[REDACTED]");
        if (sanitized.length() > 2000) {
            sanitized = sanitized.substring(0, 1997) + "...";
        }
        return sanitized;
    }

    public static class ErrorReportRequest {
        @NotBlank(message = "message is required")
        private String message;

        private String errorType;
        private String deviceId;
        private String sentinelUserId;
        private String appVersion;
        private String operatingSystem;

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }

        public String getErrorType() { return errorType; }
        public void setErrorType(String errorType) { this.errorType = errorType; }

        public String getDeviceId() { return deviceId; }
        public void setDeviceId(String deviceId) { this.deviceId = deviceId; }

        public String getSentinelUserId() { return sentinelUserId; }
        public void setSentinelUserId(String sentinelUserId) { this.sentinelUserId = sentinelUserId; }

        public String getAppVersion() { return appVersion; }
        public void setAppVersion(String appVersion) { this.appVersion = appVersion; }

        public String getOperatingSystem() { return operatingSystem; }
        public void setOperatingSystem(String operatingSystem) { this.operatingSystem = operatingSystem; }
    }
}

