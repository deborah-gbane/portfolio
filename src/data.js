// Contenu du portfolio — issu du CV, des dépôts GitHub (github.com/deborah-gbane) et du code des projets.
// Chaque texte existe en français (fr) et en anglais (en).

export const profile = {
  name: "Aïcha Déborah Gbane",
  short: "A. D. Gbane",
  location: { fr: "Abidjan, Côte d'Ivoire", en: "Abidjan, Côte d'Ivoire" },
  status: { fr: "Recherche un stage en data science / IA", en: "Looking for a data science / AI internship" },
  email: "deborahgbane81@gmail.com",
  phone: "+225 07 69 25 35 22",
  github: "https://github.com/deborah-gbane",
  linkedin: "https://www.linkedin.com/in/a%C3%AFcha-d%C3%A9borah-gbane-02a628350",
  cv: "/cv-aicha-deborah-gbane.pdf",
};

export const metrics = [
  { value: 16.67, decimals: 2, unit: "/20", label: { fr: "Moyenne de licence — mention très bien", en: "Bachelor's average — highest honours" } },
  { value: 10700, decimals: 0, unit: "", label: { fr: "Phrases annotées, corpus baoulé–dioula", en: "Annotated sentences, Baoulé–Dioula corpus" } },
  { value: 84.36, decimals: 2, unit: "%", label: { fr: "Accuracy en validation — modèle Titanic", en: "Validation accuracy — Titanic model" } },
  { value: 10, decimals: 0, unit: "", label: { fr: "Projets data, IA et web menés de bout en bout", en: "End-to-end data, AI and web projects" } },
];

/* ---------- À propos ---------- */
export const about = {
  // chaque phrase apparaît à son tour ; [[…]] = mot mis en valeur
  lines: [
    { fr: "Je conçois des solutions d'intelligence artificielle qui répondent à des [[besoins réels]].", en: "I design artificial intelligence solutions that answer [[real needs]]." },
    { fr: "Mon domaine : le [[machine learning]], le [[traitement du langage]] et l'[[IA générative]].", en: "My field: [[machine learning]], [[natural language processing]] and [[generative AI]]." },
    { fr: "Je mène chaque projet de bout en bout, de l'exploration des données au modèle [[déployé]].", en: "I carry every project end to end, from data exploration to a [[deployed]] model." },
    { fr: "Actuellement stagiaire Data & Intelligence Artificielle chez [[Orange Côte d'Ivoire]].", en: "Currently a Data & Artificial Intelligence intern at [[Orange Côte d'Ivoire]]." },
    { fr: "Diplômée en Génie Logiciel, option Data Science, avec [[mention très bien]].", en: "BSc in Software Engineering, Data Science track, with [[highest honours]]." },
    { fr: "Je m'engage pour une IA qui comprend aussi nos langues : le [[baoulé]] et le [[dioula]].", en: "I am committed to AI that also understands our languages: [[Baoulé]] and [[Dioula]]." },
  ],
  facts: [
    { k: { fr: "Basée à", en: "Based in" }, v: { fr: "Abidjan, Côte d'Ivoire", en: "Abidjan, Côte d'Ivoire" } },
    { k: { fr: "Actuellement", en: "Currently" }, v: { fr: "Stagiaire Data & Intelligence Artificielle, Orange CI", en: "Data & Artificial Intelligence Intern, Orange CI" } },
    { k: { fr: "Formation", en: "Education" }, v: { fr: "Licence Génie Logiciel — Data Science", en: "BSc Software Engineering — Data Science" } },
    { k: { fr: "Langues", en: "Languages" }, v: { fr: "Français · Anglais C1", en: "French · English C1" } },
  ],
};

/* ---------- Projets : études de cas ----------
   viz : figure animée (components/Figures.jsx) · cat : nlp | ml | vision */
