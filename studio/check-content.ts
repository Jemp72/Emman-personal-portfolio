import { getCliClient } from "sanity/cli";
async function main() {
  const client = getCliClient({ apiVersion: "2025-02-19" });
  const id = `workflow-check-${Date.now()}`,
    draft = `drafts.${id}`;
  try {
    await client.create({
      _id: draft,
      _type: "project",
      title: "Temporary workflow check",
      slug: { _type: "slug", current: id },
      summary: "Temporary verification document",
      body: "Removed after verification.",
      order: 999,
    });
    const hidden = await client
      .withConfig({ perspective: "published", useCdn: false })
      .fetch("*[_id==$id]", { id });
    if (hidden.length) throw Error("Draft leaked into published results");
    await client.create({
      _id: id,
      _type: "project",
      title: "Temporary workflow check",
      slug: { _type: "slug", current: id },
      summary: "Temporary verification document",
      body: "Removed after verification.",
      order: 999,
    });
    await client
      .patch(id)
      .set({ title: "Updated workflow check", order: 998 })
      .commit();
    const saved = await client.getDocument(id);
    if (saved?.title !== "Updated workflow check" || saved.order !== 998)
      throw Error("Update failed");
    console.log("Passed: create, draft isolation, publish, update, ordering.");
  } finally {
    await client.delete(id);
    await client.delete(draft);
  }
  if (await client.getDocument(id)) throw Error("Delete failed");
  console.log("Passed: delete and test-document cleanup.");
}
main().catch((e) => {
  console.error(e.message);
  process.exitCode = 1;
});
