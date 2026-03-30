# Maillot Jaune est

Un site vitrine React présentant une collection de cyclistes professionnels et de courses de vélo. Les données sont stockées au format JSON et persistées dans le localStorage du navigateur. 

Petit mot sur le projet : 

    Ce projet a été initialisé à l'aide de vite et j'ai fait le choix d'utiliser Tsx car c'est le language avec lequel
    je suis le plus familier, j'espère que ça vous conviendrait. J'ai également pour le css préféré utilisé tailwind car 
    c'est également un gain de temps et de lisibilité énorme étant donné que le style est directement visible sur le fichier tsx.


## Architecture du projet

```
src/
├── App.tsx                   # Composant racine avec routeur
├── main.tsx                  # Point d'entrée
├── index.css                 # fichier css qui contient juste le tailwind
├── components/
│   ├── Home.tsx              # Page d'accueil avec video en fond et navbar qui réagit au scroll
│   ├── Navigation.tsx        # Lisible sur toutes les pages 
│   ├── cyclists/
│   │   ├── CyclistsList.tsx  # Première collection organisé en []. Liste des cyclistes (recherche, filtre, suppression)
│   │   ├── CyclistDetail.tsx # Détail d'un Objet cyclist et ses résultats 
│   │   └── CyclistForm.tsx   # Formulaire d'ajout d'un cycliste à la liste
│   └── races/
│       ├── RacesList.tsx     # Deuxième collection organisé en [] également. Liste des courses (ajout, suppression)
│       ├── RaceDetail.tsx    # Détail d'une course et classement 
│       └── RaceForm.tsx      # Formulaire d'ajout d'une course
├── data/
│   ├── cyclists.json         # Données initiales 
│   ├── races.json            # Données initiales 
│   └── raceResults.json      # Données initiales 
├── hooks/
│   └── useRouter.ts          # Routeur basé sur le hash URL,engro qui permets de faire évoluer le DOM en fonction de l'URL
│   └── useCyclingNews.ts     # Hooks contenants l'ensemble des fonctions liés au CyclingNew(fetch, insertion dans le type)
├── lib/
│   └── dataStore.ts          # Toutes les fonctions de supp, save & lecture des données dans le localStorage.
└── types/
    └── index.ts              # Contient les interfaces des cyclistes, races, etc
```

## Fonctionnalités

- **CONSULTER** l'actualité du cyclisme grâce à un carrousel défilant, à partir de données issus d'un autre site. 
- **PARCOURIR** la liste des cyclistes et des courses.
- **VOIR** les détails d'un cycliste
- **AJOUTER** un nouveau cycliste ou une nouvelle cours.
- **SUPPRIMER** un cycliste ou une course
- **CHERCHER** un cycliste par nom, équipe, pays 
- **BROUILLON SAUVEGARDER** les formulaires en cours sont sauvegardés dans le localStorage
- **Navigation par hash URL** : le rafraîchissement de la page conserve la vue courante

## Données

Les données initiales sont fournies au format JSON dans `src/data/`. Au premier chargement, elles sont utilisées telles quelles. Dès qu'une modification est effectuée, les données sont persistées dans le localStorage du navigateur.

## Installation et lancement

```bash
npm install
npm run dev
```

Il est ensuite disponible à l'URL Suivante : http://localhost:5173
Ce n'est pas nécessaire étant donné que le site est déjà en ligne à l'URL suivante : https://djagoubagarassamy.github.io/Maillot_Jaune/

## Technologies

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Lucide React (icônes)

---

**CONCLUSION**
Le projet respecte l’ensemble des exigences : il est réutilisable, ergonomique, extensible et chaque fonctionnalité demandée est couverte par l’implémentation actuelle.
