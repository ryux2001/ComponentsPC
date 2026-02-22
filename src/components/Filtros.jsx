import { useContext } from "react";
import { FiltrosContext } from "../context/FiltrosContext";

function Filtros() {
  const { filtros, actualizarFiltros, resetearFiltros } =
    useContext(FiltrosContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    actualizarFiltros((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 shadow-lg">
      <h2 className="text-lg font-semibold mb-4 text-[var(--text-main)]">Filtros</h2>

      <div className="space-y-4">
        {/* Tipo */}
        <div className="flex flex-col">
          <label htmlFor="tipo" className="text-sm text-[var(--text-muted)] mb-1">
            Tipo
          </label>
          <select
            id="tipo"
            name="tipo"
            value={filtros.tipo}
            onChange={handleChange}
            className="bg-[var(--bg-body)] text-[var(--text-main)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          >
            <option value="todos">Todos</option>
            <option value="cpu">CPU</option>
            <option value="gpu">GPU</option>
          </select>
        </div>

        {/* Marca */}
        <div className="flex flex-col">
          <label htmlFor="marca" className="text-sm text-[var(--text-muted)] mb-1">
            Marca
          </label>
          <select
            id="marca"
            name="marca"
            value={filtros.marca}
            onChange={handleChange}
            className="bg-[var(--bg-body)] text-[var(--text-main)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          >
            <option value="todas">Todas</option>
            <option value="intel">Intel</option>
            <option value="amd">AMD</option>
            <option value="nvidia">NVIDIA</option>
          </select>
        </div>

        {/* Rango de precio */}
        <div className="flex flex-col">
          <label className="text-sm text-[var(--text-muted)] mb-1">
            Precio ($)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              name="precioMin"
              value={filtros.precioMin}
              onChange={handleChange}
              placeholder="Mín"
              className="w-full bg-[var(--bg-body)] text-[var(--text-main)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
            <span className="text-[var(--text-muted)]">-</span>
            <input
              type="number"
              name="precioMax"
              value={filtros.precioMax}
              onChange={handleChange}
              placeholder="Máx"
              className="w-full bg-[var(--bg-body)] text-[var(--text-main)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>
        </div>

        {/* Filtros específicos para CPU */}
        {filtros.tipo === "cpu" && (
          <div className="flex flex-col">
            <label htmlFor="socket" className="text-sm text-[var(--text-muted)] mb-1">
              Socket
            </label>
            <select
              id="socket"
              name="socket"
              value={filtros.socket}
              onChange={handleChange}
              className="bg-[var(--bg-body)] text-[var(--text-main)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            >
              <option value="todos">Todos</option>
              <option value="AM4">AM4</option>
              <option value="AM5">AM5</option>
              <option value="LGA 1700">LGA 1700</option>
              <option value="LGA 1200">LGA 1200</option>
            </select>
          </div>
        )}

        {/* Filtros específicos para GPU */}
        {filtros.tipo === "gpu" && (
          <div className="flex flex-col">
            <label htmlFor="vram" className="text-sm text-[var(--text-muted)] mb-1">
              VRAM mínima (GB)
            </label>
            <input
              type="number"
              id="vram"
              name="vram"
              value={filtros.vram}
              onChange={handleChange}
              min="0"
              placeholder="Ej: 8"
              className="bg-[var(--bg-body)] text-[var(--text-main)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>
        )}

        {/* Botón reset */}
        <button
          onClick={resetearFiltros}
          className="w-full mt-2 px-4 py-2 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border)] rounded-lg hover:bg-[var(--bg-body)] transition-colors"
        >
          Limpiar filtros
        </button>
      </div>
    </div>
  );
}

export default Filtros;