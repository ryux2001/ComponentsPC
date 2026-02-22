// server/scrapers/precios.js - Versión mejorada
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { encontrarProductoId } from '../lib/mapeoProductos.js';
import { cargarTodosLosProductos } from '../lib/productosABuscar.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function scrapePrecios(fuente = 'demo', opciones = {}) {
  console.log(`[Scraper] Iniciando scraping desde: ${fuente}`);
  
  const resultados = [];
  const fecha = new Date().toISOString().split('T')[0];
  const productos = cargarTodosLosProductos();
  
  if (fuente === 'demo') {
    // Modo demo: genera precios para TODOS los productos
    console.log(`[Scraper] Generando precios demo para ${productos.length} productos`);
    
    for (const producto of productos) {
      // Generar precio aleatorio pero realista según el tipo
      let precioBase;
      if (producto.tipo === 'gpu') {
        precioBase = 200 + Math.random() * 800; // Entre 200 y 1000
      } else {
        precioBase = 100 + Math.random() * 400; // Entre 100 y 500
      }
      
      // Redondear a 2 decimales
      const precio = Math.round(precioBase * 100) / 100;
      
      resultados.push({
        producto_id: producto.id,
        nombre_original: producto.nombre,
        precio: precio,
        fuente: 'Demo',
        fecha
      });
    }
  } else {
    // Modo real: buscar cada producto en la web
    console.log(`[Scraper] Buscando precios reales para ${productos.length} productos`);
    
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    try {
      for (let i = 0; i < productos.length; i++) {
        const producto = productos[i];
        
        // Delay entre búsquedas para no saturar
        await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));
        
        console.log(`[Scraper] Buscando ${i+1}/${productos.length}: ${producto.nombre}`);
        
        // Construir URL de búsqueda (ejemplo para PCPartPicker)
        const nombreBusqueda = encodeURIComponent(producto.nombre);
        const url = `https://pcpartpicker.com/search/?q=${nombreBusqueda}`;
        
        try {
          await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
          
          // Extraer precio del primer resultado
          const precio = await page.evaluate(() => {
            const precioEl = document.querySelector('.product__price');
            if (precioEl) {
              const texto = precioEl.innerText;
              const match = texto.match(/\$?([0-9,]+\.?\d*)/);
              if (match) {
                return parseFloat(match[1].replace(',', ''));
              }
            }
            return null;
          });
          
          if (precio && precio > 0) {
            resultados.push({
              producto_id: producto.id,
              nombre_original: producto.nombre,
              precio: precio,
              fuente: 'PCPartPicker',
              fecha
            });
            console.log(`  ✅ Precio encontrado: $${precio}`);
          } else {
            console.log(`  ❌ Precio no encontrado`);
          }
          
        } catch (error) {
          console.log(`  ❌ Error buscando: ${error.message}`);
        }
        
        // Mostrar progreso cada 10 productos
        if ((i + 1) % 10 === 0) {
          console.log(`[Scraper] Progreso: ${i + 1}/${productos.length} - Encontrados: ${resultados.length}`);
        }
      }
      
      await browser.close();
      
    } catch (error) {
      console.error('[Scraper] Error general:', error);
      await browser.close();
    }
  }
  
  // Guardar resultados
  const outputDir = path.join(__dirname, '../output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const outputPath = path.join(outputDir, `precios-${fecha}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(resultados, null, 2));
  
  console.log(`[Scraper] Completado: ${resultados.length}/${productos.length} precios encontrados`);
  console.log(`[Scraper] Guardado en ${outputPath}`);
  
  return resultados;
}