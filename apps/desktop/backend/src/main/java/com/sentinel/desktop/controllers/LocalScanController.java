package com.sentinel.desktop.controllers;

import com.sentinel.desktop.entities.Scan;
import com.sentinel.desktop.entities.Vulnerability;
import com.sentinel.desktop.services.DesktopScanService;
import com.sentinel.desktop.services.DesktopUserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class LocalScanController {

    private final DesktopScanService scanService;
    private final DesktopUserService userService;

    public LocalScanController(DesktopScanService scanService, DesktopUserService userService) {
        this.scanService = scanService;
        this.userService = userService;
    }

    @GetMapping("/projects/{projectId}/scans")
    public ResponseEntity<List<Scan>> getScansForProject(@PathVariable("projectId") String projectId) {
        String activeUserId = userService.getActiveSentinelUserId();
        List<Scan> scans = scanService.getScansForProject(activeUserId, projectId);
        return ResponseEntity.ok(scans);
    }

    @GetMapping("/scans/{scanId}/vulnerabilities")
    public ResponseEntity<List<Vulnerability>> getVulnerabilitiesForScan(@PathVariable("scanId") String scanId) {
        String activeUserId = userService.getActiveSentinelUserId();
        List<Vulnerability> vulns = scanService.getVulnerabilitiesForScan(activeUserId, scanId);
        return ResponseEntity.ok(vulns);
    }
}
