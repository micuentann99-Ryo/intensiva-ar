'use client';

import { useState, useEffect, useRef, type ReactNode } from 'react';
import { motion, useInView } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Menu,
  Search,
  Flame,
  Snowflake,
  GraduationCap,
  MapPin,
  Monitor,
  Calendar,
  Star,
  ChevronRight,
  BookOpen,
  Calculator,
  FlaskConical,
  Atom,
  Code,
  Wrench,
  ArrowRight,
  Mail,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Users,
  Lightbulb,
  CheckCircle2,
  BarChart3,
  BookOpenCheck,
  Newspaper,
  Heart,
  Target,
  Brain,
  Beaker,
  PenTool,
  Sparkles,
  Landmark,
  Mountain,
  Globe,
  Compass,
  ScrollText,
  Ship,
  TreePine,
  Palmtree,
  Clock,
  Zap,
  FileText,
  MessageSquare,
  Map,
  Trophy,
  ChevronDown,
  BookMarked,
  History,
} from 'lucide-react';

/* ─── Fade-in animation wrapper ─── */
function FadeIn({
  children,
  delay = 0,
  className = '',
  direction = 'up',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const dirMap = {
    up: { y: 30, x: 0 },
    down: { y: -30, x: 0 },
    left: { y: 0, x: 30 },
    right: { y: 0, x: -30 },
  };
  const { x, y } = dirMap[direction];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x, y }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x, y }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Section wrapper ─── */
function Section({
  id,
  children,
  className = '',
  bg = false,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  bg?: boolean;
}) {
  return (
    <section
      id={id}
      className={`py-16 md:py-24 ${bg ? 'bg-muted/50' : ''} ${className}`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}

/* ─── Section heading ─── */
function SectionHeading({
  title,
  subtitle,
  className = '',
}: {
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <FadeIn className={`text-center mb-12 md:mb-16 ${className}`}>
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{subtitle}</p>
      )}
    </FadeIn>
  );
}

/* ═══════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════ */

const navLinks = [
  { label: 'Cursos', href: '#cursos' },
  { label: 'Verano', href: '#search' },
  { label: 'Invierno', href: '#search' },
  { label: 'Materias', href: '#categorias' },
  { label: 'Historia', href: '#historia' },
  { label: 'Profesores', href: '#profesores' },
  { label: 'Cómo funciona', href: '#como-funciona' },
];

const popularSearches = [
  'Matemática',
  'Inglés',
  'Ingreso Universitario',
  'Química',
  'Física',
  'Programación',
];

const nichos = [
  {
    icon: <Target className="size-6 text-emerald-600" />,
    title: 'Clases intensivas para finales de ingeniería en Argentina',
    desc: 'Preparate con cursos enfocados en las materias más difíciles de la carrera.',
  },
  {
    icon: <Heart className="size-6 text-rose-500" />,
    title: 'Preparación intensiva para ingreso a Medicina',
    desc: 'Accedé a programas diseñados específicamente para el ingreso a Medicina.',
  },
  {
    icon: <GraduationCap className="size-6 text-amber-600" />,
    title: 'Recuperación de materias de primer año de CBC/UBA',
    desc: 'Cursos de recuperación para aprobación rápida de materias del CBC.',
  },
  {
    icon: <Calculator className="size-6 text-sky-600" />,
    title: 'Clases intensivas de matemática para ingresantes',
    desc: 'Fortalecé tus bases de matemática antes de empezar la universidad.',
  },
];

const categorias = [
  { icon: <Calculator className="size-7" />, name: 'Matemáticas', count: 245 },
  {
    icon: <GraduationCap className="size-7" />,
    name: 'Ingreso Universitario',
    count: 189,
  },
  { icon: <BookOpen className="size-7" />, name: 'Inglés', count: 167 },
  { icon: <FlaskConical className="size-7" />, name: 'Ciencias', count: 134 },
  { icon: <Code className="size-7" />, name: 'Informática y Programación', count: 98 },
  { icon: <Wrench className="size-7" />, name: 'Talleres y Cursos cortos', count: 76 },
];

const steps = [
  {
    icon: <Search className="size-8" />,
    title: 'Buscá tu curso',
    desc: 'Filtá por materia, modalidad, ubicación y fecha.',
  },
  {
    icon: <BarChart3 className="size-8" />,
    title: 'Compará opciones',
    desc: 'Revisá profesores, opiniones, programas y precios.',
  },
  {
    icon: <CheckCircle2 className="size-8" />,
    title: 'Inscribite y empezá',
    desc: 'Elegí tu curso e inscríbite de forma rápida y segura.',
  },
];

const profesores = [
  {
    name: 'Martin T.',
    subject: 'Matemáticas',
    location: 'Buenos Aires',
    rating: 4.9,
    reviews: 320,
    modality: 'Presencial',
    initials: 'MT',
  },
  {
    name: 'Sofia R.',
    subject: 'Inglés',
    location: 'Córdoba',
    rating: 4.9,
    reviews: 280,
    modality: 'Online',
    initials: 'SR',
  },
  {
    name: 'Facundo L.',
    subject: 'Física',
    location: 'Rosario',
    rating: 4.8,
    reviews: 210,
    modality: 'Presencial',
    initials: 'FL',
  },
  {
    name: 'Camila P.',
    subject: 'Química',
    location: 'Buenos Aires',
    rating: 4.9,
    reviews: 185,
    modality: 'Online',
    initials: 'CP',
  },
  {
    name: 'Nicolás G.',
    subject: 'Programación',
    location: 'Mendoza',
    rating: 4.8,
    reviews: 150,
    modality: 'Online',
    initials: 'NG',
  },
];

