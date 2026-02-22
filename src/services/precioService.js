import { supabase } from "../lib/supabaseClient";

export async function getPreciosActuales() {
  try {
    const { data, error } = await supabase
      .from("precios_historico")
      .select("producto_id, precio, fecha")
      .order("fecha", { ascending: false });

    if (error) {
      console.error("[precioService] Error:", error);
      return {};
    }

    const preciosMap = {};
    for (const row of data || []) {
      if (!preciosMap[row.producto_id]) {
        preciosMap[row.producto_id] = {
          precio: Number(row.precio),
          fecha: row.fecha
        };
      }
    }

    console.log("[precioService] Precios cargados:", preciosMap);
    return preciosMap;
  } catch (error) {
    console.error("[precioService] Error inesperado:", error);
    return {};
  }
}