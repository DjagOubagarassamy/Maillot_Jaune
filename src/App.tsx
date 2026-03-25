import { useRouter } from './hooks/useRouter';
import { Navigation } from './components/Navigation';
import { Home } from './components/Home';
import { CyclistsList } from './components/cyclists/CyclistsList';
import { CyclistDetail } from './components/cyclists/CyclistDetail';
import { CyclistForm } from './components/cyclists/CyclistForm';
import { RacesList } from './components/races/RacesList';
import { RaceDetail } from './components/races/RaceDetail';
import { RaceForm } from './components/races/RaceForm';

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
    <div className="min-h-screen bg-gray-50">
      <Navigation currentRoute={route} onNavigate={navigate} />
      <main>{renderView()}</main>
    </div>
  );
}

export default App;