const blogArticles = [
  {
    tag: 'Matemáticas',
    icon: <Calculator className="size-4" />,
    title: 'Cómo aprobar matemáticas en 15 días',
    desc: 'Estrategias probadas para rendir tu examen final de matemáticas con éxito.',
  },
  {
    tag: 'Estudio',
    icon: <Lightbulb className="size-4" />,
    title: 'Técnicas de estudio que realmente funcionan',
    desc: 'Descubrí los métodos más efectivos para retener información y rendir mejor.',
  },
  {
    tag: 'Universidad',
    icon: <GraduationCap className="size-4" />,
    title: 'Todo sobre los ingresos universitarios 2024',
    desc: 'Fechas, requisitos y consejos para los procesos de ingreso más competitivos.',
  },
];

const footerNav = {
  Navegación: ['Inicio', 'Cursos', 'Profesores', 'Cómo funciona', 'Blog'],
  Categorías: [
    'Matemáticas',
    'Ingreso Universitario',
    'Inglés',
    'Ciencias',
    'Programación',
  ],
  Información: [
    'Sobre nosotros',
    'Contacto',
    'Términos y condiciones',
    'Política de privacidad',
    'Preguntas frecuentes',
  ],
};

/* ─── History region data ─── */
type LucideIcon = React.ComponentType<{ className?: string }>;

