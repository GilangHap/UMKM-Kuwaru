import { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import BoundaryEditor from '@/Components/BoundaryEditor';
import { PageProps } from '@/types';
import axios from 'axios';

interface Props extends PageProps {
    settings: {
        site_name: string;
        site_description: string;
        site_logo: string | null;
        contact_email: string;
        contact_phone: string;
        village_address: string;
        footer_text: string;
        map_center_lat: number;
        map_center_lng: number;
        village_boundary: [number, number][];
    };
}

/**
 * Parse Google Maps URL to extract latitude and longitude
 */
function parseGoogleMapsUrl(url: string): { lat: string; lng: string } | null {
    if (!url) return null;
    
    try {
        // Pattern 1: @-7.1234567,110.1234567
        const pattern1 = /@(-?\d+\.?\d*),(-?\d+\.?\d*)/;
        const match1 = url.match(pattern1);
        if (match1) {
            return { lat: match1[1], lng: match1[2] };
        }
        
        // Pattern 2: !3d-7.1234567!4d110.1234567
        const pattern2 = /!3d(-?\d+\.?\d*)!4d(-?\d+\.?\d*)/;
        const match2 = url.match(pattern2);
        if (match2) {
            return { lat: match2[1], lng: match2[2] };
        }
        
        // Pattern 3: q=-7.1234567,110.1234567 or ll=-7.1234567,110.1234567
        const pattern3 = /[?&](?:q|ll)=(-?\d+\.?\d*),(-?\d+\.?\d*)/;
        const match3 = url.match(pattern3);
        if (match3) {
            return { lat: match3[1], lng: match3[2] };
        }
        
        // Pattern 4: place/.../@-7.1234567,110.1234567
        const pattern4 = /place\/[^@]*@(-?\d+\.?\d*),(-?\d+\.?\d*)/;
        const match4 = url.match(pattern4);
        if (match4) {
            return { lat: match4[1], lng: match4[2] };
        }
        
    } catch (e) {
        console.error('Error parsing Google Maps URL:', e);
    }
    
    return null;
}

/**
 * Check if URL is a shortened Google Maps URL
 */
function isShortUrl(url: string): boolean {
    return url.includes('goo.gl') || url.includes('maps.app');
}

export default function Index({ settings }: Props) {
    const { flash } = usePage().props as any;
    const [mapsUrl, setMapsUrl] = useState('');
    const [coordsMessage, setCoordsMessage] = useState<string | null>(null);
    const [resolvingUrl, setResolvingUrl] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        site_name: settings.site_name || '',
        site_description: settings.site_description || '',
        site_logo: null as File | null,
        contact_email: settings.contact_email || '',
        contact_phone: settings.contact_phone || '',
        village_address: settings.village_address || '',
        footer_text: settings.footer_text || '',
        map_center_lat: settings.map_center_lat || -7.9797,
        map_center_lng: settings.map_center_lng || 110.2827,
        village_boundary: settings.village_boundary || [] as [number, number][],
    });

    const handleMapsUrlChange = async (url: string) => {
        setMapsUrl(url);
        
        if (!url) {
            setCoordsMessage(null);
            return;
        }
        
        // Try local parsing first
        const coords = parseGoogleMapsUrl(url);
        if (coords) {
            setData(prev => ({
                ...prev,
                map_center_lat: parseFloat(coords.lat),
                map_center_lng: parseFloat(coords.lng),
            }));
            setCoordsMessage(`✓ Koordinat berhasil diambil: ${coords.lat}, ${coords.lng}`);
            return;
        }
        
        // If it's a shortened URL, call backend to resolve
        if (isShortUrl(url)) {
            setResolvingUrl(true);
            setCoordsMessage('⏳ Memproses shortened URL...');
            
            try {
                const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
                const response = await axios.post('/admin/maps/resolve', { url }, {
                    headers: { 'X-CSRF-TOKEN': csrfToken || '' }
                });
                
                if (response.data.success) {
                    setData(prev => ({
                        ...prev,
                        map_center_lat: parseFloat(response.data.latitude),
                        map_center_lng: parseFloat(response.data.longitude),
                    }));
                    setCoordsMessage(`✓ Koordinat berhasil diambil: ${response.data.latitude}, ${response.data.longitude}`);
                } else {
                    setCoordsMessage('⚠ ' + (response.data.message || 'Gagal mengambil koordinat'));
                }
            } catch (error: any) {
                console.error('Error resolving URL:', error);
                setCoordsMessage('⚠ Gagal memproses URL. Coba paste full URL Google Maps.');
            } finally {
                setResolvingUrl(false);
            }
            return;
        }
        
        setCoordsMessage('⚠ Tidak dapat mengambil koordinat dari URL ini');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.settings.update'), {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout
            title="Pengaturan"
            pageTitle="Pengaturan Website"
            breadcrumbs={[
                { label: 'Dashboard', href: route('admin.dashboard') },
                { label: 'Pengaturan' },
            ]}
        >
            {/* Flash Messages */}
            {flash?.success && (
                <div className="mb-6 p-4 bg-success/10 border border-success/20 rounded-lg text-success text-sm">
                    {flash.success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
                {/* General Settings */}
                <div className="card p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-6">Informasi Umum</h2>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Nama Website <span className="text-error">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.site_name}
                                onChange={(e) => setData('site_name', e.target.value)}
                                className="input"
                                placeholder="Desa Kuwaru"
                            />
                            {errors.site_name && (
                                <p className="text-sm text-error mt-1">{errors.site_name}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Deskripsi Website
                            </label>
                            <textarea
                                value={data.site_description}
                                onChange={(e) => setData('site_description', e.target.value)}
                                className="input min-h-[80px]"
                                placeholder="Deskripsi singkat untuk SEO"
                            />
                            <p className="text-xs text-muted mt-1">Digunakan untuk meta description SEO</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Logo Desa
                            </label>
                            {settings.site_logo && (
                                <div className="mb-2">
                                    <img 
                                        src={settings.site_logo} 
                                        alt="Logo" 
                                        className="w-20 h-20 object-contain rounded-lg border border-border"
                                    />
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setData('site_logo', e.target.files?.[0] || null)}
                                className="input"
                            />
                            <p className="text-xs text-muted mt-1">Format: JPG, PNG, SVG. Maksimal 2MB.</p>
                            {errors.site_logo && (
                                <p className="text-sm text-error mt-1">{errors.site_logo}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Contact Settings */}
                <div className="card p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-6">Informasi Kontak</h2>
                    
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">
                                    Email Kontak
                                </label>
                                <input
                                    type="email"
                                    value={data.contact_email}
                                    onChange={(e) => setData('contact_email', e.target.value)}
                                    className="input"
                                    placeholder="admin@desakuwaru.id"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">
                                    Telepon Kontak
                                </label>
                                <input
                                    type="text"
                                    value={data.contact_phone}
                                    onChange={(e) => setData('contact_phone', e.target.value)}
                                    className="input"
                                    placeholder="0274-123456"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Alamat Desa
                            </label>
                            <textarea
                                value={data.village_address}
                                onChange={(e) => setData('village_address', e.target.value)}
                                className="input min-h-[80px]"
                                placeholder="Alamat lengkap desa"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer Settings */}
                <div className="card p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-6">Footer</h2>
                    
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                            Teks Footer
                        </label>
                        <textarea
                            value={data.footer_text}
                            onChange={(e) => setData('footer_text', e.target.value)}
                            className="input min-h-[80px]"
                            placeholder="Teks tambahan di footer"
                        />
                    </div>
                </div>

                {/* Map Settings */}
                <div className="card p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-6">Pengaturan Peta</h2>
                    
                    {/* Google Maps Link */}
                    <div className="p-4 bg-surface-hover rounded-lg border border-border mb-4">
                        <label className="block text-sm font-medium text-foreground mb-1">
                            <svg className="w-4 h-4 inline mr-1 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Link Google Maps
                        </label>
                        <input
                            type="text"
                            value={mapsUrl}
                            onChange={(e) => handleMapsUrlChange(e.target.value)}
                            className="input"
                            placeholder="Paste link Google Maps di sini..."
                        />
                        {coordsMessage && (
                            <p className={`text-sm mt-1 ${coordsMessage.startsWith('✓') ? 'text-success' : 'text-warning'}`}>
                                {coordsMessage}
                            </p>
                        )}
                        <p className="text-xs text-muted mt-2">
                            Buka Google Maps → Cari lokasi UMKM → Klik kanan → Copy link → Paste di sini
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Latitude Pusat
                            </label>
                            <input
                                type="number"
                                step="any"
                                value={data.map_center_lat}
                                onChange={(e) => setData('map_center_lat', parseFloat(e.target.value))}
                                className="input"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Longitude Pusat
                            </label>
                            <input
                                type="number"
                                step="any"
                                value={data.map_center_lng}
                                onChange={(e) => setData('map_center_lng', parseFloat(e.target.value))}
                                className="input"
                            />
                        </div>
                    </div>
                    <p className="text-xs text-muted mt-2">Koordinat ini digunakan sebagai titik tengah default peta di halaman pengunjung.</p>
                </div>

                {/* Village Boundary Settings */}
                <div className="card p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-2">Batas Wilayah Desa</h2>
                    <p className="text-sm text-muted mb-6">
                        Gambar polygon untuk menandai batas wilayah Desa Kuwaru pada peta publik.
                    </p>
                    
                    <BoundaryEditor
                        initialBoundary={data.village_boundary}
                        mapCenter={{ lat: data.map_center_lat, lng: data.map_center_lng }}
                        onChange={(boundary) => setData('village_boundary', boundary)}
                    />
                </div>

                {/* Submit */}
                <div className="flex items-center gap-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="btn-primary"
                    >
                        {processing ? (
                            <>
                                <svg className="w-4 h-4 mr-2 animate-spin inline" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Menyimpan...
                            </>
                        ) : 'Simpan Pengaturan'}
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}
