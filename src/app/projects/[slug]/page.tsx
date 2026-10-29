import { getContent } from "@/content/load";
import { notFound } from "next/navigation";
export async function generateStaticParams() {
  return (await getContent()).projects.map((p) => ({ slug: p.slug }));
}
export const dynamicParams = false;
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = (await getContent()).projects.find((p) => p.slug === slug);
  return {
    title: `${p?.title || "Project"} — Emman Pedroso`,
    description: p?.summary,
  };
}
export default async function Project({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = (await getContent()).projects.find((p) => p.slug === slug);
  if (!p) notFound();
  return (
    <main id="portfolio" className="detail">
      <a className="text-link" href="/#projects">
        ← Back to selected work
      </a>
      <span className="eyebrow">PROJECT NOTES / WEB DEVELOPMENT</span>
      <h1>{p.title}</h1>
      <p className="intro">{p.summary}</p>
      <div className="tags">
        {p.technologies.map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
      <p>{p.body}</p>
      <div className="actions">
        {p.source && /^https?:\/\//.test(p.source) && (
          <a
            className="dark-button"
            href={p.source}
            target="_blank"
            rel="noreferrer"
          >
            Explore the source ↗
          </a>
        )}
        {p.demo && /^https?:\/\//.test(p.demo) && (
          <a
            className="text-link"
            href={p.demo}
            target="_blank"
            rel="noreferrer"
          >
            Visit the site ↗
          </a>
        )}
      </div>
      <div className="detail-images">
        {p.images.map((image, i) => (
          <img
            src={image}
            key={image}
            alt={`${p.title} screen ${i + 1}`}
            width={1600}
            height={900}
            loading={i ? "lazy" : "eager"}
          />
        ))}
      </div>
      <a className="text-link" href="/#projects">
        ← More projects
      </a>
    </main>
  );
}
