package com.sentinel.website.repositories;

import com.sentinel.website.entities.EmailVerificationOtp;
import com.sentinel.website.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;
import java.util.UUID;

public interface EmailVerificationOtpRepository extends JpaRepository<EmailVerificationOtp, UUID> {

    Optional<EmailVerificationOtp> findTopByUserAndUsedFalseOrderByCreatedAtDesc(User user);

    @Modifying
    @Query("UPDATE EmailVerificationOtp e SET e.used = true WHERE e.user = :user AND e.used = false")
    void invalidateAllActiveOtpsForUser(@Param("user") User user);
}
