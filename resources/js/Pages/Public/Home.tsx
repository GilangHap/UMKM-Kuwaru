import PublicLayout from '@/Layouts/PublicLayout';
import { Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';

interface Category {
    id: string;
    name: string;
    slug: string;
    umkms_count: number;
}

interface FeaturedUmkm {
    id: string;
    name: string;
    slug: string;
    tagline?: string;
    category?: string;
    logo_url?: string;
    gallery_thumbnail?: string;
    theme?: {
        primary_color?: string;
        secondary_color?: string;
    };
}

interface RecentArticle {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    published_at?: string;
    umkm_name?: string;
    umkm_slug?: string;
    featured_image?: string;
}

interface GalleryItem {
    id: string;
    url: string;
    alt_text?: string;
    umkm_name: string;
    umkm_slug: string;
}

interface Props {
    settings: {
        site_name?: string;
        site_description?: string;
        site_tagline?: string;
    };
    stats: {
        total_umkm: number;
        total_categories: number;
        total_articles: number;
        total_products: number;
    };
    categories: Category[];
    featuredUmkms: FeaturedUmkm[];
    recentArticles: RecentArticle[];
    galleryItems: GalleryItem[];
}

// Animated counter hook
function useCounter(end: number, duration: number = 2000) {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!isVisible) return;
        
        let startTime: number;
        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    }, [end, duration, isVisible]);

    return { count, setIsVisible };
}

// Category icons mapping
const categoryIcons: { [key: string]: JSX.Element } = {
    default: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
    ),
};

