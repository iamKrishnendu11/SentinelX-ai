package com.sentinel.website.controllers;

import com.sentinel.website.configs.ResendEmailSender;
import com.sentinel.website.entities.EmailVerificationOtp;
import com.sentinel.website.entities.RefreshToken;
import com.sentinel.website.entities.User;
import com.sentinel.website.repositories.EmailVerificationOtpRepository;
import com.sentinel.website.repositories.RefreshTokenRepository;
import com.sentinel.website.repositories.UserRepository;
import com.sentinel.website.security.JwtTokenProvider;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final EmailVerificationOtpRepository otpRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final com.sentinel.website.configs.EmailSender emailSender;

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();
    private static final int OTP_EXPIRED_MINUTES = 10;
    private static final int OTP_MAX_ATTEMPTS = 5;
    private static final int RESEND_COOLDOWN_SECONDS = 60;

    public AuthController(
            UserRepository userRepository,
            EmailVerificationOtpRepository otpRepository,
            RefreshTokenRepository refreshTokenRepository,
            PasswordEncoder passwordEncoder,
            JwtTokenProvider jwtTokenProvider,
            com.sentinel.website.configs.EmailSender emailSender) {
        this.userRepository = userRepository;
        this.otpRepository = otpRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.emailSender = emailSender;
    }

    // ----------------------------------------------------
    // SIGNUP
    // ----------------------------------------------------
    @PostMapping("/signup")
    @Transactional
    public ResponseEntity<Map<String, Object>> signup(@Valid @RequestBody SignupRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();
        String trimmedName = request.getName().trim();

        Optional<User> existingUserOpt = userRepository.findByEmail(normalizedEmail);

        if (existingUserOpt.isPresent()) {
            User existingUser = existingUserOpt.get();
            if (existingUser.isEmailVerified()) {
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("message", "Email is already registered. Please login.");
                return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
            } else {
                // User exists but not verified -> Update name & password, trigger new OTP
                existingUser.setName(trimmedName);
                existingUser.setPassword(passwordEncoder.encode(request.getPassword()));
                userRepository.save(existingUser);

                generateAndSendOtp(existingUser);

                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Account created. Verification code sent to your email.");
                response.put("email", normalizedEmail);
                return ResponseEntity.ok(response);
            }
        }

        // Create new unverified user
        User newUser = User.builder()
                .name(trimmedName)
                .email(normalizedEmail)
                .password(passwordEncoder.encode(request.getPassword()))
                .emailVerified(false)
                .build();

        User savedUser = userRepository.save(newUser);
        generateAndSendOtp(savedUser);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Account created. Verification code sent to your email.");
        response.put("email", normalizedEmail);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ----------------------------------------------------
    // VERIFY EMAIL
    // ----------------------------------------------------
    @PostMapping("/verify-email")
    @Transactional
    public ResponseEntity<Map<String, Object>> verifyEmail(@Valid @RequestBody VerifyEmailRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();
        String submittedOtp = request.getOtp().trim();

        Optional<User> userOpt = userRepository.findByEmail(normalizedEmail);
        if (userOpt.isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "User not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        User user = userOpt.get();
        if (user.isEmailVerified()) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Email is already verified.");
            return ResponseEntity.ok(response);
        }

        Optional<EmailVerificationOtp> otpOpt = otpRepository.findTopByUserAndUsedFalseOrderByCreatedAtDesc(user);
        if (otpOpt.isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "No active verification code found. Please request a new code.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        EmailVerificationOtp otpEntity = otpOpt.get();

        // Check expiry
        if (Instant.now().isAfter(otpEntity.getExpiresAt())) {
            otpEntity.setUsed(true);
            otpRepository.save(otpEntity);

            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Verification code has expired. Please request a new code.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        // Check attempts limit
        if (otpEntity.getAttempts() >= OTP_MAX_ATTEMPTS) {
            otpEntity.setUsed(true);
            otpRepository.save(otpEntity);

            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Maximum verification attempts exceeded. Please request a new code.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        // Verify OTP hash
        String submittedOtpHash = JwtTokenProvider.hashToken(submittedOtp);
        if (!otpEntity.getOtpHash().equals(submittedOtpHash)) {
            otpEntity.setAttempts(otpEntity.getAttempts() + 1);
            if (otpEntity.getAttempts() >= OTP_MAX_ATTEMPTS) {
                otpEntity.setUsed(true);
            }
            otpRepository.save(otpEntity);

            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Invalid verification code.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        // OTP is valid!
        otpEntity.setUsed(true);
        otpRepository.save(otpEntity);

        user.setEmailVerified(true);
        userRepository.save(user);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Email verified successfully. You can now log in.");
        return ResponseEntity.ok(response);
    }

    // ----------------------------------------------------
    // RESEND OTP
    // ----------------------------------------------------
    @PostMapping("/resend-otp")
    @Transactional
    public ResponseEntity<Map<String, Object>> resendOtp(@Valid @RequestBody ResendOtpRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        Optional<User> userOpt = userRepository.findByEmail(normalizedEmail);
        if (userOpt.isEmpty()) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "If an unverified account exists, a new verification code was sent.");
            return ResponseEntity.ok(response);
        }

        User user = userOpt.get();
        if (user.isEmailVerified()) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Email is already verified.");
            return ResponseEntity.ok(response);
        }

        // Check rate limiting / cooldown
        Optional<EmailVerificationOtp> latestOtp = otpRepository.findTopByUserAndUsedFalseOrderByCreatedAtDesc(user);
        if (latestOtp.isPresent()) {
            Instant createdAt = latestOtp.get().getCreatedAt();
            long secondsSince = Duration.between(createdAt, Instant.now()).getSeconds();
            if (secondsSince < RESEND_COOLDOWN_SECONDS) {
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("message", "Please wait " + (RESEND_COOLDOWN_SECONDS - secondsSince) + " seconds before requesting a new code.");
                return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(error);
            }
        }

        generateAndSendOtp(user);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Verification code resent.");
        return ResponseEntity.ok(response);
    }

    // ----------------------------------------------------
    // LOGIN (No OTP required)
    // ----------------------------------------------------
    @PostMapping("/login")
    @Transactional
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginRequest request, HttpServletResponse response) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        Optional<User> userOpt = userRepository.findByEmail(normalizedEmail);
        if (userOpt.isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Invalid email or password.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        User user = userOpt.get();

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Invalid email or password.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        // Check email verification
        if (!user.isEmailVerified()) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("emailVerified", false);
            error.put("message", "Please verify your email before logging in.");
            error.put("email", normalizedEmail);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
        }

        // Generate Access Token & Refresh Token
        String accessToken = jwtTokenProvider.generateAccessToken(user);
        String refreshTokenRaw = UUID.randomUUID().toString();
        String refreshTokenHash = JwtTokenProvider.hashToken(refreshTokenRaw);

        // Revoke existing refresh tokens
        refreshTokenRepository.revokeAllUserTokens(user);

        // Save new refresh token
        RefreshToken refreshTokenEntity = RefreshToken.builder()
                .user(user)
                .tokenHash(refreshTokenHash)
                .expiresAt(Instant.now().plus(Duration.ofDays(7)))
                .build();
        refreshTokenRepository.save(refreshTokenEntity);

        // Set HttpOnly Cookies
        setAuthCookies(response, accessToken, refreshTokenRaw);

        Map<String, Object> body = new HashMap<>();
        body.put("success", true);
        body.put("user", Map.of(
                "id", user.getId().toString(),
                "name", user.getName(),
                "email", user.getEmail(),
                "emailVerified", user.isEmailVerified()
        ));
        return ResponseEntity.ok(body);
    }

    // ----------------------------------------------------
    // REFRESH TOKEN
    // ----------------------------------------------------
    @PostMapping("/refresh")
    @Transactional
    public ResponseEntity<Map<String, Object>> refresh(HttpServletRequest request, HttpServletResponse response) {
        String refreshTokenRaw = extractCookieValue(request, "refresh_token");

        if (refreshTokenRaw == null) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Refresh token missing.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        String tokenHash = JwtTokenProvider.hashToken(refreshTokenRaw);
        Optional<RefreshToken> tokenOpt = refreshTokenRepository.findByTokenHash(tokenHash);

        if (tokenOpt.isEmpty() || tokenOpt.get().isRevoked() || Instant.now().isAfter(tokenOpt.get().getExpiresAt())) {
            clearAuthCookies(response);
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Invalid or expired refresh token.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        User user = tokenOpt.get().getUser();
        String newAccessToken = jwtTokenProvider.generateAccessToken(user);

        // Update cookie
        ResponseCookie accessCookie = ResponseCookie.from("access_token", newAccessToken)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(Duration.ofMinutes(15))
                .sameSite("Lax")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());

        Map<String, Object> body = new HashMap<>();
        body.put("success", true);
        body.put("user", Map.of(
                "id", user.getId().toString(),
                "name", user.getName(),
                "email", user.getEmail(),
                "emailVerified", user.isEmailVerified()
        ));
        return ResponseEntity.ok(body);
    }

    // ----------------------------------------------------
    // LOGOUT
    // ----------------------------------------------------
    @PostMapping("/logout")
    @Transactional
    public ResponseEntity<Map<String, Object>> logout(HttpServletRequest request, HttpServletResponse response) {
        String refreshTokenRaw = extractCookieValue(request, "refresh_token");
        if (refreshTokenRaw != null) {
            String tokenHash = JwtTokenProvider.hashToken(refreshTokenRaw);
            refreshTokenRepository.findByTokenHash(tokenHash).ifPresent(t -> {
                t.setRevoked(true);
                refreshTokenRepository.save(t);
            });
        }

        clearAuthCookies(response);

        Map<String, Object> body = new HashMap<>();
        body.put("success", true);
        body.put("message", "Logged out successfully.");
        return ResponseEntity.ok(body);
    }

    // ----------------------------------------------------
    // CURRENT USER
    // ----------------------------------------------------
    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser(@AuthenticationPrincipal User user) {
        if (user == null) {
            Map<String, Object> response = new HashMap<>();
            response.put("authenticated", false);
            return ResponseEntity.ok(response);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("authenticated", true);
        response.put("user", Map.of(
                "id", user.getId().toString(),
                "name", user.getName(),
                "email", user.getEmail(),
                "emailVerified", user.isEmailVerified()
        ));
        return ResponseEntity.ok(response);
    }

    // ----------------------------------------------------
    // HELPER METHODS
    // ----------------------------------------------------
    private void generateAndSendOtp(User user) {
        otpRepository.invalidateAllActiveOtpsForUser(user);

        int otpInt = 100000 + SECURE_RANDOM.nextInt(900000);
        String otpStr = String.valueOf(otpInt);
        String otpHash = JwtTokenProvider.hashToken(otpStr);

        EmailVerificationOtp otpEntity = EmailVerificationOtp.builder()
                .user(user)
                .otpHash(otpHash)
                .expiresAt(Instant.now().plus(Duration.ofMinutes(OTP_EXPIRED_MINUTES)))
                .build();
        otpRepository.save(otpEntity);

        emailSender.sendOtpEmail(user.getName(), user.getEmail(), otpStr);
    }

    private void setAuthCookies(HttpServletResponse response, String accessToken, String refreshToken) {
        ResponseCookie accessCookie = ResponseCookie.from("access_token", accessToken)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(Duration.ofMinutes(15))
                .sameSite("Lax")
                .build();

        ResponseCookie refreshCookie = ResponseCookie.from("refresh_token", refreshToken)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(Duration.ofDays(7))
                .sameSite("Lax")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());
    }

    private void clearAuthCookies(HttpServletResponse response) {
        ResponseCookie accessCookie = ResponseCookie.from("access_token", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();

        ResponseCookie refreshCookie = ResponseCookie.from("refresh_token", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());
    }

    private String extractCookieValue(HttpServletRequest request, String name) {
        if (request.getCookies() == null) return null;
        for (Cookie c : request.getCookies()) {
            if (name.equals(c.getName())) {
                return c.getValue();
            }
        }
        return null;
    }

    // ----------------------------------------------------
    // REQUEST DTO CLASSES
    // ----------------------------------------------------
    public static class SignupRequest {
        @NotBlank(message = "Name is required")
        private String name;

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;

        @NotBlank(message = "Password is required")
        @Size(min = 6, message = "Password must be at least 6 characters")
        private String password;

        public SignupRequest() {}
        public SignupRequest(String name, String email, String password) {
            this.name = name;
            this.email = email;
            this.password = password;
        }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class VerifyEmailRequest {
        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;

        @NotBlank(message = "OTP is required")
        @Size(min = 6, max = 6, message = "OTP must be 6 digits")
        private String otp;

        public VerifyEmailRequest() {}
        public VerifyEmailRequest(String email, String otp) {
            this.email = email;
            this.otp = otp;
        }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getOtp() { return otp; }
        public void setOtp(String otp) { this.otp = otp; }
    }

    public static class ResendOtpRequest {
        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;

        public ResendOtpRequest() {}
        public ResendOtpRequest(String email) {
            this.email = email;
        }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }

    public static class LoginRequest {
        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;

        @NotBlank(message = "Password is required")
        private String password;

        public LoginRequest() {}
        public LoginRequest(String email, String password) {
            this.email = email;
            this.password = password;
        }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}
