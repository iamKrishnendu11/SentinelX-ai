package com.sentinel.desktop.repositories;

import com.sentinel.desktop.entities.GitHubAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GitHubAccountRepository extends JpaRepository<GitHubAccount, String> {
    Optional<GitHubAccount> findBySentinelUserIdAndActiveTrue(String sentinelUserId);
    List<GitHubAccount> findBySentinelUserId(String sentinelUserId);
}
