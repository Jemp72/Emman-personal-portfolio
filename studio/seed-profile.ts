import { getCliClient } from "sanity/cli";

async function main() {
  const client = getCliClient({ apiVersion: "2025-02-19" });
  const settings = await client.getDocument("site-settings");
  if (!settings) throw new Error("Site settings are missing");
  await client
    .patch(settings._id)
    .ifRevisionId(settings._rev)
    .setIfMissing({
      educationEntries: [
        settings.education + " · 2024–Present",
        "STI College Tagum · Senior High School, ICT (Mobile App and Web Development) · 2022–2024 · With Honors",
        "Tagum City National High School · Junior High School · 2018–2022 · Grade 10 With Honors",
      ],
      socials: [
        { _key: "github", name: "GitHub", url: "https://github.com/Jemp72" },
      ],
    })
    .commit();
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
