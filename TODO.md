# SUDZ Website — To-Do

Working list for finishing the SUDZ Mobile Detailing site.
Owner: Silas Zeidler · Danville, VA · 434-489-1525

---

## Waiting on Silas

- [x] Real About section content — *received 2026-09-14, live on site*
- [x] Real FAQ questions & answers — *received 2026-09-14, 8 Q&As live on site*
- [ ] Real photos — hero shot, 5 customer-photo strip images, 8 before/after gallery slots — *once these go in, also add an infinite conveyor-belt/marquee animation to the photo strip (currently a static 5-slot grid, no motion). Requested 2026-09-17, deferred until real photos are ready.*
- [ ] Real videos — for the photo strip / social content, format and length TBD
- [x] Finalized detailed pricing per tier — *received 2026-09-17: real per-vehicle-size pricing (Small/Sedan, Midsize SUV/Crossover, Large SUV/Truck, Oversized) for all 3 packages, plus real "what's included" copy. Live on the pricing cards, replacing the old single "starting at" placeholder price.*
- [x] Full add-on list + pricing — *received 2026-09-17 (Wax/Sealant+Clay Mitt $50, Dog Hair Removal $60/$80 severe, Seat Shampoo $25/seat, Headliner Cleaning $30, Odor/Smoke Treatment $50, Biohazard Surcharge $75+). Decided 2026-09-17: add-ons will NOT be surfaced on the website — not added to the site or the Jobber booking form, kept off both per Silas.*
- [x] ~~Fleet service pricing/details~~ — *closed 2026-09-17: no dedicated fleet pricing needed on the site or Jobber form — "Fleet Service" stays a selectable option in the Service dropdown, quoted manually per the earlier decision to scrap a dedicated fleet section (see Build Next).*

## Build Next

