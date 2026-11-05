# ✨ Dynamic Portfolio Website

A modern, responsive, and dynamic personal portfolio website built to showcase my skills, education, certifications, experience, projects, and achievements in an interactive way.

The portfolio includes a public site, an admin dashboard for managing content, an AI portfolio assistant with a verified offline fallback, contact-form storage, and managed media uploads.

## 🚀 Features

- **Responsive Design** — Works across desktop, tablet, and mobile devices.
- **About Me** — Introduces my background, interests, and career goals, with optional narrated introduction.
- **Education** — Showcases my academic qualifications.
- **Skills** — Highlights technical skills and areas of expertise.
- **Experience** — Displays internships, training, and professional experience.
- **Projects** — Presents my projects and technical work with detailed project views.
- **Certificates & Gallery** — Supports image, video, and PDF previews for verified certificates and media.
- **Dynamic Content** — Loads portfolio content from MongoDB with a local cached fallback.
- **Admin Panel** — Provides authenticated controls for editing sections and managing uploads.
- **AI Portfolio Assistant** — Answers questions using a grounded knowledge base and optional Gemini/OpenAI inference.
- **Resume** — Allows visitors to view or download my resume.
- **Contact Form** — Stores validated inquiries for review in the admin inbox.

## 🛠️ Tech Stack

**Frontend**
- React 19
- Vite
- Tailwind CSS
- React Router
- Axios

**Backend**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT authentication
- Multer managed uploads

**Optional AI**
- Google Gemini API
- OpenAI API

## 📁 Project Structure

```text
portfolio/
├── client/                 # React frontend
│   ├── public/             # Static assets and resume
│   └── src/                # Components, contexts, hooks, services
├── server/                 # Express API
│   ├── config/             # Environment and database setup
│   ├── controllers/        # Content, auth, contact, and AI handlers
│   ├── data/               # Seed content and local admin fallback
│   ├── middleware/         # Auth and upload validation
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   ├── scripts/            # Seeding and admin setup
│   └── uploads/            # Local managed uploads (not committed)
├── .gitignore
├── package.json
├── vercel.json
└── README.md
```

## ⚙️ Getting Started

### Prerequisites

- Node.js 22+ (required by the current Vite version)
- npm
- MongoDB (local MongoDB or a MongoDB Atlas connection string)
- Optional: a Gemini or OpenAI API key for live AI responses

### 1. Clone the Repository

```bash
git clone https://github.com/Sunshine9693/portfolio.git
cd portfolio
```

### 2. Install Dependencies

```bash
npm run install:all
```

### 3. Configure Environment Variables

Create the backend environment file:

```bash
cp server/.env.example server/.env
```

PowerShell:

```powershell
Copy-Item server\.env.example server\.env
```

Set at least:

```dotenv
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/sana_portfolio
JWT_SECRET=replace_with_a_long_random_secret
ADMIN_SETUP_TOKEN=replace_with_a_one_time_setup_token
CLIENT_URL=http://localhost:5173
```

The frontend works without an environment file when using the Vite development proxy. For a separately deployed frontend, create `client/.env`:

```dotenv
VITE_API_BASE_URL=https://your-backend.example.com
```

Leave `VITE_API_BASE_URL` empty when the frontend and API share an origin.

### 4. Seed Portfolio Content

The seed script uses `server/data/activePortfolioData.json` when present, falling back to the built-in default content.

```bash
npm --prefix server run seed
```

The script does nothing if a portfolio document already exists. To replace existing content intentionally:

```bash
npm --prefix server run seed -- --force
```

### 5. Run Locally

Start the backend:

```bash
npm run dev:server
```

Start the frontend in a second terminal:

```bash
npm run dev:client
```

Open `http://localhost:5173`. Vite proxies `/api` and `/uploads` to the backend on port 5000.

The backend also has a local cached-content fallback, so the public portfolio can be inspected when MongoDB is temporarily unavailable. Admin writes require a working database or the file-based admin fallback.

### 6. Create the Admin Account

Open `http://localhost:5173/admin` and use the secure initial setup form with the `ADMIN_SETUP_TOKEN` from `server/.env`. Change the token and JWT secret before deploying.

## 🔑 Environment Variables

### Backend (`server/.env`)

