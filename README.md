# Mini Peques

Sitio publicado: https://mini-peques.vercel.app

Sitio estático con HTML, CSS y JavaScript; sin proceso de compilación.

## Vista local

Abrir una terminal en esta carpeta y ejecutar:

    python -m http.server 4173

Luego visitar http://localhost:4173.

## Archivos para editar

- index.html: contenido y estructura.
- style.css: estilos base.
- floating-v11.css: estilos actuales y ajustes responsive, cargados por index.html.
- app.js: menú, galería, animación y parallax.
- assets/: imágenes, video transparente y fotogramas de animación móvil. Conservar las rutas relativas.

## Publicación en Vercel

Framework: Other. Sin comando de build. Directorio de salida: punto (raíz). vercel.json incluye esta configuración.

El sitio actual se publica por CLI. Subir este código a GitHub no activa por sí solo despliegues automáticos en el proyecto existente.

## Identidad y alcance

Respetar la identidad aprobada. No cambiar colores, tipografías o composición sin consultar al responsable. El logo de referencia está en assets/logo-sin-bajada.png: marrón, oliva apagado, caramelo suave y crema.

El bebé del hero se anima en bucle; en móviles se usan sprites transparentes. Las imágenes de productos son de muestra y deben confirmarse antes de usarlo como tienda operativa.