export const projects = [
  {
    id: "assurconnect", year: "2025", cat: "web", viz: "graph",
    images: ["/projects/assurconnect.jpg", "/projects/assurconnect-full.jpg"],
    demo: "https://assurance-connect-africa.vercel.app/",
    title: { fr: "AssurConnect — super-app d'assurance pour l'Afrique", en: "AssurConnect — insurance super-app for Africa" },
    summary: {
      fr: "Une plateforme pour comparer, souscrire et gérer son assurance en ligne en Afrique de l'Ouest, avec paiement par Mobile Money.",
      en: "A platform to compare, buy and manage insurance online in West Africa, with Mobile Money payments.",
    },
    context: {
      fr: "En Afrique de l'Ouest, souscrire une assurance reste souvent long et peu transparent : il faut se déplacer, comparer à la main et payer en agence. AssurConnect regroupe ces étapes dans une seule application.",
      en: "In West Africa, buying insurance is often slow and opaque: you have to travel, compare offers by hand and pay at a branch. AssurConnect brings these steps together in a single app.",
    },
    steps: [
      { fr: "Comparateur des offres de plusieurs assureurs (auto, santé, habitation, voyage).", en: "Comparison of offers from several insurers (car, health, home, travel)." },
      { fr: "Souscription en ligne depuis le téléphone, avec envoi des documents.", en: "Online subscription from a phone, with document upload." },
      { fr: "Déclaration et suivi des sinistres.", en: "Claim filing and tracking." },
      { fr: "Paiement par Mobile Money : Orange Money, MTN MoMo, Wave.", en: "Mobile Money payments: Orange Money, MTN MoMo, Wave." },
      { fr: "Espace utilisateur avec inscription et connexion, application déployée sur Vercel.", en: "User accounts with sign-up and login, deployed on Vercel." },
    ],
    results: [
      { fr: "Application en ligne et accessible publiquement", en: "Live, publicly accessible application" },
      { fr: "Parcours complet en 4 étapes : comparer, choisir, souscrire, payer", en: "Complete 4-step journey: compare, choose, subscribe, pay" },
    ],
    stack: [{ fr: "Application web", en: "Web app" }, { fr: "Comparateur", en: "Comparison engine" }, "Mobile Money", "Vercel"],
    fig: { fr: "", en: "" },
  },
  {
    id: "baoule-dioula", year: "2026", cat: "nlp", viz: "attention",
    title: { fr: "Corpus & assistant baoulé–dioula", en: "Baoulé–Dioula corpus & assistant" },
    summary: {
      fr: "Constitution d'un corpus parallèle pour deux langues ivoiriennes peu dotées, base d'un futur chatbot multilingue.",
      en: "Building a parallel corpus for two low-resource Ivorian languages, the foundation of a future multilingual chatbot.",
    },
    context: {
      fr: "Le baoulé et le dioula sont parlés par des millions de personnes, mais il existe très peu de données numériques pour entraîner des modèles de langue. Sans corpus fiable, aucun assistant ne peut les comprendre.",
      en: "Baoulé and Dioula are spoken by millions of people, yet very little digital data exists to train language models. Without a reliable corpus, no assistant can understand them.",
    },
    steps: [
      { fr: "Recensement et documentation de 8 ressources (Common Voice, Zenodo, AfriSpeech, WaxalNLP…) : source, licence, limites.", en: "Inventory and documentation of 8 resources (Common Voice, Zenodo, AfriSpeech, WaxalNLP…): source, licence, limitations." },
      { fr: "Nettoyage : lignes vides, doublons exacts, normalisation des espaces, contrôle des colonnes et des types.", en: "Cleaning: empty rows, exact duplicates, whitespace normalisation, column and type checks." },
      { fr: "Consolidation en deux corpus en conservant la provenance et les ensembles train / validation / test.", en: "Consolidation into two corpora, keeping provenance and train / validation / test splits." },
      { fr: "Annotation et préparation de la validation linguistique par des locuteurs natifs.", en: "Annotation and preparation of linguistic validation by native speakers." },
      { fr: "Exploration du modèle NLLB-200 pour la traduction français ↔ langues locales.", en: "Exploring the NLLB-200 model for French ↔ local language translation." },
    ],
    results: [
      { fr: "10 031 lignes en baoulé issues de 4 ressources", en: "10,031 Baoulé rows from 4 resources" },
      { fr: "20 601 lignes en dioula issues de 3 ressources", en: "20,601 Dioula rows from 3 resources" },
      { fr: "10 700 phrases annotées et validées", en: "10,700 annotated and validated sentences" },
    ],
    stack: ["Python", "Pandas", "NLLB-200", { fr: "Annotation", en: "Annotation" }],
    fig: { fr: "Matrice d'attention source → cible (illustration du mécanisme de traduction).", en: "Source → target attention matrix (illustration of the translation mechanism)." },
  },
  {
    id: "mediai", year: "2026", cat: "nlp", viz: "retrieval",
    title: { fr: "MediAi — assistant médical multilingue", en: "MediAi — multilingual medical assistant" },
    summary: {
      fr: "Assistant d'information médicale qui répond en français et en langues locales à partir de sources institutionnelles.",
      en: "A medical information assistant answering in French and local languages from institutional sources.",
    },
    context: {
      fr: "L'information de santé fiable est souvent disponible uniquement en français, ce qui exclut une partie de la population. L'objectif : répondre dans la langue de l'utilisateur, sans perdre en fiabilité.",
      en: "Reliable health information is often only available in French, which excludes part of the population. The goal: answer in the user's language without losing reliability.",
    },
    steps: [
      { fr: "API FastAPI avec détection automatique de la langue de la question.", en: "FastAPI API with automatic detection of the question's language." },
      { fr: "Traduction avec NLLB-200 entre le français, le baoulé, le dioula et le bambara.", en: "Translation with NLLB-200 between French, Baoulé, Dioula and Bambara." },
      { fr: "Génération de la réponse par un modèle génératif (Gemini) appuyé sur des sources médicales institutionnelles.", en: "Answer generation with a generative model (Gemini) grounded in institutional medical sources." },
      { fr: "Architecture en services séparés pour la traduction et la génération.", en: "Separate services for translation and generation." },
    ],
    results: [
      { fr: "4 langues prises en charge : français, baoulé, dioula, bambara", en: "4 languages supported: French, Baoulé, Dioula, Bambara" },
      { fr: "Réponses appuyées sur des sources institutionnelles", en: "Answers grounded in institutional sources" },
    ],
    stack: ["FastAPI", "NLLB-200", "Gemini", "Python"],
    fig: { fr: "Similarité requête ↔ documents sources avant génération (illustration).", en: "Query ↔ source document similarity before generation (illustration)." },
  },
  {
    id: "cogniface", year: "2026", cat: "vision", viz: "knn",
    title: { fr: "Cogniface — présences par reconnaissance faciale", en: "Cogniface — face-recognition attendance" },
    summary: {
      fr: "API qui enregistre automatiquement les arrivées en reconnaissant les visages filmés par une caméra.",
      en: "An API that automatically records arrivals by recognising faces captured on camera.",
    },
    context: {
      fr: "Les feuilles d'émargement et les badges sont lents et faciles à contourner. Il fallait identifier une personne en temps réel à partir de son visage, de façon fiable.",
      en: "Sign-in sheets and badges are slow and easy to bypass. The need: identify a person in real time from their face, reliably.",
    },
    steps: [
      { fr: "Détection et encodage des visages en vecteurs avec InsightFace (modèle buffalo_l).", en: "Face detection and encoding into vectors with InsightFace (buffalo_l model)." },
      { fr: "Indexation des vecteurs dans FAISS (IndexFlatIP) pour une recherche par similarité cosinus.", en: "Indexing vectors in FAISS (IndexFlatIP) for cosine-similarity search." },
      { fr: "Décision : identification si la similarité dépasse 0,45, sinon visage inconnu.", en: "Decision: identified if similarity exceeds 0.45, otherwise unknown face." },
      { fr: "API REST FastAPI (personnes, ajout de visages, arrivées) et stockage dans PostgreSQL.", en: "FastAPI REST API (people, face enrolment, arrivals) with PostgreSQL storage." },
      { fr: "Tableau de bord de suivi des présences.", en: "Attendance monitoring dashboard." },
    ],
    results: [
      { fr: "Identification en temps réel depuis la caméra", en: "Real-time identification from the camera" },
      { fr: "Seuil de décision calibré à 0,45", en: "Decision threshold calibrated at 0.45" },
    ],
    stack: ["FastAPI", "InsightFace", "FAISS", "PostgreSQL"],
    fig: { fr: "Espace d'embeddings projeté en 2D : une requête et ses 3 plus proches voisins.", en: "Embedding space projected to 2D: a query and its 3 nearest neighbours." },
  },
  {
    id: "titanic", year: "2026", cat: "ml", viz: "sigmoid",
    images: ["/projects/titanic.jpg", "/projects/titanic-chat.jpg"],
    repo: "https://github.com/deborah-gbane/titanic-ai-assistant",
    title: { fr: "Titanic — estimateur de survie & assistant IA", en: "Titanic — survival estimator & AI assistant" },
    summary: {
      fr: "Modèle de classification servi par une API, accompagné d'un chatbot qui explique ses prédictions.",
      en: "A classification model served through an API, with a chatbot that explains its predictions.",
    },
    context: {
      fr: "Prédire la survie d'un passager à partir de son profil, et rendre la prédiction compréhensible pour un non-spécialiste.",
      en: "Predict a passenger's survival from their profile, and make the prediction understandable to non-specialists.",
    },
    steps: [
      { fr: "Feature engineering : taille de la famille, isolement, tarif par personne, log du tarif, titre, pont.", en: "Feature engineering: family size, travelling alone, fare per person, log fare, title, deck." },
      { fr: "Pipeline scikit-learn et régression logistique optimisée par GridSearchCV.", en: "scikit-learn pipeline and logistic regression tuned with GridSearchCV." },
      { fr: "API FastAPI avec une route /predict.", en: "FastAPI API with a /predict route." },
      { fr: "Chatbot (LLM via OpenRouter) qui interroge le dataset et explique une prédiction réelle du modèle.", en: "Chatbot (LLM via OpenRouter) that queries the dataset and explains a real model prediction." },
    ],
    results: [
      { fr: "84,36 % d'accuracy en validation", en: "84.36% validation accuracy" },
      { fr: "Interface web d'estimation et de discussion", en: "Web interface for estimation and chat" },
    ],
    stack: ["scikit-learn", "FastAPI", "Pandas", "OpenRouter"],
    fig: { fr: "Fonction logistique σ(wᵀx + b) et passagers classés au seuil de 0,5 (illustration).", en: "Logistic function σ(wᵀx + b) and passengers classified at the 0.5 threshold (illustration)." },
  },
  {
    id: "mall", year: "2026", cat: "ml", viz: "kmeans",
    images: ["/projects/mall.jpg"],
    repo: "https://github.com/deborah-gbane/mall-customers-segmentation",
    title: { fr: "Segmentation clients — K-Means", en: "Customer segmentation — K-Means" },
    summary: {
      fr: "Regrouper 200 clients en profils homogènes pour orienter des actions marketing ciblées.",
      en: "Grouping 200 customers into homogeneous profiles to guide targeted marketing.",
    },
    context: {
      fr: "Un centre commercial veut mieux connaître sa clientèle à partir de deux indicateurs : le revenu annuel et le score de dépense.",
      en: "A shopping mall wants to understand its customers from two indicators: annual income and spending score.",
    },
    steps: [
      { fr: "Exploration : qualité des données (aucune valeur manquante, aucun doublon), distributions.", en: "Exploration: data quality (no missing values, no duplicates), distributions." },
      { fr: "Standardisation des deux variables avec StandardScaler.", en: "Standardising both variables with StandardScaler." },
      { fr: "Choix de K par la méthode du coude (K de 1 à 10) : K = 5.", en: "Choosing K with the elbow method (K from 1 to 10): K = 5." },
      { fr: "K-Means (n_init = 10), puis profilage de chaque groupe.", en: "K-Means (n_init = 10), then profiling each group." },
      { fr: "Interface web qui reproduit le modèle en JavaScript, sans Python.", en: "A web interface that reproduces the model in JavaScript, without Python." },
    ],
    results: [
      { fr: "5 profils : standard (81), premium (39), impulsif (22), prudent (35), économe (23)", en: "5 profiles: standard (81), premium (39), impulsive (22), cautious (35), thrifty (23)" },
      { fr: "Clientèle prudente : revenu élevé mais dépense faible, un potentiel inexploité", en: "Cautious segment: high income but low spending, an untapped potential" },
    ],
    stack: ["scikit-learn", "K-Means", "StandardScaler", "JavaScript"],
    fig: { fr: "Itérations de l'algorithme de Lloyd sur des données simulées (voir aussi le laboratoire).", en: "Lloyd's algorithm iterations on simulated data (see also the lab)." },
  },
  {
    id: "etudiants", year: "2026", cat: "ml", viz: "boundary",
    images: ["/projects/etudiants.jpg"],
    repo: "https://github.com/deborah-gbane/prediction-reussite-etudiants",
    title: { fr: "Prédiction de la réussite étudiante", en: "Student success prediction" },
    summary: {
      fr: "Identifier les facteurs de réussite et prédire la performance d'un étudiant, dans une application Streamlit.",
      en: "Identifying success factors and predicting a student's performance, in a Streamlit app.",
    },
    context: {
      fr: "Repérer tôt les étudiants en difficulté permet d'agir avant l'échec. Le projet analyse les facteurs associés à la réussite.",
      en: "Spotting struggling students early makes it possible to act before failure. The project analyses the factors linked to success.",
    },
    steps: [
      { fr: "Exploration et nettoyage des données, analyse des variables, préparation de la cible.", en: "Data exploration and cleaning, feature analysis, target preparation." },
      { fr: "Séparation entraînement / test et standardisation.", en: "Train / test split and standardisation." },
      { fr: "Comparaison de plusieurs modèles, choix d'une régression logistique.", en: "Comparing several models, choosing a logistic regression." },
      { fr: "Sauvegarde du modèle et du scaler, puis application Streamlit.", en: "Saving the model and scaler, then a Streamlit app." },
    ],
    results: [
      { fr: "Application de prédiction interactive", en: "Interactive prediction app" },
    ],
    stack: ["scikit-learn", { fr: "Régression logistique", en: "Logistic regression" }, "Streamlit", "Pandas"],
    fig: { fr: "Frontière de décision d'un classifieur linéaire sur deux variables (illustration).", en: "Decision boundary of a linear classifier on two features (illustration)." },
  },
  {
    id: "expert-ds", year: "2026", cat: "nlp", viz: "tokens",
    images: ["/projects/expert-ds.jpg"],
    demo: "https://expert-data-science.onrender.com/",
    repo: "https://github.com/deborah-gbane/expert-data-science",
    title: { fr: "Expert Data Science — assistant conversationnel", en: "Expert Data Science — conversational assistant" },
    summary: {
      fr: "Un assistant spécialisé qui répond aux questions de data science, de Python et de SQL.",
      en: "A specialised assistant answering data science, Python and SQL questions.",
    },
    context: {
      fr: "Comprendre comment intégrer proprement un modèle de langage dans une application : API, sécurité des clés, gestion des erreurs.",
      en: "Understanding how to properly integrate a language model into an application: API, key security, error handling.",
    },
    steps: [
      { fr: "Backend FastAPI avec une route POST /chat.", en: "FastAPI backend with a POST /chat route." },
      { fr: "Appel d'un modèle de langage via OpenRouter, avec un rôle spécialisé en data science.", en: "Calling a language model through OpenRouter with a data-science-specialised role." },
      { fr: "Clés API isolées dans un fichier .env, gestion des erreurs côté serveur et client.", en: "API keys isolated in a .env file, error handling on server and client." },
      { fr: "Interface de chat avec indicateur de frappe.", en: "Chat interface with a typing indicator." },
    ],
    results: [
      { fr: "API REST et interface de chat fonctionnelles", en: "Working REST API and chat interface" },
    ],
    stack: ["FastAPI", "Python", "LLM", "OpenRouter"],
    fig: { fr: "Distribution softmax du prochain token pendant la génération (illustration).", en: "Softmax distribution over the next token during generation (illustration)." },
  },
  {
    id: "cancervision", year: "2026", cat: "vision", viz: "cloud",
    images: ["/projects/cancervision.jpg"],
    demo: "https://deborah-gbane.github.io/CancerVision-3D/",
    repo: "https://github.com/deborah-gbane/CancerVision-3D",
    title: { fr: "CancerVision 3D", en: "CancerVision 3D" },
    summary: {
      fr: "Plateforme 3D éducative de sensibilisation au cancer du sein, pilotable par les gestes de la main.",
      en: "An educational 3D platform for breast cancer awareness, controllable with hand gestures.",
    },
    context: {
      fr: "Rendre compréhensibles l'anatomie, la maladie et le dépistage grâce à une expérience visuelle et interactive.",
      en: "Making anatomy, the disease and screening understandable through a visual, interactive experience.",
    },
    steps: [
      { fr: "Scène 3D temps réel combinant trois modes : cinématique, anatomique et vue éclatée.", en: "Real-time 3D scene combining three modes: cinematic, anatomical and exploded view." },
      { fr: "Contenus : formation du cancer, types, stades 0 à IV, signes d'alerte, prévention, parcours de soins.", en: "Content: cancer formation, types, stages 0 to IV, warning signs, prevention, care pathway." },
      { fr: "Contrôle gestuel par vision avec MediaPipe Hand Landmarker (filtre One Euro, repli souris).", en: "Gesture control through computer vision with MediaPipe Hand Landmarker (One Euro filter, mouse fallback)." },
      { fr: "Quiz, visite guidée, mode hors ligne et audit d'accessibilité.", en: "Quizzes, guided tour, offline mode and accessibility audit." },
    ],
    results: [
      { fr: "Audit d'accessibilité axe-core : 0 violation", en: "axe-core accessibility audit: 0 violations" },
      { fr: "Fonctionne entièrement sans backend", en: "Runs entirely without a backend" },
    ],
    stack: ["TypeScript", "Three.js", "MediaPipe", "Vite"],
    fig: { fr: "Nuage de points 3D en rotation (illustration).", en: "Rotating 3D point cloud (illustration)." },
  },
  {
    id: "agribara", year: "2026", cat: "ml", viz: "graph",
    title: { fr: "Agribara — logistique agricole", en: "Agribara — agricultural logistics" },
    summary: {
      fr: "Aide à la décision pour la logistique agricole en Côte d'Ivoire.",
      en: "Decision support for agricultural logistics in Côte d'Ivoire.",
    },
    context: {
      fr: "Acheminer les productions agricoles vers les marchés au meilleur coût est un enjeu majeur en Côte d'Ivoire. Le projet vise à aider à choisir les flux entre zones de production et marchés.",
      en: "Moving agricultural produce to markets at the lowest cost is a major challenge in Côte d'Ivoire. The project helps choose flows between production areas and markets.",
    },
    steps: [
      { fr: "Modélisation du réseau entre zones de production et marchés.", en: "Modelling the network between production areas and markets." },
      { fr: "Analyse des données pour appuyer les décisions logistiques.", en: "Data analysis to support logistics decisions." },
    ],
    results: [
      { fr: "Projet en cours — étude de cas détaillée à venir", en: "Ongoing project — detailed case study coming soon" },
    ],
    stack: ["Python", { fr: "Analyse de données", en: "Data analysis" }, { fr: "Aide à la décision", en: "Decision support" }],
    fig: { fr: "Graphe de villes et recherche d'un plus court chemin (illustration).", en: "City graph and shortest-path search (illustration)." },
  },
];

