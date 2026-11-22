# Backend storage

Portfolio content, admin accounts, and uploaded media use the configured MongoDB database in production. Uploaded photos, project images, resumes, and certificates are stored in GridFS and served through `/uploads/:filename`; they survive Render redeploys and instance changes. The production frontend connects directly to the Render API and uploaded assets. CORS explicitly permits the main portfolio origin (`server/config/cors.js`); `CLIENT_URL` can add other origins.

The Render Blueprint generates `JWT_SECRET` and `ADMIN_SETUP_TOKEN` when they are absent, without rotating existing values. Sync the Blueprint after pulling updates. For a manually created service, configure those secrets in Render Environment and set `MONGODB_URI` to the portfolio database. A missing `JWT_SECRET` intentionally stops startup; a subsequent port timeout is not a separate port-binding problem. Do not commit secret values to the repository.

Uploaded payloads are limited to 4 MB. The admin prepares photos up to 30 MB by resizing them in the browser; PDFs must already be under 4 MB. Supported types are JPEG, PNG, WebP, and PDF, with file signature checks. Photo uploads accept images only. Uploads and deletes require an authenticated admin.

Local development without MongoDB retains the disk fallback. Production uploads fail if persistent storage is unavailable. Existing disk uploads remain accessible where the files are still present; files lost before this change need to be uploaded again.

Use `/admin` on the portfolio to sign in. The Projects tab supports adding projects, editing all project details, selecting a featured project, and removing items from the draft. Save Projects publishes the draft. Certificates & Photos use `POST /api/content/media/:kind/publish` with multipart `file` and JSON `metadata`. The server stores the file and appends its record in one request, with a stable item ID for retries. Titles default to filenames. The older upload-only endpoints remain for existing clients.
