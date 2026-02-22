import { useFavorites } from '../context/FavoritesContext';
import { useContext } from 'react';
import { ProductContext } from '../context/ProductContext';
import ProductCard from './ProductCard';
import { Link } from 'react-router-dom';

const SavedProducts = ({ onAddToCompare }) => {
  const { favoriteIds, loading } = useFavorites();
  const { datos } = useContext(ProductContext);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-body)] flex items-center justify-center">
        <p className="text-[var(--text-muted)] text-lg">Cargando productos guardados...</p>
      </div>
    );
  }

  const savedProducts = datos.filter(p => favoriteIds.includes(p.id));

  if (savedProducts.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--bg-body)] p-8">
        <div className="max-w-4xl mx-auto text-center py-20 border-2 border-dashed border-[var(--border)] rounded-2xl">
          <p className="text-xl text-[var(--text-muted)] mb-4">No tienes productos guardados.</p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-hover)] transition-colors shadow-lg"
          >
            Explorar productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-body)] text-[var(--text-main)] p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mis productos guardados</h1>
          <p className="text-[var(--text-muted)] mt-1">
            {savedProducts.length} {savedProducts.length === 1 ? 'producto guardado' : 'productos guardados'}
          </p>
        </div>

        <Link
          to="/"
          className="px-4 py-2 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border)] rounded-lg hover:bg-[var(--bg-card)] transition-colors"
        >
          ← Volver al inicio
        </Link>
      </div>

      {/* Grid de productos guardados */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {savedProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCompare={onAddToCompare}
          />
        ))}
      </div>
    </div>
  );
};

export default SavedProducts;