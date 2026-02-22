import { useContext } from "react";
import { ProductContext } from "../context/ProductContext";

function NotasProducts({ product }) {
  const { calcularNotasGpu, calcularNotasCpu, dataGpu } = useContext(ProductContext);

  const notas =
    product.tipo === "gpu"
      ? calcularNotasGpu(product, dataGpu)
      : calcularNotasCpu(product);

  const getScoreClass = (score) => {
    const num = parseFloat(score);
    if (num < 5) return "bg-red-500/20 text-red-400 border-red-500/50";
    if (num < 7.5) return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
    if (num <= 10) return "bg-green-500/20 text-green-400 border-green-500/50";
    return "bg-blue-500/20 text-blue-400 border-blue-500/50";
  };

  return (
    <div className="flex flex-col gap-2 md:gap-4">
      {/* Sección de Notas Técnicas */}
      <div className="space-y-2 md:space-y-3">
        {[
          { label: "Potencia Pura", value: notas.potencia },
          { label: "Eficiencia", value: notas.eficiencia },
          { label: "Tecnologías", value: notas.tecnologias },
        ].map((item, idx) => (
          <div key={idx} className="space-y-0.5 md:space-y-1">
            <div className="flex justify-between items-center text-[10px] md:text-xs">
              <span className="text-[var(--text-muted)] uppercase tracking-wider font-medium">
                {item.label}
              </span>
              <span className="font-bold text-[var(--text-main)]">
                {item.value}/10
              </span>
            </div>
            {/* Barra de progreso visual - más fina en móvil */}
            <div className="w-full h-1 md:h-1.5 bg-[var(--bg-body)] rounded-full overflow-hidden border border-[var(--border)]">
              <div 
                className="h-full bg-[var(--primary)] transition-all duration-500" 
                style={{ width: `${(parseFloat(item.value) * 10)}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Separador - más sutil en móvil */}
      <div className="h-px w-full bg-[var(--border)] my-0.5 md:my-1"></div>

      {/* Highlight: Calidad / Precio - más compacto */}
      <div className="flex justify-between items-center bg-[var(--bg-body)] p-2 md:p-3 rounded-xl border border-[var(--border)]">
        <div className="flex flex-col">
          <span className="text-[8px] md:text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
            Relación
          </span>
          <span className="text-[10px] md:text-sm font-bold text-[var(--text-main)]">
            Calidad / Precio
          </span>
        </div>
        
        {/* Badge dinámico - más pequeño en móvil */}
        <div className={`px-3 md:px-4 py-1 md:py-2 rounded-lg font-black text-base md:text-xl border ${getScoreClass(notas.calidadPrecio)}`}>
          {notas.calidadPrecio}
        </div>
      </div>
    </div>
  );
}

export default NotasProducts;