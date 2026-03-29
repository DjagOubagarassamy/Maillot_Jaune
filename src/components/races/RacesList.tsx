import { useState } from 'react';
import { Plus, Trophy, Trash2, Calendar, MapPin } from 'lucide-react';
import { getRaces, deleteRace } from '../../lib/dataStore';
import type { Race } from '../../types';
import type { RouteParams } from '../../hooks/useRouter';

interface RacesListProps {
  onNavigate: (params: RouteParams) => void;
}

/* deuxième collections du site : la liste des courses : affichage en grille avec date, lieu, distance et suppression */
export function RacesList({ onNavigate }: RacesListProps) {
  const [races, setRaces] = useState<Race[]>(() =>
    getRaces().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
);

  function handleDelete(id: string, name: string) {
    if (!confirm(`Etes-vous sur de vouloir supprimer "${name}" ?`)) return;
    deleteRace(id);
    setRaces(getRaces().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  }
  
  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-950 py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-perso text-3xl font-bold text-white">Courses Cyclistes</h1>
          <button
            onClick={() => onNavigate({ view: 'races', action: 'create' })}
            className="flex items-center gap-2 bg-primary text-gray-900 px-6 py-3 rounded-lg hover:bg-primary/80 transition-colors font-medium shadow-md"
          >
            <Plus className="w-5 h-5" />
            Ajouter une course
          </button>
        </div>

        {races.length === 0 ? (
          <div className="bg-gray-800 rounded-lg shadow-md p-12 text-center">
            <Trophy className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-xl text-gray-400">Aucune course trouvée</p>
            <button
              onClick={() => onNavigate({ view: 'races', action: 'create' })}
              className="mt-4 text-primary hover:text-primary/80 font-medium"
            >
              Ajouter votre première course
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {races.map((race) => (
              <div
                key={race.id}
                className="bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow border border-gray-700 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">{race.name}</h3>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Calendar className="w-4 h-4" />
                          {formatDate(race.date)}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <MapPin className="w-4 h-4" />
                          {race.location}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(race.id, race.name)}
                      className="text-red-500 hover:text-red-400 p-2 hover:bg-red-900/30 rounded-lg transition-colors"
                      title="Supprimer la course"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Distance :</span>
                      <span className="font-medium text-gray-200">{race.distance} km</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Type :</span>
                      <span className="font-medium text-gray-200">{race.race_type}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate({ view: 'races', action: 'detail', id: race.id })}
                    className="w-full bg-primary text-gray-900 py-2 px-4 rounded-lg hover:bg-primary/80 transition-colors font-medium"
                  >
                    Voir les résultats
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
