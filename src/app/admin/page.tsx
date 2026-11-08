import { getContent } from "@/content/load";
import { sitePath } from "@/content/path";
export const metadata = {
  title: "Manage portfolio — Emman",
  robots: { index: false, follow: false },
};
export default async function Admin() {
  const c = await getContent();
  const studio = c.studioUrl || process.env.NEXT_PUBLIC_SANITY_STUDIO_URL;
  return (
    <main className="detail" id="portfolio">
      <a href={sitePath("/")} className="text-link">
        ← Back to the woodland
      </a>
      <span className="eyebrow">YOUR CREATIVE WORKSPACE</span>
      <h1>
        Keep your
        <br />
        <em>story growing.</em>
      </h1>
      <p className="intro">
        Manage your information, skills, projects, and creative outputs in the
        portfolio editor. Sign in with the Sanity account connected to this
        project.
      </p>
      {studio && /^https:\/\//.test(studio) ? (
        <a className="dark-button" href={studio} style={{ marginTop: 28 }}>
          Open portfolio editor ↗
        </a>
      ) : (
        <p>The editor is awaiting account configuration.</p>
      )}
      <p className="form-note">
        Drafts stay in the editor. Publish or unpublish to update the public
        site. GitHub checks for changes every 15 minutes; scheduled runs can be
        delayed. For a faster update, run the deployment workflow below.
      </p>
      <a
        className="text-link"
        href="https://github.com/Jemp72/Emman-personal-portfolio/actions/workflows/pages.yml"
        target="_blank"
        rel="noreferrer"
      >
        View publishing status / run deployment ↗
      </a>
    </main>
  );
}
