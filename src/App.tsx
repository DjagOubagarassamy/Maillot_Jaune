import { useRouter } from './hooks/useRouter';
import { Navigation } from './components/Navigation';
import { Home } from './components/Home';
import { CyclistsList } from './components/cyclists/CyclistsList';
import { CyclistDetail } from './components/cyclists/CyclistDetail';
import { CyclistForm } from './components/cyclists/CyclistForm';
import { RacesList } from './components/races/RacesList';
import { RaceDetail } from './components/races/RaceDetail';
import { RaceForm } from './components/races/RaceForm';

/* Voici donc l'intégralité de mon Projet IHM (ce paragraphe est réécris dans le ReadME)

    Ce projet a été initialisé à l'aide de vite et j'ai fait le choix d'utiliser Tsx car c'est le language avec lequel
    je suis le plus familier, j'espère que ça vous conviendrait, je penses que oui étant donné qu'il s'agit juste de JS Typé

*/
function App() {
  const { route, navigate } = useRouter();
  
  function renderView() {
    switch (route.view) {
      case 'cyclists':
        switch (route.action) {
          case 'detail':
            return route.id ? (
              <CyclistDetail cyclistId={route.id} onNavigate={navigate} />
            ) : (
              <CyclistsList onNavigate={navigate} />
            );
          case 'create':
            return <CyclistForm onNavigate={navigate} />;
          default:
            return <CyclistsList onNavigate={navigate} />;
        }

      case 'races':
        switch (route.action) {
          case 'detail':
            return route.id ? (
              <RaceDetail raceId={route.id} onNavigate={navigate} />
            ) : (
              <RacesList onNavigate={navigate} />
            );
          case 'create':
            return <RaceForm onNavigate={navigate} />;
          default:
            return <RacesList onNavigate={navigate} />;
        }

      default:
        return <Home onNavigate={navigate} />;
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <Navigation currentRoute={route} onNavigate={navigate} />
      <main className="flex-1">{renderView()}</main>
      <footer className="bg-gray-900 border-t border-gray-800 py-4 text-center text-sm text-gray-400">
        © 2026 — Conçu par{' '}
        <a
          href="https://djag.info"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          Djag.O  
        </a>
        <span className='block mt-5'>Réalisé dans le cadre du Module IHM - Master Gphy</span>
      </footer>
    </div>
  );
}

export default App;
