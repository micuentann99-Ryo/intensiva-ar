'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import {
  ChevronRight,
  Clock,
  Lightbulb,
} from 'lucide-react';
import SiteNavbar from '@/components/site-navbar';
import SiteFooter from '@/components/site-footer';

const timelinePeriods = [
  {
    id: 'prehistoria',
    name: 'Prehistoria y Orígenes',
    description:
      'La prehistoria humana se origina en África oriental, donde hace 200-300 mil años grupos de primates inventaron el lenguaje. Lucy, el famoso australopiteco, representa uno de los fósiles más importantes del origen del ser humano. Las mutaciones genéticas y el desarrollo del lenguaje permitieron el paso del Estrecho de Bering hacia América.',
    topics: [
      'Origen del ser humano en África oriental',
      'Lucy y los australopitecos',
      'Invención del lenguaje',
      'Mutaciones genéticas evolutivas',
      'Paso del Estrecho de Bering hacia América',
    ],
    activity: 'Investigación: ¿Cuáles fueron las condiciones geográficas y climáticas que permitieron el paso del ser humano desde Asia hacia América a través del Estrecho de Bering?',
    activityType: 'Investigación',
    difficulty: 'Medio',
    time: '40 min',
  },
  {
    id: 'pangea',
    name: 'Pangea y Primeras Civilizaciones',
    description:
      'Los ríos nutricios (Nilo, Éufrates, Indo) fueron el hogar de las primeras grandes civilizaciones. En Sumeria surgió la escritura cuneiforme, mientras que en Egipto se construyeron las grandes pirámides bajo el sistema faraónico. La aparición de la escritura marcó el fin de la prehistoria y el inicio de la historia documentada.',
    topics: [
      'Ríos nutricios: Nilo, Éufrates, Indo',
      'Sumeria y la escritura cuneiforme',
      'Egipto faraónico y las pirámides',
      'Primeros Estados y religiones antiguas',
      'Aparición de la escritura',
    ],
    activity: 'Compará la organización del Imperio egipcio con la de Sumeria. ¿Qué similitudes y diferencias encontrás en su forma de gobierno, religión y escritura?',
    activityType: 'Investigación',
    difficulty: 'Medio',
    time: '45 min',
  },
  {
    id: 'mundo-antiguo',
    name: 'Mundo Antiguo',
    description:
      'El mundo antiguo estuvo dominado por civilizaciones como Grecia y Roma, pero también por el Imperio persa y las culturas fenicias y judías. Alejandro Magno realizó la primera gran globalización al conquistar territorios desde Grecia hasta la India. El Imperio romano y el judeo-cristianismo sentaron las bases del mundo occidental.',
    topics: [
      'Cretenses, fenicios y judíos (Mediterráneo)',
      'El Imperio persa',
      'Alejandro Magno (primera globalización)',
      'Cartago y Roma (Aníbal y César)',
      'El Imperio romano y el judeo-cristianismo',
    ],
    activity: 'Reflexioná: ¿Por qué se dice que Alejandro Magno realizó la "primera globalización"? ¿Qué impacto tuvieron sus conquistas en la difusión cultural entre Oriente y Occidente?',
    activityType: 'Reflexión',
    difficulty: 'Medio',
    time: '35 min',
  },
  {
    id: 'edad-media',
    name: 'Edad Media',
    description:
      'Tras la caída de Roma, Europa entró en un período de fragmentación política y cultural conocido como la Edad Media. Las cruzadas marcaron el choque entre el mundo cristiano y el islámico. El nacimiento de las naciones europeas, la guerra de los Cien Años y figuras como Juana de Arco definieron este largo período histórico.',
    topics: [
      'Caída del Imperio romano',
      'Los tiempos bárbaros',
      'La época del islam',
      'Las cruzadas',
      'Nacimiento de las naciones',
      'Guerra de los Cien Años y Juana de Arco',
    ],
    activity: 'Línea de tiempo: Armá una cronología con los 5 eventos más importantes de la Edad Media. Justificá tu selección.',
    activityType: 'Línea de tiempo',
    difficulty: 'Difícil',
    time: '50 min',
  },
  {
    id: 'renacimiento',
    name: 'Renacimiento y Reformas',
    description:
      'Los grandes descubrimientos geográficos transformaron el mundo. Carlos V gobernó un imperio donde "no se ponía el sol". Miguel Ángel, Leonardo da Vinci y Maquiavelo fueron figuras clave del Renacimiento italiano. Las reformas religiosas de Lutero y Calvino dividieron a la cristiandad y provocaron guerras de religión en toda Europa.',
    topics: [
      'Los grandes descubrimientos geográficos',
      'Muerte de las civilizaciones precolombinas',
      'Carlos V y Francisco I',
      'Reformas religiosas (Lutero, Calvino)',
      'Miguel Ángel, Leonardo, Maquiavelo',
    ],
    activity: 'Ensayo: ¿Cómo influyeron los grandes descubrimientos geográficos en el Renacimiento europeo? Analizá la relación entre ciencia, arte y expansión territorial.',
    activityType: 'Ensayo',
    difficulty: 'Difícil',
    time: '60 min',
  },
  {
    id: 'america-precolombina',
    name: 'América Precolombina',
    description:
      'Antes de la llegada de los europeos, América albergaba civilizaciones avanzadas. Los aztecas construyeron un imperio guerrero en México con su capital Tenochtitlán. Los incas extendieron su dominio desde Ecuador hasta Chile, con un sistema de caminos y administración notable. Los mayas, ya en decadencia, habían logrado avances en escritura y matemáticas.',
    topics: [
      'Imperio azteca/mexica y Tenochtitlán',
      'Imperio inca (Tahuantinsuyo)',
      'Civilización maya',
      'Sistemas de escritura y matemáticas',
      'Religiones y sacrificios humanos',
    ],
    activity: 'Investigación: Los mayas inventaron el cacao, el maíz y el tomate. Elegí uno de estos productos y trazá su historia desde la civilización maya hasta nuestra mesa actual.',
    activityType: 'Investigación',
    difficulty: 'Fácil',
    time: '50 min',
  },
  {
    id: 'conquista-colonia',
    name: 'Conquista y Colonia',
    description:
      'Hernán Cortés conquistó el Imperio azteca con la toma de Tenochtitlán en 1521. Francisco Pizarro, con solo 163 hombres, derrotó al Imperio inca en Cajamarca (1532). La colonización española transformó radicalmente el continente americano, estableciendo nuevas ciudades, religiones y sistemas de gobierno que durarían siglos.',
    topics: [
      'Cortés y la conquista de México',
      'La Noche Triste y Tenochtitlán',
      'Pizarro y la captura de Atahualpa',
      'Colonización española',
      'El "desfase temporal" entre europeos y americanos',
    ],
    activity: 'Reflexioná: ¿Por qué creés que un grupo de 163 españoles pudo derrotar al Imperio inca de millones de personas? Enumerá al menos 3 factores.',
    activityType: 'Reflexión',
    difficulty: 'Difícil',
    time: '30 min',
  },
  {
    id: 'independencia',
    name: 'Independencia de América',
    description:
      'Las revoluciones de independencia sudamericanas fueron lideradas por figuras como San Martín y Bolívar. Sin embargo, el Imperio español se fragmentó en múltiples repúblicas. El libro señala problemas graves: la falta de unión y el apartheid indígena, ya que las insurrecciones fueron revueltas de colonos donde los indios participaron poco.',
    topics: [
      'San Martín y el cruce de los Andes',
      'Simón Bolívar y la Gran Colombia',
      'Revoluciones de independencia',
      'Fragmentación latinoamericana',
      'El apartheid indígena',
    ],
    activity: 'Debate: ¿Por qué América Latina se dividió en tantos países mientras América del Norte se unificó? ¿Qué factores explican esta diferencia?',
    activityType: 'Debate',
    difficulty: 'Difícil',
    time: '60 min',
  },
  {
    id: 'siglo-xix',
    name: 'Siglo XIX',
    description:
      'La Revolución Industrial transformó la economía y la sociedad. Las unificaciones de Italia y Alemania crearon nuevas potencias europeas. Las potencias coloniales expandieron sus imperios por África y Asia. La expansión hacia el oeste de EE.UU. tuvo consecuencias devastadoras para los pueblos indígenas norteamericanos.',
    topics: [
      'Revolución Industrial',
      'Unificación de Italia',
      'Unificación de Alemania',
      'Expansiones coloniales',
      'Expansión hacia el oeste en EE.UU.',
    ],
    activity: 'Análisis: ¿Qué impacto tuvo la Revolución Industrial en las relaciones entre las potencias europeas durante el siglo XIX? ¿Contribuyó a la paz o a la tensión?',
    activityType: 'Análisis',
    difficulty: 'Medio',
    time: '45 min',
  },
  {
    id: 'contemporanea',
    name: 'Historia Contemporánea',
    description:
      'Las dos Guerras Mundiales marcaron el siglo XX. La Revolución rusa creó la URSS, iniciando la Guerra Fría que dividiría al mundo en dos bloques. La descolonización transformó el mapa político global. Finalmente, la globalización conectó al mundo entero en una red económica y cultural sin precedentes.',
    topics: [
      'Primera Guerra Mundial',
      'Revolución rusa',
      'Segunda Guerra Mundial',
      'Guerra Fría',
      'Descolonización',
      'Globalización',
    ],
    activity: 'Ensayo comparativo: Analizá las causas de la Primera y Segunda Guerra Mundial. ¿Qué elementos se repiten y qué factores son nuevos en cada conflicto?',
    activityType: 'Ensayo',
    difficulty: 'Difícil',
    time: '75 min',
  },
];

