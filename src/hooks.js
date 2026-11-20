import { useEffect, useRef, useState } from "react";

export const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Lit les couleurs du thème courant (variables CSS) pour les dessins canvas. */
export function readTheme() {
  const s = getComputedStyle(document.documentElement);
  const v = (n) => s.getPropertyValue(n).trim();
  return { ink: v("--ink"), muted: v("--muted"), rule: v("--rule"), bg: v("--bg"), accent: v("--accent"), accent2: v("--accent-2") };
}

/** Convertit #rrggbb en rgba(). */
export function rgba(hex, a) {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

/**
 * Canvas animé : gère le DPR, le redimensionnement, la pause hors écran
 * et le mouvement réduit. `setup(size)` renvoie un état ; `draw(ctx, state, t, dt, size, theme)` dessine.
 */
export function useCanvas(setup, draw, deps = []) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let size = { w: 0, h: 0 };
    let state = null;
    let theme = readTheme();
    let raf = 0, visible = false, last = 0, t = 0;
    const still = reducedMotion();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth, h = canvas.clientHeight;
      if (!w || !h) return;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      size = { w, h };
      state = setup(size, state);
      if (still) draw(ctx, state, 4, 0, size, theme);
    };
    const loop = (now) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min((now - last) / 1000 || 0, 0.05);
      last = now;
      if (!visible || !state) return;
      t += dt;
      draw(ctx, state, t, dt, size, theme);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);
    const mo = new MutationObserver(() => {
      theme = readTheme();
      if (still && state) draw(ctx, state, 4, 0, size, theme);
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onScheme = () => (theme = readTheme());
    mq.addEventListener("change", onScheme);

    resize();
    if (!still) raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect(); io.disconnect(); mo.disconnect();
      mq.removeEventListener("change", onScheme);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}

/** Ajoute la classe .is-in quand l'élément entre dans la vue (une fois). */
export function useInView(options = { threshold: 0.15 }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reducedMotion()) return setInView(true);
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); io.disconnect(); }
    }, options);
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return [ref, inView];
}

/** Compteur animé (ease-out) déclenché à l'apparition. */
export function useCountUp(target, decimals, start) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!start) return;
    if (reducedMotion()) return setV(target);
    let raf, t0;
    const step = (now) => {
      t0 ??= now;
      const p = Math.min((now - t0) / 1600, 1);
      setV(target * (1 - Math.pow(1 - p, 4)));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [start, target]);
  return v.toLocaleString("fr-FR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export const rand = (a, b) => a + Math.random() * (b - a);
export const randn = () => {
  let u = 0, v = 0;
  while (!u) u = Math.random();
  while (!v) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
};
export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a, b, t) => a + (b - a) * t;
