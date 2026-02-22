import { useContext } from "react";
import { FiltrosContext } from "../context/FiltrosContext";

function Pagination({ currentPage, totalPages, onPageChange }) {
  const { productosFiltrados } = useContext(FiltrosContext);

  // Si hay menos de 10 productos, no mostrar paginación
  if (productosFiltrados.length <= 10) {
    return null;
  }

  // Generar números de página a mostrar
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
      {/* Botón anterior */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1.5 text-sm font-medium text-[var(--text-muted)] bg-[var(--bg-card)] border border-[var(--border)] rounded-lg hover:bg-[var(--bg-hover)] hover:text-[var(--text-main)] disabled:opacity-50 disabled:pointer-events-none transition-colors"
        aria-label="Página anterior"
      >
        &laquo; Anterior
      </button>

      {/* Primera página y puntos suspensivos */}
      {currentPage > 3 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-3 py-1.5 text-sm font-medium text-[var(--text-muted)] bg-[var(--bg-card)] border border-[var(--border)] rounded-lg hover:bg-[var(--bg-hover)] hover:text-[var(--text-main)] transition-colors"
          >
            1
          </button>
          {currentPage > 4 && (
            <span className="px-2 text-[var(--text-muted)]">...</span>
          )}
        </>
      )}

      {/* Números centrales */}
      {getPageNumbers().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
            currentPage === page
              ? "bg-[var(--primary)] text-white shadow-md"
              : "text-[var(--text-muted)] bg-[var(--bg-card)] border border-[var(--border)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-main)]"
          }`}
          aria-label={`Página ${page}`}
          aria-current={currentPage === page ? "page" : null}
        >
          {page}
        </button>
      ))}

      {/* Última página y puntos suspensivos */}
      {currentPage < totalPages - 2 && (
        <>
          {currentPage < totalPages - 3 && (
            <span className="px-2 text-[var(--text-muted)]">...</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-3 py-1.5 text-sm font-medium text-[var(--text-muted)] bg-[var(--bg-card)] border border-[var(--border)] rounded-lg hover:bg-[var(--bg-hover)] hover:text-[var(--text-main)] transition-colors"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Botón siguiente */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1.5 text-sm font-medium text-[var(--text-muted)] bg-[var(--bg-card)] border border-[var(--border)] rounded-lg hover:bg-[var(--bg-hover)] hover:text-[var(--text-main)] disabled:opacity-50 disabled:pointer-events-none transition-colors"
        aria-label="Página siguiente"
      >
        Siguiente &raquo;
      </button>

      {/* Información de página */}
      <span className="ml-4 text-sm text-[var(--text-muted)]">
        Página {currentPage} de {totalPages}
      </span>
    </div>
  );
}

export default Pagination;