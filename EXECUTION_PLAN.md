# Frog portfolio execution plan

## Outcome

Build a personal portfolio with a distinctive low-poly, isometric frog world, a playable crossing game, and a fast, readable simple mode. The public site must deploy as static files. Use direct Three.js, not React Three Fiber.

The repository is currently empty. Begin with a working vertical slice before expanding the environment or adding visual effects.

## Stack and boundaries

- Next.js App Router, TypeScript, and React for pages and interface.
- Next.js `output: 'export'` for a deployable `out/` directory.
- Direct Three.js for rendering, animation, orthographic camera, and asset loading.
- Tailwind CSS for responsive HTML interface and simple mode.
- Sanity Content Lake and separately hosted Sanity Studio for persistent editing and authentication.
- Blender and GLB for optional authored assets; procedural low-poly geometry for the first complete version.
- Vercel static deployment, with a CMS publishing webhook triggering a new build.
- Package manager: npm unless repository conventions later specify otherwise.

No public runtime Next.js server is required. Sanity is an external backend service. Shared editing cannot persist on a static file host alone. Do not expose CMS write tokens in public JavaScript.

Use build-time CMS reads so content is present in HTML. Published changes appear after a successful rebuild. Generate every project slug during the build. Do not use Server Actions, request-time rendering, ISR, or runtime API routes. Use ordinary responsive images or a static-compatible image loader rather than the default server image optimizer.

## Product behavior

### Explore mode

- First-time visitors receive the expressive experience with an immediately available Simple view link.
- Render readable content as HTML over or beside a persistent 3D scene.
- Use a fixed orthographic viewing angle, soft lighting, restrained shadows, chunky forms, and a cohesive pond/woodland palette.
- Arrange landmarks around Introduction, About, Skills, Projects, and Contact.
- Normalize scroll progress into discrete frog destinations. Animate hops between destinations; never enqueue one animation per raw wheel event.
- Freeze vehicles and all other hazards while browsing. Only the frog, camera, and deliberate interface transitions animate.
- Keep the browsing route safe: no deaths, penalties, or game skill requirements.
- Navigation links and direct section anchors must work independently of scrolling. Reverse scrolling must behave predictably.
- Match touch scrolling to the same progress model without trapping ordinary page scrolling.

### Play mode

- Enter through an explicit Play button. Explain keyboard and touch controls before starting.
- Reuse scene assets and rendering infrastructure with separate gameplay state.
- Suspend scroll-driven movement while playing; enable directional controls, moving hazards, collision detection, score, game over, and restart.
- Start with deterministic lanes, roads, safe ground, and simple grid/bounding-box collisions. Water and moving logs are optional later additions.
- Score maximum forward progress; store personal best locally. No shared leaderboard in initial scope.
- Pause on hidden tabs and offer a visible pause/exit control. Exit restores portfolio section and scroll position.
- Use time-based movement and cap elapsed time after pauses to prevent hazard jumps.

### Simple mode

- Show About, Skills, Projects, and Contact in semantic, responsive HTML.
- Use the exact same content source as Explore mode.
- Keep mode controls keyboard accessible and persist preference locally.
- Default to simple mode for reduced-motion users unless they explicitly choose Explore.
- Do not initialize or download the Three.js scene while simple mode is active.
- Provide useful content with JavaScript disabled, when WebGL is unavailable, and when scene loading fails.

## Content and editing

Define typed models and Sanity schemas for:

- Site settings: display name, headline, short introduction, portrait, social links, contact email, resume asset, metadata.
- About: biography and optional experience/education entries.
- Skills: name, category, display order, optional icon; avoid arbitrary percentage bars.
- Projects: stable ID, unique slug, title, summary, body, cover image, image alt text, technologies, demo/source links, featured flag, order, and optional dates.

Studio must support creating, editing, deleting, and ordering entries. Use Sanity authentication rather than building custom login. Validate links and required fields; sanitize rich content through supported renderers.

Provide clearly marked sample content for local development when CMS configuration is absent. In a configured production build, a CMS failure should fail the build and preserve the previous deployment rather than silently publish sample information.

Keep world landmarks associated with stable section IDs. Adding a project should update project cards without requiring hand-editing the 3D map. Use a projects landmark opening the complete project collection instead of generating one physical lane per project.

## Suggested code organization

Keep the layout small and adjust as implementation demands:

- `src/app`: static pages, project routes, metadata, layout.
- `src/components`: content sections, navigation, mode switch, game controls.
- `src/content`: shared types, CMS queries, sample data, build-time loader.
- `src/three`: scene lifecycle, world/frog builders, scroll mapping, gameplay simulation.
- `studio`: Sanity Studio configuration and schemas.
- `public`: textures, models, images, resume, and other public assets.

