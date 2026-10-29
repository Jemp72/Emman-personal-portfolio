# Emman's woodland portfolio

Static Next.js portfolio with direct Three.js. Explore, Play, and Simple share the same content. The source material lives in `content-source`; optimized public copies live in `public/media`.

## Local development

Node 22+ and npm are required. Run `npm ci`, then `npm run dev`. Open http://localhost:3000. Use `npm run build` to generate `out/`; use `npm run preview` to serve that export. No running Next.js server is needed in production.

Checks: `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`. Regenerate image derivatives with `node scripts/assets.mjs` after adding supplied source images. The generated asset manifest is checked into the project.

See `VERIFICATION.md` for the completed checks and their limits. With the preview running, `node scripts/browser-check.mjs` runs the Chrome smoke checks. The Windows build uses Webpack because Turbopack's CSS worker failed to start in this environment.

## Content

Without a Sanity project ID, the app uses the owner's supplied content in `src/content/local.ts`, not fabricated samples. CV-derived biography and skills and project descriptions have been transcribed there. AGAP screenshots belong to DARS, as confirmed by the owner. Artwork titles currently follow supplied filenames and can be refined in the CMS. No portrait or unprovided demo links are invented.

The provided PDF is downloadable at `/resume.pdf` and contains the owner's contact details. Review this and screenshot contents before public deployment. Source files are outside `public` and not included in the static export.

## Sanity setup (account configuration required)

1. Create a Sanity project and production dataset in your account.
2. In `studio`, copy `.env.example` to `.env.local`, set your project ID, run `npm install`, and `npm run dev`. Sign in with Sanity. Invite only intended editors through Sanity project permissions.
3. Create one Site settings document, skill groups, projects, and artwork. Use the local content and supplied files as the source. Upload images and resume. Set numerical order fields to control ordering. Publish each document. This initial entry/upload step is manual.
4. Copy the root `.env.example` to `.env.local` and set `SANITY_PROJECT_ID` and dataset. For a private dataset use a read-only `SANITY_READ_TOKEN`. Never prefix the token with `NEXT_PUBLIC_` or use a write token.
5. Run the production build. A configured CMS failure or missing settings fails the build. It never silently replaces CMS content with the local copy.
6. Run `npm run deploy` inside `studio` to publish the independently hosted editor. Sanity handles authentication. The portfolio only reads published content at build time.

## Static deployment and publishing

Set `SITE_URL` to your actual public origin (for example, your custom domain) for social metadata. Connect this repository to Vercel. Use `npm run build`, output directory `out`, and the root Sanity environment variables. The exported site uses trailing-slash routes, including `/projects/dars/`; the static host must serve directory `index.html` files. The current configuration assumes deployment at the domain root.

Create a Vercel deploy hook under project Settings → Git. Add its private URL as a Sanity webhook (POST), triggered by create/update/delete of published settings, skillGroup, project, or artwork documents. Exclude draft documents with `!(_id in path("drafts.**"))`. Never put the deploy hook URL in browser code. Publish a harmless content edit and verify a successful deployment before relying on the flow. New project URLs require a rebuild. Existing deployment remains available if a build fails.

## Interaction and implementation

Simple mode and no-JavaScript output use semantic HTML. Preference is remembered in localStorage; first-time reduced-motion visitors receive Simple. Three.js is dynamically imported only in Explore. WebGL failure offers a Simple fallback. Game scores are local to the browser.

Arrow keys/WASD or on-screen buttons move the frog. Escape pauses. Hidden tabs pause the game. Exit restores the previous scroll position. The scene is disposed when Simple mode is selected. Gameplay logic is independently tested under `tests`.

Mobile Explore keeps a compact scene above the content to preserve reading space; Play opens it full-screen. Artwork opens the original optimized image in a new tab. No multiplayer, analytics, or shared leaderboard is included.

## Remaining release work

Connect and populate Sanity, configure hosting and the deploy webhook, review personal content and public screenshots, and measure performance on real mobile hardware. No account connections or public deployment are implied by the local implementation.

## Explore and night mode

The world fills the background and blends into the content with gradients. Every 120 pixels of document scrolling maps to one row; larger jumps make a longer frog hop, and reversing scroll reverses its direction. New scroll targets replace the previous target rather than accumulating animation tasks. Section landmarks track the document layout. Portfolio information reveals on entry, with motion disabled in Simple and reduced-motion modes.

The moon/sun control persists light/dark preference (initially follows the system) and updates the page, moonlight, ambient light, stars, and car lamps together. It is also available in Play and on project pages.

Play is endless. Only 49 terrain rows near the frog are kept in memory, and distant rows are regenerated deterministically when needed. Portfolio signs and posts are hidden while playing. Controls, collisions, pause, restart, local best, and exit restoration retain their behavior.

## Contact page

`/contact/` offers an accessible name/email/topic/message form and a direct email link. Submitting opens a prefilled draft in the visitor's email app; the visitor sends it there. No mail server, form service, or hidden message storage is configured.

## Traffic difficulty

Each Play run gets a new random seed. Lanes use deterministic values derived from that seed so rendering and collision detection agree: randomized directions, lane speeds, offsets, and 1–3 vehicles. The first 12 rows use two cars per road; speed and the chance of three-car lanes rise over the first 100 rows and then level off. Cars in each lane share a speed, preventing overtaking/overlap, and randomized spacing retains a safe gap. Explore remains frozen. Each vehicle has two forward headlights, glowing at night. Rear lights were removed for visual simplicity.

## GitHub Pages

The Pages workflow builds on pushes to main and publishes out/. In repository Settings > Pages, select GitHub Actions. Expected URL: https://Jemp72.github.io/Emman-personal-portfolio/ . The workflow sets NEXT_PUBLIC_BASE_PATH=/Emman-personal-portfolio; omit this for local development or root-domain hosting. Configure Sanity project/dataset as repository variables and its read token as a secret when connecting the CMS. CMS changes require a new workflow run.
