import { Bike, Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { RouteParams } from '../hooks/useRouter';

interface NavigationProps {
  currentRoute: RouteParams;
  onNavigate: (params: RouteParams) => void;
}

export function Navigation({ currentRoute, onNavigate }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const dansHome = currentRoute.view === 'home';

  useEffect(() => {
    if (!dansHome) {
      setScrolled(false);
      return;
    }
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dansHome]);

  const isActive = (view: RouteParams['view']) => {
    return currentRoute.view === view;
  };

  const transparent = dansHome && !scrolled;

  return (
    <nav className={`${
      transparent
        ? 'absolute top-0 left-0 right-0 z-50 bg-transparent': 'fixed top-0 left-0 right-0 z-50 bg-gray-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <h1
            className={`text-xl font-bold inline-block font-perso-titre ${transparent ? 'text-white' : 'text-white'}`}
          >
            Maillot <span style={{color:"#ffee93"}}>Jaune</span></h1>
          <div className="flex gap-4">
            <button
              onClick={() => {
                window.scrollTo({ top: 0});
                onNavigate({ view: 'home' });
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isActive('home')
                  ? transparent ? 'bg-white/20 text-white' : 'bg-primary text-gray-900'
                  : transparent
                    ? 'text-white/80 hover:bg-white/10 hover:text-white'
                    : 'text-gray-300 hover:bg-gray-800'
              }`}
            >

              <span className="font-medium">Accueil</span>
            </button>
            <button
              onClick={() => {
                window.scrollTo({top: 0});
                onNavigate({view:'cyclists',action:'list'});
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isActive('cyclists')
                  ? 'bg-primary text-gray-900'
                    : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <Bike className="w-5 h-5" />
              <span className="font-medium ">Coureurs</span>
            </button>
            <button
              onClick={() => {
                window.scrollTo({top: 0});
                onNavigate({view: 'races', action: 'list'});
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isActive('races')
                  ? 'bg-primary text-gray-900'
                    : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <Trophy className="w-5 h-5" />
              <span className="font-medium">Courses</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
