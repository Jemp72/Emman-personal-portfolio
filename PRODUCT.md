# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Recruiters and hiring managers, and potential clients and collaborators, are equally important. They use the portfolio to understand Emman Pedroso's skills, review examples of his work, and find a way to contact him.

## Product Purpose

Showcase Emman's creative and technical work through projects, artwork, skills, education, and certifications. Visitors can review work at their own pace, open supporting materials, and reach Emman by email or through his social links.

## Positioning

The portfolio doubles as a playable game development showcase. In Explore, scrolling moves a frog through an isometric world as visitors browse the portfolio. Play turns that world into an endless crossing game. Simple gives visitors quick access to the same information in a straightforward format.

## Operating Context

The site serves desktop and mobile web visitors. Emman maintains portfolio content and uploads through Pages CMS. GitHub Pages serves the static Next.js export and rebuilds after content changes reach the main branch.

## Capabilities and Constraints

- Essential information is readable as HTML, including without JavaScript. Simple works without Three.js, and visitors can use it when WebGL is unavailable. First-time visitors who prefer reduced motion receive Simple.
- Explore follows document scroll in both directions and keeps hazards stationary. Play supports keyboard and touch controls, keeps personal best scores locally, and returns visitors to their previous portfolio position on exit.
- Projects have individual pages. Certifications link to supporting credentials, and visitors can access contact information, social links, and a résumé.
- The public site runs without a Next.js server. Portfolio content and public assets are maintained in the repository through Pages CMS.
