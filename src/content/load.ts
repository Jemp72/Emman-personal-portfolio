import "server-only";
import { cache } from "react";
import { localContent } from "./local";
import type { Portfolio } from "./types";
export const getContent = cache(async (): Promise<Portfolio> => {
  const id = process.env.SANITY_PROJECT_ID;
  if (!id) return localContent;
  if (!/^[a-z0-9-]+$/.test(id)) throw new Error("Invalid SANITY_PROJECT_ID");
  const dataset = process.env.SANITY_DATASET || "production";
  if (!/^[a-z0-9_-]+$/.test(dataset)) throw new Error("Invalid dataset");
  const query = `{"settings": *[_type == "settings"][0]{name,headline,intro,bio,email,location,education,"resume":resume.asset->url}, "skills":*[_type=="skillGroup"]|order(order asc){category,items},"projects":*[_type=="project"]|order(order asc){"slug":slug.current,title,summary,body,technologies,"images":images[].asset->url,source,demo},"gallery":*[_type=="artwork"]|order(order asc){title,category,"image":image.asset->url}}`;
  const res = await fetch(
    `https://${id}.api.sanity.io/v2025-02-19/data/query/${dataset}?query=${encodeURIComponent(query)}`,
    {
      headers: process.env.SANITY_READ_TOKEN
        ? { Authorization: `Bearer ${process.env.SANITY_READ_TOKEN}` }
        : {},
    },
  );
  if (!res.ok) throw new Error(`Sanity build read failed: ${res.status}`);
  const { result } = await res.json();
  if (!result?.settings?.name || !result.settings.email)
    throw new Error("Publish Sanity site settings before building.");
  for (const p of result.projects)
    if (!p.slug || !/^[a-z0-9-]+$/.test(p.slug) || !p.title)
      throw new Error("Invalid project slug/title");
  if (
    new Set(result.projects.map((p: { slug: string }) => p.slug)).size !==
    result.projects.length
  )
    throw new Error("Duplicate project slugs");
  return {
    ...result.settings,
    skills: result.skills,
    projects: result.projects.map((p: Portfolio["projects"][number]) => ({
      ...p,
      images: p.images || [],
      technologies: p.technologies || [],
    })),
    gallery: result.gallery,
  };
});
