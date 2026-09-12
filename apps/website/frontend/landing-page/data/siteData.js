export const LOOP_STAGES = [
    {
        id: "code",
        name: "CODE",
        desc: "Your repository connects through GitHub. Every push, pull request and dependency change is ingested into the SentinelX pipeline in real time.",
        meta: ["TRIGGER: git push / pull_request", "INGEST: source + manifests", "SCOPE: full monorepo"],
    },
    {
        id: "understand",
        name: "UNDERSTAND",
        desc: "AI maps your application architecture, APIs, dependencies and attack surface.",
        meta: ["MODEL: architecture graph", "ROUTES MAPPED: 214", "DEPS TRACKED: 1,482"],
    },
    {
        id: "attack",
        name: "ATTACK",
        desc: "Red Team agents simulate controlled attacks inside an isolated environment.",
        meta: ["VECTORS: OWASP Top 10 +", "SANDBOX: digital twin", "PAYLOADS: 3,204 / run"],
    },
    {
        id: "verify",
        name: "VERIFY",
        desc: "Potential vulnerabilities are tested for real exploitability.",
        meta: ["FALSE POSITIVES: filtered", "PROOF: exploit replay", "CONFIDENCE: >= 85%"],
    },
    {
        id: "heal",
        name: "HEAL",
        desc: "AI generates and validates a secure patch.",
        meta: ["OUTPUT: code diff + PR", "REGRESSION: full suite", "REVIEW: human-in-loop"],
    },
    {
        id: "predict",
        name: "PREDICT",
        desc: "Security intelligence identifies emerging risks before deployment.",
        meta: ["FEEDS: CVE / KEV / dark web", "HORIZON: 30-day forecast", "ALERTS: pre-emptive"],
    },
];

export const AGENTS = [
    { id: "recon", name: "RECON AGENT", short: "RCN", role: "Maps attack surface", status: "ACTIVE", task: "Crawling 214 routes", target: "/api/*", risk: "LOW", confidence: 98, pos: { x: 50, y: 6 } },
    { id: "analysis", name: "ANALYSIS AGENT", short: "ANL", role: "Understands source code and architecture", status: "ACTIVE", task: "Parsing dependency graph", target: "src/services", risk: "MEDIUM", confidence: 93, pos: { x: 89, y: 28 } },
    { id: "red", name: "RED TEAM AGENT", short: "RED", role: "Simulates attacks", status: "ACTIVE", task: "Injecting auth bypass payloads", target: "/api/auth", risk: "HIGH", confidence: 87, pos: { x: 89, y: 72 } },
    { id: "blue", name: "BLUE TEAM AGENT", short: "BLU", role: "Analyzes defenses", status: "ACTIVE", task: "Monitoring WAF rules", target: "edge/firewall", risk: "MEDIUM", confidence: 91, pos: { x: 50, y: 94 } },
    { id: "patch", name: "PATCH AGENT", short: "PTC", role: "Generates remediation", status: "ACTIVE", task: "Drafting fix #128", target: "api/users.js", risk: "HIGH", confidence: 89, pos: { x: 11, y: 72 } },
    { id: "validation", name: "VALIDATION AGENT", short: "VLD", role: "Tests whether the fix actually works", status: "ACTIVE", task: "Re-running exploit suite", target: "twin/sandbox", risk: "LOW", confidence: 96, pos: { x: 11, y: 28 } },
];

export const BATTLE_SCRIPT = [
    { side: "red", text: "Detected weak authentication flow." },
    { side: "blue", text: "Authentication rule updated." },
    { side: "red", text: "Attempting bypass via token replay…" },
    { side: "blue", text: "Attack blocked. Signature mismatch flagged." },
    { side: "red", text: "Exploit unsuccessful." },
    { side: "blue", text: "Patch candidate generated for /api/auth." },
    { side: "red", text: "Fuzzing input validation on /api/upload…" },
    { side: "blue", text: "Anomalous payload quarantined." },
    { side: "red", text: "Probing rate limits on login endpoint…" },
    { side: "blue", text: "Adaptive throttling engaged." },
];