export const categories = [
  { id: "all", label: { fr: "Tous", en: "All" } },
  { id: "nlp", label: { fr: "NLP & IA générative", en: "NLP & generative AI" } },
  { id: "ml", label: { fr: "Machine learning", en: "Machine learning" } },
  { id: "vision", label: { fr: "Vision", en: "Vision" } },
  { id: "web", label: { fr: "Applications web", en: "Web apps" } },
];

/* ---------- Parcours ---------- */
export const experience = [
  {
    period: { fr: "août 2026 — aujourd'hui", en: "Aug 2026 — present" },
    type: { fr: "Stage", en: "Internship" },
    duration: { fr: "3 mois", en: "3 months" },
    title: { fr: "Stagiaire Data & Intelligence Artificielle", en: "Data & Artificial Intelligence Intern" },
    org: "Orange Côte d'Ivoire",
    location: "Abidjan",
    desc: {
      fr: "Au sein d'Orange Côte d'Ivoire, j'évolue dans un environnement professionnel orienté Data et Intelligence Artificielle, où je participe à la conception et à l'expérimentation de solutions basées sur les données. Cette expérience me permet de mettre en pratique mes connaissances en Data Science, d'explorer différentes approches d'intelligence artificielle et de contribuer aux travaux de l'équipe.",
      en: "At Orange Côte d'Ivoire, I work in a professional environment focused on Data and Artificial Intelligence, where I take part in designing and experimenting with data-driven solutions. This experience lets me put my Data Science knowledge into practice, explore different artificial intelligence approaches and contribute to the team's work.",
    },
    points: [
      { label: { fr: "Préparation des données", en: "Data preparation" }, fr: "collecte, nettoyage, transformation et structuration des jeux de données en vue de leur exploitation.", en: "collecting, cleaning, transforming and structuring datasets so they can be used." },
      { label: { fr: "Analyse exploratoire", en: "Exploratory analysis" }, fr: "exploration des données, identification de tendances et extraction d'informations utiles à la compréhension des problématiques.", en: "exploring data, identifying trends and extracting insights that help understand the problems at hand." },
      { label: { fr: "Machine Learning", en: "Machine Learning" }, fr: "expérimentation et application de modèles d'apprentissage automatique sur des cas d'usage concrets.", en: "experimenting with and applying machine learning models to concrete use cases." },
      { label: { fr: "Intelligence artificielle générative", en: "Generative artificial intelligence" }, fr: "exploration et mise en œuvre de solutions basées sur les modèles de langage (LLM), notamment pour des applications conversationnelles et multilingues.", en: "exploring and implementing solutions based on large language models (LLMs), especially for conversational and multilingual applications." },
      { label: { fr: "Développement d'API", en: "API development" }, fr: "participation à la création de services avec FastAPI pour faciliter l'intégration et l'exploitation des solutions d'IA.", en: "helping build FastAPI services that make AI solutions easier to integrate and use." },
    ],
    skillGroups: [
      { name: "Data Science", items: ["Python", "Pandas", "NumPy", { fr: "Analyse exploratoire (EDA)", en: "Exploratory data analysis (EDA)" }, { fr: "Préparation des données", en: "Data preparation" }] },
      { name: { fr: "Intelligence artificielle", en: "Artificial intelligence" }, items: ["Machine Learning", { fr: "IA générative", en: "Generative AI" }, "LLM", "NLP", { fr: "Modèles multilingues", en: "Multilingual models" }] },
      { name: { fr: "Développement", en: "Development" }, items: ["FastAPI", { fr: "Conception d'API REST", en: "REST API design" }, { fr: "Intégration d'API", en: "API integration" }] },
    ],
    takeaway: {
      fr: "Cette immersion renforce ma capacité à aborder des problématiques concrètes à travers la donnée, à expérimenter des approches d'intelligence artificielle et à transformer des résultats techniques en solutions exploitables. Elle contribue à construire mon parcours de Data Scientist avec une ouverture particulière sur les applications de l'intelligence artificielle.",
      en: "This immersion strengthens my ability to tackle real problems through data, to experiment with artificial intelligence approaches and to turn technical results into usable solutions. It is shaping my path as a Data Scientist, with a particular focus on applications of artificial intelligence.",
    },
    featured: true,
  },
];

