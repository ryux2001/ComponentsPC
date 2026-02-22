// server/scripts/cron-scrape.js
import { scrapePrecios } from '../scrapers/precios.js';
import { guardarPreciosEnSupabase } from '../lib/guardarPrecios.js';
import { ScrapeQueue } from '../lib/queueManager.js';
import cron from 'node-cron';
import dotenv from 'dotenv';

dotenv.config();

const queue = new ScrapeQueue();
const SITIOS = ['pcpartpicker']; // Añade más sitios cuando los configures

// Ejecutar cada 8 horas
cron.schedule('0 */8 * * *', async () => {
  console.log('[Cron] Iniciando ciclo de scraping programado (cada 8 horas)');
  
  for (const sitio of SITIOS) {
    await queue.agregar({
      sitio,
      ejecutar: async () => {
        console.log(`[Cron] Scrapeando ${sitio}...`);
        
        try {
          const resultados = await scrapePrecios(sitio);
          
          if (resultados.length > 0) {
            const { insertados, ignorados } = await guardarPreciosEnSupabase(resultados);
            console.log(`[Cron] ${sitio}: ${insertados} insertados, ${ignorados} ignorados`);
          }
        } catch (error) {
          console.error(`[Cron] Error con ${sitio}:`, error);
        }
      }
    });
  }
});

console.log('[Cron] Sistema de scraping programado iniciado - Cada 8 horas');

// También permitir ejecución manual
async function ejecutarManual(sitio) {
  await queue.agregar({
    sitio,
    ejecutar: async () => {
      const resultados = await scrapePrecios(sitio);
      if (resultados.length > 0) {
        await guardarPreciosEnSupabase(resultados);
      }
    }
  });
}

// Si se ejecuta con argumento
if (process.argv[2]) {
  ejecutarManual(process.argv[2]);
}