| Variable | Required | Purpose |
| --- | --- | --- |
| `PORT` | No | API port. Defaults to `5000`. |
| `NODE_ENV` | No | Use `production` when deployed. Enables stricter secret checks. |
| `MONGODB_URI` | Recommended | MongoDB or MongoDB Atlas connection string. |
| `JWT_SECRET` | Production | Signs admin sessions. Use a long random value. |
| `ADMIN_SETUP_TOKEN` | Production | Allows one-time initial admin creation. |
| `CLIENT_URL` | Production | Exact frontend origin allowed by CORS, without a trailing slash. |
| `UPLOADS_DIR` | Production | Persistent directory for managed uploads. |
| `GEMINI_API_KEY` | No | Enables live Gemini responses. |
| `GEMINI_MODEL` | No | Gemini model ID. Defaults to `gemini-3.8-flash`. |
| `OPENAI_API_KEY` | No | Optional OpenAI fallback. |
| `OPENAI_MODEL` | No | OpenAI model ID. Defaults to `gpt-4o-mini`. |

### Frontend (`client/.env`)

| Variable | Required | Purpose |
| --- | --- | --- |
| `VITE_API_BASE_URL` | No | Backend origin for separate deployments. Leave blank for same-origin/proxy setups. |

## 🤖 AI Assistant Behavior

The assistant is grounded in Sana's verified portfolio information. If no AI key is configured, or the external provider is temporarily unavailable, the API returns a built-in verified response with an `infoNotice` instead of failing the chat.

Configure a live provider with:

```dotenv
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-3.8-flash
```

Model availability changes over time. If Google retires the configured model, update `GEMINI_MODEL` to a model available to your API key.

## 🖼️ Uploads and Persistent Storage

The admin dashboard accepts managed image, video, and PDF uploads up to 15 MB. Uploads are validated by extension, MIME type, and file signature. SVG uploads are intentionally rejected.

Local uploads are written to `server/uploads/`, which is excluded from Git. On platforms with ephemeral filesystems, set `UPLOADS_DIR` to a mounted persistent volume, or uploads will disappear after a redeploy.

## 🌐 Deployment

### Frontend

The included `vercel.json` builds `client/` and serves `client/dist/`. On Vercel:

1. Import the repository.
2. Set `VITE_API_BASE_URL` to the deployed backend origin.
3. Deploy.

### Backend

#### Render (Blueprint)

The repository includes `render.yaml`, which deploys `server/` as a Render web service.

1. Push the repository to GitHub.
2. In the [Render Dashboard](https://dashboard.render.com), choose **New → Blueprint** and select this repository.
3. Enter the secret values when prompted:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `ADMIN_SETUP_TOKEN`
4. Deploy. The API is available at `https://<service-name>.onrender.com`; the health check is `/api/health`.
5. Set `VITE_API_BASE_URL` on the Vercel frontend to the Render URL and redeploy it.

The Blueprint uses the Free plan, so the API spins down after 15 minutes without traffic and takes about a minute to wake up. Free instances also have an ephemeral filesystem: set `UPLOADS_DIR` to a mounted persistent disk (paid plans only) if admin uploads must survive restarts.

#### Vercel Functions

`server/vercel.json` also allows deploying `server/` as a Vercel project. Uploads there are written to `/tmp/uploads` and do not persist.

Then seed the production database once with `npm --prefix server run seed` (or `-- --force` when intentionally replacing content).

## 🔒 Security

- `.env` files are excluded from version control. Never commit real API keys, database credentials, authentication secrets, or passwords.
- Rotate any database or API credential that has ever been shared in chat, logs, screenshots, or a public repository.
- Use long, unique values for `JWT_SECRET` and `ADMIN_SETUP_TOKEN`.
- Admin endpoints require a valid JWT; contact and authentication routes are rate limited.
- Uploaded files are checked by type and signature before being stored.
- `server/data/adminUser.json` and `server/uploads/` are excluded from Git.

## 👩‍💻 Author

**Sana Fatma**

B.Tech — Computer Science and Engineering
Maulana Azad National Urdu University

- **GitHub:** [Sunshine9693](https://github.com/Sunshine9693)
- **Portfolio Repository:** [Dynamic Portfolio](https://github.com/Sunshine9693/portfolio)

---

⭐ If you find this project interesting, feel free to explore the repository and its features.

*Built with curiosity, creativity, and continuous learning.*
