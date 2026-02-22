/**
 * Configuración de fuentes de scraping.
 * Cada fuente define: URL, selectores CSS y mapeo de datos.
 *
 * Para añadir una fuente real: abre la URL en el navegador, inspecciona (F12)
 * y copia los selectores CSS de: contenedor producto, nombre, precio.
 */
export const FUENTES = {
  /** Fuente demo: datos de prueba para validar el flujo sin depender de sitios externos */
  demo: {
    nombre: "Demo (datos de prueba)",
    demo: true,
  },
  pcpartpicker: {
    nombre: "PCPartPicker",
    url: "https://pcpartpicker.com/products/video-card/",
    selectores: {
      productos: "tr[data-product-id], .group__content, table tbody tr",
      nombre: "td:nth-child(2) a, .group__content__product__title, a[href*='/product/']",
      precio: "td:nth-child(3), .group__content__product__price, [class*='price']",
    },
  },
};

/** Pausa entre requests (ms) - ser respetuoso con el servidor */
export const DELAY_ENTRE_REQUESTS = 2000;
