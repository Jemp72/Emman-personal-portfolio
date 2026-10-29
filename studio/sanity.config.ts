import { defineConfig, defineType, defineField } from "sanity";
import { structureTool } from "sanity/structure";
const text = (name: string, required = false, type = "string") =>
  defineField({ name, type, validation: (r) => (required ? r.required() : r) });
const order = defineField({ name: "order", type: "number", initialValue: 0 });
const strings = (name: string) =>
  defineField({ name, type: "array", of: [{ type: "string" }] });
const url = (name: string) =>
  defineField({
    name,
    type: "url",
    validation: (r) => r.uri({ scheme: ["http", "https"] }),
  });
export default defineConfig({
  name: "portfolio",
  title: "Emmanuel · Portfolio",
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || "",
  dataset: process.env.SANITY_STUDIO_DATASET || "production",
  plugins: [structureTool()],
  schema: {
    types: [
      defineType({
        name: "settings",
        title: "Site settings (one document)",
        type: "document",
        fields: [
          text("name", true),
          text("headline", true, "text"),
          text("intro", true, "text"),
          text("bio", true, "text"),
          defineField({
            name: "email",
            type: "string",
            validation: (r) => r.required().email(),
          }),
          text("location", true),
          text("education"),
          defineField({
            name: "resume",
            type: "file",
            options: { accept: ".pdf" },
          }),
        ],
      }),
      defineType({
        name: "skillGroup",
        title: "Skill group",
        type: "document",
        fields: [text("category", true), strings("items"), order],
      }),
      defineType({
        name: "project",
        type: "document",
        fields: [
          text("title", true),
          defineField({
            name: "slug",
            type: "slug",
            options: { source: "title" },
            validation: (r) => r.required(),
          }),
          text("summary", true, "text"),
          text("body", true, "text"),
          strings("technologies"),
          defineField({
            name: "images",
            type: "array",
            of: [{ type: "image", options: { hotspot: true } }],
          }),
          url("source"),
          url("demo"),
          order,
        ],
      }),
      defineType({
        name: "artwork",
        type: "document",
        fields: [
          text("title", true),
          defineField({
            name: "category",
            type: "string",
            options: { list: ["Illustration", "Graphic design"] },
            validation: (r) => r.required(),
          }),
          defineField({
            name: "image",
            type: "image",
            validation: (r) => r.required(),
          }),
          order,
        ],
      }),
    ],
  },
});
