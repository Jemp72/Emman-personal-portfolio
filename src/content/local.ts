import { sitePath } from "@/content/path";
import assets from "./assets.json";
import type { Portfolio } from "./types";
const images = (prefix: string) =>
  Object.entries(assets)
    .filter(([name]) => name.startsWith(prefix))
    .map(([, url]) => sitePath(url));
// Verified against the supplied CV and ProjectDescriptions.md. AGAP = DARS, confirmed by owner.
export const localContent: Portfolio = {
  name: "Jose Emmanuel G. Pedroso",
  headline: "A creative mind.\nA technical side.",
  intro:
    "Web development, graphic design, and a little curiosity. I’m Emman, an IT student bringing ideas to life through code and visual storytelling.",
  bio: "I’m a BS Information Technology student majoring in Information Security at the University of Southeastern Philippines. My work brings together web development, digital illustration, and graphic design. As a Public Information Officer for the Society of Information Technology Students’ local council, I create publication materials and help turn information into clear, considered visuals.",
  email: "pedrosoemman72@gmail.com",
  location: "Tagum City, Philippines",
  resume: sitePath("/resume.pdf"),
  education: "BS Information Technology · Information Security · USeP",
  skills: [
    {
      category: "Development",
      items: [
        "HTML & CSS",
        "JavaScript",
        "PHP & Laravel",
        "ASP.NET",
        "Tailwind CSS",
        "Java",
        "C# / .NET",
      ],
    },
    {
      category: "Design & media",
      items: [
        "Adobe Illustrator",
        "Photoshop",
        "Lightroom",
        "Canva",
        "DaVinci Resolve",
        "Premiere Pro",
        "CapCut",
      ],
    },
    {
      category: "Beyond the screen",
      items: [
        "Information Security coursework",
        "Publication & layout",
        "Document editing",
        "English & Filipino",
      ],
    },
  ],
  projects: [
    {
      slug: "dars",
      title: "DARS",
      summary:
        "A clearer path to reporting and managing domestic abuse cases in Tagum City.",
      body: "The Domestic Abuse Reporting System lets residents submit reports while staff monitor cases, update investigation statuses, and record resolutions. Role-based access supports administrators and barangay operators. Real-time updates, incident mapping, geographic boundary validation, reporting dashboards, staff management, and audit logs support case management.",
      technologies: [
        "Vue 3",
        "TypeScript",
        "Node.js",
        "Express",
        "MySQL",
        "Socket.IO",
        "Leaflet",
      ],
      images: images("AGAP"),
      source: "https://github.com/5kr1mp/dars",
    },
    {
      slug: "clms",
      title: "Computer Laboratory Management",
      summary:
        "One place for laboratory bookings, equipment, schedules, and daily usage.",
      body: "CLMS manages laboratory reservations, class schedules, instructor records, equipment inventory, maintenance status, office supplies, and laboratory utilization logs. It supports CSV enrollment imports, QR scanning, public reservation forms, and a student and guest time-in/time-out kiosk.",
      technologies: ["PHP", "Laravel", "QR scanning", "Pest"],
      images: images("CLMS"),
      source: "https://github.com/Jemp72/CLMS-v1",
    },
    {
      slug: "cozzee",
      title: "Cozzee Café",
      summary: "A warm, responsive home on the web for a café and its menu.",
      body: "A responsive café website showcasing the menu, services, and business information, with an easy way to explore offerings and get in touch. Built with HTML5, CSS3, and JavaScript and hosted on GitHub Pages.",
      technologies: ["HTML5", "CSS3", "JavaScript"],
      images: images("cozzee"),
    },
  ],
  gallery: Object.entries(assets)
    .filter(([name]) => !/(AGAP|CLMS|cozzee)/.test(name))
    .map(([name, image]) => ({
      title: name.replace(/\.[^.]+$/, "").replace(/_/g, " "),
      category: image.includes("artworks") ? "Illustration" : "Graphic design",
      image: sitePath(image),
    })),
};
