import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('[Guardar] ADVERTENCIA: Variables de Supabase no configuradas');
}

const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export async function guardarPreciosEnSupabase(precios) {
  if (!supabase) {
    return { insertados: 0, ignorados: precios.length, errores: ['Supabase no configurado'] };
  }

  const preciosValidos = precios.filter(p => p.producto_id && p.producto_id !== 'desconocido');
  const preciosIgnorados = precios.filter(p => !p.producto_id || p.producto_id === 'desconocido');

  if (preciosValidos.length === 0) {
    return { insertados: 0, ignorados: preciosIgnorados.length, errores: [] };
  }

  try {
    const { data, error } = await supabase
      .from('precios_historico')
      .insert(preciosValidos)
      .select();

    if (error) throw error;

    return {
      insertados: data?.length || 0,
      ignorados: preciosIgnorados.length,
      errores: []
    };
  } catch (error) {
    console.error('[Guardar] Error:', error);
    return {
      insertados: 0,
      ignorados: preciosIgnorados.length,
      errores: [error.message]
    };
  }
}