# Verification — 29 October 2026

## Passed locally

- Production `npm run build`: static export, home and three project detail routes (DARS, CLMS, Cozzee).
- TypeScript checks and ESLint.
- Four game-rule tests: scroll bounds/reversal, score and pause behavior, collisions and delta clamping, finish/reset.
- Chrome against the exported `out/` directory: desktop scene render, Simple mode canvas disposal and saved preference, Explore reentry, play/pause/resume, loss/restart, exit restoring scroll position, direct DARS URL and its three screenshots.
- Mobile 390 × 844: no horizontal overflow, reduced-motion defaults to Simple, Explore renders.
- JavaScript disabled: project information remains in HTML.
- WebGL creation failure: Simple fallback works.
- Sanity Studio bundles with a placeholder project ID. This validates the editor build, not account connectivity or publishing.

Browser smoke checks are reproducible with the preview running at port 3000: `node scripts/browser-check.mjs`. They use installed Chrome and software WebGL, and save images under `test-results/`.

## Not claimed

- Real Sanity account connection, content migration into Sanity, authenticated editing, or publishing webhook operation. These require the owner's project and hosting configuration.
- Public deployment.
- Physical mobile GPU performance or a measured Lighthouse score. Headless software rendering is functional validation, not a device benchmark.

## Environment detail

Turbopack could not start its CSS worker in this Windows environment. Development and production scripts use the supported Webpack option. Package lockfiles preserve the installed dependencies.

## Content release review

The CV supplies the biography, skills, email, education, and downloadable resume. The resume includes a telephone number. Source screenshots include application records; confirm that all visible records are suitable for public display before deployment. Original files remain in `content-source`, outside the exported public assets.

## Background, endless play, and night-mode update

- Five rule tests now cover unbounded forward movement, reset, and constant-size terrain windows up to row 1,000,000, alongside collisions, pause, and scroll mapping.
- Browser checks cover Emman branding; day/night scene synchronization; theme persistence on project pages; large and reverse scroll targets; a 49-row terrain window; signs hidden in Play and restored on exit; desktop/mobile night screenshots.
- Play no longer has a win state at row 36. Explore uses document pixels rather than the former fixed 36-row route.

## Mobile, movement, and contact update

- Phone Explore scene reduced from 43svh to 37svh (about 14%). Scene stacks above scrolling information; section anchors account for it.
- Chrome checks passed at 320, 390, and 768 pixels: contact layout has no horizontal overflow and native form validation accepts valid input. Portrait stacking and landscape game layout inspected.
- Four movement headings verified in Play, including the first hop. Vehicles now have two lamps on their forward end.
- `/contact/` is statically exported. The contact form opens a mailto draft in the visitor's email application; it does not send mail or store messages. Real-device keyboard and external email-client behavior have not been measured.

## Random traffic update

Six rule tests pass, including same-seed reproducibility, different-seed variation, speed/count bounds, spacing across 4,440 lane/seed combinations, and collision agreement with seeded car positions. Traffic difficulty ramps over 100 rows. This is an initial tuning pass, not a claim of playtested difficulty for every player.
