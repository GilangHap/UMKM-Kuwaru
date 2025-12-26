import { PropsWithChildren, useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from './AppLayout';
import Sidebar, { MenuIcons } from '@/Components/Sidebar';
import DashboardHeader from '@/Components/DashboardHeader';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface AdminLayoutProps extends PropsWithChildren {
    title: string;
    pageTitle?: string;
    breadcrumbs?: BreadcrumbItem[];
    actions?: React.ReactNode;
}

/**
 * AdminLayout - Layout untuk dashboard Admin Desa
 * 
 * Features:
 * - Sidebar dengan menu Admin Desa
 * - Collapsible sidebar
 * - DashboardHeader dengan breadcrumbs
 * - Responsive mobile overlay
 */
export default function AdminLayout({ 
    children, 
    title,
    pageTitle,
    breadcrumbs = [],
    actions
}: AdminLayoutProps) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    // Menu items untuk Admin Desa
    const menuItems = [
        {
            name: 'Dashboard',
            href: route('admin.dashboard'),
            icon: MenuIcons.Dashboard,
            active: route().current('admin.dashboard'),
        },
        {
            name: 'UMKM',
            href: route('admin.umkm.index'),
            icon: MenuIcons.UMKM,
            active: route().current('admin.umkm.*'),
        },
        {
            name: 'Artikel',
            href: route('admin.articles.index'),
            icon: MenuIcons.Article,
            active: route().current('admin.articles.*'),
        },
        {
            name: 'Kategori',
            href: route('admin.categories.index'),
            icon: MenuIcons.Category,
            active: route().current('admin.categories.*'),
        },
        {
            name: 'Pengguna',
            href: route('admin.users.index'),
            icon: MenuIcons.Users,
            active: route().current('admin.users.*'),
        },
        {
            name: 'Statistik',
            href: route('admin.statistics.index'),
            icon: MenuIcons.Stats,
            active: route().current('admin.statistics.*'),
        },
        {
            name: 'Pengaturan',
            href: route('admin.settings.index'),
            icon: MenuIcons.Settings,
            active: route().current('admin.settings.*'),
        },
        {
            name: 'Activity Log',
            href: route('admin.activity-logs.index'),
            icon: (props: any) => (
                <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
            ),
            active: route().current('admin.activity-logs.*'),
        },
    ];
    
    return (
        <AppLayout>
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
                    <h1 className="font-semibold text-foreground">{pageTitle || title}</h1>
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
