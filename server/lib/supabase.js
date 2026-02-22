/**
 * Cliente Supabase para el servidor (usa service_role para bypass RLS).
 * Carga .env aquí porque los imports se ejecutan antes que el resto del código.
 */
import { config } from "dotenv";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, "..", ".env") });

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_KEY;

if (!url || !key) {
  console.warn("[Supabase] Faltan SUPABASE_URL o SUPABASE_SERVICE_KEY en .env");
}

export const supabase = url && key ? createClient(url, key) : null;
