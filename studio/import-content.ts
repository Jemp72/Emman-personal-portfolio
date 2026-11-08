import { getCliClient } from "sanity/cli";
import { createReadStream } from "node:fs";
import { readFile as read } from "node:fs/promises";
import { resolve } from "node:path";
async function main() {
  const client = getCliClient({ apiVersion: "2025-02-19" });
  const content = JSON.parse(
    await read(resolve("../.sanity-import/content.json"), "utf8"),
  );
  async function asset(path: string, type: "image" | "file") {
    const local = resolve("../public", path.replace(/^\//, ""));
    return client.assets.upload(type, createReadStream(local), {
      filename: local.split(/[\\/]/).pop(),
    });
  }
  async function put(doc: Record<string, unknown>) {
    await client.createIfNotExists(doc as { _id: string; _type: string });
    console.log(`Imported ${doc._id}`);
  }
  if (!(await client.getDocument("site-settings"))) {
    const { projects, gallery, skills, ...settings } = content;
    const resume = await asset(settings.resume, "file");
    await put({
      _id: "site-settings",
      _type: "settings",
      ...settings,
      resume: {
        _type: "file",
        asset: { _type: "reference", _ref: resume._id },
      },
    });
  }
  for (const [i, s] of content.skills.entries())
    await put({
      _id: `skill-${i + 1}`,
      _type: "skillGroup",
      ...s,
      order: i + 1,
    });
  for (const [i, p] of content.projects.entries()) {
    const id = `project-${p.slug}`;
    if (await client.getDocument(id)) continue;
    const images = [];
    for (const [j, path] of p.images.entries()) {
      const a = await asset(path, "image");
      images.push({
        _type: "image",
        _key: `image-${j}`,
        alt: `${p.title} screen ${j + 1}`,
        asset: { _type: "reference", _ref: a._id },
      });
    }
    await put({
      _id: id,
      _type: "project",
      ...p,
      slug: { _type: "slug", current: p.slug },
      images,
      order: i + 1,
    });
  }
  for (const [i, a] of content.gallery.entries()) {
    const id = `artwork-${i + 1}`;
    if (await client.getDocument(id)) continue;
    const img = await asset(a.image, "image");
    await put({
      _id: id,
      _type: "artwork",
      title: a.title,
      category: a.category,
      order: i + 1,
      alt: a.title,
      image: { _type: "image", asset: { _type: "reference", _ref: img._id } },
    });
  }
  console.log("Migration finished. Existing documents were preserved.");
}
main().catch((e) => {
  console.error(e.message);
  process.exitCode = 1;
});
