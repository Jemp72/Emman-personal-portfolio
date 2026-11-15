import "server-only";
import { sitePath } from "./path";
import portfolio from "./portfolio.json";
import type { Portfolio } from "./types";

type CertificateFile = Omit<
  Portfolio["certifications"][number],
  "id" | "url"
> & {
  url?: string;
  externalUrl?: string;
};
const content: Omit<Portfolio, "certifications"> & {
  certifications?: CertificateFile[];
} = portfolio;

export function getContent(): Portfolio {
  const projects = (content.projects ?? []).map((project) => ({
    ...project,
    images: (project.images ?? []).map(sitePath),
    technologies: project.technologies ?? [],
  }));
  const slugs = projects.map(({ slug }) => slug);
  if (
    slugs.some((slug) => !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) ||
    new Set(slugs).size !== slugs.length
  ) {
    throw new Error(
      "Each project needs a unique, lowercase, hyphen-separated slug.",
    );
  }
  return {
    ...content,
    resume: content.resume && sitePath(content.resume),
    logo: content.logo && sitePath(content.logo),
    favicon: content.favicon && sitePath(content.favicon),
    portrait: content.portrait?.url
      ? { ...content.portrait, url: sitePath(content.portrait.url) }
      : undefined,
    socials: (content.socials ?? []).map((social) => ({
      ...social,
      logo: social.logo && sitePath(social.logo),
    })),
    skills: (content.skills ?? []).map((skill) => ({
      ...skill,
      items: skill.items ?? [],
    })),
    projects,
    gallery: (content.gallery ?? [])
      .filter((item) => item.image)
      .map((item) => ({ ...item, image: sitePath(item.image) })),
    certifications: (content.certifications ?? []).flatMap((entry, index) => {
      const url = entry.url || entry.externalUrl;
      if (typeof url !== "string" || !/^(https?:\/\/|\/(?!\/))/.test(url))
        return [];
      return [{ ...entry, id: String(index), url: sitePath(url) }];
    }),
  };
}
