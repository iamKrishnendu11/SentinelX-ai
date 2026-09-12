package com.sentinel.desktop;

import com.sentinel.desktop.dto.LocalAIStatusResponse;
import com.sentinel.desktop.services.LocalAIEnvironmentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestOperations;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

public class LocalAIEnvironmentServiceTest {

    private RestOperations restTemplate;
    private LocalAIEnvironmentService aiEnvironmentService;
    private static final String MOCK_OLLAMA_URL = "http://localhost:11434";

    @BeforeEach
    void setUp() {
        restTemplate = mock(RestOperations.class);
        aiEnvironmentService = new LocalAIEnvironmentService(restTemplate, MOCK_OLLAMA_URL);
    }

    @Test
    @DisplayName("1. Ollama unavailable - returns ready=false")
    void testOllamaUnavailable() {
        when(restTemplate.getForEntity(eq(MOCK_OLLAMA_URL + "/api/tags"), eq(Map.class)))
                .thenThrow(new ResourceAccessException("Connection refused"));

        LocalAIStatusResponse status = aiEnvironmentService.checkEnvironment();

        assertFalse(status.isOllamaRunning());
        assertFalse(status.isQwenInstalled());
        assertFalse(status.isQwenUsable());
        assertFalse(status.isReady());
        assertNotNull(status.getMessage());
    }

    @Test
    @DisplayName("2. Ollama available but Qwen missing - returns ready=false")
    void testOllamaAvailableQwenMissing() {
        Map<String, Object> tagsResponse = Map.of(
                "models", List.of(
                        Map.of("name", "llama3:latest", "model", "llama3:latest")
                )
        );

        when(restTemplate.getForEntity(eq(MOCK_OLLAMA_URL + "/api/tags"), eq(Map.class)))
                .thenReturn(new ResponseEntity<>(tagsResponse, HttpStatus.OK));

        LocalAIStatusResponse status = aiEnvironmentService.checkEnvironment();

        assertTrue(status.isOllamaRunning());
        assertFalse(status.isQwenInstalled());
        assertFalse(status.isQwenUsable());
        assertFalse(status.isReady());
        assertTrue(status.getMessage().contains("qwen2.5-coder:7b is missing"));
    }

    @Test
    @DisplayName("3. Qwen installed and usable - returns ready=true")
    void testQwenInstalledAndUsable() {
        Map<String, Object> tagsResponse = Map.of(
                "models", List.of(
                        Map.of("name", "qwen2.5-coder:7b", "model", "qwen2.5-coder:7b")
                )
        );

        Map<String, Object> generateResponse = Map.of("response", "SENTINEL_X_READY");

        when(restTemplate.getForEntity(eq(MOCK_OLLAMA_URL + "/api/tags"), eq(Map.class)))
                .thenReturn(new ResponseEntity<>(tagsResponse, HttpStatus.OK));

        when(restTemplate.postForEntity(eq(MOCK_OLLAMA_URL + "/api/generate"), any(HttpEntity.class), eq(Map.class)))
                .thenReturn(new ResponseEntity<>(generateResponse, HttpStatus.OK));

        LocalAIStatusResponse status = aiEnvironmentService.checkEnvironment();

        assertTrue(status.isOllamaRunning());
        assertTrue(status.isQwenInstalled());
        assertTrue(status.isQwenUsable());
        assertTrue(status.isReady());
    }

    @Test
    @DisplayName("4. Qwen installed but unusable - returns ready=false")
    void testQwenInstalledButUnusable() {
        Map<String, Object> tagsResponse = Map.of(
                "models", List.of(
                        Map.of("name", "qwen2.5-coder:7b", "model", "qwen2.5-coder:7b")
                )
        );

        when(restTemplate.getForEntity(eq(MOCK_OLLAMA_URL + "/api/tags"), eq(Map.class)))
                .thenReturn(new ResponseEntity<>(tagsResponse, HttpStatus.OK));

        when(restTemplate.postForEntity(eq(MOCK_OLLAMA_URL + "/api/generate"), any(HttpEntity.class), eq(Map.class)))
                .thenThrow(new ResourceAccessException("Timeout generating response"));

        LocalAIStatusResponse status = aiEnvironmentService.checkEnvironment();

        assertTrue(status.isOllamaRunning());
        assertTrue(status.isQwenInstalled());
        assertFalse(status.isQwenUsable());
        assertFalse(status.isReady());
    }