const historyRegions = [
  {
    id: 'mexico',
    name: 'México y Civilización Azteca/Mexica',
    icon: 'landmark' as const,
    color: 'amber',
    intro: 'El Imperio azteca, una de las civilizaciones más poderosas de Mesoamérica, fue conquistado por los españoles bajo el mando de Hernán Cortés en el siglo XVI.',
    content: 'Los aztecas, en plena expansión en el siglo XV, crearon en México un Estado guerrero que se parecía a la Asiria de Sargón. En 1519, Cortés llegó a la capital azteca de Tenochtitlán. Fue recibido por Moctezuma. La "Noche Triste" (30 de junio de 1520). Tenochtitlán fue tomada el 13 de agosto de 1521. Los españoles continuaron hasta California por el norte. En el siglo XIX, México enfrentó la intervención francesa de Napoleón III, quien envió a Maximiliano como emperador. Los mexicanos no querían invasores y las guerrillas obligaron a los franceses a retirarse. Maximiliano acabó fusilado. Chiapas fue una sedición étnica contemporánea.',
    activity: 'Investigá: Compará la organización del Imperio azteca con el Imperio inca. ¿Qué similitudes y diferencias encontrás en su forma de gobierno, religión y arquitectura?',
    activityType: 'Investigación',
    difficulty: 'Medio',
    time: '45 min',
  },
  {
    id: 'peru',
    name: 'Perú y el Imperio Inca',
    icon: 'mountain' as const,
    color: 'emerald',
    intro: 'El Tahuantinsuyo, el vasto imperio incaico, se extendía desde Ecuador hasta Chile. Fue conquistado por Francisco Pizarro con un reducido grupo de soldados.',
    content: 'Los incas construyeron un inmenso Imperio desde Ecuador hasta Chile, pasando por Bolivia y Perú. El Inca era una especie de faraón, un Rey sol. Se adoraba al Sol. Existían clases de escribas, soldados y campesinos. En 1531, Pizarro dirigió una expedición hacia Perú. El 16 de noviembre de 1532, en Cajamarca, Pizarro secuestró al Inca Atahualpa con solo 163 hombres frente a miles de soldados incas. El Imperio se derrumbó. El "desfase temporal" entre españoles e incas era de unos seis mil años. En 1824, las tropas españolas fueron aniquiladas en Ayacucho, logrando la independencia. Sendero Luminoso fue una sedición étnica contemporánea en Perú.',
    activity: 'Reflexioná: ¿Por qué creés que un grupo de 163 españoles pudo derrotar al Imperio inca de 10-15 millones de personas? Enumerá al menos 3 factores que explica el libro.',
    activityType: 'Reflexión',
    difficulty: 'Difícil',
    time: '30 min',
  },
  {
    id: 'argentina',
    name: 'Argentina y Sudamérica',
    icon: 'globe' as const,
    color: 'sky',
    intro: 'Las revoluciones de independencia sudamericanas fragmentaron el Imperio español en múltiples repúblicas, dejando desafíos que persisten hasta hoy.',
    content: 'Las revoluciones de independencia sudamericanas fueron lideradas por figuras como Miranda y San Martín. Bolívar no consiguió mantener la unidad del Imperio español, que se fraccionó en repúblicas independientes: México, Perú, Colombia, Venezuela, Chile, Argentina, Bolivia. El libro señala dos problemas graves: la falta de unión y el apartheid (las insurrecciones fueron revueltas de colonos, los indios participaron poco). Latinoamérica permanece dividida en una veintena de Estados. Los indígenas siguen participando muy poco en los gobiernos. En Argentina, los mapuches y otras etnias originarias tuvieron un papel menos documentado en este libro.',
    activity: 'Debate: ¿Por qué América Latina se dividió en tantos países mientras América del Norte (EE.UU.) se unificó? ¿Qué factores mencionados en el libro explican esta diferencia?',
    activityType: 'Debate',
    difficulty: 'Difícil',
    time: '60 min',
  },
  {
    id: 'norteamerica',
    name: 'América del Norte',
    icon: 'mapPin' as const,
    color: 'rose',
    intro: 'Los Estados Unidos se expandió hacia el oeste tras la guerra de Secesión, con consecuencias devastadoras para los pueblos indígenas norteamericanos.',
    content: 'Los amerindios al norte de Río Grande eran cazadores nómadas, no campesinos como aztecas o incas. Tras la guerra de Secesión (1861-1865), Estados Unidos reanudó su expansión. Los pieles rojas fueron casi aniquilados. En 1815 podía haber veinte millones de bisontes, frente a menos de un millón en 1880. Tocqueville escribió sobre la conducta americana hacia los indios. En 1867, EE.UU. compró Alaska al Imperio del zar. En 1898 declaró la guerra a España y ganó Cuba, Puerto Rico y Filipinas. El primer ferrocarril continental unió Nueva York con San Francisco en 1869. El petróleo salió a flote en Texas creando la fortuna de los Rockefeller.',
    activity: 'Análisis de texto: Leé la cita de Tocqueville sobre el comportamiento de los americanos hacia los indígenas (página 126 del libro). ¿Qué diferencia establece entre la colonización española y la americana?',
    activityType: 'Análisis de texto',
    difficulty: 'Medio',
    time: '40 min',
  },
  {
    id: 'centroamerica',
    name: 'Centroamérica y Civilización Maya',
    icon: 'treePine' as const,
    color: 'lime',
    intro: 'Los mayas, ya en decadencia al llegar los españoles, habían logrado avances notables como la escritura, las matemáticas y la agricultura.',
    content: 'Los mayas, ya en decadencia cuando llegaron los españoles, vivían en Guatemala, en pequeñas ciudades-estado comparables a las de los griegos de los tiempos de Homero. Sabían contar y acababan de inventar la escritura. Salían de la prehistoria y entraban en un triunfante neolítico. Los mayas inventaron plantas que hoy nos resultan familiares: la patata, el chocolate (cacao), el maíz y el tomate. Se comunicaban entre sí y con los nómadas de las praderas norteamericanas, pero ignoraban la existencia del mundo exterior.',
    activity: 'Investigación: Los mayas inventaron el cacao, el maíz y el tomate. Elegí uno de estos productos y trazá su historia desde la civilización maya hasta nuestra mesa actual.',
    activityType: 'Investigación',
    difficulty: 'Fácil',
    time: '50 min',
  },
  {
    id: 'europa',
    name: 'Europa',
    icon: 'landmark2' as const,
    color: 'violet',
    intro: 'Europa es el tema principal del libro, cubriendo desde la prehistoria hasta la globalización actual. Un recorrido completo por la historia del mundo occidental.',
    content: [
      'La prehistoria en África oriental',
      'Cretenses, griegos, fenicios y judíos (Mediterráneo)',
      'El Imperio persa y el mundo griego',
      'Alejandro Magno (primera globalización)',
      'Cartago y Roma (Aníbal y César)',
      'El Imperio romano',
      'El judeo-cristianismo',
      'La época del islam',
      'La Edad Media y las cruzadas',
      'El Renacimiento (Miguel Ángel, Leonardo, Maquiavelo)',
      'Las Reformas y guerras de religión (Lutero, Calvino)',
      'El gran siglo XVII (Richelieu, Luis XIV)',
      'El Siglo de las Luces (Voltaire, Rousseau)',
      'La Revolución Francesa',
      'Napoleón',
      'Las repúblicas del siglo XIX',
      'La unificación de Italia y Alemania',
      'La Belle Époque',
      'Las dos Guerras Mundiales',
      'La caída de la URSS y la globalización',
    ],
    activity: 'Línea de tiempo: Armá una línea de tiempo con los 10 eventos más importantes de la historia de Europa según el libro. Justificá tu selección.',
    activityType: 'Línea de tiempo',
    difficulty: 'Difícil',
    time: '90 min',
  },
  {
    id: 'africa',
    name: 'África',
    icon: 'compass' as const,
    color: 'orange',
    intro: 'Cuna de la humanidad, África fue colonizada por potencias europeas en el siglo XIX, dejando un legado de fronteras artificiales y conflictos.',
    content: 'La prehistoria humana se origina en África oriental, donde hace 200-300 mil años grupos de primates inventaron el lenguaje. En la época colonial, los europeos conquistaron el continente. Los boers/afrikaners (holandeses) abandonaron Ciudad del Cabo entre 1834-1838 para fundar estados libres. La guerra de los Boers (1899-1902) enfrentó a holandeses e ingleses. Francia colonizó desde Argelia hasta el Congo. El rey Leopoldo de Bélgica explotó brutalmente el Congo. Alemania anexionó Camerún, Togo, Namibia y Tanzania. Italia fue derrotada por Etiopía en Adúa (1896). Egipto fue controlado por Inglaterra desde 1882 para proteger el canal de Suez.',
    activity: 'Mapa histórico: Ubicá en un mapa de África las principales colonias europeas mencionadas en el libro. ¿Qué patrones geográficos observás en la colonización?',
    activityType: 'Mapa histórico',
    difficulty: 'Medio',
    time: '55 min',
  },
  {
    id: 'asia',
    name: 'Asia',
    icon: 'scrollText' as const,
    color: 'red',
    intro: 'Asia abarca civilizaciones milenarias como China e India, y la notable modernización de Japón durante la era Meiji.',
    content: 'China aparece desde los primeros capítulos con sus ríos nutricios. Los jesuitas como Mateo Ricci llegaron a Pekín y adoptaron costumbres confucianas. El Imperio otomano se extendió desde el Adriático hasta el golfo Pérsico ("el hombre enfermo de Europa"). Japón es el único país del Tercer Mundo que se modernizó: en 1868 el emperador Mutsuhito proclamó la era Meiji. En 20 años recuperaron su retraso técnico. En 1905, Japón hundió la flota rusa en Tsushima. En 1894 anexó Taiwán y en 1910, Corea. India fue colonia británica: la reina Victoria fue proclamada emperatriz en 1877. Indonesia quedó bajo control holandés.',
    activity: 'Ensayo comparativo: Japón logró modernizarse resistiendo a la colonización europea, mientras que India y China fueron colonizadas o sometidas. ¿Qué factores explica el libro que hicieron posible la modernización japonesa?',
    activityType: 'Ensayo',
    difficulty: 'Difícil',
    time: '75 min',
  },
  {
    id: 'paisesbajos',
    name: 'Países Bajos y el Mundo Colonial',
    icon: 'ship' as const,
    color: 'cyan',
    intro: 'Los holandeses fueron competidores coloniales clave, con presencia en Sudáfrica, Indonesia y el sudeste asiático.',
    content: 'Los holandeses fueron competidores coloniales. Después de Waterloo, Holanda había anexionado Bélgica, pero los belgas se declararon independientes el 4 de octubre de 1830. Los boers/afrikaners, colonos holandeses en Sudáfrica, abandonaron Ciudad del Cabo y fundaron estados libres en Orange y Transvaal. En la guerra de los Boers (1899-1902), los "comandos" boers aterrorizaron al ejército inglés. Holanda pudo conservar Indonesia como colonia. El término "comandos" viene de esta guerra.',
    activity: 'Investigá: El término "comando" se originó en la guerra de los Boers. Investigá qué otros términos militares o de uso cotidiano tienen origen en conflictos históricos.',
    activityType: 'Investigación',
    difficulty: 'Medio',
    time: '40 min',
  },
  {
    id: 'oceania',
    name: 'Australia y Oceanía',
    icon: 'palmtree' as const,
    color: 'teal',
    intro: 'Australia y Nueva Zelanda se convirtieron en dominios del Imperio británico, con una historia ligada a la colonización y la participación en las guerras mundiales.',
    content: 'El libro menciona a Australia en el contexto del Imperio británico. Australia y Nueva Zelanda se convirtieron en "dominios" o "Estados asociados" del Imperio británico con sus propias libertades. También se menciona que los primeros humanos llegaron a Australia desde el sudeste asiático en la prehistoria. La contribución de Australia a la Primera Guerra Mundial es mencionada en el contexto de la guerra de Gallípoli. Francia también tenía posesiones en el Pacífico sur: Nueva Caledonia y Oceanía (Tahití).',
    activity: 'Punto de extensión: Este apartado tiene menos desarrollo en el libro. Elegí un aspecto de la historia de Australia (colonización, pueblos aborígenes, o participación en guerras mundiales) e investigá más allá del libro para ampliar este apartado.',
    activityType: 'Investigación',
    difficulty: 'Fácil',
    time: '60 min',
  },
];

