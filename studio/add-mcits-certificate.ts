import { getCliClient } from "sanity/cli";
import { createReadStream } from "node:fs";
async function main() {
  const client = getCliClient({ apiVersion: "2025-02-19" });
  const id = "certification-mcits-2026";
  if (await client.getDocument(id)) {
    console.log("MCITS certification already exists; preserving edits.");
    return;
  }
  const file = await client.assets.upload(
    "file",
    createReadStream("../.sanity-import/mcits-2026.pdf"),
    {
      filename: "mcits-2026-emman-pedroso.pdf",
      contentType: "application/pdf",
    },
  );
  await client.createIfNotExists({
    _id: id,
    _type: "certification",
    title: "Mindanao Conference of IT Students (MCITS) 2026",
    issuer: "PSITE Davao Region · CHED XI",
    issuedOn: "2026-10-14",
    credentialType: "Participation & attendance",
    description:
      "Conference held at Davao del Norte State College, Panabo City. Includes certificates of participation and attendance.",
    certificate: {
      _type: "file",
      asset: { _type: "reference", _ref: file._id },
    },
    order: 1,
  });
  console.log("Published MCITS certification with original two-page PDF.");
}
main().catch((e) => {
  console.error(e.message);
  process.exitCode = 1;
});
