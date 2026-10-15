# Deployment operations — PPI Ishikawa

## Production (public website)
- `https://ppi-ishikawa.org/` serves the **complete Astro website** via GitHub Pages.
- GitHub Actions `.github/workflows/deploy.yml` builds and deploys on every push to `main`, using `withastro/action@v6` and `actions/deploy-pages@v5`.
- The temporary Coming Soon / launch-mode gate was retired on 15 October 2026. There is **no** `PPI_LAUNCH_MODE` dependency and no replacement holding-page bundle.
- `public/robots.txt` may still restrict search indexing. Search indexing is a separate editorial decision; it does not restrict normal visitor access.
- GitHub Pages custom domain remains `ppi-ishikawa.org`; DNS is managed in Cloudflare.
- Validate live HTTPS, apex/www behavior, `/about/`, `/community/`, `/member/`, and Design Lab after deployment.
- Live member registration, confirmation, and password recovery still require properly configured Supabase Auth URL allowlists; do not presume these workflows are verified by static build checks.

## Separate private preview (optional infrastructure retained)
- The Cloudflare Worker is `ppi-ishikawa-preview` at `https://preview.ppi-ishikawa.org/`; a Worker-level Cloudflare Access application restricts authenticated access to the approved owner email.
- The worker is distinct from GitHub Pages production. Its presence **does not affect public website deployment**.
- `cloudflare/preview-worker.mjs` denies when the Access context is absent. `wrangler.preview.toml` is configured to run Worker logic before serving static assets.
- `.github/workflows/deploy-preview.yml` builds the preview in demo membership mode to avoid production Supabase. Actual preview deployment requires secret `CLOUDFLARE_PREVIEW_API_TOKEN` and should not be treated as complete until authorized and unauthenticated browser testing passes.
- Do not put the API token into repository files or chat messages.
