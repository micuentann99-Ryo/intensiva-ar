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
} from 'lucide-react';

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
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when pathname changes (handled in Sheet onOpenChange)

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-border'
          : 'bg-white'
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

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-3 py-2 text-sm font-medium transition-colors rounded-md hover:bg-muted/60 ${
                    isActive
                      ? 'text-emerald-700 bg-emerald-50'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

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

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
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
              <nav className="flex flex-col gap-1 mt-4">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      className={`px-3 py-3 text-sm font-medium transition-colors rounded-md hover:bg-muted/60 text-left ${
                        isActive
                          ? 'text-emerald-700 bg-emerald-50'
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
    </header>
  );
}
