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
  name: string;
  headline: string;
  intro: string;
  bio: string;
  email: string;
  location: string;
  resume?: string;
  education?: string;
  skills: { category: string; items: string[] }[];
  projects: Project[];
  gallery: { title: string; category: string; image: string }[];
};
