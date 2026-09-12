package com.sentinel.website.entities;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "email_verification_otps")
public class EmailVerificationOtp {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "otp_hash", nullable = false)
    private String otpHash;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @Column(nullable = false)
    private int attempts = 0;

    @Column(nullable = false)
    private boolean used = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public EmailVerificationOtp() {}

    public EmailVerificationOtp(UUID id, User user, String otpHash, Instant expiresAt, int attempts, boolean used, Instant createdAt) {
        this.id = id;
        this.user = user;
        this.otpHash = otpHash;
        this.expiresAt = expiresAt;
        this.attempts = attempts;
        this.used = used;
        this.createdAt = createdAt;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getOtpHash() { return otpHash; }
    public void setOtpHash(String otpHash) { this.otpHash = otpHash; }

    public Instant getExpiresAt() { return expiresAt; }
    public void setExpiresAt(Instant expiresAt) { this.expiresAt = expiresAt; }

    public int getAttempts() { return attempts; }
    public void setAttempts(int attempts) { this.attempts = attempts; }

    public boolean isUsed() { return used; }
    public void setUsed(boolean used) { this.used = used; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    // Builder
    public static EmailVerificationOtpBuilder builder() {
        return new EmailVerificationOtpBuilder();
    }

    public static class EmailVerificationOtpBuilder {
        private UUID id;
        private User user;
        private String otpHash;
        private Instant expiresAt;
        private int attempts = 0;
        private boolean used = false;
        private Instant createdAt;

        public EmailVerificationOtpBuilder id(UUID id) { this.id = id; return this; }
        public EmailVerificationOtpBuilder user(User user) { this.user = user; return this; }
        public EmailVerificationOtpBuilder otpHash(String otpHash) { this.otpHash = otpHash; return this; }
        public EmailVerificationOtpBuilder expiresAt(Instant expiresAt) { this.expiresAt = expiresAt; return this; }
        public EmailVerificationOtpBuilder attempts(int attempts) { this.attempts = attempts; return this; }
        public EmailVerificationOtpBuilder used(boolean used) { this.used = used; return this; }
        public EmailVerificationOtpBuilder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }

        public EmailVerificationOtp build() {
            return new EmailVerificationOtp(id, user, otpHash, expiresAt, attempts, used, createdAt);
        }
    }
}