export const trainings = [
  {
    period: { fr: "janv. — mars 2025", en: "Jan — Mar 2025" },
    duration: { fr: "3 mois", en: "3 months" },
    title: { fr: "Développeuse Fullstack à orientation entrepreneuriale", en: "Full-stack Developer, entrepreneurship track" },
    org: "DigiFemmes Academy",
    desc: {
      fr: "Programme intensif de formation au développement web fullstack, pensé pour transformer une idée en produit numérique et porter un projet de bout en bout.",
      en: "An intensive full-stack web development programme designed to turn an idea into a digital product and carry a project end to end.",
    },
    points: [
      { fr: "Développement web côté client et côté serveur", en: "Client-side and server-side web development" },
      { fr: "Conception et réalisation d'un projet numérique complet", en: "Designing and building a complete digital project" },
      { fr: "Approche entrepreneuriale : de l'idée au produit", en: "Entrepreneurial approach: from idea to product" },
    ],
    distinction: { fr: "Sélectionnée parmi 30 candidates · mention très bien", en: "Selected among 30 candidates · highest honours" },
  },
  {
    period: { fr: "mai — juil. 2025", en: "May — Jul 2025" },
    duration: { fr: "3 mois", en: "3 months" },
    title: { fr: "Compétences numériques et digitales", en: "Digital skills programme" },
    org: "MTN Skills Academy · DigiFemmes Côte d'Ivoire",
    desc: {
      fr: "Programme de renforcement des compétences numériques, mené avec la MTN Skills Academy et DigiFemmes Côte d'Ivoire.",
      en: "A digital skills programme run with MTN Skills Academy and DigiFemmes Côte d'Ivoire.",
    },
    points: [
      { fr: "Outils et usages du numérique en contexte professionnel", en: "Digital tools and practices in a professional context" },
      { fr: "Culture digitale et nouvelles technologies", en: "Digital culture and emerging technologies" },
    ],
    distinction: null,
  },
];

