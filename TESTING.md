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

The latest run passed 48 tests (including nested cases), with no failures.

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
| Contact form | Empty submission blocked; a labelled synthetic inquiry reached the live admin inbox and remained after reloading the admin page. Storage failures are also covered by local tests |
| Resume, certificate PDFs, project image, portrait, uploaded photos | Eight distinct file URLs returned 200 with the expected PDF/image content types |
| GitHub project links | Rendered links checked; the legacy GitHub profile URL is corrected by `portfolioCopy.js` |
| Admin | Saved session restored; identity, about, skills, projects, media, inquiries, and security screens opened |
| Project editor | Draft field edited and restored without publishing changes |
| Photo and PDF publishing | Earlier live end-to-end checks confirmed upload, database persistence, public cards, and readable files; existing uploaded photos remained available after refresh |
| Unknown routes | A recovery page links back to the portfolio and admin |

## Limits

Responsive checks use browser viewport sizes, not physical phones. Actual microphone permission, speech playback quality, and OS file-provider behavior still depend on the visitor's browser and device. Saved-session restoration, anonymous-access rejection, and incorrect-credential rejection were verified live; fresh sign-in with the owner's current password was not performed.

A clearly labelled synthetic QA inquiry was used to verify live delivery and persistence. No personal inquiries or password changes were submitted. Inquiry delivery currently means storage in the admin inbox; email notifications are not configured.

After owner approval, the public `admin upload test` gallery card was removed. Its uploaded file returned 404; the original portrait, the `me` photo, and all three original certificates remained. Media deletion now uses an in-page confirmation instead of a native browser confirmation. Opening that confirmation and cancelling was also checked without deleting another item.

Render's free service can sleep while idle. Recovery logic handles transient failures, but it does not provide an uptime guarantee or remove the hosting plan's cold-start delay.

## Render startup failure

The supplied failed deployment log stops at `JWT_SECRET must be configured in production`. The later port-scan timeout is a consequence of that startup failure. Authentication stays disabled without a secret; the application does not use a hardcoded production fallback.

The Blueprint now uses `generateValue: true` for `JWT_SECRET` and `ADMIN_SETUP_TOKEN`. Render generates a random value for a missing variable and preserves existing values. Existing Blueprint installations need to sync this change. A manually created service still needs its environment variables configured in the Render dashboard. If a variable already exists with an empty value, replace it with a secure random value in Render; do not commit it to Git.

`MONGODB_URI` must point to the intended portfolio database. The frontend currently targets `portfolio-backend-v8mm.onrender.com`; verify the public URL before switching to a newly created service.

## Project screenshots and uploaded PDF previews — November 22, 2026

Uploaded AURA and Hostel screenshots render on public project cards, in expanded case studies, and in the admin project editor. Full-size image links were checked without publishing changes to the owner's content.

Uploaded PDFs previously returned Helmet's `X-Frame-Options: SAMEORIGIN` and `frame-ancestors 'self'`, blocking the separately hosted portfolio. PDF responses now allow framing by the portfolio origin only, use inline disposition, and revalidate instead of retaining the old immutable headers. The new header integration test also confirms that image and API routes retain their original protections.

The certificate dialog now lazy-loads PDF.js and renders the page directly, avoiding dependence on a browser's built-in PDF viewer. It includes loading/error states, bounded canvas resolution, page navigation for multi-page documents, and a visible link to the original PDF.

Verified on the deployed frontend: uploaded DevFest and AI/ML Launchpad Bootcamp PDFs, all three original static PDF certificates, and the Bihar AI Summit image certificate. All five PDFs rendered visibly; the browser reported no errors or warnings. The backend reported the deployed fix revision with connected database, and uploaded PDF response headers were checked live. Physical-phone testing was not performed; this run's viewport override did not take effect, so no new phone-size visual verification is claimed. The preview uses fluid-width canvases and a bounded scrolling area.

Latest verification: 36 backend tests and 10 frontend tests passed; production build passed. Client dependency audit reported zero vulnerabilities after a compatible transitive dependency update.

## Internship certificate management — November 22, 2026

Admin now includes an Internships tab with a PDF/image picker for each entry, original filename, preview, draft removal, and Save Internships. Published attachments appear as View certificate buttons on the public internship timeline and open the PDF.js/image viewer. The internship schema retains certificate URL, MIME type, and original filename.

An isolated localhost API with in-memory uploads exercised the actual browser file picker: PDF upload, admin preview, save, public preview after navigation, replacement with a PNG, save, and public image preview. These test attachments were never published to production. The controller/model regression test verifies PDF and image metadata survive section save and public read, existing highlights/technologies and other internships are preserved, and an attachment can be cleared without removing the internship.

The live authenticated admin displayed all three company-specific upload controls without console errors. Vercel deployed the frontend successfully; Render health reported revision 864d341 with the database connected. Automated checks: 37 server tests and 10 client tests passed; production build passed. The owner still needs to select and save her actual internship certificates.

## Contact number privacy — November 23, 2026

Removed the public contact phone card and call link, phone fallbacks in seeded data/schema, and phone details from the assistant's knowledge base and fallback contact answer. Public content responses omit legacy phone fields from database and cached records. This does not modify the uploaded resume document.

Validation: 38 backend tests and 10 frontend tests passed; production build passed. The new regression test checks that legacy phone fields are absent from both database-backed and fallback public content while email remains available; the assistant test also rejects phone-number contact answers.
