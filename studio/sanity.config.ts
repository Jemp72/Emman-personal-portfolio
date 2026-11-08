import { defineConfig, defineType, defineField } from "sanity";
import { structureTool } from "sanity/structure";
const text = (name: string, required = false, type = "string") =>
  defineField({ name, type, validation: (r) => (required ? r.required() : r) });
const order = defineField({
  name: "order",
  title: "Display order",
  description:
    "Lower numbers appear first. Change these numbers to reorder entries.",
  type: "number",
  initialValue: 0,
  validation: (r) => r.required().min(0).integer(),
});
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
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Portfolio")
          .items([
            S.listItem()
              .title("Profile & site information")
              .id("settings")
              .child(
                S.document().schemaType("settings").documentId("site-settings"),
              ),
            ...S.documentTypeListItems().filter(
              (item) => item.getId() !== "settings",
            ),
          ]),
    }),
  ],
  document: {
    newDocumentOptions: (options, { creationContext }) =>
      creationContext.type === "global"
        ? options.filter((o) => o.templateId !== "settings")
        : options,
    actions: (actions, context) =>
      context.schemaType === "settings"
        ? actions.filter(
            (a) =>
              !["delete", "duplicate", "unpublish"].includes(a.action || ""),
          )
        : actions,
  },
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
          text("studioUrl"),
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
            of: [
              {
                type: "image",
                options: { hotspot: true },
                fields: [
                  { name: "alt", title: "Image description", type: "string" },
                ],
              },
            ],
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
          text("description", false, "text"),
          text("alt"),
          defineField({
            name: "category",
            type: "string",
            description:
              "Illustration, Graphic design, or a new category of your choice.",
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
