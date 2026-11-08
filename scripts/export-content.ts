import { mkdir, writeFile } from "node:fs/promises";
import { localContent } from "../src/content/local";
async function main() {
  await mkdir(".sanity-import", { recursive: true });
  await writeFile(
    ".sanity-import/content.json",
    JSON.stringify(localContent, null, 2),
  );
  console.log("Prepared owner-supplied content for Sanity migration.");
}
main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
