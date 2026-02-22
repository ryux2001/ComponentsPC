import { Link } from "react-router-dom";
import { ProductContext } from "../context/ProductContext";
import { FiltrosContext } from "../context/FiltrosContext";
import { SortContext } from "../context/SortContext";
import { useContext, useState, useEffect } from "react";
import Filtros from "./Filtros";
import BarraBusqueda from "./BarraBusqueda";
import Pagination from "./Pagination";
import ProductCard from "./ProductCard";
import { useAuth } from "../context/AuthContext";

function ListProducts() {
  const { comparativa, setComparativa } = useContext(ProductContext);
  const { productosFiltrados, actualizarFiltros } = useContext(FiltrosContext);
  const { sortMethod, changeSortMethod, sortProducts } =
    useContext(SortContext);
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-body)] flex items-center justify-center">
        <p className="text-[var(--text-muted)] text-lg">Cargando...</p>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error al cerrar sesion", error);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const productosOrdenados = sortProducts(productosFiltrados, sortMethod);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = productosOrdenados.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(productosOrdenados.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [productosFiltrados, sortMethod]);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    changeSortMethod(e.target.value);
  };

  const manejarBusquedaLocal = (termino) => {
    actualizarFiltros((prev) => ({
      ...prev,
      texto: termino,
    }));
  };

  const agregarComparativa = (p) => {
    const yaExiste = comparativa.find((e) => e.id === p.id);
    const diferenteTipo = comparativa.find((e) => e.tipo !== p.tipo);
    if (yaExiste) {
      alert("Error, este producto ya esta siendo comparado");
      return;
    }
    if (diferenteTipo) {
      alert("No puedes comparar componentes distintos");
      return;
    }
    if (comparativa.length >= 4) {
      alert("No puedes comparar mas de 4 productos");
      return;
    }
    setComparativa((prev) => [...prev, p]);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-body)] text-[var(--text-main)] p-4 md:p-8">
      {/* Header superior (siempre visible) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lista de Productos</h1>
          <p className="text-[var(--text-muted)] mt-1">
            Explora y compara componentes de hardware
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/comparator"
            className="px-4 py-2 text-sm font-medium bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-hover)] transition-colors shadow-lg shadow-blue-500/20"
          >
            Comparador ({comparativa.length})
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-[var(--text-muted)]">
                Hola, <span className="text-[var(--text-main)] font-medium">{user?.user_metadata?.nombre}</span>
              </span>
              <Link
                to="/perfil"
                className="text-sm text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
              >
                Guardados
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-red-400 hover:text-red-300 transition-colors"
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link
                to="/signup"
                className="px-3 py-1.5 text-sm font-medium border border-[var(--border)] rounded-lg hover:bg-[var(--bg-card)] transition-colors"
              >
                Registrarse
              </Link>
              <Link
                to="/login"
                className="px-3 py-1.5 text-sm font-medium bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-hover)] transition-colors"
              >
                Iniciar sesión
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Barra de búsqueda (siempre arriba) */}
      <div className="mb-6">
        <BarraBusqueda lugarActual="lista" onSearch={manejarBusquedaLocal} />
      </div>

      {/* Layout principal: sidebar + contenido */}
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
        {/* Sidebar izquierdo (controles y filtros) */}
        <aside className="space-y-6">
          {/* Controles: orden, items por página, contador */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 shadow-lg">
            <h2 className="text-lg font-semibold mb-3 text-[var(--text-main)]">Ajustes de visualización</h2>
            <div className="space-y-4">
              {/* Orden */}
              <div>
                <label htmlFor="sort-sidebar" className="block text-sm text-[var(--text-muted)] mb-1">
                  Ordenar por
                </label>
                <select
                  id="sort-sidebar"
                  value={sortMethod}
                  onChange={handleSortChange}
                  className="w-full bg-[var(--bg-body)] text-[var(--text-main)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                >
                  <option value="popularidad-desc">Popularidad (alta a baja)</option>
                  <option value="popularidad-asc">Popularidad (baja a alta)</option>
                  <option value="precio-asc">Precio (bajo a alto)</option>
                  <option value="precio-desc">Precio (alto a bajo)</option>
                  <option value="nombre-asc">Nombre (A-Z)</option>
                  <option value="nombre-desc">Nombre (Z-A)</option>
                  <option value="aleatorio">Aleatorio</option>
                </select>
              </div>

              {/* Items por página */}
              <div>
                <label htmlFor="itemsPerPage-sidebar" className="block text-sm text-[var(--text-muted)] mb-1">
                  Mostrar
                </label>
                <select
                  id="itemsPerPage-sidebar"
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="w-full bg-[var(--bg-body)] text-[var(--text-main)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                >
                  <option value="5">5 por página</option>
                  <option value="10">10 por página</option>
                  <option value="20">20 por página</option>
                  <option value="50">50 por página</option>
                  <option value="100">100 por página</option>
                </select>
              </div>

              {/* Contador de resultados */}
              <div className="pt-2 border-t border-[var(--border)]">
                <p className="text-sm text-[var(--text-muted)]">
                  Mostrando <span className="font-medium text-[var(--text-main)]">{indexOfFirstItem + 1}</span> -{" "}
                  <span className="font-medium text-[var(--text-main)]">
                    {Math.min(indexOfLastItem, productosOrdenados.length)}
                  </span>{" "}
                  de <span className="font-medium text-[var(--text-main)]">{productosOrdenados.length}</span> productos
                </p>
              </div>
            </div>
          </div>

          {/* Componente Filtros */}
          <Filtros />
        </aside>

        {/* Contenido principal: grid de productos y paginación */}
        <main>
          {currentProducts.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-[var(--border)] rounded-2xl">
              <p className="text-xl text-[var(--text-muted)]">No se encontraron productos con los filtros actuales.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                {currentProducts.map((p) => (
                  <ProductCard key={p.id} product={p} onAddToCompare={agregarComparativa} />
                ))}
              </div>

              {/* Paginación (se muestra debajo de los productos) */}
              <div className="mt-10">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  totalItems={productosOrdenados.length}
                  itemsPerPage={itemsPerPage}
                />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default ListProducts;