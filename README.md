# Pro Cycling Showcase

Site vitrine React présentant une collection de cyclistes professionnels et de courses cyclistes. Les données sont stockées au format JSON et persistées dans le localStorage du navigateur.

## Architecture du projet

```
src/
├── App.tsx                   # Composant racine avec routeur
├── main.tsx                  # Point d'entrée
├── index.css                 # Styles Tailwind CSS
├── components/
│   ├── Home.tsx              # Page d'accueil
│   ├── Navigation.tsx        # Barre de navigation
│   ├── cyclists/
│   │   ├── CyclistsList.tsx  # Liste des cyclistes (recherche, filtre, suppression)
│   │   ├── CyclistDetail.tsx # Détail d'un cycliste et ses résultats
│   │   └── CyclistForm.tsx   # Formulaire d'ajout d'un cycliste
│   └── races/
│       ├── RacesList.tsx     # Liste des courses (suppression)
│       ├── RaceDetail.tsx    # Détail d'une course et classement
│       └── RaceForm.tsx      # Formulaire d'ajout d'une course
├── data/
│   ├── cyclists.json         # Données initiales des cyclistes
│   ├── races.json            # Données initiales des courses
│   └── raceResults.json      # Données initiales des résultats
├── hooks/
│   └── useRouter.ts          # Routeur basé sur le hash URL
├── lib/
│   └── dataStore.ts          # Service de données (lecture/écriture JSON + localStorage)
└── types/
    └── index.ts              # Interfaces TypeScript (Cyclist, Race, RaceResult)
```

## Fonctionnalités

- **Parcourir** la liste des cyclistes et des courses
- **Visualiser** les détails d'un cycliste (infos personnelles, résultats de courses) ou d'une course (infos, classement)
- **Créer** un nouveau cycliste ou une nouvelle course via un formulaire validé
- **Supprimer** un cycliste ou une course
- **Ajouter/supprimer** des résultats de course sur la page de détail d'une course
- **Recherche et filtrage** par nom, équipe, nationalité sur la liste des cyclistes
- **Persistance des brouillons** : les formulaires en cours sont sauvegardés dans le localStorage
- **Navigation par hash** : le rafraîchissement de la page conserve la vue courante

## Données

Les données initiales sont fournies au format JSON dans `src/data/`. Au premier chargement, elles sont utilisées telles quelles. Dès qu'une modification est effectuée (ajout, suppression), les données sont persistées dans le localStorage du navigateur.

## Prérequis

- Node.js ≥ 18

## Installation et lancement

```bash
npm install
npm run dev
```

Le site est accessible sur `http://localhost:5173`.

## Build de production

```bash
npm run build
npm run preview
```

## Technologies

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Lucide React (icônes)
