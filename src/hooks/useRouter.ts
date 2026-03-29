/* Hook de routage hash : parse l'URL, gère la navigation entre vues (home, cyclists, races) */
import { useState, useEffect } from 'react';

export interface RouteParams {
  view: 'cyclists' | 'races' | 'home';
  action?: 'list' | 'detail' | 'create';
  id?: string;
}

export function useRouter() {
  const [route, setRoute] = useState<RouteParams>(parseHash());

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(parseHash());
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (params: RouteParams) => {
    const hash = buildHash(params);
    window.location.hash = hash;
  };

  return { route, navigate };
}

function parseHash(): RouteParams {
  const hash = window.location.hash.slice(1);

  if (!hash) {
    return { view: 'home' };
  }

  const parts = hash.split('/').filter(Boolean);

  if (parts[0] === 'cyclists') {
    if (parts[1] === 'create') {
      return { view: 'cyclists', action: 'create' };
    } else if (parts[1]) {
      return { view: 'cyclists', action: 'detail', id: parts[1] };
    }
    return { view: 'cyclists', action: 'list' };
  }

  if (parts[0] === 'races') {
    if (parts[1] === 'create') {
      return { view: 'races', action: 'create' };
    } else if (parts[1]) {
      return { view: 'races', action: 'detail', id: parts[1] };
    }
    return { view: 'races', action: 'list' };
  }

  return { view: 'home' };
}

function buildHash(params: RouteParams): string {
  if (params.view === 'home') {
    return '';
  }

  if (params.action === 'create') {
    return `${params.view}/create`;
  }

  if (params.action === 'detail' && params.id) {
    return `${params.view}/${params.id}`;
  }

  return params.view;
}
