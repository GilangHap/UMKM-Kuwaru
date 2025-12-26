import PublicLayout from '@/Layouts/PublicLayout';
import { Link } from '@inertiajs/react';

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
}

export default function Home({ settings, stats, categories, featuredUmkms, recentArticles }: Props) {
    return (
        <PublicLayout 
            title={settings.site_name || 'UMKM Desa Kuwaru'}
            description={settings.site_description}
        >
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }} />
                </div>
                
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-36">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                            {settings.site_tagline || 'UMKM Unggulan Desa Kuwaru'}
                        </h1>
                        <p className="text-lg md:text-xl text-green-100 mb-10 leading-relaxed">
                            {settings.site_description || 'Temukan produk-produk berkualitas dari pelaku usaha lokal Desa Kuwaru. Dukung ekonomi desa, nikmati produk terbaik.'}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/umkm"
                                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold bg-white text-green-700 rounded-xl hover:bg-green-50 transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                Jelajahi UMKM
                            </Link>
                            <Link
                                href="/peta-umkm"
                                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold border-2 border-white text-white rounded-xl hover:bg-white/10 transition-all duration-200"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Lihat Peta UMKM
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Wave Divider */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                        <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#f9fafb"/>
                    </svg>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 bg-gray-50 -mt-1">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                            <div className="text-3xl md:text-4xl font-bold text-green-600 mb-1">{stats.total_umkm}</div>
                            <div className="text-sm text-gray-500">UMKM Aktif</div>
                        </div>
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-1">{stats.total_categories}</div>
                            <div className="text-sm text-gray-500">Kategori</div>
                        </div>
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                            <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-1">{stats.total_products}</div>
                            <div className="text-sm text-gray-500">Produk</div>
                        </div>
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                            <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-1">{stats.total_articles}</div>
                            <div className="text-sm text-gray-500">Artikel</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            {categories.length > 0 && (
                <section className="py-16 md:py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Kategori UMKM
                            </h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Jelajahi berbagai kategori usaha yang ada di Desa Kuwaru
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {categories.map((category) => (
                                <Link
                                    key={category.id}
                                    href={`/umkm?category=${category.id}`}
                                    className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-green-200 transition-all duration-300 text-center"
                                >
                                    <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-green-700 transition-colors">
                                        {category.name}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {category.umkms_count} UMKM
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Featured UMKM Section */}
            {featuredUmkms.length > 0 && (
                <section className="py-16 md:py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between mb-12">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                                    UMKM Unggulan
                                </h2>
                                <p className="text-gray-600">
                                    Pelaku usaha terbaik dari Desa Kuwaru
                                </p>
                            </div>
                            <Link
                                href="/umkm"
                                className="hidden md:inline-flex items-center text-green-600 hover:text-green-700 font-medium"
                            >
                                Lihat Semua
                                <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                            {featuredUmkms.map((umkm) => (
                                <Link
                                    key={umkm.id}
                                    href={`/umkm/${umkm.slug}`}
                                    className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:border-transparent transition-all duration-300"
                                >
                                    <div 
                                        className="h-3"
                                        style={{ backgroundColor: umkm.theme?.primary_color || '#16a34a' }}
                                    />
                                    <div className="p-5">
                                        <div className="flex items-center gap-4 mb-4">
                                            {umkm.logo_url ? (
                                                <img 
                                                    src={umkm.logo_url} 
                                                    alt={umkm.name}
                                                    className="w-14 h-14 rounded-xl object-cover border border-gray-100"
                                                />
                                            ) : (
                                                <div 
                                                    className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-xl"
                                                    style={{ backgroundColor: umkm.theme?.primary_color || '#16a34a' }}
                                                >
                                                    {umkm.name.charAt(0)}
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-gray-900 truncate group-hover:text-green-700 transition-colors">
                                                    {umkm.name}
                                                </h3>
                                                {umkm.category && (
                                                    <p className="text-sm text-gray-500">{umkm.category}</p>
                                                )}
                                            </div>
                                        </div>
                                        {umkm.tagline && (
                                            <p className="text-sm text-gray-600 line-clamp-2">{umkm.tagline}</p>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <div className="mt-8 text-center md:hidden">
                            <Link
                                href="/umkm"
                                className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
                            >
                                Lihat Semua UMKM
                                <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Recent Articles Section */}
            {recentArticles.length > 0 && (
                <section className="py-16 md:py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between mb-12">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                                    Artikel Terbaru
                                </h2>
                                <p className="text-gray-600">
                                    Berita dan informasi dari UMKM Desa Kuwaru
                                </p>
                            </div>
                            <Link
                                href="/artikel"
                                className="hidden md:inline-flex items-center text-green-600 hover:text-green-700 font-medium"
                            >
                                Lihat Semua
                                <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {recentArticles.slice(0, 6).map((article) => (
                                <Link
                                    key={article.id}
                                    href={`/artikel/${article.slug}`}
                                    className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300"
                                >
                                    {article.featured_image ? (
                                        <div className="aspect-video overflow-hidden">
                                            <img 
                                                src={article.featured_image} 
                                                alt={article.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                    ) : (
                                        <div className="aspect-video bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                                            <svg className="w-12 h-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                    )}
                                    <div className="p-5">
                                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                            {article.umkm_name && (
                                                <span className="text-green-600 font-medium">{article.umkm_name}</span>
                                            )}
                                            {article.umkm_name && article.published_at && <span>•</span>}
                                            {article.published_at && <span>{article.published_at}</span>}
                                        </div>
                                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-700 transition-colors">
                                            {article.title}
                                        </h3>
                                        {article.excerpt && (
                                            <p className="text-sm text-gray-600 line-clamp-2">{article.excerpt}</p>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <div className="mt-8 text-center md:hidden">
                            <Link
                                href="/artikel"
                                className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
                            >
                                Lihat Semua Artikel
                                <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* CTA Section */}
            <section className="py-16 md:py-20 bg-gradient-to-br from-green-600 to-green-700 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Dukung UMKM Lokal Kami
                    </h2>
                    <p className="text-lg text-green-100 mb-10 max-w-2xl mx-auto">
                        Setiap pembelian Anda membantu pertumbuhan ekonomi desa dan kesejahteraan keluarga pelaku UMKM.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/umkm"
                            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold bg-white text-green-700 rounded-xl hover:bg-green-50 transition-all duration-200"
                        >
                            Mulai Jelajahi
                        </Link>
                        <Link
                            href="/tentang-desa"
                            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold border-2 border-white text-white rounded-xl hover:bg-white/10 transition-all duration-200"
                        >
                            Tentang Desa Kami
                        </Link>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
