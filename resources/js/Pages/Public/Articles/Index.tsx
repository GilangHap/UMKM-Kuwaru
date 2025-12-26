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
            {/* Header */}
            <section className="bg-gradient-to-br from-green-600 to-green-700 text-white py-16 md:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                            Artikel UMKM
                        </h1>
                        <p className="text-lg text-green-100 mb-8">
                            Berita dan informasi terbaru dari {articles.total} artikel
                        </p>

                        {/* Search */}
                        <form onSubmit={handleSearch} className="max-w-xl mx-auto">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari artikel..."
                                    className="w-full px-5 py-4 pr-14 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-white/30"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-12 md:py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* UMKM Filter */}
                    {umkms.length > 0 && (
                        <div className="mb-8 overflow-x-auto pb-2">
                            <div className="flex gap-2 min-w-max">
                                <button
                                    onClick={() => handleUmkmChange('')}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                        !filters.umkm
                                            ? 'bg-green-600 text-white'
                                            : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                    }`}
                                >
                                    Semua UMKM
                                </button>
                                {umkms.map((umkm) => (
                                    <button
                                        key={umkm.id}
                                        onClick={() => handleUmkmChange(umkm.id)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                                            filters.umkm === umkm.id
                                                ? 'bg-green-600 text-white'
                                                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                        }`}
                                    >
                                        {umkm.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Articles Grid */}
                    {articles.data.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {articles.data.map((article) => (
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
                    ) : (
                        <div className="text-center py-16">
                            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Tidak ada artikel ditemukan</h3>
                            <p className="text-gray-500 mb-6">Coba ubah kata kunci atau filter UMKM</p>
                            <button
                                onClick={() => router.get('/artikel')}
                                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Reset Filter
                            </button>
                        </div>
                    )}

                    {/* Pagination */}
                    {articles.last_page > 1 && (
                        <div className="mt-12 flex justify-center gap-2">
                            {articles.links.map((link, index) => (
                                <button
                                    key={index}
                                    onClick={() => link.url && router.get(link.url)}
                                    disabled={!link.url}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        link.active
                                            ? 'bg-green-600 text-white'
                                            : link.url
                                                ? 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
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
