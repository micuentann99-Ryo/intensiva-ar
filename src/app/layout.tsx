import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