- [x] ~~Package detail modal~~ — *added 2026-09-15 (click-anywhere-on-card / "View Full Details" opened a modal with a What's Included list and a placeholder description). Removed 2026-09-17 once real per-vehicle-size pricing landed and made it redundant — pricing/includes now live directly on the cards instead.*
- [x] Make service locations more visible — *added 2026-09-15, a "Now Serving..." banner sits right under the header, visible without scrolling. Original Service Area box in Contact section at the bottom kept as-is.*
- [x] Convert "Book Now" section into a "Get a Quote" section — *done 2026-09-15, section renamed to `#quote` (eyebrow, title, subtitle, submit button); nav link + hero button relabeled "Get a Quote" and point to the on-page form. Form field set unchanged — see Open Decisions below.*
- [x] Point "Book Now" to an external booking site instead of the on-page form — *done 2026-09-17: "Book Now" CTAs open a Jobber public Client Hub link in a new tab. Removed the `.btn-pending-fsm` inert-placeholder pattern. Originally lived in the utility bar + 3 pricing cards (4 total); swapped the utility bar's link with the hero's primary button — utility bar now says "Get a Quote" (`#quote`), hero's big pink button now says "Book Now" (Jobber). Still 4 Jobber CTAs total: hero + 3 pricing cards. Later that day, rebuilt the target form from scratch (see Deployment note below) and repointed all 4 CTAs to it (`.../public/requests/5193018/new`).*
- [x] Wire up a backend for the Get a Quote form (email and/or database) — *done and verified 2026-09-16: `server/` is a small Express + Nodemailer service that emails submissions to sudzmobiledetailing8@gmail.com via Gmail SMTP, reverse-proxied through nginx at `/api/quote` (see `docker-compose.yml`, `nginx.conf`). Real Gmail App Password is in `server/.env` (gitignored). Confirmed working with a live browser submission and a real send.*
- [x] Rename packages to match Silas's naming — *done 2026-09-15 (Express Wash, Refresh Package, Restore Package); updated again 2026-09-17 to Refresh Detail / Restore Detail (cards, booking form dropdown, About/FAQ copy) to match Silas's real pricing sheet.*
- [x] ~~Add a fleet service section~~ — *scrapped 2026-09-16, decided against a dedicated section. Fleet is still mentioned in About/FAQ, and "Fleet Service" is selectable in the Get a Quote form's Service dropdown.*
- [x] Scroll-triggered fade-in animations — *added, then removed, then re-added 2026-09-17 as one-way only (IntersectionObserver + `.reveal`/`.reveal-dN` classes across every section). Reveals once as you scroll down and stays visible — does not fade back out on scroll-up (that bidirectional version was tried and explicitly rejected).*
- [x] ~~Surface add-ons on the site~~ — *decided 2026-09-17: add-ons will not be shown on the site (see Waiting on Silas above).*
- [x] Address the "bland/not professional" feedback — *2026-09-17: worked through the typography/spacing/imagery punch-list (cards → background → icons → copy → transitions): card depth (ambient shadows + hover lift/glow), teal/pink-tinted background bubbles, adaptive-speed one-way scroll-reveal, SVG icon accents on About badges + Contact cards, lighter `--gray` for better body-copy contrast, and gradient-fade transitions on `.section-dark` (soft blend into/out of the surrounding black sections instead of a hard color cut) are all live. Real per-vehicle-size pricing also landed, replacing the pricing section's placeholder numbers. Closed out the remaining piece we could control without Silas: the hero photo, 5-slot photo strip, and 8 before/after gallery slots all had the same harsh gray/black caution-tape stripe pattern — replaced with a soft teal/pink radial glow (matching the site's background bubbles), a dashed border, and a camera-glyph icon above the label, so the slots read as "photo pending" instead of "broken image." Hero/photo-strip labels reworded to "Photo Coming Soon"; Before/After pill labels kept as-is.* Actual photos/videos still need Silas — that part can't be finished without him, everything else that was in our control is done.
- [ ] Optimize the page for mobile format — noted 2026-09-15. *2026-09-17: fixed horizontal page overflow (unwrapped email in Contact section) and hid the hero visual (ribbon + vehicle photo placeholder) entirely on mobile instead of just shrinking it; reordered Contact cards on mobile (Email on top, Phone + Service Area side by side below). Broader mobile polish still unscoped.*
- [x] Remove the "we bring water and power" claim — *2026-09-18: Silas doesn't actually bring water/a generator to jobs. Removed from the About section's "We Come To You" badge and the FAQ's "Do I have to drop my car off somewhere?" answer; both now just say we come to the customer, no mention of supplying water/power.*

## Open Decisions

- [x] **Pricing conflict** — *fixed 2026-09-16: FAQ's "base rates start at $80" corrected to $89 to match the Express Wash card. Both now say pricing starts there and varies by size/condition.*
- [x] Which external site should "Book Now" redirect to? — *decided and wired 2026-09-17: Jobber (see Build Next above).*
- [x] What should the Get a Quote form actually collect vs. the old booking form? — *simplified 2026-09-17: replaced the cascading Vehicle Make/Model selects (+ "Other" specify fields) with one free-text "Vehicle Year, Make & Model" input. Form is down to 7 fields: Name, Phone, Email, Service, Preferred Date (optional), Vehicle, Location.*
- [x] Confirm About/FAQ copy with partner — *signed off 2026-09-17, real copy stays as-is.*
- [x] Backend approach — *decided 2026-09-16: custom Express relay in its own Docker service (`server/`), sends via Gmail SMTP rather than a raw mail server.*

## Deployment

