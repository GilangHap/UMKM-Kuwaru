import { useState, useEffect, useRef, useMemo } from 'react';
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
    address?: string;
    whatsapp?: string;
    theme?: {
        primary_color?: string;
    };
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

// Leaflet Map Component - Client Side Only
function LeafletMapClient({ umkms, mapCenter, mapZoom, selectedUmkm, onMarkerClick }: {
    umkms: Umkm[];
    mapCenter: { lat: number; lng: number };
    mapZoom: number;
    selectedUmkm: Umkm | null;
    onMarkerClick: (umkm: Umkm) => void;
}) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const markersRef = useRef<any[]>([]);

    useEffect(() => {
        // Dynamic import Leaflet
        import('leaflet').then((L) => {
            if (!mapContainerRef.current || mapInstanceRef.current) return;

            // Fix marker icons
            delete (L.Icon.Default.prototype as any)._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            });

            // Create map
            const map = L.map(mapContainerRef.current).setView([mapCenter.lat, mapCenter.lng], mapZoom);
            mapInstanceRef.current = map;

            // Dark themed tile layer
            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
            }).addTo(map);

            // Add markers
            umkms.filter(u => u.latitude && u.longitude).forEach((umkm) => {
                const color = umkm.theme?.primary_color || '#10b981';
                
                const customIcon = L.divIcon({
                    className: 'custom-marker',
                    html: `
                        <div style="
                            width: 32px;
                            height: 32px;
                            background: linear-gradient(135deg, ${color}, ${color}cc);
                            border: 3px solid white;
                            border-radius: 50% 50% 50% 0;
                            transform: rotate(-45deg);
                            box-shadow: 0 4px 15px ${color}60;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        ">
                            <span style="
                                transform: rotate(45deg);
                                color: white;
                                font-weight: bold;
                                font-size: 12px;
                            ">${umkm.name.charAt(0)}</span>
                        </div>
                    `,
                    iconSize: [32, 32],
                    iconAnchor: [16, 32],
                    popupAnchor: [0, -32],
                });

                const marker = L.marker([umkm.latitude, umkm.longitude], { icon: customIcon })
                    .addTo(map);

                // Popup content
                const popupContent = `
                    <div style="min-width: 200px; font-family: system-ui, sans-serif;">
                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                            ${umkm.logo_url 
                                ? `<img src="${umkm.logo_url}" alt="${umkm.name}" style="width: 48px; height: 48px; border-radius: 8px; object-fit: cover;" />`
                                : `<div style="width: 48px; height: 48px; border-radius: 8px; background: ${color}; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 18px;">${umkm.name.charAt(0)}</div>`
                            }
                            <div>
                                <div style="font-weight: 600; color: #1f2937;">${umkm.name}</div>
                                ${umkm.category ? `<div style="font-size: 12px; color: #6b7280;">${umkm.category}</div>` : ''}
                            </div>
                        </div>
                        ${umkm.tagline ? `<p style="font-size: 13px; color: #4b5563; margin: 8px 0;">${umkm.tagline}</p>` : ''}
                        <div style="display: flex; gap: 8px; margin-top: 12px;">
                            <a href="/umkm/${umkm.slug}" style="flex: 1; padding: 8px 12px; text-align: center; font-size: 12px; font-weight: 600; background: #10b981; color: white; border-radius: 8px; text-decoration: none;">Lihat Detail</a>
                            ${umkm.whatsapp ? `<a href="https://wa.me/${umkm.whatsapp.replace(/\\D/g, '').replace(/^0/, '62')}" target="_blank" style="padding: 8px 12px; font-size: 12px; font-weight: 600; background: #22c55e; color: white; border-radius: 8px; text-decoration: none;">WA</a>` : ''}
                        </div>
                    </div>
                `;

                marker.bindPopup(popupContent);
                marker.on('click', () => onMarkerClick(umkm));
                
                markersRef.current.push({ marker, umkm });
            });
        });

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [umkms, mapCenter, mapZoom]);

    // Fly to selected UMKM
    useEffect(() => {
        if (selectedUmkm && mapInstanceRef.current) {
            mapInstanceRef.current.flyTo([selectedUmkm.latitude, selectedUmkm.longitude], 16, { duration: 1 });
            
            // Open popup
            const found = markersRef.current.find(m => m.umkm.id === selectedUmkm.id);
            if (found) {
                found.marker.openPopup();
            }
        }
    }, [selectedUmkm]);

    return <div ref={mapContainerRef} className="w-full h-full" />;
}

