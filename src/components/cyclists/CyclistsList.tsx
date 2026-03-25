import { useState } from 'react';
import { Plus, User, Trash2, Search } from 'lucide-react';
import { getCyclists, deleteCyclist } from '../../lib/dataStore';
import type { Cyclist } from '../../types';
import type { RouteParams } from '../../hooks/useRouter';

interface CyclistsListProps {
  onNavigate: (params: RouteParams) => void;
}

export function CyclistsList({ onNavigate }: CyclistsListProps) {
  const [cyclists, setCyclists] = useState<Cyclist[]>(() => getCyclists());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<string>('');

  function handleDelete(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    deleteCyclist(id);
    setCyclists(getCyclists());
  }

  const teams = Array.from(new Set(cyclists.map(c => c.team))).sort();

  const filteredCyclists = cyclists.filter(cyclist => {
    const matchesSearch = cyclist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cyclist.team.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cyclist.nationality.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTeam = !selectedTeam || cyclist.team === selectedTeam;
    return matchesSearch && matchesTeam;
  });

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

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Professional Cyclists</h1>
          <button
            onClick={() => onNavigate({ view: 'cyclists', action: 'create' })}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
          >
            <Plus className="w-5 h-5" />
            Add Cyclist
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, team, or nationality..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Teams</option>
              {teams.map(team => (
                <option key={team} value={team}>{team}</option>
              ))}
            </select>
          </div>
        </div>

        {filteredCyclists.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600">No cyclists found</p>
            <button
              onClick={() => onNavigate({ view: 'cyclists', action: 'create' })}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Add your first cyclist
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCyclists.map((cyclist) => (
              <div
                key={cyclist.id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow border border-gray-100 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{cyclist.name}</h3>
                      <p className="text-sm text-gray-600">{cyclist.team}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(cyclist.id, cyclist.name)}
                      className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete cyclist"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Nationality:</span>
                      <span className="font-medium text-gray-900">{cyclist.nationality}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Age:</span>
                      <span className="font-medium text-gray-900">{calculateAge(cyclist.birth_date)} years</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Specialty:</span>
                      <span className="font-medium text-gray-900">{cyclist.specialty}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate({ view: 'cyclists', action: 'detail', id: cyclist.id })}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    View Details
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