function DifficultyBadge({ level }: { level: string }) {
  const config: Record<string, { color: string }> = {
    Fácil: { color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    Medio: { color: 'bg-amber-100 text-amber-800 border-amber-200' },
    Difícil: { color: 'bg-rose-100 text-rose-800 border-rose-200' },
  };
  const { color } = config[level] ?? config.Medio;
  return (
    <Badge variant="outline" className={`${color} text-xs`}>
      {level}
    </Badge>
  );
}

export default function HistoriaPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
      <SiteNavbar />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-muted/40 border-b border-border">
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
              <span className="text-emerald-700 font-medium">Historia</span>
            </nav>
          </div>
        </div>

        {/* Page Header */}
        <section className="py-10 md:py-14">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl"
            >
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
                Línea del tiempo — Historia del Mundo
              </h1>
              <p className="mt-3 text-muted-foreground text-base md:text-lg leading-relaxed">
                Basado en{' '}
                <span className="font-semibold text-emerald-700">
                  &apos;Toda la Historia del mundo&apos;
                </span>{' '}
                de Jean-Claude Barreau y Guillaume Bigot
              </p>
            </motion.div>
          </div>
        </section>

        {/* Timeline */}
        <section className="pb-16 md:pb-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Accordion type="single" collapsible className="space-y-0 divide-y divide-border border-t border-b">
                  {timelinePeriods.map((period, idx) => (
                    <AccordionItem
                      key={period.id}
                      value={period.id}
                      className="py-0 data-[state=open]:bg-emerald-50/40 transition-colors"
                    >
                      <AccordionTrigger className="hover:no-underline px-0 py-5 group">
                        <div className="flex items-center justify-between w-full pr-4">
                          <span className="text-base md:text-lg font-medium text-foreground text-left group-hover:text-emerald-700 transition-colors">
                            {period.name}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-5 pt-0">
                        <div className="space-y-4">
                          {/* Description */}
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {period.description}
                          </p>

                          {/* Key Topics */}
                          <div>
                            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide mb-2">
                              Temas clave
                            </h4>
                            <ul className="space-y-1.5">
                              {period.topics.map((topic) => (
                                <li
                                  key={topic}
                                  className="flex items-start gap-2 text-sm text-foreground"
                                >
                                  <ChevronRight className="size-3.5 text-emerald-500 mt-0.5 shrink-0" />
                                  <span>{topic}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Activity */}
                          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-4 border border-emerald-200/60">
                            <div className="flex items-center gap-2 mb-2">
                              <Lightbulb className="size-4 text-emerald-600" />
                              <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wide">
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
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
