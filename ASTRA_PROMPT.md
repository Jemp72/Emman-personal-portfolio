# Copy-ready implementation prompt

You are implementing my personal portfolio in this repository. Read `EXECUTION_PLAN.md` as the product and execution specification, inspect the repository and any applicable `AGENTS.md`, then carry the work through implementation and verification. The repository may initially be empty.

Build an expressive low-poly 3D isometric frog portfolio inspired by the visual perspective of Crossy Road, using original assets and presentation. Use Next.js App Router, TypeScript, Tailwind CSS, direct Three.js, and Sanity. Do not use React Three Fiber. The public app must build with `output: 'export'` into static files and work without a running Next.js server.

Required experiences:

1. Explore: ordinary document scrolling advances a frog along a safe predefined route through About, Skills, Projects, and Contact. Obstacles remain stationary. Convert scroll progress into bounded destinations rather than queuing every wheel event. Navigation links, reverse scrolling, large scroll jumps, and touch must work.
2. Play: an explicit entry switches the shared world to a crossing game with keyboard/touch controls, moving hazards, simple collision rules, scoring, local personal best, pause, loss, restart, and exit restoring portfolio position.
3. Simple: a fast semantic HTML portfolio using the same content, without expressive animation or the Three.js bundle being loaded. Persist the selection, respect reduced motion, and provide readable fallback content without JavaScript or WebGL.

Use an orthographic camera, a recognizable frog, strong composition, deliberate typography, and a cohesive pond/woodland art direction. Start with procedural low-poly geometry so the whole experience works before optional Blender assets. Keep personal text readable in HTML rather than embedding essential text inside the canvas.

Sanity must model site settings, about information, ordered skills, and ordered projects with static detail routes. Use a separately hosted authenticated Studio. Fetch published content at build time; publishing will trigger a hosting rebuild. Generate all project slugs during export. Never put CMS write tokens in browser code. Provide clearly labeled sample data when local CMS configuration is absent. Configured production CMS failures must fail the build instead of publishing samples.

Execution expectations:

- Start with the simple portfolio and a tiny working 3D/scroll vertical slice, then expand through the plan's phases.
- Make routine implementation decisions autonomously. Ask only for information that actually blocks dependent work; continue independent work while external setup is pending.
- Inspect existing code before introducing dependencies. Prefer a small structure, React state/refs, and simple grid-based gameplay over extra libraries.
- Separate pure gameplay rules from rendering. React controls interface state; Three.js updates animation without per-frame React state changes.
- Implement complete scene cleanup, resize behavior, bounded pixel ratio, lazy loading, visibility pause, and safe frame timing.
- Keep static hosting constraints throughout: no Server Actions, runtime API routes, ISR, or default server image optimization.
- Do not invent my biography, credentials, or real projects. Use obvious placeholders and document what I should replace.
- Run appropriate type, lint, gameplay/scroll, and production export checks. Serve the exported files and inspect the result in a browser when tooling is available. Test mobile layout, reduced motion, mode switching, and game restart/exit.
- Do not claim deployment, CMS connection, visual verification, or device performance that you have not actually completed. If credentials or hosting access are missing, finish the code and provide exact remaining setup steps.
- Deliver working code, `.env.example`, setup/publishing documentation, and a concise report of changes, verification, and outstanding external configuration.

Begin by inspecting the workspace, then implement. Do not stop after restating the plan or scaffolding the app.
