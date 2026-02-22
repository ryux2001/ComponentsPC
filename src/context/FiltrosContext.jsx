import { useState, createContext, useContext, useEffect } from "react";
//Para poder traer la data
import { ProductContext } from "../context/ProductContext";
import { useSearchParams } from "react-router-dom"; // Importamos para leer parámetros de URL

export const FiltrosContext = createContext();

export function FiltrosContextProvider(props) {
  const { datos } = useContext(ProductContext);
  const [searchParams, setSearchParams] = useSearchParams(); // Para leer y escribir parámetros de URL
  // Leer el parámetro de búsqueda de la URL si existe
  const busquedaInicial = searchParams.get("busqueda") || "";

  // Estado para almacenar los filtros activos
  const [filtros, setFiltros] = useState({
    texto: busquedaInicial,
    tipo: "todos",
    marca: "todas",
    precioMin: 0,
    precioMax: 10000,
    // Filtros específicos por tipo
    socket: "todos",
    pcie: "todos",
    vram: 0,
  });

  // Estado para los productos filtrados
  const [productosFiltrados, setProductosFiltrados] = useState([]);

  // Función para actualizar filtros y también actualizar la URL si es búsqueda
  const actualizarFiltros = (nuevosFiltros) => {
    setFiltros(nuevosFiltros);

    // Si estamos actualizando el texto de búsqueda, actualizar también la URL
    if (nuevosFiltros.texto !== filtros.texto) {
      if (nuevosFiltros.texto) {
        searchParams.set("busqueda", nuevosFiltros.texto);
      } else {
        searchParams.delete("busqueda");
      }
      setSearchParams(searchParams);
    }
  };

  // Función para aplicar todos los filtros
  const aplicarFiltros = () => {
    let resultado = [...datos];

    // 1. Filtrar por texto (nombre)
    if (filtros.texto) {
      resultado = resultado.filter((producto) =>
        producto.nombre.toLowerCase().includes(filtros.texto.toLowerCase()),
      );
    }

    // 2. Filtrar por tipo
    if (filtros.tipo !== "todos") {
      resultado = resultado.filter(
        (producto) => producto.tipo === filtros.tipo,
      );
    }

    // 3. Filtrar por marca
    if (filtros.marca !== "todas") {
      resultado = resultado.filter(
        (producto) => producto.marca === filtros.marca,
      );
    }

    // 4. Filtrar por precio
    resultado = resultado.filter(
      (producto) =>
        producto.precio >= filtros.precioMin &&
        producto.precio <= filtros.precioMax,
    );

    // 5. Filtrar por socket (solo CPUs)
    if (filtros.tipo === "cpu" && filtros.socket !== "todos") {
      resultado = resultado.filter((producto) => {
        // Acceder al socket desde parametrosBase
        const socket = producto.parametrosBase?.socket || "";
        return socket.toLowerCase().includes(filtros.socket.toLowerCase());
      });
    }

    // 6. Filtrar por VRAM (solo GPUs)
    if (filtros.tipo === "gpu" && filtros.vram > 0) {
  resultado = resultado.filter((producto) => {
    const vram = producto.parametrosBase?.vram || 0;
    return vram >= filtros.vram;
  });
}

    console.log("[FiltrosContext] datos recibidos:", datos?.length);
    console.log("[FiltrosContext] filtros:", filtros);
    console.log("[FiltrosContext] resultado filtrado:", resultado?.length, resultado);
    setProductosFiltrados(resultado);
  };

  // Función para resetear todos los filtros
  const resetearFiltros = () => {
    setFiltros({
      texto: "",
      tipo: "todos",
      marca: "todas",
      precioMin: 0,
      precioMax: 10000,
      socket: "todos",
      pcie: "todos",
      vram: 0,
    });

    // setFiltros(nuevosFiltros)
    // También limpiar la URL
    searchParams.delete("busqueda");
    setSearchParams(searchParams);
  };

  // Aplicar filtros cada vez que cambien los filtros o los datos
  useEffect(() => {
    aplicarFiltros();
  }, [filtros, datos]);

  return (
    <FiltrosContext.Provider
      value={{
        filtros,
        actualizarFiltros,
        productosFiltrados,
        resetearFiltros,
      }}
    >
      {props.children}
    </FiltrosContext.Provider>
  );
}
