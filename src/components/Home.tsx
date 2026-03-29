import { Bike, Trophy } from 'lucide-react';
import type { RouteParams } from '../hooks/useRouter';
import { NewsCarousel } from './NewsCarousel';

interface HomeProps {
  onNavigate: (params: RouteParams) => void;
}

export function Home({ onNavigate }: HomeProps) {
  const features = [
    {
      icon: Bike,
      title: 'Coureurs Pro',
      description: 'Parcourez et gérez les profils de coureurs cyclistes pro du monde entier.',
      action: () => onNavigate({ view: 'cyclists', action: 'list' }),
      buttonText: 'Voir les coureurs',
    },
    {
      icon: Trophy,
      title: 'Courses',
      description: 'Suivez les épreuves et consultez les résultats détaillés et les classements.',
      action: () => onNavigate({ view: 'races', action: 'list' }),
      buttonText: 'Voir les courses',
    },
  ];

  return (
    <div className="bg-gray-950">
      <div className="relative h-screen">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src='/Maillot_Jaune/video_home_hd.mp4' type='video/mp4'/>
        </video>
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <div className="flex justify-center mb-6">
          </div>
          <h1
            className="font-perso-titre text-9xl font-bold text-white mb-4 inline-block"
          >
            Maillot <span style={{color: "#ffee93"}}>Jaune</span></h1>
          <p className="text-xl text-white/80 mt-2 max-w-2xl mx-auto">
            Votre base de données sur les courses & les coureurs.
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-700 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-4 mb-4">
                <h2 className="font-perso text-2xl font-bold text-white">{feature.title}</h2>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">{feature.description}</p>
              <button
                onClick={() => {
                  window.scrollTo({ top: 0});
                  feature.action();
                }}
                className="w-full bg-primary text-gray-900 py-3 px-6 rounded-lg font-medium hover:bg-primary/80 transition-colors"
              >
                {feature.buttonText}
              </button>
            </div>
          ))}
        </div>
        <div className="mb-16">
          <h2 className="font-perso text-2xl font-bold text-white mb-2">
            Actualités Cyclisme
          </h2>
          <p className="text-gray-500 text-sm mb-6">Les dernières actualités via <span className="font-medium text-gray-400">CyclingNews.com</span></p>
          <NewsCarousel />
        </div>
      </div>
    </div>
  );
}
