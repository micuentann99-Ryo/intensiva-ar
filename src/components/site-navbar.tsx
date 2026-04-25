'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Menu,
  Sparkles,
  Search,
  Sun,
  Moon,
} from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';

const navLinks = [
  { label: 'Cursos', href: '/' },
  { label: 'Explorar', href: '/explorar' },
  { label: 'Materias', href: '/materias' },
  { label: 'Historia', href: '/materias/historia' },
  { label: 'Profesores', href: '/#profesores' },
  { label: 'Catálogo', href: '/#catalogo' },
];

export default function SiteNavbar() {
  const pathname = usePathname();
  const { isDark, toggle: toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().toLowerCase().includes('historia')) {
      window.location.href = '/materias/historia';
    } else if (searchQuery.trim()) {
      window.location.href = '/materias';
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 dark:bg-black/95 backdrop-blur-md shadow-sm border-b border-border'
          : 'bg-white dark:bg-black'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 hover:opacity-80 transition-opacity">
            <div className="flex items-center justify-center size-9 rounded-lg bg-emerald-600 text-white">
              <Sparkles className="size-5" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-lg font-bold text-foreground tracking-tight">
                IntensivaAR
              </span>
              <span className="text-[10px] text-muted-foreground hidden sm:block">
                Clases intensivas Argentina
              </span>
            </div>
          </Link>

          {/* Desktop: Search Bar + Theme Toggle + Nav Links */}
          <div className="hidden lg:flex items-center gap-3 flex-1 ml-6 max-w-2xl">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscador"
                className="w-full h-9 pl-9 pr-3 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
              />
            </form>

            {/* Theme Toggle: Sun / Moon */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center size-9 rounded-lg border border-border bg-background text-foreground hover:bg-muted/80 transition-colors"
              aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              title={isDark ? 'Modo claro' : 'Modo oscuro'}
            >
              {isDark ? (
                <Sun className="size-[18px] text-amber-400" />
              ) : (
                <Moon className="size-[18px] text-slate-600" />
              )}
            </button>

            {/* Nav Links */}
            <nav className="flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`px-3 py-2 text-sm font-medium transition-colors rounded-md hover:bg-muted/60 ${
                      isActive
                        ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <Button variant="outline" size="sm" className="text-sm">
              ¿Sos profesor?
            </Button>
            <Button variant="ghost" size="sm" className="text-sm">
              Ingresa
            </Button>
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
              Regístrate
            </Button>
          </div>

          {/* Mobile: Theme Toggle + Menu */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center size-9 rounded-lg border border-border bg-background text-foreground hover:bg-muted/80 transition-colors"
              aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {isDark ? (
                <Sun className="size-[18px] text-amber-400" />
              ) : (
                <Moon className="size-[18px] text-slate-600" />
              )}
            </button>
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="size-5" />
                  <span className="sr-only">Abrir menú</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <div className="flex items-center justify-center size-8 rounded-lg bg-emerald-600 text-white">
                      <Sparkles className="size-4" />
                    </div>
                    IntensivaAR
                  </SheetTitle>
                </SheetHeader>

                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="mt-4 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscador"
                    className="w-full h-10 pl-9 pr-3 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
                  />
                </form>

                <nav className="flex flex-col gap-1 mt-4">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                    return (
                      <Link
                        key={link.label}
                        href={link.href}
                        className={`px-3 py-3 text-sm font-medium transition-colors rounded-md hover:bg-muted/60 text-left ${
                          isActive
                            ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </nav>
                <div className="flex flex-col gap-2 mt-6 pt-6 border-t">
                  <Button variant="outline" className="w-full">¿Sos profesor?</Button>
                  <Button variant="ghost" className="w-full">Ingresa</Button>
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">Regístrate</Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
