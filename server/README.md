# Backend storage

Portfolio content, admin accounts, and uploaded media use the configured MongoDB database in production. Uploaded photos, project images, resumes, and certificates are stored in GridFS and served through `/uploads/:filename`; they survive Render redeploys and instance changes. The Vercel frontend forwards `/api` and `/uploads` to the Render backend through same-origin rewrites.

Files are limited to 4 MB to fit Vercel function requests. Supported types are JPEG, PNG, WebP, and PDF, with file signature checks. Photo uploads accept images only. Uploads and deletes require an authenticated admin.

Local development without MongoDB retains the disk fallback. Production uploads fail if persistent storage is unavailable. Existing disk uploads remain accessible where the files are still present; files lost before this change need to be uploaded again.

Use `/admin` on the portfolio to sign in. The Projects tab supports adding projects, editing all project details, selecting a featured project, and removing items from the draft. Save Projects publishes the draft. Certificates & Photos uploads publish after upload and metadata save.
