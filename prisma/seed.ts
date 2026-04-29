import { hash } from 'bcryptjs';
import { db } from '../src/lib/db';

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const adminPassword = await hash('Admin123456788!', 12);
  const admin = await db.user.upsert({
    where: { email: 'admin@intensiva.ar' },
    update: {},
    create: {
      email: 'admin@intensiva.ar',
      passwordHash: adminPassword,
      name: 'Administrador',
      role: 'ADMIN',
      isActive: true,
    },
  });
  console.log(`Admin created: ${admin.email}`);

  // Seed activities from Historia Universal course
  const activities = [
    {
      subject: 'historia',
      courseSlug: 'historia-universal',
      periodId: 'prehistoria',
      periodName: 'Prehistoria y Orígenes',
      title: 'Investigación: ¿Cuáles fueron las condiciones geográficas y climáticas que permitieron el paso del ser humano desde Asia hacia América a través del Estrecho de Bering?',
      type: 'Investigación',
      difficulty: 'Medio',
      estimatedTime: '40 min',
      description: 'Analizá cómo el fin de la última Edad de Hielo influyó en las rutas migratorias.',
      sortOrder: 1,
    },
    {
      subject: 'historia',
      courseSlug: 'historia-universal',
      periodId: 'pangea',
      periodName: 'Pangea y Primeras Civilizaciones',
      title: 'Compará la organización del Imperio egipcio con la de Sumeria. ¿Qué similitudes y diferencias encontrás?',
      type: 'Investigación',
      difficulty: 'Medio',
      estimatedTime: '45 min',
      description: 'Incluí un cuadro comparativo sobre forma de gobierno, religión, sistema de escritura y organización social.',
      sortOrder: 2,
    },
    {
      subject: 'historia',
      courseSlug: 'historia-universal',
      periodId: 'mundo-antiguo',
      periodName: 'Mundo Antiguo',
      title: 'Reflexión: ¿Por qué se dice que Alejandro Magno realizó la "primera globalización"?',
      type: 'Reflexión',
      difficulty: 'Medio',
      estimatedTime: '35 min',
      description: 'Analizá qué impacto tuvieron sus conquistas en la difusión cultural entre Oriente y Occidente.',
      sortOrder: 3,
    },
    {
      subject: 'historia',
      courseSlug: 'historia-universal',
      periodId: 'edad-media',
      periodName: 'Edad Media',
      title: 'Línea de tiempo: Armá una cronología con los 5 eventos más importantes de la Edad Media.',
      type: 'Línea de tiempo',
      difficulty: 'Difícil',
      estimatedTime: '50 min',
      description: 'Justificá tu selección y explicá cómo cada evento influyó en el siguiente.',
      sortOrder: 4,
    },
    {
      subject: 'historia',
      courseSlug: 'historia-universal',
      periodId: 'renacimiento',
      periodName: 'Renacimiento y Reformas',
      title: 'Ensayo: ¿Cómo influyeron los grandes descubrimientos geográficos en el Renacimiento europeo?',
      type: 'Ensayo',
      difficulty: 'Difícil',
      estimatedTime: '60 min',
      description: 'Analizá la relación entre ciencia, arte y expansión territorial durante los siglos XV y XVI.',
      sortOrder: 5,
    },
    {
      subject: 'historia',
      courseSlug: 'historia-universal',
      periodId: 'america-precolombina',
      periodName: 'América Precolombina',
      title: 'Investigación: Los mayas inventaron el cacao, el maíz y el tomate. Trazá su historia desde la civilización maya hasta nuestra mesa actual.',
      type: 'Investigación',
      difficulty: 'Fácil',
      estimatedTime: '50 min',
      description: '¿Cómo cambió el mundo la introducción de estos productos en Europa?',
      sortOrder: 6,
    },
    {
      subject: 'historia',
      courseSlug: 'historia-universal',
      periodId: 'conquista-colonia',
      periodName: 'Conquista y Colonia',
      title: 'Reflexión: ¿Por qué creés que 163 españoles pudieron derrotar al Imperio inca?',
      type: 'Reflexión',
      difficulty: 'Difícil',
      estimatedTime: '30 min',
      description: 'Enumerá al menos 3 factores y explicá cada uno con detalles históricos.',
      sortOrder: 7,
    },
    {
      subject: 'historia',
      courseSlug: 'historia-universal',
      periodId: 'independencia',
      periodName: 'Independencia de América',
      title: 'Debate: ¿Por qué América Latina se dividió en tantos países mientras América del Norte se unificó?',
      type: 'Debate',
      difficulty: 'Difícil',
      estimatedTime: '60 min',
      description: 'Considerá: geografía, economía, composición social y liderazgo.',
      sortOrder: 8,
    },
    {
      subject: 'historia',
      courseSlug: 'historia-universal',
      periodId: 'siglo-xix',
      periodName: 'Siglo XIX',
      title: 'Análisis: ¿Qué impacto tuvo la Revolución Industrial en las relaciones entre las potencias europeas durante el siglo XIX?',
      type: 'Análisis',
      difficulty: 'Medio',
      estimatedTime: '45 min',
      description: 'Relacioná el desarrollo económico con el imperialismo colonial.',
      sortOrder: 9,
    },
    {
      subject: 'historia',
      courseSlug: 'historia-universal',
      periodId: 'contemporanea',
      periodName: 'Historia Contemporánea',
      title: 'Ensayo comparativo: Analizá las causas de la Primera y Segunda Guerra Mundial.',
      type: 'Ensayo',
      difficulty: 'Difícil',
      estimatedTime: '75 min',
      description: '¿Qué elementos se repiten y qué factores son nuevos en cada conflicto? ¿Podría decirse que la Segunda Guerra fue una consecuencia directa de la Primera?',
      sortOrder: 10,
    },
  ];

  for (const activity of activities) {
    await db.activity.upsert({
      where: { periodId: activity.periodId },
      update: {},
      create: activity,
    });
  }
  console.log(`Created ${activities.length} historia activities`);

  // Seed activities from Curso Intensivo de Matemática
  const mathActivities = [
    {
      subject: 'matematicas',
      courseSlug: 'curso-intensivo',
      periodId: 'mat-origenes',
      periodName: 'Orígenes de la Matemática',
      title: 'Investigación: Compará el sistema de numeración egipcio con el babilónico',
      type: 'Investigación',
      difficulty: 'Medio',
      estimatedTime: '40 min',
      description: 'Explicá las ventajas y desventajas de cada sistema y por qué el sexagesimal se mantiene vigente.',
      sortOrder: 1,
    },
    {
      subject: 'matematicas',
      courseSlug: 'curso-intensivo',
      periodId: 'mat-grecia',
      periodName: 'Grecia Clásica',
      title: 'Demostración: Demostrá el Teorema de Pitágoras con al menos dos métodos diferentes',
      type: 'Demostración',
      difficulty: 'Difícil',
      estimatedTime: '50 min',
      description: 'Usá un método geométrico con áreas y otro algebraico. Explicá paso a paso y compará cuál es más intuitiva.',
      sortOrder: 2,
    },
    {
      subject: 'matematicas',
      courseSlug: 'curso-intensivo',
      periodId: 'mat-oriente',
      periodName: 'El Mundo Oriental',
      title: 'Reflexión: Imaginá un mundo sin el número cero',
      type: 'Reflexión',
      difficulty: 'Medio',
      estimatedTime: '35 min',
      description: 'Explicá por qué la invención del cero fue revolucionaria. ¿Qué operaciones serían imposibles? Mencioná 5 situaciones cotidianas.',
      sortOrder: 3,
    },
    {
      subject: 'matematicas',
      courseSlug: 'curso-intensivo',
      periodId: 'mat-medieval',
      periodName: 'Edad Media y Renacimiento',
      title: 'Investigación: La sucesión de Fibonacci en fenómenos naturales',
      type: 'Investigación',
      difficulty: 'Fácil',
      estimatedTime: '45 min',
      description: 'Elegí dos ejemplos de la naturaleza donde aparezca la sucesión de Fibonacci y presentá tus hallazgos con diagramas.',
      sortOrder: 4,
    },
    {
      subject: 'matematicas',
      courseSlug: 'curso-intensivo',
      periodId: 'mat-revolucion',
      periodName: 'La Revolución Científica',
      title: 'Ensayo: La identidad de Euler, la ecuación más bella de las matemáticas',
      type: 'Ensayo',
      difficulty: 'Difícil',
      estimatedTime: '60 min',
      description: 'Describí cada constante (e, i, pi, 1, 0) y explicá su significado individual y la belleza de que aparezcan juntas.',
      sortOrder: 5,
    },
    {
      subject: 'matematicas',
      courseSlug: 'curso-intensivo',
      periodId: 'mat-aritmetica',
      periodName: 'Aritmética y Números',
      title: 'Ejercicios: Números primos, factorización, MCD y MCM',
      type: 'Ejercicios',
      difficulty: 'Fácil',
      estimatedTime: '35 min',
      description: 'Encontrá los primeros 25 primos, descomponé en factores primos 360, 1001 y 2024. Calculá MCD y MCM.',
      sortOrder: 6,
    },
    {
      subject: 'matematicas',
      courseSlug: 'curso-intensivo',
      periodId: 'mat-algebra',
      periodName: 'Álgebra',
      title: 'Problemas: Funciones exponenciales y sistemas de ecuaciones',
      type: 'Problemas',
      difficulty: 'Medio',
      estimatedTime: '45 min',
      description: 'Modelá crecimiento bacteriano con función exponencial y resolvé un sistema de ecuaciones 2x2 con interpretación geométrica.',
      sortOrder: 7,
    },
    {
      subject: 'matematicas',
      courseSlug: 'curso-intensivo',
      periodId: 'mat-geometria',
      periodName: 'Geometría',
      title: 'Problemas de aplicación: Trigonometría, fórmula de Heron y volúmenes',
      type: 'Problemas',
      difficulty: 'Medio',
      estimatedTime: '50 min',
      description: 'Calculá altura de edificio con ángulo de elevación, área de triángulo con fórmula de Heron y volumen de un cono.',
      sortOrder: 8,
    },
    {
      subject: 'matematicas',
      courseSlug: 'curso-intensivo',
      periodId: 'mat-calculo',
      periodName: 'Cálculo',
      title: 'Problemas: Máximos y mínimos, área bajo la curva y distancia recorrida',
      type: 'Problemas',
      difficulty: 'Difícil',
      estimatedTime: '60 min',
      description: 'Encontrá extremos de f(x)=x³-6x²+9x+1, calculá área bajo x² entre 0 y 3, y distancia con v(t)=3t²-6t+3.',
      sortOrder: 9,
    },
    {
      subject: 'matematicas',
      courseSlug: 'curso-intensivo',
      periodId: 'mat-moderna',
      periodName: 'Matemática Moderna',
      title: 'Investigación: El problema de los puentes de Königsberg y teoría de grafos',
      type: 'Investigación',
      difficulty: 'Medio',
      estimatedTime: '55 min',
      description: 'Explicá el problema, cómo lo resolvió Euler, e investigá dos aplicaciones modernas de la teoría de grafos con diagramas.',
      sortOrder: 10,
    },
  ];

  for (const activity of mathActivities) {
    await db.activity.upsert({
      where: { periodId: activity.periodId },
      update: {},
      create: activity,
    });
  }
  console.log(`Created ${mathActivities.length} matematicas activities`);

  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
