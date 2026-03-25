import { Bike, Trophy, Home } from 'lucide-react';
import type { RouteParams } from '../hooks/useRouter';

interface NavigationProps {
  currentRoute: RouteParams;
  onNavigate: (params: RouteParams) => void;
}

export function Navigation({ currentRoute, onNavigate }: NavigationProps) {
  const isActive = (view: RouteParams['view']) => {
    return currentRoute.view === view;
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Bike className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Pro Cycling Showcase</h1>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => onNavigate({ view: 'home' })}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isActive('home')
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">Home</span>
            </button>
            <button
              onClick={() => onNavigate({ view: 'cyclists', action: 'list' })}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isActive('cyclists')
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Bike className="w-5 h-5" />
              <span className="font-medium">Cyclists</span>
            </button>
            <button
              onClick={() => onNavigate({ view: 'races', action: 'list' })}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isActive('races')
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Trophy className="w-5 h-5" />
              <span className="font-medium">Races</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
