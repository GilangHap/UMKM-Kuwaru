import { useState } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Link, router } from '@inertiajs/react';

interface Umkm {
    id: string;
    name: string;
    slug: string;
}

interface Article {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    published_at?: string;
    umkm_name?: string;
    umkm_slug?: string;
    featured_image?: string;
}

interface Props {
    articles: {
        data: Article[];
        current_page: number;
        last_page: number;
        total: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    umkms: Umkm[];
    filters: {
        search: string;
        umkm: string;
    };
}

export default function Index({ articles, umkms, filters }: Props) {
    const [search, setSearch] = useState(filters.search);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/artikel', { search, umkm: filters.umkm }, { preserveState: true });
    };

    const handleUmkmChange = (umkmId: string) => {
        router.get('/artikel', { search: filters.search, umkm: umkmId }, { preserveState: true });
    };

    return (
        <PublicLayout
            title="Artikel UMKM - Desa Kuwaru"
            description="Baca artikel dan berita terbaru dari UMKM Desa Kuwaru"
        >
            {/* ============================================= */}
            {/* HERO HEADER SECTION */}
            {/* ============================================= */}
            <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-orange-950 to-slate-900" />
                
                {/* Animated Grid Background */}
                <div 
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: `linear-gradient(rgba(251, 146, 60, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(251, 146, 60, 0.1) 1px, transparent 1px)`,
                        backgroundSize: '50px 50px'
                    }}
                />
                
                {/* Floating Orbs */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                </div>
                
                {/* Content */}
                <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-orange-500/20 backdrop-blur-sm border border-orange-500/30 mt-5 mb-5">
                        <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                        <span className="text-orange-300 text-sm font-semibold tracking-wide uppercase">Blog & Berita</span>
                    </div>
                    
                    {/* Title */}
                    <h1 
                        className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
                        style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                        <span className="bg-gradient-to-r from-white via-orange-100 to-orange-300 bg-clip-text text-transparent">
                            Artikel
                        </span>
                        <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent"> UMKM</span>
                    </h1>
                    
                    <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
                        Berita dan informasi terbaru dari <span className="text-orange-400 font-semibold">{articles.total}</span> artikel yang tersedia
                    </p>

                    {/* Search Box */}
                    <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300" />
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari artikel berdasarkan judul atau isi..."
                                    className="w-full px-6 py-5 pr-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:border-orange-400/50 focus:ring-2 focus:ring-orange-400/20 transition-all"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-3 p-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg shadow-orange-500/25"
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
                        <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl" />
                </div>
                
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* UMKM Filter */}
                    {umkms.length > 0 && (
                        <div className="mb-10">
                            <div className="flex items-center gap-3 mb-4">
                                <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                </svg>
                                <span className="text-white font-medium">Filter UMKM</span>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={() => handleUmkmChange('')}
                                    className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                                        !filters.umkm
                                            ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25'
                                            : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:border-orange-500/30'
                                    }`}
                                >
                                    Semua UMKM
                                </button>
                                {umkms.map((umkm) => (
                                    <button
                                        key={umkm.id}
                                        onClick={() => handleUmkmChange(umkm.id)}
                                        className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                                            filters.umkm === umkm.id
                                                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25'
                                                : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:border-orange-500/30'
                                        }`}
                                    >
                                        {umkm.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Results Info */}
                    <div className="flex items-center justify-between mb-8">
                        <p className="text-slate-400">
                            Menampilkan <span className="text-orange-400 font-semibold">{articles.data.length}</span> dari <span className="text-orange-400 font-semibold">{articles.total}</span> artikel
                        </p>
                    </div>

                    {/* Articles Grid */}
                    {articles.data.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {articles.data.map((article, index) => (
                                <Link
                                    key={article.id}
                                    href={`/artikel/${article.slug}`}
                                    className="group relative"
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                >
                                    <div className="relative h-full rounded-3xl overflow-hidden bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-md border border-white/10 hover:border-orange-400/50 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/10">
                                        {/* Image Section */}
                                        <div className="relative h-48 overflow-hidden">
                                            {article.featured_image ? (
                                                <img 
                                                    src={article.featured_image} 
                                                    alt={article.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-orange-500/20 via-amber-500/10 to-yellow-500/20 flex items-center justify-center">
                                                    <svg className="w-16 h-16 text-orange-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                </div>
                                            )}
                                            {/* Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                                            
                                            {/* UMKM Badge */}
                                            {article.umkm_name && (
                                                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-orange-500/90 backdrop-blur-sm text-white text-xs font-semibold">
                                                    {article.umkm_name}
                                                </div>
                                            )}
                                            
                                            {/* Date Badge */}
                                            {article.published_at && (
                                                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-sm text-white text-xs font-medium">
                                                    {article.published_at}
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Card Content */}
                                        <div className="p-5">
                                            {/* Title */}
                                            <h3 className="font-bold text-white text-lg mb-3 group-hover:text-orange-300 transition-colors line-clamp-2">
                                                {article.title}
                                            </h3>
                                            
                                            {/* Excerpt */}
                                            {article.excerpt && (
                                                <p className="text-sm text-slate-400 line-clamp-2 mb-4">
                                                    {article.excerpt}
                                                </p>
                                            )}
                                            
                                            {/* Read More */}
                                            <div className="flex items-center text-orange-400 text-sm font-semibold group-hover:text-orange-300 transition-colors">
                                                <span>Baca Selengkapnya</span>
                                                <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                </svg>
                                            </div>
                                        </div>

                                        {/* Glow Effect on Hover */}
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                            <div className="absolute inset-0 bg-gradient-to-t from-orange-500/5 via-transparent to-transparent" />
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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">Tidak ada artikel ditemukan</h3>
                            <p className="text-slate-400 mb-8 max-w-md mx-auto">
                                Coba ubah kata kunci pencarian atau filter UMKM untuk menemukan artikel yang Anda cari
                            </p>
                            <button
                                onClick={() => router.get('/artikel')}
                                className="px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg shadow-orange-500/25"
                            >
                                Reset Filter
                            </button>
                        </div>
                    )}

                    {/* Pagination */}
                    {articles.last_page > 1 && (
                        <div className="mt-16 flex justify-center gap-2">
                            {articles.links.map((link, index) => (
                                <button
                                    key={index}
                                    onClick={() => link.url && router.get(link.url)}
                                    disabled={!link.url}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                                        link.active
                                            ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25'
                                            : link.url
                                                ? 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:border-orange-500/30'
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
