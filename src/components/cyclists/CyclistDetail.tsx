import { ArrowLeft, Calendar, User, Award, Ruler, Weight, Flag, Bike } from 'lucide-react';
import { getCyclistById, getRaceResultsByCyclist, getRaceById } from '../../lib/dataStore';
import type { Cyclist, RaceResult, Race } from '../../types';
import type { RouteParams } from '../../hooks/useRouter';

interface CyclistDetailProps {
  cyclistId: string;
  onNavigate: (params: RouteParams) => void;
}

interface RaceResultWithRace extends RaceResult {
  race: Race;
}

export function CyclistDetail({ cyclistId, onNavigate }: CyclistDetailProps) {
  const cyclist: Cyclist | undefined = getCyclistById(cyclistId);

  if (!cyclist) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] gap-4">
        <div className="text-xl text-gray-600">Cyclist not found</div>
        <button
          onClick={() => onNavigate({ view: 'cyclists', action: 'list' })}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Back to Cyclists
        </button>
      </div>
    );
  }

  const rawResults = getRaceResultsByCyclist(cyclistId);
  const raceResults: RaceResultWithRace[] = rawResults
    .map(r => {
      const race = getRaceById(r.race_id);
      return race ? { ...r, race } : null;
    })
    .filter((r): r is RaceResultWithRace => r !== null)
    .sort((a, b) => new Date(b.race.date).getTime() - new Date(a.race.date).getTime());

  function calculateAge(birthDate: string): number {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => onNavigate({ view: 'cyclists', action: 'list' })}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Cyclists
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
            <h1 className="text-3xl font-bold text-white mb-2">{cyclist.name}</h1>
            <p className="text-blue-100 text-lg">{cyclist.team}</p>
          </div>

          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-6 h-6 text-blue-600" />
                  Personal Information
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Flag className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Nationality</div>
                      <div className="font-medium text-gray-900">{cyclist.nationality}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Age</div>
                      <div className="font-medium text-gray-900">
                        {calculateAge(cyclist.birth_date)} years ({formatDate(cyclist.birth_date)})
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Ruler className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Height</div>
                      <div className="font-medium text-gray-900">{cyclist.height} cm</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Weight className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Weight</div>
                      <div className="font-medium text-gray-900">{cyclist.weight} kg</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Bike className="w-6 h-6 text-blue-600" />
                  Career Information
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Specialty</div>
                      <div className="font-medium text-gray-900">{cyclist.specialty}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Professional Since</div>
                      <div className="font-medium text-gray-900">{cyclist.professional_since}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Bike className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Current Team</div>
                      <div className="font-medium text-gray-900">{cyclist.team}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Award className="w-7 h-7 text-blue-600" />
              Race Results
            </h2>
          </div>
          <div className="p-8">
            {raceResults.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No race results yet</p>
            ) : (
              <div className="space-y-4">
                {raceResults.map((result) => (
                  <div
                    key={result.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg">{result.race.name}</h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                          <span>{formatDate(result.race.date)}</span>
                          <span>{result.race.location}</span>
                          <span>{result.race.distance} km</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${
                          result.position === 1 ? 'text-yellow-600' :
                          result.position === 2 ? 'text-gray-400' :
                          result.position === 3 ? 'text-orange-600' :
                          'text-gray-900'
                        }`}>
                          #{result.position}
                        </div>
                        {result.time && (
                          <div className="text-sm text-gray-600 mt-1">{result.time}</div>
                        )}
                        {result.points !== null && result.points > 0 && (
                          <div className="text-sm text-blue-600 font-medium mt-1">
                            {result.points} pts
                          </div>
                        )}
                      </div>
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
