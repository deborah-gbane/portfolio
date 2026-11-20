import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { reducedMotion } from "./hooks.js";

gsap.registerPlugin(ScrollTrigger);

const MotionContext = createContext({ ready: false, lenis: { current: null } });
export const useMotion = () => useContext(MotionContext);

/* =========================================================
   Fournisseur : défilement fluide (Lenis) + état "prêt" après le loader
   ========================================================= */
export function MotionProvider({ children }) {
  const still = reducedMotion();
  const [ready, setReady] = useState(still);
  const lenis = useRef(null);

  useEffect(() => {
    if (still) return;
    const l = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
    lenis.current = l;
    l.stop();
    l.on("scroll", ScrollTrigger.update);
    const raf = (time) => l.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // liens d'ancre → défilement fluide
    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href");
      const target = id === "#top" ? 0 : document.querySelector(id);
      if (target === null) return;
      e.preventDefault();
      l.scrollTo(target, { offset: -60, duration: 1.4 });
    };
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(raf);
      l.destroy();
    };
  }, [still]);

  // l'intro démarre dès que les polices sont prêtes (au plus 1 s d'attente)
  useEffect(() => {
    if (ready) return;
    const go = () => { document.documentElement.classList.add("is-ready"); setReady(true); };
    const timer = setTimeout(go, 1000);
    document.fonts?.ready.then(() => { clearTimeout(timer); go(); });
    return () => clearTimeout(timer);
  }, [ready]);

  useEffect(() => {
    if (!ready) return;
    lenis.current?.start();
    document.documentElement.classList.add("is-ready");
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [ready]);

  return (
    <MotionContext.Provider value={{ ready, lenis }}>
      {children}
    </MotionContext.Provider>
  );
}

/** Animations GSAP liées à un conteneur, relancées quand `deps` change. */
export function useGsap(fn, deps, scope) {
  const { ready } = useMotion();
  useLayoutEffect(() => {
    if (!ready || reducedMotion()) return;
    const ctx = gsap.context(fn, scope?.current || undefined);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, ...deps]);
}

/* =========================================================
   Texte découpé en lettres (masque par mot)
   ========================================================= */
export function Chars({ text, className = "" }) {
  const words = String(text).split(" ");
  return (
    <span className={`chars ${className}`} aria-label={text} role="text">
      {words.map((w, i) => (
        <span className="w" aria-hidden="true" key={i}>
          {[...w].map((c, j) => <span className="c" key={j}>{c}</span>)}
          {i < words.length - 1 && <span className="c">&nbsp;</span>}
        </span>
      ))}
    </span>
  );
}

/* =========================================================
   Décodage façon "données" : chaque lettre fait défiler des
   symboles scientifiques avant de se fixer.
   ========================================================= */
const GLYPHS = "01∑λΔ∂∇≈µπσθ#%&<>/";
export function scramble(root, { delay = 0, duration = 1.1, stagger = 0.035 } = {}) {
  const cs = [...root.querySelectorAll(".c")].filter((c) => c.textContent.trim());
  cs.forEach((c) => { c.dataset.ch ??= c.textContent; });
  if (reducedMotion()) return;
  cs.forEach((c, i) => {
    const final = c.dataset.ch;
    const o = { p: 0 };
    gsap.fromTo(c, { opacity: 0 }, { opacity: 1, duration: 0.2, delay: delay + i * stagger });
    gsap.to(o, {
      p: 1, duration, delay: delay + i * stagger, ease: "none",
      onUpdate: () => {
        c.textContent = o.p < 0.85 ? GLYPHS[(Math.random() * GLYPHS.length) | 0] : final;
        c.classList.toggle("is-glyph", o.p < 0.85);
      },
      onComplete: () => { c.textContent = final; c.classList.remove("is-glyph"); },
    });
  });
}
