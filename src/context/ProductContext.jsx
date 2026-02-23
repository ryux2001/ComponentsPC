import { useState, useEffect, createContext } from "react";
import datosCpu from "../data/cpu.json";
import datosGpu from "../data/graficas.json";

export const ProductContext = createContext();

export function ProductContextProvider(props) {
  const [datos, setDatos] = useState([]);
  const [comparativa, setComparativa] = useState([]);

  //#region Utilidades de Clasificación y Máximos
  function getGeneracionGpu(gpu) {
    const name = gpu.nombre.toLowerCase();
    let match = name.match(/rtx\s*(\d{4})/);
    if (match) return parseInt(match[1]);
    match = name.match(/rx\s*(\d{4})/);
    if (match) return parseInt(match[1]);
    return 0;
  }

  function getGamaGpu(gpu) {
    const name = gpu.nombre.toLowerCase();
    let match = name.match(/rtx\s*\d(\d{3})/);
    if (!match) match = name.match(/rx\s*\d(\d{3})/);
    if (!match) match = name.match(/arc\s*[ab](\d{2,3})/);
    
    const seg = match ? parseInt(match[1][0]) : null;
    if (!seg) return "desconocida";
    if (seg >= 9) return "entusiasta";
    if (seg === 8) return "alta";
    if (seg === 7) return "media-alta";
    if (seg === 6) return "media";
    if (seg === 5) return "media-baja";
    return "baja";
  }

  const obtenerMaximosGlobales = (listaGpus) => {
    let maximos = { potencia: 0, eficiencia: 0, relacion: 0 };
    listaGpus.forEach((gpu) => {
      const r = gpu.benchmarks.fps1080pUltra * 0.3 + 
                gpu.benchmarks.fps1440pUltra * 0.4 + 
                gpu.benchmarks.fps4kUltra * 0.3;
      const e = r / gpu.parametrosBase.tdp;
      const rel = r / gpu.precio;

      if (r > maximos.potencia) maximos.potencia = r;
      if (e > maximos.eficiencia) maximos.eficiencia = e;
      if (rel > maximos.relacion) maximos.relacion = rel;
    });
    return maximos;
  };
  //#endregion

  const calcularNotasGpu = (gpu, listaGpus) => {
    const maxGlobal = obtenerMaximosGlobales(listaGpus);

    // 1. POTENCIA
    const rendimiento =
      gpu.benchmarks.fps1080pUltra * 0.3 +
      gpu.benchmarks.fps1440pUltra * 0.4 +
      gpu.benchmarks.fps4kUltra * 0.3;
    const potencia = (rendimiento / maxGlobal.potencia) * 10;

    // 2. EFICIENCIA
    const eficienciaReal = rendimiento / gpu.parametrosBase.tdp;
    const eficiencia = Math.min((eficienciaReal / maxGlobal.eficiencia) * 10, 10);

    // 3. TECNOLOGÍAS
    let tecnologias = 5;
    const gen = getGeneracionGpu(gpu);
    const marca = gpu.marca.toLowerCase();

    if (marca === "nvidia") {
      if (gen >= 5000) tecnologias = 10;
      else if (gen >= 4000) tecnologias = 8;
      else if (gen >= 3000) tecnologias = 6;
      else if (gen >= 2000) tecnologias = 4;
    } else if (marca === "amd") {
      if (gen >= 9000) tecnologias = 8;
      else if (gen >= 7000) tecnologias = 6.5;
      else if (gen >= 6000) tecnologias = 4;
      else if (gen >= 5000) tecnologias = 3;
    } else if (marca === "intel") {
      tecnologias = 5;
    }

    // 4. CALIDAD / PRECIO
    const fpsPerDollar = rendimiento / gpu.precio;
    const nombre = gpu.nombre.toLowerCase();
    const marca2 = gpu.marca.toLowerCase();

    let factorMadurez = 1;
    if (marca2 === "intel") {
      factorMadurez = nombre.includes("b5") || nombre.includes("b7") ? 0.88 : 0.82;
    }
    const relacionAjustada = fpsPerDollar * factorMadurez;

    let notaCP;
    if (relacionAjustada < 0.12) notaCP = 3;
    else if (relacionAjustada < 0.18) notaCP = 3 + ((relacionAjustada - 0.12) / 0.06) * 2.5;
    else if (relacionAjustada < 0.24) notaCP = 5.5 + ((relacionAjustada - 0.18) / 0.06) * 2.5;
    else if (relacionAjustada < 0.30) notaCP = 8 + ((relacionAjustada - 0.24) / 0.06) * 1;
    else notaCP = Math.min(9 + (relacionAjustada - 0.30) * 5, 10);

    return {
      nombre: gpu.nombre,
      potencia: potencia.toFixed(1),
      eficiencia: eficiencia.toFixed(1),
      tecnologias: tecnologias.toFixed(1),
      calidadPrecio: Math.min(notaCP, 10).toFixed(1),
    };
  };

  const calcularNotasCpu = (cpu) => {
    return {
      nombre: cpu.nombre,
      potencia: "7.5",
      eficiencia: "8.0",
      tecnologias: "9.0",
      calidadPrecio: "8.5"
    };
  };

  const eliminarP = (id) => setComparativa((prev) => prev.filter((p) => p.id !== id));
  const limpiarC = () => setComparativa([]);

  // Cargar productos iniciales
  useEffect(() => {
    console.log("[ProductContext] Cargando productos...");
    console.log("[ProductContext] CPUs:", datosCpu?.length);
    console.log("[ProductContext] GPUs:", datosGpu?.length);
    
    const datosCombinados = [...datosCpu, ...datosGpu].sort(
      (a, b) => (b.popularidad || 0) - (a.popularidad || 0)
    );
    
    console.log("[ProductContext] Total productos:", datosCombinados.length);
    setDatos(datosCombinados);
  }, []);

  const dataGpuFiltrada = datos.filter((p) => p.tipo === "gpu");
  const dataCpuFiltrada = datos.filter((p) => p.tipo === "cpu");

  return (
    <ProductContext.Provider
      value={{
        calcularNotasGpu,
        calcularNotasCpu,
        datos,
        dataGpu: dataGpuFiltrada,
        dataCpu: dataCpuFiltrada,
        comparativa,
        limpiarC,
        eliminarP,
        setComparativa,
      }}
    >
      {props.children}
    </ProductContext.Provider>
  );
}