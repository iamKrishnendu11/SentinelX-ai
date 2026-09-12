package com.sentinel.website.repositories;

import com.sentinel.website.entities.GitHubMetadata;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GitHubMetadataRepository extends JpaRepository<GitHubMetadata, String> {
    Optional<GitHubMetadata> findBySentinelUserIdAndStatus(String sentinelUserId, String status);
    List<GitHubMetadata> findBySentinelUserId(String sentinelUserId);
}
