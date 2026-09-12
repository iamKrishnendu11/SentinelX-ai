package com.sentinel.desktop.services;

import com.sentinel.desktop.entities.Project;
import com.sentinel.desktop.entities.Scan;
import com.sentinel.desktop.entities.Vulnerability;
import com.sentinel.desktop.repositories.ProjectRepository;
import com.sentinel.desktop.repositories.ScanRepository;
import com.sentinel.desktop.repositories.VulnerabilityRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DesktopScanService {

    private final ScanRepository scanRepository;
    private final VulnerabilityRepository vulnerabilityRepository;
    private final ProjectRepository projectRepository;

    public DesktopScanService(
            ScanRepository scanRepository,
            VulnerabilityRepository vulnerabilityRepository,
            ProjectRepository projectRepository) {
        this.scanRepository = scanRepository;
        this.vulnerabilityRepository = vulnerabilityRepository;
        this.projectRepository = projectRepository;
    }

    public List<Scan> getScansForProject(String sentinelUserId, String projectId) {
        // Validate project ownership
        Optional<Project> projectOpt = projectRepository.findBySentinelUserIdAndId(sentinelUserId, projectId);
        if (projectOpt.isEmpty()) {
            return List.of();
        }
        return scanRepository.findBySentinelUserIdAndProjectIdOrderByCreatedAtDesc(sentinelUserId, projectId);
    }

    public List<Vulnerability> getVulnerabilitiesForScan(String sentinelUserId, String scanId) {
        // Validate scan ownership
        Optional<Scan> scanOpt = scanRepository.findBySentinelUserIdAndId(sentinelUserId, scanId);
        if (scanOpt.isEmpty()) {
            return List.of();
        }
        return vulnerabilityRepository.findBySentinelUserIdAndScanId(sentinelUserId, scanId);
    }
}
