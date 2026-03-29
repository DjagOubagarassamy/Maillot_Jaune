import { useState, useEffect } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { addCyclist } from '../../lib/dataStore';
import { CYCLIST_SPECIALTIES } from '../../types';
import type { Cyclist } from '../../types';
import type { RouteParams } from '../../hooks/useRouter';

/* Ce fichier contient le formulaire d'ajout d'un coureur : validation, brouillon localStorage et soumission */

interface CyclistFormProps {
  onNavigate: (params: RouteParams) => void;
}

const FORM_STORAGE_KEY = 'cyclist_form_draft';

const initialFormData: Omit<Cyclist, 'id'> = {
  name: '',
  team: '',
  nationality: '',
  birth_date: '',
  height: 0,
  weight: 0,
  photo_url: null,
  specialty: '',
  professional_since: new Date().getFullYear(),
};

export function CyclistForm({ onNavigate }: CyclistFormProps) {
  const [formData, setFormData] = useState<Omit<Cyclist, 'id'>>(initialFormData);
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
    if (Object.values(formData).some(val => val !== '' && val !== 0 && val !== null)) {
      localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(formData));
    }
  }, [formData]);

  function handleChange(field: keyof typeof formData, value: string | number | null) {
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
      newErrors.name = 'Le nom est requis';
    }

    if (!formData.team.trim()) {
      newErrors.team = "L'équipe est requise";
    }

    if (!formData.nationality.trim()) {
      newErrors.nationality = 'La nationalité est requise';
    }

    if (!formData.birth_date) {
      newErrors.birth_date = 'La date de naissance est requise';
    } else {
      const birthDate = new Date(formData.birth_date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 16 || age > 60) {
        newErrors.birth_date = 'Le coureur doit avoir entre 16 et 60 ans';
      }
    }

    if (!formData.height || formData.height < 150 || formData.height > 220) {
      newErrors.height = 'La taille doit être comprise entre 150 et 220 cm';
    }

    if (!formData.weight || formData.weight < 50 || formData.weight > 120) {
      newErrors.weight = 'Le poids doit être compris entre 50 et 120 kg';
    }

    if (!formData.specialty) {
      newErrors.specialty = 'La spécialité est requise';
    }

    if (!formData.professional_since || formData.professional_since < 1980 || formData.professional_since > new Date().getFullYear()) {
      newErrors.professional_since = 'Veuillez saisir une année valide';
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
      addCyclist({
        ...formData,
        height: Number(formData.height),
        weight: Number(formData.weight),
        professional_since: Number(formData.professional_since),
      });

      localStorage.removeItem(FORM_STORAGE_KEY);
      onNavigate({ view: 'cyclists', action: 'list' });
    } catch (error) {
      console.error('Error saving cyclist:', error);
      alert('Erreur lors de l\'enregistrement du coureur. Veuillez réessayer.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-950 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => {
            if (Object.values(formData).some(val => val !== '' && val !== 0 && val !== null)) {
              if (!confirm('Vous avez des modifications non sauvegardées. Voulez-vous vraiment quitter ?')) {
                return;
              }
            }
            onNavigate({ view: 'cyclists', action: 'list' });
          }}
          className="flex items-center gap-2 text-primary hover:text-primary/80 mb-6 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour aux coureurs
        </button>

        <div className="bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-white mb-6">Ajouter un coureur</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nom complet *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-700 text-white placeholder-gray-400 ${
                    errors.name ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="e.g., Tadej Pogačar"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Équipe *
                </label>
                <input
                  type="text"
                  value={formData.team}
                  onChange={(e) => handleChange('team', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-700 text-white placeholder-gray-400 ${
                    errors.team ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="e.g., UAE Team Emirates"
                />
                {errors.team && <p className="mt-1 text-sm text-red-600">{errors.team}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nationalité *
                </label>
                <input
                  type="text"
                  value={formData.nationality}
                  onChange={(e) => handleChange('nationality', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-700 text-white placeholder-gray-400 ${
                    errors.nationality ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="e.g., Slovenia"
                />
                {errors.nationality && <p className="mt-1 text-sm text-red-600">{errors.nationality}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Date de naissance *
                </label>
                <input
                  type="date"
                  value={formData.birth_date}
                  onChange={(e) => handleChange('birth_date', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-700 text-white ${
                    errors.birth_date ? 'border-red-500' : 'border-gray-600'
                  }`}
                />
                {errors.birth_date && <p className="mt-1 text-sm text-red-600">{errors.birth_date}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Taille (cm) *
                </label>
                <input
                  type="number"
                  value={formData.height || ''}
                  onChange={(e) => handleChange('height', e.target.value ? Number(e.target.value) : 0)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-700 text-white placeholder-gray-400 ${
                    errors.height ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="e.g., 176"
                  min="150"
                  max="220"
                />
                {errors.height && <p className="mt-1 text-sm text-red-600">{errors.height}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Poids (kg) *
                </label>
                <input
                  type="number"
                  value={formData.weight || ''}
                  onChange={(e) => handleChange('weight', e.target.value ? Number(e.target.value) : 0)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-700 text-white placeholder-gray-400 ${
                    errors.weight ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="e.g., 66"
                  min="50"
                  max="120"
                />
                {errors.weight && <p className="mt-1 text-sm text-red-600">{errors.weight}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Spécialité *
                </label>
                <select
                  value={formData.specialty}
                  onChange={(e) => handleChange('specialty', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-700 text-white ${
                    errors.specialty ? 'border-red-500' : 'border-gray-600'
                  }`}
                >
                  <option value="">Choisir une spécialité</option>
                  {CYCLIST_SPECIALTIES.map((specialty) => (
                    <option key={specialty} value={specialty}>
                      {specialty}
                    </option>
                  ))}
                </select>
                {errors.specialty && <p className="mt-1 text-sm text-red-600">{errors.specialty}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Professionnel depuis *
                </label>
                <input
                  type="number"
                  value={formData.professional_since || ''}
                  onChange={(e) => handleChange('professional_since', e.target.value ? Number(e.target.value) : new Date().getFullYear())}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-700 text-white placeholder-gray-400 ${
                    errors.professional_since ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="e.g., 2019"
                  min="1980"
                  max={new Date().getFullYear()}
                />
                {errors.professional_since && <p className="mt-1 text-sm text-red-600">{errors.professional_since}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                URL de la photo (optionnel)
              </label>
              <input
                type="url"
                value={formData.photo_url || ''}
                onChange={(e) => handleChange('photo_url', e.target.value || null)}
                className="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent placeholder-gray-400"
                placeholder="https://example.com/photo.jpg"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 bg-primary text-gray-900 px-6 py-3 rounded-lg hover:bg-primary/80 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                {saving ? 'Enregistrement...' : 'Enregistrer le coureur'}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirm('Êtes-vous sûr de vouloir annuler ?')) {
                    localStorage.removeItem(FORM_STORAGE_KEY);
                    onNavigate({ view: 'cyclists', action: 'list' });
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
