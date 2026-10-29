import sharp from "sharp";
import { readdir, writeFile } from "node:fs/promises";
const manifest = {};
for (const folder of ["Artworks", "Graphic design", "Projects"]) {
  for (const file of await readdir(`content-source/Portfolio/${folder}`)) {
    if (!/\.(png|jpe?g)$/i.test(file)) continue;
    const name = `${folder}-${file}`
      .toLowerCase()
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-z0-9]+/g, "-");
    await sharp(`content-source/Portfolio/${folder}/${file}`)
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 83 })
      .toFile(`public/media/${name}.webp`);
    manifest[file] = `/media/${name}.webp`;
  }
}
await writeFile("src/content/assets.json", JSON.stringify(manifest, null, 2));
