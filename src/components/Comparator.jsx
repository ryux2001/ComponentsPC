import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ProductContext } from "../context/ProductContext";
import BusquedaComparator from "./BusquedaComparator";
import NotasProducts from "./NotasProducts";
import EspecificacionesDetalladas from "./EspecificacionesDetalladas";

function Comparator() {
  const {
    comparativa,
    setComparativa,
    eliminarP,
    limpiarC,
  } = useContext(ProductContext);
  
  // Estado para la paginación móvil
  const [paginaMovil, setPaginaMovil] = useState(0);
  const [productosVisibles, setProductosVisibles] = useState([]);
  const productosPorPaginaMovil = 2; // En móvil, 2 productos por página
  
  const tipoPermitido = comparativa.length > 0 ? comparativa[0].tipo : null;
  const [mostrarEspecificaciones, setMostrarEspecificaciones] = useState(true);

  // Actualizar productos visibles cuando cambie la página o la comparativa
  useEffect(() => {
    const inicio = paginaMovil * productosPorPaginaMovil;
    const fin = inicio + productosPorPaginaMovil;
    setProductosVisibles(comparativa.slice(inicio, fin));
  }, [paginaMovil, comparativa]);

  // Resetear página cuando cambia la comparativa
  useEffect(() => {
    setPaginaMovil(0);
  }, [comparativa.length]);

  const totalPaginasMovil = Math.ceil(comparativa.length / productosPorPaginaMovil);

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

  const irPaginaAnterior = () => {
    setPaginaMovil(prev => Math.max(0, prev - 1));
  };

  const irPaginaSiguiente = () => {
    setPaginaMovil(prev => Math.min(totalPaginasMovil - 1, prev + 1));
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
            {/* Desktop: Grid de 4 columnas */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {comparativa.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onRemove={eliminarP}
                />
              ))}
            </div>

            {/* Móvil: Grid de 2 columnas con paginación */}
            <div className="md:hidden">
              <div className="grid grid-cols-2 gap-1">
                {productosVisibles.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onRemove={eliminarP}
                  />
                ))}
              </div>

              {/* Controles de paginación móvil */}
              {comparativa.length > 2 && (
                <div className="flex items-center justify-between mt-6 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-3">
                  <button
                    onClick={irPaginaAnterior}
                    disabled={paginaMovil === 0}
                    className="px-4 py-2 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    ← Anterior
                  </button>
                  
                  <div className="flex gap-2">
                    {Array.from({ length: totalPaginasMovil }).map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setPaginaMovil(idx)}
                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                          paginaMovil === idx
                            ? "bg-[var(--primary)] text-white"
                            : "text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border)]"
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={irPaginaSiguiente}
                    disabled={paginaMovil === totalPaginasMovil - 1}
                    className="px-4 py-2 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    Siguiente →
                  </button>
                </div>
              )}

              {/* Indicador de página actual */}
              <p className="text-center text-xs text-[var(--text-muted)] mt-3">
                Mostrando {productosVisibles.length} de {comparativa.length} productos
                {totalPaginasMovil > 1 && ` (Página ${paginaMovil + 1} de ${totalPaginasMovil})`}
              </p>
            </div>

            {/* Especificaciones Detalladas - SOLO de los productos visibles en móvil */}
            {mostrarEspecificaciones && productosVisibles.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-bold text-[var(--text-main)] mb-4 md:hidden">
                  Especificaciones comparadas
                </h2>
                <EspecificacionesDetalladas productos={productosVisibles} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Componente ProductCard separado para reutilización
function ProductCard({ product, onRemove }) {
  return (
    <div className="relative flex flex-col bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden shadow-xl transition-transform hover:-translate-y-1 duration-300 h-full">
      {/* Encabezado Tarjeta - más compacto en móvil */}
      <div className="p-3 md:p-5 border-b border-[var(--border)] bg-gradient-to-b from-[var(--bg-card)] to-[#151f30]">
        <div className="inline-block px-1.5 md:px-2 py-0.5 rounded text-[8px] md:text-[10px] font-bold uppercase tracking-wider bg-[var(--bg-body)] text-[var(--text-muted)] mb-1 md:mb-2 border border-[var(--border)]">
          {product.tipo}
        </div>
        <h3 className="text-sm md:text-xl font-bold text-[var(--text-main)] leading-tight line-clamp-2 min-h-[2.5rem] md:min-h-[3.5rem]">
          {product.nombre}
        </h3>
        <div className="mt-1 md:mt-2 flex justify-between items-center">
          <span className="text-xs md:text-sm text-[var(--text-muted)]">{product.marca}</span>
          <span className="text-sm md:text-lg font-bold text-[var(--primary)]">
            ${product.precio}
          </span>
        </div>
      </div>

      {/* Cuerpo Notas - más compacto */}
      <div className="p-3 md:p-5 flex-grow">
        <NotasProducts product={product} />
      </div>

      {/* Footer Acción - más compacto */}
      <div className="p-3 md:p-4 pt-0 md:pt-0 mt-auto">
        <button
          onClick={() => onRemove(product.id)}
          className="w-full py-2 md:py-2.5 text-xs md:text-sm font-medium text-red-400 hover:text-white border border-red-900/30 hover:bg-red-600 rounded-lg transition-all"
        >
          Quitar
        </button>
      </div>
    </div>
  );
}

export default Comparator;