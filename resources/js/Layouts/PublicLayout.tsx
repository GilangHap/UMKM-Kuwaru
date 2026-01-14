import { PropsWithChildren, ReactNode } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from './AppLayout';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';

interface PublicLayoutProps extends PropsWithChildren {
    title?: string;
    description?: string;
    transparentNavbar?: boolean;
    showFooter?: boolean;
    header?: ReactNode;
}

/**
 * PublicLayout - Modern Futuristic Layout untuk halaman publik
 * 
 * Features:
 * - Modern dark theme with gradients
 * - Floating Navbar dengan glassmorphism
 * - Footer dengan modern design
 * - SEO meta tags
 * - Fluid content area
 */
export default function PublicLayout({ 
    children, 
    title,
    description,
    transparentNavbar = true,  // Default true for modern look
    showFooter = true,
    header
}: PublicLayoutProps) {
    return (
        <AppLayout>
            <Head>
                {title && <title>{title}</title>}
                {description && <meta name="description" content={description} />}
            </Head>
            
            {/* Navbar - Floating Modern Style */}
            <Navbar transparent={transparentNavbar} />
            
            {/* Main Content - No padding-top since navbar is floating */}
            <main className="min-h-screen">
                {/* Optional Page Header with Modern Gradient */}
                {header && (
                    <div className="relative bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white py-24 lg:py-32 overflow-hidden">
                        {/* Animated Background Grid */}
                        <div className="absolute inset-0 opacity-20">
                            <div 
                                className="absolute inset-0"
                                style={{
                                    backgroundImage: `
                                        linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px),
                                        linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)
                                    `,
                                    backgroundSize: '100px 100px',
                                }}
                            />
                        </div>
                        
                        {/* Floating Orbs */}
                        <div className="absolute w-96 h-96 rounded-full blur-3xl opacity-20 bg-emerald-500/30 -top-48 -left-48" />
                        <div className="absolute w-96 h-96 rounded-full blur-3xl opacity-15 bg-teal-500/30 -bottom-48 -right-48" />
                        
                        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16">
                            {header}
                        </div>
                    </div>
                )}
                
                {children}
            </main>
            
            {/* Footer */}
            {showFooter && <Footer />}
        </AppLayout>
    );
}
