import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { lang } from "@/lib/lang";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: lang.app.name,
  description: lang.app.description,
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${jakarta.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#171717" />
        <script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem('theme');var d=t?t==='dark':true;document.documentElement.classList.toggle('dark',d);var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute('content',d?'#171717':'#ffffff')}catch(e){}` }} />
      </head>
      <body className="min-h-full flex flex-col bg-background">
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
