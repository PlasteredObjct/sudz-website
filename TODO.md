# SUDZ Website — To-Do

Working list for finishing the SUDZ Mobile Detailing site.
Owner: Silas Zeidler · Danville, VA · 434-489-1525

---

## Waiting on Silas

- [x] Real About section content — *received 2026-09-14, live on site*
- [x] Real FAQ questions & answers — *received 2026-09-14, 8 Q&As live on site*
- [ ] Real photos — hero shot, 5 customer-photo strip images, 8 before/after gallery slots
- [ ] Real videos — for the photo strip / social content, format and length TBD
- [ ] Finalized detailed pricing per tier — so the pricing section is accurate, not a template
- [ ] Full add-on list + pricing per package — *once received, also add these to the Jobber online booking form (Products & Services / booking form config), not just the site*
- [ ] Add-on pricing specifically (wax, headlight restoration) — names known, prices not — *same follow-up: also needs adding to the Jobber booking form once known*
- [ ] Fleet service pricing/details — flat rate per vehicle; what's the rate and what's included?

## Build Next

- [x] Package detail modal — *added 2026-09-15, clicking anywhere on a package card (or "View Full Details") opens a modal with a What's Included list and a description section. Description text is a `[Placeholder]` template — swap in real per-package write-ups once ready. Add-ons aren't surfaced in it yet.*
- [x] Make service locations more visible — *added 2026-09-15, a "Now Serving..." banner sits right under the header, visible without scrolling. Original Service Area box in Contact section at the bottom kept as-is.*
- [x] Convert "Book Now" section into a "Get a Quote" section — *done 2026-09-15, section renamed to `#quote` (eyebrow, title, subtitle, submit button); nav link + hero button relabeled "Get a Quote" and point to the on-page form. Form field set unchanged — see Open Decisions below.*
- [x] Point "Book Now" (utility bar + 3 pricing card buttons) to an external booking site instead of the on-page form — *done 2026-09-17: all 4 "Book Now" CTAs now open Jobber's public "Assessment Booking Form" Client Hub link in a new tab (`https://clienthub.getjobber.com/hubs/3afedfa0-1c90-452c-a0af-f460705e501e/public/requests/5171490/new`). Removed the `.btn-pending-fsm` inert-placeholder pattern.*
- [x] Wire up a backend for the Get a Quote form (email and/or database) — *done and verified 2026-09-16: `server/` is a small Express + Nodemailer service that emails submissions to sudzmobiledetailing8@gmail.com via Gmail SMTP, reverse-proxied through nginx at `/api/quote` (see `docker-compose.yml`, `nginx.conf`). Real Gmail App Password is in `server/.env` (gitignored). Confirmed working with a live browser submission and a real send.*
- [x] Rename packages to match Silas's naming — *done 2026-09-15, cards, booking form dropdown, and package modal all updated: Express Wash, Refresh Package, Restore Package*
- [x] ~~Add a fleet service section~~ — *scrapped 2026-09-16, decided against a dedicated section. Fleet is still mentioned in About/FAQ, and "Fleet Service" is selectable in the Get a Quote form's Service dropdown.*
- [x] Scroll-triggered fade-in animations — *added 2026-09-17, IntersectionObserver + `.reveal`/`.reveal-dN` classes across every section (pricing cards, gallery, about badges, testimonials, FAQ, quote form, contact cards). Reveals once per element, respects `prefers-reduced-motion`. Part of addressing the "looks bland/not professional" feedback from the UI review.*
- [ ] Surface add-ons on the site (wax, headlight restoration) — feeds the package modal
- [ ] Address the rest of the "bland/not professional" feedback — scroll animations done; placeholder-heavy sections still the main driver (blocked on real photos from Silas), other polish (typography/spacing/imagery) not yet scoped
- [ ] Optimize the page for mobile format — noted 2026-09-15. *2026-09-17: fixed two confirmed bugs from a UI review — horizontal page overflow (unwrapped email address in Contact section forcing the grid wider than viewport) and the "WE COME TO YOU!" hero ribbon overlapping the vehicle photo placeholder. Broader mobile polish still unscoped.*

## Open Decisions

- [x] **Pricing conflict** — *fixed 2026-09-16: FAQ's "base rates start at $80" corrected to $89 to match the Express Wash card. Both now say pricing starts there and varies by size/condition.*
- [x] Which external site should "Book Now" redirect to? — *decided and wired 2026-09-17: Jobber (see Build Next above).*
- [x] What should the Get a Quote form actually collect vs. the old booking form? — *simplified 2026-09-17: replaced the cascading Vehicle Make/Model selects (+ "Other" specify fields) with one free-text "Vehicle Year, Make & Model" input. Form is down to 7 fields: Name, Phone, Email, Service, Preferred Date (optional), Vehicle, Location.*
- [ ] Confirm About/FAQ copy with partner — real copy is committed and live, pending sign-off
- [x] Backend approach — *decided 2026-09-16: custom Express relay in its own Docker service (`server/`), sends via Gmail SMTP rather than a raw mail server.*

## Deployment

- [x] Hosting stack decided — *2026-09-17: Spaceship (domain registrar) → Cloudflare (DNS + WAF + free SSL + CDN, proxied) → DigitalOcean (VPS running the existing `docker-compose.yml` stack, Basic Droplet 1GB/1vCPU/25GB ~$6/mo). Registrar/DNS/host deliberately split across 3 providers, all standard practice.*
- [x] Jobber account set up, Online Booking configured — *2026-09-17: "SudZ Mobile Detailing" business live in Jobber, Assessment Booking Form is the booking default, public link wired into the site's Book Now buttons (see Build Next above). Online payments show "Finish Verification" still pending in Jobber's dashboard — needed before funds can actually deposit to the bank account.*
- [ ] Register the domain via Spaceship — was checking `sudzmobiledetailingva.com` availability
- [ ] Create Cloudflare account, add the domain, point nameservers at Cloudflare
- [ ] Spin up the DigitalOcean droplet, SSH in, `git clone` the repo, populate `server/.env`, `docker compose up -d --build`
- [ ] Point Cloudflare DNS A record at the droplet's IP (proxied, orange-cloud on)
- [ ] Once Cloudflare is proxying: update `nginx.conf` to trust Cloudflare's IP ranges / read `CF-Connecting-IP` so rate limiting on `/api/quote` keys on the real visitor, not Cloudflare's edge IP (flagged during planning, not yet implemented — only matters once Cloudflare is actually in front)

---

## Project notes

- Code: `C:\Users\Matth\Desktop\SUDZ-website` → [github.com/PlasteredObjct/sudz-website](https://github.com/PlasteredObjct/sudz-website) (`main`)
- Pushed through commit `2f6e7a6`. Nothing uncommitted.
- `server/.env` (gitignored, local only) has the real Gmail App Password for `sudzmobiledetailing8@gmail.com` — never commit this file. Regenerate/revoke the App Password from the Gmail account's Security settings if it's ever compromised.
- Local dev server: `preview_start` name `sudz-site`, port 5173 (static only — the `/api/quote` backend isn't reachable through this, so quote-form submissions will show the fallback error message here by design).
- Full stack (static site + quote backend, for testing real email sends): `preview_start` name `sudz-fullstack`, or `docker compose up --build`, at port 8080. Requires `server/.env` populated (copy from `server/.env.example`, needs a real Gmail App Password) or the backend container will fail to send mail.
- Bump the `?v=N` query on `style.css` / `script.js` in `index.html` after editing them, or browsers serve stale cached copies.
- The Dockerfile must `COPY assets/` explicitly — otherwise the logo breaks in the container.
