// server/config/sitios.js
export const sitiosConfig = {
    pcpartpicker: {
      url: 'https://pcpartpicker.com/products/video-cards/',
      selectores: {
        producto: '.product-item',
        nombre: '.product-name',
        precio: '.product-price'
      },
      respeto: {
        delayEntrePeticiones: 2000, // 2 segundos entre requests
        maxConcurrente: 1, // Una sola petición a la vez
        userAgent: 'KIPC-Bot/1.0 (+https://kipc.com/info) - Bot de comparación de precios',
        robotsTxt: 'https://pcpartpicker.com/robots.txt',
        respetarRobots: true
      }
    },
    // Añade más sitios aquí cuando los necesites
  };
  
  export const configGlobal = {
    delayMinimo: 2000, // 2 segundos mínimo entre requests
    maxRequestsPorSesion: 50,
    tiempoEntreSesiones: 8 * 60 * 60 * 1000, // 8 horas
    headers: {
      'Accept-Language': 'es-ES,es;q=0.9',
      'Accept': 'text/html,application/xhtml+xml',
      'Cache-Control': 'no-cache'
    }
  };