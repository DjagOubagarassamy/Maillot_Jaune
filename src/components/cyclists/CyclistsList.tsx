import { useState } from 'react';
import { Plus, User, Trash2, Search } from 'lucide-react';
import { getCyclists, deleteCyclist } from '../../lib/dataStore';
import type { Cyclist } from '../../types';
import type { RouteParams } from '../../hooks/useRouter';

/* ici on a la liste des coureurs : recherche, filtre par équipe, cards avec suppression et accès au profil grâce aux fonctions du lib/ */
interface CyclistsListProps {
  onNavigate: (params: RouteParams) => void;
}

export function CyclistsList({ onNavigate }: CyclistsListProps) {
  const [cyclists, setCyclists] = useState<Cyclist[]>(() => getCyclists());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<string>('');

  function handleDelete(id: string, name: string) {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${name} ?`)) return;
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
    <div className="min-h-[calc(100vh-4rem)] bg-gray-950 py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-perso text-3xl font-bold text-white">Coureurs Professionnels</h1>
          <button
            onClick={() => onNavigate({ view: 'cyclists', action: 'create' })}
            className="flex items-center gap-2 bg-primary text-gray-900 px-6 py-3 rounded-lg hover:bg-primary/80 transition-colors font-medium shadow-md"
          >
            <Plus className="w-5 h-5" />
            Ajouter un coureur
          </button>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher par nom, équipe ou nationalité..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent placeholder-gray-400"
              />
            </div>
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Toutes les équipes</option>
              {teams.map(team => (
                <option key={team} value={team}>{team}</option>
              ))}
            </select>
          </div>
        </div>

        {filteredCyclists.length === 0 ? (
          <div className="bg-gray-800 rounded-lg shadow-md p-12 text-center">
            <User className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-xl text-gray-400">Aucun coureur trouvé</p>
            <button
              onClick={() => onNavigate({ view: 'cyclists', action: 'create' })}
              className="mt-4 text-primary hover:text-primary/80 font-medium"
            >
              Ajouter votre premier coureur
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCyclists.map((cyclist) => (
              <div
                key={cyclist.id}
                className="bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow border border-gray-700 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-1">{cyclist.name}</h3>
                      <p className="text-sm text-gray-400">{cyclist.team}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(cyclist.id, cyclist.name)}
                      className="text-red-500 hover:text-red-400 p-2 hover:bg-red-900/30 rounded-lg transition-colors"
                      title="Supprimer le coureur"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Nationalité :</span>
                      <span className="font-medium text-gray-200">{cyclist.nationality}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Âge :</span>
                      <span className="font-medium text-gray-200">{calculateAge(cyclist.birth_date)} ans</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Spécialité :</span>
                      <span className="font-medium text-gray-200">{cyclist.specialty}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate({ view: 'cyclists', action: 'detail', id: cyclist.id })}
                    className="w-full bg-primary text-gray-900 py-2 px-4 rounded-lg hover:bg-primary/80 transition-colors font-medium"
                  >
                    Voir le profil
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
