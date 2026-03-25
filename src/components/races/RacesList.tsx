import { useState } from 'react';
import { Plus, Trophy, Trash2, Calendar, MapPin } from 'lucide-react';
import { getRaces, deleteRace } from '../../lib/dataStore';
import type { Race } from '../../types';
import type { RouteParams } from '../../hooks/useRouter';

interface RacesListProps {
  onNavigate: (params: RouteParams) => void;
}

export function RacesList({ onNavigate }: RacesListProps) {
  const [races, setRaces] = useState<Race[]>(() =>
    getRaces().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  );

  function handleDelete(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete "${name}"? This will also delete all associated results.`)) return;
    deleteRace(id);
    setRaces(getRaces().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Cycling Races</h1>
          <button
            onClick={() => onNavigate({ view: 'races', action: 'create' })}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
          >
            <Plus className="w-5 h-5" />
            Add Race
          </button>
        </div>

        {races.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600">No races found</p>
            <button
              onClick={() => onNavigate({ view: 'races', action: 'create' })}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Add your first race
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {races.map((race) => (
              <div
                key={race.id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow border border-gray-100 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{race.name}</h3>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {formatDate(race.date)}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          {race.location}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(race.id, race.name)}
                      className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete race"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Distance:</span>
                      <span className="font-medium text-gray-900">{race.distance} km</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium text-gray-900">{race.race_type}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate({ view: 'races', action: 'detail', id: race.id })}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    View Results
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
