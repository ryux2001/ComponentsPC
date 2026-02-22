// server/scripts/run-scrape.js
import { scrapePrecios } from '../scrapers/precios.js';
import { guardarPreciosEnSupabase } from '../lib/guardarPrecios.js';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  const args = process.argv.slice(2);
  const fuente = args[0] || 'demo';
  const guardar = args.includes('--save');
  
  console.log(`[Run] Iniciando scraping desde: ${fuente}`);
  console.log(`[Run] Guardar en Supabase: ${guardar ? 'SÍ' : 'NO'}`);
  
  try {
    const resultados = await scrapePrecios(fuente);
    
    console.log(`[Run] Se obtuvieron ${resultados.length} precios`);
    
    if (guardar && resultados.length > 0) {
      console.log('[Run] Guardando en Supabase...');
      const resultado = await guardarPreciosEnSupabase(resultados);
      console.log('[Run] Resultado:', resultado);
    }
    
    console.log('[Run] Proceso completado');
  } catch (error) {
    console.error('[Run] Error:', error);
    process.exit(1);
  }
}

main();