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
  console.log(`Created ${activities.length} activities`);

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
