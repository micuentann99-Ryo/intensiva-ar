'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  Calculator,
  PenTool,
  FlaskConical,
  Landmark,
  Atom,
  Code,
  BookOpen,
} from 'lucide-react';
import SiteNavbar from '@/components/site-navbar';
import SiteFooter from '@/components/site-footer';

const subjects = [
  {
    id: 'matematicas',
    name: 'Matemáticas',
    icon: Calculator,
    borderColor: 'border-l-purple-500',
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-600',
    href: '/materias',
  },
  {
    id: 'lenguaje',
    name: 'Lenguaje y Comunicación',
    icon: PenTool,
    borderColor: 'border-l-amber-500',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    href: '/materias',
  },
  {
    id: 'ciencias-naturales',
    name: 'Ciencias Naturales',
    icon: FlaskConical,
    borderColor: 'border-l-teal-500',
    iconBg: 'bg-teal-50',
    iconColor: 'text-teal-600',
    href: '/materias',
  },
  {
    id: 'historia',
    name: 'Historia',
    icon: Landmark,
    borderColor: 'border-l-emerald-500',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    href: null,
    expandable: true,
  },
  {
    id: 'fisica',
    name: 'Física',
    icon: Atom,
    borderColor: 'border-l-sky-500',
    iconBg: 'bg-sky-50',
    iconColor: 'text-sky-600',
    href: '/materias',
  },
  {
    id: 'programacion',
    name: 'Programación',
    icon: Code,
    borderColor: 'border-l-rose-500',
    iconBg: 'bg-rose-50',
    iconColor: 'text-rose-600',
    href: '/materias',
  },
];

export default function MateriasPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
              <span className="text-emerald-700 font-medium">Materias</span>
            </nav>
          </div>
        </div>

        {/* Green Banner */}
        <section className="bg-gradient-to-r from-emerald-600 to-emerald-700 py-10 md:py-14">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-4"
            >
              <div className="flex items-center justify-center size-12 rounded-xl bg-white/20 text-white">
                <BookOpen className="size-6" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                  Materias
                </h1>
                <p className="mt-1 text-emerald-100 text-base md:text-lg">
                  Explorá todas las materias disponibles en nuestra plataforma
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Subject Cards List */}
        <section className="py-10 md:py-14">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-3">
              {subjects.map((subject, idx) => {
                const isExpanded = expandedId === subject.id;
                const isExpandable = 'expandable' in subject && subject.expandable;

                const card = (
                  <motion.div
                    key={subject.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.06 }}
                    className={`border border-border rounded-lg overflow-hidden transition-all ${
                      isExpandable && isExpanded ? 'bg-emerald-50/60 border-emerald-200 shadow-sm' : 'bg-card hover:shadow-sm'
                    }`}
                  >
                    <div
                      className={`flex items-center gap-4 px-5 py-4 border-l-4 ${subject.borderColor} ${
                        isExpandable ? 'cursor-pointer' : ''
                      }`}
                      onClick={
                        isExpandable
                          ? () => setExpandedId(isExpanded ? null : subject.id)
                          : undefined
                      }
                      role={isExpandable ? 'button' : undefined}
                      tabIndex={isExpandable ? 0 : undefined}
                      onKeyDown={
                        isExpandable
                          ? (e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                setExpandedId(isExpanded ? null : subject.id);
                              }
                            }
                          : undefined
                      }
                    >
                      <div
                        className={`flex items-center justify-center size-11 rounded-lg ${subject.iconBg} ${subject.iconColor} shrink-0`}
                      >
                        <subject.icon className="size-5" />
                      </div>
                      <span className="flex-1 font-semibold text-base text-foreground">
                        {subject.name}
                      </span>
                      {isExpandable ? (
                        <motion.div
                          animate={{ rotate: isExpanded ? 90 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronRight className="size-5 text-muted-foreground" />
                        </motion.div>
                      ) : (
                        <ChevronRight className="size-5 text-muted-foreground" />
                      )}
                    </div>

                    {/* Expandable sub-items for Historia */}
                    <AnimatePresence>
                      {isExpandable && isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-4 pt-1">
                            <Link
                              href="/materias/historia"
                              className="flex items-center justify-between py-3 px-4 rounded-lg bg-white dark:bg-slate-800 border border-emerald-100 dark:border-emerald-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors group"
                            >
                              <div className="flex items-center gap-3">
                                <Landmark className="size-4 text-emerald-600" />
                                <span className="text-sm font-medium text-foreground group-hover:text-emerald-700 transition-colors">
                                  Historia del Mundo
                                </span>
                              </div>
                              <ChevronRight className="size-4 text-emerald-600" />
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );

                if (!isExpandable && subject.href) {
                  return (
                    <Link key={subject.id} href={subject.href} className="block">
                      {card}
                    </Link>
                  );
                }

                return card;
              })}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