export const education = [
  {
    period: "2025 — 2026",
    title: { fr: "Licence professionnelle en Génie Logiciel, option Data Science", en: "Professional BSc in Software Engineering, Data Science track" },
    org: "Institut CERCO, Abidjan",
    points: [
      { fr: "Moyenne 16,67/20 — mention très bien", en: "Average 16.67/20 — highest honours" },
      { fr: "Projet de fin d'études noté 17/20", en: "Final-year project graded 17/20" },
      { fr: "Mémoire : automatisation de la gestion des interventions de maintenance informatique", en: "Thesis: automating IT maintenance request management" },
    ],
  },
  {
    period: "2022 — 2024",
    title: { fr: "BTS Informatique, Développeur d'applications", en: "Higher National Diploma (BTS) in Computing, Application Development" },
    org: "Groupe LOKO, Abidjan",
    points: [
      { fr: "2ᵉ sur 42 en deuxième année, 3ᵉ sur 45 en première année", en: "Ranked 2nd of 42 in second year, 3rd of 45 in first year" },
      { fr: "1ʳᵉ de la promotion en recherche opérationnelle (16/20) et en statistiques (14,5/20)", en: "Top of the class in operations research (16/20) and statistics (14.5/20)" },
      { fr: "Mémoire : automatisation de la gestion du patrimoine du Laboratoire National de Santé Publique", en: "Thesis: automating asset management for the National Public Health Laboratory" },
    ],
  },
  {
    period: "2022",
    title: { fr: "Baccalauréat série C (mathématiques et sciences physiques)", en: "Baccalauréat, série C (mathematics and physics)" },
    org: "Lycée Moderne 1 de Grand-Bassam",
    points: [],
  },
];

