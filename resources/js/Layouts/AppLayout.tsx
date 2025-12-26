import { PropsWithChildren } from 'react';
import { ThemeProvider, ThemeConfig, SiteSettings } from '@/Components/ThemeProvider';

interface AppLayoutProps extends PropsWithChildren {
    theme?: ThemeConfig;
    settings?: SiteSettings;
}

/**
 * AppLayout - Root layout wrapper untuk semua halaman
 * 
 * Fungsi:
 * - Wrap aplikasi dengan ThemeProvider
 * - Inject CSS variables untuk theming
 * - Base styling konsisten
 * 
 * Digunakan sebagai wrapper paling luar,
 * kemudian nested dengan layout spesifik (PublicLayout, AdminLayout, dll)
 */
export default function AppLayout({ 
    children, 
    theme, 
    settings 
}: AppLayoutProps) {
    return (
        <ThemeProvider theme={theme} settings={settings}>
            <div className="min-h-screen bg-background text-foreground antialiased">
                {children}
            </div>
        </ThemeProvider>
    );
}
