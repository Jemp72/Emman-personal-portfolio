# Emman's woodland portfolio

For the complete owner/developer guide, see [Portfolio Maintenance Handbook](PORTFOLIO_HANDBOOK.md). It covers content editing, setup, code structure, fonts, layout, gameplay, dependencies, verification, publishing, and recovery.

Static Next.js portfolio with direct Three.js. Explore, Play, and Simple share the same content. The source material lives in `content-source`; optimized public copies live in `public/media`.

## Local development

Node 22+ and npm are required. Run `npm ci`, then `npm run dev`. Open http://localhost:3000. Use `npm run build` to generate `out/`; use `npm run preview` to serve that export. No running Next.js server is needed in production.

Checks: `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`. Regenerate image derivatives with `node scripts/assets.mjs` after adding supplied source images. The generated asset manifest is checked into the project.

See `VERIFICATION.md` for the completed checks and their limits. With the preview running, `node scripts/browser-check.mjs` runs the Chrome smoke checks. The Windows build uses Webpack because Turbopack's CSS worker failed to start in this environment.

## Content

Pages CMS edits `src/content/portfolio.json` and stores uploads under `public/cms-media`. The GitHub Pages workflow rebuilds the static site after edits are saved to main. See [Content editing](CONTENT_EDITING.md) for setup and publishing. The existing Sanity project is retained as an archive.

## Interaction and implementation

Simple mode and no-JavaScript output use semantic HTML. Preference is remembered in localStorage; first-time reduced-motion visitors receive Simple. Three.js is dynamically imported only in Explore. WebGL failure offers a Simple fallback. Game scores are local to the browser.

Arrow keys/WASD or on-screen buttons move the frog. Escape pauses. Hidden tabs pause the game. Exit restores the previous scroll position. The scene is disposed when Simple mode is selected. Gameplay logic is independently tested under `tests`.

Mobile Explore keeps a compact scene above the content to preserve reading space; Play opens it full-screen. Artwork opens the original optimized image in a new tab. No multiplayer, analytics, or shared leaderboard is included.

## Explore and night mode

The world fills the background and blends into the content with gradients. Every 120 pixels of document scrolling maps to one row; larger jumps make a longer frog hop, and reversing scroll reverses its direction. New scroll targets replace the previous target rather than accumulating animation tasks. Section landmarks track the document layout. Portfolio information reveals on entry, with motion disabled in Simple and reduced-motion modes.

The moon/sun control persists light/dark preference (initially follows the system) and updates the page, moonlight, ambient light, stars, and car lamps together. It is also available in Play and on project pages.

Play is endless. Only 49 terrain rows near the frog are kept in memory, and distant rows are regenerated deterministically when needed. Portfolio signs and posts are hidden while playing. Controls, collisions, pause, restart, local best, and exit restoration retain their behavior.

## Contact page

`/contact/` offers an accessible name/email/topic/message form and a direct email link. Submitting opens a prefilled draft in the visitor's email app; the visitor sends it there. No mail server, form service, or hidden message storage is configured.

## Traffic difficulty

Each Play run gets a new random seed. Lanes use deterministic values derived from that seed so rendering and collision detection agree: randomized directions, lane speeds, offsets, and 1–3 vehicles. The first 12 rows use two cars per road; speed and the chance of three-car lanes rise over the first 100 rows and then level off. Cars in each lane share a speed, preventing overtaking/overlap, and randomized spacing retains a safe gap. Explore remains frozen. Each vehicle has two forward headlights, glowing at night. Rear lights were removed for visual simplicity.

## GitHub Pages

The workflow builds on pushes to main and publishes `out/` through GitHub Actions. It sets the repository base path and public site origin in the build environment.

## Typography

Space Grotesk is the primary typeface for body text, navigation, and the technical headline. Lora adds a calligraphic accent to the creative headline and other display text. Roboto Mono is used for small labels and metadata. Fonts are bundled by Next.js for self-hosted delivery.


## Certifications

Add certificate details and upload a PDF or image in Pages CMS, or provide an external credential URL. The public site displays the details and a link to view the certificate.
