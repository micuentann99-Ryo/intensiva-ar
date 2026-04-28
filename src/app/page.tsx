'use client';

import { useState, useEffect, useRef, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useTheme } from '@/hooks/use-theme';
import { useT } from '@/i18n/context';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import LanguageToggle from '@/components/language-toggle';
import {
  Menu,
  Search,
  Sun,
  Moon,
  Flame,
  Snowflake,
  GraduationCap,
  MapPin,
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
  Sparkles,
  Landmark,
  Globe,
  CheckCircle2,
  BarChart3,
  FileText,
  ChevronDown,
  Castle,
  Flag,
  Heart,
  Clock,
  Users,
  BookMarked,
  Library,
  Monitor,
  Globe2,
  PenTool,
  Trophy,
  Zap,
  Shield,
  Phone,
  X,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════
   UTILITY COMPONENTS
   ═══════════════════════════════════════════════════════════ */

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
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const dirMap = {
    up: { y: 24, x: 0 },
    down: { y: -24, x: 0 },
    left: { y: 0, x: 24 },
    right: { y: 0, x: -24 },
  };
  const { x, y } = dirMap[direction];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x, y }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x, y }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionWrap({
  id,
  children,
  className = '',
  dark = false,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <section
      id={id}
      className={`py-20 md:py-28 ${dark ? 'bg-muted/40 dark:bg-black/40' : ''} ${className}`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}

function SectionHeading({
  title,
  subtitle,
  badge,
  className = '',
}: {
  title: string;
  subtitle?: string;
  badge?: string;
  className?: string;
}) {
  return (
    <FadeIn className={`text-center mb-14 md:mb-20 ${className}`}>
      {badge && (
        <Badge
          variant="secondary"
          className="mb-4 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-0"
        >
          {badge}
        </Badge>
      )}
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </FadeIn>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════ */

export default function HomePage() {
  const t = useT();
  const router = useRouter();
  const { isDark, toggle } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const megaRef = useRef<HTMLDivElement>(null);
  const megaTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* mount guard — prevents hydration mismatch from theme/locale */
  useEffect(() => { setMounted(true); }, []);

  /* scroll listener */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* close mega menu on outside click */
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) {
        setMegaOpen(false);
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const navigateToSubject = (subject: string) => {
    if (subject === 'historia') router.push('/materias/historia');
    if (subject === 'matematicas') router.push('/materias/matematicas/curso-intensivo');
  };

  const handleNavClick = (href: string, navigate?: boolean) => {
    setMobileOpen(false);
    setMegaOpen(false);
    if (navigate) {
      router.push(href);
    } else if (href.startsWith('/')) {
      router.push(href);
    } else if (href.startsWith('#')) {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const megaEnter = () => {
    if (megaTimeoutRef.current) clearTimeout(megaTimeoutRef.current);
    setMegaOpen(true);
  };
  const megaLeave = () => {
    megaTimeoutRef.current = setTimeout(() => setMegaOpen(false), 200);
  };

  /* ── Dynamic data (uses t()) ── */
  const catalogBooks = [
    { title: 'Toda la Historia del mundo', subject: t('common.historia'), author: 'Barreau & Bigot', desc: t('catalog.subtitle'), icon: <Globe className="size-5 text-emerald-600" />, navigateTo: 'historia' as const },
    { title: 'Curso Intensivo de Matemática', subject: t('categories.matematicas'), author: 'IntensivaAR', desc: t('mega_menu.matematica_desc'), icon: <Calculator className="size-5 text-purple-600" />, navigateTo: 'matematicas' as const },
    { title: 'Inglés para Profesionales', subject: t('common.ingles'), author: 'IntensivaAR', desc: t('mega_menu.ingles_desc'), icon: <BookOpen className="size-5 text-emerald-600" />, navigateTo: null },
    { title: 'Física Universitaria', subject: t('mega_menu.fisica'), author: 'IntensivaAR', desc: t('mega_menu.fisica_desc'), icon: <Atom className="size-5 text-emerald-600" />, navigateTo: null },
    { title: 'Química Orgánica', subject: t('mega_menu.quimica'), author: 'IntensivaAR', desc: t('mega_menu.quimica_desc'), icon: <FlaskConical className="size-5 text-emerald-600" />, navigateTo: null },
    { title: 'Programación desde Cero', subject: t('categories.programacion'), author: 'IntensivaAR', desc: t('mega_menu.programacion_desc'), icon: <Code className="size-5 text-emerald-600" />, navigateTo: null },
    { title: 'Preparación Ingreso UBA/CBC', subject: t('categories.ingreso_universitario'), author: 'IntensivaAR', desc: t('mega_menu.matematica_desc'), icon: <GraduationCap className="size-5 text-emerald-600" />, navigateTo: null },
    { title: 'Ingreso a Medicina', subject: t('categories.ingreso_universitario'), author: 'IntensivaAR', desc: t('mega_menu.medicina_desc'), icon: <Heart className="size-5 text-emerald-600" />, navigateTo: null },
    { title: 'Historia Argentina Contemporánea', subject: t('common.historia'), author: 'IntensivaAR', desc: t('mega_menu.historia_desc'), icon: <Landmark className="size-5 text-emerald-600" />, navigateTo: 'historia' as const },
    { title: 'Historia de las Civilizaciones', subject: t('common.historia'), author: 'IntensivaAR', desc: t('mega_menu.historia_desc'), icon: <Landmark className="size-5 text-emerald-600" />, navigateTo: 'historia' as const },
    { title: 'El Mundo en la Edad Media', subject: t('common.historia'), author: 'IntensivaAR', desc: t('mega_menu.historia_desc'), icon: <Castle className="size-5 text-emerald-600" />, navigateTo: 'historia' as const },
    { title: 'Guerras del Siglo XX', subject: t('common.historia'), author: 'IntensivaAR', desc: t('mega_menu.historia_desc'), icon: <Flag className="size-5 text-emerald-600" />, navigateTo: 'historia' as const },
  ];

  const profesores = [
    { name: 'Martin T.', subject: t('categories.matematicas'), location: 'Buenos Aires', rating: 4.9, reviews: 320, modality: t('common.presencial'), initials: 'MT' },
    { name: 'Sofia R.', subject: t('common.ingles'), location: 'Córdoba', rating: 4.9, reviews: 280, modality: 'Online', initials: 'SR' },
    { name: 'Facundo L.', subject: t('mega_menu.fisica'), location: 'Rosario', rating: 4.8, reviews: 210, modality: t('common.presencial'), initials: 'FL' },
    { name: 'Camila P.', subject: t('mega_menu.quimica'), location: 'Buenos Aires', rating: 4.9, reviews: 185, modality: 'Online', initials: 'CP' },
    { name: 'Nicolás G.', subject: t('categories.programacion'), location: 'Mendoza', rating: 4.8, reviews: 150, modality: 'Online', initials: 'NG' },
    { name: 'Lucía M.', subject: t('common.historia'), location: 'La Plata', rating: 4.9, reviews: 195, modality: t('common.presencial'), initials: 'LM' },
  ];

  const testimonials = [
    { quote: t('testimonials.t1_quote'), name: 'Valentina S.', course: t('testimonials.t1_course'), rating: 5, initials: 'VS' },
    { quote: t('testimonials.t2_quote'), name: 'Tomás R.', course: t('testimonials.t2_course'), rating: 5, initials: 'TR' },
    { quote: t('testimonials.t3_quote'), name: 'Camila A.', course: t('testimonials.t3_course'), rating: 5, initials: 'CA' },
  ];

  const faqItems = [
    { q: t('faq.q1'), a: t('faq.a1') },
    { q: t('faq.q2'), a: t('faq.a2') },
    { q: t('faq.q3'), a: t('faq.a3') },
    { q: t('faq.q4'), a: t('faq.a4') },
    { q: t('faq.q5'), a: t('faq.a5') },
    { q: t('faq.q6'), a: t('faq.a6') },
  ];

  const megaMenuData = [
    {
      title: t('mega_menu.ciencias_exactas'),
      items: [
        { icon: <Calculator className="size-5" />, title: t('mega_menu.matematica'), desc: t('mega_menu.matematica_desc') },
        { icon: <Atom className="size-5" />, title: t('mega_menu.fisica'), desc: t('mega_menu.fisica_desc') },
        { icon: <FlaskConical className="size-5" />, title: t('mega_menu.quimica'), desc: t('mega_menu.quimica_desc') },
        { icon: <Code className="size-5" />, title: t('mega_menu.programacion'), desc: t('mega_menu.programacion_desc') },
      ],
    },
    {
      title: t('mega_menu.ciencias_sociales'),
      items: [
        { icon: <Landmark className="size-5" />, title: t('mega_menu.historia_mega'), desc: t('mega_menu.historia_desc') },
        { icon: <Globe2 className="size-5" />, title: t('mega_menu.geografia'), desc: t('mega_menu.geografia_desc') },
        { icon: <BarChart3 className="size-5" />, title: t('mega_menu.economia'), desc: t('mega_menu.economia_desc') },
      ],
    },
    {
      title: t('mega_menu.idiomas'),
      items: [
        { icon: <Globe className="size-5" />, title: t('mega_menu.ingles_mega'), desc: t('mega_menu.ingles_desc') },
        { icon: <BookOpen className="size-5" />, title: t('mega_menu.literatura'), desc: t('mega_menu.literatura_desc') },
        { icon: <PenTool className="size-5" />, title: t('mega_menu.filosofia'), desc: t('mega_menu.filosofia_desc') },
      ],
    },
    {
      title: t('mega_menu.ingreso'),
      items: [
        { icon: <GraduationCap className="size-5" />, title: t('mega_menu.uba_cbc'), desc: t('mega_menu.uba_cbc_desc') },
        { icon: <Heart className="size-5" />, title: t('mega_menu.medicina'), desc: t('mega_menu.medicina_desc') },
        { icon: <Monitor className="size-5" />, title: t('mega_menu.ingenieria'), desc: t('mega_menu.ingenieria_desc') },
      ],
    },
  ];

  const categorias = [
    { icon: <Calculator className="size-7" />, name: t('categories.matematicas'), count: 245, color: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400' },
    { icon: <BookOpen className="size-7" />, name: t('categories.ingles'), count: 167, color: 'bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400' },
    { icon: <Landmark className="size-7" />, name: t('categories.historia'), count: 48, color: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400' },
    { icon: <GraduationCap className="size-7" />, name: t('categories.ingreso_universitario'), count: 189, color: 'bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400' },
    { icon: <FlaskConical className="size-7" />, name: t('categories.ciencias'), count: 134, color: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400' },
    { icon: <Code className="size-7" />, name: t('categories.programacion'), count: 98, color: 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400' },
    { icon: <Wrench className="size-7" />, name: t('categories.talleres'), count: 76, color: 'bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400' },
  ];

  const benefits = [
    { icon: <Monitor className="size-6" />, title: t('benefits.b1_title'), desc: t('benefits.b1_desc') },
    { icon: <BookMarked className="size-6" />, title: t('benefits.b2_title'), desc: t('benefits.b2_desc') },
    { icon: <Clock className="size-6" />, title: t('benefits.b3_title'), desc: t('benefits.b3_desc') },
    { icon: <Trophy className="size-6" />, title: t('benefits.b4_title'), desc: t('benefits.b4_desc') },
  ];

  const navItems = [
    { label: t('common.inicio'), href: '#' },
    { label: t('common.cursos'), href: '#cursos', hasMega: true },
    { label: t('common.explorar'), href: '/explorar', navigate: true },
    { label: t('common.materias'), href: '/materias', navigate: true },
    { label: t('common.catalogo'), href: '#catalogo' },
    { label: t('common.profesores'), href: '#profesores' },
  ];

  /* ── STAR RATING ── */
  const Stars = ({ count }: { count: number }) => (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`size-4 ${i < count ? 'text-amber-400 fill-amber-400' : 'text-gray-300 dark:text-gray-600'}`}
        />
      ))}
    </div>
  );

  /* ═══════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* ───────────────────────────────────────────────
         HEADER
         ─────────────────────────────────────────────── */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? 'h-[72px] bg-white/90 dark:bg-black/90 backdrop-blur-xl shadow-sm border-b border-border/60'
            : 'h-[80px] bg-white dark:bg-black border-b border-transparent'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-4">
          {/* Logo */}
          <button
            onClick={() => handleNavClick('#')}
            className="flex items-center gap-2.5 shrink-0 group"
          >
            <div className="flex items-center justify-center size-9 rounded-lg bg-emerald-600 text-white group-hover:bg-emerald-700 transition-colors">
              <Sparkles className="size-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground hidden sm:inline">
              Intensiva<span className="text-emerald-600">AR</span>
            </span>
          </button>

          {/* Desktop nav (centered) */}
          <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {navItems.map((item) =>
              item.hasMega ? (
                <div
                  key={item.label}
                  ref={megaRef}
                  className="relative"
                  onMouseEnter={megaEnter}
                  onMouseLeave={megaLeave}
                >
                  <button
                    onClick={() => setMegaOpen((v) => !v)}
                    className="flex items-center gap-1 px-3.5 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg"
                  >
                    {item.label}
                    <ChevronDown
                      className={`size-3.5 transition-transform duration-200 ${megaOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* ── MEGA MENU ── */}
                  <AnimatePresence>
                    {megaOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[min(900px,90vw)] bg-white dark:bg-black rounded-2xl shadow-2xl border border-border/60 p-6 md:p-8 z-50"
                        onMouseEnter={megaEnter}
                        onMouseLeave={megaLeave}
                      >
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                          {megaMenuData.map((col) => (
                            <div key={col.title}>
                              <h4 className="text-xs font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-3">
                                {col.title}
                              </h4>
                              <div className="space-y-2.5">
                                {col.items.map((item) => (
                                  <button
                                    key={item.title}
                                    onClick={() => {
                                      setMegaOpen(false);
                                      if (item.title === t('common.historia') || item.title === t('mega_menu.historia_mega')) {
                                        router.push('/materias/historia');
                                      }
                                    }}
                                    className="group/item flex items-start gap-2.5 text-left w-full"
                                  >
                                    <span className="mt-0.5 flex items-center justify-center size-8 rounded-lg bg-muted/60 dark:bg-gray-800 text-muted-foreground group-hover/item:bg-emerald-100 dark:group-hover/item:bg-emerald-900/50 group-hover/item:text-emerald-600 transition-colors shrink-0">
                                      {item.icon}
                                    </span>
                                    <div className="min-w-0">
                                      <p className="text-sm font-medium text-foreground group-hover/item:text-emerald-600 transition-colors truncate">
                                        {item.title}
                                      </p>
                                      <p className="text-xs text-muted-foreground leading-snug line-clamp-1">
                                        {item.desc}
                                      </p>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.href, item.navigate)}
                  className="px-3.5 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg"
                >
                  {item.label}
                </button>
              )
            )}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2 shrink-0">
            <LanguageToggle />
            <button
              onClick={toggle}
              className="flex items-center justify-center size-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
              aria-label="Toggle theme"
            >
              {mounted && (isDark ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />)}
            </button>

            <button
              className="hidden md:inline-flex px-3.5 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => router.push('/login')}
            >
              {t('landing_nav.iniciar_sesion')}
            </button>

            <Button
              className="hidden sm:inline-flex bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-5 py-2.5 text-sm font-semibold shadow-sm shadow-emerald-600/20 hover:shadow-emerald-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
              onClick={() => router.push('/registro')}
            >
              {t('landing_nav.empieza_ahora')}
            </Button>

            {/* Mobile hamburger */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button
                  className="lg:hidden flex items-center justify-center size-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                  aria-label={t('navbar.menu')}
                >
                  <Menu className="size-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[320px] sm:w-[380px] p-0">
                <SheetHeader className="p-6 pb-4 border-b border-border">
                  <SheetTitle className="flex items-center gap-2.5">
                    <div className="flex items-center justify-center size-8 rounded-lg bg-emerald-600 text-white">
                      <Sparkles className="size-4" />
                    </div>
                    <span className="text-lg font-bold">
                      Intensiva<span className="text-emerald-600">AR</span>
                    </span>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col px-4 py-4 gap-1">
                  {/* Search */}
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      placeholder={t('common.buscar')}
                      className="pl-9 h-10 rounded-lg bg-muted/50 border-0 focus-visible:ring-1"
                    />
                  </div>
                  {navItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => handleNavClick(item.href, item.navigate)}
                      className="flex items-center justify-between px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted/60 rounded-lg transition-colors"
                    >
                      {item.label}
                      <ChevronRight className="size-4 text-muted-foreground" />
                    </button>
                  ))}
                  <div className="border-t border-border my-3" />
                  <button
                    onClick={() => { setMobileOpen(false); router.push('/login'); }}
                    className="w-full px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted/60 rounded-lg transition-colors text-left"
                  >
                    {t('landing_nav.iniciar_sesion')}
                  </button>
                  <Button
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg mt-1"
                    onClick={() => { setMobileOpen(false); router.push('/registro'); }}
                  >
                    {t('landing_nav.empieza_ahora')}
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* ───────────────────────────────────────────────
         HERO
         ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden min-h-[85vh] flex items-center">
        {/* bg decorations */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-emerald-100/50 dark:bg-emerald-900/20 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-teal-100/40 dark:bg-teal-900/15 rounded-full blur-3xl translate-x-1/4 translate-y-1/4" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 md:pt-16 md:pb-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-xl"
            >
              <Badge className="mb-6 px-4 py-1.5 text-sm font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-0 gap-1.5">
                <Sparkles className="size-3.5" />
                {t('hero.badge')}
              </Badge>

              <h1 className="text-4xl sm:text-5xl md:text-[3.4rem] font-extrabold tracking-tight text-foreground leading-[1.1] mb-6">
                {t('hero.title_before')}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                  {t('hero.title_accent')}
                </span>
              </h1>

              <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-md">
                {t('hero.subtitle')}
              </p>

              <div className="flex flex-wrap items-center gap-3 mb-10">
                <Button
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-7 py-6 text-base font-semibold shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/35 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  onClick={() => router.push('/registro')}
                >
                  {t('hero.cta_primary')}
                  <ArrowRight className="size-4 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-xl px-7 py-6 text-base font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all"
                  onClick={() => {
                    const el = document.querySelector('#cursos');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {t('hero.cta_secondary')}
                </Button>
              </div>

              <div className="flex items-center gap-6 sm:gap-8 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-foreground">10k+</span>
                  <span className="text-sm text-muted-foreground">{t('hero.stat_students')}</span>
                </div>
                <div className="w-px h-8 bg-border hidden sm:block" />
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-foreground">500+</span>
                  <span className="text-sm text-muted-foreground">{t('hero.stat_courses')}</span>
                </div>
                <div className="w-px h-8 bg-border hidden sm:block" />
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-foreground">4.9</span>
                  <Star className="size-5 text-amber-400 fill-amber-400" />
                  <span className="text-sm text-muted-foreground">{t('hero.stat_rating')}</span>
                </div>
              </div>
            </motion.div>

            {/* Right — Image */}
            <motion.div
              initial={{ opacity: 0, x: 40, rotate: 2 }}
              animate={{ opacity: 1, x: 0, rotate: 1.5 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-emerald-200 to-teal-200 dark:from-emerald-800/30 dark:to-teal-800/30 rounded-3xl blur-2xl opacity-60" />
                <img
                  src="/hero-dashboard.png"
                  alt="IntensivaAR Dashboard"
                  className="relative w-full rounded-2xl shadow-2xl shadow-emerald-900/10 dark:shadow-emerald-900/30 border border-border/40"
                />
              </div>
              {/* floating badges */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.4 }}
                className="absolute -bottom-4 -left-4 bg-white dark:bg-[#0a0a0a] rounded-xl shadow-lg p-3 border border-border/60 flex items-center gap-2.5"
              >
                <div className="flex items-center justify-center size-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/50">
                  <Users className="size-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t('hero.connected_now')}</p>
                  <p className="text-sm font-semibold text-foreground">{t('hero.connected_students')}</p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.4 }}
                className="absolute -top-4 -right-4 bg-white dark:bg-[#0a0a0a] rounded-xl shadow-lg p-3 border border-border/60 flex items-center gap-2.5"
              >
                <div className="flex items-center justify-center size-9 rounded-lg bg-amber-100 dark:bg-amber-900/50">
                  <Star className="size-4 text-amber-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t('hero.satisfaction')}</p>
                  <p className="text-sm font-semibold text-foreground">{t('hero.positive')}</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────
         TRUST / LOGOS BAR
         ─────────────────────────────────────────────── */}
      <section className="py-12 md:py-16 border-y border-border/50 bg-muted/20 dark:bg-black/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <p className="text-center text-sm text-muted-foreground mb-8 tracking-wide uppercase font-medium">
              {t('trust_bar.text')}
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="flex items-center justify-center gap-3 md:gap-5 flex-wrap">
              {['Universidad de Buenos Aires (UBA)', 'Universidad Nacional de Córdoba', 'Universidad Tecnológica Nacional', 'UBA – Facultad de Derecho', 'Universidad Nacional de La Plata', 'Universidad de Rosario'].map((uni) => (
                <div
                  key={uni}
                  className="px-4 py-2 rounded-full bg-white dark:bg-[#0a0a0a] border border-border/60 text-xs sm:text-sm font-medium text-muted-foreground hover:border-emerald-300 dark:hover:border-emerald-700 hover:text-foreground transition-colors"
                >
                  {uni}
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ───────────────────────────────────────────────
         BENEFITS
         ─────────────────────────────────────────────── */}
      <SectionWrap id="beneficios">
        <SectionHeading
          badge={t('benefits.badge')}
          title={t('benefits.title')}
          subtitle={t('benefits.subtitle')}
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b, i) => (
            <FadeIn key={b.title} delay={i * 0.08}>
              <Card className="h-full group hover:shadow-xl hover:border-emerald-200 dark:hover:border-emerald-800 transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6 flex flex-col gap-4">
                  <div className="flex items-center justify-center size-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                    {b.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{b.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </SectionWrap>

      {/* ───────────────────────────────────────────────
         CATEGORIES
         ─────────────────────────────────────────────── */}
      <SectionWrap id="cursos" dark>
        <SectionHeading
          badge={t('categories.badge')}
          title={t('categories.title')}
          subtitle={t('categories.subtitle')}
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {categorias.map((cat, i) => (
            <FadeIn key={cat.name} delay={i * 0.06}>
              <Card
                className="group cursor-pointer hover:shadow-lg hover:border-emerald-200 dark:hover:border-emerald-800 transition-all duration-300 hover:-translate-y-0.5 h-full"
                onClick={() => {
                  if (cat.name === t('categories.historia')) router.push('/materias/historia');
                  if (cat.name === t('categories.matematicas')) router.push('/materias/matematicas/curso-intensivo');
                }}
              >
                <CardContent className="p-5 flex flex-col gap-3">
                  <div
                    className={`flex items-center justify-center size-12 rounded-xl ${cat.color} group-hover:scale-110 transition-transform duration-300`}
                  >
                    {cat.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm sm:text-base group-hover:text-emerald-600 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{cat.count} {t('common.cursos_disponibles')}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 mt-auto">
                    {t('common.explorar')}
                    <ArrowRight className="size-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </SectionWrap>

      {/* ───────────────────────────────────────────────
         VERANO / INVIERNO BANNER
         ─────────────────────────────────────────────── */}
      <SectionWrap>
        <div className="grid md:grid-cols-2 gap-5">
          <FadeIn direction="left">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-yellow-500 p-8 md:p-10 text-white min-h-[220px] flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Flame className="size-6" />
                  <span className="text-sm font-semibold uppercase tracking-widest opacity-90">
                    {t('seasons.verano_label')}
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-2">
                  {t('seasons.verano_title')}
                </h3>
                <p className="text-sm opacity-90 max-w-sm leading-relaxed">
                  {t('seasons.verano_desc')}
                </p>
              </div>
              <Button
                variant="secondary"
                className="relative z-10 w-fit bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm border-0 rounded-xl mt-4"
              >
                {t('seasons.verano_cta')}
                <ArrowRight className="size-4 ml-2" />
              </Button>
            </div>
          </FadeIn>
          <FadeIn direction="right">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-500 p-8 md:p-10 text-white min-h-[220px] flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Snowflake className="size-6" />
                  <span className="text-sm font-semibold uppercase tracking-widest opacity-90">
                    {t('seasons.invierno_label')}
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-2">
                  {t('seasons.invierno_title')}
                </h3>
                <p className="text-sm opacity-90 max-w-sm leading-relaxed">
                  {t('seasons.invierno_desc')}
                </p>
              </div>
              <Button
                variant="secondary"
                className="relative z-10 w-fit bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm border-0 rounded-xl mt-4"
              >
                {t('seasons.invierno_cta')}
                <ArrowRight className="size-4 ml-2" />
              </Button>
            </div>
          </FadeIn>
        </div>
      </SectionWrap>

      {/* ───────────────────────────────────────────────
         HOW IT WORKS
         ─────────────────────────────────────────────── */}
      <SectionWrap id="como-funciona" dark>
        <SectionHeading
          badge={t('how_it_works.badge')}
          title={t('how_it_works.title')}
          subtitle={t('how_it_works.subtitle')}
        />
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            {
              step: '01',
              icon: <Search className="size-7" />,
              title: t('how_it_works.s1_title'),
              desc: t('how_it_works.s1_desc'),
            },
            {
              step: '02',
              icon: <BarChart3 className="size-7" />,
              title: t('how_it_works.s2_title'),
              desc: t('how_it_works.s2_desc'),
            },
            {
              step: '03',
              icon: <CheckCircle2 className="size-7" />,
              title: t('how_it_works.s3_title'),
              desc: t('how_it_works.s3_desc'),
            },
          ].map((item, i) => (
            <FadeIn key={item.step} delay={i * 0.1}>
              <div className="text-center">
                <div className="flex items-center justify-center size-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 mx-auto mb-5">
                  {item.icon}
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-2 block">
                  {t('how_it_works.step_label')} {item.step}
                </span>
                <h3 className="text-xl font-semibold text-foreground mb-3">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                  {item.desc}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </SectionWrap>

      {/* ───────────────────────────────────────────────
         FEATURED PROFESSORS
         ─────────────────────────────────────────────── */}
      <SectionWrap id="profesores">
        <SectionHeading
          badge={t('professors_section.badge')}
          title={t('professors_section.title')}
          subtitle={t('professors_section.subtitle')}
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {profesores.map((prof, i) => (
            <FadeIn key={prof.name} delay={i * 0.07}>
              <Card className="group hover:shadow-lg hover:border-emerald-200 dark:hover:border-emerald-800 transition-all duration-300 h-full">
                <CardContent className="p-6 flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="size-12">
                      <AvatarFallback className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-semibold text-sm">
                        {prof.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-foreground truncate">{prof.name}</h4>
                      <p className="text-sm text-muted-foreground">{prof.subject}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-1.5">
                      <Stars count={Math.round(prof.rating)} />
                      <span className="text-sm font-medium text-foreground">{prof.rating}</span>
                      <span className="text-xs text-muted-foreground">({prof.reviews})</span>
                    </div>
                    <Badge
                      variant="secondary"
                      className={`text-xs font-medium border-0 ${
                        prof.modality === 'Online'
                          ? 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                      }`}
                    >
                      {prof.modality === 'Online' ? (
                        <Monitor className="size-3 mr-1" />
                      ) : (
                        <MapPin className="size-3 mr-1" />
                      )}
                      {prof.modality}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="size-3" />
                    {prof.location}
                  </p>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </SectionWrap>

      {/* ───────────────────────────────────────────────
         CATALOG
         ─────────────────────────────────────────────── */}
      <SectionWrap id="catalogo" dark>
        <SectionHeading
          badge={t('catalog.badge')}
          title={t('catalog.title')}
          subtitle={t('catalog.subtitle')}
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {catalogBooks.map((book, i) => (
            <FadeIn key={book.title} delay={i * 0.04}>
              <Card
                className={`group cursor-pointer hover:shadow-lg hover:border-emerald-200 dark:hover:border-emerald-800 transition-all duration-300 hover:-translate-y-0.5 h-full ${
                  book.navigateTo === 'historia' ? 'hover:ring-1 hover:ring-emerald-400/50' : book.navigateTo === 'matematicas' ? 'hover:ring-1 hover:ring-purple-400/50' : ''
                }`}
                onClick={() => {
                  if (book.navigateTo) navigateToSubject(book.navigateTo);
                }}
              >
                <CardContent className="p-5 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center justify-center size-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 shrink-0 group-hover:scale-110 transition-transform duration-300">
                      {book.icon}
                    </div>
                    <Badge variant="secondary" className="text-xs shrink-0">
                      {book.subject}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-sm text-foreground group-hover:text-emerald-600 transition-colors line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed flex-1">
                    {book.desc}
                  </p>
                  <p className="text-xs text-muted-foreground">{book.author}</p>
                  {book.navigateTo && (
                    <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 pt-2 border-t border-border/50">
                      {t('common.ver_material')}
                      <ArrowRight className="size-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </SectionWrap>

      {/* ───────────────────────────────────────────────
         TESTIMONIALS
         ─────────────────────────────────────────────── */}
      <SectionWrap id="testimonios">
        <SectionHeading
          badge={t('testimonials.badge')}
          title={t('testimonials.title')}
          subtitle={t('testimonials.subtitle')}
        />
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((tItem, i) => (
            <FadeIn key={tItem.name} delay={i * 0.1}>
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 flex flex-col gap-4">
                  <div className="flex items-center gap-1 mb-1">
                    <Stars count={tItem.rating} />
                  </div>
                  <p className="text-sm text-foreground leading-relaxed flex-1 italic">
                    &ldquo;{tItem.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-3 border-t border-border/60">
                    <Avatar className="size-9">
                      <AvatarFallback className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-semibold text-xs">
                        {tItem.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{tItem.name}</p>
                      <p className="text-xs text-muted-foreground">{tItem.course}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </SectionWrap>

      {/* ───────────────────────────────────────────────
         PRICING
         ─────────────────────────────────────────────── */}
      <SectionWrap id="precios" dark>
        <SectionHeading
          badge={t('pricing.badge')}
          title={t('pricing.title')}
          subtitle={t('pricing.subtitle')}
        />
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            {
              name: t('pricing.basico_name'),
              price: t('pricing.basico_price'),
              period: '',
              desc: t('pricing.basico_desc'),
              features: [
                t('pricing.basico_f1'),
                t('pricing.basico_f2'),
                t('pricing.basico_f3'),
                t('pricing.basico_f4'),
              ],
              cta: t('pricing.basico_cta'),
              featured: false,
            },
            {
              name: t('pricing.premium_name'),
              price: t('pricing.premium_price'),
              period: t('pricing.premium_period'),
              desc: t('pricing.premium_desc'),
              features: [
                t('pricing.premium_f1'),
                t('pricing.premium_f2'),
                t('pricing.premium_f3'),
                t('pricing.premium_f4'),
                t('pricing.premium_f5'),
                t('pricing.premium_f6'),
              ],
              cta: t('pricing.premium_cta'),
              featured: true,
            },
            {
              name: t('pricing.teachers_name'),
              price: t('pricing.teachers_price'),
              period: '',
              desc: t('pricing.teachers_desc'),
              features: [
                t('pricing.teachers_f1'),
                t('pricing.teachers_f2'),
                t('pricing.teachers_f3'),
                t('pricing.teachers_f4'),
                t('pricing.teachers_f5'),
              ],
              cta: t('pricing.teachers_cta'),
              featured: false,
            },
          ].map((plan, i) => (
            <FadeIn key={plan.name} delay={i * 0.1}>
              <Card
                className={`relative h-full flex flex-col ${
                  plan.featured
                    ? 'ring-2 ring-emerald-600 dark:ring-emerald-500 shadow-xl shadow-emerald-600/10 scale-[1.02] md:scale-105'
                    : 'hover:shadow-lg'
                } transition-all duration-300`}
              >
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-emerald-600 text-white border-0 px-4 py-1 text-xs font-semibold shadow-sm">
                      {t('pricing.popular')}
                    </Badge>
                  </div>
                )}
                <CardContent className="p-6 md:p-8 flex flex-col flex-1 gap-5">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">{plan.desc}</p>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl md:text-4xl font-extrabold text-foreground">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-sm text-muted-foreground">{plan.period}</span>
                    )}
                  </div>
                  <ul className="space-y-2.5 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                        <CheckCircle2 className="size-4 text-emerald-500 mt-0.5 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full rounded-xl py-5 font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] ${
                      plan.featured
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20'
                        : 'bg-muted hover:bg-muted/80 text-foreground'
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </SectionWrap>

      {/* ───────────────────────────────────────────────
         FAQ
         ─────────────────────────────────────────────── */}
      <SectionWrap id="faq">
        <SectionHeading
          badge={t('faq.badge')}
          title={t('faq.title')}
          subtitle={t('faq.subtitle')}
        />
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <Accordion type="single" collapsible className="space-y-3">
              {faqItems.map((item, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="bg-card border border-border rounded-xl px-5 data-[state=open]:border-emerald-300 dark:data-[state=open]:border-emerald-800 data-[state=open]:shadow-md transition-all"
                >
                  <AccordionTrigger className="hover:no-underline py-4 text-left text-base font-medium">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </FadeIn>
        </div>
      </SectionWrap>

      {/* ───────────────────────────────────────────────
         NEWSLETTER CTA
         ─────────────────────────────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 p-8 sm:p-12 md:p-16 text-center">
              <div className="absolute top-0 left-0 w-80 h-80 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full" />
              <div className="relative z-10 max-w-xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                  {t('newsletter.title')}
                </h2>
                <p className="text-emerald-100 text-base sm:text-lg mb-8 leading-relaxed">
                  {t('newsletter.subtitle')}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <Input
                    type="email"
                    placeholder={t('newsletter.placeholder')}
                    className="h-12 bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder:text-emerald-200/60 rounded-xl focus-visible:ring-2 focus-visible:ring-white/50"
                  />
                  <Button className="h-12 bg-white text-emerald-700 hover:bg-emerald-50 font-semibold rounded-xl px-6 shadow-lg shadow-black/10 shrink-0 hover:scale-[1.02] active:scale-[0.98] transition-all">
                    {t('newsletter.cta')}
                    <ArrowRight className="size-4 ml-2" />
                  </Button>
                </div>
                <p className="text-xs text-emerald-200/60 mt-4">
                  {t('newsletter.no_spam')}
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ───────────────────────────────────────────────
         FOOTER
         ─────────────────────────────────────────────── */}
      <footer className="bg-gray-950 text-gray-300 dark:bg-black dark:text-gray-400">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-10">
            {/* Brand */}
            <div className="col-span-2 md:col-span-3 lg:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="flex items-center justify-center size-8 rounded-lg bg-emerald-600 text-white">
                  <Sparkles className="size-4" />
                </div>
                <span className="text-lg font-bold text-white">
                  Intensiva<span className="text-emerald-400">AR</span>
                </span>
              </div>
              <p className="text-sm leading-relaxed mb-5 max-w-xs">
                {t('landing_footer.desc')}
              </p>
              <div className="flex items-center gap-2">
                {[
                  { icon: <Globe className="size-4" />, label: 'Web' },
                  { icon: <Mail className="size-4" />, label: 'Email' },
                  { icon: <BookOpen className="size-4" />, label: 'Blog' },
                ].map((s) => (
                  <button
                    key={s.label}
                    className="flex items-center justify-center size-9 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    aria-label={s.label}
                  >
                    {s.icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Producto */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
                {t('landing_footer.producto')}
              </h4>
              <ul className="space-y-2.5">
                {[
                  { label: t('common.cursos'), href: '#cursos' },
                  { label: t('common.explorar'), href: '/explorar', nav: true },
                  { label: t('common.materias'), href: '/materias', nav: true },
                  { label: t('common.catalogo'), href: '#catalogo' },
                ].map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => handleNavClick(link.href, link.nav)}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Empresa */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
                {t('landing_footer.empresa')}
              </h4>
              <ul className="space-y-2.5">
                {[t('landing_footer.sobre_nosotros'), t('landing_footer.contacto_link'), t('landing_footer.blog'), t('landing_footer.trabaja_con_nosotros')].map((item) => (
                  <li key={item}>
                    <button className="text-sm text-gray-400 hover:text-white transition-colors">
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
                {t('landing_footer.legal')}
              </h4>
              <ul className="space-y-2.5">
                {[t('landing_footer.terminos'), t('landing_footer.privacidad'), t('landing_footer.preguntas_frecuentes')].map(
                  (item) => (
                    <li key={item}>
                      <button className="text-sm text-gray-400 hover:text-white transition-colors">
                        {item}
                      </button>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Contacto */}
            <div className="col-span-2 md:col-span-1">
              <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
                {t('landing_footer.contacto')}
              </h4>
              <ul className="space-y-2.5">
                <li className="flex items-center gap-2 text-sm text-gray-400">
                  <Mail className="size-3.5 shrink-0" />
                  hola@intensiva.ar
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-400">
                  <MapPin className="size-3.5 shrink-0" />
                  Buenos Aires, Argentina
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-400">
                  <Phone className="size-3.5 shrink-0" />
                  +54 11 5555-0000
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-gray-500">
              &copy; {new Date().getFullYear()} IntensivaAR. {t('common.todos_derechos')}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span>{t('common.hecho_con')}</span>
              <Heart className="size-3 text-emerald-500 fill-emerald-500" />
              <span>{t('common.en_argentina')}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
