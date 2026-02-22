/**
 * Servidor API para scraping de precios - KIPC
 * Solo expone endpoints para ejecutar y consultar precios.
 */
import "dotenv/config";
import express from "express";
import { scrapePrecios } from "./scrapers/precios.js";
import { guardarPreciosEnSupabase } from "./lib/guardarPrecios.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({ ok: true, servicio: "kipc-scraper" });
});

/**
 * POST /api/scrape/precios
 * Ejecuta el scraping de precios.
 * Body opcional: { fuente: "pcpartpicker" } para elegir fuente.
 */
app.post("/api/scrape/precios", async (req, res) => {
  try {
    const fuente = req.body?.fuente || "demo";
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
    console.error("[Scrape Error]", error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`[KIPC Scraper] Servidor en http://localhost:${PORT}`);
});
