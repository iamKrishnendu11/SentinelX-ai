package com.sentinel.desktop.controllers;

import com.sentinel.desktop.services.DesktopUserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/session")
public class LocalSessionController {

    private final DesktopUserService userService;

    public LocalSessionController(DesktopUserService userService) {
        this.userService = userService;
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logoutSession() {
        userService.logoutCurrentSession();
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Desktop session ended. Sensitive credentials cleared from secure storage."
        ));
    }
}
