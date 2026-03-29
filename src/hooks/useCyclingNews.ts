/* Hook de récupération des actus cyclisme via le flux RSS CyclingNews.com (converti en JSON par rss2json) */
import { useEffect, useState } from 'react';

export interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  thumbnail: string;
}

const RSS_URL = 'https://www.cyclingnews.com/rss/';
const API_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}&count=10`;

export function useCyclingNews() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch(API_URL, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (data.status !== 'ok') throw new Error('Flux indisponible');
        setItems(
          (data.items as any[]).slice(0, 10).map(item => ({
            title: item.title ?? '',
            link: item.link ?? '',
            pubDate: item.pubDate ?? '',
            description: item.description ?? '',
            thumbnail: item.thumbnail || item.enclosure?.link || '',
          }))
        );
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          setError('Erreur dans le chargement de lactu');
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  return { items, loading, error };
}
