import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteChrome from '@/components/SiteChrome';
import { AuthProvider } from '@/context/AuthProvider';
import { I18nProvider } from '@/i18n/I18nProvider';
// VoiceAssistant is a client component; import directly — server components
// can include client components. Avoid using `ssr: false` dynamic in a
// Server Component (layout) as Next.js disallows it.
import VoiceAssistant from '@/components/voice/VoiceAssistant';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ShopEasy",
  description: "Your one-stop shop for all things easy",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // Render the html/body tags at the top-level server component. Client
  // components like I18nProvider must be placed inside the body (not above
  // the html/body tags) to satisfy Next.js app router requirements.
  return (
    <html lang="en">
  <body suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <I18nProvider>
          <AuthProvider>
            <SiteChrome>{children}</SiteChrome>
            <VoiceAssistant />
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
