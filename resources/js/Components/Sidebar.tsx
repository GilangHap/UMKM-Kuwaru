import { Link, usePage } from '@inertiajs/react';
import { useState, ReactNode } from 'react';
import SiteLogo from './SiteLogo';

interface MenuItem {
    name: string;
    href: string;
    icon: ReactNode | ((props: any) => ReactNode);
    active?: boolean;
}

interface SidebarProps {
    menuItems: MenuItem[];
    collapsed?: boolean;
    onToggleCollapse?: () => void;
    onClose?: () => void;
    isMobile?: boolean;
}

/**
 * Sidebar - Dashboard sidebar navigation
 * 
 * Features:
 * - Collapsible (icon only mode)
 * - Active state highlight
 * - User info
 * - Role-based menu (passed via props)
 */
export default function Sidebar({ 
    menuItems, 
    collapsed = false,
    onToggleCollapse,
    onClose,
    isMobile = false
}: SidebarProps) {
    const { auth } = usePage().props as any;
    const user = auth?.user;
    
    const sidebarWidth = collapsed ? '80px' : '280px';
    
    return (
        <aside 
            className="scrollbar-thin"
            style={{
                position: 'fixed',
                left: 0,
                top: 0,
                height: '100vh',
                width: sidebarWidth,
                backgroundColor: 'rgb(var(--color-surface))',
                borderRight: '1px solid rgb(var(--color-border))',
                display: 'flex',
                flexDirection: 'column',
                transition: 'width 0.3s',
                zIndex: 40,
            }}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
                <SiteLogo 
                    size="sm" 
                    showText={!collapsed} 
                />
                
                {/* Close Button - Mobile Only */}
                {isMobile && onClose && (
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-surface-hover transition-colors"
                        aria-label="Close sidebar"
                    >
                        <svg 
                            className="w-5 h-5 text-muted" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
                
                {/* Collapse Button - Desktop Only */}
                {!isMobile && (
                    <button
                        onClick={onToggleCollapse}
                        className="p-2 rounded-lg hover:bg-surface-hover transition-colors"
                        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        <svg 
                            className={`w-5 h-5 text-muted transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                        </svg>
                    </button>
                )}
            </div>
            
            {/* User Info */}
            {user && (
                <div className={`p-4 border-b border-border ${collapsed ? 'items-center' : ''}`}>
                    <div className={`flex ${collapsed ? 'justify-center' : 'items-center gap-3'}`}>
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-primary font-semibold text-sm">
                                {user.name?.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        {!collapsed && (
                            <div className="min-w-0">
                                <p className="font-medium text-foreground text-sm truncate">
                                    {user.name}
                                </p>
                                <p className="text-xs text-muted truncate">
                                    {user.role === 'admin_desa' ? 'Admin Desa' : 'Admin UMKM'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
            
            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {menuItems.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group
                            ${item.active 
                                ? 'bg-primary/10 text-primary font-medium' 
                                : 'text-muted hover:bg-surface-hover hover:text-foreground'
                            }
                            ${collapsed ? 'justify-center' : ''}
                        `}
                        title={collapsed ? item.name : undefined}
                    >
                        <span className="w-5 h-5 flex-shrink-0">
                            {typeof item.icon === 'function' ? item.icon({ className: 'w-5 h-5' }) : item.icon}
                        </span>
                        {!collapsed && (
                            <span className="text-sm">{item.name}</span>
                        )}
                    </Link>
                ))}
            </nav>
            
            {/* Footer */}
            <div className="p-4 border-t border-border">
                <Link
                    href="/logout"
                    method="post"
                    as="button"
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted hover:bg-red-50 hover:text-red-600 transition-all duration-200 w-full
                        ${collapsed ? 'justify-center' : ''}
                    `}
                    title={collapsed ? 'Keluar' : undefined}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    {!collapsed && <span className="text-sm">Keluar</span>}
                </Link>
            </div>
        </aside>
    );
}

// =====================================================
// MENU ICONS
// =====================================================

export const MenuIcons = {
    Dashboard: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
    ),
    UMKM: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
    ),
    Article: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    ),
    Category: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
    ),
    Stats: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
    ),
    Settings: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    ),
    Profile: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    ),
    Product: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
    ),
    Branding: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
    ),
    Users: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
    ),
};
