import { useState } from "react";

// Mapeo de nombres de especificaciones para mostrar
const labelsEspecificaciones = {
  // Comunes
  marca: "Marca",
  tipo: "Tipo",
  fechaDeLanzamiento: "Fecha de lanzamiento",
  precio: "Precio actual",
  precioRecomendado: "Precio recomendado",
  
  // CPU
  nucleos: "Núcleos",
  hilos: "Hilos",
  frecuenciaBase: "Frecuencia base",
  frecuenciaMaxima: "Frecuencia máxima",
  cache: "Caché (MB)",
  tdp: "TDP (W)",
  tieneGraficosIntegrados: "Gráficos integrados",
  socket: "Socket",
  generacion: "Generación",
  tipoRam: "Tipo de RAM",
  
  // GPU
  vram: "VRAM (GB)",
  bus: "Bus de memoria",
  tipoVram: "Tipo VRAM",
  nucleosCuda: "Núcleos CUDA",
  tensorCores: "Tensor Cores",
  rtCores: "RT Cores",
  xeCores: "XE Cores",
  computeUnits: "Compute Units",
  longitud: "Longitud (mm)",
  
  // Benchmarks
  cinebenchR23Single: "Cinebench R23 (Single)",
  cinebenchR23Multi: "Cinebench R23 (Multi)",
  passmarkSingle: "Passmark (Single)",
  passmarkMulti: "Passmark (Multi)",
  gaming1080p: "Gaming 1080p",
  timeSpy: "3DMark Time Spy",
  fireStrike: "3DMark Fire Strike",
  portRoyal: "3DMark Port Royal",
  fps1080pUltra: "FPS 1080p Ultra",
  fps1440pUltra: "FPS 1440p Ultra",
  fps4kUltra: "FPS 4K Ultra",
};

