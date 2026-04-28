'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ChevronRight,
  BookOpen,
  FileText,
  Landmark,
  Clock,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import SiteNavbar from '@/components/site-navbar';
import SiteFooter from '@/components/site-footer';
import { useT } from '@/i18n/context';

export default function HistoriaIndexPage() {
  const t = useT();

  const courses = [
    {
      id: 'historia-universal',
      name: t('materias_page.historia_mundo'),
      description: t('historia_index.universal_desc'),
      periods: 10,
      icon: Landmark,
      activities: 10,
      href: '/materias/historia/historia-universal',
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
              <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                {t('common.historia')}
              </span>
            </nav>
          </div>
        </div>

        {/* Page Header */}
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
                  {t('common.historia')}
                </h1>
                <p className="mt-1 text-emerald-100 text-base md:text-lg">
                  {t('historia_index.subtitle')}
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
                        <div className="flex items-center gap-4 px-5 py-5 border-l-4 border-l-emerald-500">
                          <div className="flex items-center justify-center size-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 shrink-0 group-hover:scale-110 transition-transform">
                            <Icon className="size-6" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h2 className="text-lg font-semibold text-foreground group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                              {course.name}
                            </h2>
                            <p className="text-sm text-muted-foreground mt-1">
                              {course.description}
                            </p>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="size-3" />
                                {course.periods} {t('historia_index.periods')}
                              </span>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <FileText className="size-3" />
                                {course.activities} {t('historia_index.activities_count')}
                              </span>
                            </div>
                          </div>
                          <ChevronRight className="size-5 text-muted-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors shrink-0" />
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
