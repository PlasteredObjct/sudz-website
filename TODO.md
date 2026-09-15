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

- [ ] Package detail modal — clicking a package card opens in-depth info + available add-ons
- [ ] Convert "Book Now" section into a "Get a Quote" section
- [ ] Point "Book Now" (nav + buttons) to an external booking site instead of the on-page form
- [ ] Wire up a backend for the Get a Quote form (email and/or database)
- [ ] Rename packages to match Silas's naming — Express → Express Wash, Refresh → Refresh Package, Restore → Restore Package
- [ ] Add a fleet service section — currently only mentioned in About/FAQ, has no section of its own
- [ ] Surface add-ons on the site (wax, headlight restoration) — feeds the package modal

## Open Decisions

- [ ] **Pricing conflict** — cards show fixed $89/$139/$219, but Silas's FAQ says base rates start at $80 and vary by size/condition, confirmed before work begins. The site currently tells two different stories. *Biggest blocker to launch.*
- [ ] Which external site should "Book Now" redirect to? (Jobber, Square Appointments, Calendly, etc.)
- [ ] What should the Get a Quote form actually collect vs. the old booking form?
- [ ] Confirm About/FAQ copy with partner — real copy is in and uncommitted, pending sign-off
- [ ] Backend approach — custom server in Docker vs. third-party form service (Formspree, etc.)

---

## Project notes

- Code: `C:\Users\Matth\Desktop\SUDZ-website` → [github.com/PlasteredObjct/sudz-website](https://github.com/PlasteredObjct/sudz-website) (`main`)
- Pushed through commit `0d945f3`. **Uncommitted:** About + FAQ sections, held for partner review.
- Local dev server: `preview_start` name `sudz-site`, port 5173. Docker: `docker build -t sudz-website . && docker run -d -p 8080:80 sudz-website`
- Bump the `?v=N` query on `style.css` / `script.js` in `index.html` after editing them, or browsers serve stale cached copies.
- The Dockerfile must `COPY assets/` explicitly — otherwise the logo breaks in the container.
