import { useState, useEffect, useCallback } from 'react';

const FAVORITES_KEY = 'musclepedia-favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch {
        setFavorites([]);
      }
    }
  }, []);

  const toggleFavorite = useCallback((exerciseId: string) => {
    setFavorites((prev) => {
      const newFavorites = prev.includes(exerciseId)
        ? prev.filter((id) => id !== exerciseId)
        : [...prev, exerciseId];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      return newFavorites;
    });
  }, []);

  const isFavorite = useCallback(
    (exerciseId: string) => favorites.includes(exerciseId),
    [favorites]
  );

  return { favorites, toggleFavorite, isFavorite };
}
