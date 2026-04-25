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
  BookOpen,
  Globe,
  Users,
  Sword,
  Palette,
  Landmark,
  Compass,
  Flag,
  Factory,
  Rocket,
} from 'lucide-react';
import SiteNavbar from '@/components/site-navbar';
import SiteFooter from '@/components/site-footer';

const periodIcons = [Globe, Compass, Landmark, Sword, Palette, Users, Flag, Rocket, Factory, BookOpen];

const periodColors = [
  { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-800/40', accent: 'bg-amber-500' },
  { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-800/40', accent: 'bg-blue-500' },
  { bg: 'bg-violet-100 dark:bg-violet-900/30', text: 'text-violet-700 dark:text-violet-300', border: 'border-violet-200 dark:border-violet-800/40', accent: 'bg-violet-500' },
  { bg: 'bg-rose-100 dark:bg-rose-900/30', text: 'text-rose-700 dark:text-rose-300', border: 'border-rose-200 dark:border-rose-800/40', accent: 'bg-rose-500' },
  { bg: 'bg-teal-100 dark:bg-teal-900/30', text: 'text-teal-700 dark:text-teal-300', border: 'border-teal-200 dark:border-teal-800/40', accent: 'bg-teal-500' },
  { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-300', border: 'border-orange-200 dark:border-orange-800/40', accent: 'bg-orange-500' },
  { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300', border: 'border-red-200 dark:border-red-800/40', accent: 'bg-red-500' },
  { bg: 'bg-sky-100 dark:bg-sky-900/30', text: 'text-sky-700 dark:text-sky-300', border: 'border-sky-200 dark:border-sky-800/40', accent: 'bg-sky-500' },
  { bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-200 dark:border-indigo-800/40', accent: 'bg-indigo-500' },
  { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-800/40', accent: 'bg-emerald-500' },
];

const timelinePeriods = [
  {
    id: 'prehistoria',
    name: 'Prehistoria y Orígenes',
    era: '~3.000.000 a.C. – 3.000 a.C.',
    description:
      'La prehistoria humana se origina en África oriental, donde hace 200-300 mil años grupos de primates inventaron el lenguaje. Lucy, el famoso australopiteco descubierto en Etiopía en 1974, representa uno de los fósiles más importantes del origen del ser humano y vivió hace aproximadamente 3,2 millones de años. Las mutaciones genéticas y el desarrollo del lenguaje permitieron el paso del Estrecho de Bering hacia América, en un proceso migratorio que se extendió durante miles de años. Los primeros homínidos evolucionaron desde primates arborícolas hasta convertirse en bípedos, lo que liberó sus manos para fabricar herramientas. El dominio del fuego, hace unos 400.000 años, fue otro hito crucial que permitió cocinar alimentos, protegerse del frío y iluminar cuevas. La revolución neolítica, hace unos 10.000 años, marcó el paso del nomadismo a la agricultura y la sedentarización.',
    topics: [
      'Origen del ser humano en África oriental (Gran Valle del Rift)',
      'Lucy (Australopithecus afarensis) y los australopitecos',
      'Evolución de homínidos: Homo habilis, Homo erectus, Homo sapiens',
      'Invención del lenguaje y comunicación primitiva',
      'Dominio del fuego y su impacto en la supervivencia',
      'Revolución neolítica: agricultura, ganadería y sedentarización',
      'Mutaciones genéticas evolutivas y adaptación climática',
      'Paso del Estrecho de Bering hacia América',
      'Pinturas rupestres y arte prehistórico (Altamira, Lascaux)',
    ],
    activity: 'Investigación: ¿Cuáles fueron las condiciones geográficas y climáticas que permitieron el paso del ser humano desde Asia hacia América a través del Estrecho de Bering? Analizá cómo el fin de la última Edad de Hielo influyó en las rutas migratorias.',
    activityType: 'Investigación',
    difficulty: 'Medio',
    time: '40 min',
  },
  {
    id: 'pangea',
    name: 'Pangea y Primeras Civilizaciones',
    era: '~3.500 a.C. – 500 a.C.',
    description:
      'Los ríos nutricios (Nilo, Éufrates, Tigris, Indo) fueron el hogar de las primeras grandes civilizaciones. En Sumeria (actual Irak) surgió la escritura cuneiforme hacia el 3.400 a.C., considerada la primera forma de escritura de la humanidad, grabada en tablillas de arcilla. En Egipto se construyeron las grandes pirámides de Giza bajo el sistema faraónico, con un conocimiento astronómico y matemático impresionante que sigue asombrando a los científicos modernos. La aparición de la escritura marcó el fin de la prehistoria y el inicio de la historia documentada. En el valle del Indo florecieron las ciudades de Mohenjo-Daro y Harappa con sistemas de drenaje avanzados. En China, la dinastía Shang desarrolló la escritura sobre huesos oraculares y construyó las primeras ciudades amuralladas. La agricultura de riego permitió excedentes alimentarios que sustentaron poblaciones cada vez más grandes y complejas.',
    topics: [
      'Ríos nutricios: Nilo, Éufrates, Tigris, Indo y Amarillo',
      'Sumeria y la escritura cuneiforme (primeras tablillas)',
      'Egipto faraónico, las pirámides y la religión osiriana',
      'Código de Hammurabi: primer código de leyes escrito',
      'Primeros Estados teocráticos y religiones antiguas',
      'Civilización del Valle del Indo (Mohenjo-Daro, Harappa)',
      'Dinastía Shang en China y los huesos oraculares',
      'Aparición de la escritura: fin de la prehistoria',
      'Agricultura de riego y excedentes alimentarios',
    ],
    activity: 'Compará la organización del Imperio egipcio con la de Sumeria. ¿Qué similitudes y diferencias encontrás en su forma de gobierno, religión, sistema de escritura y organización social? Incluí un cuadro comparativo.',
    activityType: 'Investigación',
    difficulty: 'Medio',
    time: '45 min',
  },
  {
    id: 'mundo-antiguo',
    name: 'Mundo Antiguo',
    era: '~800 a.C. – 476 d.C.',
    description:
      'El mundo antiguo estuvo dominado por civilizaciones como Grecia y Roma, pero también por el Imperio persa, las culturas fenicias (grandes navegantes y comerciantes que fundaron Cartago) y el pueblo judío con su monoteísmo revolucionario. Alejandro Magno, rey de Macedonia, realizó la primera gran globalización al conquistar territorios desde Grecia hasta la India en solo 13 años (334-323 a.C.), difundiendo la cultura helenística por todo el mundo conocido. Cartago y Roma libraron las Guerras Púnicas, donde Aníbal cruzó los Alpes con elefantes para invadir Italia, aunque finalmente fue derrotado por Escipión. Julio César transformó la República romana en Imperio, y posteriormente el cristianismo, nacido en Judea, se convirtió en la religión oficial del Imperio romano bajo Constantino. El judeo-cristianismo sentó las bases morales y culturales del mundo occidental que perduran hasta hoy.',
    topics: [
      'Cretenses (Palacio de Cnossos), fenicios (alfabeto) y judíos (monoteísmo)',
      'El Imperio persa: Ciro el Grande y Darío I',
      'Alejandro Magno: la primera globalización y el mundo helenístico',
      'Cartago y Roma: las Guerras Púnicas, Aníbal y César',
      'La República y el Imperio romano: de Augusto a la caída',
      'Democracia ateniense, filosofía griega (Sócrates, Platón, Aristóteles)',
      'El judeo-cristianismo y la moral occidental',
      'Ingeniería romana: calzadas, acueductos, coliseos',
    ],
    activity: 'Reflexioná: ¿Por qué se dice que Alejandro Magno realizó la "primera globalización"? ¿Qué impacto tuvieron sus conquistas en la difusión cultural entre Oriente y Occidente? Analizá qué elementos culturales se mezclaron.',
    activityType: 'Reflexión',
    difficulty: 'Medio',
    time: '35 min',
  },
  {
    id: 'edad-media',
    name: 'Edad Media',
    era: '476 d.C. – 1453 d.C.',
    description:
      'Tras la caída de Roma en 476 d.C., Europa entró en un período de fragmentación política y cultural conocido como la Edad Media, que duró casi mil años. Los pueblos germánicos (godos, vikingos, francos) invadieron y se asentaron en los territorios del antiguo Imperio. Carlomagno intentó restaurar el imperio en el año 800, pero su obra se fragmentó tras su muerte. Las cruzadas (1096-1291) marcaron el choque violento entre el mundo cristiano y el islámico por el control de Jerusalén y los lugares santos. El Islam, nacido en Arabia con Mahoma en el siglo VII, se expandió rápidamente desde España hasta la India, creando una civilización brillante en ciencia, matemáticas y filosofía. El nacimiento de las naciones europeas (Francia, Inglaterra, España) se consolidó lentamente. La Guerra de los Cien Años (1337-1453) entre Francia e Inglaterra, y la figura de Juana de Arco, definieron el final de este período. La Peste Negra (1347-1351) mató a un tercio de la población europea.',
    topics: [
      'Caída del Imperio romano de Occidente (476 d.C.)',
      'Los tiempos bárbaros: godos, vikingos, lombardos, francos',
      'Carlomagno y el Sacro Imperio Romano Germánico',
      'El Islam: Mahoma, expansión árabe y civilización islámica',
      'Las Cruzadas: conflicto cristiano-musulmán por Tierra Santa',
      'Feudalismo: señores, vasallos, siervos y castillos',
      'La Peste Negra (1347-1351) y sus consecuencias',
      'Nacimiento de las naciones europeas',
      'Guerra de los Cien Años y Juana de Arco',
    ],
    activity: 'Línea de tiempo: Armá una cronología con los 5 eventos más importantes de la Edad Media. Justificá tu selección y explicá cómo cada evento influyó en el siguiente.',
    activityType: 'Línea de tiempo',
    difficulty: 'Difícil',
    time: '50 min',
  },
  {
    id: 'renacimiento',
    name: 'Renacimiento y Reformas',
    era: '1453 d.C. – 1648 d.C.',
    description:
      'Los grandes descubrimientos geográficos transformaron el mundo para siempre. Cristóbal Colón llegó a América en 1492, y posteriormente Magallanes-Elcano completaron la primera circunnavegación del globo (1519-1522), demostrando que la Tierra es redonda. La muerte de las civilizaciones precolombinas (aztecas e incas) fue consecuencia directa del encuentro con los europeos, que trajeron armas, enfermedades y un afán de conquista. Carlos V gobernó un imperio inmenso donde "no se ponía el sol", abarcando España, Alemania, Italia, los Países Bajos y amplios territorios en América. Miguel Ángel, Leonardo da Vinci y Maquiavelo fueron figuras clave del Renacimiento italiano, que redescubrió los valores clásicos de Grecia y Roma. Las reformas religiosas de Lutero (1517) y Calvino dividieron a la cristiandad y provocaron guerras de religión devastadoras en toda Europa, culminando en la Guerra de los Treinta Años (1618-1648) y la Paz de Westfalia.',
    topics: [
      'Los grandes descubrimientos geográficos (Colón, Vasco da Gama, Magallanes)',
      'Muerte de las civilizaciones precolombinas y choque cultural',
      'Carlos V y Francisco I: rivalidad franco-española',
      'Reformas religiosas: Lutero, Calvino y la Contrarreforma',
      'Miguel Ángel, Leonardo da Vinci, Rafael: el Renacimiento italiano',
      'Maquiavelo y "El Príncipe": pensamiento político moderno',
      'Imprenta de Gutenberg (1440): revolución en la difusión del conocimiento',
      'Guerra de los Treinta Años y la Paz de Westfalia',
    ],
    activity: 'Ensayo: ¿Cómo influyeron los grandes descubrimientos geográficos en el Renacimiento europeo? Analizá la relación entre ciencia, arte y expansión territorial durante los siglos XV y XVI.',
    activityType: 'Ensayo',
    difficulty: 'Difícil',
    time: '60 min',
  },
  {
    id: 'america-precolombina',
    name: 'América Precolombina',
    era: '~2.000 a.C. – 1492 d.C.',
    description:
      'Antes de la llegada de los europeos, América albergaba civilizaciones avanzadas con logros extraordinarios. Los olmecas, considerados la "cultura madre" de Mesoamérica, desarrollaron la primera escritura de América y dejaron sus famosas cabezas colosales de piedra. Los mayas, ya en decadencia para la llegada de los españoles, habían logrado avances impresionantes en escritura jeroglífica, matemáticas (incluyendo el concepto del cero) y astronomía. Construyeron ciudades-estado como Tikal, Palenque y Chichén Itzá con pirámides y observatorios. Los aztecas construyeron un imperio guerrero en México con su capital Tenochtitlán, una ciudad de más de 200.000 habitantes construida sobre una isla del lago Texcoco, considerada una de las ciudades más grandes del mundo en su época. Los incas extendieron su dominio (Tahuantinsuyo) desde Ecuador hasta Chile, con un sistema de caminos (Qhapaq Ñan) de más de 40.000 km y una notable administración centralizada. Su capital Cusco era el centro del mundo andino.',
    topics: [
      'Olmecas: cultura madre de Mesoamérica',
      'Civilización maya: escritura, matemáticas (cero), astronomía',
      'Ciudades mayas: Tikal, Palenque, Chichén Itzá, Copán',
      'Imperio azteca/mexica y Tenochtitlán (200.000+ habitantes)',
      'Imperio inca (Tahuantinsuyo): de Ecuador a Chile',
      'Sistema de caminos inca (Qhapaq Ñan: 40.000 km)',
      'Religiones, sacrificios humanos y cosmovisión andina',
      'Innovaciones agrícolas: chinampas, terrazas, waru waru',
    ],
    activity: 'Investigación: Los mayas inventaron el cacao, el maíz y el tomate. Elegí uno de estos productos y trazá su historia desde la civilización maya hasta nuestra mesa actual. ¿Cómo cambió el mundo la introducción de estos productos en Europa?',
    activityType: 'Investigación',
    difficulty: 'Fácil',
    time: '50 min',
  },
  {
    id: 'conquista-colonia',
    name: 'Conquista y Colonia',
    era: '1492 d.C. – 1810 d.C.',
    description:
      'La conquista de América fue uno de los episodios más dramáticos de la historia universal. Hernán Cortés llegó a México en 1519 con apenas 500 hombres y, en alianza con pueblos enemigos de los aztecas, logró tomar Tenochtitlán en 1521 tras una sangrienta batalla. La "Noche Triste" (1520) fue la derrota temporal de los españoles cuando intentaron escapar de la capital azteca. Francisco Pizarro, con solo 163 hombres, capturó al emperador inca Atahualpa en Cajamarca (1532) y posteriormente ejecutó, conquistando el mayor imperio de América del Sur. El "desfase temporal" explica cómo un puñado de europeos pudo vencer civilizaciones enteras: las armas de fuego, los caballos, las enfermedades (viruela, sarampión) y la superioridad tecnológica fueron determinantes. La colonización española transformó radicalmente el continente americano, estableciendo el sistema de encomiendas, las misiones jesuíticas, nuevas ciudades fundadas sobre las antiguas capitales indígenas, la imposición del catolicismo y sistemas de gobierno que durarían tres siglos. El mestizaje racial y cultural creó una nueva identidad americana.',
    topics: [
      'Cristóbal Colón y el "descubrimiento" de América (1492)',
      'Cortés y la conquista de México (1519-1521)',
      'La Noche Triste y la caída de Tenochtitlán',
      'Pizarro y la captura de Atahualpa en Cajamarca (1532)',
      'El "desfase temporal" entre europeos y americanos',
      'Colonización española: encomiendas, mita, misiones jesuíticas',
      'Virreinatos: Nueva España, Perú, Río de la Plata',
      'Mestizaje, sincretismo cultural y religioso',
    ],
    activity: 'Reflexioná: ¿Por qué creés que un grupo de 163 españoles pudo derrotar al Imperio inca de millones de personas? Enumerá al menos 3 factores y explicá cada uno con detalles históricos.',
    activityType: 'Reflexión',
    difficulty: 'Difícil',
    time: '30 min',
  },
  {
    id: 'independencia',
    name: 'Independencia de América',
    era: '1810 d.C. – 1825 d.C.',
    description:
      'Las revoluciones de independencia sudamericanas fueron lideradas por figuras legendarias como José de San Martín y Simón Bolívar. San Martín cruzó los Andes en 1817 con un ejército de 5.400 hombres, una hazaña militar considerada una de las más grandes de la historia, para liberar Chile y luego Perú. Simón Bolívar, el "Libertador", lideró las campañas de independencia en Venezuela, Colombia, Ecuador, Perú y Bolivia (que lleva su nombre). Sin embargo, el sueño de una Gran Colombia unida se desmoronó rápidamente por rivalidades políticas y regionales. El libro de Barreau y Bigot señala problemas graves de la independencia: la falta de unión y el apartheid indígena, ya que las insurrecciones fueron revueltas de colonos criollos donde los indígenas y mestizos participaron poco y continuaron marginados. El Imperio español se fragmentó en más de una docena de repúblicas, muchas de ellas inestables y con fronteras artificiales heredadas de la administración colonial.',
    topics: [
      'José de San Martín: cruce de los Andes (1817)',
      'Simón Bolívar y la Gran Colombia',
      'Revoluciones de independencia: causas y procesos',
      'Guerras de independencia en el Río de la Plata',
      'Fragmentación latinoamericana: de la unidad al caos',
      'El apartheid indígena: los excluidos de la independencia',
      'Congreso de Tucumán (1816) y declaración de independencia',
      'Monarquías, repúblicas y caudillos en el siglo XIX',
    ],
    activity: 'Debate: ¿Por qué América Latina se dividió en tantos países mientras América del Norte se unificó? ¿Qué factores explican esta diferencia? Considerá: geografía, economía, composición social y liderazgo.',
    activityType: 'Debate',
    difficulty: 'Difícil',
    time: '60 min',
  },
  {
    id: 'siglo-xix',
    name: 'Siglo XIX',
    era: '1815 d.C. – 1914 d.C.',
    description:
      'El siglo XIX fue una era de transformaciones profundas. La Revolución Industrial, nacida en Inglaterra en el siglo XVIII, transformó la economía y la sociedad al pasar de la producción artesanal a la producción en fábricas con máquinas de vapor. La invención del ferrocarril, el telégrafo y la electricidad revolucionaron las comunicaciones y el transporte. Las unificaciones de Italia (1861, bajo Cavour y Garibaldi) y Alemania (1871, bajo Bismarck) crearon nuevas potencias europeas que alteraron el equilibrio de poder. Las potencias coloniales (Inglaterra, Francia, Alemania, Bélgica) expandieron sus imperios por África y Asia en la "carrera por África", repartiéndose el continente como si fuera un pastel en la Conferencia de Berlín (1884-1885). La expansión hacia el oeste de Estados Unidos, con la doctrina del "destino manifiesto", tuvo consecuencias devastadoras para los pueblos indígenas norteamericanos, que fueron confinados en reservaciones. La Revolución Francesa (1789) y las ideas de libertad, igualdad y fraternidad siguieron inspirando movimientos políticos en todo el mundo.',
    topics: [
      'Revolución Industrial: de la fábrica a la sociedad de masas',
      'Innovaciones tecnológicas: ferrocarril, telégrafo, electricidad',
      'Unificación de Italia: Cavour, Garibaldi y Víctor Manuel II',
      'Unificación de Alemania: Bismarck y el Imperio germano',
      'Conferencia de Berlín (1884-1885) y el reparto colonial de África',
      'Expansiones coloniales en Asia (India, Indochina, China)',
      'Expansión hacia el oeste en EE.UU. y el "destino manifiesto"',
      'Movimientos obreros, socialismo (Marx) y revoluciones liberales',
    ],
    activity: 'Análisis: ¿Qué impacto tuvo la Revolución Industrial en las relaciones entre las potencias europeas durante el siglo XIX? ¿Contribuyó a la paz o a la tensión? Relacioná el desarrollo económico con el imperialismo colonial.',
    activityType: 'Análisis',
    difficulty: 'Medio',
    time: '45 min',
  },
  {
    id: 'contemporanea',
    name: 'Historia Contemporánea',
    era: '1914 d.C. – actualidad',
    description:
      'Las dos Guerras Mundiales marcaron el siglo XX como el más violento de la historia. La Primera Guerra Mundial (1914-1918), causada por rivalidades imperialistas, nacionalismos y alianzas secretas, acabó con millones de vidas y destruyó cuatro imperios (ruso, austro-húngaro, otomano y alemán). La Revolución rusa de 1917 creó la URSS, el primer Estado socialista, iniciando la Guerra Fría que dividiría al mundo en dos bloques (capitalista y comunista) durante casi medio siglo. La Segunda Guerra Mundial (1939-1945), provocada por el nazismo de Hitler, el fascismo de Mussolini y el imperialismo japonés, fue aún más devastadora con el Holocausto y el uso de armas nucleares sobre Hiroshima y Nagasaki. Posteriormente, la descolonización transformó el mapa político global: más de 80 nuevos países surgieron en África y Asia entre 1945 y 1980. La caída del Muro de Berlín (1989) y la disolución de la URSS (1991) pusieron fin a la Guerra Fría. Finalmente, la globalización conectó al mundo entero en una red económica, digital y cultural sin precedentes en la historia de la humanidad.',
    topics: [
      'Primera Guerra Mundial (1914-1918): causas y consecuencias',
      'Revolución rusa (1917) y nacimiento de la URSS',
      'Crisis de 1929 y ascenso de los totalitarismos',
      'Segunda Guerra Mundial (1939-1945) y el Holocausto',
      'Guerra Fría: bloque capitalista vs. bloque comunista',
      'Descolonización de África y Asia (1945-1980)',
      'Caída del Muro de Berlín (1989) y fin de la URSS (1991)',
      'Globalización: economía digital, internet y mundo interconectado',
    ],
    activity: 'Ensayo comparativo: Analizá las causas de la Primera y Segunda Guerra Mundial. ¿Qué elementos se repiten y qué factores son nuevos en cada conflicto? ¿Podría decirse que la Segunda Guerra fue una consecuencia directa de la Primera?',
    activityType: 'Ensayo',
    difficulty: 'Difícil',
    time: '75 min',
  },
];

function DifficultyBadge({ level }: { level: string }) {
  const config: Record<string, { color: string }> = {
    Fácil: { color: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800/50' },
    Medio: { color: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800/50' },
    Difícil: { color: 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/40 dark:text-rose-300 dark:border-rose-800/50' },
  };
  const { color } = config[level] ?? config.Medio;
  return (
    <Badge variant="outline" className={`${color} text-xs font-medium`}>
      {level}
    </Badge>
  );
}

export default function HistoriaPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
                Inicio
              </Link>
              <ChevronRight className="size-3.5 text-muted-foreground" />
              <Link
                href="/materias"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Materias
              </Link>
              <ChevronRight className="size-3.5 text-muted-foreground" />
              <span className="text-emerald-700 dark:text-emerald-400 font-medium">Historia</span>
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
                <div className="flex items-center justify-center size-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40">
                  <BookOpen className="size-6 text-emerald-700 dark:text-emerald-400" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
                    Línea del tiempo — Historia del Mundo
                  </h1>
                </div>
              </div>
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                Basado en{' '}
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                  &apos;Toda la Historia del mundo&apos;
                </span>{' '}
                de Jean-Claude Barreau y Guillaume Bigot
              </p>
              <p className="mt-2 text-sm text-muted-foreground/70">
                Seleccioná un período para ver la información completa, temas clave y actividades.
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
                        className="w-full flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-4 sm:py-5 text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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
                                  Descripción
                                </h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                  {period.description}
                                </p>
                              </div>

                              {/* Key Topics */}
                              <div>
                                <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2.5">
                                  Temas clave
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
                                    Actividad: {period.activityType}
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
