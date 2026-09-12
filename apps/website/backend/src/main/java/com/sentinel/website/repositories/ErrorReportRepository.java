package com.sentinel.website.repositories;

import com.sentinel.website.entities.ErrorReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ErrorReportRepository extends JpaRepository<ErrorReport, String> {
    List<ErrorReport> findByDeviceId(String deviceId);
}
