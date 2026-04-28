import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { I18nProvider } from "@/i18n/context";
import { AuthProvider } from "@/lib/auth-context";
import BugReportButton from "@/components/bug-report-button";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "IntensivaAR - Clases intensivas Argentina",
  description:
    "La plataforma líder en clases intensivas de verano e invierno en Argentina. Encontrá cursos para materias previas, ingreso universitario, idiomas y mucho más.",
  keywords: [
    "clases intensivas",
    "Argentina",
    "verano intensivo",
    "invierno intensivo",
    "ingreso universitario",
    "cursos",
    "profesores",
    "CBC",
    "UBA",
  ],
  authors: [{ name: "IntensivaAR" }],
  openGraph: {
    title: "IntensivaAR - Clases intensivas Argentina",
    description:
      "Encontrá cursos intensivos de verano e invierno para materias previas, ingreso universitario, idiomas y mucho más.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased bg-background text-foreground`}
      >
        <I18nProvider>
          <AuthProvider>
            {children}
            <BugReportButton />
            <Toaster />
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
