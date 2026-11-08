# Managing Emman's portfolio

Public portfolio: https://jemp72.github.io/Emman-personal-portfolio/

Editor: https://emman-portfolio-8cs195in.sanity.studio/

Project: Emman Portfolio (`8cs195in`), production dataset. The editor uses Sanity authentication; only invited project members with editing permissions can change content. The dataset holds public portfolio information. Do not upload private documents, credentials, or confidential project records.

## Editing

On the portfolio home page (outside Play), enter **↑ ↑ ↓ ↓ ← → ← → B A** on your keyboard, then select **Open portfolio editor**. You can also bookmark the `/admin/` page or the editor URL above. Sign in using the GitHub account used to create the Sanity project.

- **Profile & site information:** name, homepage headline and introduction, biography, contact email, location, education, and résumé. This is a singleton: update this record rather than creating additional settings records.
- **Skill group:** create/edit/delete groups, add/remove skill items, and set display order.
- **Project:** create a record, set a unique lowercase hyphenated slug, title, summary, body, technologies, screenshots, optional source/demo links, and display order. The first screenshot is the cover. Existing project slugs should normally stay stable to preserve shared URLs.
- **Artwork:** create/edit/delete a creative output; upload an image, set title, alt text, optional description, category, and display order. Categories accept new names.

Lower display-order numbers appear first. Arrays such as screenshots and skill items can be reordered inside the editor. Use descriptive image text. Files and images upload to Sanity's asset storage.

Sanity saves edits as drafts. Press **Publish** when ready. Unpublish hides an item without deleting the document. Delete removes it; use the editor's confirmation flow. Leave profile settings published so public builds have the required identity/contact fields.

## Publishing

The public website is still statically generated. Publishing in the editor does not immediately replace the live website.

- GitHub checks published content every 15 minutes. If it changed, it runs the build and deploys the complete site. GitHub schedules are best-effort and can be delayed or disabled after prolonged repository inactivity.
- For a faster update, open the **View publishing status / run deployment** link on `/admin/`. In GitHub, select **Run workflow**, branch **main**, and run it. GitHub sign-in is required.
- Wait for the deployment to succeed, then refresh the public site. A build failure keeps the previous successful site available.
- New project pages appear after deployment; deleted/unpublished pages disappear in the next deployment. Browser/CDN caching can briefly retain older content.

The check compares a hash of published document IDs and revisions with the deployed marker. Draft saves do not trigger content changes. Unchanged scheduled checks skip dependency installation, build, and deployment. No GitHub write credential is stored in Sanity or browser code.

## Configuration and maintenance

GitHub repository variables `SANITY_PROJECT_ID=8cs195in` and `SANITY_DATASET=production` are configured. Public reads need no token. The workflow keeps its repository base path and uses the hosted Studio URL. Local environment files remain ignored.

The Studio is separately deployed. Code/schema changes require `cd studio`, `npm ci`, then `npm run deploy` after signing in with `npx sanity login`. Ordinary content edits need no code deployment. Preserve the CLI application ID in `studio/sanity.cli.ts`.

The one-time import uses `scripts/export-content.ts` and `studio/import-content.ts`. It preserves existing document IDs and will not overwrite later edits. Do not reimport to reset the site. `studio/check-content.ts` checks editing with temporary records and removes them in a cleanup step.

Public frontend reads use the published perspective. Required profile fields and project slugs are checked at build time. The existing local content remains a development fallback only when no Sanity project is configured; configured CMS errors fail the build rather than silently publish fallback content.

## Current scope

The existing personal fields, skill groups, projects, output categories/images/descriptions, and résumé are managed here. The frog game, design/theme behavior, section heading copy, and contact-form interface remain code-defined. The contact form opens an email draft; Sanity does not receive contact submissions. Public draft preview is not enabled; review draft fields/images in Studio before publishing.

## Certifications

Open Certification in the Sanity editor to add, edit, unpublish, delete, or reorder records. Set title, issuer, optional date/type/description, and display order. Upload the scanned/e-certificate as a PDF or image, or provide an external credential URL. An upload takes priority if both are present. Publish when ready; certifications participate in the same automatic publishing checks as projects and outputs.

The first entry is MCITS 2026, dated October 14, 2026. The original PDF contains both participation and attendance certificates. The public section uses text and a View certificate link, with no thumbnail grid.
