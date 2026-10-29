import { getContent } from "@/content/load";
import Experience from "@/components/Experience";
export default async function Home() {
  const c = await getContent();
  return (
    <>
      <Experience />
      <main id="portfolio" className="portfolio">
        <section id="home" className="hero">
          <div className="eyebrow">
            <span className="tiny-line" /> THE PORTFOLIO OF{" "}
            {c.name.toUpperCase()}
          </div>
          <h1>
            {c.headline.split("\n").map((line, i) => (
              <span key={line} className={i ? "serif italic" : ""}>
                {line}
                <br />
              </span>
            ))}
          </h1>
          <p className="intro">{c.intro}</p>
          <div className="actions">
            <a href="#projects" className="dark-button">
              Discover my work <span>↘</span>
            </a>
            <a href="#about" className="text-link">
              A little about me ↗
            </a>
          </div>
          <div className="hero-foot">
            <span>
              BASED IN
              <br />
              <b>{c.location}</b>
            </span>
            <span className="scroll-note">SCROLL TO WANDER ↓</span>
          </div>
        </section>
        <section id="about">
          <div className="section-top">
            <span className="eyebrow">01 / THE PERSON</span>
            <span>Code meets creativity</span>
          </div>
          <h2>
            Curious by nature.
            <br />
            <em>Creative by practice.</em>
          </h2>
          <p>{c.bio}</p>
          {c.education && (
            <div className="about-note">
              <span>Education</span>
              <strong>{c.education}</strong>
            </div>
          )}
          {c.resume && (
            <a
              className="text-link"
              href={c.resume}
              target="_blank"
              rel="noreferrer"
            >
              Read my résumé ↗
            </a>
          )}
        </section>
        <section id="skills">
          <div className="section-top">
            <span className="eyebrow">02 / THE TOOLKIT</span>
            <span>Always learning</span>
          </div>
          <h2>
            Different tools.
            <br />
            <em>One curious mind.</em>
          </h2>
          <div className="skill-groups">
            {c.skills.map((s, i) => (
              <div key={s.category}>
                <span className="skill-number">0{i + 1}</span>
                <div>
                  <h3>{s.category}</h3>
                  <div className="tags">
                    {s.items.map((x) => (
                      <span key={x}>{x}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section id="projects">
          <div className="section-top">
            <span className="eyebrow">03 / SELECTED WORK</span>
            <span>Ideas, made real</span>
          </div>
          <h2>
            A few things
            <br />
            <em>I’ve worked on.</em>
          </h2>
          <div className="projects">
            {c.projects.map((p, i) => (
              <a
                className="project-card"
                href={`/projects/${p.slug}/`}
                key={p.slug}
              >
                <div className="project-image">
                  {p.images[0] && (
                    <img
                      src={p.images[0]}
                      alt={`${p.title} interface preview`}
                      loading="lazy"
                      width={1200}
                      height={700}
                    />
                  )}
                  <span className="project-arrow">↗</span>
                </div>
                <div className="project-meta">
                  <span>0{i + 1} / WEB DEVELOPMENT</span>
                  <span>{p.technologies.slice(0, 2).join(" · ")}</span>
                </div>
                <h3>{p.title}</h3>
                <p>{p.summary}</p>
              </a>
            ))}
          </div>
          {!c.projects.length && <p>New projects are on their way.</p>}
        </section>
        <section id="gallery">
          <div className="section-top">
            <span className="eyebrow">04 / CREATIVE CORNER</span>
            <span>Beyond the code</span>
          </div>
          <h2>
            Made with
            <br />
            <em>a different brush.</em>
          </h2>
          <p>
            Digital illustrations, publication materials, and graphic
            explorations.
          </p>
          <div className="gallery">
            {c.gallery.map((a) => (
              <a
                key={a.image}
                href={a.image}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open ${a.title} image`}
              >
                <img
                  src={a.image}
                  alt={a.title}
                  loading="lazy"
                  width={600}
                  height={700}
                />
                <span>{a.category} ↗</span>
              </a>
            ))}
          </div>
        </section>
        <section id="contact" className="contact">
          <span className="eyebrow">05 / THE NEXT CHAPTER</span>
          <h2>
            Have something
            <br />
            <em>in mind?</em>
          </h2>
          <p>
            I’d love to hear about it. Let’s bring a little creativity to your
            next idea.
          </p>
          <a className="dark-button" href="/contact/">
            Say hello ↗
          </a>
          <a className="email" href={`mailto:${c.email}`}>
            {c.email}
          </a>
          <footer>
            <span>
              © {new Date().getFullYear()} {c.name}
            </span>
            <a href="#home">Back to the top ↑</a>
          </footer>
        </section>
      </main>
    </>
  );
}
