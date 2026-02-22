// api/index.js - Punto de entrada para Vercel
import express from 'express';
import cors from 'cors';
import { scrapePrecios } from '../server/scrapers/precios.js';
import { guardarPreciosEnSupabase } from '../server/lib/guardarPrecios.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true, servicio: 'kipc-api' });
});

// Endpoint para scraping
app.post('/api/scrape/precios', async (req, res) => {
  try {
    const fuente = req.body?.fuente || 'demo';
    const guardar = req.body?.guardar === true;
    const resultados = await scrapePrecios(fuente);

    if (guardar && resultados.length > 0) {
      const { insertados, ignorados, errores } = await guardarPreciosEnSupabase(resultados);
      return res.json({
        ok: true,
        datos: resultados,
        supabase: { insertados, ignorados, errores },
      });
    }

    res.json({ ok: true, datos: resultados });
  } catch (error) {
    console.error('[Scrape Error]', error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Exportar para Vercel (IMPORTANTE)
export default app;