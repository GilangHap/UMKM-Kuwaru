import { useState } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Link, router } from '@inertiajs/react';

interface Category {
    id: string;
    name: string;
    slug: string;
}

interface Umkm {
    id: string;
    name: string;
    slug: string;
    tagline?: string;
    category?: string;
    category_id?: string;
    logo_url?: string;
    gallery_thumbnail?: string;
    theme?: {
        primary_color?: string;
    };
}

interface Props {
    umkms: {
        data: Umkm[];
        current_page: number;
        last_page: number;
        total: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    categories: Category[];
    filters: {
        search: string;
        category: string;
    };
}

export default function Index({ umkms, categories, filters }: Props) {
    const [search, setSearch] = useState(filters.search);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/umkm', { search, category: filters.category }, { preserveState: true });
    };

    const handleCategoryChange = (categoryId: string) => {
        router.get('/umkm', { search: filters.search, category: categoryId }, { preserveState: true });
    };

    return (
        <PublicLayout
            title="Direktori UMKM - Desa Kuwaru"
            description="Jelajahi semua UMKM di Desa Kuwaru. Temukan produk-produk lokal berkualitas dari pelaku usaha desa."
        >
            {/* ============================================= */}
            {/* HERO HEADER SECTION */}
            {/* ============================================= */}
            <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900" />
                
                {/* Animated Grid Background */}
                <div 
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: `linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)`,
                        backgroundSize: '50px 50px'
                    }}
                />
                
                {/* Floating Orbs */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                </div>
                
                {/* Content */}
                <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-500/20 backdrop-blur-sm border border-emerald-500/30 mt-5 mb-5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-emerald-300 text-sm font-semibold tracking-wide uppercase">Direktori UMKM</span>
                    </div>
                    
                    {/* Title */}
                    <h1 
                        className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
                        style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                        <span className="bg-gradient-to-r from-white via-emerald-100 to-emerald-300 bg-clip-text text-transparent">
                            Jelajahi
                        </span>
                        <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent"> UMKM </span>
                        <span className="bg-gradient-to-r from-white via-emerald-100 to-emerald-300 bg-clip-text text-transparent">
                            Kami
                        </span>
                    </h1>
                    
                    <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
                        Temukan <span className="text-emerald-400 font-semibold">{umkms.total}</span> pelaku usaha lokal berkualitas dari Desa Kuwaru
                    </p>

                    {/* Search Box */}
                    <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300" />
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari UMKM berdasarkan nama atau produk..."
                                    className="w-full px-6 py-5 pr-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20 transition-all"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-3 p-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-500/25"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
                
                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-0 right-0 flex justify-center">
                    <div className="flex flex-col items-center gap-2 animate-bounce">
                        <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </div>
                </div>
            </section>

            {/* ============================================= */}
            {/* MAIN CONTENT SECTION */}
            {/* ============================================= */}
            <section className="relative py-16 md:py-20 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
                {/* Background Decorations */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl" />
                </div>
                
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Category Filter */}
                    <div className="mb-10">
                        <div className="flex items-center gap-3 mb-4">
                            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            <span className="text-white font-medium">Filter Kategori</span>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => handleCategoryChange('')}
                                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                                    !filters.category
                                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25'
                                        : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:border-emerald-500/30'
                                }`}
                            >
                                Semua
                            </button>
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => handleCategoryChange(category.id)}
                                    className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                                        filters.category === category.id
                                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25'
                                            : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:border-emerald-500/30'
                                    }`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Results Info */}
                    <div className="flex items-center justify-between mb-8">
                        <p className="text-slate-400">
                            Menampilkan <span className="text-emerald-400 font-semibold">{umkms.data.length}</span> dari <span className="text-emerald-400 font-semibold">{umkms.total}</span> UMKM
                        </p>
                    </div>

                    {/* UMKM Grid */}
                    {umkms.data.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {umkms.data.map((umkm, index) => (
                                <Link
                                    key={umkm.id}
                                    href={`/umkm/${umkm.slug}`}
                                    className="group relative"
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                >
                                    <div className="relative h-full rounded-3xl overflow-hidden bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-md border border-white/10 hover:border-emerald-400/50 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/10">
                                        {/* Image/Logo Section - Gallery as Background */}
                                        <div className="relative h-44 overflow-hidden">
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
                                                            className="relative w-16 h-16 rounded-2xl object-cover border-2 border-white/30 shadow-xl transform group-hover:scale-110 transition-transform duration-300"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div 
                                                        className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-xl border-2 border-white/30"
                                                        style={{ 
                                                            background: umkm.theme?.primary_color 
                                                                ? `linear-gradient(to bottom right, ${umkm.theme.primary_color}, ${umkm.theme.primary_color}88)` 
                                                                : 'linear-gradient(to bottom right, #10b981, #06b6d4)' 
                                                        }}
                                                    >
                                                        {umkm.name.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* Verified Badge */}
                                            <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-emerald-500/90 backdrop-blur-sm text-white text-xs font-semibold flex items-center gap-1 shadow-lg">
                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                Verified
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
                                            <button className="w-full py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold text-sm group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-500 transition-all duration-300 flex items-center justify-center gap-2">
                                                Lihat Detail
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
                    ) : (
                        /* Empty State */
                        <div className="text-center py-20">
                            <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center">
                                <svg className="w-12 h-12 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">Tidak ada UMKM ditemukan</h3>
                            <p className="text-slate-400 mb-8 max-w-md mx-auto">
                                Coba ubah kata kunci pencarian atau filter kategori untuk menemukan UMKM yang Anda cari
                            </p>
                            <button
                                onClick={() => router.get('/umkm')}
                                className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-500/25"
                            >
                                Reset Filter
                            </button>
                        </div>
                    )}

                    {/* Pagination */}
                    {umkms.last_page > 1 && (
                        <div className="mt-16 flex justify-center gap-2">
                            {umkms.links.map((link, index) => (
                                <button
                                    key={index}
                                    onClick={() => link.url && router.get(link.url)}
                                    disabled={!link.url}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                                        link.active
                                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25'
                                            : link.url
                                                ? 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:border-emerald-500/30'
                                                : 'bg-white/5 text-slate-600 border border-white/5 cursor-not-allowed'
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
