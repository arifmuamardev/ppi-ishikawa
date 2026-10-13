# Prelaunch deployment — PPI Ishikawa

## Public release contract
- `ppi-ishikawa.org` remains hosted on GitHub Pages.
- Unless GitHub Actions repository variable `PPI_LAUNCH_MODE` equals the exact string `live`, deployment publishes **only** `public/launch/index.html`, `public/launch/robots.txt`, and the logo asset (plus `.nojekyll`).
- The complete site is always built and its internal links verified; in prelaunch mode that compiled build is stored as a **7-day GitHub Actions artifact** named `ppi-ishikawa-development-build` before the live output is replaced. Artifacts are not an interactive/private hosted preview, and on a public repository they must not be treated as confidential.
- Production hosting of the full site resumes only when `PPI_LAUNCH_MODE=live` is set and the main branch is redeployed.
- Do not use client-side redirects, JavaScript hiding, or robots.txt alone as an access barrier. The source repository remains public, so source code is not confidential.
- Keep member and admin flows off the public deployment until launch; no sensitive data belongs in the static repository.

## Private browser preview — not enabled by this change
No URL is advertised as private until an independent full-site deployment is protected by Cloudflare Access **and** all direct origins / preview URLs are checked for bypass. A password gate on the same public GitHub Pages origin is not sufficient. An authenticated Cloudflare Pages deployment or other genuinely gated staging origin can be provisioned separately. In the meantime, develop locally or download the complete GitHub Actions build artifact (which contains only data safe for public distribution).

## Checks
- Verify the public deployment contains only 4 expected files and responds with the holding page on `/`.
- Check `/about/`, `/member/`, and `/design-lab/unnes-inspired/` do **not** expose the full site.
- Check `https://www.ppi-ishikawa.org` redirect and HTTPS.
- On approved launch, validate Supabase Auth redirect allowlist and real email confirmation/password-reset flows before making membership public.

## Private online preview (Cloudflare Worker)
- URL: `https://preview.ppi-ishikawa.org/` (Cloudflare Worker custom domain).
- Worker: `ppi-ishikawa-preview`, with Cloudflare Access attached **to the Worker itself**, not merely the hostname. No unauthenticated `workers.dev` or Version URLs are configured.
- Cloudflare Access policy initially allows exactly the Cloudflare account owner's email; change the policy in Zero Trust to add approved developers.
- App identity and policy are set in Cloudflare Zero Trust. Do not remove Cloudflare Access, or publish the preview assets on an unrelated public origin.
- The Worker code in `cloudflare/preview-worker.mjs` also fails closed (HTTP 401) if the Access context is absent. `run_worker_first = true` ensures assets pass through the Worker.
- Cloudflare Worker preview build runs with `PUBLIC_PREVIEW_DEMO_MODE=true` so the preview cannot connect to the production Supabase membership database. Member UI remains in simulated/demo mode.
- Astro sets `site` to the preview URL for that build only; production remains `https://ppi-ishikawa.org`.
- The separate GitHub Actions workflow `.github/workflows/deploy-preview.yml` builds and checks the full site. Deployment requires GitHub repository secret `CLOUDFLARE_PREVIEW_API_TOKEN` (Cloudflare API token scoped to this account and Worker script edits). Never store the secret in source files, chat, or public GitHub variables.
- Without the secret, CI builds/test checks may pass, but the preview Worker will **continue to show a setup placeholder**. This is intentional.
- Verify Access in an unauthenticated/private browsing session after the first successful deployment; expect login/denial rather than page content. Then verify the authorized account can browse the complete site, and check all direct origin routes.
- The public GitHub Pages deployment remains the independent Coming Soon page until explicitly set to live.
