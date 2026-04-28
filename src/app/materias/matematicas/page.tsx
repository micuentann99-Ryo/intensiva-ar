'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ChevronRight,
  Calculator,
  FileText,
  Clock,
} from 'lucide-react';
import SiteNavbar from '@/components/site-navbar';
import SiteFooter from '@/components/site-footer';
import { useT } from '@/i18n/context';

export default function MatematicasIndexPage() {
  const t = useT();

  const courses = [
    {
      id: 'curso-intensivo',
      name: t('materias_page.curso_intensivo'),
      description: t('mat_index.intensive_desc'),
      periods: 10,
      icon: Calculator,
      activities: 10,
      href: '/materias/matematicas/curso-intensivo',
    },
  ];

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
              <ChevronRight className="size-3.5 text-muted-foreground" />
              <span className="text-purple-700 dark:text-purple-400 font-medium">
                {t('common.matematicas')}
              </span>
            </nav>
          </div>
        </div>

        {/* Page Header */}
        <section className="bg-gradient-to-r from-purple-600 to-purple-700 py-10 md:py-14">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-4"
            >
              <div className="flex items-center justify-center size-12 rounded-xl bg-white/20 text-white">
                <Calculator className="size-6" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                  {t('common.matematicas')}
                </h1>
                <p className="mt-1 text-purple-100 text-base md:text-lg">
                  {t('mat_index.subtitle')}
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Course List */}
        <section className="py-10 md:py-14">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-4">
              {courses.map((course, idx) => {
                const Icon = course.icon;
                return (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.08 }}
                  >
                    <Link href={course.href} className="block">
                      <div className="border border-border rounded-xl overflow-hidden bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 group">
                        <div className="flex items-center gap-4 px-5 py-5 border-l-4 border-l-purple-500">
                          <div className="flex items-center justify-center size-12 rounded-xl bg-purple-50 dark:bg-purple-900/40 text-purple-700 dark:text-purple-400 shrink-0 group-hover:scale-110 transition-transform">
                            <Icon className="size-6" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h2 className="text-lg font-semibold text-foreground group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors">
                              {course.name}
                            </h2>
                            <p className="text-sm text-muted-foreground mt-1">
                              {course.description}
                            </p>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="size-3" />
                                {course.periods} {t('mat_index.units')}
                              </span>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <FileText className="size-3" />
                                {course.activities} {t('mat_index.activities_count')}
                              </span>
                            </div>
                          </div>
                          <ChevronRight className="size-5 text-muted-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors shrink-0" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
