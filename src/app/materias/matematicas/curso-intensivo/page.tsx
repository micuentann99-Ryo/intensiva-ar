'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import {
  ChevronRight,
  ChevronDown,
  Clock,
  Lightbulb,
  Calculator,
  Landmark,
  Compass,
  Globe,
  BookOpen,
  Sparkles,
  Hash,
  Sigma,
  Triangle,
  TrendingUp,
  Brain,
} from 'lucide-react';
import SiteNavbar from '@/components/site-navbar';
import SiteFooter from '@/components/site-footer';
import { useT } from '@/i18n/context';

const periodIcons = [Landmark, Compass, Globe, BookOpen, Sparkles, Hash, Sigma, Triangle, TrendingUp, Brain];

const periodColors = [
  { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-200 dark:border-purple-800/40', accent: 'bg-purple-500' },
  { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-800/40', accent: 'bg-blue-500' },
  { bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-200 dark:border-indigo-800/40', accent: 'bg-indigo-500' },
  { bg: 'bg-violet-100 dark:bg-violet-900/30', text: 'text-violet-700 dark:text-violet-300', border: 'border-violet-200 dark:border-violet-800/40', accent: 'bg-violet-500' },
  { bg: 'bg-fuchsia-100 dark:bg-fuchsia-900/30', text: 'text-fuchsia-700 dark:text-fuchsia-300', border: 'border-fuchsia-200 dark:border-fuchsia-800/40', accent: 'bg-fuchsia-500' },
  { bg: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-700 dark:text-pink-300', border: 'border-pink-200 dark:border-pink-800/40', accent: 'bg-pink-500' },
  { bg: 'bg-rose-100 dark:bg-rose-900/30', text: 'text-rose-700 dark:text-rose-300', border: 'border-rose-200 dark:border-rose-800/40', accent: 'bg-rose-500' },
  { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-300', border: 'border-orange-200 dark:border-orange-800/40', accent: 'bg-orange-500' },
  { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-800/40', accent: 'bg-amber-500' },
  { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-800/40', accent: 'bg-emerald-500' },
];

export default function CursoIntensivoPage() {
  const t = useT();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const timelinePeriods = [
    {
      id: 'origenes',
      name: t('mat_page.periods.origenes'),
      era: '~3.000 a.C. - 300 a.C.',
      description:
        'Los orígenes de la matemática se remontan a las civilizaciones más antiguas de la humanidad. En Egipto, los sacerdotes desarrollaron un sistema numérico decimal basado en jeroglíficos que les permitía realizar cálculos complejos necesarios para la construcción de las pirámides, la agrimensura de las tierras del Nilo y la administración del imperio. El Papiro de Rhind, datado alrededor del 1650 a.C., es uno de los documentos matemáticos más importantes de la antigüedad y contiene 84 problemas que abarcan fracciones, progresiones aritméticas, áreas y volúmenes. En Mesopotamia, los sumerios y babilonios utilizaron un sistema sexagesimal (base 60) que aún persiste en nuestra medida del tiempo y los ángulos. Las tablillas de arcilla cuneiforme revelan un conocimiento avanzado de raíces cuadradas, ecuaciones cuadráticas y teoremas geométricos que anticiparon descubrimientos que se atribuyen a civilizaciones posteriores. Estos logros no fueron meramente prácticos: reflejan una capacidad de abstracción y razonamiento lógico que sentó las bases para todo el desarrollo matemático posterior.',
      topics: [
        'Sistemas de numeración egipcio (jeroglíficos) y babilónico (sexagesimal)',
        'El Papiro de Rhind y el Papiro de Moscú: primeros problemas matemáticos',
        'Construcción de pirámides y cálculos geométricos en el Antiguo Egipto',
        'Aritmética babilónica: tablillas cuneiformes y tablas de multiplicar',
        'Fracciones egipcias y descomposición en suma de fracciones unitarias',
        'Cálculo de áreas y volúmenes para la agrimensura y la arquitectura',
        'Origen del sistema sexagesimal (base 60) para tiempo y ángulos',
        'Resolución primitiva de ecuaciones de primer y segundo grado',
        'Matemáticas en el valle del Indo y civilización china primitiva',
      ],
      activity: 'Investigación: Compará el sistema de numeración egipcio (decimal jeroglífico) con el babilónico (sexagesimal). ¿Qué ventajas y desventajas presenta cada uno? Explicá por qué creés que el sistema sexagesimal se mantiene vigente en la medición del tiempo y los ángulos.',
      activityType: 'Investigacion',
      difficulty: t('mat_page.medium'),
      time: '40 min',
    },
    {
      id: 'grecia',
      name: t('mat_page.periods.grecia'),
      era: '600 a.C. - 300 a.C.',
      description:
        'La matemática griega representó un cambio radical en la forma de concebir esta disciplina: pasó de ser un conjunto de técnicas prácticas a convertirse en un sistema deductivo riguroso basado en axiomas y demostraciones. Pitágoras de Samos y su escuela descubrieron las relaciones entre los lados de un triángulo rectángulo y las propiedades de los números enteros, aunque también se horrorizaron al descubrir que la diagonal de un cuadrado de lado 1 no podía expresarse como fracción (los números irracionales). Euclides, en su obra monumental "Los Elementos" (circa 300 a.C.), sistematizó todo el conocimiento geométrico y aritmético conocido en 13 libros, utilizando un método axiomático que se mantuvo como modelo de rigor matemático por más de dos mil años. Arquímedes de Siracusa, considerado el mayor matemático de la antigüedad, calculó el valor de pi con extraordinaria precisión, desarrolló métodos para calcular áreas y volúmenes que anticiparon el cálculo integral, e hizo contribuciones fundamentales a la estática y la hidrostática. Platón fundó la Academia de Atenas, donde la inscripción "que no entre quien no sepa geometría" reflejaba la importancia que daba a la matemática como base del pensamiento filosófico. La proporción áurea y los sólidos platónicos fueron objetos de estudio fascinantes que conectaban la matemática con la estética y la cosmología.',
      topics: [
        'Pitágoras y el Teorema de Pitágoras: relaciones en triángulos rectángulos',
        'Euclides y "Los Elementos": el método axiomático deductivo',
        'Arquímedes: cálculo de pi, áreas, volúmenes y el principio de Arquímedes',
        'La Academia de Platón y la importancia de la geometría',
        'Números irracionales: la crisis pitagórica de la diagonal del cuadrado',
        'La proporción áurea (phi) y su presencia en arte y naturaleza',
        'Los cinco sólidos platónicos: tetraedro, cubo, octaedro, dodecaedro, icosaedro',
        'Tales de Mileto: primer gran matemático griego y teorema de Tales',
        'Eudoxo de Cnido y el método de agotamiento para calcular áreas',
      ],
      activity: 'Demostracion: Demostrá el Teorema de Pitágoras utilizando al menos dos métodos diferentes (uno geométrico con áreas y uno algebraico). Explicá paso a paso cada demostracion y compará cual te resulta mas intuitiva.',
      activityType: 'Demostracion',
      difficulty: t('mat_page.hard'),
      time: '50 min',
    },
    {
      id: 'oriente',
      name: t('mat_page.periods.oriente'),
      era: '200 a.C. - 1200 d.C.',
      description:
        'Mientras Europa atravesaba la Edad Media, el mundo oriental fue el escenario de avances matemáticos extraordinarios que transformaron la disciplina para siempre. En la India, Brahmagupta (siglo VII) fue el primer matemático en tratar explícitamente el cero como un número con propiedades aritméticas completas, y formuló reglas para operar con números positivos y negativos. Aryabhata (476-550 d.C.) calculó el valor de pi con cuatro decimales correctos, propuso que la Tierra rotaba sobre su eje y desarrolló un sistema de notación posicional que sería revolucionario. El sistema de numeración indo-arábigo, con sus diez dígitos y el uso revolucionario del cero como marcador posicional, es considerado uno de los inventos más importantes de la historia de la humanidad. En China, el texto "Los Nueve Capítulos sobre el Arte Matemático" recopiló 246 problemas que abarcaban desde la resolución de ecuaciones hasta el cálculo de áreas, y el uso del ábaco (suanpan) permitió cálculos rápidos y eficientes. En el mundo islámico, Al-Khwarizmi (c. 780-850) escribió "Al-Kitab al-Mukhtasar fi Hisab al-Jabr wal-Muqabala", del cual deriva la palabra "álgebra", y su nombre latinizado dio origen al término "algoritmo". Los matemáticos islámicos tradujeron y preservaron las obras griegas, desarrollaron la trigonometría esférica y avanzaron significativamente en el álgebra y la combinación.',
      topics: [
        'Invención del cero como número completo en la India (Brahmagupta)',
        'Sistema de numeración indo-arábigo y notacion posicional',
        'Aryabhata: valor de pi, rotacion terrestre, trigonometria',
        'Los Nueve Capítulos: texto fundamental de la matematica china',
        'Al-Khwarizmi: padre del algebra y origen de la palabra "algoritmo"',
        'Uso del abaco (suanpan) en China para calculos rapidos',
        'Trigonometria esferica y avances en el mundo islamico',
        'Operaciones con numeros negativos y reglas de signos',
        'Preservacion y traduccion de obras griegas en la Casa de la Sabiduria de Bagdad',
      ],
      activity: 'Reflexion: Imaginá un mundo sin el numero cero. Explicá por qué la invencion del cero fue tan revolucionaria para las matematicas y para la ciencia en general. ¿Qué operaciones serían imposibles sin el cero? Mencioná al menos 5 situaciones cotidianas que dependerían del concepto de cero.',
      activityType: 'Reflexion',
      difficulty: t('mat_page.medium'),
      time: '35 min',
    },
    {
      id: 'medieval',
      name: t('mat_page.periods.medieval'),
      era: '1200 - 1600',
      description:
        'La Edad Media europea y el Renacimiento fueron períodos de transición y renovación para las matemáticas. Leonardo de Pisa, conocido como Fibonacci (1170-1250), introdujo el sistema de numeración indo-arábigo en Europa a través de su obra "Liber Abaci" (1202), desplazando gradualmente los engorrosos números romanos. En este libro presentó también la famosa sucesión de Fibonacci (1, 1, 2, 3, 5, 8, 13, 21...), donde cada número es la suma de los dos anteriores, una secuencia que aparece sorprendentemente en la naturaleza (espirales de flores, conchas de nautilus, ramificaciones de árboles). Durante el Renacimiento, las matemáticas se vincularon estrechamente con el arte: Leonardo da Vinci utilizó principios geométricos y de perspectiva para sus obras maestras, y estudió la proporción áurea en el cuerpo humano en su famoso "Hombre de Vitruvio". Los pintores desarrollaron la perspectiva lineal, que requiere un profundo conocimiento de la geometría proyectiva. En el ámbito puramente matemático, los italianos del siglo XVI (Scipione del Ferro, Niccolò Fontana Tartaglia, Gerolamo Cardano) lograron resolver ecuaciones de tercer y cuarto grado, hallazgos que generaron apasionantes disputas académicas. Regiomontano sistematizó la trigonometría como disciplina independiente, y la invención de la imprenta permitió una difusión sin precedentes del conocimiento matemático por toda Europa.',
      topics: [
        'Fibonacci y la sucesion de Fibonacci en "Liber Abaci"',
        'Introduccion del sistema indo-arábigo en Europa',
        'Leonardo da Vinci: geometria, perspectiva y el Hombre de Vitruvio',
        'La proporcion aurea en el arte y el cuerpo humano',
        'Resolucion de ecuaciones de tercer grado (Cardano, Tartaglia)',
        'Perspectiva lineal y geometria proyectiva en el arte renacentista',
        'Regiomontano y la sistematizacion de la trigonometria',
        'Impacto de la imprenta en la difusion del conocimiento matematico',
        'Combinatoria temprana y problemas de probabilidad (Pacioli)',
      ],
      activity: 'Investigacion: La sucesion de Fibonacci aparece en muchos fenomenos naturales: espirales de girasoles, piñas de pino, conchas de nautilus. Elegí dos ejemplos de la naturaleza donde aparezca esta sucesion, investigá la explicacion matematica de por qué ocurre y presentá tus hallazgos con diagramas.',
      activityType: 'Investigacion',
      difficulty: t('mat_page.easy'),
      time: '45 min',
    },
    {
      id: 'revolucion',
      name: t('mat_page.periods.revolucion'),
      era: '1600 - 1800',
      description:
        'El siglo XVII fue testigo de la mayor revolución en la historia de la matemática: el nacimiento del cálculo infinitesimal y la unificación del álgebra con la geometría. René Descartes (1596-1650) creó la geometría analítica al asignar coordenadas numéricas a los puntos del plano, permitiendo representar curvas geométricas mediante ecuaciones algebraicas y viceversa. Su famoso "Pienso, luego existo" no solo fue filosófico sino también metodológico: aplicó la deducción lógica a todas las áreas del conocimiento. Isaac Newton (1643-1727) y Gottfried Wilhelm Leibniz (1646-1716) desarrollaron independientemente el cálculo diferencial e integral, una herramienta tan poderosa que permitió calcular la velocidad instantánea de un objeto, la pendiente de una curva en cualquier punto y el área bajo una curva. La controversia sobre quién lo inventó primero fue una de las más amargas de la historia de la ciencia. Leonhard Euler (1707-1783), el matemático más prolífico de todos los tiempos con más de 800 publicaciones, introdujo gran parte de la notación moderna (e, f(x), i, sigma) y descubrió la identidad de Euler (e^(i*pi) + 1 = 0), considerada la ecuación más bella de las matemáticas por conectar cinco constantes fundamentales. Galileo Galilei aplicó las matemáticas al estudio de la física, estableciendo que "el libro de la naturaleza está escrito en lenguaje matemático".',
      topics: [
        'Descartes y la geometria analitica: el plano cartesiano',
        'Newton y Leibniz: invencion del calculo diferencial e integral',
        'La polemica Newton-Leibniz sobre la paternidad del calculo',
        'Leonhard Euler: el matematico mas prolifico de la historia',
        'La identidad de Euler: e^(i*pi) + 1 = 0',
        'Galileo Galilei: matematizacion de la fisica y la caida de los cuerpos',
        'Notacion matematica moderna: f(x), e, i, sigma, integral',
        'Aplicaciones del calculo a la fisica y la astronomia',
        'Las leyes de Kepler y la mecanica celeste newtoniana',
      ],
      activity: 'Ensayo: Explicá por qué la identidad de Euler (e^(i*pi) + 1 = 0) es considerada la ecuacion mas bella de las matematicas. Describí cada una de las cinco constantes que la componen (e, i, pi, 1, 0) y explicá su significado individual y la belleza de que aparezcan juntas en una sola relacion.',
      activityType: 'Ensayo',
      difficulty: t('mat_page.hard'),
      time: '60 min',
    },
    {
      id: 'aritmetica',
      name: t('mat_page.periods.aritmetica'),
      era: 'Fundamentos',
      description:
        'La aritmética constituye el pilar fundamental sobre el cual se construye toda la estructura matemática. Los números naturales (1, 2, 3, ...) son los más intuitivos y sirven para contar y ordenar. A partir de ellos se fue ampliando el conjunto numérico: los números enteros incorporan el cero y los negativos, necesarios para representar deudas o temperaturas bajo cero; los números racionales incluyen las fracciones, esenciales para medir partes de un todo; los irracionales como la raíz cuadrada de 2 o pi no pueden expresarse como fracción y completan los números reales; finalmente, los números complejos, que incorporan la unidad imaginaria i (donde i^2 = -1), permiten resolver ecuaciones que no tenían solución en los reales. Cada conjunto numérico se incluye en el siguiente como una muñeca rusa: N esta contenido en Z, que esta contenido en Q, que esta contenido en R, que esta contenido en C. Las propiedades fundamentales de las operaciones (conmutativa, asociativa, distributiva) se aplican de manera consistente. La divisibilidad, los números primos (que solo son divisibles por 1 y por sí mismos), el máximo común divisor (MCD) y el mínimo común múltiplo (MCM) son conceptos esenciales para el álgebra y la teoría de números. Los números primos son los "átomos" de la aritmética: todo número entero mayor que 1 se puede descomponer en un producto único de primos (Teorema Fundamental de la Aritmética).',
      topics: [
        'Conjuntos numericos: naturales, enteros, racionales, irracionales, reales, complejos',
        'Propiedades de las operaciones: conmutativa, asociativa, distributiva, elemento neutro',
        'Numeros primos y el Teorema Fundamental de la Aritmetica',
        'Divisibilidad, MCD y MCM: metodos de calculo (Euclides, factorizacion)',
        'Numeros racionales: fracciones, decimales finitos y periodicos',
        'Numeros irracionales: raices, pi, e y la demostracion de irracionalidad',
        'Numeros complejos: la unidad imaginaria i y el plano complejo',
        'Sistema de numeracion posicional y cambio de base (binario, octal, hexadecimal)',
        'Potencias, raices y logaritmos: propiedades y aplicaciones',
      ],
      activity: 'Ejercicios: Encontrá los primeros 25 numeros primos y demostrá por qué 51 no es primo. Luego, descomponé en factores primos los siguientes numeros: 360, 1001, 2024. Calculá el MCD y el MCM de cada par posible entre ellos.',
      activityType: 'Ejercicios',
      difficulty: t('mat_page.easy'),
      time: '35 min',
    },
    {
      id: 'algebra',
      name: t('mat_page.periods.algebra'),
      era: 'Ecuaciones y Funciones',
      description:
        'El álgebra es el lenguaje generalizador de la matemática: mientras la aritmética trabaja con números específicos, el álgebra utiliza letras (variables) para representar cantidades desconocidas y establecer relaciones generales. Las ecuaciones lineales (de la forma ax + b = 0) son las más sencillas y representan rectas en el plano cartesiano. Las ecuaciones cuadráticas (ax^2 + bx + c = 0) se resuelven con la célebre fórmula general y sus gráficas son parábolas, curvas que aparecen en la trayectoria de un proyectil o en la antena de un satélite. El álgebra de polinomios estudia expresiones formadas por la suma de potencias de una variable, y técnicas como la factorización permiten simplificar expresiones complejas. Las inecuaciones (desigualdades) son fundamentales para modelar restricciones en problemas de optimización. Las funciones son el corazón del álgebra: una función asigna a cada valor de entrada (dominio) un único valor de salida (imagen). Las funciones lineales modelan relaciones proporcionales, las cuadráticas describen movimientos parabólicos, las exponenciales representan crecimiento y decaimiento (poblaciones, radiactividad, interés compuesto) y las logarítmicas son su inversa. Comprender las funciones y sus gráficas es esencial para cualquier carrera científica o tecnológica, ya que permiten modelar y predecir fenómenos del mundo real.',
      topics: [
        'Ecuaciones lineales: resolucion, interpretacion geometrica y sistemas de ecuaciones',
        'Ecuaciones cuadraticas: formula general, factorizacion y completing cuadrados',
        'Polinomios: operaciones, factorizacion, teorema del resto y del factor',
        'Inecuaciones lineales y cuadraticas: resolucion y representacion grafica',
        'Funciones: dominio, imagen, ceros, intersecciones y monotonía',
        'Funciones exponenciales: crecimiento, decaimiento, interes compuesto',
        'Funciones logaritmicas: propiedades, cambio de base y aplicaciones',
        'Funciones cuadraticas: vertice, eje de simetria, concavidad',
        'Modelado de problemas reales con funciones',
      ],
      activity: 'Problemas: Una poblacion de bacterias se duplica cada 3 horas. Si inicialmente hay 100 bacterias, ¿cuantas habra despues de 24 horas? Modelá la situacion con una funcion exponencial. Ademas, resolvé el siguiente sistema de ecuaciones: 2x + 3y = 12, x - y = 1. Interpretá el resultado geometricamente.',
      activityType: 'Problemas',
      difficulty: t('mat_page.medium'),
      time: '45 min',
    },
    {
      id: 'geometria',
      name: t('mat_page.periods.geometria'),
      era: 'Formas y Espacio',
      description:
        'La geometría es la rama de las matemáticas que estudia las formas, los tamaños, las posiciones y las propiedades del espacio. La geometría plana analiza figuras bidimensionales como triángulos, cuadriláteros, círculos y polígonos regulares. El Teorema de Pitágoras establece la relación fundamental entre los lados de un triángulo rectángulo (a^2 + b^2 = c^2) y tiene aplicaciones en arquitectura, navegación, GPS e ingeniería. El Teorema de Tales permite calcular la altura de un edificio midiendo su sombra. La geometría analítica, creada por Descartes, unifica el álgebra con la geometría al representar figuras mediante ecuaciones: una recta es y = mx + b, una circunferencia es (x-h)^2 + (y-k)^2 = r^2. La trigonometría estudia las relaciones entre los ángulos y los lados de los triángulos, y las funciones seno, coseno y tangente son fundamentales en física, ingeniería, acústica y señal digital. Las transformaciones geométricas (traslaciones, rotaciones, reflexiones, homotecias) permiten mover y deformar figuras conservando ciertas propiedades. La geometría del espacio extiende estos conceptos a tres dimensiones, calculando volúmenes de prismas, pirámides, cilindros, conos y esferas. Estas herramientas son esenciales en arquitectura, diseño industrial, medicina (tomografías) y computación gráfica.',
      topics: [
        'Figuras planas: triangulos, cuadrilateros, circulos y poligonos',
        'Teorema de Pitagoras: demostraciones y aplicaciones practicas',
        'Teorema de Tales y semejanza de triangulos',
        'Geometria analitica: rectas, circunferencias y parabolas en el plano cartesiano',
        'Trigonometria: funciones seno, coseno, tangente y sus aplicaciones',
        'Resolucion de triangulos: ley de senos y ley de cosenos',
        'Transformaciones geometricas: traslaciones, rotaciones, reflexiones',
        'Perimetros, areas y volumenes de figuras planas y solidos',
        'Aplicaciones de la trigonometria en fisica, topografia y navegacion',
      ],
      activity: 'Problemas de aplicacion: Calculá la altura de un edificio sabiendo que desde un punto del suelo a 30 metros del pie del edificio, el angulo de elevacion a la parte superior es de 60 grados. Luego, encontrá el area de un triangulo cuyos lados miden 7, 8 y 9 cm usando la formula de Heron. Finalmente, calculá el volumen de un cono cuyo radio es 5 cm y la altura es 12 cm.',
      activityType: 'Problemas',
      difficulty: t('mat_page.medium'),
      time: '50 min',
    },
    {
      id: 'calculo',
      name: t('mat_page.periods.calculo'),
      era: 'Cambio y Movimiento',
      description:
        'El cálculo es una de las herramientas más poderosas y fascinantes de la matemática: permite estudiar el cambio y el movimiento de manera precisa. Todo se fundamenta en el concepto de límite, que describe el valor al que se aproxima una función cuando una variable se acerca a un valor determinado. A partir del límite se definen las dos ramas del cálculo: la derivada y la integral. La derivada mide la tasa de cambio instantánea de una función: si la función representa la posición de un móvil respecto al tiempo, la derivada es su velocidad, y la derivada de la velocidad es la aceleración. Geométricamente, la derivada en un punto es la pendiente de la recta tangente a la curva en ese punto. Las reglas de derivación (potencia, producto, cociente, cadena) permiten calcular derivadas de funciones complejas de manera sistemática. La integral, por su parte, calcula el área bajo una curva y es la operación inversa de la derivación. El Teorema Fundamental del Cálculo establece esta conexión profunda entre derivación e integración, unificando dos conceptos que parecían independientes. Las aplicaciones del cálculo son inmensas: permite resolver problemas de optimización (encontrar máximos y mínimos), calcular tasas relacionadas, modelar crecimiento de poblaciones, determinar áreas y volúmenes de regiones complejas, y es la base de la física newtoniana, la ingeniería, la economía y la estadística.',
      topics: [
        'Limites: definicion, propiedades, limites laterales e indeterminaciones',
        'Derivada como tasa de cambio instantanea y pendiente de la tangente',
        'Reglas de derivacion: potencia, producto, cociente, cadena',
        'Funciones derivadas y aplicaciones: maximos, minimos, puntos de inflexion',
        'Integral definida e indefinida: propiedades y metodos de integracion',
        'Teorema Fundamental del Calculo: conexion entre derivacion e integracion',
        'Metodos de integracion: sustitucion, partes, fracciones parciales',
        'Aplicaciones: optimizacion, tasas relacionadas, area bajo la curva',
        'Calculo de volumenes por secciones y por rotacion',
      ],
      activity: 'Problemas: Encontrá los puntos maximos y minimos de la funcion f(x) = x^3 - 6x^2 + 9x + 1. Luego, calculá el area bajo la curva f(x) = x^2 entre x = 0 y x = 3. Finalmente, si un objeto se mueve con velocidad v(t) = 3t^2 - 6t + 3 m/s, encontrá la distancia total recorrida entre t = 0 y t = 4 segundos.',
      activityType: 'Problemas',
      difficulty: t('mat_page.hard'),
      time: '60 min',
    },
    {
      id: 'moderna',
      name: t('mat_page.periods.moderna'),
      era: '1900 - Actualidad',
      description:
        'La matemática moderna se caracteriza por su abstracción, rigor y diversificación en múltiples ramas especializadas. La teoría de conjuntos, desarrollada por Georg Cantor a finales del siglo XIX, revolucionó la fundamentación de toda la matemática al demostrar que existen diferentes tipos de infinito (el conjunto de los números reales es "más grande" que el de los naturales). La teoría de la probabilidad, formalizada por Kolmogorov en 1933, permite cuantificar la incertidumbre y es la base del análisis estadístico, los juegos de azar, la inteligencia artificial y la econometría. La estadística descriptiva e inferencial proporciona herramientas para analizar datos, hacer estimaciones y tomar decisiones bajo incertidumbre. La lógica matemática, impulsada por Russell, Gödel y Turing, exploró los límites de lo demostrable: los teoremas de incompletitud de Gödel demostraron que en todo sistema formal suficientemente potente existen verdades que no pueden demostrarse dentro del sistema, un resultado que sacudió los cimientos de la matemática. La teoría de grafos, iniciada por Euler con el problema de los puentes de Königsberg, estudia redes de nodos y conexiones y es fundamental para la informática, las redes sociales y la logística. Las matemáticas computacionales y los algoritmos son la base de la revolución digital, desde los motores de búsqueda hasta las redes neuronales y la inteligencia artificial. Alan Turing, considerado el padre de la computación, demostró en 1936 que existen problemas que ninguna computadora puede resolver, un límite fundamental que sigue vigente.',
      topics: [
        'Teoria de conjuntos: operaciones, relaciones y diferentes tipos de infinito',
        'Probabilidad: espacio muestral, eventos, teorema de Bayes',
        'Estadistica: medidas de tendencia central, dispersion, distribuciones',
        'Logica matematica: proposiciones, cuantificadores, tablas de verdad',
        'Teoremas de incompletitud de Godel: limites de la demostrabilidad',
        'Teoria de grafos: nodos, aristas, caminos, arboles y aplicaciones',
        'Algoritmos y complejidad computacional: efficiency y limites',
        'Matematica computacional: simulacion, modelado numerico',
        'Fundamentos matematicos de la inteligencia artificial y el aprendizaje automatico',
      ],
      activity: 'Investigacion: El problema de los puentes de Konigsberg fue resuelto por Euler en 1736, dando origen a la teoria de grafos. Explicá en qué consiste el problema, cómo lo resolvió Euler, y luego investigá dos aplicaciones modernas de la teoria de grafos (por ejemplo: redes sociales, GPS, planificacion de rutas, redes electricas). Presentá tus hallazgos con diagramas.',
      activityType: 'Investigacion',
      difficulty: t('mat_page.medium'),
      time: '55 min',
    },
  ];

  function DifficultyBadge({ level }: { level: string }) {
    const config: Record<string, { color: string }> = {
      [t('mat_page.easy')]: { color: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800/50' },
      [t('mat_page.medium')]: { color: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800/50' },
      [t('mat_page.hard')]: { color: 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/40 dark:text-rose-300 dark:border-rose-800/50' },
    };
    const { color } = config[level] ?? config[t('mat_page.medium')];
    return (
      <Badge variant="outline" className={`${color} text-xs font-medium`}>
        {level}
      </Badge>
    );
  }

  const togglePeriod = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteNavbar />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-muted/40 dark:bg-black border-b border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center gap-1.5 text-sm">
              <Link
                href="/"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {t('common.inicio')}
              </Link>
              <ChevronRight className="size-3.5 text-muted-foreground" />
              <Link
                href="/materias"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {t('common.materias')}
              </Link>
              <Link
                href="/materias/matematicas"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {t('common.matematicas')}
              </Link>
              <ChevronRight className="size-3.5 text-muted-foreground" />
              <span className="text-purple-700 dark:text-purple-400 font-medium">{t('materias_page.curso_intensivo')}</span>
            </nav>
          </div>
        </div>

        {/* Page Header */}
        <section className="py-10 md:py-14 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center size-12 rounded-2xl bg-purple-100 dark:bg-purple-900/40">
                  <Calculator className="size-6 text-purple-700 dark:text-purple-400" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
                    {t('mat_page.title')}
                  </h1>
                </div>
              </div>
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                {t('mat_page.subtitle_before')}{' '}
                <span className="font-semibold text-purple-700 dark:text-purple-400">
                  {t('mat_page.subtitle_book')}
                </span>{' '}
                {t('mat_page.subtitle_after')}
              </p>
              <p className="mt-2 text-sm text-muted-foreground/70">
                {t('mat_page.hint')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Timeline */}
        <section className="pb-16 md:pb-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="space-y-2"
              >
                {timelinePeriods.map((period, idx) => {
                  const isExpanded = expandedId === period.id;
                  const Icon = periodIcons[idx];
                  const colors = periodColors[idx];

                  return (
                    <div
                      key={period.id}
                      className={`rounded-xl border transition-all duration-300 overflow-hidden ${
                        isExpanded
                          ? `${colors.border} ${colors.bg} shadow-sm`
                          : 'border-border hover:border-border/80'
                      }`}
                    >
                      {/* Trigger Button */}
                      <button
                        onClick={() => togglePeriod(period.id)}
                        className="w-full flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-4 sm:py-5 text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      >
                        {/* Icon */}
                        <div
                          className={`flex items-center justify-center size-10 sm:size-11 rounded-xl shrink-0 transition-colors duration-300 ${
                            isExpanded
                              ? `${colors.bg} ${colors.text}`
                              : 'bg-muted dark:bg-muted text-muted-foreground'
                          }`}
                        >
                          <Icon className="size-5" />
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`text-sm sm:text-base font-semibold transition-colors duration-300 ${
                                isExpanded ? 'text-foreground' : 'text-foreground'
                              }`}
                            >
                              {period.name}
                            </span>
                            <span className="text-xs text-muted-foreground hidden sm:inline">
                              {period.era}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 line-clamp-1">
                            {period.description}
                          </p>
                        </div>

                        {/* Chevron */}
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="shrink-0"
                        >
                          <ChevronDown className="size-5 text-muted-foreground" />
                        </motion.div>
                      </button>

                      {/* Expandable Content */}
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 sm:px-5 pb-5 sm:pb-6 space-y-5">
                              {/* Divider */}
                              <div className="border-t border-border/60 dark:border-white/10" />

                              {/* Era Badge */}
                              <div className="sm:hidden">
                                <span className={`text-xs font-medium ${colors.text} ${colors.bg} px-2.5 py-1 rounded-full inline-block`}>
                                  {period.era}
                                </span>
                              </div>

                              {/* Description */}
                              <div>
                                <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
                                  {t('mat_page.description')}
                                </h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                  {period.description}
                                </p>
                              </div>

                              {/* Key Topics */}
                              <div>
                                <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2.5">
                                  {t('mat_page.key_topics')}
                                </h4>
                                <ul className="space-y-2">
                                  {period.topics.map((topic) => (
                                    <li
                                      key={topic}
                                      className="flex items-start gap-2.5 text-sm text-foreground"
                                    >
                                      <ChevronRight className={`size-4 mt-0.5 shrink-0 ${colors.text}`} />
                                      <span className="leading-relaxed">{topic}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Activity */}
                              <div className={`rounded-lg p-4 sm:p-5 border ${colors.bg} ${colors.border}`}>
                                <div className="flex items-center gap-2 mb-2.5">
                                  <Lightbulb className={`size-4 ${colors.text}`} />
                                  <span className={`text-xs font-semibold ${colors.text} uppercase tracking-wider`}>
                                    {t('mat_page.activity')}: {period.activityType}
                                  </span>
                                </div>
                                <p className="text-sm text-foreground leading-relaxed">
                                  {period.activity}
                                </p>
                                <div className="flex items-center gap-3 mt-3 flex-wrap">
                                  <DifficultyBadge level={period.difficulty} />
                                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Clock className="size-3" />
                                    {period.time}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
