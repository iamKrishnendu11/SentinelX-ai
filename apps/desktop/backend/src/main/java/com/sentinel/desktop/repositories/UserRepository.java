package com.sentinel.desktop.repositories;

import com.sentinel.desktop.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findBySentinelUserId(String sentinelUserId);
}
