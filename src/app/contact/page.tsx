import { sitePath } from "@/content/path";
import { getContent } from "@/content/load";
import ContactForm from "@/components/ContactForm";
export const metadata = {
  title: "Say hello — Emman Pedroso",
  description:
    "A project, a collaboration, or a friendly hello. Get in touch with Emman.",
};
export default async function Contact() {
  const c = await getContent();
  return (
    <main className="detail contact-page" id="portfolio">
      <a className="text-link" href={sitePath("/")}>
        ← Back to the woodland
      </a>
      <div className="contact-layout">
        <div>
          <span className="eyebrow">A NOTE ACROSS THE POND</span>
          <h1>
            Good things start
            <br />
            <em>with a hello.</em>
          </h1>
          <p className="intro">
            Have an idea that needs a creative eye or a little code? Tell me
            what you’re thinking. I’d love to hear about it.
          </p>
          <div className="pond-stamp" aria-hidden="true">
            <span className="frog-mark">••</span>
            <span>
              ONE SMALL HELLO.
              <br />A NEW POSSIBILITY.
            </span>
          </div>
          <a className="text-link contact-address" href={`mailto:${c.email}`}>
            {c.email} ↗
          </a>
          <p className="form-note">
            {c.location} · Development, design & illustration
          </p>
        </div>
        <ContactForm email={c.email} />
      </div>
    </main>
  );
}
