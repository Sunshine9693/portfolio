# Backend Storage

Portfolio content metadata is stored in MongoDB when connected, with the existing local JSON cache as a fallback. For durable production metadata, configure the existing `MONGODB_URI` to a persistent MongoDB database. Uploaded file contents are stored on disk and served from `/uploads`.

By default, uploads are written to `server/uploads`. Set `UPLOADS_DIR` to a writable, durable storage path in the backend environment when deploying. The directory must persist across restarts and be shared by backend instances that serve the same portfolio. Without persistent storage, uploaded files may be lost when the hosting platform replaces its filesystem.

The portfolio database stores file URLs, not the file contents; configuring MongoDB alone does not make uploaded files durable.
