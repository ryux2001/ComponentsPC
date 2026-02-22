import express from "express";
import cors from "cors";
import { scrapePrecios } from "./scrapers/precios.js";
import { guardarPreciosEnSupabase } from "./lib/guardarPrecios.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Health check - IMPORTANTE para Render
app.get("/api/health", (req, res) => {
  res.json({ ok: true, servicio: "kipc-scraper" });
});

// Endpoint para scraping
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

// ¡CRÍTICO! Escuchar en 0.0.0.0 para que Render pueda detectar el puerto
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[KIPC Scraper] Servidor en http://0.0.0.0:${PORT}`);
});