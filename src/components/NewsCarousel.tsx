/* Carrousel d'actualités cyclisme : affiche les articles CyclingNews avec défilement auto, flèches et dots */
import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { useCyclingNews } from '../hooks/useCyclingNews';

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function NewsCarousel() {
  const { items, loading, error } = useCyclingNews();
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const resetInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (items.length === 0) return;
    intervalRef.current = setInterval(() => {
      setCurrent(i => (i + 1) % items.length);
    }, 5000);
  };

  useEffect(() => {
    resetInterval();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [items.length]);

  const goTo = (index: number) => {
    setCurrent(index);
    resetInterval();
  };

  const prev = () => goTo((current - 1 + items.length) % items.length);
  const next = () => goTo((current + 1) % items.length);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error || items.length === 0) {
    return (
      <div className="text-center text-gray-400 py-10 bg-gray-900 rounded-xl">
        {error ?? 'Aucune actualité disponible.'}
      </div>
    );
  }

  const item = items[current];
  const text = stripHtml(item.description || item.title);

  return (
    <div className="relative px-8">

      <div
        key={current}
        className="bg-gray-900 rounded-xl overflow-hidden min-h-[220px] flex flex-col md:flex-row"
        style={{ animation: 'fadeIn 0.4s ease' }}
      >

        {item.thumbnail && (
          <div className="md:w-72 flex-shrink-0">
            <img
              src={item.thumbnail}
              alt={item.title}
              className="w-full h-48 md:h-full object-cover"
            />
          </div>
        )}

        <div className="flex flex-col justify-between p-8 flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-primary text-gray-900 font-bold text-xs px-2 py-1 rounded-full tracking-wider">
              CyclingNews
            </span>
            <span className="text-gray-500 text-xs">{formatDate(item.pubDate)}</span>
          </div>

          <h3 className="text-white text-lg font-semibold mb-2 line-clamp-2">{item.title}</h3>

          <p className="text-gray-400 text-sm leading-relaxed flex-1 line-clamp-3">
            {text}
          </p>

          <div className="flex items-center justify-between mt-4">
            <span className="text-gray-600 text-sm">
              {current + 1} / {items.length}
            </span>
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-primary hover:text-primary/70 text-sm font-medium transition-colors"
            >
              Lire l'article <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      <button
        onClick={prev}
        aria-label="Précédent"
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-800 rounded-full p-1.5 shadow-md hover:bg-gray-700 transition-colors"
      >
        <ChevronLeft className="w-5 h-5 text-gray-300" />
      </button>
      <button
        onClick={next}
        aria-label="Suivant"
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-800 rounded-full p-1.5 shadow-md hover:bg-gray-700 transition-colors"
      >
        <ChevronRight className="w-5 h-5 text-gray-300" />
      </button>

      <div className="flex justify-center gap-1.5 mt-5">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Article ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === current ? 'bg-primary w-5 h-2' : 'bg-gray-600 w-2 h-2'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
