package com.sentinel.desktop.services;

import com.sentinel.desktop.entities.User;
import com.sentinel.desktop.repositories.UserRepository;
import com.sentinel.desktop.security.SecureCredentialStore;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;

@Service
public class DesktopUserService {

    private final UserRepository userRepository;
    private final SecureCredentialStore credentialStore;

    private static final String KEY_ACTIVE_SENTINEL_USER_ID = "active_sentinel_user_id";

    public DesktopUserService(UserRepository userRepository, SecureCredentialStore credentialStore) {
        this.userRepository = userRepository;
        this.credentialStore = credentialStore;
    }

    @Transactional
    public User getOrCreateUser(String sentinelUserId, String name, String email, boolean emailVerified) {
        Optional<User> existingOpt = userRepository.findBySentinelUserId(sentinelUserId);
        if (existingOpt.isPresent()) {
            User user = existingOpt.get();
            user.setName(name);
            user.setEmail(email);
            user.setEmailVerified(emailVerified);
            user.setUpdatedAt(Instant.now());
            userRepository.save(user);
            setActiveSentinelUserId(sentinelUserId);
            return user;
        }

        User newUser = User.builder()
                .sentinelUserId(sentinelUserId)
                .name(name)
                .email(email)
                .emailVerified(emailVerified)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        User saved = userRepository.save(newUser);
        setActiveSentinelUserId(sentinelUserId);
        return saved;
    }

    public String getActiveSentinelUserId() {
        String activeId = credentialStore.getCredential(KEY_ACTIVE_SENTINEL_USER_ID);
        return (activeId != null && !activeId.isBlank()) ? activeId : "local_default_user";
    }

    public void setActiveSentinelUserId(String sentinelUserId) {
        credentialStore.saveCredential(KEY_ACTIVE_SENTINEL_USER_ID, sentinelUserId);
    }

    public Optional<User> getActiveUser() {
        String sentinelUserId = getActiveSentinelUserId();
        return userRepository.findBySentinelUserId(sentinelUserId);
    }

    @Transactional
    public void logoutCurrentSession() {
        // Clear sensitive tokens from secure credential store
        credentialStore.clearAll();
    }
}
