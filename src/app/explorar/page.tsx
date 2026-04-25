'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  ChevronRight,
  Calculator,
  Atom,
  FlaskConical,
  Code,
  Landmark,
  Globe,
  BookOpen,
  GraduationCap,
  PenTool,
  Library,
  Languages,
  BookHeart,
} from 'lucide-react';
import SiteNavbar from '@/components/site-navbar';
import SiteFooter from '@/components/site-footer';

const categories = [
  {
    id: 'ciencias-exactas',
    title: 'Ciencias Exactas',
    icon: Calculator,
    iconBg: 'bg-emerald-600',
    iconColor: 'text-white',
    subcategories: [
      { name: 'Matemáticas', href: '/materias', icon: Calculator },
      { name: 'Física', href: '/materias', icon: Atom },
      { name: 'Química', href: '/materias', icon: FlaskConical },
      { name: 'Programación', href: '/materias', icon: Code },
    ],
  },
  {
    id: 'ciencias-sociales',
    title: 'Ciencias Sociales',
    icon: Globe,
    iconBg: 'bg-teal-600',
    iconColor: 'text-white',
    subcategories: [
      { name: 'Historia', href: '/materias/historia', icon: Landmark },
      { name: 'Geografía', href: '/materias', icon: Globe },
      { name: 'Economía', href: '/materias', icon: BookOpen },
      { name: 'Ciencias Políticas', href: '/materias', icon: GraduationCap },
    ],
  },
  {
    id: 'idiomas-humanidades',
    title: 'Idiomas y Humanidades',
    icon: Languages,
    iconBg: 'bg-emerald-700',
    iconColor: 'text-white',
    subcategories: [
      { name: 'Inglés', href: '/materias', icon: Languages },
      { name: 'Literatura', href: '/materias', icon: PenTool },
      { name: 'Filosofía', href: '/materias', icon: BookHeart },
      { name: 'Arte y Cultura', href: '/materias', icon: Library },
    ],
  },
];

export default function ExplorarPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteNavbar />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-muted/40 dark:bg-black/60 border-b border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center gap-1.5 text-sm">
              <Link
                href="/"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Inicio
              </Link>
              <ChevronRight className="size-3.5 text-muted-foreground" />
              <span className="text-emerald-700 dark:text-emerald-400 font-medium">Explorar</span>
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
            >
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                Explorar
              </h1>
              <p className="mt-3 text-muted-foreground text-lg max-w-2xl">
                Encontrá la materia ideal para tu aprendizaje. Explorá nuestras categorías y descubrí todos los cursos disponibles.
              </p>
            </motion.div>
          </div>
        </section>

        {/* 3-Column Category Browser */}
        <section className="pb-16 md:pb-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {categories.map((cat, idx) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <Accordion
                    type="single"
                    collapsible
                    defaultValue={cat.id}
                    className="space-y-0"
                  >
                    <AccordionItem
                      value={cat.id}
                      className="border border-border rounded-xl overflow-hidden bg-card shadow-sm"
                    >
                      <AccordionTrigger className="hover:no-underline px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex items-center justify-center size-11 rounded-full ${cat.iconBg} ${cat.iconColor} shrink-0`}
                          >
                            <cat.icon className="size-5" />
                          </div>
                          <span className="font-semibold text-base text-foreground text-left">
                            {cat.title}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-2 px-2">
                        <div className="space-y-0.5">
                          {cat.subcategories.map((sub) => (
                            <Link
                              key={sub.name}
                              href={sub.href}
                              className="flex items-center justify-between px-4 py-3 rounded-lg text-sm text-muted-foreground hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors group"
                            >
                              <div className="flex items-center gap-3">
                                <sub.icon className="size-4 text-muted-foreground group-hover:text-emerald-600 transition-colors" />
                                <span>{sub.name}</span>
                              </div>
                              <ChevronRight className="size-4 text-muted-foreground group-hover:text-emerald-600 transition-colors" />
                            </Link>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
