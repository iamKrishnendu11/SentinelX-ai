# SentinelX AI - Website Deployment Guide

This guide covers deploying the **SentinelX AI Website**:
- **Backend (Spring Boot 3.3 / Java 21)**: Hosted on **Render**
- **Frontend (Next.js 16)**: Hosted on **Vercel**
- **Database**: PostgreSQL (Neon Cloud DB)

---

## Prerequisites
1. Push your repository to GitHub: `https://github.com/<your-username>/SentinelX-ai`
2. Accounts created on:
   - [Render](https://render.com)
   - [Vercel](https://vercel.com)

---

## Step 1: Deploy Backend to Render

### Option A: Using Render UI (Recommended)

1. Log into your [Render Dashboard](https://dashboard.render.com).
2. Click **New +** in the top right, then select **Web Service**.
3. Connect your GitHub repository (`SentinelX-ai`).
4. Fill in the service configuration:
   - **Name**: `sentinelx-backend`
   - **Region**: Select your closest region (e.g., *Singapore* or *US East*)
   - **Branch**: `main` (or your active branch)
   - **Root Directory**: `apps/website/backend`
   - **Runtime**: `Docker`
   - **Docker Command / Dockerfile Path**: `Dockerfile` (or `apps/website/backend/Dockerfile`)
   - **Instance Type**: `Free`
5. Expand **Advanced** -> **Health Check Path** and set it to:
   ```text
   /actuator/health
   ```
6. Add the following **Environment Variables**:

   | Key | Value / Instructions |
   | --- | --- |
   | `DB_HOST` | `ep-wispy-pond-b3kdnoy1-pooler.c-4.ap-southeast-1.aws.neon.tech` |
   | `DB_NAME` | `neondb` |
   | `DB_USERNAME` | `neondb_owner` |
   | `DB_PASSWORD` | `npg_FgXGok8zfa0U` *(or your Neon DB password)* |
   | `JWT_SECRET` | Generate a 32+ character random secret string |
   | `CORS_ALLOWED_ORIGINS` | `*` (or your Vercel URL once generated) |

7. Click **Create Web Service**.
8. Render will pull the code, execute the multi-stage Docker build, and start the service.
9. Copy your assigned Render URL (e.g. `https://sentinelx-backend.onrender.com`).

---

## Step 2: Deploy Frontend to Vercel

1. Log into your [Vercel Dashboard](https://vercel.com).
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository (`SentinelX-ai`).
4. In the **Configure Project** screen:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: Click *Edit* and select `apps/website/frontend`
5. Expand **Environment Variables** and add:

   | Key | Value |
   | --- | --- |
   | `NEXT_PUBLIC_API_URL` | `https://sentinelx-backend.onrender.com` *(Replace with your exact Render URL from Step 1)* |
   | `JWT_SECRET` | `<Same JWT Secret used in Render backend>` |
   | `RESEND_API_KEY` | `<Optional: Your Resend API Key for Email OTPs>` |

6. Click **Deploy**.
7. Vercel will build Next.js static pages and API routes and provide a live URL (e.g., `https://sentinelx-ai.vercel.app`).

---

## Step 3: Verification & Health Check

1. **Verify Backend Health**:
   Visit `https://<your-render-app>.onrender.com/actuator/health` in your browser.
   It should return:
   ```json
   {"status":"UP"}
   ```

2. **Verify Frontend & API Integration**:
   - Open your Vercel website URL.
   - Navigate to `/auth/register` or `/auth/login`.
   - Perform registration/login to confirm frontend communication with the Render backend and Neon PostgreSQL database.

---

## Summary of Files Created / Updated for Deployment

- [application.yml](file:///c:/Users/manda/OneDrive/Desktop/projects/SentinelX-ai/apps/website/backend/src/main/resources/application.yml): Configured dynamic `${PORT:8080}` port binding.
- [Dockerfile](file:///c:/Users/manda/OneDrive/Desktop/projects/SentinelX-ai/apps/website/backend/Dockerfile): Multi-stage Docker build for Java 21 Spring Boot.
- [render.yaml](file:///c:/Users/manda/OneDrive/Desktop/projects/SentinelX-ai/apps/website/backend/render.yaml): Render blueprint definition for 1-click deployment.
- [vercel.json](file:///c:/Users/manda/OneDrive/Desktop/projects/SentinelX-ai/apps/website/frontend/vercel.json): Vercel monorepo configuration for Next.js 16.
