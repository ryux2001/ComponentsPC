// server/scripts/buscar-todos.js
import { scrapePrecios } from '../scrapers/precios.js';
import { guardarPreciosEnSupabase } from '../lib/guardarPrecios.js';
import { cargarTodosLosProductos } from '../lib/productosABuscar.js';

async function main() {
  console.log('=== BUSCADOR DE PRECIOS PARA TODOS LOS PRODUCTOS ===');
  
  const productos = cargarTodosLosProductos();
  console.log(`Total productos a buscar: ${productos.length}`);
  console.log(`CPUs: ${productos.filter(p => p.tipo === 'cpu').length}`);
  console.log(`GPUs: ${productos.filter(p => p.tipo === 'gpu').length}`);
  
  const args = process.argv.slice(2);
  const modo = args[0] || 'demo'; // 'demo' o 'real'
  const guardar = args.includes('--save');
  
  console.log(`Modo: ${modo}`);
  console.log(`Guardar en Supabase: ${guardar ? 'SÍ' : 'NO'}`);
  
  try {
    const resultados = await scrapePrecios(modo, { todos: true });
    
    if (guardar && resultados.length > 0) {
      console.log('Guardando en Supabase...');
      const resultado = await guardarPreciosEnSupabase(resultados);
      console.log('Resultado:', resultado);
    }
    
    // Estadísticas
    const conPrecio = resultados.filter(r => r.precio > 0).length;
    console.log(`\n=== RESUMEN ===`);
    console.log(`Total productos: ${productos.length}`);
    console.log(`Con precio encontrado: ${conPrecio}`);
    console.log(`Sin precio: ${productos.length - conPrecio}`);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

main();