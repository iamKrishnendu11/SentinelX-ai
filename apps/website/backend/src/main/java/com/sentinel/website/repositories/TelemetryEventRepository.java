package com.sentinel.website.repositories;

import com.sentinel.website.entities.TelemetryEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TelemetryEventRepository extends JpaRepository<TelemetryEvent, String> {
    List<TelemetryEvent> findBySentinelUserId(String sentinelUserId);
    List<TelemetryEvent> findByDeviceId(String deviceId);
}
