import { createContext, useContext, useEffect, useState } from "react";

/* Langue courante accessible aussi hors React (dessins canvas). */
let CURRENT = "fr";
export const getLang = () => CURRENT;

/** Renvoie la valeur dans la langue demandée : "texte" ou { fr, en }. */
export const tr = (v, lang = CURRENT) => (v && typeof v === "object" && !Array.isArray(v) && ("fr" in v || "en" in v) ? v[lang] ?? v.fr : v);

const LangContext = createContext({ lang: "fr", setLang: () => {} });

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      const saved = localStorage.getItem("lang");
      if (saved === "fr" || saved === "en") return saved;
    } catch { /* stockage indisponible */ }
    return (navigator.language || "fr").toLowerCase().startsWith("fr") ? "fr" : "en";
  });
  CURRENT = lang;
  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = lang === "fr" ? "Aïcha Déborah Gbane — Data Science & IA" : "Aïcha Déborah Gbane — Data Science & AI";
    try { localStorage.setItem("lang", lang); } catch { /* stockage indisponible */ }
  }, [lang]);
  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

/** t("clé") → texte de l'interface dans la langue courante. */
export function useT() {
  const { lang, setLang } = useContext(LangContext);
  const t = (key) => tr(UI[key], lang) ?? key;
  return { t, lang, setLang, tr: (v) => tr(v, lang) };
}

