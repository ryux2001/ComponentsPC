// server/lib/productosABuscar.js
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Cargar todos los productos
export function cargarTodosLosProductos() {
  try {
    const cpuPath = path.join(__dirname, '../../src/data/cpu.json');
    const gpuPath = path.join(__dirname, '../../src/data/graficas.json');
    
    const cpus = JSON.parse(readFileSync(cpuPath, 'utf-8'));
    const gpus = JSON.parse(readFileSync(gpuPath, 'utf-8'));
    
    const todos = [...cpus, ...gpus];
    console.log(`[Productos] Cargados ${todos.length} productos para buscar precios`);
    
    return todos;
  } catch (error) {
    console.error('[Productos] Error cargando productos:', error);
    return [];
  }
}

// Versión simplificada para búsqueda
export function getNombresBusqueda() {
  const productos = cargarTodosLosProductos();
  
  return productos.map(p => ({
    id: p.id,
    nombre: p.nombre,
    nombreBusqueda: generarNombreBusqueda(p.nombre),
    tipo: p.tipo,
    marca: p.marca
  }));
}

function generarNombreBusqueda(nombre) {
  // Crear versiones del nombre para búsqueda
  const nombreLower = nombre.toLowerCase();
  
  // Para GPUs
  if (nombreLower.includes('rtx')) {
    const match = nombreLower.match(/rtx (\d+)/);
    if (match) return `rtx ${match[1]}`;
  }
  if (nombreLower.includes('rx')) {
    const match = nombreLower.match(/rx (\d+)/);
    if (match) return `rx ${match[1]}`;
  }
  
  // Para CPUs
  if (nombreLower.includes('ryzen')) {
    const match = nombreLower.match(/ryzen (\d+)/);
    if (match) return `ryzen ${match[1]}`;
  }
  if (nombreLower.includes('i5') || nombreLower.includes('i7') || nombreLower.includes('i9')) {
    const match = nombreLower.match(/(i[579]-\d+)/);
    if (match) return match[1];
  }
  
  return nombreLower;
}