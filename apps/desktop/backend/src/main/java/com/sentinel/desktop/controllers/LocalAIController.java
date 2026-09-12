package com.sentinel.desktop.controllers;

import com.sentinel.desktop.dto.LocalAIStatusResponse;
import com.sentinel.desktop.services.LocalAIEnvironmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/local-ai")
public class LocalAIController {

    private final LocalAIEnvironmentService aiEnvironmentService;

    public LocalAIController(LocalAIEnvironmentService aiEnvironmentService) {
        this.aiEnvironmentService = aiEnvironmentService;
    }

    @GetMapping("/status")
    public ResponseEntity<LocalAIStatusResponse> getAIStatus() {
        LocalAIStatusResponse status = aiEnvironmentService.checkEnvironment();
        return ResponseEntity.ok(status);
    }

    @PostMapping("/check")
    public ResponseEntity<LocalAIStatusResponse> recheckAIStatus() {
        LocalAIStatusResponse status = aiEnvironmentService.checkEnvironment();
        return ResponseEntity.ok(status);
    }
}
