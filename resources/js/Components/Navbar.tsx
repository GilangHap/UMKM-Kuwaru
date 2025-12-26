import { Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import SiteLogo from './SiteLogo';

interface NavbarProps {
    transparent?: boolean;
}

/**
 * Navbar - Public navigation bar
 * 
 * Features:
 * - Sticky dengan backdrop blur
 * - Transparent → solid saat scroll
 * - Responsive mobile menu
 * - Logo dari database
 */
export default function Navbar({ transparent = false }: NavbarProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    // Handle scroll untuk efek transparent → solid
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    const showSolid = !transparent || isScrolled;
    
    const menuItems = [
        { name: 'Beranda', href: '/' },
        { name: 'UMKM', href: '/umkm' },
        { name: 'Artikel', href: '/artikel' },
        { name: 'Peta UMKM', href: '/peta-umkm' },
        { name: 'Tentang Desa', href: '/tentang-desa' },
    ];
    
    return (
        <nav className={`navbar ${showSolid ? 'navbar-solid' : 'navbar-transparent'}`}>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-full">
                <div className="flex items-center justify-between h-full">
                    {/* Logo */}
                    <SiteLogo size="md" />
                    
                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-1">
                        {menuItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="px-4 py-2 text-sm font-medium text-muted hover:text-foreground hover:bg-surface-hover rounded-lg transition-all duration-200"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                    
                    {/* Desktop Login Button */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link
                            href="/login"
                            className="btn-primary text-sm"
                        >
                            Masuk
                        </Link>
                    </div>
                    
                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-surface-hover transition-colors"
                        aria-label="Toggle menu"
                    >
                        <svg 
                            className="w-6 h-6 text-foreground" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            {isMobileMenuOpen ? (
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M6 18L18 6M6 6l12 12" 
                                />
                            ) : (
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M4 6h16M4 12h16M4 18h16" 
                                />
                            )}
                        </svg>
                    </button>
                </div>
            </div>
            
            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-surface border-b border-border shadow-lg animate-slide-down">
                    <div className="px-4 py-4 space-y-1">
                        {menuItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="block px-4 py-3 text-base font-medium text-muted hover:text-foreground hover:bg-surface-hover rounded-lg transition-all"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}
                        
                        <div className="pt-4 border-t border-border">
                            <Link
                                href="/login"
                                className="block w-full btn-primary text-center"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Masuk
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
