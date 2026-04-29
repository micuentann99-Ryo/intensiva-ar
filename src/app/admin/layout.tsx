'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Sparkles, Menu, X, LayoutDashboard, Users, GraduationCap, FileText, ScrollText, Bug, ChevronRight, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useT } from '@/i18n/context';

const sidebarLinks = [
  { key: 'dashboard', href: '/admin', icon: LayoutDashboard },
  { key: 'users', href: '/admin/usuarios', icon: Users },
  { key: 'professors', href: '/admin/profesores', icon: GraduationCap },
  { key: 'submissions', href: '/admin/actividades', icon: FileText },
  { key: 'logs', href: '/admin/logs', icon: ScrollText },
  { key: 'bug_reports', href: '/admin/reportes', icon: Bug },
];

function SidebarContent({ t, pathname, onClose }: { t: (k: string) => string; pathname: string; onClose?: () => void }) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-5 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center size-8 rounded-lg bg-emerald-600 text-white">
            <Sparkles className="size-4" />
          </div>
          <div>
            <span className="text-sm font-bold text-foreground">{t('admin.title')}</span>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.key}
              href={link.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 dark:bg-emerald-900/30'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
              }`}
            >
              <Icon className="size-4" />
              {t(`admin.${link.key}`)}
              {isActive && <ChevronRight className="size-3 ml-auto" />}
            </Link>
          );
        })}
      </nav>
      <div className="px-3 py-4 border-t border-border">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
        >
          <LogOut className="size-4" />
          {t('admin.go_home')}
        </Link>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const t = useT();
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="size-8 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
      </div>
    );
  }

  if (!user || user.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-white dark:bg-black shrink-0 sticky top-0 h-screen overflow-y-auto">
        <SidebarContent t={t} pathname={pathname} />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar (mobile) */}
        <header className="sticky top-0 z-40 bg-white dark:bg-black border-b border-border h-14 flex items-center px-4 gap-3 lg:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SidebarContent t={t} pathname={pathname} onClose={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center size-7 rounded-lg bg-emerald-600 text-white">
              <Sparkles className="size-3.5" />
            </div>
            <span className="text-sm font-bold text-foreground">{t('admin.title')}</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
