# Kipc (nombre temporal)

## Idea general de la aplicación

App Web (futuramente en móviles con React Native) inspirada en la aplicación de Kimovil (comparador de specs y precios de móviles) pero enfocada a comparar componentes de PC’s. También podrás hacer tu build manualmente y compararla con otras builds. La idea principal es darle al usuario la facilidad de entender qué es lo que necesita y si está pagando un precio justo por cada componente. Cada componente debería tener su propia nota de calidad/precio.

## Fases de construcción

### Primera fase (MVP)

#### Funcionalidades

- **Página principal: lista de productos**  
  - Cada tarjeta (card) de producto tendrá:
    - Botón de guardar y botón de comparar.
    - Información importante: nombre, categoría (GPU, CPU, etc.).
    - Precio con color según su nivel calidad/precio:
      - Rojo: mala
      - Amarillo: regular
      - Verde: buena
      - Azul: excelente
  - Encabezado con el título de la aplicación “KIPC” y una barra de búsqueda para buscar componentes por escrito (con sugerencias al escribir).
  - Filtros: por tipo (GPU, CPU…), marca y precio, con un botón para limpiar filtros.
  - Ajustes de visualización: control de cuántos componentes por página, información de cuántos componentes se están mostrando con los filtros actuales, y orden (popularidad, precio, nombre, aleatorio).
  - Enlaces a: Comparativa, Iniciar sesión, Registrarse, Mi perfil, Cerrar sesión.

- **Página de Comparativa**  
  - Componentes comparados lado a lado (máximo 4).
  - Cada componente muestra: tipo (ej. GPU), imagen (por ahora sin referencia), nombre, marca, precio, y un botón para quitar.
  - Dentro de la tarjeta, un componente con las notas del producto: Tecnologías, Eficiencia, Potencia bruta, Calidad/precio (sujeto a cambios).
  - Debajo, especificaciones técnicas lado a lado (frecuencias, benchmarks, fechas de lanzamiento, nomenclaturas, tecnologías específicas, cachés, etc.).
  - Apartado de historial de precios con gráfica (cuando el web scraping esté implementado).
  - Barra de búsqueda para agregar componentes a la comparativa (no para buscar en la lista general).

- **Página de productos guardados**  
  - Muestra todos los productos guardados por el usuario (requiere iniciar sesión). Si no está logueado, redirige a iniciar sesión.

- **Página de iniciar sesión y registrarse**  
  - Inicio de sesión con correo electrónico.
  - Registro: nombre de usuario, email, nombre, apellido, contraseña y confirmar contraseña.

- **Cálculos de notas**  
  - Las notas deben ser dinámicas y realistas, afectadas por el precio. Ejemplo: una RX 6600 no puede ser más potente que una RTX 3060, y su nota general debe ser mejor si el precio es similar.
  - Notas generales/básicas: potencia, eficiencia, tecnologías y calidad/precio. (Más adelante se agregará rendimiento en FPS 1080p, 1440p y 4K para gráficas).

- **Fuente de componentes**  
  - En esta primera fase, los componentes (solo procesadores y tarjetas gráficas) estarán en un JSON local.

- **Web scraping**  
  - Se implementará cuando todo lo anterior funcione. Se hará scraping de procesadores y gráficas del JSON para mostrar el mejor precio actual y guardar historial de precios.

#### Tecnologías de la primera fase

- Creación del proyecto: Vite
- Framework: React JS con JavaScript
- Librerías: TailwindCSS, Supabase Client, React Router
- Base de datos de usuarios: Supabase
- Scraping: Express.js (Playwright o Puppeteer)

#### Reglas

- Uso de React JS para el frontend y Supabase para la autenticación.
- Código escalable, separado por componentes para facilitar modificaciones sin afectar otras partes.

---

### Segunda fase

#### Limpieza de funcionalidades

- **Eliminar scraping** (se reemplazará por Awin en el futuro). Mientras tanto, se agregará un sobreprecio manual:  
  Ejemplo: el Core i5-12400F tiene un precio recomendado de 146 € con nota calidad/precio de 7.7. Se agregarán dos precios adicionales (sumando 50 € cada uno) y la nota se ajustará según el precio. Así el usuario tendrá referencia del rango recomendable y la nota correspondiente. En el componente de notas del producto aparecerá un deslizador para cambiar entre precios y ver la nota final.

#### Mejoras de interfaz

- Arreglar el header en PC y móviles: alineación de botones y redistribución del encabezado.
- En las cards de la lista de productos, mostrar más información y pulir el diseño.

#### Mejoras en el registro

- Mejorar restricciones: contraseñas más robustas y validación de correo electrónico.
- Mostrar una página de "Se te ha enviado un correo electrónico para verificar tu email".

#### Tecnologías de la segunda fase

- Eliminar Express (scraping).
- React JS (JSX) con Vite.
- Supabase para usuarios.
- JSON local para los datos de productos (gráficas y CPUs).

---

*Nota: El contenido de la página 2 del PDF original contenía caracteres no imprimibles que se han omitido por claridad.*