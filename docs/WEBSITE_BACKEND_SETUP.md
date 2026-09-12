# Sentinel-X Website Backend & Neon PostgreSQL Setup Guide

This guide describes how to configure and run the Sentinel-X Website Spring Boot backend with **Neon PostgreSQL** (cloud database). Local Docker Desktop PostgreSQL is no longer required.

---

## Architecture Overview

### Local Development

```
Next.js Frontend (apps/website/frontend)
         ↓
Spring Boot Backend (apps/website/backend)
         ↓ (JDBC SSL Mode: require)
Neon PostgreSQL (Cloud DB)
```

### Production Deployment

```
Next.js Frontend (Vercel / Cloud)
         ↓
Spring Boot Backend (Render)
         ↓ (JDBC SSL Mode: require)
Neon PostgreSQL (Cloud DB)
```

---

## Prerequisites

1. **Java JDK 21**: Installed.
2. **Maven / `./mvnw`**: Bundled inside `apps/website/backend/`.
3. **Neon PostgreSQL Account & Database**: Created on [Neon.tech](https://neon.tech).

---

## Neon PostgreSQL Setup

1. **Create a Neon Database**:
   - Log in to your Neon dashboard.
   - Create a new project/database or use an existing one (e.g. `neondb`).
   - Copy the PostgreSQL connection parameters from the Neon Dashboard:
     - Host (e.g., `ep-xyz-123456.us-east-2.aws.neon.tech`)
     - Port (`5432`)
     - Database Name (e.g., `neondb`)
     - Username (e.g., `neondb_owner`)
     - Password (your secret password)

2. **Configure Environment Variables**:
   - Create or update `apps/website/backend/.env` with your Neon connection details:

   ```env
   # Neon PostgreSQL Connection
   DB_HOST=ep-xyz-123456.us-east-2.aws.neon.tech
   DB_PORT=5432
   DB_NAME=neondb
   DB_USERNAME=neondb_owner
   DB_PASSWORD=your_actual_neon_password
   DB_SSLMODE=require

   # Optional Hikari Connection Pool settings
   DB_POOL_MAX_SIZE=10
   DB_POOL_MIN_IDLE=2

   # JWT & Email configuration
   JWT_SECRET=sentinelx_default_jwt_secret_key_minimum_32_bytes_long_123456
   RESEND_API_KEY=your_resend_key
   RESEND_FROM_EMAIL=Sentinel-X <onboarding@resend.dev>
   ```

   > [!IMPORTANT]
   > Never commit `.env` or real database passwords to source control. `.env` is listed in `.gitignore`.

---

## Database Details & Environment Variables Summary

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `DB_HOST` | `localhost` | Neon database host domain |
| `DB_PORT` | `5432` | Database port |
| `DB_NAME` | `sentinelx_website_db` | Database name |
| `DB_USERNAME` | `sentinelx_user` | Database user |
| `DB_PASSWORD` | `sentinelx_pass` | Database password |
| `DB_SSLMODE` | `require` | PostgreSQL SSL Mode (Neon requires SSL) |
| `DB_POOL_MAX_SIZE` | `10` | Maximum Hikari connection pool size |
| `DB_POOL_MIN_IDLE` | `2` | Minimum idle connection count |

---

## Start Spring Boot Backend

Navigate to the backend application directory:

```powershell
cd apps/website/backend
```

Run the application using the Maven Wrapper:

```powershell
./mvnw spring-boot:run
```

Alternatively, build the package first:

```powershell
./mvnw clean package
java -jar target/website-0.0.1-SNAPSHOT.jar
```

The Spring Boot application will start on `http://localhost:8080`.

---

## Verify Database Connection & Health Endpoint

Once Spring Boot has started, verify database connectivity by making a GET request to the health endpoint:

```powershell
curl http://localhost:8080/api/health
```

### Expected Response (HTTP 200 OK):

```json
{
  "service": "Sentinel-X Website Backend",
  "status": "UP",
  "database": "CONNECTED",
  "timestamp": "2026-09-12T10:00:00Z"
}
```

---

## Database Schema Management

In development, `spring.jpa.hibernate.ddl-auto` is set to `update` to automatically create/update database tables in Neon PostgreSQL.

> [!NOTE]
> For production environments (e.g. Render), it is recommended to eventually use structured database migration tools such as Flyway or Liquibase instead of `ddl-auto: update`.
