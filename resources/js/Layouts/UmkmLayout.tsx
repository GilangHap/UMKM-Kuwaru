import { PropsWithChildren, useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AppLayout from './AppLayout';
import Sidebar, { MenuIcons } from '@/Components/Sidebar';
import DashboardHeader from '@/Components/DashboardHeader';
import { ThemeConfig, createUmkmTheme } from '@/Components/ThemeProvider';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface UmkmLayoutProps extends PropsWithChildren {
    title: string;
    pageTitle?: string;
    breadcrumbs?: BreadcrumbItem[];
    actions?: React.ReactNode;
}

/**
 * UmkmLayout - Layout untuk dashboard Admin UMKM
 * 
 * Features:
 * - Sidebar dengan menu UMKM
 * - Support UMKM theme override
 * - Collapsible sidebar
 * - Responsive mobile
 */
export default function UmkmLayout({ 
    children, 
    title,
    pageTitle,
    breadcrumbs = [],
    actions
}: UmkmLayoutProps) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    // Get UMKM data untuk theme
    const { umkm } = usePage().props as any;
    
    // Create custom theme jika UMKM punya theme
    let customTheme: ThemeConfig | undefined;
    if (umkm?.theme) {
        customTheme = createUmkmTheme(
            umkm.theme.primary_color,
            umkm.theme.secondary_color,
            umkm.theme.accent_color
        );
    }
    
    // Menu items untuk Admin UMKM
    const menuItems = [
        {
            name: 'Dashboard',
            href: route('umkm.dashboard'),
            icon: MenuIcons.Dashboard,
            active: route().current('umkm.dashboard'),
        },
        {
            name: 'Profil UMKM',
            href: route('umkm.profile.edit'),
            icon: MenuIcons.Profile,
            active: route().current('umkm.profile*'),
        },
        {
            name: 'Produk',
            href: route('umkm.products.index'),
            icon: MenuIcons.Product,
            active: route().current('umkm.products.*'),
        },
        {
            name: 'Artikel',
            href: route('umkm.articles.index'),
            icon: MenuIcons.Article,
            active: route().current('umkm.articles.*'),
        },
        {
            name: 'Branding',
            href: route('umkm.branding.edit'),
            icon: MenuIcons.Branding,
            active: route().current('umkm.branding*'),
        },
        {
            name: 'Statistik',
            href: route('umkm.statistics'),
            icon: MenuIcons.Stats,
            active: route().current('umkm.statistics'),
        },
        {
            name: 'Akun',
            href: route('umkm.account'),
            icon: MenuIcons.Settings,
            active: route().current('umkm.account*'),
        },
    ];
    
    return (
        <AppLayout theme={customTheme}>
            <Head title={title} />
            
            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}
            
            {/* Sidebar - Desktop */}
            <div className="hidden lg:block">
                <Sidebar 
                    menuItems={menuItems}
                    collapsed={sidebarCollapsed}
                    onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
                />
            </div>
            
            {/* Sidebar - Mobile */}
            {mobileMenuOpen && (
                <div className="lg:hidden fixed inset-y-0 left-0 z-40 animate-slide-in-left">
                    <Sidebar 
                        menuItems={menuItems}
                        collapsed={false}
                        isMobile={true}
                        onClose={() => setMobileMenuOpen(false)}
                    />
                </div>
            )}
            
            {/* Main Content */}
            <div 
                className={`min-h-screen transition-all duration-300 ${
                    sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-[280px]'
                }`}
            >
                {/* UMKM Status Banner (jika suspended) */}
                {umkm?.status === 'suspended' && (
                    <div className="bg-warning/10 border-b border-warning/20 px-4 py-3 text-center">
                        <p className="text-sm text-warning font-medium">
                            UMKM Anda sedang dalam peninjauan. Beberapa fitur mungkin dibatasi.
                        </p>
                    </div>
                )}
                
                {/* Mobile Header */}
                <div className="lg:hidden sticky top-0 z-20 bg-surface border-b border-border px-4 py-3 flex items-center gap-4">
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="p-2 rounded-lg hover:bg-surface-hover transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="font-semibold text-foreground">{pageTitle || title}</h1>
                        {umkm && (
                            <p className="text-xs text-muted">{umkm.name}</p>
                        )}
                    </div>
                </div>
                
                {/* Desktop Header */}
                <div className="hidden lg:block">
                    <DashboardHeader 
                        title={pageTitle || title}
                        breadcrumbs={breadcrumbs}
                        actions={actions}
                    />
                </div>
                
                {/* Page Content */}
                <main className="p-6">
                    {children}
                </main>
            </div>
        </AppLayout>
    );
}
