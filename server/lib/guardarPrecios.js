// server/lib/guardarPrecios.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('[Guardar] ADVERTENCIA: SUPABASE_URL o SUPABASE_SERVICE_KEY no configurados');
}

const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export async function guardarPreciosEnSupabase(precios) {
  if (!supabase) {
    return {
      insertados: 0,
      ignorados: precios.length,
      errores: ['Supabase no configurado']
    };
  }

  // Filtrar solo los que tienen producto_id válido
  const preciosValidos = precios.filter(p => p.producto_id && p.producto_id !== 'desconocido');
  const preciosIgnorados = precios.filter(p => !p.producto_id || p.producto_id === 'desconocido');

  if (preciosValidos.length === 0) {
    return {
      insertados: 0,
      ignorados: preciosIgnorados.length,
      errores: []
    };
  }

  // Preparar datos para inserción
  const datosParaInsertar = preciosValidos.map(p => ({
    producto_id: p.producto_id,
    precio: p.precio,
    fuente: p.fuente,
    fecha: p.fecha || new Date().toISOString()
  }));

  try {
    const { data, error } = await supabase
      .from('precios_historico')
      .insert(datosParaInsertar)
      .select();

    if (error) {
      console.error('[Guardar] Error de Supabase:', error);
      return {
        insertados: 0,
        ignorados: preciosIgnorados.length,
        errores: [error.message]
      };
    }

    return {
      insertados: data?.length || 0,
      ignorados: preciosIgnorados.length,
      errores: []
    };
  } catch (error) {
    console.error('[Guardar] Error inesperado:', error);
    return {
      insertados: 0,
      ignorados: preciosIgnorados.length,
      errores: [error.message]
    };
  }
}