    @Test
    @DisplayName("5. Correct ready=true logic evaluation")
    void testReadyLogicEvaluation() {
        Map<String, Object> tagsResponse = Map.of(
                "models", List.of(
                        Map.of("name", "qwen2.5-coder:7b-instruct", "model", "qwen2.5-coder:7b-instruct")
                )
        );

        Map<String, Object> generateResponse = Map.of("response", "SENTINEL_X_READY");

        when(restTemplate.getForEntity(eq(MOCK_OLLAMA_URL + "/api/tags"), eq(Map.class)))
                .thenReturn(new ResponseEntity<>(tagsResponse, HttpStatus.OK));

        when(restTemplate.postForEntity(eq(MOCK_OLLAMA_URL + "/api/generate"), any(HttpEntity.class), eq(Map.class)))
                .thenReturn(new ResponseEntity<>(generateResponse, HttpStatus.OK));

        LocalAIStatusResponse status = aiEnvironmentService.checkEnvironment();
        assertTrue(status.isReady(), "Should recognize qwen2.5-coder variant and mark ready=true");
    }

    @Test
    @DisplayName("6. Failed state does not permanently cache")
    void testFailedStateNotCached() {
        // First check: Ollama offline
        when(restTemplate.getForEntity(eq(MOCK_OLLAMA_URL + "/api/tags"), eq(Map.class)))
                .thenThrow(new ResourceAccessException("Offline"));

        LocalAIStatusResponse status1 = aiEnvironmentService.checkEnvironment();
        assertFalse(status1.isReady());

        // Second check: Environment recovers
        Map<String, Object> tagsResponse = Map.of(
                "models", List.of(Map.of("name", "qwen2.5-coder:7b"))
        );
        Map<String, Object> generateResponse = Map.of("response", "SENTINEL_X_READY");

        when(restTemplate.getForEntity(eq(MOCK_OLLAMA_URL + "/api/tags"), eq(Map.class)))
                .thenReturn(new ResponseEntity<>(tagsResponse, HttpStatus.OK));

        when(restTemplate.postForEntity(eq(MOCK_OLLAMA_URL + "/api/generate"), any(HttpEntity.class), eq(Map.class)))
                .thenReturn(new ResponseEntity<>(generateResponse, HttpStatus.OK));

        LocalAIStatusResponse status2 = aiEnvironmentService.checkEnvironment();
        assertTrue(status2.isReady(), "Fresh check must re-evaluate status dynamically");
    }

    @Test
    @DisplayName("7. Privacy: Source code is never sent to cloud during environment check")
    void testPrivacySourceCodeNeverSentToCloud() {
        Map<String, Object> tagsResponse = Map.of(
                "models", List.of(Map.of("name", "qwen2.5-coder:7b"))
        );
        Map<String, Object> generateResponse = Map.of("response", "SENTINEL_X_READY");

        when(restTemplate.getForEntity(eq(MOCK_OLLAMA_URL + "/api/tags"), eq(Map.class)))
                .thenReturn(new ResponseEntity<>(tagsResponse, HttpStatus.OK));
        when(restTemplate.postForEntity(eq(MOCK_OLLAMA_URL + "/api/generate"), any(HttpEntity.class), eq(Map.class)))
                .thenReturn(new ResponseEntity<>(generateResponse, HttpStatus.OK));

        aiEnvironmentService.checkEnvironment();

        // Verify calls only went to local Ollama URL (http://localhost:11434)
        verify(restTemplate, atLeastOnce()).getForEntity(startsWith(MOCK_OLLAMA_URL), eq(Map.class));
        verify(restTemplate, never()).getForEntity(argThat(url -> url != null && !url.toString().startsWith(MOCK_OLLAMA_URL)), any());
        verify(restTemplate, never()).postForEntity(argThat(url -> url != null && !url.toString().startsWith(MOCK_OLLAMA_URL)), any(), any());
    }
}
