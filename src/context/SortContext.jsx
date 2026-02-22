import { createContext, useState, useContext } from "react";

export const SortContext = createContext();

export function SortProvider({ children }) {
  // Estado para el método de ordenamiento actual
  const [sortMethod, setSortMethod] = useState("popularidad-desc");

  // Funciones de ordenamiento
  const sortProducts = (products, method) => {
    // Hacemos una copia para no mutar el array original
    const sorted = [...products];
    
    switch(method) {
      case "popularidad-desc":
        // Ordenar por popularidad (de mayor a menor)
        return sorted.sort((a, b) => (b.popularidad || 0) - (a.popularidad || 0));
        
      case "popularidad-asc":
        // Ordenar por popularidad (de menor a mayor)
        return sorted.sort((a, b) => (a.popularidad || 0) - (b.popularidad || 0));
        
      case "precio-desc":
        // Ordenar por precio (de mayor a menor)
        return sorted.sort((a, b) => b.precio - a.precio);
        
      case "precio-asc":
        // Ordenar por precio (de menor a mayor)
        return sorted.sort((a, b) => a.precio - b.precio);
        
      case "nombre-asc":
        // Ordenar por nombre A-Z
        return sorted.sort((a, b) => a.nombre.localeCompare(b.nombre));
        
      case "nombre-desc":
        // Ordenar por nombre Z-A
        return sorted.sort((a, b) => b.nombre.localeCompare(a.nombre));
        
      case "aleatorio":
        // Orden aleatorio (shuffle)
        return sorted.sort(() => Math.random() - 0.5);
        
      case "fecha-desc":
        // Ordenar por fecha (más reciente primero)
        // Necesitaríamos convertir las fechas a objetos Date
        return sorted; // Por ahora devolvemos sin cambios
        
      default:
        return sorted;
    }
  };

  // Función para cambiar el método de ordenamiento
  const changeSortMethod = (method) => {
    setSortMethod(method);
  };

  return (
    <SortContext.Provider value={{ sortMethod, changeSortMethod, sortProducts }}>
      {children}
    </SortContext.Provider>
  );
}