React owns interface state. Three.js owns high-frequency scene updates. Keep gameplay rules independent of rendering so they can be tested without WebGL. Start with local React state and refs; add a state library only if actual coordination becomes difficult.

The scene lifecycle must handle initialization, resizing, render loop, listeners, observer cleanup, asset disposal, and unmount. Avoid duplicate render loops during React development remounts.

## Execution phases and completion gates

### 1. Foundation and static content

Scaffold the app, static export configuration, styling, shared content types, sample data, and semantic portfolio sections. Add project detail routes with build-time slug generation. Add basic metadata, favicon, social preview, and useful empty states.

Complete when the production build produces `out/`, direct project URLs work under a static file server, and all information is readable without the 3D layer.

### 2. Mode system and scene prototype

Implement persisted mode selection, reduced-motion behavior, loading/failure states, and a dynamically imported Three.js client component. Build one short isometric environment with a recognizable frog and one animated hop.

Complete when simple mode makes no scene initialization request, switching repeatedly leaks no canvases/listeners, and resizing works on desktop and mobile.

### 3. Scroll portfolio vertical slice

Connect actual document scroll progress to safe grid destinations, frog hops, camera tracking, active section navigation, and content landmarks. Handle scroll reversal, large jumps, section links, and responsive layouts. Keep hazards static.

Complete when all sections can be reached by scroll, touch, and navigation; rapid input settles on the correct destination; and browsing never triggers gameplay collisions.

### 4. Playable showcase

Implement separate gameplay state, directional input, deterministic lane hazards, collision rules, scoring, pause, restart, local best score, and exit/restore behavior. Add touch controls with adequate targets.

Complete when a visitor can start, play, lose, restart, pause, and exit without reloading; game state does not move the portfolio scroll position.

### 5. CMS and publishing

Create schemas and Studio, integrate build-time reads, document environment variables, and connect publish webhooks after the hosting project exists. Allow content work to proceed using samples until account-specific credentials are supplied.

Complete when create/edit/delete/order operations appear after rebuild, a newly added project has a working static URL, and no privileged credential appears in exported assets. If accounts are unavailable, deliver tested configuration and exact setup instructions, and explicitly identify the integration as pending external setup.

### 6. Art and performance

Replace only assets that materially improve the result. Use shared geometry/materials, instancing for repeated scenery, bounded pixel ratio, limited shadows, compressed assets, and minimal postprocessing. Render on demand when the scene is idle where practical; render continuously during active animation/gameplay.

Measure representative desktop and mobile devices before setting final budgets. Initial targets: smooth 60 fps on a typical desktop, usable 30 fps on a midrange phone, and Lighthouse accessibility at least 95. Treat these as measured targets, not guarantees. Prioritize simple-mode loading and readable content over effects.

### 7. Verification and release

Run lint, TypeScript checks, production static export, and focused gameplay/scroll tests. Serve the exported output locally to verify direct links and assets. Test keyboard-only navigation, reduced motion, WebGL failure, narrow screens, touch input, mode persistence, CMS empty states, and background-tab resume.

Deploy once destination/account setup is available. Verify deployed project links, CMS-triggered rebuilds, cache behavior, and mobile rendering. Document local commands, environment setup, content publishing, static-host requirements, and known limitations.

## Meaningful automated checks

- Scroll mapping stays within bounds and resolves correctly after reversal or a large jump.
- Collision and scoring rules cover loss, safe lanes, and maximum-progress scoring.
- Restart clears transient state; pause freezes simulation.
- Production export succeeds and contains generated project pages.
- A small browser smoke flow covers mode switching and start/restart/exit where browser tooling is available.

Avoid tests that simply mirror JSX or generated geometry. Perform visual checks in a real browser; a successful build alone does not establish that the 3D experience works.

## Delivery checklist

- Working Explore, Play, and Simple modes using one content model.
- Static `out/` artifact with working project routes.
- Editable Studio schemas and documented publishing flow.
- Sample content clearly identified and no fabricated personal claims.
- Setup guide, environment example, verification results, and remaining external configuration.
- No unrequested leaderboards, multiplayer, custom authentication, physics engine, or elaborate admin dashboard.

## Planning estimate

For one developer already comfortable with React and basic Three.js, allow roughly 10–20 focused working days for a polished initial version. Model creation, learning Three.js, and device-specific performance issues can extend that. Establish the scroll vertical slice early; it is the main interaction risk.
