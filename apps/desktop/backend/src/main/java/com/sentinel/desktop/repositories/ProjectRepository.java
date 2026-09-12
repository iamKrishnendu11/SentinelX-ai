package com.sentinel.desktop.repositories;

import com.sentinel.desktop.entities.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, String> {
    List<Project> findBySentinelUserIdAndActiveTrue(String sentinelUserId);
    Optional<Project> findBySentinelUserIdAndId(String sentinelUserId, String id);
    Optional<Project> findBySentinelUserIdAndGithubRepositoryId(String sentinelUserId, String githubRepositoryId);
    List<Project> findBySentinelUserId(String sentinelUserId);
}
