# Worklog — IntensivaAR

## Descripción General del Proyecto

**IntensivaAR** es una plataforma argentina de clases intensivas de verano e invierno. Es un sitio web Next.js 16 con Tailwind CSS 4 + shadcn/ui, con modo claro/oscuro, diseño responsive y animaciones con Framer Motion.

---

## Rutas del Sitio

| Ruta | Descripción |
|------|-------------|
| `/` | Landing page principal (estilo SaaS premium Wix Studio) |
| `/explorar` | Explorador de categorías (3 columnas: Ciencias Exactas, Sociales, Idiomas) |
| `/materias` | Listado de materias con tarjetas de colores |
| `/materias/historia` | Línea de tiempo de Historia Universal (10 períodos expandibles) |

---

## Stack Tecnológico

- **Framework**: Next.js 16.1.3 (App Router, Turbopack)
- **UI**: Tailwind CSS 4 + shadcn/ui (Radix primitives)
- **Animaciones**: Framer Motion
- **Iconos**: lucide-react
- **Tipografía**: Inter (Google Fonts)
- **Modo oscuro**: class strategy (`@custom-variant dark (&:is(.dark *))`)
- **Tema hook**: `src/hooks/use-theme.ts` (localStorage key: `intensiva-theme`)

---

## Archivos Clave

### Páginas
- `src/app/page.tsx` — Landing page principal (~700+ líneas, estilo premium SaaS)
- `src/app/explorar/page.tsx` — Explorador de categorías (3 acordeones)
- `src/app/materias/page.tsx` — Tarjetas de materias (6 materias con bordes de colores)
- `src/app/materias/historia/page.tsx` — Línea de tiempo (10 períodos expandibles con contenido rico)

### Componentes compartidos
- `src/components/site-navbar.tsx` — Navbar con: logo, links, buscador, toggle dark/light, menú mobile (Sheet)
- `src/components/site-footer.tsx` — Footer con 3 columnas + redes sociales

### Estilos y config
- `src/app/globals.css` — Variables CSS (oklch), tema claro y oscuro
- `src/app/layout.tsx` — Layout raíz con Inter font, metadata SEO
- `tailwind.config.ts` — Configuración de Tailwind con dark mode class strategy
- `src/hooks/use-theme.ts` — Hook custom para dark/light toggle con localStorage

### Componentes shadcn/ui utilizados
Accordion, Badge, Button, Card, Input, Select, Avatar, Sheet, Toaster

---

## Historial de Tareas Completadas

### Task 1 — Landing page inicial
- 10 secciones: navbar, hero, search, nichos, categorías, cómo funciona, profesores, blog, newsletter, footer
- Paleta verde esmeralda, animaciones fade-in-on-scroll

### Task 2 — Sección Historia Universal
- Contenido extraído del PDF "Toda la Historia del mundo" de Barreau & Bigot
- 10 regiones, 8 categorías de actividad, 6 eras con barra de progreso

### Task 3 — Navegación interactiva
- Client-side routing con useRouter
- Catálogo digital con 12 materiales
- Vista de detalle de materia (Historia)
- Breadcrumbs y navegación entre vistas

### Task 4 — 3 nuevas rutas
- `/explorar` — Explorador 3 columnas con acordeones
- `/materias` — Tarjetas de materias con bordes de colores
- `/materias/historia` — Timeline con 10 períodos
- Navbar y footer extraídos como componentes compartidos

### Task 5 — Barra de búsqueda y toggle dark/light
- Buscador funcional en navbar (redirige a /materias o /materias/historia según query)
- Botón sol/luna en navbar para alternar modo oscuro
- Fix de navegación: eliminado conflicto entre goHome() + setTimeout

### Task 6 — Dark mode completo y responsive
- `dark:` variants en TODOS los componentes de TODAS las páginas
- Cambio de `bg-white` a `bg-background` en sub-páginas
- Fix de iconos, badges, breadcrumbs, avatares, tarjetas en modo oscuro
- Verificación responsive mobile/tablet/desktop

### Task 7 — Rediseño premium SaaS (Wix Studio style)
- **Landing page completamente rediseñada** con estilo corporativo moderno:
  - Header sticky (80px) con logo centrado, menú centrado, selector de idioma, CTA
  - Mega menú desplegable (full-width, multi-columna, animación fade+slide)
  - Hero: H1 gigante, subtítulo, 2 CTAs, layout 2 columnas, mockup de laptop
  - Secciones: Beneficios, Categorías, Testimonios, Pricing, FAQ
  - Footer profesional multi-columna
  - Animaciones de hover, micro-interacciones, glassmorphism
- Tipografía: Inter (no Poppins/Manrope todavía)

### Task 8 — Fixes de la página de Historia
- **Acordeón roto**: Reemplazado Radix Accordion por sistema manual con useState + AnimatePresence de Framer Motion
- **Contenido enriquecido**: Cada período pasó de ~5 a ~9 temas clave + descripción ampliada
- **Dark mode puro negro**: Cambiados todos los `dark:bg-gray-950` a `dark:bg-black`
- Colores dark mode: fondo `oklch(0.02 0 0)` (negro puro), texto `oklch(0.98 0 0)` (blanco puro)

---

## Estado Actual del Tema (globals.css)

