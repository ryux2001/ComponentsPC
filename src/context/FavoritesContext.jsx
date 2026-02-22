import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { fetchFavoriteIds, addFavorite, removeFavorite } from '../services/favoriteService';

const FavoritesContext = createContext({});

export const FavoritesProvider = ({ children }) => {
  const { user } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      if (user) {
        setLoading(true);
        const ids = await fetchFavoriteIds(user.id);
        setFavoriteIds(ids);
        setLoading(false);
      } else {
        setFavoriteIds([]);
        setLoading(false);
      }
    };
    loadFavorites();
  }, [user]);

  const add = async (productId) => {
    if (!user) return;
    await addFavorite(user.id, productId);
    setFavoriteIds(prev => [...prev, productId]);
  };

  const remove = async (productId) => {
    if (!user) return;
    await removeFavorite(user.id, productId);
    setFavoriteIds(prev => prev.filter(id => id !== productId));
  };

  const isFavorite = (productId) => favoriteIds.includes(productId);

  return (
    <FavoritesContext.Provider value={{
      favoriteIds,
      loading,
      addFavorite: add,
      removeFavorite: remove,
      isFavorite
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites debe usarse dentro de FavoritesProvider');
  }
  return context;
};