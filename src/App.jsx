import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { profile, metrics, projects, categories, experience, trainings, education, certifications, skills, about } from "./data.js";
import { useInView, useCountUp } from "./hooks.js";
import { useT } from "./i18n.jsx";
import { useMotion, useGsap, Chars, scramble } from "./motion.jsx";
import DataHelix3D from "./components/DataHelix3D.jsx";
import NeuroBackground from "./components/NeuroBackground.jsx";
import Figure from "./components/Figures.jsx";
import KMeansLab from "./components/KMeansLab.jsx";

/* ---------- utilitaires ---------- */
function Reveal({ as: Tag = "div", className = "", delay = 0, children, ...rest }) {
  const [ref, inView] = useInView();
  return (
    <Tag ref={ref} className={`reveal ${inView ? "is-in" : ""} ${className}`} style={{ "--delay": `${delay}ms` }} {...rest}>
      {children}
    </Tag>
  );
}

function SectionHead({ n, title, note }) {
  const ref = useRef(null);
  const { lang } = useT();
  useGsap(() => {
    const st = { trigger: ref.current, start: "top 85%", once: true };
    gsap.from(".c", { yPercent: 105, duration: 0.9, stagger: 0.018, ease: "expo.out", scrollTrigger: st });
    gsap.from(".section-head__n, .section-head__note", { opacity: 0, y: 12, duration: 0.9, stagger: 0.08, ease: "expo.out", scrollTrigger: st });
    gsap.from(ref.current, { backgroundSize: "0% 1px", duration: 1.4, ease: "expo.inOut", scrollTrigger: st });
  }, [lang], ref);
  return (
    <div className="section-head" ref={ref}>
      <span className="section-head__n">{String(n).padStart(2, "0")}</span>
      <h2><Chars text={title} /></h2>
      {note && <p className="section-head__note">{note}</p>}
    </div>
  );
}

function Metric({ m, i }) {
  const { tr } = useT();
  const [ref, inView] = useInView({ threshold: 0.4 });
  const v = useCountUp(m.value, m.decimals, inView);
  return (
    <div ref={ref} className={`metric reveal ${inView ? "is-in" : ""}`} style={{ "--delay": `${i * 80}ms` }}>
      <span className="metric__v">{v}<small>{m.unit}</small></span>
      <span className="metric__l">{tr(m.label)}</span>
    </div>
  );
}

/* ---------- navigation ---------- */
const NAV = [["apropos", "nav.about"], ["experience", "nav.exp"], ["formation", "nav.edu"], ["formations", "nav.tr"], ["certifications", "nav.certs"], ["projets", "nav.projects"], ["contact", "nav.contact"]];

function Nav() {
  const { t, lang, setLang } = useT();
  const [active, setActive] = useState("");
  const [progress, setProgress] = useState(0);
  const [overHero, setOverHero] = useState(true);
  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById("top");
      setOverHero(hero ? hero.getBoundingClientRect().bottom > 60 : false);
      const max = document.documentElement.scrollHeight - innerHeight;
      setProgress(max > 0 ? scrollY / max : 0);
      let cur = "";
      NAV.forEach(([id]) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < innerHeight * 0.4) cur = id;
      });
      setActive(cur);
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className={`nav ${overHero ? "nav--top" : ""}`}>
      <div className="nav__inner">
        <a href="#top" className="nav__brand">Aïcha D. Gbane</a>
        <nav aria-label="Sections">
          {NAV.map(([id, key]) => (
            <a key={id} href={`#${id}`} className={active === id ? "is-active" : ""}>{t(key)}</a>
          ))}
        </nav>
        <div className="nav__tools">
          <a className="nav__in" href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C21.4 8.65 22 11.2 22 14.5V21h-4v-5.8c0-1.4-.03-3.2-1.95-3.2-1.95 0-2.25 1.52-2.25 3.1V21h-4V9Z"/></svg><span>LinkedIn</span></a>
          <button className="nav__lang" onClick={() => setLang(lang === "fr" ? "en" : "fr")} aria-label={t("nav.lang")}>
            <span className={lang === "fr" ? "is-on" : ""}>FR</span><span className="nav__sep">/</span><span className={lang === "en" ? "is-on" : ""}>EN</span>
          </button>
        </div>
      </div>
      <span className="nav__progress" style={{ transform: `scaleX(${progress})` }} />
    </header>
  );
}

/* ---------- hero : réseau de neurones 3D ---------- */
const NAME_LINES = ["AÏCHA DÉBORAH", "GBANE"];

