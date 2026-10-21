# MYSafety

MYSafety is a community safety reporting application for Malaysia. Users submit incident reports, view published incidents near their surroundings, and access an AI support chatbot. The interface supports Bahasa Melayu (BM) and English.

## Features

- **Report submission:** incident category, map location, estimated radius, date, time, description and one evidence photo.
- **Automatic review:** a database queue and Python worker run source searches and AI assessment after submission.
- **Incident dashboard:** published cards, category filters, pagination, approximate distances and detailed views.
- **Privacy-conscious display:** public summaries and approximate locations instead of raw reports and precise private coordinates.
- **Support chatbot:** conversational guidance and emotional support; currently enabled through a development-demo flag.
- **Bilingual interface:** translated labels and localized dates. Public descriptions currently retain their saved language.

Supported incident categories: assault, robbery, rape, murder and sexual harassment.

## Technology

| Layer | Tools |
|---|---|
| Frontend | React, Vite, CSS, Lucide, React Markdown |
| Backend | Python, Flask, Flask-CORS |
| Database and storage | Supabase PostgreSQL and Storage |
| AI | Google Gemini API |
| Source discovery | Serper API |
| Maps and place lookup | Leaflet, OpenStreetMap, Nominatim |

## Project structure

```text
Backend/
  app.py
  database.py
  validation_worker.py
  requirements.txt
  routes/                 # HTTP endpoints
  services/               # Reporting, review, display and chatbot logic
Frontend/
  package.json
  src/
    App.jsx
    Dashboard.jsx
    IncidentDetails.jsx
    ReportIncident.jsx
    AIChat.jsx
    translations.js
```

## Local setup

### Requirements

- Python 3.12, matching the current development environment.
- Node.js 20.19+ (20.x) or 22.12+, with npm.
- A Supabase project, Gemini API key and Serper API key.

Run commands from the repository root unless stated otherwise. The activation commands below use Windows PowerShell.

### 1. Install dependencies

```powershell
cd Backend
python -m venv venv
.\venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

In another terminal:

```powershell
cd Frontend
npm install
```

### 2. Configure environment variables

Create `Backend/.env`:

```dotenv
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_KEY=YOUR_BACKEND_SUPABASE_SECRET_KEY
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
GEMINI_MODEL=gemini-3.8-flash
SERPER_API_KEY=YOUR_SERPER_API_KEY
VALIDATION_API_TOKEN=YOUR_RANDOM_SECRET_TOKEN
CHATBOT_MODEL=gemini-3.8-flash
CHATBOT_DEMO_ENABLED=false
```

Set `CHATBOT_DEMO_ENABLED=true` only for fictional development tests. Choose models available to your Gemini project.

Optionally create `Frontend/.env`:

```dotenv
VITE_API_BASE_URL=http://127.0.0.1:5001
```

Keep backend secrets out of Git and frontend variables. Restart Flask/worker after backend configuration changes, and Vite after frontend environment changes.

### 3. Provision Supabase

Apply the project's database SQL in Supabase SQL Editor. Dependency installation does not create the database objects.

| Object | Purpose |
|---|---|
| `incidents` | Original reports and submission status |
| `incident_private_locations` | Precise reported locations |
| `published_incidents` | Prepared public records |
| `incident_validation_jobs` | Durable review queue and outcomes |
| `incident_evidence` storage bucket | Private report photos |

Required RPC functions are `create_incident_with_location`, `publish_incident`, `get_display_incidents` and `claim_incident_validation_job`. The `enqueue_incident_validation` trigger function must run after new incident inserts. Retain the schema's existing location-generation and privacy rules.

The database SQL was configured separately during development; a consolidated migration/setup script is not currently included in the repository. A fresh Supabase project needs that SQL before the application can run correctly.

### 4. Run three processes

**Backend terminal** — from `Backend`, with the virtual environment active:

```powershell
python -m flask --app app run --port 5001 --no-reload
```

**Worker terminal** — also from `Backend`, with the virtual environment active:

```powershell
python validation_worker.py
```

**Frontend terminal** — from `Frontend`:

```powershell
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`. Keep all three processes running. Press `Ctrl+C` in a terminal to stop its process. With `--no-reload`, backend source changes require a restart.

## Reporting and verification

```text
Submit report → Save as pending + queue job → Background review
                                                    ↓
                         Publish eligible report / Do not publish
```

- **Verified:** the review selected readable trusted sources corroborating the same incident.
- **Unverified:** the report passed consistency screening without sufficient external corroboration.
- **Not published:** validation rejected the report or encountered a blocking issue.

AI consistency screening does not establish truth. Finding search results alone does not make a report verified.

Submission accepts **one valid PNG/JPEG image, up to 5 MB**. Public radii are **100, 250, 500 or 1000 metres**; publication is blocked if the reported area cannot fit after location approximation.

New reports are queued automatically. Existing reports are not backfilled into the queue. The worker polls approximately every five seconds and allows up to three attempts for retryable review failures. Interrupted jobs become reclaimable after their 30-minute lease expires.

Queue states: `queued`, `processing`, `completed`, `failed`. A completed job's `outcome` is `published` or `not_published`. Check `last_error` for failed jobs. Refresh the dashboard after publication to load the new card.

## API reference

Base URL: `http://127.0.0.1:5001`

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/reports` | Submit multipart report and photo |
| GET | `/api/incidents` | List published incidents |
| GET | `/api/incidents/<incident_id>` | Retrieve public incident details |
| POST | `/api/incidents/<incident_id>/validate` | Manually trigger validation; requires `X-Validation-Token` |
| POST | `/api/chatbot` | Send JSON containing `message` and optional `history` |

Report fields: `incident_type`, `latitude`, `longitude`, `location_name`, `radius`, `incident_datetime`, `description` and file field `photo`. Date/time example: `2026-10-21T15:00`.

List parameters: `category`, `verification_status`, `limit`, `offset`, plus optional paired `latitude`/`longitude` and `radius_m` for nearby results. Pagination defaults to 20 records. The dashboard currently requests the latest feed and calculates distances using public coordinates when location is available.

## Quick checks and troubleshooting

```powershell
# From Frontend
npm run build
```

Test one submission, confirm its queue entry, watch the worker, then check the published table and dashboard. Manual API testing can use Thunder Client; it is not required for normal automatic review.

| Symptom | Check |
|---|---|
| Connection refused | Flask is running on port 5001; frontend API URL is correct |
| `PGRST202` | Matching RPC exists in the correct Supabase project; refresh metadata with `NOTIFY pgrst, 'reload schema';` |
| Report stays pending | Worker is running; inspect its logs and queue status |
| Gemini `429`, `503` or `504` | Project quota, model availability or temporary timeouts; inspect retry attempts |
| No dashboard card | Only published records appear; refresh after successful publication |
| Chatbot returns “not enabled” | Check the development-demo flag and restart Flask |

This is a development prototype. Flask's development server and the manually started worker are local run instructions, not a production deployment setup.
