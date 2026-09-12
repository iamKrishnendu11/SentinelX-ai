package com.sentinel.desktop.repositories;

import com.sentinel.desktop.entities.Scan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ScanRepository extends JpaRepository<Scan, String> {
    List<Scan> findBySentinelUserIdAndProjectIdOrderByCreatedAtDesc(String sentinelUserId, String projectId);
    Optional<Scan> findBySentinelUserIdAndId(String sentinelUserId, String id);
    List<Scan> findBySentinelUserId(String sentinelUserId);
}
