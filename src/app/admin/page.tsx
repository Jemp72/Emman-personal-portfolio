import { sitePath } from "@/content/path";
export const metadata = {
  title: "Manage portfolio — Emman",
  robots: { index: false, follow: false },
};
export default function Admin() {
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
        portfolio editor. Sign in with GitHub and open
        Jemp72/Emman-personal-portfolio.
      </p>
      <a
        className="dark-button"
        href="https://app.pagescms.org/"
        style={{ marginTop: 28 }}
      >
        Open Pages CMS ↗
      </a>
      <p className="form-note">
        Saving an edit to main starts the GitHub Pages build. Check the
        deployment status below before refreshing the site.
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
