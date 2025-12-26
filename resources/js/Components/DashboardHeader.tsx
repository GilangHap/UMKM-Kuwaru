import { Link, usePage } from '@inertiajs/react';
import Dropdown from './Dropdown';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface DashboardHeaderProps {
    title: string;
    breadcrumbs?: BreadcrumbItem[];
    actions?: React.ReactNode;
}

/**
 * DashboardHeader - Header untuk halaman dashboard
 * 
 * Features:
 * - Page title
 * - Breadcrumb navigation
 * - User dropdown (profile, logout)
 * - Optional action buttons
 */
export default function DashboardHeader({ 
    title, 
    breadcrumbs = [],
    actions 
}: DashboardHeaderProps) {
    const { auth } = usePage().props as any;
    const user = auth?.user;
    
    return (
        <header className="bg-surface border-b border-border px-6 py-4">
            <div className="flex items-center justify-between">
                {/* Left: Title & Breadcrumbs */}
                <div>
                    {/* Breadcrumbs */}
                    {breadcrumbs.length > 0 && (
                        <nav className="flex items-center gap-2 text-sm text-muted mb-1">
                            {breadcrumbs.map((item, index) => (
                                <span key={index} className="flex items-center gap-2">
                                    {index > 0 && (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    )}
                                    {item.href ? (
                                        <Link 
                                            href={item.href}
                                            className="hover:text-foreground transition-colors"
                                        >
                                            {item.label}
                                        </Link>
                                    ) : (
                                        <span className="text-foreground">{item.label}</span>
                                    )}
                                </span>
                            ))}
                        </nav>
                    )}
                    
                    {/* Title */}
                    <h1 className="text-xl font-semibold text-foreground">
                        {title}
                    </h1>
                </div>
                
                {/* Right: Actions & User Menu */}
                <div className="flex items-center gap-4">
                    {/* Custom Actions */}
                    {actions && (
                        <div className="flex items-center gap-2">
                            {actions}
                        </div>
                    )}
                    
                    {/* User Dropdown */}
                    {user && (
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-hover transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                        <span className="text-primary font-medium text-sm">
                                            {user.name?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="hidden sm:block text-left">
                                        <p className="text-sm font-medium text-foreground">
                                            {user.name}
                                        </p>
                                    </div>
                                    <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                            </Dropdown.Trigger>
                            
                            <Dropdown.Content>
                                <div className="px-4 py-3 border-b border-border">
                                    <p className="text-sm font-medium text-foreground">{user.name}</p>
                                    <p className="text-xs text-muted">{user.email}</p>
                                </div>
                                
                                <Dropdown.Link href={route('profile.edit')}>
                                    <span className="flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Profil Saya
                                    </span>
                                </Dropdown.Link>
                                
                                <Dropdown.Link 
                                    href={route('logout')} 
                                    method="post" 
                                    as="button"
                                    className="text-red-600 hover:bg-red-50"
                                >
                                    <span className="flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        Keluar
                                    </span>
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    )}
                </div>
            </div>
        </header>
    );
}