const activityCategories = [
  { label: 'Investigación', color: 'bg-amber-100 text-amber-800 border-amber-200', count: 3 },
  { label: 'Análisis de texto', color: 'bg-rose-100 text-rose-800 border-rose-200', count: 1 },
  { label: 'Debate', color: 'bg-sky-100 text-sky-800 border-sky-200', count: 1 },
  { label: 'Ensayo', color: 'bg-violet-100 text-violet-800 border-violet-200', count: 1 },
  { label: 'Línea de tiempo', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', count: 1 },
  { label: 'Mapa histórico', color: 'bg-orange-100 text-orange-800 border-orange-200', count: 1 },
  { label: 'Reflexión', color: 'bg-teal-100 text-teal-800 border-teal-200', count: 1 },
  { label: 'Punto de extensión', color: 'bg-lime-100 text-lime-800 border-lime-200', count: 1 },
];

const progressEras = [
  {
    name: 'Prehistoria',
    color: 'bg-stone-500',
    chapters: ['Cap. 1-3'],
    range: [0, 8],
  },
  {
    name: 'Antigüedad',
    color: 'bg-amber-600',
    chapters: ['Cap. 4-12'],
    range: [8, 35],
  },
  {
    name: 'Edad Media',
    color: 'bg-rose-600',
    chapters: ['Cap. 13-18'],
    range: [35, 54],
  },
  {
    name: 'Renacimiento',
    color: 'bg-violet-600',
    chapters: ['Cap. 19-24'],
    range: [54, 70],
  },
  {
    name: 'Época Moderna',
    color: 'bg-sky-600',
    chapters: ['Cap. 25-30'],
    range: [70, 86],
  },
  {
    name: 'Contemporánea',
    color: 'bg-emerald-600',
    chapters: ['Cap. 31-37'],
    range: [86, 100],
  },
];

/* ─── Icon helper ─── */
function RegionIcon({ icon, className }: { icon: string; className?: string }) {
  const props = { className };
  switch (icon) {
    case 'landmark':
      return <Landmark {...props} />;
    case 'mountain':
      return <Mountain {...props} />;
    case 'globe':
      return <Globe {...props} />;
    case 'mapPin':
      return <MapPin {...props} />;
    case 'treePine':
      return <TreePine {...props} />;
    case 'landmark2':
      return <Landmark {...props} />;
    case 'compass':
      return <Compass {...props} />;
    case 'scrollText':
      return <ScrollText {...props} />;
    case 'ship':
      return <Ship {...props} />;
    case 'palmtree':
      return <Palmtree {...props} />;
    default:
      return <Globe {...props} />;
  }
}

function DifficultyBadge({ level }: { level: string }) {
  const map: Record<string, { color: string; icon: LucideIcon }> = {
    Fácil: { color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: CheckCircle2 },
    Medio: { color: 'bg-amber-100 text-amber-800 border-amber-200', icon: Zap },
    Difícil: { color: 'bg-rose-100 text-rose-800 border-rose-200', icon: Trophy },
  };
  const { color, icon: Icon } = map[level] ?? map.Medio;
  return (
    <Badge variant="outline" className={`${color} text-xs gap-1`}>
      <Icon className="size-3" />
      {level}
    </Badge>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════ */

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* ─── NAVBAR ─── */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-border'
            : 'bg-white'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Logo */}
            <a href="#" className="flex items-center gap-2 shrink-0">
              <div className="flex items-center justify-center size-9 rounded-lg bg-emerald-600 text-white">
                <Sparkles className="size-5" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-lg font-bold text-foreground tracking-tight">
                  IntensivaAR
                </span>
                <span className="text-[10px] text-muted-foreground hidden sm:block">
                  Clases intensivas Argentina
                </span>
              </div>
            </a>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted/60"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3">
              <Button variant="outline" size="sm" className="text-sm">
                ¿Sos profesor?
              </Button>
              <Button variant="ghost" size="sm" className="text-sm">
                Ingresa
              </Button>
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                Regístrate
              </Button>
            </div>

            {/* Mobile Menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="size-5" />
                  <span className="sr-only">Abrir menú</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <div className="flex items-center justify-center size-8 rounded-lg bg-emerald-600 text-white">
                      <Sparkles className="size-4" />
                    </div>
                    IntensivaAR
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-1 mt-4">
                  {navLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="px-3 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted/60"
                    >
                      {link.label}
                    </a>
                  ))}
                </nav>
                <div className="flex flex-col gap-2 mt-6 pt-6 border-t">
                  <Button variant="outline" className="w-full">
                    ¿Sos profesor?
                  </Button>
                  <Button variant="ghost" className="w-full">
                    Ingresa
                  </Button>
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                    Regístrate
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* ─── HERO ─── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-16 md:py-24 lg:py-32">
          {/* Decorative blobs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-100/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <FadeIn>
                <Badge
                  variant="secondary"
                  className="mb-6 px-4 py-1.5 text-sm font-medium bg-emerald-100 text-emerald-800 border-emerald-200"
                >
                  <Flame className="size-3.5 mr-1" />
                  Inscripciones abiertas para Verano 2024
                </Badge>
              </FadeIn>

              <FadeIn delay={0.1}>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
                  Clases intensivas para{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                    aprobar y avanzar.
                  </span>
                </h1>
              </FadeIn>

              <FadeIn delay={0.2}>
                <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Encontrá cursos intensivos de verano e invierno para materias
                  previas, ingreso universitario, idiomas y mucho más.
                </p>
              </FadeIn>

              <FadeIn delay={0.3}>
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button
                    size="lg"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 text-base shadow-lg shadow-emerald-600/20"
                    asChild
                  >
                    <a href="#search">
                      <Search className="size-4 mr-2" />
                      Buscar cursos
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-8 text-base border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                  >
                    Soy profesor
                  </Button>
                </div>
              </FadeIn>
            </div>

            {/* Promotional Cards */}
            <FadeIn delay={0.4}>
              <div className="mt-14 grid sm:grid-cols-2 gap-4 md:gap-6 max-w-3xl mx-auto">
                <Card className="group relative overflow-hidden border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="flex items-center justify-center size-12 rounded-xl bg-amber-100 text-amber-600 shrink-0 group-hover:scale-110 transition-transform">
                      <Flame className="size-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-foreground">
                        Verano Intensivo
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Aprovecha las vacaciones para estudiar
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="group relative overflow-hidden border-2 border-sky-200 bg-gradient-to-br from-sky-50 to-cyan-50 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="flex items-center justify-center size-12 rounded-xl bg-sky-100 text-sky-600 shrink-0 group-hover:scale-110 transition-transform">
                      <Snowflake className="size-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-foreground">
                        Invierno Intensivo
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Reforzá, repasá y aprobá tus materias
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ─── SEARCH SECTION ─── */}
        <Section id="search">
          <FadeIn>
            <div className="max-w-2xl mx-auto text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                Encontrá tu curso ideal
              </h2>
              <p className="text-muted-foreground mt-3 text-lg">
                Explorá cientos de cursos intensivos en toda Argentina
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <Card className="max-w-5xl mx-auto border-2 shadow-xl">
              <CardContent className="p-4 md:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  <div className="lg:col-span-2">
                    <Select>
                      <SelectTrigger className="w-full h-11">
                        <BookOpen className="size-4 text-muted-foreground mr-1.5" />
                        <SelectValue placeholder="¿Qué querés estudiar?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="matematica">Matemática</SelectItem>
                        <SelectItem value="ingles">Inglés</SelectItem>
                        <SelectItem value="fisica">Física</SelectItem>
                        <SelectItem value="quimica">Química</SelectItem>
                        <SelectItem value="programacion">Programación</SelectItem>
                        <SelectItem value="ingreso">Ingreso Universitario</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Select>
                    <SelectTrigger className="w-full h-11">
                      <MapPin className="size-4 text-muted-foreground mr-1.5" />
                      <SelectValue placeholder="¿Dónde?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">Todas las provincias</SelectItem>
                      <SelectItem value="buenosaires">Buenos Aires</SelectItem>
                      <SelectItem value="cordoba">Córdoba</SelectItem>
                      <SelectItem value="rosario">Rosario</SelectItem>
                      <SelectItem value="mendoza">Mendoza</SelectItem>
                      <SelectItem value="tucuman">Tucumán</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="w-full h-11">
                      <Monitor className="size-4 text-muted-foreground mr-1.5" />
                      <SelectValue placeholder="Modalidad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="presencial">Presencial</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="w-full h-11">
                      <Calendar className="size-4 text-muted-foreground mr-1.5" />
                      <SelectValue placeholder="Cuándo?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas</SelectItem>
                      <SelectItem value="verano">Verano</SelectItem>
                      <SelectItem value="invierno">Invierno</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="mt-4 flex justify-center">
                  <Button
                    size="lg"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 shadow-lg shadow-emerald-600/20"
                  >
                    <Search className="size-4 mr-2" />
                    Buscar cursos
                  </Button>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Popular searches */}
          <FadeIn delay={0.2}>
            <div className="max-w-5xl mx-auto mt-8 text-center">
              <p className="text-sm text-muted-foreground mb-3">
                Búsquedas populares:
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {popularSearches.map((term) => (
                  <Badge
                    key={term}
                    variant="secondary"
                    className="px-4 py-1.5 text-sm cursor-pointer hover:bg-emerald-100 hover:text-emerald-800 transition-colors"
                  >
                    {term}
                  </Badge>
                ))}
              </div>
            </div>
          </FadeIn>
        </Section>

        {/* ─── NICHOS DESTACADOS ─── */}
        <Section id="nichos" bg>
          <SectionHeading
            title="Ejemplos de nichos que funcionan"
            subtitle="Descubrí algunas de las áreas más demandadas en clases intensivas"
          />
          <div className="grid sm:grid-cols-2 gap-4 md:gap-6 max-w-5xl mx-auto">
            {nichos.map((n, i) => (
              <FadeIn key={n.title} delay={i * 0.1}>
                <Card className="group h-full hover:shadow-lg hover:border-emerald-200 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex items-center justify-center size-12 rounded-xl bg-emerald-50 text-emerald-700 shrink-0 group-hover:bg-emerald-100 transition-colors">
                        {n.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-base text-foreground leading-snug">
                          {n.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                          {n.desc}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </Section>

        {/* ─── CATEGORÍAS ─── */}
        <Section id="categorias">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 md:mb-16 gap-4">
            <FadeIn>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                  Explorá por categoría
                </h2>
                <p className="text-muted-foreground mt-2 text-lg">
                  Encontrá el curso perfecto para vos
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <a
                href="#"
                className="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center gap-1 group"
              >
                Ver todas las categorías
                <ChevronRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </FadeIn>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {categorias.map((cat, i) => (
              <FadeIn key={cat.name} delay={i * 0.08}>
                <Card className="group cursor-pointer hover:shadow-lg hover:border-emerald-200 transition-all text-center h-full">
                  <CardContent className="p-5 md:p-6 flex flex-col items-center gap-3">
                    <div className="flex items-center justify-center size-14 rounded-2xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100 group-hover:scale-110 transition-all">
                      {cat.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-foreground">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {cat.count} cursos
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </Section>

        {/* ─── CÓMO FUNCIONA ─── */}
        <Section id="como-funciona" bg>
          <SectionHeading title="¿Cómo funciona?" />

          <div className="grid md:grid-cols-3 gap-8 md:gap-12 max-w-5xl mx-auto">
            {steps.map((step, i) => (
              <FadeIn key={step.title} delay={i * 0.15} className="text-center">
                <div className="relative mx-auto mb-6">
                  <div className="flex items-center justify-center size-20 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto">
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 flex items-center justify-center size-8 rounded-full bg-emerald-600 text-white text-sm font-bold">
                    {i + 1}
                  </div>
                </div>
                <h3 className="font-bold text-lg text-foreground">{step.title}</h3>
                <p className="text-muted-foreground mt-2 leading-relaxed">
                  {step.desc}
                </p>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[calc(50%+60px)] w-[calc(100%-120px)] h-[2px] bg-emerald-200" />
                )}
              </FadeIn>
            ))}
          </div>
        </Section>

        {/* ─── PROFESORES DESTACADOS ─── */}
        <Section id="profesores">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 md:mb-16 gap-4">
            <FadeIn>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                  Profesores destacados
                </h2>
                <p className="text-muted-foreground mt-2 text-lg">
                  Aprendé con los mejores profesores del país
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <a
                href="#"
                className="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center gap-1 group"
              >
                Ver todos los profesores
                <ChevronRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
            {profesores.map((prof, i) => (
              <FadeIn key={prof.name} delay={i * 0.08}>
                <Card className="group hover:shadow-lg hover:border-emerald-200 transition-all h-full">
                  <CardContent className="p-5 text-center">
                    <Avatar className="size-16 mx-auto mb-3 ring-2 ring-emerald-100">
                      <AvatarFallback className="bg-emerald-50 text-emerald-700 text-lg font-bold">
                        {prof.initials}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold text-base text-foreground">
                      {prof.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {prof.subject}
                    </p>
                    <div className="flex items-center justify-center gap-1 mt-1.5 text-xs text-muted-foreground">
                      <MapPin className="size-3" />
                      {prof.location}
                    </div>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      <Star className="size-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-semibold text-foreground">
                        {prof.rating}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({prof.reviews} reseñas)
                      </span>
                    </div>
                    <Badge
                      variant={
                        prof.modality === 'Online' ? 'default' : 'secondary'
                      }
                      className={`mt-3 text-xs ${
                        prof.modality === 'Online'
                          ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      <Monitor className="size-3 mr-0.5" />
                      {prof.modality}
                    </Badge>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </Section>

        {/* ─── BLOG ─── */}
        <Section id="blog" bg>
          <SectionHeading
            title="Consejos, guías y recursos en nuestro blog"
            subtitle="Enterate de estrategias para estudiar mejor y aprobar tus materias."
          />

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {blogArticles.map((article, i) => (
              <FadeIn key={article.title} delay={i * 0.1}>
                <Card className="group hover:shadow-lg hover:border-emerald-200 transition-all h-full cursor-pointer">
                  {/* Colored header bar */}
                  <div className="h-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-t-lg" />
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge
                        variant="secondary"
                        className="bg-emerald-50 text-emerald-700 border-emerald-100"
                      >
                        {article.icon}
                        {article.tag}
                      </Badge>
                    </div>
                    <h3 className="font-bold text-lg text-foreground group-hover:text-emerald-700 transition-colors leading-snug">
                      {article.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                      {article.desc}
                    </p>
                    <div className="mt-4 flex items-center gap-1 text-sm text-emerald-600 font-medium">
                      Leer más
                      <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.3}>
            <div className="text-center mt-10">
              <Button
                variant="outline"
                className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 px-8"
              >
                <Newspaper className="size-4 mr-2" />
                Ir al blog
              </Button>
            </div>
          </FadeIn>
        </Section>

        {/* ─── HISTORIA UNIVERSAL ─── */}
        <section id="historia" className="relative overflow-hidden bg-gradient-to-b from-amber-50/50 via-white to-orange-50/30 py-16 md:py-24">
          <div className="absolute top-20 right-10 w-72 h-72 bg-amber-100/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-64 h-64 bg-orange-100/20 rounded-full blur-3xl" />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Course Header */}
            <FadeIn>
              <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
                <Badge className="mb-4 px-4 py-1.5 text-sm font-medium bg-amber-100 text-amber-800 border-amber-200 gap-1.5">
                  <History className="size-3.5" />
                  Curso intensivo
                </Badge>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
                  Historia Universal
                </h2>
                <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  De la prehistoria a la actualidad — Basado en{' '}
                  <span className="font-semibold text-amber-700">'Toda la Historia del mundo'</span> de
                  Barreau y Bigot
                </p>

                {/* Decorative progress bar */}
                <div className="mt-6 max-w-lg mx-auto">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                    <span>Cap. 1 — Prehistoria</span>
                    <span>Cap. 37 — Globalización</span>
                  </div>
                  <Progress value={100} className="h-3 bg-amber-100" />
                  <div className="flex gap-1 mt-3 justify-center flex-wrap">
                    {progressEras.map((era) => (
                      <span
                        key={era.name}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground"
                      >
                        <span className={`inline-block size-2 rounded-full ${era.color}`} />
                        {era.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Region Cards — Accordion */}
            <FadeIn delay={0.1}>
              <div className="max-w-4xl mx-auto">
                <h3 className="text-xl md:text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <BookMarked className="size-5 text-amber-600" />
                  Regiones del mundo
                </h3>
                <Accordion type="multiple" className="space-y-3">
                  {historyRegions.map((region, idx) => (
                    <FadeIn key={region.id} delay={idx * 0.04}>
                      <AccordionItem
                        value={region.id}
                        className="bg-card border-2 border-amber-100 rounded-xl px-4 data-[state=open]:border-amber-300 data-[state=open]:shadow-md transition-all"
                      >
                        <AccordionTrigger className="hover:no-underline py-4">
                          <div className="flex items-center gap-3 text-left">
                            <div className="flex items-center justify-center size-10 rounded-lg bg-amber-50 text-amber-600 shrink-0">
                              <RegionIcon icon={region.icon} className="size-5" />
                            </div>
                            <div>
                              <span className="font-semibold text-base text-foreground block">
                                {region.name}
                              </span>
                              <span className="text-xs text-muted-foreground block mt-0.5 line-clamp-1">
                                {region.intro}
                              </span>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4">
                          <div className="space-y-4 pt-1">
                            {/* Full intro */}
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {region.intro}
                            </p>

                            {/* Content */}
                            {Array.isArray(region.content) ? (
                              <ul className="space-y-1.5 text-sm text-foreground">
                                {region.content.map((item, i) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <ChevronRight className="size-3.5 text-amber-500 mt-0.5 shrink-0" />
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-sm text-foreground leading-relaxed bg-muted/50 rounded-lg p-4 border border-border/50">
                                {region.content as string}
                              </p>
                            )}

                            {/* Activity card */}
                            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-200/60">
                              <div className="flex items-center gap-2 mb-2">
                                <Lightbulb className="size-4 text-amber-600" />
                                <span className="text-xs font-semibold text-amber-800 uppercase tracking-wide">
                                  Actividad: {region.activityType}
                                </span>
                              </div>
                              <p className="text-sm text-foreground leading-relaxed">
                                {region.activity}
                              </p>
                              <div className="flex items-center gap-3 mt-3 flex-wrap">
                                <DifficultyBadge level={region.difficulty} />
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Clock className="size-3" />
                                  {region.time}
                                </span>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </FadeIn>
                  ))}
                </Accordion>
              </div>
            </FadeIn>

            {/* Activities Section */}
            <FadeIn delay={0.15}>
              <div className="max-w-4xl mx-auto mt-16">
                <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
                  <PenTool className="size-5 text-amber-600" />
                  Actividades del curso
                </h3>
                <p className="text-muted-foreground mb-8 text-sm">
                  10 actividades prácticas para profundizar en cada región del mundo
                </p>

                {/* Category badges */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {activityCategories.map((cat) => (
                    <Badge
                      key={cat.label}
                      variant="outline"
                      className={`${cat.color} text-xs gap-1`}
                    >
                      <FileText className="size-3" />
                      {cat.label}
                      <span className="ml-1 opacity-60">({cat.count})</span>
                    </Badge>
                  ))}
                </div>

                {/* Activity cards grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {historyRegions.map((region, idx) => (
                    <FadeIn key={region.id} delay={idx * 0.05}>
                      <Card className="group hover:shadow-lg hover:border-amber-200 transition-all h-full cursor-pointer">
                        <CardContent className="p-5 flex flex-col gap-3">
                          {/* Header */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center justify-center size-8 rounded-lg bg-amber-50 text-amber-600 shrink-0">
                                <RegionIcon icon={region.icon} className="size-4" />
                              </div>
                              <Avatar className="size-6">
                                <AvatarFallback className="bg-amber-100 text-amber-700 text-[10px] font-bold">
                                  {region.id.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                            </div>
                            <DifficultyBadge level={region.difficulty} />
                          </div>

                          {/* Activity type */}
                          <Badge
                            variant="outline"
                            className="w-fit text-xs bg-amber-50 text-amber-700 border-amber-200"
                          >
                            {region.activityType}
                          </Badge>

                          {/* Title */}
                          <h4 className="font-semibold text-sm text-foreground leading-snug line-clamp-3">
                            {region.activity}
                          </h4>

                          {/* Region tag + time */}
                          <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/50">
                            <Badge variant="secondary" className="text-[10px] px-2 py-0.5">
                              <Globe className="size-2.5 mr-0.5" />
                              {region.name.split(' y ')[0]}
                            </Badge>
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                              <Clock className="size-2.5" />
                              {region.time}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </FadeIn>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* Course Progress Tracker — Horizontal scrollable */}
            <FadeIn delay={0.2}>
              <div className="max-w-4xl mx-auto mt-16">
                <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
                  <BarChart3 className="size-5 text-amber-600" />
                  Progreso del curso
                </h3>
                <p className="text-muted-foreground mb-6 text-sm">
                  Los 37 capítulos del libro, agrupados por era histórica
                </p>

                <ScrollArea className="w-full">
                  <div className="flex gap-4 pb-4 min-w-max">
                    {progressEras.map((era) => (
                      <div
                        key={era.name}
                        className="flex flex-col items-center gap-2 min-w-[140px]"
                      >
                        <div className={`w-full h-2 rounded-full ${era.color}`} />
                        <span className="text-sm font-semibold text-foreground">{era.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {era.chapters.join(', ')}
                        </span>
                        <div className="flex items-center gap-1">
                          <Progress
                            value={era.range[1] - era.range[0]}
                            className="h-1.5 w-24 bg-muted"
                          />
                          <span className="text-[10px] text-muted-foreground">
                            {era.range[1] - era.range[0]}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>

                {/* Era color legend */}
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {progressEras.map((era) => (
                    <div
                      key={era.name}
                      className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 rounded-lg px-3 py-2"
                    >
                      <span className={`inline-block size-3 rounded-full ${era.color} shrink-0`} />
                      <span className="font-medium text-foreground">{era.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* Book reference */}
            <FadeIn delay={0.25}>
              <div className="max-w-2xl mx-auto mt-16 text-center">
                <div className="inline-flex items-center gap-2 bg-card border border-border rounded-full px-5 py-2.5 shadow-sm">
                  <BookOpen className="size-4 text-amber-600" />
                  <span className="text-sm text-muted-foreground">
                    Contenido basado en{' '}
                    <span className="font-semibold text-foreground">
                      'Toda la Historia del mundo'
                    </span>{' '}
                    de Jean-Claude Barreau y Guillaume Bigot
                  </span>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ─── NEWSLETTER ─── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 to-teal-700 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-40 h-40 border border-white/30 rounded-full" />
            <div className="absolute bottom-10 right-10 w-60 h-60 border border-white/20 rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-white/10 rounded-full" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <FadeIn>
              <div className="max-w-2xl mx-auto text-center">
                <div className="flex items-center justify-center size-14 rounded-2xl bg-white/15 text-white mx-auto mb-6">
                  <Mail className="size-7" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                  Recibí cursos, consejos y novedades
                </h2>
                <p className="mt-4 text-emerald-100 text-lg leading-relaxed">
                  Suscribite a nuestro newsletter y enterate de las últimas novedades
                  directamente en tu correo.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto">
                  <Input
                    placeholder="Tu correo electrónico"
                    type="email"
                    className="h-12 bg-white/10 border-white/20 text-white placeholder:text-emerald-200/70 focus-visible:border-white/50 focus-visible:ring-white/20"
                  />
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-white text-emerald-700 hover:bg-emerald-50 font-semibold shadow-lg px-8"
                  >
                    Suscribíte
                  </Button>
                </div>

                <p className="mt-4 text-xs text-emerald-200/60">
                  Sin spam. Cancelá cuando quieras.
                </p>
              </div>
            </FadeIn>
          </div>
        </section>
      </main>

      {/* ─── FOOTER ─── */}
      <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center justify-center size-9 rounded-lg bg-emerald-600 text-white">
                  <Sparkles className="size-5" />
                </div>
                <span className="text-xl font-bold text-white">IntensivaAR</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
                La plataforma líder en clases intensivas de verano e invierno en todo
                el país. Conectamos estudiantes con los mejores profesores.
              </p>
              <div className="flex items-center gap-3 mt-6">
                {[
                  { icon: <Instagram className="size-5" />, label: 'Instagram' },
                  { icon: <Facebook className="size-5" />, label: 'Facebook' },
                  { icon: <Twitter className="size-5" />, label: 'Twitter' },
                  { icon: <Youtube className="size-5" />, label: 'YouTube' },
                ].map((social) => (
                  <a
                    key={social.label}
                    href="#"
                    aria-label={social.label}
                    className="flex items-center justify-center size-10 rounded-lg bg-slate-800 text-slate-400 hover:bg-emerald-600 hover:text-white transition-all"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Navigation columns */}
            {Object.entries(footerNav).map(([title, links]) => (
              <div key={title}>
                <h3 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">
                  {title}
                </h3>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-slate-400 hover:text-emerald-400 transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-slate-800">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-slate-500">
                © 2024 IntensivaAR. Todos los derechos reservados.
              </p>
              <p className="text-sm text-slate-500">
                Hecho con{' '}
                <span className="text-rose-400" role="img" aria-label="amor">
                  ❤️
                </span>{' '}
                en Argentina{' '}
                <span role="img" aria-label="bandera de Argentina">
                  🇦🇷
                </span>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
