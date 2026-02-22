Documento de Especificaciones: KIPC (Nombre Temporal)

1. Idea General 

KIPC es una aplicación web (con planes futuros para móviles mediante React Native) inspirada en Kimovil. Su objetivo es permitir la comparación de especificaciones y precios de componentes de PC, además de permitir a los usuarios crear, guardar y comparar sus propias "builds" personalizadas.

La misión principal es facilitar al usuario la comprensión de lo que necesita, asegurando que pague un precio justo mediante una nota de calidad/precio para cada componente.

2. Plan de Desarrollo (Fases) 
Fase 1: MVP (Producto Mínimo Viable)

    Enfoque: Lista de productos, comparativas, autenticación de usuarios y Web Scraping inicial.

    Fuente de datos: JSON local para procesadores y tarjetas gráficas.

Fase 2: PC Builder

    Enfoque: Implementación del constructor de PC funcional.

    Funcionalidad: Guardado de builds y generación de notas dinámicas para la configuración completa.

Fase 3: Perfeccionamiento

    Enfoque: Escalabilidad, interfaz pulida y mantenimiento general.

3. Especificaciones de la Primera Fase (MVP)

Funcionalidades Principales 

    Página Principal:

        Visualización de productos en tarjetas (cards).

        Botones de "Guardar" y "Comparar".

        Sistema de colores por calidad/precio: Rojo (Mala), Amarillo (Regular), Verde (Bueno), Azul (Excelente).

        Header con barra de búsqueda y sugerencias en tiempo real.

        Filtros por tipo (GPU, CPU), marca y precio, con opción de limpieza de filtros.

        Ajustes de visualización (cantidad por página y ordenamiento por popularidad, precio, nombre o aleatorio).

    Comparativa:

        Comparación lateral de hasta 4 componentes.

        Métricas: Tecnologías, eficiencia, potencia bruta y calidad/precio.

        Sección de especificaciones técnicas detalladas (frecuencias, benchmarks, etc.).

        Gráfica de historial de precios (post-scraping).

    Gestión de Usuarios:

        Página de "Productos Guardados" (requiere login).

        Registro e inicio de sesión con email y datos de perfil.

Lógica de Cálculos 

    Las notas deben ser dinámicas y verse afectadas por el precio actual.

    Los cálculos deben ser realistas (ej. una RTX 3060 debe mostrarse superior en potencia a una RX 6600).

    Métricas base: Potencia, eficiencia, tecnologías y calidad/precio.

4. Stack Tecnológico 
Categoría	Tecnología
Entorno de desarrollo	

Vite 
Framework Frontend	

React.js (JavaScript) 
Estilos	

Tailwind CSS 
Enrutamiento	

React Router 
Backend/Auth	

Supabase Client 
Web Scraping	

Express.js con Playwright o Puppeteer 

5. Reglas de Desarrollo 

    Arquitectura: Código escalable y separado por componentes para evitar efectos secundarios al modificar módulos.

    Integración: Uso estricto de React para el frontend y Supabase para la gestión de autenticación.

    ** Scraping:** Se implementará una vez que la estructura base del JSON local y la UI sean funcionales.