export const TREND_DATA = [
    { t: "W1", found: 31, fixed: 12 },
    { t: "W2", found: 26, fixed: 18 },
    { t: "W3", found: 34, fixed: 25 },
    { t: "W4", found: 22, fixed: 24 },
    { t: "W5", found: 18, fixed: 21 },
    { t: "W6", found: 15, fixed: 19 },
    { t: "W7", found: 11, fixed: 14 },
    { t: "W8", found: 8, fixed: 11 },
];

export const SURFACE_DATA = [
    { name: "APIs", v: 32 },
    { name: "Auth", v: 18 },
    { name: "Deps", v: 24 },
    { name: "Infra", v: 12 },
    { name: "Client", v: 14 },
];

export const RISK_DATA = [
    { name: "Critical", value: 2, color: "#FF5F56" },
    { name: "High", value: 5, color: "#FFB020" },
    { name: "Medium", value: 11, color: "#8B8F88" },
    { name: "Low", value: 8, color: "#B7FF00" },
];

export const AGENT_ACTIVITY = [
    { agent: "RED TEAM", msg: "Exploit verified on /api/auth", time: "12s ago" },
    { agent: "PATCH", msg: "Fix #128 pushed to twin", time: "48s ago" },
    { agent: "VALIDATION", msg: "Regression suite 148/148", time: "1m ago" },
    { agent: "RECON", msg: "3 new routes discovered", time: "4m ago" },
    { agent: "ANALYSIS", msg: "lodash@4.17.20 flagged", time: "9m ago" },
];

export const SECURITY_EVENTS = [
    { sev: "CRITICAL", text: "SQL Injection — api/users.js:42", time: "09:41:22" },
    { sev: "CRITICAL", text: "Broken auth — refresh token reuse", time: "09:38:07" },
    { sev: "HIGH", text: "Rate limit missing — /api/login", time: "09:31:54" },
    { sev: "HIGH", text: "SSRF candidate — webhook handler", time: "09:22:10" },
    { sev: "MEDIUM", text: "Verbose error leak — /api/orders", time: "09:15:33" },
];

export const PATCHES = [
    { id: "#128", name: "Parameterized query — users.js", pct: 100, state: "MERGED" },
    { id: "#129", name: "Rate limiter — auth routes", pct: 72, state: "TESTING" },
    { id: "#130", name: "Dependency bump — lodash", pct: 35, state: "GENERATING" },
];

export const DEVOPS_STEPS = [
    "Developer",
    "GitHub Push",
    "GitHub Actions",
    "SentinelX AI",
    "Digital Twin",
    "Security Tests",
    "AI Patch",
    "Pull Request",
    "Deployment",
];

export const TECH_STACK = [
    {
        cat: "FRONTEND",
        items: [
            { name: "Next.js", icon: "SiNextdotjs" },
            { name: "React", icon: "SiReact" },
            { name: "TypeScript", icon: "SiTypescript" },
            { name: "Tailwind CSS", icon: "SiTailwindcss" },
            { name: "shadcn/ui", icon: "SiShadcnui" },
            { name: "Recharts", icon: null },
        ],
    },
    {
        cat: "BACKEND",
        items: [
            { name: "Node.js", icon: "SiNodedotjs" },
            { name: "Express.js", icon: "SiExpress" },
            { name: "PostgreSQL", icon: "SiPostgresql" },
            { name: "Redis", icon: "SiRedis" },
            { name: "REST API", icon: null },
            { name: "WebSockets", icon: "SiSocketdotio" },
            { name: "JWT", icon: "SiJsonwebtokens" },
        ],
    },
    {
        cat: "AI / ML",
        items: [
            { name: "Ollama", icon: "SiOllama" },
            { name: "Llama 3.2", icon: "SiMeta" },
            { name: "FastAPI", icon: "SiFastapi" },
            { name: "Pydantic", icon: "SiPydantic" },
            { name: "Watchdog", icon: null },
            { name: "RAG", icon: null },
        ],
    },
    {
        cat: "SECURITY",
        items: [
            { name: "OWASP ZAP", icon: null },
            { name: "Semgrep", icon: "SiSemgrep" },
            { name: "Gitleaks", icon: null },
            { name: "Trivy", icon: null },
            { name: "Playwright", icon: "SiPlaywright" },
            { name: "Nmap", icon: null },
        ],
    },
    {
        cat: "DEVOPS",
        items: [
            { name: "Docker", icon: "SiDocker" },
            { name: "GitHub Actions", icon: "SiGithubactions" },
        ],
    },
];
