// server/lib/queueManager.js
export class ScrapeQueue {
    constructor() {
      this.cola = [];
      this.ejecutando = false;
      this.ultimaEjecucion = {};
    }
    
    async agregar(tarea) {
      this.cola.push(tarea);
      if (!this.ejecutando) {
        this.procesar();
      }
    }
    
    async procesar() {
      this.ejecutando = true;
      
      while (this.cola.length > 0) {
        const tarea = this.cola.shift();
        
        // Verificar tiempo desde última ejecución del mismo sitio
        const ahora = Date.now();
        const ultima = this.ultimaEjecucion[tarea.sitio] || 0;
        const tiempoDesdeUltima = ahora - ultima;
        
        if (tiempoDesdeUltima < 2 * 60 * 60 * 1000) { // Mínimo 2 horas entre scraping del mismo sitio
          console.log(`[Queue] Esperando para scrapear ${tarea.sitio} (muy pronto)`);
          this.cola.unshift(tarea); // Re-encolar
          await new Promise(resolve => setTimeout(resolve, 30 * 60 * 1000)); // Esperar 30 min
          continue;
        }
        
        try {
          console.log(`[Queue] Ejecutando scraping de ${tarea.sitio}`);
          await tarea.ejecutar();
          this.ultimaEjecucion[tarea.sitio] = ahora;
        } catch (error) {
          console.error(`[Queue] Error en ${tarea.sitio}:`, error);
        }
        
        // Esperar entre tareas
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
      
      this.ejecutando = false;
    }
  }