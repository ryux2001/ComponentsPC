# Guía: Scraping de Precios - KIPC

## Estructura creada

```
server/
├── package.json          # Dependencias del servidor
├── index.js              # API Express (POST /api/scrape/precios)
├── config.js             # Fuentes y selectores (editar aquí)
├── scrapers/
│   └── precios.js        # Lógica de extracción
├── scripts/
│   └── run-scrape.js     # Ejecutar desde terminal
└── output/               # JSON con precios (gitignore)
```

## Paso 1: Instalar dependencias

```bash
cd server
pnpm install
```

Playwright descargará Chromium la primera vez (~150MB).

## Paso 1b: Configurar Supabase (para guardar precios)

1. Copia el ejemplo: `cp .env.example .env`
2. Edita `server/.env` con tus credenciales:
   - `SUPABASE_URL`: Project URL (Settings → API)
   - `SUPABASE_SERVICE_KEY`: service_role key (Settings → API)

## Paso 2: Probar el scraper

```bash
cd server
pnpm run scrape
```

Por defecto usa la fuente **demo** (datos de prueba). Guarda en `server/output/precios-YYYY-MM-DD.json`.

Para usar PCPartPicker (requiere ajustar selectores): `pnpm run scrape pcpartpicker`

Para guardar en Supabase: `pnpm run scrape demo --save`

## Paso 3: Ajustar selectores (si falla)

Los sitios web cambian su HTML. Si no extrae datos:

1. Abre la URL de la fuente en el navegador (ej: PCPartPicker).
2. Inspecciona el HTML (F12 → Elements).
3. Localiza el contenedor de cada producto y los elementos de nombre/precio.
4. Actualiza `server/config.js` con los selectores correctos.

Ejemplo de formato de salida:

```json
[
  {
    "nombre": "NVIDIA GeForce RTX 4060",
    "precio": 299.99,
    "fuente": "PCPartPicker",
    "fecha": "2025-02-21"
  }
]
```

## Paso 4: Iniciar el servidor API

```bash
cd server
pnpm start
```

Luego puedes llamar:

```bash
curl -X POST http://localhost:3001/api/scrape/precios
```

## Próximos pasos (cuando quieras)

- **Supabase**: Crear tabla `precios_historico` y guardar ahí los resultados.
- **Emparejamiento**: Relacionar nombres scrapeados con tus productos (id de graficas.json/cpu.json).
- **Más fuentes**: Añadir tiendas locales en `config.js`.