function Hero() {
  const { t, tr, lang } = useT();
  const { ready } = useMotion();
  const [stats, setStats] = useState(null);
  const [phase, setPhase] = useState("wait");
  const [fig, setFig] = useState("creation");
  const ref = useRef(null);
  const revealed = phase === "morph" || phase === "net";

  useGsap(() => {
    gsap.from(".hero__top > *, .hero__caption", { opacity: 0, y: -10, duration: 1.2, stagger: 0.1, ease: "expo.out", delay: 0.3 });
    gsap.fromTo(".hero__bottom", { y: 0, opacity: 1 }, { y: -60, opacity: 0, ease: "none", immediateRender: false, scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true } });
  }, [], ref);

  useGsap(() => {
    if (!revealed) return;
    scramble(ref.current.querySelector(".hero__title"), { delay: 0.4, stagger: 0.03, duration: 0.9 });
    gsap.fromTo(".hero__role, .hero__side > *", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 1.1, stagger: 0.08, ease: "expo.out", delay: 1 });
  }, [revealed, lang], ref);

  return (
    <section className={`hero hero--${phase}`} id="top" ref={ref}>
      <DataHelix3D start={ready} lines={NAME_LINES} onPhase={setPhase} onStats={setStats} onShape={setFig} />
      <div className="hero__vignette" aria-hidden="true" />

      <div className="hero__top wrap">
        <span />
        <ul className="hero__links">
          <li><a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a></li>
          <li><a href={profile.github} target="_blank" rel="noreferrer">GitHub ↗</a></li>
          <li><a href={profile.cv} target="_blank" rel="noreferrer">{t("hero.cv")} ↗</a></li>
          <li><a href={`mailto:${profile.email}`}>E-mail ↗</a></li>
        </ul>
      </div>

      <div className="hero__bottom wrap">
        <div>
          <h1 className="hero__title"><Chars text="Aïcha Déborah Gbane" /></h1>
          <p className="hero__role">{t("hero.role")} <span>{t("hero.roleEm")}</span></p>
        </div>
        <div className="hero__side">
          <p className="hero__abs">{t("hero.pitch")}</p>
          <div className="hero__cta">
            <a className="btn btn--light" href="#projets">{t("hero.see")}</a>
            <a className="btn btn--glass" href={profile.linkedin} target="_blank" rel="noreferrer"><svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C21.4 8.65 22 11.2 22 14.5V21h-4v-5.8c0-1.4-.03-3.2-1.95-3.2-1.95 0-2.25 1.52-2.25 3.1V21h-4V9Z"/></svg> LinkedIn</a>
          </div>
        </div>
      </div>

      <p className="hero__caption wrap">
        <span key={fig} className="hero__fig">{t(`hero.fig.${fig}`)}</span>
        {stats && <span>{t("hero.stats").replace("{p}", stats.pairs).replace("{t}", stats.tiles.toLocaleString(lang))}</span>}
      </p>
    </section>
  );
}

function Metrics() {
  return (
    <section className="metrics wrap" id="chiffres" aria-label="Key figures">
      {metrics.map((m, i) => <Metric key={i} m={m} i={i} />)}
    </section>
  );
}

/* ---------- à propos : phrases révélées mot par mot ---------- */
function Line({ text }) {
  const parts = text.split(/(\[\[.+?\]\])/).filter(Boolean);
  const out = [];
  parts.forEach((p, i) => {
    const hl = p.startsWith("[[");
    const words = (hl ? p.slice(2, -2) : p).split(/(\s+)/);
    const ws = words.map((w, j) => (/^\s*$/.test(w) ? w : <span className="aw" key={j}>{w}</span>));
    out.push(hl ? <strong key={i}>{ws}</strong> : <span key={i}>{ws}</span>);
  });
  return out;
}

