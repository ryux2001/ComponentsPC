import { supabase } from '../lib/supabaseClient';

export const fetchFavoriteIds = async (userId) => {
  const { data, error } = await supabase
    .from('productos_guardados')
    .select('producto_id')
    .eq('usuario_id', userId);

  if (error) {
    console.error('Error al obtener favoritos:', error);
    return [];
  }
  return data.map(item => item.producto_id);
};

export const addFavorite = async (userId, productId) => {
  const { error } = await supabase
    .from('productos_guardados')
    .insert([{ usuario_id: userId, producto_id: productId }]);
  if (error) throw error;
};

export const removeFavorite = async (userId, productId) => {
  const { error } = await supabase
    .from('productos_guardados')
    .delete()
    .match({ usuario_id: userId, producto_id: productId });
  if (error) throw error;
};