function EspecificacionesDetalladas({ productos }) {
  const [categoriaActiva, setCategoriaActiva] = useState("basicas");
  
  if (!productos || productos.length === 0) return null;
  
  // Determinar el tipo de producto (todos deberían ser del mismo tipo en comparativa)
  const tipoProducto = productos[0]?.tipo;
  
  // Categorías de especificaciones
  const categorias = {
    basicas: "Básicas",
    rendimiento: "Rendimiento",
    tecnicas: "Técnicas"
  };
  
  // Filtrar qué especificaciones mostrar según el tipo
  const getEspecificacionesPorCategoria = () => {
    const basicas = ["marca", "fechaDeLanzamiento", "precio", "precioRecomendado"];
    const tecnicasCPU = ["nucleos", "hilos", "frecuenciaBase", "frecuenciaMaxima", "cache", "tdp", "socket", "generacion", "tipoRam", "tieneGraficosIntegrados"];
    const tecnicasGPU = ["vram", "bus", "tipoVram", "nucleosCuda", "tensorCores", "rtCores", "xeCores", "computeUnits", "longitud", "tdp"];
    const rendimientoCPU = ["cinebenchR23Single", "cinebenchR23Multi", "passmarkSingle", "passmarkMulti", "gaming1080p"];
    const rendimientoGPU = ["timeSpy", "fireStrike", "portRoyal", "fps1080pUltra", "fps1440pUltra", "fps4kUltra"];
    
    let tecnicas = [];
    let rendimiento = [];
    
    if (tipoProducto === "cpu") {
      tecnicas = tecnicasCPU;
      rendimiento = rendimientoCPU;
    } else if (tipoProducto === "gpu") {
      tecnicas = tecnicasGPU;
      rendimiento = rendimientoGPU;
    }
    
    return {
      basicas,
      tecnicas,
      rendimiento
    };
  };
  
  const especificaciones = getEspecificacionesPorCategoria();
  
  // Función para formatear el valor según el tipo
  const formatearValor = (producto, key) => {
    const valor = producto.parametrosBase?.[key] ?? producto.benchmarks?.[key] ?? producto[key];
    
    if (valor === undefined || valor === null) return "—";
    
    // Valores booleanos
    if (typeof valor === "boolean") {
      return valor ? "✅ Sí" : "❌ No";
    }
    
    // Arrays
    if (Array.isArray(valor)) {
      return valor.join(", ");
    }
    
    // Números con formato
    if (typeof valor === "number") {
      // Precios
      if (key.includes("precio")) {
        return `$${valor.toFixed(2)}`;
      }
      // Porcentajes o valores pequeños
      if (valor < 1 && key.includes("frecuencia")) {
        return `${valor} GHz`;
      }
      // Frecuencias
      if (key.includes("frecuencia")) {
        return `${valor} GHz`;
      }
      // TDP, VRAM, etc.
      return valor;
    }
    
    return valor;
  };
  
  return (
    <div className="mt-12 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
      {/* Header con pestañas */}
      <div className="border-b border-[var(--border)] bg-[var(--bg-body)]/50">
        <div className="flex">
          {Object.entries(categorias).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setCategoriaActiva(key)}
              className={`px-6 py-4 text-sm font-medium transition-colors relative ${
                categoriaActiva === key
                  ? "text-[var(--primary)] border-b-2 border-[var(--primary)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Tabla de especificaciones */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--bg-body)]/30">
              <th className="text-left p-4 text-sm font-medium text-[var(--text-muted)] w-48">
                Especificación
              </th>
              {productos.map((producto) => (
                <th
                  key={producto.id}
                  className="text-left p-4 text-sm font-medium text-[var(--text-main)] min-w-[200px]"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={`/logos/${producto.marca}.png`}
                      alt={producto.marca}
                      className="w-5 h-5 object-contain"
                      onError={(e) => e.target.style.display = "none"}
                    />
                    <span className="line-clamp-2">{producto.nombre}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {especificaciones[categoriaActiva].map((key) => (
              <tr key={key} className="border-b border-[var(--border)] hover:bg-[var(--bg-body)]/30 transition-colors">
                <td className="p-4 text-sm text-[var(--text-muted)] font-medium">
                  {labelsEspecificaciones[key] || key}
                </td>
                {productos.map((producto) => (
                  <td
                    key={`${producto.id}-${key}`}
                    className="p-4 text-sm text-[var(--text-main)]"
                  >
                    <div className="flex items-center justify-between">
                      <span>{formatearValor(producto, key)}</span>
                      {/* Indicador de "mejor valor" */}
                      {esMejorValor(producto, key, productos) && (
                        <span className="ml-2 text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                          Mejor
                        </span>
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Footer con nota */}
      <div className="p-4 bg-[var(--bg-body)]/30 text-xs text-[var(--text-muted)] border-t border-[var(--border)]">
        <p>⚡ Los valores marcados en verde indican el mejor rendimiento en esa categoría.</p>
      </div>
    </div>
  );
}

// Función auxiliar para determinar si un valor es el mejor en su categoría
function esMejorValor(producto, key, productos) {
  const valorActual = producto.parametrosBase?.[key] ?? producto.benchmarks?.[key] ?? producto[key];
  
  // Solo comparar números
  if (typeof valorActual !== "number") return false;
  
  // Determinar si mayor es mejor o menor es mejor
  const mayorEsMejor = [
    "frecuenciaMaxima", "cache", "nucleos", "hilos", "vram", "nucleosCuda",
    "tensorCores", "rtCores", "xeCores", "cinebenchR23Single", "cinebenchR23Multi",
    "passmarkSingle", "passmarkMulti", "gaming1080p", "timeSpy", "fireStrike",
    "portRoyal", "fps1080pUltra", "fps1440pUltra", "fps4kUltra"
  ].includes(key);
  
  const menorEsMejor = ["precio", "tdp", "longitud"].includes(key);
  
  if (!mayorEsMejor && !menorEsMejor) return false;
  
  const valores = productos.map(p => p.parametrosBase?.[key] ?? p.benchmarks?.[key] ?? p[key]);
  const valoresNumericos = valores.filter(v => typeof v === "number");
  
  if (valoresNumericos.length === 0) return false;
  
  if (mayorEsMejor) {
    return valorActual === Math.max(...valoresNumericos);
  } else if (menorEsMejor) {
    return valorActual === Math.min(...valoresNumericos);
  }
  
  return false;
}

export default EspecificacionesDetalladas;