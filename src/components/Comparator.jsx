import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { ProductContext } from "../context/ProductContext";
import BusquedaComparator from "./BusquedaComparator";
import NotasProducts from "./NotasProducts";
import EspecificacionesDetalladas from "./EspecificacionesDetalladas"; // <-- NUEVO

function Comparator() {
  const {
    comparativa,
    setComparativa,
    eliminarP,
    limpiarC,
  } = useContext(ProductContext);
  const [startIndex, setStartIndex] = useState(0);
  const [mostrarEspecificaciones, setMostrarEspecificaciones] = useState(true); // <-- NUEVO
  const productosPorPagina = 4;

  const tipoPermitido = comparativa.length > 0 ? comparativa[0].tipo : null;

  const agregarProducto = (producto) => {
    const yaExiste = comparativa.find((p) => p.id === producto.id);
    if (yaExiste) {
      alert("Este producto ya está en la comparativa");
      return;
    }
    if (comparativa.length >= 4) {
      alert("No puedes comparar más de 4 productos");
      return;
    }
    if (comparativa.length > 0 && producto.tipo !== tipoPermitido) {
      alert(`Solo puedes comparar productos del mismo tipo.`);
      return;
    }
    setComparativa([...comparativa, producto]);
  };

  const handleNext = () => {
    if (startIndex + productosPorPagina < comparativa.length) {
      setStartIndex(startIndex + productosPorPagina);
    }
  };
  const handlePrev = () => {
    if (startIndex - productosPorPagina >= 0) {
      setStartIndex(startIndex - productosPorPagina);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--text-main)]">
            Comparador de Hardware
          </h1>
          <p className="text-[var(--text-muted)] mt-1">
            Enfrenta componentes y descubre el mejor rendimiento/precio.
          </p>
        </div>
        
        {comparativa.length > 0 && (
          <div className="flex gap-3">
            {/* NUEVO: Botón para ocultar/mostrar especificaciones */}
            <button
              onClick={() => setMostrarEspecificaciones(!mostrarEspecificaciones)}
              className="px-4 py-2 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border)] rounded-lg hover:bg-[var(--bg-card)] transition-colors"
            >
              {mostrarEspecificaciones ? "Ocultar" : "Mostrar"} especificaciones
            </button>
            <button
              onClick={limpiarC}
              className="px-4 py-2 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border)] rounded-lg hover:bg-[var(--bg-card)] transition-colors"
            >
              Limpiar Todo
            </button>
            <Link
              to="/"
              className="px-4 py-2 text-sm font-medium bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-hover)] transition-colors shadow-lg shadow-blue-500/20"
            >
              + Agregar más
            </Link>
          </div>
        )}
      </div>

      {/* Barra de Búsqueda */}
      <div className="mb-10">
        {comparativa.length < 4 ? (
          <div className="w-full max-w-2xl mx-auto">
            <BusquedaComparator
              tipoPermitido={tipoPermitido}
              onProductoSeleccionado={agregarProducto}
            />
            <div className="text-xs text-center mt-3 text-[var(--text-muted)]">
              {tipoPermitido
                ? `Modo activo: Comparando ${tipoPermitido.toUpperCase()}`
                : "Empieza buscando una CPU o GPU..."}
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-lg bg-[var(--bg-card)] border border-yellow-600/30 text-yellow-500 text-center max-w-xl mx-auto">
            Has alcanzado el límite de 4 productos. Elimina uno para añadir otro.
          </div>
        )}
      </div>

      {/* Grid de Productos */}
      <div className="mt-8">
        {comparativa.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-[var(--border)] rounded-2xl opacity-50">
            <p className="text-xl text-[var(--text-muted)]">Tu comparativa está vacía</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {comparativa.map((p, i) => {
                const isVisibleEnMovil = i >= startIndex && i < startIndex + productosPorPagina;
                
                return (
                  <div
                    key={p.id}
                    className={`relative flex flex-col bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden shadow-xl transition-transform hover:-translate-y-1 duration-300 ${
                      isVisibleEnMovil ? "block" : "hidden lg:block"
                    }`}
                  >
                    {/* Encabezado Tarjeta */}
                    <div className="p-5 border-b border-[var(--border)] bg-gradient-to-b from-[var(--bg-card)] to-[#151f30]">
                      <div className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[var(--bg-body)] text-[var(--text-muted)] mb-2 border border-[var(--border)]">
                        {p.tipo}
                      </div>
                      <h3 className="text-xl font-bold text-[var(--text-main)] leading-tight h-14 overflow-hidden line-clamp-2">
                        {p.nombre}
                      </h3>
                      <div className="mt-2 flex justify-between items-end">
                         <span className="text-sm text-[var(--text-muted)]">{p.marca}</span>
                         <span className="text-lg font-bold text-[var(--primary)]">
                           ${p.precio}
                         </span>
                      </div>
                    </div>

                    {/* Cuerpo Notas */}
                    <div className="p-5 flex-grow">
                      <NotasProducts product={p} />
                    </div>

                    {/* Footer Acción */}
                    <div className="p-4 pt-0 mt-auto">
                      <button
                        onClick={() => eliminarP(p.id)}
                        className="w-full py-2.5 text-sm font-medium text-red-400 hover:text-white border border-red-900/30 hover:bg-red-600 rounded-lg transition-all"
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* NUEVO: Especificaciones Detalladas */}
            {mostrarEspecificaciones && comparativa.length > 0 && (
              <EspecificacionesDetalladas productos={comparativa} />
            )}

            {/* Paginación para móvil (si es necesaria) */}
            {comparativa.length > productosPorPagina && (
              <div className="flex justify-center gap-4 mt-8 lg:hidden">
                <button
                  onClick={handlePrev}
                  disabled={startIndex === 0}
                  className="px-4 py-2 text-sm font-medium border border-[var(--border)] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--bg-card)] transition-colors"
                >
                  ← Anterior
                </button>
                <button
                  onClick={handleNext}
                  disabled={startIndex + productosPorPagina >= comparativa.length}
                  className="px-4 py-2 text-sm font-medium border border-[var(--border)] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--bg-card)] transition-colors"
                >
                  Siguiente →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Comparator;