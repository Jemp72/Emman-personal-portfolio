export type Project = {
  slug: string;
  title: string;
  summary: string;
  body: string;
  technologies: string[];
  images: string[];
  source?: string;
  demo?: string;
};
export type Portfolio = {
  certifications: {
    id: string;
    title: string;
    issuer: string;
    issuedOn?: string;
    description?: string;
    credentialType?: string;
    url: string;
  }[];
  name: string;
  headline: string;
  intro: string;
  bio: string;
  email: string;
  location: string;
  resume?: string;
  education?: string;
  studioUrl?: string;
  skills: { category: string; items: string[] }[];
  projects: Project[];
  gallery: {
    title: string;
    category: string;
    image: string;
    alt?: string;
    description?: string;
  }[];
};
