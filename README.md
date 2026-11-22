# Sana Fatma's Portfolio

This is the code for my personal portfolio. It brings together my projects, education, internships, certificates, and contact details. An admin dashboard lets me update the content without editing the source files.

[View the portfolio](https://sanafatma-portfolio.vercel.app) · [LinkedIn](https://www.linkedin.com/in/sana-fatma-a00b49294/) · [GitHub](https://github.com/Sunshine9693)

## What's included

- Project cards and detail views with a short challenge and result for each project.
- Education, skills, internship experience, and a downloadable resume.
- A photo gallery and previews for image or PDF certificates.
- An optional spoken introduction and a portfolio Q&A assistant.
- A contact form that stores messages in the admin inbox.
- A warm rose-and-plum theme, responsive layouts, and animations that respect reduced-motion preferences.

The admin portal at `/admin` supports adding and editing projects, selecting a featured project, uploading photos and certificates, editing profile content, reading inquiries, and changing the account password.

## Stack and hosting

| Part | Tools |
| --- | --- |
| Frontend | React, Vite, Tailwind CSS, React Router, Axios |
| API | Node.js, Express, Mongoose |
| Storage | MongoDB for content and accounts; GridFS for uploaded files |
| Authentication | Password hashing with bcrypt and JWT admin sessions |
| Hosting | Vercel frontend and Render backend |
| Optional AI providers | Gemini, OpenAI, OpenRouter |

The production browser connects directly to the Render API for sign-in, content, and uploaded media. The API permits the portfolio's exact Vercel origin through CORS. Vercel serves the React app; its legacy API/upload rewrites remain for older clients.

## Run locally

You'll need Node.js **22.12 or newer**, npm, and a local MongoDB instance or MongoDB Atlas connection.

### 1. Clone and install

```bash
git clone https://github.com/Sunshine9693/portfolio.git
cd portfolio
npm run install:all
```

### 2. Configure the backend

Copy `server/.env.example` to `server/.env`.

```bash
cp server/.env.example server/.env
```

In PowerShell:

```powershell
Copy-Item server/.env.example server/.env
```

Set your MongoDB connection string and choose your own authentication secrets:

```dotenv
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/sana_portfolio
JWT_SECRET=replace_with_a_long_random_secret
ADMIN_SETUP_TOKEN=replace_with_a_separate_random_setup_key
CLIENT_URL=http://localhost:5173
```

An AI provider key is optional. Without one, the assistant uses built-in answers based on portfolio information.

### 3. Start both services

In one terminal:

```bash
npm run dev:server
```

In another:

```bash
npm run dev:client
```

Open [localhost:5173](http://localhost:5173). Vite forwards local API and upload requests to port 5000, so a frontend environment file is not normally needed.

To seed MongoDB with the saved portfolio content:

```bash
npm --prefix server run seed
```

The seed script leaves existing portfolio documents unchanged.

### 4. Set up the administrator

Open `/admin` and select **Initial Setup**. Enter the setup key from your backend environment, then choose your account details. Initial setup is available only before an admin account exists.

After signing in, use **Change password** to set a new password. It requires the current password and signs out other sessions.

## Testing

Run `npm test` for the server and client regression suites, then `npm run build` for the production build. See [TESTING.md](TESTING.md) for browser checks, deployment troubleshooting, and device-testing limits.

## Configuration

| Variable | Purpose |
| --- | --- |
| `PORT` | Backend port; defaults to 5000 locally. The hosting platform can supply its own value. |
| `NODE_ENV` | Set to `production` on the deployed backend. |
| `MONGODB_URI` | Database connection string. Required for persistent production content, accounts, and uploads. |
| `JWT_SECRET` | Secret used to sign admin sessions; required in production. |
| `ADMIN_SETUP_TOKEN` | Server-owner key for initial account setup and account recovery. Keep it private. |
| `CLIENT_URL` | Allowed frontend origin or comma-separated origins for CORS. Wildcards are supported. |
| `OPENROUTER_API_KEY` / `OPENROUTER_MODEL` | Optional OpenRouter credentials and model selection. |
| `GEMINI_API_KEY` / `GEMINI_MODEL` | Optional Gemini credentials and model selection. |
| `OPENAI_API_KEY` / `OPENAI_MODEL` | Optional OpenAI credentials and model selection. |
| `UPLOADS_DIR` | Optional local or temporary upload directory. Persistent media uses GridFS when MongoDB is connected. |

`VITE_API_BASE_URL` can override the backend origin **during local development only**. Production builds use `PRODUCTION_API_ORIGIN` in `client/src/services/apiRouting.js`. The frontend origin is included in `server/config/cors.js`, so stale `CLIENT_URL` settings cannot block the main portfolio.

## Uploads and storage

Photo uploads accept **JPEG, PNG, and WebP**. Certificates and general uploads also accept **PDF**. The limit is **4 MB per file**. The server checks the extension, MIME type, and file signature.

Uploaded files are stored in MongoDB GridFS and served through `/uploads/:filename`, so they survive backend restarts and redeploys without a persistent disk. Portfolio records store the file URLs.

For local development without MongoDB, the server retains a disk and cached-content fallback. Production uploads and content writes fail when database storage is unavailable.

See [the backend storage notes](server/README.md) for more detail.

## Deployment

### Backend: Render

The [Render Blueprint](render.yaml) configures a Node.js web service with:

- Root directory: `server`
- Build command: `npm install`
- Start command: `npm start`
- Health check: `/api/health`

Import the Blueprint in Render and supply the database connection string, authentication secrets, and any optional AI provider key. Set `CLIENT_URL` to the frontend origin. If using your own frontend domain, update the Blueprint's origin list too.

The current backend is [portfolio-backend-v8mm.onrender.com](https://portfolio-backend-v8mm.onrender.com/api/health).

### Frontend: Vercel

Import the repository with its root directory unchanged. [vercel.json](vercel.json) defines dependency installation, the frontend build, and the `client/dist` output directory.

If deploying a fork or a different backend, update `PRODUCTION_API_ORIGIN` in `client/src/services/apiRouting.js`, the frontend origin in `server/config/cors.js`, and the legacy rewrite destinations in `vercel.json`. Rebuild and deploy both services.

The current frontend is [sanafatma-portfolio.vercel.app](https://sanafatma-portfolio.vercel.app).

## Checks

Build the frontend:

```bash
npm run build
```

Run the password-change and session checks:

```bash
node --test server/tests/changePassword.test.js
```

An optional [production smoke check](server/scripts/verifyProduction.mjs) tests sign-in, project saving, and media upload/retrieval/deletion. It requires `PORTFOLIO_API_URL`, `PORTFOLIO_SITE_URL`, `PORTFOLIO_ADMIN_USERNAME`, and `PORTFOLIO_ADMIN_PASSWORD` in the environment. It saves the current project data unchanged and creates then deletes its own test uploads.

## Repository layout

```text
client/
  public/          Static images, certificates, and resume
  src/             Public sections, admin views, hooks, and API client
server/
  controllers/     Content, authentication, contact, and assistant handlers
  data/            Default content and seed data
  models/          MongoDB schemas
  services/        GridFS file storage
  scripts/         Seed, admin setup, and smoke checks
  tests/           Authentication regression checks
render.yaml        Render backend configuration
vercel.json        Vercel build settings and backend rewrites
```

Environment files, local admin credentials, and local uploads are excluded from Git. Keep database credentials, API keys, and authentication secrets in environment variables.
