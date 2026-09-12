package com.sentinel.desktop;

import com.sentinel.desktop.entities.*;
import com.sentinel.desktop.repositories.*;
import com.sentinel.desktop.security.SecureCredentialStore;
import com.sentinel.desktop.services.DesktopGitHubService;
import com.sentinel.desktop.services.DesktopProjectService;
import com.sentinel.desktop.services.DesktopUserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class DesktopDatabaseArchitectureTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GitHubAccountRepository gitHubAccountRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ScanRepository scanRepository;

    @Autowired
    private VulnerabilityRepository vulnerabilityRepository;

    @Autowired
    private DesktopUserService userService;

    @Autowired
    private DesktopGitHubService gitHubService;

    @Autowired
    private DesktopProjectService projectService;

    @Autowired
    private SecureCredentialStore credentialStore;

    @BeforeEach
    void setUp() {
        vulnerabilityRepository.deleteAll();
        scanRepository.deleteAll();
        projectRepository.deleteAll();
        gitHubAccountRepository.deleteAll();
        userRepository.deleteAll();
        credentialStore.clearAll();
    }

    @Test
    @DisplayName("Test 1: SQLite starts successfully & user creation/persistence")
    void testUserCreationAndPersistence() {
        User user = userService.getOrCreateUser("user_100", "John Doe", "john@example.com", true);
        assertNotNull(user.getId());
        assertEquals("user_100", user.getSentinelUserId());

        Optional<User> fetched = userRepository.findBySentinelUserId("user_100");
        assertTrue(fetched.isPresent());
        assertEquals("John Doe", fetched.get().getName());
    }

    @Test
    @DisplayName("Test 2: Single active GitHub account constraint per user")
    void testSingleActiveGitHubAccountRule() {
        String sentinelUserId = "user_101";

        // Connect first GitHub account
        GitHubAccount accountA = gitHubService.connectGitHubAccount(
                sentinelUserId, "gh_111", "octocat", "Octo Cat", "octo@github.com", "http://avatar.a", "http://github.com/octocat", "gho_token_123"
        );
        assertTrue(accountA.isActive());

        // Connect second GitHub account (replaces first)
        GitHubAccount accountB = gitHubService.connectGitHubAccount(
                sentinelUserId, "gh_222", "monalisa", "Mona Lisa", "mona@github.com", "http://avatar.b", "http://github.com/monalisa", "gho_token_456"
        );
        assertTrue(accountB.isActive());

        // First account must be inactive
        Optional<GitHubAccount> refetchedA = gitHubAccountRepository.findById(accountA.getId());
        assertTrue(refetchedA.isPresent());
        assertFalse(refetchedA.get().isActive());

        // Exactly one active account returned
        Optional<GitHubAccount> activeOpt = gitHubService.getActiveGitHubAccount(sentinelUserId);
        assertTrue(activeOpt.isPresent());
        assertEquals("monalisa", activeOpt.get().getUsername());
    }

    @Test
    @DisplayName("Test 3: Project association and duplicate repository prevention")
    void testProjectAssociationAndDuplicatePrevention() {
        String sentinelUserId = "user_102";
        gitHubService.connectGitHubAccount(
                sentinelUserId, "gh_333", "devuser", "Dev User", "dev@example.com", "http://avatar", "http://profile", "token_789"
        );

        Project p1 = projectService.addProject(
                sentinelUserId, "repo_999", "sentinel-x", "devuser/sentinel-x", "devuser", "DevSecOps platform", true, "main", "http://github.com/devuser/sentinel-x", "C:/projects/sentinel-x"
        );
        assertNotNull(p1.getId());
        assertTrue(p1.isActive());

        // Adding duplicate repository ID updates existing project rather than creating a new record
        Project p2 = projectService.addProject(
                sentinelUserId, "repo_999", "sentinel-x-updated", "devuser/sentinel-x", "devuser", "Updated description", true, "main", "http://github.com/devuser/sentinel-x", "C:/projects/sentinel-x"
        );
        assertEquals(p1.getId(), p2.getId());

        List<Project> userProjects = projectService.getProjectsForUser(sentinelUserId);
        assertEquals(1, userProjects.size());
    }

    @Test
    @DisplayName("Test 4: Scan and Vulnerability relationships")
    void testScanAndVulnerabilityRelationships() {
        String sentinelUserId = "user_103";
        gitHubService.connectGitHubAccount(sentinelUserId, "gh_444", "tester", "Tester", "test@example.com", "", "", "token");
        Project project = projectService.addProject(sentinelUserId, "repo_888", "app", "tester/app", "tester", "", false, "main", "", "");

        Scan scan = Scan.builder()
                .project(project)
                .sentinelUserId(sentinelUserId)
                .status(ScanStatus.COMPLETED)
                .startedAt(Instant.now().minusSeconds(60))
                .completedAt(Instant.now())
                .build();
        Scan savedScan = scanRepository.save(scan);
        assertNotNull(savedScan.getId());

        Vulnerability vuln = Vulnerability.builder()
                .scan(savedScan)
                .sentinelUserId(sentinelUserId)
                .title("SQL Injection")
                .severity(VulnerabilitySeverity.HIGH)
                .description("Unsanitized query input")
                .filePath("src/main/java/DB.java")
                .lineNumber(42)
                .ruleId("SEC-001")
                .cwe("CWE-89")
                .tool("SAST-Engine")
                .status(VulnerabilityStatus.OPEN)
                .build();
        Vulnerability savedVuln = vulnerabilityRepository.save(vuln);

        assertEquals(savedScan.getId(), savedVuln.getScan().getId());
    }

    @Test
    @DisplayName("Test 5: User A vs User B strict data isolation")
    void testUserA_CannotAccess_UserB_Data() {
        // Setup User A
        String userA = "user_A";
        gitHubService.connectGitHubAccount(userA, "gh_A", "userA_gh", "User A", "a@test.com", "", "", "tok_A");
        projectService.addProject(userA, "repo_A", "project-A", "userA/project-A", "userA", "", false, "main", "", "");

        // Setup User B
        String userB = "user_B";
        gitHubService.connectGitHubAccount(userB, "gh_B", "userB_gh", "User B", "b@test.com", "", "", "tok_B");
        projectService.addProject(userB, "repo_B", "project-B", "userB/project-B", "userB", "", false, "main", "", "");

        // Query User A projects -> MUST NOT return User B projects
        List<Project> projectsA = projectService.getProjectsForUser(userA);
        assertEquals(1, projectsA.size());
        assertEquals("project-A", projectsA.get(0).getRepositoryName());

        // Query User B projects -> MUST NOT return User A projects
        List<Project> projectsB = projectService.getProjectsForUser(userB);
        assertEquals(1, projectsB.size());
        assertEquals("project-B", projectsB.get(0).getRepositoryName());
    }

    @Test
    @DisplayName("Test 6: Logout clears sensitive tokens and isolates workspace")
    void testLogoutClearsSensitiveTokens() {
        String sentinelUserId = "user_104";

        gitHubService.connectGitHubAccount(sentinelUserId, "gh_555", "logout_user", "Logout User", "log@test.com", "", "", "secret_access_token_123");
        credentialStore.saveCredential("sentinel_access_token_" + sentinelUserId, "sentinel_jwt_secret_456");

        // Verify tokens stored securely
        assertTrue(credentialStore.hasCredential("github_access_token_" + sentinelUserId));
        assertTrue(credentialStore.hasCredential("sentinel_access_token_" + sentinelUserId));

        // Execute logout
        userService.logoutCurrentSession();

        // Sensitive credentials MUST be cleared
        assertFalse(credentialStore.hasCredential("github_access_token_" + sentinelUserId));
        assertFalse(credentialStore.hasCredential("sentinel_access_token_" + sentinelUserId));
    }
}
