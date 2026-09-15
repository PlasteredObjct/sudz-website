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
- [ ] Full add-on list + pricing per package
- [ ] Add-on pricing specifically (wax, headlight restoration) — names known, prices not
- [ ] Fleet service pricing/details — flat rate per vehicle; what's the rate and what's included?

## Build Next

- [x] Package detail modal — *added 2026-09-15, clicking anywhere on a package card (or "View Full Details") opens a modal with a What's Included list and a description section. Description text is a `[Placeholder]` template — swap in real per-package write-ups once ready. Add-ons aren't surfaced in it yet.*
- [x] Make service locations more visible — *added 2026-09-15, a "Now Serving..." banner sits right under the header, visible without scrolling. Original Service Area box in Contact section at the bottom kept as-is.*
- [ ] Convert "Book Now" section into a "Get a Quote" section
- [ ] Point "Book Now" (nav + buttons) to an external booking site instead of the on-page form
- [ ] Wire up a backend for the Get a Quote form (email and/or database)
- [x] Rename packages to match Silas's naming — *done 2026-09-15, cards, booking form dropdown, and package modal all updated: Express Wash, Refresh Package, Restore Package*
- [ ] Add a fleet service section — currently only mentioned in About/FAQ, has no section of its own
- [ ] Surface add-ons on the site (wax, headlight restoration) — feeds the package modal
- [ ] Optimize the page for mobile format — noted 2026-09-15, not scoped yet

## Open Decisions

- [ ] **Pricing conflict** — cards show fixed $89/$139/$219, but Silas's FAQ says base rates start at $80 and vary by size/condition, confirmed before work begins. The site currently tells two different stories. *Biggest blocker to launch.*
- [ ] Which external site should "Book Now" redirect to? (Jobber, Square Appointments, Calendly, etc.)
- [ ] What should the Get a Quote form actually collect vs. the old booking form?
- [ ] Confirm About/FAQ copy with partner — real copy is committed and live, pending sign-off
- [ ] Backend approach — custom server in Docker vs. third-party form service (Formspree, etc.)

---

## Project notes

- Code: `C:\Users\Matth\Desktop\SUDZ-website` → [github.com/PlasteredObjct/sudz-website](https://github.com/PlasteredObjct/sudz-website) (`main`)
- Pushed through commit `80f8dee`. **Not yet pushed:** package renaming and this TODO update (local commits `6b11338` and later).
- Local dev server: `preview_start` name `sudz-site`, port 5173. Docker: `docker build -t sudz-website . && docker run -d -p 8080:80 sudz-website`
- Bump the `?v=N` query on `style.css` / `script.js` in `index.html` after editing them, or browsers serve stale cached copies.
- The Dockerfile must `COPY assets/` explicitly — otherwise the logo breaks in the container.
