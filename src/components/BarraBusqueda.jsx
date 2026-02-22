import { useState, useEffect, useContext, useRef } from "react";
import { ProductContext } from "../context/ProductContext";

function BarraBusqueda({ lugarActual, onSearch }) {
  const { datos } = useContext(ProductContext);
  const [termino, setTermino] = useState("");
  const [sugerencias, setSugerencias] = useState([]);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const wrapperRef = useRef(null);

  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setMostrarSugerencias(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Actualizar sugerencias mientras escribe
  useEffect(() => {
    if (termino.trim().length < 2) {
      setSugerencias([]);
      return;
    }

    const filtradas = datos
      .filter(producto =>
        producto.nombre.toLowerCase().includes(termino.toLowerCase())
      )
      .slice(0, 8); // máximo 8 sugerencias

    setSugerencias(filtradas);
  }, [termino, datos]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setTermino(value);
    setMostrarSugerencias(true);
    onSearch(value); // notificar al padre
  };

  const handleSugerenciaClick = (producto) => {
    setTermino(producto.nombre);
    setMostrarSugerencias(false);
    onSearch(producto.nombre); // opcional: buscar por ese nombre exacto
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div className="relative group">
        {/* Icono de búsqueda */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-[var(--text-muted)] group-focus-within:text-[var(--primary)] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <input
          type="text"
          value={termino}
          onChange={handleInputChange}
          className="w-full pl-10 pr-4 py-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent shadow-sm transition-all"
          placeholder={lugarActual === "lista" 
            ? "Buscar por nombre (Ej: RTX 4060, Ryzen 5...)" 
            : "Buscar productos..."}
        />
      </div>

      {/* Sugerencias */}
      {mostrarSugerencias && sugerencias.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <ul className="max-h-80 overflow-y-auto divide-y divide-[var(--border)] custom-scrollbar">
            {sugerencias.map((producto) => (
              <li
                key={producto.id}
                onClick={() => handleSugerenciaClick(producto)}
                className="p-3 hover:bg-[var(--bg-hover)] cursor-pointer flex justify-between items-center transition-colors group"
              >
                <div className="flex flex-col">
                  <span className="text-[var(--text-main)] font-medium group-hover:text-white">
                    {producto.nombre}
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">
                    {producto.marca} • {producto.tipo.toUpperCase()} • ${producto.precio}
                  </span>
                </div>
                <span className="text-[var(--primary)] text-sm">↩</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default BarraBusqueda;