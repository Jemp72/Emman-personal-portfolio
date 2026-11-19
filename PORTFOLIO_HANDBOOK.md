# Emman's Portfolio Owner and Maintenance Handbook

Based on repository inspection on 19 November 2026. This guide is for maintaining the site independently or handing it to another developer.

Repository — https://github.com/Jemp72/Emman-personal-portfolio

Live portfolio — https://jemp72.github.io/Emman-personal-portfolio/

Local folder — C:\Emman Files\VS code projects\MyPortfolio

## Contents

1. [Ownership and architecture](#1-ownership-and-architecture)
2. [Setup and daily development](#2-setup-and-daily-development)
3. [File map](#3-file-map)
4. [Edit content with Pages CMS](#4-edit-content-with-pages-cms)
5. [Edit JSON and extend the content model](#5-edit-json-and-extend-the-content-model)
6. [Images and documents](#6-images-and-documents)
7. [Pages, routes, and metadata](#7-pages-routes-and-metadata)
8. [Fonts and typography](#8-fonts-and-typography)
9. [Sizing and layout](#9-sizing-and-layout)
10. [Colors, themes, and effects](#10-colors-themes-and-effects)
11. [Explore and game architecture](#11-explore-and-game-architecture)
12. [Game and camera recipes](#12-game-and-camera-recipes)
13. [Contact and admin](#13-contact-and-admin)
14. [Dependencies and upgrades](#14-dependencies-and-upgrades)
15. [Testing](#15-testing)
16. [Publishing](#16-publishing)
17. [Recovery and troubleshooting](#17-recovery-and-troubleshooting)
18. [Long-term maintenance and handoff](#18-long-term-maintenance-and-handoff)

## 1. Ownership and architecture

### Your AI subscription

The portfolio is a normal Git repository. Its source, Git history, installed editor, and generated export remain usable independently of an AI assistant. GitHub Pages serves generated HTML, CSS, JavaScript, images, and documents. Your AI subscription is outside the visitor's request path.

You can maintain the site with Git, Node.js, npm, VS Code, PowerShell, a browser, and your GitHub account. Pages CMS and hosting have their own availability, account settings, and terms.

### Content-to-site flow

```text
Pages CMS form or manual JSON edit
  -> src/content/portfolio.json and public/cms-media/
  -> GitHub commit on main
  -> GitHub Actions installs, checks, and builds
  -> Next.js exports out/
  -> GitHub Pages serves out/
```

Published content is baked into the export. Visitors do not query a CMS database when opening your projects. Saving an edit needs a successful deployment before it appears publicly.

### Technology roles

- Next.js App Router organizes routes, generates metadata, and exports pages.
- React creates the interface and manages modes, theme controls, and game overlays.
- TypeScript checks data shapes and function inputs.
- Direct Three.js creates the WebGL woodland, camera, lights, frog, and vehicles.
- Tailwind CSS v4 is connected through PostCSS. Most of the design is ordinary CSS in globals.css.
- Pages CMS edits repository content through forms.
- GitHub Actions verifies/builds the export.
- GitHub Pages serves the files.
- next/font bundles fonts after obtaining them during the build.

Server Components run during the build. The server-only import in the content loader enforces a code boundary and does not require a production Next server.

### Modes

Explore maps document scroll to frog destinations. Play uses the shared world for an endless crossing game. Simple presents semantic HTML and avoids importing the Three.js scene. First-time reduced-motion visitors receive Simple.

### Current content versus historical Sanity

The active loader imports src/content/portfolio.json. Root dependencies and the Pages deployment use Pages CMS.

Historical files remain in studio/, .sanity-import/, src/content/local.ts, scripts/export-content.ts, and scripts/cms-revision.mjs. The environment example and early plans also reference Sanity. Editing Sanity alone does not update the current site. Use load.ts, portfolio.json, .pages.yml, and the Pages workflow as the publishing authority.

## 2. Setup and daily development

### Required tools

Use Node.js 22 as the baseline because Actions uses Node 22. npm comes with Node. Install Git and an editor. Existing browser scripts expect Google Chrome.

```powershell
node --version
npm --version
git --version
```

Reopen your terminal after installations if commands are unavailable.

### Open the existing project

```powershell
Set-Location 'C:\Emman Files\VS code projects\MyPortfolio'
git status
npm ci
npm run dev
```

Open the address printed by Next, usually http://localhost:3000/. Keep that terminal running. Ctrl+C stops it.

npm ci installs the lockfile versions and replaces the dependency tree. Use it for setup or dependency changes, with the server stopped. You do not need a reinstall for every CSS edit.

### Another computer

```powershell
git clone https://github.com/Jemp72/Emman-personal-portfolio.git
Set-Location Emman-personal-portfolio
npm ci
npm run dev
```

The public content is in the repository. Sanity credentials are unnecessary for the current loader.

### Local environment

The existing .env.example includes historical Sanity settings. For current ordinary development, .env.local can contain:

```dotenv
SITE_URL=http://localhost:3000
NEXT_PUBLIC_BASE_PATH=
```

Leave the local prefix empty for simple local URLs. Restart after environment changes. Never put private credentials in NEXT_PUBLIC_ variables.

### Another port

```powershell
node node_modules/next/dist/bin/next dev --webpack --port 3016
```

Open the printed address. The browser scripts use port 3000, so adjust their URLs when using another port.

### Production preview

```powershell
npm run build
npm run preview
```

serve prints its address. To choose port 3000:

```powershell
node node_modules/serve/build/main.js out -l 3000
```

out/ is a snapshot. Rebuild after source changes. A build with the Pages prefix expects files mounted under /Emman-personal-portfolio/. For a simple root preview, build with an empty prefix.

## 3. File map

### Interface

- src/app/layout.tsx loads fonts, CSS, theme button, skip link, and metadata.
- src/app/page.tsx renders homepage sections.
- src/app/globals.css contains typography, spacing, colors, gradients, responsive behavior, cursor, and effects.
- src/app/projects/[slug]/page.tsx renders project details.
- src/app/contact/page.tsx is the contact layout.
- src/app/admin/page.tsx links to the editor and publishing status.
- src/app/not-found.tsx is the missing-page UI.
- src/components/Experience.tsx coordinates modes, scroll, scene loading, navigation, controls, overlays, focus, and best score.
- src/components/ThemeToggle.tsx coordinates theme preference and sweep.
- src/components/ContactForm.tsx prepares an email draft.

### Content

- src/content/portfolio.json is the active editable data.
- src/content/types.ts defines Portfolio and Project.
- src/content/load.ts fills optional lists, validates slugs, and normalizes paths.
- src/content/path.ts adds the hosting prefix.
- .pages.yml defines the CMS form and upload folders.
- public/cms-media/ stores CMS uploads.
- public/media/ stores earlier optimized files.
- content-source/ holds original supplied material where retained.

### Game

- src/three/game.ts holds pure movement, score, collision, traffic, scroll, and terrain-window rules.
- src/three/scene.ts creates/animates/disposes the world.
- src/three/konami.ts matches the admin shortcut.
- tests/game.test.ts and tests/konami.test.ts verify rules.

### Configuration and tools

- package.json defines commands and dependency ranges.
- package-lock.json fixes the resolved install.
- next.config.ts controls export, base path, trailing slashes, and images.
- tsconfig.json configures TypeScript and the @/ import alias.
- postcss.config.mjs connects Tailwind.
- eslint.config.mjs controls linting.
- .github/workflows/pages.yml builds/deploys the site.
- scripts/browser-check.mjs and mobile-contact-check.mjs automate browser checks.
- scripts/assets.mjs converts original images.
- AGENTS.md instructs coding assistants, including auto commit/push.
- PRODUCT.md records durable product facts.
- .impeccable/ and .codex/hooks.json are optional assistant/design tooling.

node_modules/, .next/, out/, test-results/, and TypeScript cache files are generated/local. Edit the sources that create them. Actions uploads out/ as an artifact; it does not need to be committed.

## 4. Edit content with Pages CMS

1. Open https://app.pagescms.org/.
2. Sign in with GitHub.
3. Choose Jemp72/Emman-personal-portfolio and main.
4. Open Portfolio content.
5. Edit, add, delete, or reorder entries.
6. Save.
7. Watch the matching Actions deployment.
8. Refresh the public site after deployment succeeds.

If the repository is missing, inspect the Pages CMS GitHub App installation and grant repository access.

The form supports profile information, education, résumé, portrait/alt, branding, socials/logos, skill groups, projects, artwork, and certifications. Fonts, layout, game rules, and some interface wording need code edits.

### Add a project

Fill a unique lowercase slug, title, short summary, detailed body, technologies, and screenshots. The first screenshot is the homepage image. Source/demo are optional full HTTP(S) URLs.

Save and check the homepage card and generated detail route. Reordering changes homepage order. Deleting removes the route from the next export. Keep slugs stable when possible because they determine public URLs.

### Certifications

Enter title, issuer, optional date/type/description, and a PDF/image URL or external URL. Use YYYY-MM-DD dates. If both URL fields exist, uploaded url wins. Entries without an accepted URL are omitted. Invalid dates can fail date formatting during build.

### Branding and profile

Portrait crop/size live in CSS. Social logos are optional; readable names remain. Use full HTTPS social URLs. A configured logo replaces the header fallback, and a configured favicon overrides the default icon. Favicons may require a private window to bypass browser caching.

Deleting an entry does not necessarily delete its uploaded files. Check references before removing media.

## 5. Edit JSON and extend the content model

Open src/content/portfolio.json. JSON requires double quotes, commas between entries, matching braces/brackets, and no comments/trailing commas.

Validate syntax:

```powershell
node -e "JSON.parse(require('node:fs').readFileSync('src/content/portfolio.json','utf8')); console.log('JSON valid')"
```

This only checks syntax. Build/typechecking check additional rules.

### Project example

Add an object like this to projects, adapting all example values and creating the referenced file:

```json
{
  "slug": "campus-booking",
  "title": "Campus Booking",
  "summary": "A short factual description of your work.",
  "body": "Explain the problem, your contribution, implementation, and outcome.",
  "technologies": ["TypeScript", "React"],
  "images": ["/cms-media/campus-booking.webp"],
  "source": "https://github.com/your-account/your-repository",
  "demo": "https://your-demo.example"
}
```

Omit unavailable source/demo fields. Body currently renders in one paragraph; Markdown syntax displays literally and normal HTML collapses whitespace. Rich text requires a rendering change.

### Other objects

Skill group:

```json
{"category":"Development","items":["TypeScript","React","Git"]}
```

Social:

```json
{"name":"GitHub","url":"https://github.com/Jemp72","logo":"/cms-media/github.svg"}
```

Gallery:

```json
{"title":"Artwork title","category":"Illustration","image":"/cms-media/art.webp","alt":"Describe the visual content.","description":"Optional context."}
```

Certificate:

```json
{"title":"Certificate title","issuer":"Organization","issuedOn":"2026-11-19","credentialType":"Participation","description":"Optional factual context.","url":"/cms-media/certificate.pdf"}
```

The loader creates certificate IDs. No editable id is required.

Use \n inside the JSON headline string to separate its two phrases. The first phrase receives the creative italic style. educationEntries is the current list of education strings; education is the older single-value fallback.

### Add a field

Usually update .pages.yml, types.ts, portfolio.json, the rendering page, and load.ts when defaults/path normalization are needed.

For an optional project role, add this under its YAML fields, aligned with title/summary:

```yaml
- name: role
  label: Role
  type: string
```

Add role?: string to Project, set it in the JSON, and render:

```tsx
{p.role && <p>{p.role}</p>}
```

Plain strings pass through the project's spread in load.ts. New file properties need sitePath normalization. New arrays/nested objects need safe defaults for older entries.

## 6. Images and documents

public/cms-media/example.webp becomes /cms-media/example.webp in editable data. Do not include public, Windows drive letters, or the repository prefix. The loader adds that prefix. Match case exactly for Linux hosting.

Use compressed WebP/AVIF for suitable photographs/screenshots, PNG for appropriate lossless/transparency needs, SVG for vector logos, and PDF for documents. A 1200–1600px screenshot often supports a 760px preview well; inspect real text readability before deciding compression.

The current portrait is a large PNG and could be replaced by a compressed derivative.

### Existing image conversion script

```powershell
node scripts/assets.mjs
```

It expects content-source/Portfolio/Artworks, Graphic design, and Projects. It processes PNG/JPEG, limits width to 1600 without enlargement, writes WebP quality 83 into public/media/, and regenerates assets.json.

It does not update active portfolio.json paths. Its source/destination folders must exist.

For replacement, upload first, change references, build/inspect, then remove the old file if unused:

```powershell
rg -n 'old-image.webp' src .pages.yml
```

Anything exported under public is accessible publicly. Inspect screenshots/PDFs before publication. Removing a file later does not erase it from Git history. If credentials are committed, revoke them and handle history cleanup separately.

## 7. Pages, routes, and metadata

Homepage order is home, about, skills, projects, certifications, gallery, socials, contact. Move complete section blocks to reorder. Keep IDs unique.

Experience.tsx maps seven section IDs to signs. scene.ts contains the corresponding sign list. Update them together, preserving order. Socials currently has no sign.

### Project routes

generateStaticParams() in projects/[slug]/page.tsx lists project slugs. dynamicParams is false. Pages are generated during the build. Unknown slugs cannot be created on demand by GitHub Pages.

The detail page shows title, summary, technologies, body, images, and optional HTTP(S) source/demo links.

### Add a route

Create src/app/uses/page.tsx:

```tsx
import { sitePath } from "@/content/path";

export default function UsesPage() {
  return (
    <main id="portfolio" className="detail">
      <a href={sitePath("/")}>Back home</a>
      <h1>My tools</h1>
      <p>Write your own tools and workflow here.</p>
    </main>
  );
}
```

The common layout adds a theme control and skip link. The portfolio ID is its destination. Read installed Next guides before version-sensitive changes.

### Add a homepage section

Add a section with a unique ID and semantic heading. Add navigation if appropriate. For a world sign, update both lists described above. For CMS editing, update schema/types/data/rendering. Verify scroll mapping and mobile spacing.

### Metadata

layout.tsx defines global title, description, Open Graph, fallback icon, and social image. Project metadata uses project content. Some identity text is hardcoded separately from the JSON, so update both when renaming. SITE_URL controls origin; basePath controls the repository prefix.

## 8. Fonts and typography

### Actual families

The active pairing is Space Grotesk for primary text, Lora for creative/emphasized display text, and Roboto Mono for selected metadata. Earlier discussion mentioned Nunito; layout.tsx is the current source of truth.

Font changes connect three things: the import/configuration, the variable attached to html, and CSS that consumes it.

### Replace the primary face with Nunito

Change the import in layout.tsx:

```tsx
import { Lora, Nunito, Roboto_Mono } from "next/font/google";
```

Replace the primary declaration:

```tsx
const space = Nunito({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space",
});
```

Keeping the identifier and CSS variable preserves references. If renaming them, update all references together. Build and inspect long project titles and the two-line hero because font widths vary.

### Replace Lora or Roboto Mono

Change the family import/configuration while retaining its CSS variable/html attachment, or rename all references. Check supported styles/weights. A family without italic needs an intentional creative treatment.

### Use local fonts

Place a licensed WOFF2 under src/app/fonts/:

```tsx
import localFont from "next/font/local";

const space = localFont({
  src: "./fonts/your-variable-font.woff2",
  variable: "--font-space",
  display: "swap",
});
```

Remove the unused Google family import. Multiple separate weights require a suitable multi-source declaration. Confirm redistribution rights. Local assets remove the Google build-time fetch for that family.

### Type sizes

Search .hero h1, .hero h1 .creative, .portfolio section > h2, .project-card h3, .intro, .project-meta, and .certification-meta in globals.css.

Shared tokens are --text-body at 1rem, --text-supporting at 0.9375rem, and --text-metadata at 0.75rem.

```css
font-size: clamp(1.5rem, 4.5vw, 3.25rem);
```

clamp sets minimum/fluid/maximum. rem responds to root sizing, and vw responds to viewport width.

Keep body text comfortable, paragraphs around 45–75 characters where practical, and adequate contrast. Existing balance/pretty wrapping is progressive enhancement. Allow long titles to wrap when necessary instead of forcing overflow. Check mobile, fallback fonts, and 200% zoom.

## 9. Sizing and layout

### CSS cascade

globals.css contains older base rules and later refinements. Search all occurrences before editing. Higher specificity, later rules, or media queries may win. DevTools Computed shows the effective value. Inspector edits are temporary; save the chosen values in source.

### Project previews

Explore currently sizes the entire card so text aligns with its image:

```css
html[data-mode="explore"] .project-card {
  width: min(85%, 760px);
  margin-inline: auto;
}
```

Increase 85% for relative width and 760px for the maximum. Both bounds matter. Simple uses available card width.

.project-image controls padding/frame. Its image fills the frame at aspect ratio 1.7. Larger ratio makes it shorter. cover crops to fill; contain shows the full image with potential empty space.

.projects controls card separation. .project-meta, h3, and p rules control internal grouping. Keep a larger gap between projects than within a project.

### Content/world split

The page layers a full-screen world behind content and gradients. A single ratio does not control it.

Later desktop Explore uses a 70% content width and 5% left margin. The gradient stays opaque across the content and fades toward the world. scene.ts uses w * 0.2 and halfWidth * 0.8 for camera composition. .world-caption places instructions/Play near the right edge.

For a substantial split change, coordinate content width, gradient stops, caption, and camera. The 80/20 comment describes visual intent rather than a literal grid.

### Mobile bottom world

Inspect the later max-width: 640px blocks for .world:not(.world-playing), .scene-host, its ::after gradient, .world-caption, and Explore .portfolio.

The scene docks at the bottom. svh follows small viewport height. Increase bottom content padding when increasing panel height so final links remain reachable. Verify landscape and touch scrolling. Earlier mobile rules remain, so inspect the active result.

### Other elements

.person-profile aligns bio/portrait. .profile-picture controls size/crop/radius. .about-note styles education. .skill-groups/.tags handle skills. .gallery controls art columns/heights. .social-list handles socials. The hero CTA has a 48px minimum height. Shared .dark-button affects other routes and game controls too.

## 10. Colors, themes, and effects

Light tokens include paper #f6f4eb, ink #263f32, muted #576455, line #daddcf, and accent #d3e5a7. Search the dark-theme block for night overrides and surface/header tokens.

Change both themes and measure text against the real blended background. Three.js colors are separate: theme() updates fog/background, directional/ambient light, stars, and headlamp emissive values. CSS alone does not recolor the world.

ThemeToggle stores portfolio-theme, writes html data-theme, and dispatches portfolio-theme. The scene listens for that event.

### Dusk/dawn sweep

Explore uses document.startViewTransition where supported. CSS nightfall-sweep/daylight-sweep lasts 640ms. Play, Simple, reduced motion, and unsupported browsers switch directly. The scene paints the new lighting synchronously before the incoming snapshot.

### Leaves/fireflies

Experience creates .world-atmosphere elements. woodland-leaf and woodland-firefly define CSS motion. Reduced motion hides them, and mobile hides some particles. Change the generated count or duration for a quieter effect.

### Cursor

Source assets include leaf-light.svg and leaf-dark.svg under src/app. Also search cursor: in CSS because some SVG data is embedded. Editing a separate SVG alone may not change embedded data. Verify contrast and pointer hotspot. Touch users have no desktop cursor.

## 11. Explore and game architecture

Experience manages interface state and scene refs. It imports scene.ts only in Explore, creates the scene in an effect, and disposes it on exit from that mode. Three.js handles frame animation without React state updates every frame.

scrollDestination converts document pixels into a row using PIXELS_PER_HOP = 120. Bigger values slow travel per scroll. Smaller values move farther. New destinations replace old targets, allowing reverse scroll and navigation jumps without an event queue.

Coordinates use X horizontally, Y vertically, and negative Z forward. An orthographic camera gives the isometric-like presentation.

Game state includes seed, X, row, highest score, time, status, and cooldown. Status is ready/playing/paused/lost. move() handles steps; tick() advances time and collisions.

The renderer and collision rules share traffic() and carX(). Keep seed/time/formulas aligned so cars collide where they appear.

Arrow keys/WASD/touch move, Escape pauses, hidden tabs pause, and exit restores prior scroll/focus. The underlying content/header are inert while playing. Preserve those accessibility behaviors when editing the overlay.

Stored keys are portfolio-mode, portfolio-theme, and frog-best. They are browser/origin-specific. Reset only your local preferences in DevTools Console:

```js
localStorage.removeItem("portfolio-mode");
localStorage.removeItem("portfolio-theme");
localStorage.removeItem("frog-best");
location.reload();
```

## 12. Game and camera recipes

### Geometry

box(parent,color,x,y,z,width,height,depth) builds a scaled cube with shared geometry/materials. Find const frog = new T.Group() for body parts. Test all four headings after edits. Collider sizing is separate from visible mesh sizing.

### Difficulty

traffic() ramps level over 100 rows. Increase that divisor for a slower ramp. Current speed has base 0.85, random contribution up to 0.9, and level contribution up to 1.4. Reduce these to ease traffic while keeping speed positive.

The first 12 rows use two cars per road, later roads one to three. scene.ts creates three potential meshes per road. A rule exceeding three needs more meshes.

Movement stays between -4 and 4 horizontally and nonnegative rows. Cooldown is 0.16 seconds. Collision threshold is 0.94 units on roads; reducing it is more forgiving. Frame dt is capped at 0.05 seconds.

isRoad uses remainders 2–4 of every six rows after the start. Change it deliberately and test lane generation/collisions. visibleRows retains center -18 through +30, totaling 49 rows. More rows cost objects and rendering work.

### Camera

resize() controls the orthographic view. Smaller view makes the frog larger. Mobile Explore uses 3.25; desktop and Play have separate calculations. The camera is near (10,12,z+12). Adjust position and target together.

Landmark arrivals feature Projects, Creative, and Say Hello. Search featuredLandmarks, framingTarget, and landmarkFraming. Maximum extra zoom is 10% desktop/5.5% mobile. Radius changes reach, exponential factor 5 changes settling. Play/reduced motion disable it.

### Vehicles/signs/theme

Two #fff1ad front lamps glow at night through emissive lighting. Rear lights were removed. Vehicle direction follows shared traffic. Signs use canvas text and sprite textures; ctx.font is separate from page fonts. Play hides signs.

### Performance/cleanup

Pixel ratio is capped at 1.6, shadows at 1024px. Raising them increases GPU cost. Preserve material/geometry sharing. New textures/timers/listeners need disposal. Existing dispose() handles animation, observers, resources, canvas, and events.

Explore still schedules callbacks and some bookkeeping while idle, though rendering is guarded. Reducing idle work is a possible future optimization.

## 13. Contact and admin

ContactForm builds a mailto URL. It opens the visitor's email app with a draft; the visitor sends it. The site does not store/deliver the message itself.

Edit destination email in content. Subject choices and UI labels are in ContactForm.tsx. Direct server delivery needs an external service/backend with validation, abuse control, and success/failure handling.

On the homepage outside Play, enter Up Up Down Down Left Right Left Right B A for /admin/. Editable fields ignore it. This is a discovery shortcut. Write authorization happens at Pages CMS/GitHub.

## 14. Dependencies and upgrades

package.json declares allowed ranges, while package-lock.json fixes resolved versions. Inspect installed versions:

```powershell
npm ls --depth=0
npm ls next react react-dom three typescript
```

Runtime ranges are Next ^16.0.0, React/React DOM ^19.2.0, and Three ^0.180.0. Caret ranges can allow newer compatible releases when the lock changes.

Development tools include TypeScript, @types for Node/React/DOM/Three, Tailwind/PostCSS, ESLint/Next config, tsx for TypeScript tests, Playwright for browser automation, serve for preview, and sharp for conversion.

private: true prevents npm publication; it does not make GitHub private.

Upgrade procedure:

1. Commit/pull current work.
2. Use a branch for substantial upgrades.
3. Inspect npm outdated and migration notes.
4. Upgrade related packages deliberately.
5. Run lint/tests/typecheck/build and browser checks.
6. Commit package.json and lockfile together.
7. Verify deployment.

Keep React/React DOM aligned and Next/its ESLint config compatible. Three 0.x releases can break APIs. Avoid treating npm audit fix --force as an automatic repair.

Commands use Webpack due to an earlier Turbopack CSS-worker issue. Consult installed Next docs under node_modules/next/dist/docs/ before changing framework APIs.

## 15. Testing

```powershell
npm run lint
npm test
npm run typecheck
npm run build
```

Read each result. Current Actions runs lint/tests/build; build includes TypeScript checking. Standalone typecheck on a fresh clone may need generated Next route types from dev/build. next-env.d.ts can change between dev and build paths; inspect generated churn.

With the site on port 3000 and Chrome installed:

```powershell
node scripts/browser-check.mjs
node scripts/mobile-contact-check.mjs
```

Scripts use software WebGL and older hardcoded labels/layout assumptions. Inspect an assertion failure against intended behavior before updating it. Software-rendered automation does not measure real-phone performance.

Manual checks should cover both modes/themes, every detail route, assets/PDFs, form validation, game directions/pause/loss/retry/exit, reverse scroll/jumps, 320/390px mobile, tablet, desktop, 200% zoom, keyboard focus, reduced motion, no-JavaScript reading, landscape, and final links under the bottom world.

Use physical devices for GPU smoothness, battery impact, and touch feel.

## 16. Publishing

Pull before edits, especially after CMS changes:

```powershell
git status
git pull --ff-only origin main
```

After verification:

```powershell
git diff
git add -- src/app/globals.css
git diff --cached
git commit -m "Describe the change"
git push origin main
```

Stage your reviewed files. Include new media with its content references. Commit is local history, push transfers it, and deployment publishes it.

The Pages workflow uses Node 22, npm ci, lint/tests/build, uploads out/, and deploys. It sets NEXT_PUBLIC_BASE_PATH=/Emman-personal-portfolio and SITE_URL=https://Jemp72.github.io.

Pages settings should use GitHub Actions. Inspect the run matching your commit at https://github.com/Jemp72/Emman-personal-portfolio/actions/workflows/pages.yml. Successful push alone does not verify deployment.

Use sitePath("/contact/") for internal code links. Store /cms-media/file.webp in content and let the loader add the prefix. Already-prefixed paths can be prefixed twice.

Repository rename needs workflow/admin/status/editor-link updates. Other root hosting typically needs an empty base path, correct origin, build command, and out/ output. Custom domains need separate DNS/Pages configuration; consult current hosting instructions.

AGENTS.md instructs assistants to auto commit/push verified requested work. Manual editor saves still need your Git steps.

## 17. Recovery and troubleshooting

### Backups

Keep GitHub history plus a second local copy. Preserve valuable originals/ignored files separately. A portable Git-history backup is:

```powershell
git bundle create ..\portfolio-backup.bundle --all
```

Store private environment values securely outside public commits.

### Undo

Inspect git diff first. git restore -- src/app/globals.css discards that file's uncommitted edits, so copy anything valuable first.

For a published change, inspect git log --oneline -10, then git revert COMMIT_HASH and push. Replace the placeholder. A revert preserves history and reverses the whole chosen commit.

If Pages CMS created remote commits while you worked, commit/stash deliberately, pull, resolve conflicts, validate/build, and push. Avoid force-pushing over content updates. Restore deleted data and its assets from history together.

### Changes invisible

Check active source, localhost versus public URL, correct port, rebuilt out/, commit, push, matching deployment success, Explore mode, reduced motion, then caching/private window.

### README appears as site

Inspect Pages source settings. Publishing source through Jekyll can show README. The intended Actions workflow publishes the Next export artifact.

### Missing CSS/scripts/images

Inspect base path, doubled prefix, case-sensitive filenames, committed assets, and static host mounting. A root preview does not automatically mount the production repository prefix.

### Invalid slug

Use unique lowercase words/digits separated by single hyphens. Spaces, uppercase, duplicate slugs, leading/trailing hyphens fail validation.

### Font download failure

next/font/google needs build-time network access. Retry with connectivity or migrate to licensed local fonts. Removing CSS usage alone does not remove an imported font definition.

### Certificate omitted

Check URL/upload, path, and date. Entries without HTTP(S) or accepted local paths are omitted.

### Game unavailable

Check Explore selection, JavaScript/WebGL, console errors, context loss, and scene-chunk URLs. Simple provides readable fallback content.

### Contact did not send

Submission opens a draft. Check registered mail application and whether the visitor pressed Send there.

### CSS adjustment ignored

Search every matching selector, inspect specificity/media queries, and rebuild static previews. Avoid piling on unnecessary important declarations.

### Port occupied

Stop your own old terminal server with Ctrl+C or use another port. Avoid killing unfamiliar processes.

### npm installation failure

Read the first error. Check Node/network/lock consistency. Use npm install deliberately for dependency edits, verify, and commit the corrected lockfile. For blocked npm.ps1, try npm.cmd or your administrator's approved policy.

### Missing generated types

Run dev/build and inspect next-env.d.ts for .next/types versus .next/dev/types references.

### Browser checks fail after wording changes

Compare getByRole names and old layout assertions to actual verified UI. Update tests only when intended behavior has changed.

### Impeccable engine unavailable

It needs a working engine and writable cache. In normal PowerShell:

```powershell
& "$env:USERPROFILE\.agents\skills\impeccable\scripts\impeccable.cmd" engine-probe
```

Then run Doctor. Optional design tooling does not prevent manual maintenance.

## 18. Long-term maintenance and handoff

Before each content release, verify facts/links/media/order and deployment. Periodically inspect dependencies, console, Actions failures, mobile behavior, and image sizes. Keep account recovery methods and valuable originals backed up.

After rendering/dependency changes, test both themes/modes and a physical phone.

Known maintenance areas include layered CSS overrides, hidden mobile section links, a large portrait, idle Explore work, older smoke assertions, and historical documentation. Inspect current code before treating an old description as authoritative.

### New features

Runtime Server Actions, API routes, ISR, private operations, and request-dependent server rendering need hosting beyond this static export. Dynamic pages need all parameters at build. Preserve unoptimized image behavior when using next/image.

Browser-visible keys are public. Private services need a protected backend or an integration designed for public clients.

For content features, implement schema/types/data/rendering, then styling, then optional motion. For game features, synchronize pure rules and visuals. Preserve keyboard/touch, reduced motion, focus restoration, base path, Simple lazy loading, and resource cleanup.

### Future developer brief

> Read AGENTS.md and PORTFOLIO_HANDBOOK.md. This is Emman's static Next App Router portfolio using TypeScript, React, direct Three.js, Tailwind/PostCSS, Pages CMS, and GitHub Pages. Active content is src/content/portfolio.json. Preserve Simple/Explore/Play, static export, base paths, reduced motion, and keyboard/touch. Inspect current source, verify changes, commit relevant files, and push according to AGENTS.md. Report actual checks and deployment status.

### Working independently

Use Pages CMS for profile/project edits. For code changes, search the relevant selector/function, make a Git checkpoint, edit one concern, preview, verify, commit, push, and inspect Actions. Browser inspector edits are temporary; save chosen values in source.

Official reference starting points:

- React — https://react.dev/
- Next — https://nextjs.org/docs
- Three — https://threejs.org/docs/
- Tailwind — https://tailwindcss.com/docs
- Pages CMS — https://pagescms.org/docs/

Match documentation to installed versions. This handbook's implementation facts come from repository inspection. Recipes must be adapted to actual files and verified when applied; this document does not claim execution of every example or a fresh device-performance audit.
