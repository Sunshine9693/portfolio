# Portfolio checks

Last checked: 22 November 2026.

## Run the checks

From the repository root:

```sh
npm test
npm run build
```

`npm test` runs the server and client Node test suites. The production build uses Vite.

## Automated coverage

- Admin username/email matching, incorrect passwords, session validation, and password-change session revocation.
- Database connection recovery and concurrent connection attempts.
- Production CORS preflights for login and uploads; rejection of unrelated origins.
- Authentication required for content edits, uploads, publishing, file deletion, and private inquiries.
- Contact validation, normalized stored inquiries, and explicit failure when production storage is unavailable.
- Photo/PDF validation, phone files without a MIME type, upload size errors, and media metadata validation.
- Server-side media appends and duplicate-ID retries without replacing existing items.
- Client session preservation during outages and bounded retries for safe requests.
- Assistant input validation and its built-in fallback when no provider is configured.
- Speech coordination: About narration and assistant speech cannot overlap; old speech callbacks do not stop a new speaker.

The latest run passed 45 tests (including nested cases), with no failures.

## Browser and live-site checks

Checked with the in-app browser and the local production build:

| Area | Result |
| --- | --- |
| Home, About, Skills, Projects, Experience, Education, Gallery, Contact | Rendered without console errors |
| Navigation and direct section links | Targets exist; initial `/#projects` opens at Projects after content loads |
| Responsive layout | No horizontal overflow at widths 320, 375, 768, and 1440 pixels |
| Project filters and case study | Correct completed projects; details open and close |
| Skills and media dialogs | Open correctly; Escape closes; focus stays in the dialog and returns on close |
| Mobile navigation and assistant | Open/close, keyboard focus, and body scroll restoration checked |
| Live AI assistant | Returned the documented projects |
| Contact form | Empty submission blocked; persistence and failure handling tested locally without adding fake live inquiries |
| Resume, certificate PDFs, project image, portrait, uploaded photos | Eight distinct file URLs returned 200 with the expected PDF/image content types |
| GitHub project links | Rendered links checked; the legacy GitHub profile URL is corrected by `portfolioCopy.js` |
| Admin | Saved session restored; identity, about, skills, projects, media, inquiries, and security screens opened |
| Project editor | Draft field edited and restored without publishing changes |
| Photo and PDF publishing | Earlier live end-to-end checks confirmed upload, database persistence, public cards, and readable files; existing uploaded photos remained available after refresh |
| Unknown routes | A recovery page links back to the portfolio and admin |

## Limits

Responsive checks use browser viewport sizes, not physical phones. Actual microphone permission, speech playback quality, and OS file-provider behavior still depend on the visitor's browser and device. No real contact messages or password changes were submitted during this audit. Existing portfolio entries were not deleted.

Render's free service can sleep while idle. Recovery logic handles transient failures, but it does not provide an uptime guarantee or remove the hosting plan's cold-start delay.

## Render startup failure

The supplied failed deployment log stops at `JWT_SECRET must be configured in production`. The later port-scan timeout is a consequence of that startup failure. Authentication stays disabled without a secret; the application does not use a hardcoded production fallback.

The Blueprint now uses `generateValue: true` for `JWT_SECRET` and `ADMIN_SETUP_TOKEN`. Render generates a random value for a missing variable and preserves existing values. Existing Blueprint installations need to sync this change. A manually created service still needs its environment variables configured in the Render dashboard. If a variable already exists with an empty value, replace it with a secure random value in Render; do not commit it to Git.

`MONGODB_URI` must point to the intended portfolio database. The frontend currently targets `portfolio-backend-v8mm.onrender.com`; verify the public URL before switching to a newly created service.
