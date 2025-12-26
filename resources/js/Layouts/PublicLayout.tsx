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
 * PublicLayout - Layout untuk halaman publik (guest)
 * 
 * Features:
 * - Navbar dengan scroll effect
 * - Footer
 * - SEO meta tags
 * - Fluid content area
 */
export default function PublicLayout({ 
    children, 
    title,
    description,
    transparentNavbar = false,
    showFooter = true,
    header
}: PublicLayoutProps) {
    return (
        <AppLayout>
            <Head>
                {title && <title>{title}</title>}
                {description && <meta name="description" content={description} />}
            </Head>
            
            {/* Navbar */}
            <Navbar transparent={transparentNavbar} />
            
            {/* Main Content */}
            <main className={transparentNavbar ? '' : 'pt-16'}>
                {/* Optional Page Header */}
                {header && (
                    <div className="bg-gradient-to-br from-primary to-primary-dark text-white py-16 lg:py-24">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