export const certifications = [
  { name: "Ask Questions to Make Data-Driven Decisions", org: "Google · Coursera", date: { fr: "mai 2026", en: "May 2026" } },
  { name: "Foundations: Data, Data, Everywhere", org: "Google · Coursera", date: { fr: "mars 2026", en: "Mar 2026" } },
  { name: "Intermediate Python", org: "DataCamp", date: { fr: "oct. 2025", en: "Oct 2025" } },
  { name: "Data Literacy", org: "University of Copenhagen, Sorbonne Université · Coursera", date: { fr: "mai 2025", en: "May 2025" } },
  { name: { fr: "Anglais — niveau C1", en: "English — C1 level" }, org: "EF SET", date: "" },
];

// Compétences reliées aux projets où elles ont été utilisées (identifiants de `projects`).
export const skills = [
  {
    id: "data", icon: "db",
    group: { fr: "Langages & données", en: "Languages & data" },
    desc: { fr: "Collecter, nettoyer, structurer et interroger les données.", en: "Collecting, cleaning, structuring and querying data." },
    items: [
      { name: "Python", p: ["baoule-dioula", "mediai", "cogniface", "titanic", "mall", "etudiants", "expert-ds", "agribara"] },
      { name: "Pandas", p: ["baoule-dioula", "titanic", "mall", "etudiants"] },
      { name: "SQL", p: ["cogniface"] },
      { name: "PostgreSQL", p: ["cogniface"] },
      { name: "NumPy", p: [] },
      { name: { fr: "Nettoyage de données", en: "Data cleaning" }, p: ["baoule-dioula", "etudiants", "mall"] },
    ],
  },
  {
    id: "ml", icon: "ml",
    group: { fr: "Machine learning", en: "Machine learning" },
    desc: { fr: "Construire, optimiser et évaluer des modèles prédictifs.", en: "Building, tuning and evaluating predictive models." },
    items: [
      { name: "scikit-learn", p: ["titanic", "mall", "etudiants"] },
      { name: { fr: "Régression logistique", en: "Logistic regression" }, p: ["titanic", "etudiants"] },
      { name: { fr: "Clustering (K-Means)", en: "Clustering (K-Means)" }, p: ["mall"] },
      { name: "Feature engineering", p: ["titanic"] },
      { name: "GridSearchCV", p: ["titanic"] },
      { name: { fr: "Comparaison de modèles", en: "Model comparison" }, p: ["etudiants"] },
    ],
  },
  {
    id: "nlp", icon: "nlp",
    group: { fr: "NLP & IA générative", en: "NLP & generative AI" },
    desc: { fr: "Faire comprendre et générer du langage, y compris en langues locales.", en: "Understanding and generating language, including local languages." },
    items: [
      { name: "LLM", p: ["mediai", "expert-ds", "titanic"] },
      { name: "Chatbots", p: ["mediai", "expert-ds", "titanic", "baoule-dioula"] },
      { name: "NLLB-200", p: ["baoule-dioula", "mediai"] },
      { name: "OpenRouter", p: ["titanic", "expert-ds"] },
      { name: "Gemini", p: ["mediai"] },
      { name: { fr: "Annotation de corpus", en: "Corpus annotation" }, p: ["baoule-dioula"] },
    ],
  },
  {
    id: "vision", icon: "eye",
    group: { fr: "Vision par ordinateur", en: "Computer vision" },
    desc: { fr: "Reconnaître des visages et interpréter des gestes en temps réel.", en: "Recognising faces and interpreting gestures in real time." },
    items: [
      { name: "InsightFace", p: ["cogniface"] },
      { name: "FAISS", p: ["cogniface"] },
      { name: "MediaPipe", p: ["cancervision"] },
      { name: "Three.js", p: ["cancervision"] },
    ],
  },
  {
    id: "deploy", icon: "api",
    group: { fr: "Déploiement & web", en: "Deployment & web" },
    desc: { fr: "Rendre les modèles utilisables : API, applications et mise en ligne.", en: "Making models usable: APIs, apps and deployment." },
    items: [
      { name: "FastAPI", p: ["mediai", "cogniface", "titanic", "expert-ds"] },
      { name: "API REST", p: ["mediai", "cogniface", "titanic", "expert-ds"] },
      { name: "Streamlit", p: ["etudiants"] },
      { name: "JavaScript / TypeScript", p: ["mall", "cancervision"] },
      { name: "Vercel", p: ["assurconnect"] },
      { name: "Git", p: ["titanic", "mall", "etudiants", "expert-ds", "cancervision"] },
    ],
  },
  {
    id: "analysis", icon: "chart",
    group: { fr: "Analyse & méthodes", en: "Analysis & methods" },
    desc: { fr: "Explorer, visualiser et raisonner à partir des données.", en: "Exploring, visualising and reasoning from data." },
    items: [
      { name: { fr: "Analyse exploratoire", en: "Exploratory analysis" }, p: ["titanic", "mall", "etudiants"] },
      { name: "Visualisation", p: ["mall", "etudiants"] },
      { name: { fr: "Statistiques", en: "Statistics" }, p: [] },
      { name: { fr: "Recherche opérationnelle", en: "Operations research" }, p: ["agribara"] },
    ],
  },
];