export const UI = {
  "nav.about": { fr: "À propos", en: "About" },
  "about.title": { fr: "À propos", en: "About" },
  "hero.pitch": { fr: "Machine learning, NLP et IA générative — de l'analyse exploratoire au modèle servi par une API.", en: "Machine learning, NLP and generative AI — from exploratory analysis to a model served by an API." },
  "nav.exp": { fr: "Expérience", en: "Experience" },
  "nav.edu": { fr: "Parcours", en: "Education" },
  "nav.tr": { fr: "Formations", en: "Training" },
  "tr.note": { fr: "Des programmes intensifs suivis en parallèle de mon cursus pour élargir mes compétences.", en: "Intensive programmes followed alongside my degree to broaden my skills." },
  "tr.program": { fr: "Programme", en: "Programme" },
  "projects.stack": { fr: "Technologies", en: "Technologies" },
  "nav.certs": { fr: "Certifications", en: "Certifications" },
  "exp.note": { fr: "Là où je mets la data science et l'intelligence artificielle au service d'une grande entreprise.", en: "Where I put data science and artificial intelligence to work for a major company." },
  "exp.trainingBadge": { fr: "Formation", en: "Training" },
  "exp.title": { fr: "Expérience professionnelle", en: "Professional experience" },
  "exp.missions": { fr: "Mes missions", en: "My responsibilities" },
  "exp.takeaway": { fr: "Ce que cette expérience m'apporte", en: "What this experience brings me" },
  "exp.skills": { fr: "Compétences et technologies mobilisées", en: "Skills and technologies applied" },
  "exp.training": { fr: "Formations professionnelles", en: "Professional training" },
  "edu.title": { fr: "Parcours académique", en: "Academic background" },
  "nav.projects": { fr: "Projets", en: "Projects" },
  "nav.lab": { fr: "Laboratoire", en: "Lab" },
  "nav.path": { fr: "Parcours", en: "Background" },
  "nav.skills": { fr: "Compétences", en: "Skills" },
  "nav.contact": { fr: "Contact", en: "Contact" },
  "nav.theme": { fr: "Changer de thème", en: "Toggle theme" },
  "nav.lang": { fr: "Switch to English", en: "Passer en français" },

  "loader.init": { fr: "Initialisation du modèle", en: "Initialising model" },
  "loader.training": { fr: "Entraînement — epoch", en: "Training — epoch" },

  "hero.role": { fr: "Data Science & Intelligence Artificielle", en: "Data Science & Artificial Intelligence" },
  "hero.roleEm": { fr: "· du jeu de données au modèle en production", en: "· from raw data to models in production" },
  "hero.abstract": { fr: "Résumé", en: "Abstract" },
  "hero.see": { fr: "Voir les projets", en: "View projects" },
  "hero.cv": { fr: "CV (PDF)", en: "Résumé (PDF)" },
  "hero.em": { fr: "là où la donnée", en: "where data" },
  "hero.line4": { fr: "devient décision", en: "becomes decision" },
  "hero.l.projects": { fr: "projets", en: "projects" },
  "hero.l.cv": { fr: "cv", en: "résumé" },
  "hero.fig.creation": { fr: "Fig. 0 — L'humain et l'intelligence artificielle se rejoignent autour de la donnée", en: "Fig. 0 — Human and artificial intelligence meet around data" },
  "hero.fig.brain": { fr: "Fig. 0 — Un cerveau en particules : l'inspiration biologique des réseaux de neurones", en: "Fig. 0 — A particle brain: the biological inspiration behind neural networks" },
  "hero.fig.galaxy": { fr: "Fig. 0 — Galaxie de données : des milliers de points en spirale", en: "Fig. 0 — Data galaxy: thousands of points in a spiral" },
  "hero.fig.layers": { fr: "Fig. 0 — Réseau de neurones en couches : de l'entrée à la prédiction", en: "Fig. 0 — Layered neural network: from input to prediction" },
  "hero.fig.helix": { fr: "Fig. 0 — Hélice de données : l'ADN de la data, en rotation continue", en: "Fig. 0 — Data helix: the DNA of data, in continuous rotation" },
  "hero.fig": { fr: "Fig. 0 — L'humain et l'intelligence artificielle se rejoignent autour de la donnée", en: "Fig. 0 — Human and artificial intelligence meet around data" },
  "hero.stats": { fr: "{p} paires · {t} tuiles de données", en: "{p} pairs · {t} data tiles" },
  "hero.scroll": { fr: "Défiler", en: "Scroll" },

  "projects.title": { fr: "Projets", en: "Projects" },
  "projects.note": { fr: "Dix projets en machine learning, NLP, vision et applications web, de la donnée brute jusqu'au produit en ligne.", en: "Ten projects in machine learning, NLP, computer vision and web apps, from raw data to a live product." },
  "projects.result": { fr: "Résultat clé", en: "Key outcome" },
  "projects.demo": { fr: "Voir la démo en ligne", en: "Open the live demo" },
  "projects.shot": { fr: "Capture de l'application réelle.", en: "Screenshot of the actual application." },
  "projects.read": { fr: "Voir la démarche", en: "See the approach" },
  "projects.close": { fr: "Masquer la démarche", en: "Hide the approach" },
  "projects.context": { fr: "Contexte & problème", en: "Context & problem" },
  "projects.approach": { fr: "Démarche", en: "Approach" },
  "projects.results": { fr: "Résultats", en: "Results" },
  "projects.code": { fr: "Code source sur GitHub ↗", en: "Source code on GitHub ↗" },
  "projects.private": { fr: "Dépôt privé", en: "Private repository" },
  "projects.openLab": { fr: "Ouvrir le laboratoire K-Means ↓", en: "Open the K-Means lab ↓" },
  "projects.filter": { fr: "Filtrer les projets", en: "Filter projects" },

  "lab.title": { fr: "Laboratoire — segmentation K-Means", en: "Lab — K-Means segmentation" },
  "lab.note": {
    fr: "Reproduction du modèle de segmentation clients. Les points sont simulés autour des 5 centroïdes réels du modèle entraîné (200 clients) ; la classification utilise ces centroïdes après standardisation.",
    en: "A reproduction of the customer segmentation model. Points are simulated around the 5 real centroids of the trained model (200 customers); classification uses those centroids after standardisation.",
  },
  "lab.lloyd": { fr: "Algorithme de Lloyd", en: "Lloyd's algorithm" },
  "lab.iteration": { fr: "itération", en: "iteration" },
  "lab.inertia": { fr: "inertie (données standardisées)", en: "inertia (standardised data)" },
  "lab.restart": { fr: "Relancer l'entraînement (k-means++, n_init = 10)", en: "Retrain (k-means++, n_init = 10)" },
  "lab.elbow": { fr: "Méthode du coude", en: "Elbow method" },
  "lab.classify": { fr: "Classer un client", en: "Classify a customer" },
  "lab.hint": { fr: "Clique dans le graphique pour ajouter un client : il est classé avec les centroïdes du modèle entraîné.", en: "Click the chart to add a customer: it is classified with the trained model's centroids." },
  "lab.segment": { fr: "Clientèle", en: "Segment:" },
  "lab.income": { fr: "revenu", en: "income" },
  "lab.score": { fr: "score", en: "score" },
  "lab.dist": { fr: "distance au centroïde", en: "distance to centroid" },
  "lab.second": { fr: "2ᵉ choix", en: "runner-up" },
  "lab.xaxis": { fr: "Revenu annuel (k$)", en: "Annual income (k$)" },
  "lab.yaxis": { fr: "Score de dépense", en: "Spending score" },
  "lab.aria": { fr: "Nuage de points revenu annuel contre score de dépense, coloré selon les 5 clusters K-Means. Cliquer pour classer un nouveau client.", en: "Scatter plot of annual income against spending score, coloured by the 5 K-Means clusters. Click to classify a new customer." },

  "path.title": { fr: "Parcours", en: "Background" },
  "path.certs": { fr: "Certifications", en: "Certifications" },
  "path.exp": { fr: "Expérience professionnelle", en: "Professional experience" },
  "path.edu": { fr: "Parcours académique", en: "Education" },

  "skills.note": { fr: "Chaque compétence est reliée aux projets où je l'ai réellement utilisée.", en: "Each skill is linked to the projects where I actually used it." },
  "skills.graphL": { fr: "Compétences", en: "Skills" },
  "skills.graphR": { fr: "Projets", en: "Projects" },
  "skills.projects": { fr: "projets", en: "projects" },
  "skills.graphAria": { fr: "Graphe reliant chaque compétence aux projets qui l'utilisent", en: "Graph linking each skill to the projects that use it" },
  "skills.graphHint": { fr: "Survole une compétence ou un projet pour voir les liens · clique sur un projet pour l'ouvrir", en: "Hover a skill or a project to see its links · click a project to open it" },
  "skills.title": { fr: "Compétences", en: "Skills" },
  "skills.fr": { fr: "Français", en: "French" },
  "skills.frLevel": { fr: "langue maternelle", en: "native" },
  "skills.en": { fr: "Anglais", en: "English" },

  "contact.title": { fr: "Contact", en: "Contact" },
  "contact.lead": { fr: "Une offre de stage, une question sur un projet ou une collaboration ? Je réponds rapidement.", en: "An internship offer, a question about a project or a collaboration? I reply quickly." },
  "contact.write": { fr: "Écrire un e-mail", en: "Send an email" },
  "contact.copy": { fr: "Copier l'adresse", en: "Copy address" },
  "contact.copied": { fr: "Adresse copiée ✓", en: "Address copied ✓" },
  "lb.close": { fr: "Fermer", en: "Close" },
  "lb.prev": { fr: "Image précédente", en: "Previous image" },
  "lb.next": { fr: "Image suivante", en: "Next image" },
  "lb.hint": { fr: "Échap pour fermer · ← → pour naviguer · défile pour voir toute la capture", en: "Esc to close · ← → to navigate · scroll to see the whole screenshot" },
  "contact.email": { fr: "E-mail", en: "Email" },
  "contact.phone": { fr: "Téléphone", en: "Phone" },
  "contact.linkedin": { fr: "LinkedIn", en: "LinkedIn" },
  "contact.github": { fr: "GitHub", en: "GitHub" },
  "contact.location": { fr: "Localisation", en: "Location" },
  "contact.cv": { fr: "CV", en: "Résumé" },
  "contact.download": { fr: "Télécharger le CV (PDF)", en: "Download résumé (PDF)" },
  "contact.built": { fr: "Conçu et développé avec React, Three.js et GSAP", en: "Designed and built with React, Three.js and GSAP" },

  "cursor.view": { fr: "Voir", en: "View" },
  "cursor.write": { fr: "Écrire", en: "Write" },
  "cursor.click": { fr: "Cliquer", en: "Click" },
};
