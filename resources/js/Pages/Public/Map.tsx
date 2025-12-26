import { useState, useEffect, useRef } from 'react';
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
    latitude: number;
    longitude: number;
    logo_url?: string;
}

interface Props {
    umkms: Umkm[];
    categories: Category[];
    mapCenter: {
        lat: number;
        lng: number;
    };
    mapZoom: number;
    filters: {
        category: string;
    };
}

export default function Map({ umkms, categories, mapCenter, mapZoom, filters }: Props) {
    const mapRef = useRef<HTMLDivElement>(null);
    const [selectedUmkm, setSelectedUmkm] = useState<Umkm | null>(null);
    const [mapLoaded, setMapLoaded] = useState(false);

    const handleCategoryChange = (categoryId: string) => {
        router.get('/peta-umkm', { category: categoryId }, { preserveState: true });
    };

    // Simple map using iframe for now (can be replaced with Leaflet later)
    const getMapUrl = () => {
        const markers = umkms.map(u => `${u.latitude},${u.longitude}`).join('|');
        return `https://www.google.com/maps/embed/v1/view?key=YOUR_API_KEY&center=${mapCenter.lat},${mapCenter.lng}&zoom=${mapZoom}`;
    };

    return (
        <PublicLayout
            title="Peta UMKM - Desa Kuwaru"
            description="Temukan lokasi UMKM di Desa Kuwaru melalui peta interaktif"
        >
            {/* Header */}
            <section className="bg-gradient-to-br from-green-600 to-green-700 text-white py-12 md:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">
                            Peta UMKM Desa Kuwaru
                        </h1>
                        <p className="text-lg text-green-100">
                            {umkms.length} lokasi UMKM tersebar di desa kami
                        </p>
                    </div>
                </div>
            </section>

            {/* Map & List */}
            <section className="py-8 md:py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Category Filter */}
                    <div className="mb-6 overflow-x-auto pb-2">
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

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Map */}
                        <div className="lg:col-span-2 bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                            <iframe
                                src={`https://www.google.com/maps?q=${mapCenter.lat},${mapCenter.lng}&z=${mapZoom}&output=embed`}
                                className="w-full h-[400px] lg:h-[600px]"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>

                        {/* UMKM List */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-4 border-b border-gray-100">
                                <h2 className="font-semibold text-gray-900">
                                    Daftar UMKM ({umkms.length})
                                </h2>
                            </div>
                            <div className="max-h-[500px] lg:max-h-[552px] overflow-y-auto">
                                {umkms.length > 0 ? (
                                    <div className="divide-y divide-gray-100">
                                        {umkms.map((umkm) => (
                                            <Link
                                                key={umkm.id}
                                                href={`/umkm/${umkm.slug}`}
                                                className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                                            >
                                                {umkm.logo_url ? (
                                                    <img 
                                                        src={umkm.logo_url} 
                                                        alt={umkm.name}
                                                        className="w-12 h-12 rounded-xl object-cover border border-gray-100"
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600 font-bold text-lg">
                                                        {umkm.name.charAt(0)}
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-medium text-gray-900 truncate">
                                                        {umkm.name}
                                                    </h3>
                                                    {umkm.category && (
                                                        <p className="text-sm text-gray-500 truncate">{umkm.category}</p>
                                                    )}
                                                </div>
                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center">
                                        <svg className="w-12 h-12 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <p className="text-gray-500">Tidak ada UMKM dengan lokasi</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Info */}
            <section className="py-12 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="p-6 bg-green-50 rounded-2xl">
                        <svg className="w-12 h-12 mx-auto text-green-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Kunjungi UMKM Kami</h3>
                        <p className="text-gray-600">
                            Klik pada UMKM di daftar samping untuk melihat profil lengkap dan informasi kontak. 
                            Anda juga bisa langsung menghubungi mereka via WhatsApp!
                        </p>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
