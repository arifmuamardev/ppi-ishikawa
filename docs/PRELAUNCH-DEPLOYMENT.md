# Prelaunch deployment — PPI Ishikawa

## Public release contract
- `ppi-ishikawa.org` remains hosted on GitHub Pages.
- Unless GitHub Actions repository variable `PPI_LAUNCH_MODE` equals the exact string `live`, deployment publishes **only** `public/launch/index.html`, `public/launch/robots.txt`, and the logo asset (plus `.nojekyll`).
- The complete site is always built and its internal links verified; in prelaunch mode that compiled build is stored as a **7-day GitHub Actions artifact** named `ppi-ishikawa-development-build` before the live output is replaced. Artifacts are not an interactive/private hosted preview.
- Production hosting of the full site resumes only when `PPI_LAUNCH_MODE=live` is set and the main branch is redeployed.
- Do not use client-side redirects, JavaScript hiding, or robots.txt alone as an access barrier. The source repository remains public, so source code is not confidential.
- Keep member and admin flows off the public deployment until launch; no sensitive data belongs in the static repository.

## Private browser preview — not enabled by this change
No URL is advertised as private until an independent full-site deployment is protected by Cloudflare Access **and** all direct origins / preview URLs are checked for bypass. A password gate on the same public GitHub Pages origin is not sufficient. An authenticated Cloudflare Pages deployment or other genuinely gated staging origin can be provisioned separately. In the meantime, develop locally or download the complete GitHub Actions build artifact.

## Checks
- Verify the public deployment contains only 4 expected files and responds with the holding page on `/`.
- Check `/about/`, `/member/`, and `/design-lab/unnes-inspired/` do **not** expose the full site.
- Check `https://www.ppi-ishikawa.org` redirect and HTTPS.
- On approved launch, validate Supabase Auth redirect allowlist and real email confirmation/password-reset flows before making membership public.
