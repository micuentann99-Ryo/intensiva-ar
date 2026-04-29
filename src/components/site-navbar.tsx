'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  LogOut,
  User,
  Shield,
  ChevronDown,
  MessageCircle,
} from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { useT } from '@/i18n/context';
import { useAuth } from '@/lib/auth-context';
import LanguageToggle from '@/components/language-toggle';

export default function SiteNavbar() {
  const t = useT();
  const pathname = usePathname();
  const router = useRouter();
  const { isDark, toggle: toggleTheme } = useTheme();
  const { user, loading, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navLinks = [
    { label: t('common.cursos'), href: '/' },
    { label: t('common.explorar'), href: '/explorar' },
    { label: t('common.materias'), href: '/materias' },
    { label: t('common.historia'), href: '/materias/historia' },
    { label: t('common.profesores'), href: '/#profesores' },
    { label: t('common.catalogo'), href: '/#catalogo' },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    if (!userMenuOpen) return;
    const handle = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-user-menu]')) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [userMenuOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().toLowerCase().includes('historia')) {
      router.push('/materias/historia');
    } else if (searchQuery.trim()) {
      router.push('/materias');
    }
  };

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
  };

  const roleBadgeColor = user?.role === 'ADMIN'
    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
    : user?.role === 'PROFESSOR'
    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300';

  const roleLabel = user?.role === 'ADMIN' ? 'Admin' : user?.role === 'PROFESSOR' ? t('navbar.profesor') : t('navbar.alumno');

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
                {t('navbar.subtitle')}
              </span>
            </div>
          </Link>

          {/* Desktop: Search Bar + Theme Toggle + Nav Links */}
          <div className="hidden lg:flex items-center gap-3 flex-1 ml-6 max-w-2xl">
            <form onSubmit={handleSearch} className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('common.buscador')}
                className="w-full h-9 pl-9 pr-3 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
              />
            </form>

            <LanguageToggle />

            <button
              onClick={toggleTheme}
              className="flex items-center justify-center size-9 rounded-lg border border-border bg-background text-foreground hover:bg-muted/80 transition-colors"
              aria-label={isDark ? t('navbar.modo_claro') : t('navbar.modo_oscuro')}
              title={isDark ? t('navbar.modo_claro') : t('navbar.modo_oscuro')}
            >
              {isDark ? (
                <Sun className="size-[18px] text-amber-400" />
              ) : (
                <Moon className="size-[18px] text-slate-600" />
              )}
            </button>

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
            {!loading && user && (
              <Link
                href="/chat"
                className="relative flex items-center justify-center size-9 rounded-lg border border-border bg-background text-foreground hover:bg-muted/80 transition-colors"
                title="Mensajes"
              >
                <MessageCircle className="size-[18px]" />
              </Link>
            )}
            {!loading && user ? (
              <div className="relative" data-user-menu>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border hover:bg-muted/60 transition-colors"
                >
                  <div className="flex items-center justify-center size-7 rounded-full bg-emerald-600 text-white text-xs font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-foreground max-w-[120px] truncate">
                    {user.name}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${roleBadgeColor}`}>
                    {roleLabel}
                  </span>
                  <ChevronDown className={`size-3.5 text-muted-foreground transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-black border border-border rounded-xl shadow-lg py-1 z-50">
                    {user.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-muted/60 transition-colors"
                      >
                        <Shield className="size-4 text-emerald-600" />
                        {t('navbar.admin_panel')}
                      </Link>
                    )}
                    {user.role === 'STUDENT' && (
                      <Link
                        href="/mis-actividades"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-muted/60 transition-colors"
                      >
                        <FileText className="size-4 text-emerald-600" />
                        {t('navbar.mis_actividades')}
                      </Link>
                    )}
                    <Link
                      href="/perfil"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-muted/60 transition-colors"
                    >
                      <User className="size-4 text-muted-foreground" />
                      {t('navbar.mi_perfil')}
                    </Link>
                    <div className="border-t border-border my-1" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors w-full text-left"
                    >
                      <LogOut className="size-4" />
                      {t('navbar.cerrar_sesion')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/registro/profesor">
                  <Button variant="outline" size="sm" className="text-sm">
                    {t('navbar.sos_profesor')}
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-sm">
                    {t('navbar.ingresa')}
                  </Button>
                </Link>
                <Link href="/registro">
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    {t('navbar.registrate')}
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile: Theme Toggle + Language + Menu */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center size-9 rounded-lg border border-border bg-background text-foreground hover:bg-muted/80 transition-colors"
              aria-label={isDark ? t('navbar.modo_claro') : t('navbar.modo_oscuro')}
            >
              {isDark ? (
                <Sun className="size-[18px] text-amber-400" />
              ) : (
                <Moon className="size-[18px] text-slate-600" />
              )}
            </button>
            {!loading && user && (
              <Link
                href="/chat"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5 px-3 py-3 text-sm font-medium text-foreground hover:bg-muted/60 transition-colors rounded-md"
              >
                <MessageCircle className="size-4" />
                Mensajes
              </Link>
            )}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="size-5" />
                  <span className="sr-only">{t('navbar.abrir_menu')}</span>
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

                <form onSubmit={handleSearch} className="mt-4 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('common.buscador')}
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
                        onClick={() => setMobileOpen(false)}
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
                  {!loading && user ? (
                    <>
                      <div className="flex items-center gap-3 px-3 py-2">
                        <div className="flex items-center justify-center size-9 rounded-full bg-emerald-600 text-white text-sm font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${roleBadgeColor}`}>
                            {roleLabel}
                          </span>
                        </div>
                      </div>
                      {user.role === 'ADMIN' && (
                        <Link href="/admin" onClick={() => setMobileOpen(false)}>
                          <Button variant="outline" className="w-full gap-2">
                            <Shield className="size-4" />
                            {t('navbar.admin_panel')}
                          </Button>
                        </Link>
                      )}
                      {user.role === 'STUDENT' && (
                        <Link href="/mis-actividades" onClick={() => setMobileOpen(false)}>
                          <Button variant="outline" className="w-full gap-2">
                            <FileText className="size-4" />
                            {t('navbar.mis_actividades')}
                          </Button>
                        </Link>
                      )}
                      <Link href="/perfil" onClick={() => setMobileOpen(false)}>
                        <Button variant="ghost" className="w-full gap-2">
                          <User className="size-4" />
                          {t('navbar.mi_perfil')}
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        className="w-full text-red-600 dark:text-red-400 gap-2"
                        onClick={() => { handleLogout(); setMobileOpen(false); }}
                      >
                        <LogOut className="size-4" />
                        {t('navbar.cerrar_sesion')}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/registro/profesor" onClick={() => setMobileOpen(false)}>
                        <Button variant="outline" className="w-full">{t('navbar.sos_profesor')}</Button>
                      </Link>
                      <Link href="/login" onClick={() => setMobileOpen(false)}>
                        <Button variant="ghost" className="w-full">{t('navbar.ingresa')}</Button>
                      </Link>
                      <Link href="/registro" onClick={() => setMobileOpen(false)}>
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">{t('navbar.registrate')}</Button>
                      </Link>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
