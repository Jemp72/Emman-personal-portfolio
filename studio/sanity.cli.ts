import { defineCliConfig } from "sanity/cli";
export default defineCliConfig({
  studioHost: "emman-portfolio-8cs195in",
  deployment: { appId: "d7z2opf8pj3obvw2fafjwu0g" },
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET || "production",
  },
});