### Modo Claro
- `--background`: oklch(0.995 0.001 160) — casi blanco con tinte verde sutíl
- `--foreground`: oklch(0.13 0.015 260) — casi negro
- `--primary`: oklch(0.596 0.145 163.225) — verde esmeralda
- `--card`: oklch(1 0 0) — blanco puro
- `--border`: oklch(0.92 0.005 260) — gris claro

### Modo Oscuro
- `--background`: oklch(0.02 0 0) — **negro puro** (corregido de gris)
- `--foreground`: oklch(0.98 0 0) — **blanco puro** (sin opacidad)
- `--card`: oklch(0.07 0 0) — negro profundo
- `--muted`: oklch(0.14 0 0) — gris muy oscuro
- `--border`: oklch(1 0 0 / 10%) — blanco con 10% opacidad
- `--primary`: oklch(0.65 0.17 163.225) — verde esmeralda claro

---

## Contenido de /materias/historia — 10 Períodos

1. **Prehistoria y Orígenes** (~3.000.000 – 3.000 a.C.) — Lucy, Homo erectus, fuego, neolítico
2. **Pangea y Primeras Civilizaciones** (~3.500 – 500 a.C.) — Sumeria, Egipto, valle del Indo
3. **Mundo Antiguo** (~800 a.C. – 476 d.C.) — Grecia, Roma, Alejandro Magno
4. **Edad Media** (476 – 1453 d.C.) — Cruzadas, Islam, Peste Negra, Juana de Arco
5. **Renacimiento y Reformas** (1453 – 1648 d.C.) — Colón, Carlos V, Lutero, Gutenberg
6. **América Precolombina** (~2.000 a.C. – 1492 d.C.) — Olmecas, mayas, aztecas, incas
7. **Conquista y Colonia** (1492 – 1810 d.C.) — Cortés, Pizarro, virreinatos
8. **Independencia de América** (1810 – 1825 d.C.) — San Martín, Bolívar
9. **Siglo XIX** (1815 – 1914 d.C.) — Revolución Industrial, unificaciones
10. **Historia Contemporánea** (1914 – actualidad) — Guerras Mundiales, Guerra Fría, globalización

Cada período tiene: descripción (200+ palabras), 8-9 temas clave, actividad propuesta con tipo/dificultad/tiempo.

---

## Funcionalidades Implementadas

- ✅ Dark/light mode con persistencia en localStorage
- ✅ Navegación con router Next.js (client-side)
- ✅ Breadcrumbs en todas las sub-páginas
- ✅ Buscador funcional en navbar
- ✅ Mega menú desplegable en landing
- ✅ Acordeones expandibles (manual, con AnimatePresence)
- ✅ Animaciones de entrada con Framer Motion (fade-in-on-scroll)
- ✅ Responsive mobile/tablet/desktop
- ✅ SEO metadata en español

---

## Task 9 — Internacionalización (ES ↔ EN) ✅

**Estado**: Completado

### Solución implementada
- **Enfoque**: i18n client-side simple con React Context (sin cambios de URL)
- **Archivos creados**:
  - `src/i18n/context.tsx` — I18nProvider, useT(), useLocale(), useSetLocale()
  - `src/i18n/es.json` — Traducciones en español (~200 keys)
  - `src/i18n/en.json` — Traducciones en inglés (~200 keys)
  - `src/components/language-toggle.tsx` — Botón ES/EN pill toggle
- **Archivos modificados**: layout.tsx, page.tsx, site-navbar.tsx, site-footer.tsx, explorar/page.tsx, materias/page.tsx, materias/historia/page.tsx
- **Persistencia**: localStorage key `intensiva-locale`
- **Botón toggle**: Aparece en navbar de landing page + navbar compartido (desktop + mobile)
- **Historia**: Nombres de períodos traducidos, descripciones largas quedan en español (contenido del libro)
- **Build**: Pasa limpio

---

## Pendientes / Mejoras Futuras

1. **Landing page**: Incorporar tipografías Poppins/Manrope (solo se usa Inter actualmente)
3. **Pricing real**: Las secciones de pricing y testimonios tienen contenido placeholder
4. **Páginas de detalle**: Crear páginas individuales para cada materia (no solo Historia)
5. **Blog**: Crear páginas de blog reales
6. **Auth**: Implementar login/registro (botones "Ingresa"/"Regístrate" son placeholder)
7. **Perfil de profesor**: Crear página para "¿Sos profesor?"
8. **Logo personalizado**: El usuario mencionó un logo "P10 文/日" pero aún no lo describió
9. **Contenido de materias**: Agregar más materias con contenido detallado (Matemática, Inglés, etc.)
10. **FAQ**: Contenido real de preguntas frecuentes
11. **Newsletter**: Formulario funcional de newsletter

---

## Notas Importantes

- Todos los textos están en **español argentino** (vos, sabés, etc.)
- No se usan emojis en el código (reemplazados por iconos lucide-react)
- La paleta principal es **verde esmeralda** (emerald-600: oklch 0.596 0.145 163.225)
- El modo oscuro usa **negro puro** (oklch 0.02) NO gris
- Los builds siempre deben pasar limpios (`npm run build`)
- Proyecto ubicado en `/home/z/my-project/`
- Archivos generados para usuario van a `/home/z/my-project/download/`
