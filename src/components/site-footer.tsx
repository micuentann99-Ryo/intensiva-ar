'use client';

import Link from 'next/link';
import { Sparkles, Instagram, Facebook, Twitter, Youtube } from 'lucide-react';

const footerNav = {
  Navegación: [
    { label: 'Inicio', href: '/' },
    { label: 'Cursos', href: '/' },
    { label: 'Profesores', href: '/#profesores' },
    { label: 'Cómo funciona', href: '/#como-funciona' },
    { label: 'Blog', href: '/' },
  ],
  Categorías: [
    { label: 'Matemáticas', href: '/materias' },
    { label: 'Historia', href: '/materias/historia' },
    { label: 'Ingreso Universitario', href: '/materias' },
    { label: 'Inglés', href: '/materias' },
    { label: 'Ciencias', href: '/materias' },
    { label: 'Programación', href: '/materias' },
  ],
  Información: [
    { label: 'Sobre nosotros', href: '/' },
    { label: 'Contacto', href: '/' },
    { label: 'Términos y condiciones', href: '/' },
    { label: 'Política de privacidad', href: '/' },
    { label: 'Preguntas frecuentes', href: '/' },
  ],
};

export default function SiteFooter() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center size-9 rounded-lg bg-emerald-600 text-white">
                <Sparkles className="size-5" />
              </div>
              <span className="text-xl font-bold text-white">IntensivaAR</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              La plataforma líder en clases intensivas de verano e invierno en todo
              el país. Conectamos estudiantes con los mejores profesores.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="size-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-emerald-600 transition-colors"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {Object.entries(footerNav).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-white mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-emerald-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>&copy; 2024 IntensivaAR. Todos los derechos reservados.</p>
          <p>Hecho con 💚 en Argentina</p>
        </div>
      </div>
    </footer>
  );
}