function About() {
  const { t, tr, lang } = useT();
  const ref = useRef(null);
  useGsap(() => {
    gsap.utils.toArray(".about__line").forEach((el) => {
      const st = { trigger: el, start: "top 85%", once: true };
      gsap.from(el.querySelectorAll(".aw"), { opacity: 0, y: 18, filter: "blur(8px)", duration: 0.9, stagger: 0.045, ease: "expo.out", scrollTrigger: st });
      gsap.from(el.querySelector(".about__idx"), { opacity: 0, x: -10, duration: 0.8, scrollTrigger: st });
      gsap.fromTo(el.querySelectorAll("strong"), { backgroundSize: "0% 2px" }, { backgroundSize: "100% 2px", duration: 1.1, ease: "expo.inOut", delay: 0.6, scrollTrigger: st });
      gsap.fromTo(el, { "--rule-w": "0%" }, { "--rule-w": "100%", duration: 1.4, ease: "expo.inOut", scrollTrigger: st });
    });
    gsap.from(".facts__item", { opacity: 0, y: 14, stagger: 0.08, duration: 0.9, ease: "expo.out", scrollTrigger: { trigger: ".facts", start: "top 88%", once: true } });
  }, [lang], ref);
  return (
    <section className="section wrap" id="apropos" ref={ref}>
      <SectionHead n={1} title={t("about.title")} />
      <ol className="about__lines">
        {about.lines.map((l, i) => (
          <li className="about__line" key={i}>
            <span className="about__idx">{String(i + 1).padStart(2, "0")}</span>
            <p className="about__in"><Line text={tr(l)} /></p>
          </li>
        ))}
      </ol>
      <dl className="facts">
        {about.facts.map((f, i) => (
          <div key={i} className="facts__item">
            <dt>{tr(f.k)}</dt>
            <dd>{tr(f.v)}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/* ---------- expérience professionnelle : détaillée ---------- */
function Experience() {
  const { t, tr, lang } = useT();
  const ref = useRef(null);
  useGsap(() => {
    gsap.fromTo(".xps__line", { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: ".xps", start: "top 70%", end: "bottom 70%", scrub: true } });
    gsap.utils.toArray(".xp").forEach((el) => {
      const st = { trigger: el, start: "top 82%", once: true };
      gsap.from(el, { opacity: 0, y: 40, duration: 1.1, ease: "expo.out", scrollTrigger: st });
      gsap.from(el.querySelector(".xps__dot"), { scale: 0, duration: 0.6, ease: "back.out(3)", delay: 0.2, scrollTrigger: st });
      gsap.from(el.querySelectorAll(".xp__tasks li"), { opacity: 0, x: -14, duration: 0.8, stagger: 0.08, ease: "expo.out", delay: 0.35, scrollTrigger: st });
      gsap.from(el.querySelectorAll(".tags li"), { opacity: 0, scale: 0.9, duration: 0.6, stagger: 0.03, ease: "back.out(2)", delay: 0.6, scrollTrigger: st });
      gsap.from(el.querySelectorAll(".xp__group, .xp__take"), { opacity: 0, y: 16, duration: 0.9, stagger: 0.1, ease: "expo.out", delay: 0.5, scrollTrigger: st });
    });
  }, [lang], ref);
  return (
    <section className="section wrap" id="experience" ref={ref}>
      <SectionHead n={2} title={t("exp.title")} note={t("exp.note")} />
      <div className="xps">
        <span className="xps__rail" aria-hidden="true" /><span className="xps__line" aria-hidden="true" />
        {experience.map((e, i) => (
          <article className={`xp ${e.featured ? "xp--featured" : ""}`} key={i}>
            <span className="xps__dot" aria-hidden="true" />
            <div className="xp__side">
              <div className="xp__badges"><span className="track__type">{tr(e.type)}</span><span className="xp__dur">{tr(e.duration)}</span></div>
              <p className="xp__period">{tr(e.period)}</p>
              <p className="xp__org">{tr(e.org)}</p>
              <p className="xp__loc">{e.location}</p>
            </div>
            <div className="xp__main">
              <h3>{tr(e.title)}</h3>
              <p className="xp__desc">{tr(e.desc)}</p>
              <p className="mono-label">{t("exp.missions")}</p>
              <ul className="xp__tasks">{e.points.map((p, j) => <li key={j}><span>{String(j + 1).padStart(2, "0")}</span><p>{p.label && <strong>{tr(p.label)} — </strong>}{tr(p)}</p></li>)}</ul>
              <p className="mono-label">{t("exp.skills")}</p>
              <div className="xp__skills">
                {e.skillGroups.map((g, j) => (
                  <div className="xp__group" key={j}>
                    <span className="xp__gname">{tr(g.name)}</span>
                    <ul className="tags">{g.items.map((s, k) => <li key={k}>{tr(s)}</li>)}</ul>
                  </div>
                ))}
              </div>
              {e.takeaway && (
                <div className="xp__take">
                  <p className="mono-label">{t("exp.takeaway")}</p>
                  <p>{tr(e.takeaway)}</p>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ---------- parcours académique ---------- */
function Academic() {
  const { t, tr, lang } = useT();
  const ref = useRef(null);
  useGsap(() => {
    gsap.fromTo(".edu__line", { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: "expo.inOut", scrollTrigger: { trigger: ".edu", start: "top 80%", once: true } });
    gsap.from(".edu__item", { opacity: 0, y: 30, duration: 1, stagger: 0.15, ease: "expo.out", scrollTrigger: { trigger: ".edu", start: "top 80%", once: true } });
    gsap.from(".edu__dot", { scale: 0, duration: 0.6, stagger: 0.15, ease: "back.out(3)", delay: 0.3, scrollTrigger: { trigger: ".edu", start: "top 80%", once: true } });
  }, [lang], ref);
  return (
    <section className="section wrap" id="formation" ref={ref}>
      <SectionHead n={3} title={t("edu.title")} />
      <div className="edu">
        <span className="edu__rail" aria-hidden="true" /><span className="edu__line" aria-hidden="true" />
        {education.map((e, i) => (
          <article className="edu__item" key={i}>
            <span className="edu__dot" aria-hidden="true" />
            <p className="track__period">{tr(e.period)}</p>
            <h3>{tr(e.title)}</h3>
            <p className="track__org">{e.org}</p>
            {e.points.length > 0 && <ul>{e.points.map((p, j) => <li key={j}>{tr(p)}</li>)}</ul>}
          </article>
        ))}
      </div>
    </section>
  );
}

/* ---------- formations professionnelles ---------- */
function Trainings() {
  const { t, tr, lang } = useT();
  const ref = useRef(null);
  useGsap(() => {
    const st = { trigger: ".edu--tr", start: "top 80%", once: true };
    gsap.fromTo(".edu--tr .edu__line", { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: "expo.inOut", scrollTrigger: st });
    gsap.from(".edu--tr .edu__item", { opacity: 0, y: 30, duration: 1, stagger: 0.15, ease: "expo.out", scrollTrigger: st });
    gsap.from(".edu--tr .edu__dot", { scale: 0, duration: 0.6, stagger: 0.15, ease: "back.out(3)", delay: 0.3, scrollTrigger: st });
    gsap.from(".edu--tr .edu__item li", { opacity: 0, x: -10, duration: 0.7, stagger: 0.06, ease: "expo.out", delay: 0.6, scrollTrigger: st });
  }, [lang], ref);
  return (
    <section className="section wrap" id="formations" ref={ref}>
      <SectionHead n={4} title={t("exp.training")} note={t("tr.note")} />
      <div className="edu edu--tr">
        <span className="edu__rail" aria-hidden="true" /><span className="edu__line" aria-hidden="true" />
        {trainings.map((e, i) => (
          <article className="edu__item" key={i}>
            <span className="edu__dot" aria-hidden="true" />
            <div className="track__head"><span className="track__period">{tr(e.period)}</span><span className="xp__dur">{tr(e.duration)}</span></div>
            <h3>{tr(e.title)}</h3>
            <p className="track__org">{e.org}</p>
            <p className="tr__desc">{tr(e.desc)}</p>
            <p className="mono-label">{t("tr.program")}</p>
            <ul>{e.points.map((p, j) => <li key={j}>{tr(p)}</li>)}</ul>
            {e.distinction && <p className="tr__badge">★ {tr(e.distinction)}</p>}
          </article>
        ))}
      </div>
    </section>
  );
}

/* ---------- certifications ---------- */
function Certifications() {
  const { t, tr, lang } = useT();
  const ref = useRef(null);
  useGsap(() => {
    gsap.from(".cert", { opacity: 0, y: 24, rotateX: -12, duration: 1, stagger: 0.08, ease: "expo.out", scrollTrigger: { trigger: ".certs__grid", start: "top 85%", once: true } });
  }, [lang], ref);
  return (
    <section className="section wrap" id="certifications" ref={ref}>
      <SectionHead n={5} title={t("path.certs")} />
      <div className="certs__grid">
        {certifications.map((c, i) => (
          <div className="cert" key={i}>
            <div className="cert__top"><span className="cert__badge" aria-hidden="true">✓</span><span className="cert__date">{tr(c.date) || "—"}</span></div>
            <p className="cert__name">{tr(c.name)}</p>
            <p className="cert__org">{c.org}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- projets : études de cas ---------- */
function Lightbox({ box, onClose, onNav }) {
  const { t } = useT();
  const { lenis } = useMotion();
  const ref = useRef(null);
  useEffect(() => {
    if (!box) return;
    lenis.current?.stop();
    document.body.style.overflow = "hidden";
    const key = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNav(1);
      if (e.key === "ArrowLeft") onNav(-1);
    };
    addEventListener("keydown", key);
    gsap.fromTo(ref.current, { opacity: 0 }, { opacity: 1, duration: 0.35 });
    gsap.fromTo(ref.current.querySelector(".lb__frame"), { y: 30, scale: 0.96 }, { y: 0, scale: 1, duration: 0.6, ease: "expo.out" });
    return () => { removeEventListener("keydown", key); lenis.current?.start(); document.body.style.overflow = ""; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!box]);
  if (!box) return null;
  const many = box.images.length > 1;
  return (
    <div className="lb" ref={ref} role="dialog" aria-modal="true" aria-label={box.title} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="lb__frame">
        <div className="lb__bar">
          <span className="lb__title">{box.title}</span>
          {many && <span className="lb__count">{box.index + 1} / {box.images.length}</span>}
          <button className="lb__close" onClick={onClose} aria-label={t("lb.close")}>✕</button>
        </div>
        <div className="lb__scroll" data-lenis-prevent>
          <img key={box.images[box.index]} src={box.images[box.index]} alt={box.title} />
        </div>
      </div>
      {many && (
        <>
          <button className="lb__nav lb__nav--prev" onClick={() => onNav(-1)} aria-label={t("lb.prev")}>←</button>
          <button className="lb__nav lb__nav--next" onClick={() => onNav(1)} aria-label={t("lb.next")}>→</button>
        </>
      )}
      <p className="lb__hint">{t("lb.hint")}</p>
    </div>
  );
}

function Shot({ images, title, url, onOpen }) {
  const [cur, setCur] = useState(0);
  useEffect(() => {
    if (images.length < 2) return;
    const id = setInterval(() => setCur((c) => (c + 1) % images.length), 3800);
    return () => clearInterval(id);
  }, [images.length]);
  return (
    <div className="shot">
      <div className="shot__bar"><i /><i /><i /><span>{url || title}</span></div>
      <button className="shot__view" onClick={() => onOpen?.(cur)} aria-label={title}>
        <span className="shot__zoom" aria-hidden="true">⤢</span>
        {images.map((src, i) => (
          <img key={src} src={src} alt={title} loading="lazy" className={i === cur ? "is-on" : ""} />
        ))}
      </button>
    </div>
  );
}

function Project({ p, n, onOpen }) {
  const { t, tr } = useT();
  const [open, setOpen] = useState(false);
  const body = useRef(null);
  const toggle = () => {
    const el = body.current;
    if (!open) {
      setOpen(true);
      gsap.fromTo(el, { height: 0, opacity: 0 }, { height: "auto", opacity: 1, duration: 0.7, ease: "expo.out", onComplete: () => window.dispatchEvent(new Event("resize")) });
      gsap.from(el.querySelectorAll(".case__block"), { y: 16, opacity: 0, duration: 0.7, stagger: 0.08, ease: "expo.out", delay: 0.1 });
    } else {
      gsap.to(el, { height: 0, opacity: 0, duration: 0.5, ease: "expo.inOut", onComplete: () => { setOpen(false); window.dispatchEvent(new Event("resize")); } });
    }
  };
  return (
    <article className={`project ${open ? "is-open" : ""}`} data-idx={n} id={`p-${p.id}`}>
      <figure className="project__fig">
        <div className="project__media">
          {p.images ? <Shot onOpen={(i) => onOpen({ images: p.images, index: i, title: tr(p.title) })} images={p.images} title={tr(p.title)} url={p.demo ? p.demo.replace("https://", "") : p.repo ? p.repo.replace("https://", "") : null} /> : <Figure type={p.viz} />}
        </div>
        <figcaption><b>Fig. {n}.</b> {p.images ? t("projects.shot") : tr(p.fig)}</figcaption>
      </figure>
      <div className="project__body">
        <div className="project__meta">
          <span>{String(n).padStart(2, "0")}</span>
          <span>{tr(categories.find((c) => c.id === p.cat).label)}</span>
          <span>{p.year}</span>
        </div>
        <h3><Chars text={tr(p.title)} /></h3>
        <p className="project__summary">{tr(p.summary)}</p>
        <p className="project__context">{tr(p.context)}</p>
        <div className="project__key">
          <span className="mono-label">{t("projects.results")}</span>
          <ul className="results">{p.results.map((r, i) => <li key={i}>{tr(r)}</li>)}</ul>
        </div>
        <ul className="tags">{p.stack.map((s) => <li key={tr(s)}>{tr(s)}</li>)}</ul>
        <div className="project__actions">
          <button className="btn btn--ghost btn--sm" onClick={toggle} aria-expanded={open}>
            {open ? t("projects.close") : t("projects.read")} <span className={`chev ${open ? "is-open" : ""}`}>↓</span>
          </button>
          {p.demo && <a className="btn btn--sm" href={p.demo} target="_blank" rel="noreferrer">{t("projects.demo")} ↗</a>}
          {p.repo ? (
            <a className="link" href={p.repo} target="_blank" rel="noreferrer">{t("projects.code")}</a>
          ) : (
            <span className="muted mono-small">{t("projects.private")}</span>
          )}
        </div>
      </div>
      <div className="case" ref={body} style={{ height: open ? undefined : 0 }} aria-hidden={!open}>
        <div className="case__inner">
          <div className="case__block">
            <p className="mono-label">{t("projects.approach")}</p>
            <ol className="steps">{p.steps.map((s, i) => <li key={i}><span>{String(i + 1).padStart(2, "0")}</span>{tr(s)}</li>)}</ol>
          </div>
          <div className="case__block">
            <p className="mono-label">{t("projects.stack")}</p>
            <ul className="tags">{p.stack.map((s) => <li key={tr(s)}>{tr(s)}</li>)}</ul>
          </div>
        </div>
      </div>
    </article>
  );
}

function Projects() {
  const { t, tr, lang } = useT();
  const [cat, setCat] = useState("all");
  const ref = useRef(null);
  const [box, setBox] = useState(null);
  const ordered = [...projects.filter((p) => p.images), ...projects.filter((p) => !p.images)];
  const list = ordered.filter((p) => cat === "all" || p.cat === cat);

  useGsap(() => {
    gsap.utils.toArray(".project").forEach((el) => {
      const st = { trigger: el, start: "top 82%", once: true };
      const media = el.querySelector(".project__media");
      gsap.fromTo(media, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "expo.inOut", scrollTrigger: st });
      gsap.from(el.querySelectorAll("h3 .c"), { yPercent: 105, duration: 0.9, stagger: 0.01, ease: "expo.out", delay: 0.15, scrollTrigger: st });
      gsap.from(el.querySelectorAll(".project__meta, .project__summary, .project__context, .project__key, .project__body > .tags li, .project__actions"), { opacity: 0, y: 12, duration: 0.8, stagger: 0.04, ease: "expo.out", delay: 0.3, scrollTrigger: st });
    });
  }, [cat, lang], ref);

  return (
    <section className="section wrap" id="projets" ref={ref}>
      <SectionHead n={6} title={t("projects.title")} note={t("projects.note")} />
      <div className="filters" role="tablist" aria-label={t("projects.filter")}>
        {categories.map((c) => (
          <button key={c.id} role="tab" aria-selected={cat === c.id} className={cat === c.id ? "is-active" : ""} onClick={() => setCat(c.id)}>
            {tr(c.label)}
            <span className="filters__n">{c.id === "all" ? projects.length : projects.filter((p) => p.cat === c.id).length}</span>
          </button>
        ))}
      </div>
      <div className="projects">
        {list.map((p) => <Project key={p.id} p={p} n={ordered.indexOf(p) + 1} onOpen={setBox} />)}
      </div>
      <Lightbox box={box} onClose={() => setBox(null)} onNav={(d) => setBox((b) => ({ ...b, index: (b.index + d + b.images.length) % b.images.length }))} />
    </section>
  );
}

function Lab() {
  const { t } = useT();
  return (
    <section className="section wrap" id="laboratoire">
      <SectionHead n={7} title={t("lab.title")} note={t("lab.note")} />
      <Reveal><KMeansLab /></Reveal>
    </section>
  );
}

/* ---------- compétences : graphe compétences ↔ projets + domaines ---------- */
const ICONS = {
  db: <path d="M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3Zm0 0v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />,
  ml: <path d="M5 6a2 2 0 1 0 0 .01M5 18a2 2 0 1 0 0 .01M19 12a2 2 0 1 0 0 .01M12 6a2 2 0 1 0 0 .01M12 18a2 2 0 1 0 0 .01M7 6h3M7 18h3M14 6l3.5 5M14 18l3.5-5M5 8v8" />,
  nlp: <path d="M4 5h16v10H9l-5 4V5Zm4 4h8M8 12h5" />,
  eye: <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />,
  api: <path d="M8 7 3 12l5 5M16 7l5 5-5 5M14 4l-4 16" />,
  chart: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
};

function SkillGraph({ list }) {
  const { tr, t } = useT();
  const [hover, setHover] = useState(null); // { kind: "s" | "p", id }
  const ref = useRef(null);
  const { lang } = useT();
  // compétences les plus utilisées (au moins 2 projets)
  const sk = list.flatMap((g) => g.items.map((it) => ({ ...it, label: tr(it.name), g: g.id }))).filter((it) => it.p.length >= 2).sort((a, b) => b.p.length - a.p.length).slice(0, 12);
  const used = new Set(sk.flatMap((x) => x.p));
  const pr = projects.filter((p) => used.has(p.id));
  const rowH = 46, H = Math.max(sk.length, pr.length) * rowH + 20;
  const yS = (i) => 20 + i * ((H - 40) / Math.max(1, sk.length - 1));
  const yP = (i) => 20 + i * ((H - 40) / Math.max(1, pr.length - 1));
  const XS = 290, XP = 660;
  const on = (si, pid) => !hover || (hover.kind === "s" && hover.id === si) || (hover.kind === "p" && hover.id === pid);
  const nodeOn = (kind, id) => !hover || (hover.kind === kind && hover.id === id) || (kind === "p" && hover.kind === "s" && sk[hover.id].p.includes(id)) || (kind === "s" && hover.kind === "p" && sk[id].p.includes(hover.id));
  useGsap(() => {
    const st = { trigger: ref.current, start: "top 80%", once: true };
    gsap.from(".sg__link", { strokeDashoffset: 1400, duration: 1.6, stagger: 0.015, ease: "expo.inOut", scrollTrigger: st });
    gsap.from(".sg__in", { opacity: 0, x: (i, el) => (el.dataset.side === "s" ? -20 : 20), duration: 0.9, stagger: 0.03, ease: "expo.out", scrollTrigger: st });
  }, [lang], ref);
  const go = (pid) => document.getElementById(`p-${pid}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  return (
    <div className="sg" ref={ref}>
      <div className="sg__legend mono-small"><span>{t("skills.graphL")}</span><span>{t("skills.graphR")}</span></div>
      <svg viewBox={`0 0 1000 ${H}`} className="sg__svg" role="img" aria-label={t("skills.graphAria")} onMouseLeave={() => setHover(null)}>
        {sk.map((x, si) => x.p.map((pid) => {
          const pi = pr.findIndex((p) => p.id === pid);
          if (pi < 0) return null;
          const y1 = yS(si), y2 = yP(pi);
          return <path key={si + pid} className={`sg__link ${on(si, pid) ? "is-on" : "is-off"} ${hover ? "is-focus" : ""}`} d={`M${XS + 8},${y1} C${XS + 220},${y1} ${XP - 220},${y2} ${XP - 8},${y2}`} />;
        }))}
        {sk.map((x, i) => (
          <g key={x.label} className={`sg__node ${nodeOn("s", i) ? "" : "is-dim"}`} transform={`translate(${XS},${yS(i)})`} onMouseEnter={() => setHover({ kind: "s", id: i })}>
            <g className="sg__in" data-side="s">
              <circle r={4 + x.p.length * 0.8} />
              <text x={-14} dy="0.35em" textAnchor="end">{x.label}</text>
            </g>
          </g>
        ))}
        {pr.map((p, i) => (
          <g key={p.id} className={`sg__node sg__node--p ${nodeOn("p", p.id) ? "" : "is-dim"}`} transform={`translate(${XP},${yP(i)})`} onMouseEnter={() => setHover({ kind: "p", id: p.id })} onClick={() => go(p.id)}>
            <g className="sg__in" data-side="p">
              <circle r={5} />
              <text x={14} dy="0.35em">{tr(p.title).split(" — ")[0]}</text>
            </g>
          </g>
        ))}
      </svg>
      <p className="sg__hint mono-small">{t("skills.graphHint")}</p>
    </div>
  );
}

function Skills() {
  const { t, tr, lang } = useT();
  const ref = useRef(null);
  useGsap(() => {
    gsap.from(".skill", { opacity: 0, y: 24, stagger: 0.08, duration: 1, ease: "expo.out", scrollTrigger: { trigger: ".skills", start: "top 82%", once: true } });
    gsap.from(".skill__tools li", { opacity: 0, x: -10, stagger: 0.02, duration: 0.6, ease: "expo.out", delay: 0.3, scrollTrigger: { trigger: ".skills", start: "top 82%", once: true } });
  }, [lang], ref);
  const name = (pid) => tr(projects.find((p) => p.id === pid)?.title || "").split(" — ")[0];
  return (
    <section className="section wrap" id="competences" ref={ref}>
      <SectionHead n={8} title={t("skills.title")} note={t("skills.note")} />
      <SkillGraph list={skills} />
      <div className="skills">
        {skills.map((g) => (
          <article key={g.id} className="skill">
            <div className="skill__head">
              <span className="skill__icon"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{ICONS[g.icon]}</svg></span>
              <h3>{tr(g.group)}</h3>
            </div>
            <p className="skill__desc">{tr(g.desc)}</p>
            <ul className="skill__tools">
              {g.items.map((it, j) => (
                <li key={j} title={it.p.length ? it.p.map(name).join(" · ") : ""}>
                  <span>{tr(it.name)}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ---------- contact ---------- */
function Contact() {
  const { t, tr, lang } = useT();
  const ref = useRef(null);
  const rows = [
    ["contact.email", profile.email, `mailto:${profile.email}`],
    ["contact.phone", profile.phone, `tel:${profile.phone.replace(/\s/g, "")}`],
    ["contact.linkedin", "linkedin.com/in/aïcha-déborah-gbane", profile.linkedin],
    ["contact.github", "github.com/deborah-gbane", profile.github],
    ["contact.location", tr(profile.location), null],
    ["contact.cv", t("contact.download"), profile.cv],
  ];
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(profile.email); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* presse-papiers indisponible */ }
  };
  useGsap(() => {
    const st = { trigger: ".contact__grid", start: "top 80%", once: true };
    gsap.from(".contact__lead .aw", { opacity: 0, y: 18, filter: "blur(8px)", duration: 0.9, stagger: 0.04, ease: "expo.out", scrollTrigger: st });
    gsap.from(".contact__actions > *", { opacity: 0, y: 14, duration: 0.8, stagger: 0.08, ease: "expo.out", delay: 0.6, scrollTrigger: st });
    gsap.fromTo(".contact__row", { "--line": "0%" }, { "--line": "100%", duration: 1.2, stagger: 0.1, ease: "expo.inOut", scrollTrigger: st });
    gsap.from(".contact__row > *", { opacity: 0, x: -16, duration: 0.9, stagger: 0.05, ease: "expo.out", delay: 0.2, scrollTrigger: st });
    gsap.from(".contact__pulse", { scale: 0, opacity: 0, duration: 1, ease: "back.out(2)", delay: 0.3, scrollTrigger: st });
  }, [lang], ref);
  return (
    <section className="section wrap contact" id="contact" ref={ref}>
      <SectionHead n={9} title={t("contact.title")} />
      <div className="contact__grid">
        <div className="contact__intro">
          <span className="contact__pulse" aria-hidden="true"><i /><i /><i /></span>
          <p className="contact__lead"><Line text={t("contact.lead")} /></p>
          <div className="contact__actions">
            <a className="btn" href={`mailto:${profile.email}`}>{t("contact.write")}</a>
            <button className="btn btn--ghost" onClick={copy}>{copied ? t("contact.copied") : t("contact.copy")}</button>
          </div>
        </div>
        <ul className="contact__list">
          {rows.map(([k, v, href]) => (
            <li className="contact__row" key={k}>
              <span className="contact__k"><span className="contact__n">{String(rows.findIndex((r) => r[0] === k) + 1).padStart(2, "0")}</span>{t(k)}</span>
              {href ? (
                <a className="contact__v" href={href} target={href.startsWith("http") || href.endsWith(".pdf") ? "_blank" : undefined} rel="noreferrer">{v}<span className="contact__arrow">↗</span></a>
              ) : (
                <span className="contact__v">{v}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
      <footer className="footer">
        <span>© 2026 {profile.name}</span>
        <span>{t("contact.built")}</span>
      </footer>
    </section>
  );
}

export default function App() {
  useEffect(() => { document.documentElement.dataset.theme = "light"; }, []);

  return (
    <>
      <NeuroBackground />
      <Nav />
      <main>
        <Hero />
        <Metrics />
        <About />
        <Experience />
        <Academic />
        <Trainings />
        <Certifications />
        <Projects />
        <Lab />
        <Skills />
        <Contact />
      </main>
    </>
  );
}
