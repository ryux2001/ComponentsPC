// server/lib/mapeoProductos.js
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Cargar productos locales
let cpus = [];
let gpus = [];

try {
  const cpuPath = path.join(__dirname, '../../src/data/cpu.json');
  const gpuPath = path.join(__dirname, '../../src/data/graficas.json');
  
  cpus = JSON.parse(readFileSync(cpuPath, 'utf-8'));
  gpus = JSON.parse(readFileSync(gpuPath, 'utf-8'));
  console.log(`[Mapeo] Cargados ${cpus.length} CPUs y ${gpus.length} GPUs`);
} catch (error) {
  console.error('[Mapeo] Error cargando productos:', error.message);
}

const productos = [...cpus, ...gpus];

/**
 * Normaliza un nombre para comparación
 */
function normalizarNombre(nombre) {
  if (!nombre) return '';
  
  return nombre
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // quitar tildes
    .replace(/[^a-z0-9]/g, '') // quitar caracteres especiales
    .replace(/(geforce|radeon|arc|graphics|series|amd|nvidia|intel|corp|processor)/g, '')
    .replace(/(rtx|gtx|rx|ryzen|core|i[3579]|fx|athlon|threadripper|xeon)/g, '')
    .trim();
}

/**
 * Busca el ID de un producto por su nombre
 */
export function encontrarProductoId(nombreScrapeado) {
  if (!nombreScrapeado) return null;
  
  const nombreNormalizado = normalizarNombre(nombreScrapeado);
  
  // Buscar coincidencia exacta o parcial
  for (const producto of productos) {
    const productoNormalizado = normalizarNombre(producto.nombre);
    
    // Coincidencia exacta
    if (productoNormalizado === nombreNormalizado) {
      return producto.id;
    }
    
    // Coincidencia parcial (uno contiene al otro)
    if (productoNormalizado.includes(nombreNormalizado) || 
        nombreNormalizado.includes(productoNormalizado)) {
      return producto.id;
    }
    
    // Casos especiales para GPUs
    if (producto.tipo === 'gpu') {
      // Extraer números del modelo (ej: "3060" de "RTX 3060")
      const numerosProducto = producto.nombre.match(/\d{4}/)?.[0];
      const numerosScrapeado = nombreScrapeado.match(/\d{4}/)?.[0];
      
      if (numerosProducto && numerosScrapeado && numerosProducto === numerosScrapeado) {
        // Verificar también la marca
        if (producto.marca && nombreScrapeado.toLowerCase().includes(producto.marca.toLowerCase())) {
          return producto.id;
        }
      }
    }
    
    // Casos especiales para CPUs
    if (producto.tipo === 'cpu') {
      // Buscar por modelo (ej: "12400F" en "i5-12400F")
      const modeloProducto = producto.nombre.match(/[-\s](\d+[A-Z]*)/)?.[1];
      if (modeloProducto && nombreScrapeado.includes(modeloProducto)) {
        return producto.id;
      }
    }
  }
  
  return null;
}

// Para debugging
export function probarMapeo(nombre) {
  const id = encontrarProductoId(nombre);
  console.log(`"${nombre}" -> ${id || '❌ No encontrado'}`);
  return id;
}