export default function Home({ settings, stats, categories, featuredUmkms, recentArticles, galleryItems = [] }: Props) {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [scrollY, setScrollY] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [isCarouselPaused, setIsCarouselPaused] = useState(false);
    
    const { count: umkmCount, setIsVisible: setUmkmVisible } = useCounter(stats.total_umkm);
    const { count: catCount, setIsVisible: setCatVisible } = useCounter(stats.total_categories);
    const { count: prodCount, setIsVisible: setProdVisible } = useCounter(stats.total_products);
    const { count: artCount, setIsVisible: setArtVisible } = useCounter(stats.total_articles);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };
        
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('scroll', handleScroll);
        
        // Trigger counter animation
        const timer = setTimeout(() => {
            setUmkmVisible(true);
            setCatVisible(true);
            setProdVisible(true);
            setArtVisible(true);
        }, 500);
        
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(timer);
        };
    }, []);

    return (
        <PublicLayout 
            title={settings.site_name || 'UMKM Desa Kuwaru'}
            description={settings.site_description}
        >
            {/* ============================================= */}
            {/* HERO SECTION - Futuristic Design */}
            {/* ============================================= */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Background Image */}
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `url('/baldes_kuwaru.jpeg')`,
                    }}
                />
                
                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-emerald-950/85 to-slate-900/90" />
                
                {/* Animated Grid Background */}
                <div className="absolute inset-0 opacity-20">
                    <div 
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `
                                linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)
                            `,
                            backgroundSize: '100px 100px',
                            transform: `translateY(${scrollY * 0.5}px)`,
                        }}
                    />
                </div>

                {/* Floating Orbs */}
                <div 
                    className="absolute w-[600px] h-[600px] rounded-full blur-3xl opacity-20"
                    style={{
                        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.4) 0%, transparent 70%)',
                        left: mousePosition.x * 0.02 + 100,
                        top: mousePosition.y * 0.02 - 100,
                        transition: 'all 0.5s ease-out',
                    }}
                />
                <div 
                    className="absolute w-[400px] h-[400px] rounded-full blur-3xl opacity-15"
                    style={{
                        background: 'radial-gradient(circle, rgba(52, 211, 153, 0.5) 0%, transparent 70%)',
                        right: -mousePosition.x * 0.01 + 100,
                        bottom: -mousePosition.y * 0.01 + 50,
                        transition: 'all 0.8s ease-out',
                    }}
                />

                {/* Animated Particles */}
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-emerald-400 rounded-full animate-pulse"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 2}s`,
                            opacity: 0.3 + Math.random() * 0.5,
                        }}
                    />
                ))}

                {/* Hero Content */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mt-5 mb-5 animate-fade-in">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-sm text-emerald-300 font-medium">Desa Kuwaru Digital Platform</span>
                    </div>

                    {/* Main Title */}
                    <h1 
                        className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight"
                        style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                        <span className="bg-gradient-to-r from-white via-emerald-100 to-emerald-300 bg-clip-text text-transparent">
                            {settings.site_tagline || 'UMKM Unggulan'}
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-300 bg-clip-text text-transparent">
                            Desa Kuwaru
                        </span>
                    </h1>

                    {/* Description */}
                    <p className="text-lg md:text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                        {settings.site_description || 'Temukan produk-produk berkualitas dari pelaku usaha lokal Desa Kuwaru. Dukung ekonomi desa, nikmati produk terbaik dari pengrajin dan pedagang lokal.'}
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                        <Link
                            href="/umkm"
                            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold overflow-hidden rounded-2xl transition-all duration-300"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 transition-transform group-hover:scale-105" />
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-emerald-400 to-teal-400" />
                            <span className="relative flex items-center gap-2 text-white">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                Jelajahi UMKM
                                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </span>
                        </Link>
                        <Link
                            href="/peta-umkm"
                            className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-2xl bg-white/5 backdrop-blur-sm border border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Lihat Peta
                        </Link>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-0 right-0 flex justify-center">
                    <button 
                        onClick={() => {
                            const nextSection = document.getElementById('categories-section') || document.querySelector('section:nth-of-type(2)');
                            if (nextSection) {
                                nextSection.scrollIntoView({ behavior: 'smooth' });
                            } else {
                                window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
                            }
                        }}
                        className="flex flex-col items-center gap-2 animate-bounce cursor-pointer hover:opacity-80 transition-opacity"
                    >
                        <span className="text-sm text-slate-400">Scroll untuk melihat lebih</span>
                        <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </button>
                </div>
            </section>

            {/* ============================================= */}
            {/* CATEGORIES SECTION */}
            {/* ============================================= */}
            {categories.length > 0 && (
                <section id="categories-section" className="relative py-28 overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
                    {/* Animated Floating Elements */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl animate-pulse" />
                        <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl" />
                    </div>

                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Section Header */}
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-500/20 backdrop-blur-sm border border-emerald-500/30 mb-6">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-emerald-300 text-sm font-semibold tracking-wide uppercase">Eksplorasi</span>
                            </div>
                            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                                Temukan <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">Kategori</span> UMKM
                            </h2>
                            <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
                                Jelajahi beragam jenis usaha dari Desa Kuwaru, mulai dari kuliner khas pantai hingga kerajinan tangan berkualitas
                            </p>
                        </div>
                        
                        {/* Categories Grid - Hexagonal Style */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                            {categories.map((category, index) => (
                                <Link
                                    key={category.id}
                                    href={`/umkm?category=${category.id}`}
                                    className="group relative"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className="relative p-6 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-gradient-to-br hover:from-emerald-500/20 hover:to-teal-500/10 hover:border-emerald-400/40 transition-all duration-500 hover:scale-105 hover:-translate-y-2 text-center overflow-hidden">
                                        {/* Glow Effect */}
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                            <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/20 via-transparent to-transparent" />
                                        </div>
                                        
                                        {/* Icon Container */}
                                        <div className="relative w-20 h-20 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-emerald-500/30 to-teal-500/20 flex items-center justify-center group-hover:from-emerald-500/50 group-hover:to-teal-500/30 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-lg shadow-emerald-500/10">
                                            <span className="text-4xl transform group-hover:scale-110 transition-transform duration-300">
                                                {['🍜', '🎨', '👕', '🧺', '🌾', '🐟', '🎭', '🏠', '🎁', '☕'][index % 10]}
                                            </span>
                                        </div>
                                        
                                        {/* Content */}
                                        <h3 className="relative font-bold text-white text-lg mb-2 group-hover:text-emerald-300 transition-colors">
                                            {category.name}
                                        </h3>
                                        <div className="relative inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 group-hover:bg-emerald-500/20 transition-colors">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                            <span className="text-sm text-slate-300 font-medium">{category.umkms_count} UMKM</span>
                                        </div>
                                        
                                        {/* Arrow on Hover */}
                                        <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-emerald-500/0 group-hover:bg-emerald-500/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                                            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ============================================= */}
            {/* FEATURED UMKM SECTION */}
            {/* ============================================= */}
            {featuredUmkms.length > 0 && (
                <section className="relative py-28 overflow-hidden bg-gradient-to-b from-slate-800 via-slate-900 to-slate-800">
                    {/* Animated Decorations */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        {/* Floating Stars */}
                        {[...Array(8)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-pulse"
                                style={{
                                    left: `${10 + i * 12}%`,
                                    top: `${20 + (i % 3) * 25}%`,
                                    animationDelay: `${i * 0.3}s`,
                                }}
                            />
                        ))}
                        {/* Floating Orbs */}
                        <div className="absolute top-10 right-20 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" />
                        <div className="absolute bottom-10 left-20 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
                        {/* Gradient Lines */}
                        <div className="absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent" />
                        <div className="absolute bottom-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />
                    </div>

                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Section Header */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14">
                            <div>
                                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm border border-yellow-500/30 mb-6">
                                    <span className="text-xl">⭐</span>
                                    <span className="text-yellow-300 text-sm font-semibold tracking-wide uppercase">Pilihan Terbaik</span>
                                </div>
                                <h2 className="text-4xl md:text-6xl font-bold text-white mb-5">
                                    UMKM <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-amber-400 bg-clip-text text-transparent">Unggulan</span>
                                </h2>
                                <p className="text-lg text-slate-300 max-w-xl leading-relaxed">
                                    Temukan pelaku usaha terbaik dengan produk berkualitas tinggi, langsung dari Desa Kuwaru
                                </p>
                            </div>
                            <Link
                                href="/umkm"
                                className="group inline-flex items-center gap-3 px-7 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105"
                            >
                                <span>Lihat Semua UMKM</span>
                                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </div>
                        
                        {/* UMKM Grid - Enhanced Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {featuredUmkms.map((umkm, index) => (
                                <Link
                                    key={umkm.id}
                                    href={`/umkm/${umkm.slug}`}
                                    className="group relative"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className="relative h-full rounded-3xl overflow-hidden bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-md border border-white/10 hover:border-emerald-400/50 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-3 hover:shadow-2xl hover:shadow-emerald-500/20">
                                        {/* Image/Logo Section - Gallery as Background */}
                                        <div className="relative h-48 overflow-hidden">
                                            {/* Gallery Thumbnail Background */}
                                            {umkm.gallery_thumbnail ? (
                                                <img 
                                                    src={umkm.gallery_thumbnail} 
                                                    alt={`${umkm.name} gallery`}
                                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                            ) : (
                                                <div 
                                                    className="absolute inset-0 bg-gradient-to-br from-emerald-500/30 via-teal-500/20 to-cyan-500/30"
                                                />
                                            )}
                                            
                                            {/* Dark Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-slate-900/30" />
                                            
                                            {/* Logo Overlay */}
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                {umkm.logo_url ? (
                                                    <div className="relative">
                                                        <div 
                                                            className="absolute -inset-2 rounded-2xl blur-md opacity-50"
                                                            style={{ backgroundColor: umkm.theme?.primary_color || '#10b981' }}
                                                        />
                                                        <img 
                                                            src={umkm.logo_url} 
                                                            alt={umkm.name}
                                                            className="relative w-20 h-20 rounded-2xl object-cover border-2 border-white/30 shadow-xl transform group-hover:scale-110 transition-transform duration-300"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div 
                                                        className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-xl border-2 border-white/30"
                                                        style={{ 
                                                            background: umkm.theme?.primary_color 
                                                                ? `linear-gradient(to bottom right, ${umkm.theme.primary_color}, ${umkm.theme.secondary_color || umkm.theme.primary_color})` 
                                                                : 'linear-gradient(to bottom right, #10b981, #06b6d4)' 
                                                        }}
                                                    >
                                                        {umkm.name.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* Category Badge */}
                                            {umkm.category && (
                                                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-sm text-white text-xs font-medium">
                                                    {umkm.category}
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Card Content */}
                                        <div className="p-5">
                                            {/* Name */}
                                            <h3 className="font-bold text-white text-lg mb-2 group-hover:text-emerald-300 transition-colors line-clamp-1">
                                                {umkm.name}
                                            </h3>
                                            
                                            {/* Tagline */}
                                            <p className="text-sm text-slate-400 line-clamp-2 mb-4 min-h-[40px]">
                                                {umkm.tagline || 'UMKM berkualitas dari Desa Kuwaru'}
                                            </p>
                                            
                                            
                                            {/* CTA Button */}
                                            <button className="w-full py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold text-sm group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-500 transition-all duration-300 flex items-center justify-center gap-2">
                                                Kunjungi
                                                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                </svg>
                                            </button>
                                        </div>

                                        {/* Glow Effect on Hover */}
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                            <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 via-transparent to-transparent" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ============================================= */}
            {/* ARTICLES SECTION */}
            {/* ============================================= */}
            {recentArticles.length > 0 && (
                <section className="relative py-28 overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
                    {/* Animated Decorations */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-20 right-20 w-72 h-72 bg-orange-500/15 rounded-full blur-3xl animate-pulse" />
                        <div className="absolute bottom-20 left-20 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-yellow-500/5 rounded-full blur-3xl" />
                    </div>

                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Section Header */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14">
                            <div>
                                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-orange-500/20 to-amber-500/20 backdrop-blur-sm border border-orange-500/30 mb-6">
                                    <span className="text-xl">📰</span>
                                    <span className="text-orange-300 text-sm font-semibold tracking-wide uppercase">Blog & Berita</span>
                                </div>
                                <h2 className="text-4xl md:text-6xl font-bold text-white mb-5">
                                    Artikel <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent">Terbaru</span>
                                </h2>
                                <p className="text-lg text-slate-300 max-w-xl leading-relaxed">
                                    Temukan cerita inspiratif, tips bisnis, dan informasi terkini seputar UMKM Desa Kuwaru
                                </p>
                            </div>
                            <Link
                                href="/artikel"
                                className="group inline-flex items-center gap-3 px-7 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-105"
                            >
                                <span>Lihat Semua Artikel</span>
                                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </div>
                        
                        {/* Articles Grid - Magazine Style */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {recentArticles.slice(0, 6).map((article, index) => (
                                <Link
                                    key={article.id}
                                    href={`/artikel/${article.slug}`}
                                    className="group relative"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className="relative rounded-3xl overflow-hidden bg-white/10 backdrop-blur-md border border-white/10 hover:border-orange-400/50 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/10">
                                        {/* Image Container */}
                                        <div className="relative aspect-[16/10] overflow-hidden">
                                            {article.featured_image ? (
                                                <>
                                                    <img 
                                                        src={article.featured_image} 
                                                        alt={article.title}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
                                                </>
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-orange-500/30 via-amber-500/20 to-yellow-500/30 flex items-center justify-center">
                                                    <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center">
                                                        <svg className="w-10 h-10 text-orange-400/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                        </svg>
                                                    </div>
                                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
                                                </div>
                                            )}
                                            
                                            {/* Category Badge */}
                                            {article.umkm_name && (
                                                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-orange-500/90 text-white text-xs font-semibold backdrop-blur-sm shadow-lg">
                                                    {article.umkm_name}
                                                </div>
                                            )}
                                            
                                            {/* Reading Time */}
                                            <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-slate-900/80 text-white text-xs font-medium backdrop-blur-sm flex items-center gap-1">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                3 min
                                            </div>
                                        </div>
                                        
                                        {/* Content */}
                                        <div className="p-6">
                                            {/* Date */}
                                            <div className="flex items-center gap-2 text-sm text-slate-400 mb-3">
                                                <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                {article.published_at || 'Baru dipublikasi'}
                                            </div>
                                            
                                            {/* Title */}
                                            <h3 className="font-bold text-white text-xl mb-3 line-clamp-2 group-hover:text-orange-300 transition-colors leading-snug">
                                                {article.title}
                                            </h3>
                                            
                                            {/* Excerpt */}
                                            {article.excerpt && (
                                                <p className="text-slate-400 text-sm line-clamp-2 mb-4 leading-relaxed">{article.excerpt}</p>
                                            )}
                                            
                                            {/* CTA */}
                                            <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                                <span className="text-sm text-orange-400 font-medium">Baca Selengkapnya</span>
                                                <div className="w-10 h-10 rounded-full bg-orange-500/20 group-hover:bg-orange-500 flex items-center justify-center transition-all duration-300">
                                                    <svg className="w-5 h-5 text-orange-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Glow Effect */}
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                            <div className="absolute inset-0 bg-gradient-to-t from-orange-500/10 via-transparent to-transparent" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ============================================= */}
            {/* UMKM GALLERY SECTION */}
            {/* ============================================= */}
            {galleryItems.length > 0 && (
                <section className="relative py-28 overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
                    {/* Animated Decorations */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl animate-pulse" />
                        <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl" />
                    </div>

                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Section Header */}
                        <div className="text-center mb-14">
                            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-sm border border-emerald-500/30 mb-6">
                                <span className="text-xl">📸</span>
                                <span className="text-emerald-300 text-sm font-semibold tracking-wide uppercase">Galeri Foto</span>
                            </div>
                            <h2 className="text-4xl md:text-6xl font-bold text-white mb-5">
                                Galeri <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">UMKM</span> Kuwaru
                            </h2>
                            <p className="text-lg text-slate-300 max-w-xl mx-auto leading-relaxed">
                                Lihat dokumentasi produk dan aktivitas dari berbagai UMKM di Desa Kuwaru
                            </p>
                        </div>
                        
                        {/* Infinite Carousel Gallery */}
                        <div className="relative">
                            {/* Gradient Overlays */}
                            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-800 to-transparent z-10 pointer-events-none" />
                            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-800 to-transparent z-10 pointer-events-none" />
                            
                            {/* Carousel Container */}
                            <div 
                                className="overflow-hidden"
                                onMouseEnter={() => setIsCarouselPaused(true)}
                                onMouseLeave={() => setIsCarouselPaused(false)}
                            >
                                <div 
                                    className="flex gap-6"
                                    style={{
                                        animation: 'scroll-left 30s linear infinite',
                                        animationPlayState: isCarouselPaused ? 'paused' : 'running',
                                        width: 'fit-content'
                                    }}
                                >
                                    {/* First Set */}
                                    {galleryItems.map((item, index) => (
                                        <button
                                            key={`first-${item.id}`}
                                            onClick={() => {
                                                setLightboxIndex(index);
                                                setLightboxOpen(true);
                                            }}
                                            className="group relative flex-shrink-0 w-72 h-72 md:w-80 md:h-80 rounded-3xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-800 shadow-lg shadow-black/20 hover:shadow-emerald-500/30 transition-shadow duration-300"
                                        >
                                            <img 
                                                src={item.url} 
                                                alt={item.alt_text || `${item.umkm_name} gallery`}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <div className="w-16 h-16 rounded-full bg-emerald-500/20 backdrop-blur-sm flex items-center justify-center mb-4">
                                                    <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                                    </svg>
                                                </div>
                                                <Link
                                                    href={`/umkm/${item.umkm_slug}`}
                                                    className="px-6 py-2 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors z-10"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    {item.umkm_name}
                                                </Link>
                                            </div>
                                        </button>
                                    ))}
                                    {/* Duplicate Set for Infinite Loop */}
                                    {galleryItems.map((item, index) => (
                                        <button
                                            key={`second-${item.id}`}
                                            onClick={() => {
                                                setLightboxIndex(index);
                                                setLightboxOpen(true);
                                            }}
                                            className="group relative flex-shrink-0 w-72 h-72 md:w-80 md:h-80 rounded-3xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-800 shadow-lg shadow-black/20 hover:shadow-emerald-500/30 transition-shadow duration-300"
                                        >
                                            <img 
                                                src={item.url} 
                                                alt={item.alt_text || `${item.umkm_name} gallery`}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <div className="w-16 h-16 rounded-full bg-emerald-500/20 backdrop-blur-sm flex items-center justify-center mb-4">
                                                    <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                                    </svg>
                                                </div>
                                                <Link
                                                    href={`/umkm/${item.umkm_slug}`}
                                                    className="px-6 py-2 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors z-10"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    {item.umkm_name}
                                                </Link>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* View All Button */}
                        <div className="text-center mt-12">
                            <Link
                                href="/umkm"
                                className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105"
                            >
                                <span>Lihat Semua UMKM</span>
                                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Lightbox Modal */}
            {lightboxOpen && galleryItems.length > 0 && (
                <div 
                    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
                    onClick={() => setLightboxOpen(false)}
                >
                    {/* Close Button */}
                    <button
                        onClick={() => setLightboxOpen(false)}
                        className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    
                    {/* Previous Button */}
                    {galleryItems.length > 1 && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setLightboxIndex((prev) => (prev === 0 ? galleryItems.length - 1 : prev - 1));
                            }}
                            className="absolute left-4 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    )}
                    
                    {/* Next Button */}
                    {galleryItems.length > 1 && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setLightboxIndex((prev) => (prev === galleryItems.length - 1 ? 0 : prev + 1));
                            }}
                            className="absolute right-4 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    )}
                    
                    {/* Image with UMKM Info */}
                    <div className="max-w-full max-h-[85vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
                        <img 
                            src={galleryItems[lightboxIndex]?.url} 
                            alt={galleryItems[lightboxIndex]?.alt_text || 'Gallery'}
                            className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
                        />
                        <div className="mt-4 text-center">
                            <Link
                                href={`/umkm/${galleryItems[lightboxIndex]?.umkm_slug}`}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                Kunjungi {galleryItems[lightboxIndex]?.umkm_name}
                            </Link>
                        </div>
                    </div>
                    
                    {/* Image Counter */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm">
                        {lightboxIndex + 1} / {galleryItems.length}
                    </div>
                </div>
            )}

            {/* ============================================= */}
            {/* CTA SECTION */}
            {/* ============================================= */}
            <section className="relative py-32 overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600" style={{ backgroundSize: '200% 100%', animation: 'gradient-shift 10s ease infinite' }} />
                
                {/* Mesh Pattern */}
                <div 
                    className="absolute inset-0 opacity-30"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                />

                {/* Floating Elements */}
                <div className="absolute top-10 left-10 w-32 h-32 border border-white/20 rounded-full animate-pulse" />
                <div className="absolute bottom-10 right-10 w-48 h-48 border border-white/10 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                <div className="absolute top-1/2 right-1/4 w-24 h-24 border border-white/15 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />

                <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
                        <span className="text-2xl">🤝</span>
                        <span className="text-white/90 font-medium">Mari Bersama Membangun Desa</span>
                    </div>

                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
                        Dukung UMKM Lokal
                        <br />
                        <span className="text-emerald-200">Untuk Desa yang Lebih Maju</span>
                    </h2>
                    
                    <p className="text-xl text-emerald-100 mb-12 max-w-2xl mx-auto">
                        Setiap pembelian Anda membantu pertumbuhan ekonomi desa dan kesejahteraan keluarga pelaku UMKM.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/umkm"
                            className="group inline-flex items-center justify-center px-10 py-5 text-lg font-bold bg-white text-emerald-700 rounded-2xl hover:bg-emerald-50 transition-all duration-300 shadow-2xl hover:shadow-white/20 hover:scale-105"
                        >
                            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Mulai Jelajahi
                        </Link>
                        <Link
                            href="/tentang-desa"
                            className="group inline-flex items-center justify-center px-10 py-5 text-lg font-bold border-2 border-white text-white rounded-2xl hover:bg-white/10 transition-all duration-300"
                        >
                            Tentang Desa Kami
                            <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Custom Styles */}
            <style>{`
                @keyframes gradient-shift {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                
                @keyframes slide-right {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                
                @keyframes scroll-left {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                
                .animate-fade-in {
                    animation: fade-in 0.6s ease-out;
                }
                
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </PublicLayout>
    );
}
