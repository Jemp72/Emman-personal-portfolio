import { createHash } from "node:crypto";
import { writeFile, appendFile } from "node:fs/promises";
const project = process.env.SANITY_PROJECT_ID;
let revision = "local",
  changed = process.env.GITHUB_EVENT_NAME !== "schedule";
if (project) {
  const query =
    '*[_type in ["settings","skillGroup","project","artwork"] && !(_id in path("drafts.**")) && !(_id in path("versions.**"))]|order(_id asc){_id,_rev}';
  const response = await fetch(
    `https://${project}.api.sanity.io/v2025-02-19/data/query/${process.env.SANITY_DATASET || "production"}?perspective=published&query=${encodeURIComponent(query)}`,
    {
      headers: process.env.SANITY_READ_TOKEN
        ? { Authorization: `Bearer ${process.env.SANITY_READ_TOKEN}` }
        : {},
    },
  );
  if (!response.ok) throw Error(`CMS revision read failed: ${response.status}`);
  revision = createHash("sha256")
    .update(JSON.stringify((await response.json()).result))
    .digest("hex");
  if (!changed) {
    const live = await fetch(
      "https://jemp72.github.io/Emman-personal-portfolio/cms-revision.json",
      { cache: "no-store" },
    );
    changed = !live.ok || (await live.json()).revision !== revision;
  }
}
await writeFile("public/cms-revision.json", JSON.stringify({ revision }));
if (process.env.GITHUB_OUTPUT)
  await appendFile(process.env.GITHUB_OUTPUT, `changed=${changed}\n`);
console.log(
  changed
    ? "Content changed or deployment requested."
    : "No published content changes; skipping deployment.",
);
