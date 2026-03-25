import { useState } from 'react';
import { ArrowLeft, Trophy, Calendar, MapPin, Plus, Trash2, Award } from 'lucide-react';
import { getRaceById, getRaceResultsByRace, getCyclists, getCyclistById, addRaceResult, deleteRaceResult } from '../../lib/dataStore';
import type { Race, RaceResult, Cyclist } from '../../types';
import type { RouteParams } from '../../hooks/useRouter';

interface RaceDetailProps {
  raceId: string;
  onNavigate: (params: RouteParams) => void;
}

interface RaceResultWithCyclist extends RaceResult {
  cyclist: Cyclist;
}

function buildResultsWithCyclists(raceId: string): RaceResultWithCyclist[] {
  return getRaceResultsByRace(raceId)
    .map(r => {
      const cyclist = getCyclistById(r.cyclist_id);
      return cyclist ? { ...r, cyclist } : null;
    })
    .filter((r): r is RaceResultWithCyclist => r !== null);
}

export function RaceDetail({ raceId, onNavigate }: RaceDetailProps) {
  const race: Race | undefined = getRaceById(raceId);
  const [results, setResults] = useState<RaceResultWithCyclist[]>(() => buildResultsWithCyclists(raceId));
  const allCyclists = getCyclists();
  const [showAddResult, setShowAddResult] = useState(false);
  const [selectedCyclist, setSelectedCyclist] = useState('');
  const [position, setPosition] = useState('');
  const [time, setTime] = useState('');
  const [points, setPoints] = useState('');

  if (!race) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] gap-4">
        <div className="text-xl text-gray-600">Race not found</div>
        <button
          onClick={() => onNavigate({ view: 'races', action: 'list' })}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Back to Races
        </button>
      </div>
    );
  }

  function handleAddResult(e: React.FormEvent) {
    e.preventDefault();

    if (!selectedCyclist || !position) {
      alert('Please select a cyclist and enter a position');
      return;
    }

    const positionNum = Number(position);
    if (positionNum < 1) {
      alert('Position must be at least 1');
      return;
    }

    // Check for duplicates
    if (results.some(r => r.cyclist_id === selectedCyclist)) {
      alert('This cyclist already has a result in this race');
      return;
    }

    addRaceResult({
      race_id: raceId,
      cyclist_id: selectedCyclist,
      position: positionNum,
      time: time || null,
      points: points ? Number(points) : 0,
    });

    setSelectedCyclist('');
    setPosition('');
    setTime('');
    setPoints('');
    setShowAddResult(false);
    setResults(buildResultsWithCyclists(raceId));
  }

  function handleDeleteResult(resultId: string, cyclistName: string) {
    if (!confirm(`Remove ${cyclistName} from the results?`)) return;
    deleteRaceResult(resultId);
    setResults(buildResultsWithCyclists(raceId));
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  const availableCyclists = allCyclists.filter(
    c => !results.some(r => r.cyclist_id === c.id)
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => onNavigate({ view: 'races', action: 'list' })}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Races
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
            <h1 className="text-3xl font-bold text-white mb-2">{race.name}</h1>
            <div className="flex items-center gap-4 text-blue-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {formatDate(race.date)}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                {race.location}
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">Distance</h3>
                <p className="text-2xl font-bold text-gray-900">{race.distance} km</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">Race Type</h3>
                <p className="text-2xl font-bold text-gray-900">{race.race_type}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Trophy className="w-7 h-7 text-blue-600" />
              Race Results
            </h2>
            <button
              onClick={() => setShowAddResult(!showAddResult)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Result
            </button>
          </div>

          {showAddResult && (
            <div className="border-b border-gray-200 bg-blue-50 p-6">
              <form onSubmit={handleAddResult} className="grid md:grid-cols-5 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cyclist
                  </label>
                  <select
                    value={selectedCyclist}
                    onChange={(e) => setSelectedCyclist(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select cyclist</option>
                    {availableCyclists.map((cyclist) => (
                      <option key={cyclist.id} value={cyclist.id}>
                        {cyclist.name} ({cyclist.team})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Position
                  </label>
                  <input
                    type="number"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time (optional)
                  </label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="4h 23m 15s"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Points
                  </label>
                  <input
                    type="number"
                    value={points}
                    onChange={(e) => setPoints(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    placeholder="0"
                  />
                </div>
                <div className="md:col-span-5 flex gap-2">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Add Result
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddResult(false);
                      setSelectedCyclist('');
                      setPosition('');
                      setTime('');
                      setPoints('');
                    }}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="p-8">
            {results.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No results yet. Add the first result above.</p>
            ) : (
              <div className="space-y-3">
                {results.map((result) => (
                  <div
                    key={result.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`text-3xl font-bold w-12 text-center ${
                          result.position === 1 ? 'text-yellow-600' :
                          result.position === 2 ? 'text-gray-400' :
                          result.position === 3 ? 'text-orange-600' :
                          'text-gray-900'
                        }`}>
                          {result.position === 1 && <Award className="w-8 h-8 inline" />}
                          {result.position === 2 && <Award className="w-8 h-8 inline" />}
                          {result.position === 3 && <Award className="w-8 h-8 inline" />}
                          {result.position > 3 && result.position}
                        </div>
                        <div className="flex-1">
                          <button
                            onClick={() => onNavigate({ view: 'cyclists', action: 'detail', id: result.cyclist_id })}
                            className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors text-left"
                          >
                            {result.cyclist.name}
                          </button>
                          <p className="text-sm text-gray-600">{result.cyclist.team}</p>
                        </div>
                        {result.time && (
                          <div className="text-right">
                            <div className="text-sm text-gray-600">Time</div>
                            <div className="font-medium text-gray-900">{result.time}</div>
                          </div>
                        )}
                        {result.points !== null && result.points > 0 && (
                          <div className="text-right">
                            <div className="text-sm text-gray-600">Points</div>
                            <div className="font-medium text-blue-600">{result.points}</div>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteResult(result.id, result.cyclist.name)}
                        className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors ml-4"
                        title="Delete result"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
