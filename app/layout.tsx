import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// 1. Importe o AuthProvider que criamos (certifique-se de ter criado o arquivo AuthContext.tsx antes)
import { AuthProvider } from "@/lib/contexts/AuthContext";

const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"], 
  variable: "--font-plus-jakarta",
  display: "swap",
});

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"], 
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Código Massa",
  description: "Plataforma de treino para OBI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${plusJakarta.variable} ${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-brand-dark text-brand-text`}>
        {/* 2. Envolva o children com o AuthProvider */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}