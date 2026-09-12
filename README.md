# Sentinel-X

Sentinel-X Enterprise AI-powered DevSecOps & Security Platform.

## Repository Architecture

```
sentinel-x/
│
├── apps/
│   ├── website/             # Sentinel-X .com Next.js Frontend
│   └── desktop/             # Sentinel-X Desktop Application (Future)
│       ├── frontend/
│       ├── backend/
│       └── desktop-shell/
│
├── services/
│   └── ai-service/          # AI & LLM Core Services
│
├── security-engines/        # Automated Security Analysis Engines
│   ├── sast/
│   ├── dast/
│   ├── dependency-scanner/
│   ├── secret-scanner/
│   └── container-scanner/
│
├── shared/                  # Shared Schemas & Security Rules
│   ├── schemas/
│   ├── security-rules/
│   └── constants/
│
├── infrastructure/          # Deployment & Infra Configs
│   ├── docker/
│   ├── kubernetes/
│   ├── nginx/
│   └── database/
│
├── docs/                    # Architecture & API Documentation
│   ├── architecture/
│   ├── api/
│   ├── security/
│   └── development/
│
├── .github/
│   └── workflows/           # CI/CD Workflows
│
├── .gitignore
└── README.md
```

## Getting Started

### Website Frontend (`apps/website`)

```bash
cd apps/website
npm install
npm run dev
```
