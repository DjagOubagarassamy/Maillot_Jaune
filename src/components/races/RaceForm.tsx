import { useState, useEffect } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { addRace } from '../../lib/dataStore';
import { RACE_TYPES } from '../../types';
import type { Race } from '../../types';
import type { RouteParams } from '../../hooks/useRouter';

interface RaceFormProps {
  onNavigate: (params: RouteParams) => void;
}

const FORM_STORAGE_KEY = 'race_form_draft';

const initialFormData: Omit<Race, 'id'> = {
  name: '',
  date: '',
  location: '',
  distance: 0,
  race_type: '',
};

/* L'autre formulaire du site : qui gère l'ajout d'une course : validation, brouillon localStorage et soumission */
export function RaceForm({ onNavigate }: RaceFormProps) {
  const [formData, setFormData] = useState<Omit<Race, 'id'>>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem(FORM_STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(parsed);
      } catch (error) {
        console.error('Error loading saved form data:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (Object.values(formData).some(val => val !== '' && val !== 0)) {
      localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(formData));
    }
  }, [formData]);

  function handleChange(field: keyof typeof formData, value: string | number) {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }

  function validateForm(): boolean {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom de la course est requis';
    }

    if (!formData.date) {
      newErrors.date = 'La date est requise';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Le lieu est requis';
    }

    if (!formData.distance || formData.distance < 1 || formData.distance > 500) {
      newErrors.distance = 'La distance doit être comprise entre 1 et 500 km';
    }

    if (!formData.race_type) {
      newErrors.race_type = 'Le type de course est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      addRace({
        ...formData,
        distance: Number(formData.distance),
      });

      localStorage.removeItem(FORM_STORAGE_KEY);
      onNavigate({ view: 'races', action: 'list' });
    } catch (error) {
      console.error('Error saving race:', error);
      alert('Erreur lors de l\'enregistrement de la course. Veuillez réessayer.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-950 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => {
            if (Object.values(formData).some(val => val !== '' && val !== 0)) {
              if (!confirm('Vous avez des modifications non sauvegardées. Voulez-vous vraiment quitter ?')) {
                return;
              }
            }
            onNavigate({ view: 'races', action: 'list' });
          }}
          className="flex items-center gap-2 text-primary hover:text-primary/80 mb-6 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour aux courses
        </button>

        <div className="bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-white mb-6">Ajouter une course</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nom de la course *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-700 text-white placeholder-gray-400 ${
                  errors.name ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="e.g., Tour de France Stage 10"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-700 text-white ${
                    errors.date ? 'border-red-500' : 'border-gray-600'
                  }`}
                />
                {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Lieu *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-700 text-white placeholder-gray-400 ${
                    errors.location ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="e.g., France"
                />
                {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Distance (km) *
                </label>
                <input
                  type="number"
                  value={formData.distance || ''}
                  onChange={(e) => handleChange('distance', e.target.value ? Number(e.target.value) : 0)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-700 text-white placeholder-gray-400 ${
                    errors.distance ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="e.g., 180"
                  min="1"
                  max="500"
                />
                {errors.distance && <p className="mt-1 text-sm text-red-600">{errors.distance}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Type de course *
                </label>
                <select
                  value={formData.race_type}
                  onChange={(e) => handleChange('race_type', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-700 text-white ${
                    errors.race_type ? 'border-red-500' : 'border-gray-600'
                  }`}
                >
                  <option value="">Choisir un type de course</option>
                  {RACE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.race_type && <p className="mt-1 text-sm text-red-600">{errors.race_type}</p>}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 bg-primary text-gray-900 px-6 py-3 rounded-lg hover:bg-primary/80 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                {saving ? 'Enregistrement...' : 'Enregistrer la course'}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirm('Êtes-vous sûr de vouloir annuler ?')) {
                    localStorage.removeItem(FORM_STORAGE_KEY);
                    onNavigate({ view: 'races', action: 'list' });
                  }
                }}
                className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