- [x] Hosting stack decided — *2026-09-17: Spaceship (domain registrar) → Cloudflare (DNS + WAF + free SSL + CDN, proxied) → DigitalOcean (VPS running the existing `docker-compose.yml` stack, Basic Droplet 1GB/1vCPU/25GB ~$6/mo). Registrar/DNS/host deliberately split across 3 providers, all standard practice.*
- [x] Jobber account set up, Online Booking configured — *2026-09-17: "SudZ Mobile Detailing" business live in Jobber. Online payments show "Finish Verification" still pending in Jobber's dashboard — needed before funds can actually deposit to the bank account.*
- [x] Rebuilt the Jobber booking form to match a competitor's (C&C Details) simpler single-page format — *2026-09-17: the original "Assessment Booking Form" is a Jobber Booking-type form, which Jobber forces into a multi-step/multi-page flow with live self-scheduling (cannot be made single-page). Built a new "Booking Request Form" instead — Jobber's Request-type form, inherently single-page, no live scheduler. Removed Email/Company name fields; kept Name, Phone+SMS, Address, free-form description (later removed by Silas), image upload. Added: "Select Your Package" dropdown (Express Wash/Refresh Detail/Restore Detail/Fleet Service/Not sure yet, required), "Optional Add-Ons" checkbox list with the 6 real add-on prices (Wax/Sealant+Clay Mitt $50, Dog Hair Removal $60/$80 severe, Seat Shampoo $25/seat, Headliner Cleaning $30, Odor/Smoke Treatment $50, Biohazard Surcharge $75+), and "Vehicle year, make & model". Silas then converted "How did you hear about us?" to multi-select with an "Other" field. This new form can only be set as Jobber's "Request default" (not "Booking default" — that designation is exclusive to Booking-type forms like the old Assessment form, a Jobber platform constraint). All 4 site "Book Now" CTAs repointed to it (`https://clienthub.getjobber.com/hubs/3afedfa0-1c90-452c-a0af-f460705e501e/public/requests/5193018/new`). Silas then set it as Jobber's "Request default" himself (replacing "Default Form"). Also repointed the Google Business Profile "Book Online" button (Settings → Google Business Profile → "Use This Form") from "Default Form" to this new form, so Google's listing now matches the site. "Default Form" is now unused (0 places). The old "Assessment Booking Form" is left in place, still Jobber's Booking default, but no longer linked from the site or Google.*
- [ ] Register the domain via Spaceship — was checking `sudzmobiledetailingva.com` availability
- [ ] Create Cloudflare account, add the domain, point nameservers at Cloudflare
- [ ] Spin up the DigitalOcean droplet, SSH in, `git clone` the repo, populate `server/.env`, `docker compose up -d --build`
- [ ] Point Cloudflare DNS A record at the droplet's IP (proxied, orange-cloud on)
- [ ] Once Cloudflare is proxying: update `nginx.conf` to trust Cloudflare's IP ranges / read `CF-Connecting-IP` so rate limiting on `/api/quote` keys on the real visitor, not Cloudflare's edge IP (flagged during planning, not yet implemented — only matters once Cloudflare is actually in front)

---

## Project notes

- Code: `C:\Users\Matth\Desktop\SUDZ-website` → [github.com/PlasteredObjct/sudz-website](https://github.com/PlasteredObjct/sudz-website) (`main`)
- Pushed through commit `5bd6d76`. Nothing uncommitted.
- `server/.env` (gitignored, local only) has the real Gmail App Password for `sudzmobiledetailing8@gmail.com` — never commit this file. Regenerate/revoke the App Password from the Gmail account's Security settings if it's ever compromised.
- Local dev server: `preview_start` name `sudz-site`, port 5173 (static only — the `/api/quote` backend isn't reachable through this, so quote-form submissions will show the fallback error message here by design).
- Full stack (static site + quote backend, for testing real email sends): `preview_start` name `sudz-fullstack`, or `docker compose up --build`, at port 8080. Requires `server/.env` populated (copy from `server/.env.example`, needs a real Gmail App Password) or the backend container will fail to send mail.
- Bump the `?v=N` query on `style.css` / `script.js` in `index.html` after editing them, or browsers serve stale cached copies.
- The Dockerfile must `COPY assets/` explicitly — otherwise the logo breaks in the container.
