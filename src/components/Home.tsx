import { Bike, Trophy, Users, TrendingUp } from 'lucide-react';
import type { RouteParams } from '../hooks/useRouter';

interface HomeProps {
  onNavigate: (params: RouteParams) => void;
}

export function Home({ onNavigate }: HomeProps) {
  const features = [
    {
      icon: Bike,
      title: 'Professional Cyclists',
      description: 'Browse and manage profiles of professional cyclists from around the world.',
      action: () => onNavigate({ view: 'cyclists', action: 'list' }),
      buttonText: 'View Cyclists',
    },
    {
      icon: Trophy,
      title: 'Race Results',
      description: 'Track race events and view detailed results and rankings.',
      action: () => onNavigate({ view: 'races', action: 'list' }),
      buttonText: 'View Races',
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-600 p-4 rounded-full">
              <Bike className="w-16 h-16 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Professional Cycling Showcase
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your comprehensive database for professional cycling. Track cyclists, teams, and race results all in one place.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <feature.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{feature.title}</h2>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>
              <button
                onClick={feature.action}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                {feature.buttonText}
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <TrendingUp className="w-7 h-7 text-blue-600" />
            Key Features
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <Users className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Cyclist Profiles</h3>
                <p className="text-sm text-gray-600">Detailed information including team, specialty, physical stats, and career history.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Trophy className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Race Management</h3>
                <p className="text-sm text-gray-600">Create and manage races with complete result tracking and rankings.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Bike className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Real-time Updates</h3>
                <p className="text-sm text-gray-600">Add, edit, and delete entries with instant updates across the platform.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
