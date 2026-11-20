# Sécurité

Ce portfolio est un site statique (aucun serveur, aucune base de données, aucun formulaire).

## Mesures en place

- **Politique de sécurité du contenu (CSP)** stricte : seuls les scripts, styles, polices et images du site lui-même sont autorisés.
- **Aucune ressource tierce** : polices hébergées localement, aucun traceur, aucune donnée de visiteur transmise à un tiers.
- **Anti-clickjacking** : le site refuse d'être affiché dans le cadre d'une autre page.
- **Liens externes** ouverts avec `rel="noreferrer"`.
- **Coordonnées encodées** dans le code pour limiter l'aspiration par les robots.
- **Chaîne de déploiement durcie** : actions GitHub épinglées par empreinte, permissions minimales, audit `npm` bloquant à chaque déploiement, Dependabot activé.
- **HTTPS** imposé par GitHub Pages.

## Signaler un problème

Merci d'écrire directement par e-mail (adresse indiquée sur le site) plutôt que d'ouvrir une issue publique.
