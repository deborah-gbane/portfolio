import { useEffect, useRef } from "react";
import { reducedMotion } from "../hooks.js";
import { getLang } from "../i18n.jsx";

/**
 * Réseau de neurones en fond de page (canvas 2D, plein écran, fixe).
 * - des neurones dérivent lentement et se connectent à leurs voisins proches ;
 * - un neurone qui s'active envoie des impulsions le long de ses connexions ;
 *   à l'arrivée, le neurone voisin peut s'activer à son tour (cascade) ;
 * - le pointeur stimule les neurones proches ; le défilement crée une parallaxe.
 */
// couleur courante, interpolée entre orange (FR) et cobalt (EN)
const COL = [242, 107, 29];
const rgba = (a) => `rgba(${COL[0] | 0},${COL[1] | 0},${COL[2] | 0},${a})`;

export default function NeuroBackground() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    const still = reducedMotion();
    let W = 0, H = 0, DPR = 1, nodes = [], pulses = [], raf = 0, last = 0, spont = 0;
    const mouse = { x: -1e4, y: -1e4 };
    const LINK = 170;

    const init = () => {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * DPR; canvas.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      const n = Math.round(Math.min(130, Math.max(40, (W * H) / 19000)));
      nodes = Array.from({ length: n }, () => ({
        x: Math.random() * W, y: Math.random() * H * 1.6,
        vx: (Math.random() - 0.5) * 6, vy: (Math.random() - 0.5) * 6,
        r: 1.4 + Math.random() * 1.8, act: 0, refr: 0, depth: 0.15 + Math.random() * 0.35,
      }));
      pulses = [];
    };

    const pos = (n) => {
      // parallaxe : les neurones remontent plus ou moins vite selon leur « profondeur »
      const span = H * 1.6;
      let y = (n.y - window.scrollY * n.depth) % span;
      if (y < 0) y += span;
      return [n.x, y - H * 0.3];
    };

    const fire = (i) => {
      const n = nodes[i];
      if (n.refr > 0) return;
      n.act = 1; n.refr = 1.2;
      const [x, y] = pos(n);
      let sent = 0;
      for (let j = 0; j < nodes.length && sent < 3; j++) {
        if (j === i) continue;
        const [x2, y2] = pos(nodes[j]);
        const d = Math.hypot(x - x2, y - y2);
        if (d < LINK && Math.random() < 0.7) { pulses.push({ a: i, b: j, t: 0, dur: d / 140 }); sent++; }
      }
    };

    const draw = (dt) => {
      ctx.clearRect(0, 0, W, H);
      const P = nodes.map(pos);
      // connexions
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = P[i][0] - P[j][0], dy = P[i][1] - P[j][1];
          const d2 = dx * dx + dy * dy;
          if (d2 > LINK * LINK) continue;
          const k = 1 - Math.sqrt(d2) / LINK;
          const boost = Math.max(nodes[i].act, nodes[j].act);
          ctx.strokeStyle = rgba(0.05 + k * 0.12 + boost * 0.25 * k);
          ctx.lineWidth = 0.6 + boost * 0.8;
          ctx.beginPath(); ctx.moveTo(P[i][0], P[i][1]); ctx.lineTo(P[j][0], P[j][1]); ctx.stroke();
        }
      }
      // impulsions
      for (let k = pulses.length - 1; k >= 0; k--) {
        const p = pulses[k];
        p.t += dt / Math.max(p.dur, 0.2);
        if (p.t >= 1) {
          pulses.splice(k, 1);
          if (Math.random() < 0.55) fire(p.b); else nodes[p.b].act = Math.max(nodes[p.b].act, 0.5);
          continue;
        }
        const [ax, ay] = P[p.a], [bx, by] = P[p.b];
        const x = ax + (bx - ax) * p.t, y = ay + (by - ay) * p.t;
        const g = ctx.createRadialGradient(x, y, 0, x, y, 6);
        g.addColorStop(0, rgba(0.9)); g.addColorStop(1, rgba(0));
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fill();
      }
      // neurones
      nodes.forEach((n, i) => {
        const [x, y] = P[i];
        if (n.act > 0.05) {
          ctx.fillStyle = rgba(n.act * 0.18);
          ctx.beginPath(); ctx.arc(x, y, n.r + 10 * n.act, 0, Math.PI * 2); ctx.fill();
        }
        ctx.fillStyle = rgba(0.25 + n.act * 0.7);
        ctx.beginPath(); ctx.arc(x, y, n.r + n.act * 1.5, 0, Math.PI * 2); ctx.fill();
      });
    };

    const loop = (now) => {
      raf = requestAnimationFrame(loop);
      if (document.hidden) return;
      const dt = Math.min((now - last) / 1000 || 0, 0.05);
      last = now;
      nodes.forEach((n, i) => {
        n.x += n.vx * dt; n.y += n.vy * dt;
        if (n.x < -20) n.x = W + 20; if (n.x > W + 20) n.x = -20;
        n.act *= Math.exp(-dt * 1.8); n.refr -= dt;
        const [x, y] = pos(n);
        if (Math.hypot(x - mouse.x, y - mouse.y) < 70 && Math.random() < 0.05) fire(i);
      });
      spont -= dt;
      if (spont <= 0) { fire((Math.random() * nodes.length) | 0); spont = 0.5 + Math.random() * 0.9; }
      if (pulses.length > 120) pulses.splice(0, pulses.length - 120);
      const tgt = getLang() === "en" ? [37, 99, 235] : [242, 107, 29];
      for (let c = 0; c < 3; c++) COL[c] += (tgt[c] - COL[c]) * (1 - Math.exp(-dt * 2.5));
      draw(dt);
    };

    const onMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const onResize = () => init();
    init();
    if (still) draw(0);
    else raf = requestAnimationFrame(loop);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={ref} className="neuro-bg" aria-hidden="true" />;
}
