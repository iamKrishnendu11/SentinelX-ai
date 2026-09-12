package com.sentinel.website.repositories;

import com.sentinel.website.entities.Device;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeviceRepository extends JpaRepository<Device, String> {
    Optional<Device> findByDeviceId(String deviceId);
    List<Device> findBySentinelUserId(String sentinelUserId);
}
