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
            {/* Header */}
            <section className="bg-gradient-to-br from-green-600 to-green-700 text-white py-16 md:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                            Direktori UMKM
                        </h1>
                        <p className="text-lg text-green-100 mb-8">
                            Temukan {umkms.total} pelaku usaha lokal di Desa Kuwaru
                        </p>

                        {/* Search */}
                        <form onSubmit={handleSearch} className="max-w-xl mx-auto">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari UMKM..."
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
                    {/* Category Filter */}
                    <div className="mb-8 overflow-x-auto pb-2">
                        <div className="flex gap-2 min-w-max">
                            <button
                                onClick={() => handleCategoryChange('')}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                    !filters.category
                                        ? 'bg-green-600 text-white'
                                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                }`}
                            >
                                Semua
                            </button>
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => handleCategoryChange(category.id)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                                        filters.category === category.id
                                            ? 'bg-green-600 text-white'
                                            : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                    }`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* UMKM Grid */}
                    {umkms.data.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                            {umkms.data.map((umkm) => (
                                <Link
                                    key={umkm.id}
                                    href={`/umkm/${umkm.slug}`}
                                    className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:border-transparent transition-all duration-300"
                                >
                                    <div 
                                        className="h-2"
                                        style={{ backgroundColor: umkm.theme?.primary_color || '#16a34a' }}
                                    />
                                    <div className="p-5">
                                        <div className="flex items-center gap-3 mb-4">
                                            {umkm.logo_url ? (
                                                <img 
                                                    src={umkm.logo_url} 
                                                    alt={umkm.name}
                                                    className="w-12 h-12 rounded-xl object-cover border border-gray-100"
                                                />
                                            ) : (
                                                <div 
                                                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
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
                                                    <p className="text-xs text-gray-500 truncate">{umkm.category}</p>
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
                    ) : (
                        <div className="text-center py-16">
                            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Tidak ada UMKM ditemukan</h3>
                            <p className="text-gray-500 mb-6">Coba ubah kata kunci atau filter kategori</p>
                            <button
                                onClick={() => router.get('/umkm')}
                                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Reset Filter
                            </button>
                        </div>
                    )}

                    {/* Pagination */}
                    {umkms.last_page > 1 && (
                        <div className="mt-12 flex justify-center gap-2">
                            {umkms.links.map((link, index) => (
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
