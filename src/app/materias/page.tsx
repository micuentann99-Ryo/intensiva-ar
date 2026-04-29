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
import { useT } from '@/i18n/context';

export default function MateriasPage() {
  const t = useT();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const subjects = [
    {
      id: 'matematicas',
      name: t('materias_page.matematicas'),
      icon: Calculator,
      borderColor: 'border-l-purple-500',
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600',
      href: null,
      expandable: true,
    },
    {
      id: 'lenguaje',
      name: t('materias_page.lenguaje'),
      icon: PenTool,
      borderColor: 'border-l-amber-500',
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
      href: '/materias',
    },
    {
      id: 'ciencias-naturales',
      name: t('materias_page.ciencias_naturales'),
      icon: FlaskConical,
      borderColor: 'border-l-teal-500',
      iconBg: 'bg-teal-50',
      iconColor: 'text-teal-600',
      href: '/materias',
    },
    {
      id: 'historia',
      name: t('materias_page.historia'),
      icon: Landmark,
      borderColor: 'border-l-emerald-500',
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      href: null,
      expandable: true,
    },
    {
      id: 'fisica',
      name: t('materias_page.fisica'),
      icon: Atom,
      borderColor: 'border-l-sky-500',
      iconBg: 'bg-sky-50',
      iconColor: 'text-sky-600',
      href: '/materias',
    },
    {
      id: 'programacion',
      name: t('materias_page.programacion'),
      icon: Code,
      borderColor: 'border-l-rose-500',
      iconBg: 'bg-rose-50',
      iconColor: 'text-rose-600',
      href: '/materias',
    },
  ];

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
                {t('common.inicio')}
              </Link>
              <ChevronRight className="size-3.5 text-muted-foreground" />
              <span className="text-emerald-700 dark:text-emerald-400 font-medium">{t('materias_page.title')}</span>
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
                  {t('materias_page.title')}
                </h1>
                <p className="mt-1 text-emerald-100 text-base md:text-lg">
                  {t('materias_page.subtitle')}
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
                      isExpandable && isExpanded ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 shadow-sm' : 'bg-card hover:shadow-sm'
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

                    {/* Expandable sub-items */}
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
                            {subject.id === 'historia' && (
                              <Link
                                href="/materias/historia"
                                className="flex items-center justify-between py-3 px-4 rounded-lg bg-white dark:bg-gray-800 border border-emerald-100 dark:border-emerald-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors group"
                              >
                                <div className="flex items-center gap-3">
                                  <Landmark className="size-4 text-emerald-600" />
                                  <span className="text-sm font-medium text-foreground group-hover:text-emerald-700 transition-colors">
                                    {t('materias_page.historia_mundo')}
                                  </span>
                                </div>
                                <ChevronRight className="size-4 text-emerald-600" />
                              </Link>
                            )}
                            {subject.id === 'matematicas' && (
                              <Link
                                href="/materias/matematicas"
                                className="flex items-center justify-between py-3 px-4 rounded-lg bg-white dark:bg-gray-800 border border-purple-100 dark:border-purple-900 hover:bg-purple-50 dark:hover:bg-purple-950/50 hover:border-purple-200 dark:hover:border-purple-800 transition-colors group"
                              >
                                <div className="flex items-center gap-3">
                                  <Calculator className="size-4 text-purple-600" />
                                  <span className="text-sm font-medium text-foreground group-hover:text-purple-700 transition-colors">
                                    {t('materias_page.curso_intensivo')}
                                  </span>
                                </div>
                                <ChevronRight className="size-4 text-purple-600" />
                              </Link>
                            )}
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
