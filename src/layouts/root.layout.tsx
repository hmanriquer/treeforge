import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/providers/theme.provider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <main className="bg-background text-foreground flex h-screen flex-col overflow-hidden">
        <section className="relative flex flex-1 overflow-hidden">
          {children}
        </section>
        <Toaster richColors position="top-center" duration={2000} />
      </main>
    </ThemeProvider>
  );
}