export default function Map({ umkms, categories, mapCenter, mapZoom, filters }: Props) {
    const [selectedUmkm, setSelectedUmkm] = useState<Umkm | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleCategoryChange = (categoryId: string) => {
        router.get('/peta-umkm', { category: categoryId }, { preserveState: true });
    };

    // Filter UMKM based on search
    const filteredUmkms = useMemo(() => {
        if (!searchQuery) return umkms;
        return umkms.filter(u => 
            u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.category?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [umkms, searchQuery]);

    const handleUmkmClick = (umkm: Umkm) => {
        setSelectedUmkm(umkm);
    };

    return (
        <PublicLayout
            title="Peta UMKM - Desa Kuwaru"
            description="Temukan lokasi UMKM di Desa Kuwaru melalui peta interaktif"
        >
            {/* Leaflet CSS */}
            <link
                rel="stylesheet"
                href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
                integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
                crossOrigin=""
            />

            {/* Custom Styles */}
            <style>{`
                .custom-marker {
                    background: transparent !important;
                    border: none !important;
                }
                .leaflet-popup-content-wrapper {
                    border-radius: 12px !important;
                    padding: 0 !important;
                }
                .leaflet-popup-content {
                    margin: 12px !important;
                }
            `}</style>

            {/* ============================================= */}
            {/* HERO HEADER SECTION */}
            {/* ============================================= */}
            <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900" />
                
                {/* Grid Pattern */}
                <div 
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: `linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)`,
                        backgroundSize: '50px 50px'
                    }}
                />
                
                {/* Floating Orbs */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-10 left-20 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-10 right-20 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                </div>
                
                <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-500/20 backdrop-blur-sm border border-emerald-500/30 mt-5 mb-5">
                            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="text-emerald-300 text-sm font-semibold tracking-wide uppercase">Peta Interaktif</span>
                        </div>
                        
                        <h1 
                            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
                            style={{ fontFamily: "'Outfit', sans-serif" }}
                        >
                            <span className="bg-gradient-to-r from-white via-emerald-100 to-emerald-300 bg-clip-text text-transparent">
                                Peta UMKM
                            </span>
                            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent"> Desa Kuwaru</span>
                        </h1>
                        
                        <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                            <span className="text-emerald-400 font-semibold">{umkms.length}</span> lokasi UMKM tersebar di desa kami. 
                            Klik marker untuk melihat detail.
                        </p>
                    </div>
                </div>
            </section>

            {/* ============================================= */}
            {/* MAP SECTION */}
            {/* ============================================= */}
            <section className="relative bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Controls Bar */}
                    <div className="flex flex-col lg:flex-row gap-4 mb-6">
                        {/* Search */}
                        <div className="relative flex-1 max-w-md">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari UMKM..."
                                className="w-full px-5 py-3 pl-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20 transition-all"
                            />
                            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        
                        {/* Category Filter */}
                        <div className="flex flex-wrap gap-2">
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

                    {/* Map and List Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Map Container */}
                        <div className="lg:col-span-2 rounded-3xl overflow-hidden border border-white/10 bg-slate-800 shadow-2xl">
                            <div className="h-[400px] lg:h-[600px]">
                                {isClient ? (
                                    <LeafletMapClient
                                        umkms={filteredUmkms}
                                        mapCenter={mapCenter}
                                        mapZoom={mapZoom}
                                        selectedUmkm={selectedUmkm}
                                        onMarkerClick={handleUmkmClick}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-800">
                                        <div className="text-center">
                                            <div className="animate-spin w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                                            <p className="text-slate-400">Memuat peta...</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* UMKM List */}
                        <div className="rounded-3xl overflow-hidden bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-md border border-white/10">
                            <div className="p-4 border-b border-white/10 flex items-center justify-between">
                                <h2 className="font-semibold text-white">
                                    Daftar UMKM
                                </h2>
                                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-medium">
                                    {filteredUmkms.length}
                                </span>
                            </div>
                            <div className="max-h-[500px] lg:max-h-[552px] overflow-y-auto">
                                {filteredUmkms.length > 0 ? (
                                    <div className="divide-y divide-white/5">
                                        {filteredUmkms.map((umkm) => (
                                            <button
                                                key={umkm.id}
                                                onClick={() => handleUmkmClick(umkm)}
                                                className={`w-full flex items-center gap-4 p-4 hover:bg-white/5 transition-all text-left ${
                                                    selectedUmkm?.id === umkm.id ? 'bg-emerald-500/10 border-l-4 border-emerald-500' : ''
                                                }`}
                                            >
                                                {umkm.logo_url ? (
                                                    <img 
                                                        src={umkm.logo_url} 
                                                        alt={umkm.name}
                                                        className="w-12 h-12 rounded-xl object-cover border border-white/10"
                                                    />
                                                ) : (
                                                    <div 
                                                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                                                        style={{ background: umkm.theme?.primary_color || '#10b981' }}
                                                    >
                                                        {umkm.name.charAt(0)}
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-medium text-white truncate">
                                                        {umkm.name}
                                                    </h3>
                                                    {umkm.category && (
                                                        <p className="text-sm text-slate-400 truncate">{umkm.category}</p>
                                                    )}
                                                </div>
                                                <div className="flex flex-col items-end gap-1">
                                                    {umkm.latitude && umkm.longitude && (
                                                        <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" title="Memiliki lokasi" />
                                                    )}
                                                    <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center">
                                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
                                            <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <p className="text-slate-400">Tidak ada UMKM ditemukan</p>
                                    </div>
                                )}
                            </div>
                            
                            {/* Selected UMKM Quick Actions */}
                            {selectedUmkm && (
                                <div className="p-4 border-t border-white/10 bg-emerald-500/10">
                                    <div className="flex gap-2">
                                        <Link
                                            href={`/umkm/${selectedUmkm.slug}`}
                                            className="flex-1 py-2.5 text-center text-sm font-semibold bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
                                        >
                                            Lihat Detail
                                        </Link>
                                        {selectedUmkm.whatsapp && (
                                            <a
                                                href={`https://wa.me/${selectedUmkm.whatsapp.replace(/\D/g, '').replace(/^0/, '62')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="py-2.5 px-4 text-center text-sm font-semibold bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                                </svg>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================= */}
            {/* INFO SECTION */}
            {/* ============================================= */}
            <section className="relative py-16 bg-gradient-to-b from-slate-800 to-slate-900">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="p-8 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border border-white/10">
                        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                            <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-3">Kunjungi UMKM Kami</h3>
                        <p className="text-slate-400 max-w-lg mx-auto">
                            Klik pada marker di peta atau pilih UMKM dari daftar untuk melihat profil lengkap dan informasi kontak. 
                            Anda juga bisa langsung menghubungi mereka via WhatsApp!
                        </p>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
