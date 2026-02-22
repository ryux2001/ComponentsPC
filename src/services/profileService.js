import { supabase } from '../lib/supabaseClient';

export const getProfile = async (userId) => {
  const { data, error } = await supabase
    .from('perfiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
};

export const updateProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('perfiles')
    .update(updates)
    .eq('id', userId);
  if (error) throw error;
  return data;
};