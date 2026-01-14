import { Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { useSiteSettings } from './ThemeProvider';

interface NavbarProps {
    transparent?: boolean;
}

/**
 * Navbar - Modern Futuristic Navigation Bar
 * 
 * Features:
 * - Floating pill-shaped design
 * - Dark glassmorphism effect
 * - Logo and site name from database
 * - Centered navigation links
 * - Masuk button with profile avatar
 * - Responsive mobile menu
 */
export default function Navbar({ transparent = false }: NavbarProps) {
    const settings = useSiteSettings();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    const menuItems = [
        { name: 'Beranda', href: '/' },
        { name: 'UMKM', href: '/umkm' },
        { name: 'Artikel', href: '/artikel' },
        { name: 'Peta UMKM', href: '/peta-umkm' },
        { name: 'Tentang Desa', href: '/tentang-desa' },
    ];
    
    // Split site name for styling (e.g., "Desa Kuwaru" -> "Desa" + ".Kuwaru")
    const nameParts = settings.site_name.split(' ');
    const firstName = nameParts[0] || 'Kuwaru';
    const lastName = nameParts.slice(1).join(' ') || 'Digital';
    
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
            <div className="max-w-6xl mx-auto">
                {/* Main Navbar Container - Floating Pill Shape */}
                <div 
                    className={`
                        relative flex items-center justify-between
                        px-4 py-3 rounded-full
                        bg-slate-800/90 backdrop-blur-xl
                        border border-slate-700/50
                        shadow-lg shadow-black/20
                        transition-all duration-300
                        ${isScrolled ? 'shadow-xl shadow-black/30' : ''}
                    `}
                >
                    {/* Logo Section */}
                    <Link href="/" className="flex items-center gap-3 group">
                        {/* Logo Icon or Image from Database */}
                        {settings.site_logo ? (
                            <img 
                                src={settings.site_logo} 
                                alt={settings.site_name}
                                className="w-10 h-10 rounded-xl object-contain shadow-lg"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                </svg>
                            </div>
                        )}
                        {/* Logo Text from Database */}
                        <span className="text-lg font-bold">
                            <span className="text-white">{firstName}</span>
                            <span className="text-emerald-400">.{lastName}</span>
                        </span>
                    </Link>
                    
                    {/* Center Navigation - Desktop */}
                    <div className="hidden md:flex items-center gap-1">
                        {menuItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors duration-200"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                    
                    {/* Right Section - Masuk Button & Profile */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link
                            href="/login"
                            className="px-5 py-2.5 text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 rounded-full transition-all duration-200 shadow-lg shadow-emerald-500/30"
                        >
                            Masuk
                        </Link>
                        {/* Guest Avatar Icon */}
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-300 to-orange-400 flex items-center justify-center text-white shadow-lg border-2 border-slate-700">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                            </svg>
                        </div>
                    </div>
                    
                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                        aria-label="Toggle menu"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
                
                {/* Mobile Menu Dropdown */}
                {isMobileMenuOpen && (
                    <div className="md:hidden mt-2 rounded-2xl bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 shadow-xl overflow-hidden animate-slide-down">
                        <div className="px-4 py-4 space-y-1">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="block px-4 py-3 text-base font-medium text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-xl transition-all"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ))}
                            
                            <div className="pt-4 border-t border-slate-700/50">
                                <Link
                                    href="/login"
                                    className="block w-full px-5 py-3 text-center text-base font-semibold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl transition-all"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Masuk
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
