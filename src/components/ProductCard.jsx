import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';

const ProductCard = ({ product, onAddToCompare }) => {
  const { user } = useAuth();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const navigate = useNavigate();

  const favorito = isFavorite(product.id);

  const handleToggleFavorite = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      if (favorito) {
        await removeFavorite(product.id);
      } else {
        await addFavorite(product.id);
      }
    } catch (error) {
      alert('Error al guardar/quitar favorito');
    }
  };

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 duration-300 flex flex-col h-full">
      {/* Cabecera con tipo y nombre */}
      <div className="p-5 border-b border-[var(--border)]">
        <div className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[var(--bg-body)] text-[var(--text-muted)] mb-2 border border-[var(--border)]">
          {product.tipo}
        </div>
        <h3 className="text-lg font-bold text-[var(--text-main)] leading-tight line-clamp-2 min-h-[3.5rem]">
          {product.nombre}
        </h3>
        <p className="text-sm text-[var(--text-muted)] mt-1">{product.marca}</p>
      </div>

      {/* Cuerpo: precio y especificaciones rápidas (opcional) */}
      <div className="p-5 flex-grow">
        <div className="flex justify-between items-center mb-3">
          <span className="text-2xl font-bold text-[var(--primary)]">
            ${product.precio}
          </span>
          {/* Aquí podrías añadir más especificaciones si el producto las tiene */}
        </div>
        {/* Ejemplo de especificación extra (si existe en tu producto) */}
        {product.especificaciones && (
          <p className="text-xs text-[var(--text-muted)] line-clamp-2">
            {product.especificaciones}
          </p>
        )}
      </div>

      {/* Botones de acción */}
      <div className="p-5 pt-0 flex gap-2">
        <button
          onClick={handleToggleFavorite}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium border border-[var(--border)] rounded-lg hover:bg-[var(--bg-body)] transition-colors"
        >
          <span>{favorito ? '❤️' : '🤍'}</span>
          <span className="text-[var(--text-muted)] group-hover:text-[var(--text-main)]">
            {favorito ? 'Quitar' : 'Guardar'}
          </span>
        </button>
        <button
          onClick={() => onAddToCompare(product)}
          className="flex-1 px-3 py-2 text-sm font-medium bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-hover)] transition-colors shadow-sm"
        >
          Comparar
        </button>
      </div>
    </div>
  );
};

export default ProductCard;