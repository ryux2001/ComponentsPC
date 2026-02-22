import { useState, useEffect, useContext, useRef } from "react";
import { ProductContext } from "../context/ProductContext";

function BusquedaComparador({ tipoPermitido = null, onProductoSeleccionado }) {
  const { datos } = useContext(ProductContext);
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [resultados, setResultados] = useState([]);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const wrapperRef = useRef(null);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setMostrarResultados(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (terminoBusqueda.trim().length < 2) {
      setResultados([]);
      return;
    }

    let productosFiltrados = [...datos];

    if (tipoPermitido) {
      productosFiltrados = productosFiltrados.filter(
        (producto) => producto.tipo === tipoPermitido
      );
    }

    productosFiltrados = productosFiltrados.filter((producto) =>
      producto.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase())
    );

    setResultados(productosFiltrados.slice(0, 10));
  }, [terminoBusqueda, datos, tipoPermitido]);

  const manejarSeleccion = (producto) => {
    onProductoSeleccionado(producto);
    setTerminoBusqueda("");
    setResultados([]);
    setMostrarResultados(false);
  };

  const manejarInputChange = (e) => {
    setTerminoBusqueda(e.target.value);
    setMostrarResultados(true);
  };

  return (
    <div className="relative w-full max-w" ref={wrapperRef}>
      <div className="relative group">
        {/* Icono de búsqueda */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="w-5 h-5 text-[var(--text-muted)] group-focus-within:text-[var(--primary)] transition-colors"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <input
          type="text"
          value={terminoBusqueda}
          onChange={manejarInputChange}
          className="w-full pl-10 pr-4 py-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent shadow-sm transition-all"
          placeholder={
            tipoPermitido
              ? `Buscar ${tipoPermitido.toUpperCase()}...`
              : "Buscar producto (ej: RTX 4060, Ryzen 5...)"
          }
        />
      </div>

      {/* Dropdown de resultados */}
      {mostrarResultados && (resultados.length > 0 || terminoBusqueda.length >= 2) && (
        <div className="absolute z-50 w-full mt-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {resultados.length > 0 ? (
            <ul className="max-h-80 overflow-y-auto divide-y divide-[var(--border)] custom-scrollbar">
              {resultados.map((producto) => (
                <li
                  key={producto.id}
                  onClick={() => manejarSeleccion(producto)}
                  className="p-3 hover:bg-[var(--bg-hover)] cursor-pointer flex justify-between items-center transition-colors group"
                >
                  <div className="flex flex-col">
                    <span className="text-[var(--text-main)] font-medium group-hover:text-white">
                      {producto.nombre}
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">
                      {producto.marca} • ${producto.precio}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      manejarSeleccion(producto);
                    }}
                    className="ml-3 p-1.5 rounded-full bg-[var(--bg-body)] text-[var(--primary)] border border-[var(--border)] hover:bg-[var(--primary)] hover:text-white transition-all"
                    title="Añadir a comparativa"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-[var(--text-muted)]">
              No se encontraron productos
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default BusquedaComparador;