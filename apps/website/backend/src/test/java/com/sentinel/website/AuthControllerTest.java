package com.sentinel.website;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sentinel.website.configs.ResendEmailSender;
import com.sentinel.website.controllers.AuthController.*;
import com.sentinel.website.entities.EmailVerificationOtp;
import com.sentinel.website.entities.RefreshToken;
import com.sentinel.website.entities.User;
import com.sentinel.website.repositories.EmailVerificationOtpRepository;
import com.sentinel.website.repositories.RefreshTokenRepository;
import com.sentinel.website.repositories.UserRepository;
import com.sentinel.website.security.JwtTokenProvider;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailVerificationOtpRepository otpRepository;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @MockBean
    private com.sentinel.website.configs.EmailSender resendEmailSender;

    @BeforeEach
    void setUp() {
        when(resendEmailSender.sendOtpEmail(anyString(), anyString(), anyString())).thenReturn(true);
        otpRepository.deleteAll();
        refreshTokenRepository.deleteAll();
        userRepository.deleteAll();
    }

    // 1. Signup with valid data
    @Test
    @DisplayName("1. Signup with valid data creating unverified user")
    void test1_signupValidData() throws Exception {
        SignupRequest signup = new SignupRequest("Jane Doe", "jane@example.com", "password123");

        mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signup)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.email").value("jane@example.com"));

        Optional<User> userOpt = userRepository.findByEmail("jane@example.com");
        assertTrue(userOpt.isPresent());
        assertFalse(userOpt.get().isEmailVerified());
        assertEquals("Jane Doe", userOpt.get().getName());
    }

    // 2. Signup with invalid email
    @Test
    @DisplayName("2. Signup with invalid email fails validation")
    void test2_signupInvalidEmail() throws Exception {
        SignupRequest signup = new SignupRequest("Jane Doe", "invalid-email", "password123");

        mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signup)))
                .andExpect(status().isBadRequest());
    }

    // 3. Signup with duplicate verified email
    @Test
    @DisplayName("3. Signup with duplicate verified email returns 409 Conflict")
    void test3_signupDuplicateVerifiedEmail() throws Exception {
        User verifiedUser = User.builder()
                .name("Verified User")
                .email("verified@example.com")
                .password(passwordEncoder.encode("password123"))
                .emailVerified(true)
                .build();
        userRepository.save(verifiedUser);

        SignupRequest signup = new SignupRequest("Other User", "verified@example.com", "password123");

        mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signup)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.success").value(false));
    }

    // 4. Password is stored hashed
    @Test
    @DisplayName("4. Password is NEVER stored in plaintext")
    void test4_passwordStoredHashed() throws Exception {
        String plainPassword = "mySecretPassword123";
        SignupRequest signup = new SignupRequest("Plain Test", "plain@example.com", plainPassword);

        mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signup)))
                .andExpect(status().isCreated());

        User user = userRepository.findByEmail("plain@example.com").orElseThrow();
        assertNotEquals(plainPassword, user.getPassword());
        assertTrue(passwordEncoder.matches(plainPassword, user.getPassword()));
    }

    // 5. OTP generation
    @Test
    @DisplayName("5. OTP is generated and stored hashed")
    void test5_otpGeneration() throws Exception {
        SignupRequest signup = new SignupRequest("OTP Test", "otp@example.com", "password123");
        mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signup)))
                .andExpect(status().isCreated());

        User user = userRepository.findByEmail("otp@example.com").orElseThrow();
        Optional<EmailVerificationOtp> otpOpt = otpRepository.findTopByUserAndUsedFalseOrderByCreatedAtDesc(user);

        assertTrue(otpOpt.isPresent());
        assertNotNull(otpOpt.get().getOtpHash());
        assertFalse(otpOpt.get().isUsed());
    }

    // 6. OTP expiry
    @Test
    @DisplayName("6. Expired OTP fails verification")
    void test6_otpExpiry() throws Exception {
        User user = User.builder().name("Test").email("expired@example.com").password("pass").emailVerified(false).build();
        userRepository.save(user);

        String otpCode = "123456";
        EmailVerificationOtp expiredOtp = EmailVerificationOtp.builder()
                .user(user)
                .otpHash(JwtTokenProvider.hashToken(otpCode))
                .expiresAt(Instant.now().minus(Duration.ofMinutes(1)))
                .used(false)
                .build();
        otpRepository.save(expiredOtp);

        VerifyEmailRequest verify = new VerifyEmailRequest("expired@example.com", otpCode);
        mockMvc.perform(post("/api/auth/verify-email")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(verify)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Verification code has expired. Please request a new code."));
    }

    // 7. Invalid OTP
    @Test
    @DisplayName("7. Invalid OTP code fails verification")
    void test7_invalidOtp() throws Exception {
        User user = User.builder().name("Test").email("invalidotp@example.com").password("pass").emailVerified(false).build();
        userRepository.save(user);

        EmailVerificationOtp otp = EmailVerificationOtp.builder()
                .user(user)
                .otpHash(JwtTokenProvider.hashToken("123456"))
                .expiresAt(Instant.now().plus(Duration.ofMinutes(10)))
                .build();
        otpRepository.save(otp);

        VerifyEmailRequest verify = new VerifyEmailRequest("invalidotp@example.com", "999999");
        mockMvc.perform(post("/api/auth/verify-email")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(verify)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Invalid verification code."));
    }

    // 8. OTP attempt limit
    @Test
    @DisplayName("8. Exceeding 5 OTP attempts locks the OTP")
    void test8_otpAttemptLimit() throws Exception {
        User user = User.builder().name("Test").email("attempts@example.com").password("pass").emailVerified(false).build();
        userRepository.save(user);

        EmailVerificationOtp otp = EmailVerificationOtp.builder()
                .user(user)
                .otpHash(JwtTokenProvider.hashToken("123456"))
                .expiresAt(Instant.now().plus(Duration.ofMinutes(10)))
                .attempts(4)
                .build();
        otpRepository.save(otp);

        VerifyEmailRequest verify = new VerifyEmailRequest("attempts@example.com", "000000");
        mockMvc.perform(post("/api/auth/verify-email")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(verify)))
                .andExpect(status().isBadRequest());

        EmailVerificationOtp updatedOtp = otpRepository.findById(otp.getId()).orElseThrow();
        assertTrue(updatedOtp.isUsed() || updatedOtp.getAttempts() >= 5);
    }

    // 9. Successful email verification
    @Test
    @DisplayName("9. Valid OTP verifies email successfully")
    void test9_successfulEmailVerification() throws Exception {
        User user = User.builder().name("Test").email("success@example.com").password("pass").emailVerified(false).build();
        userRepository.save(user);

        String otpCode = "654321";
        EmailVerificationOtp otp = EmailVerificationOtp.builder()
                .user(user)
                .otpHash(JwtTokenProvider.hashToken(otpCode))
                .expiresAt(Instant.now().plus(Duration.ofMinutes(10)))
                .build();
        otpRepository.save(otp);

        VerifyEmailRequest verify = new VerifyEmailRequest("success@example.com", otpCode);
        mockMvc.perform(post("/api/auth/verify-email")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(verify)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        User updatedUser = userRepository.findByEmail("success@example.com").orElseThrow();
        assertTrue(updatedUser.isEmailVerified());
    }

    // 10. Login with correct credentials
    @Test
    @DisplayName("10. Verified user logs in successfully without OTP")
    void test10_loginCorrectCredentials() throws Exception {
        User user = User.builder()
                .name("Verified User")
                .email("login@example.com")
                .password(passwordEncoder.encode("correctPass"))
                .emailVerified(true)
                .build();
        userRepository.save(user);

        LoginRequest login = new LoginRequest("login@example.com", "correctPass");
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(cookie().exists("access_token"))
                .andExpect(cookie().exists("refresh_token"));
    }

    // 11. Login with incorrect password
    @Test
    @DisplayName("11. Incorrect password returns 401 Unauthorized")
    void test11_loginIncorrectPassword() throws Exception {
        User user = User.builder()
                .name("Test")
                .email("badpass@example.com")
                .password(passwordEncoder.encode("rightPassword"))
                .emailVerified(true)
                .build();
        userRepository.save(user);

        LoginRequest login = new LoginRequest("badpass@example.com", "wrongPassword");
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isUnauthorized());
    }

    // 12. Login before email verification
    @Test
    @DisplayName("12. Login fails if email is not verified")
    void test12_loginBeforeVerification() throws Exception {
        User unverifiedUser = User.builder()
                .name("Unverified")
                .email("unverified@example.com")
                .password(passwordEncoder.encode("password123"))
                .emailVerified(false)
                .build();
        userRepository.save(unverifiedUser);

        LoginRequest login = new LoginRequest("unverified@example.com", "password123");
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.emailVerified").value(false));
    }

    // 13. Refresh token
    @Test
    @DisplayName("13. Refresh token issues new access token")
    void test13_refreshToken() throws Exception {
        User user = User.builder()
                .name("Refresh User")
                .email("refresh@example.com")
                .password(passwordEncoder.encode("password123"))
                .emailVerified(true)
                .build();
        userRepository.save(user);

        String refreshRaw = UUID.randomUUID().toString();
        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .tokenHash(JwtTokenProvider.hashToken(refreshRaw))
                .expiresAt(Instant.now().plus(Duration.ofDays(7)))
                .build();
        refreshTokenRepository.save(refreshToken);

        mockMvc.perform(post("/api/auth/refresh")
                .cookie(new Cookie("refresh_token", refreshRaw)))
                .andExpect(status().isOk())
                .andExpect(cookie().exists("access_token"));
    }

    // 14. Logout
    @Test
    @DisplayName("14. Logout revokes refresh token and clears auth cookies")
    void test14_logout() throws Exception {
        User user = User.builder()
                .name("Logout User")
                .email("logout@example.com")
                .password(passwordEncoder.encode("password123"))
                .emailVerified(true)
                .build();
        userRepository.save(user);

        String refreshRaw = UUID.randomUUID().toString();
        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .tokenHash(JwtTokenProvider.hashToken(refreshRaw))
                .expiresAt(Instant.now().plus(Duration.ofDays(7)))
                .build();
        refreshTokenRepository.save(refreshToken);

        mockMvc.perform(post("/api/auth/logout")
                .cookie(new Cookie("refresh_token", refreshRaw)))
                .andExpect(status().isOk())
                .andExpect(cookie().maxAge("access_token", 0))
                .andExpect(cookie().maxAge("refresh_token", 0));

        RefreshToken updated = refreshTokenRepository.findById(refreshToken.getId()).orElseThrow();
        assertTrue(updated.isRevoked());
    }

    // 15. /api/auth/me with authenticated user
    @Test
    @DisplayName("15. /api/auth/me returns user profile when authenticated")
    void test15_meAuthenticated() throws Exception {
        User user = User.builder()
                .name("Auth User")
                .email("authme@example.com")
                .password(passwordEncoder.encode("password123"))
                .emailVerified(true)
                .build();
        userRepository.save(user);

        String accessToken = jwtTokenProvider.generateAccessToken(user);

        mockMvc.perform(get("/api/auth/me")
                .cookie(new Cookie("access_token", accessToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.authenticated").value(true))
                .andExpect(jsonPath("$.user.email").value("authme@example.com"));
    }

    // 16. /api/auth/me without authentication
    @Test
    @DisplayName("16. /api/auth/me returns authenticated: false when unauthenticated")
    void test16_meUnauthenticated() throws Exception {
        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.authenticated").value(false));
    }
}
