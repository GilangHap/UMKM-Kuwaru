import { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import ImageUpload from '@/Components/ImageUpload';
import { PageProps, Category } from '@/types';
import axios from 'axios';

interface Props extends PageProps {
    categories: Category[];
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

export default function Create({ categories, flash }: Props & { flash?: { success?: string; error?: string } }) {
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [mapsUrl, setMapsUrl] = useState('');
    const [coordsMessage, setCoordsMessage] = useState<string | null>(null);
    const [resolvingUrl, setResolvingUrl] = useState(false);
    
    const { data, setData, processing, errors } = useForm({
        // Admin account
        admin_name: '',
        admin_email: '',
        admin_password: '',
        
        // UMKM data
        name: '',
        category_id: '',
        owner_name: '',
        description: '',
        address: '',
        latitude: '',
        longitude: '',
        phone: '',
        whatsapp: '',
        email: '',
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
                latitude: coords.lat,
                longitude: coords.lng,
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
                        latitude: response.data.latitude,
                        longitude: response.data.longitude,
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
        
        const formData = new FormData();
        
        // Admin account
        formData.append('admin_name', data.admin_name);
        formData.append('admin_email', data.admin_email);
        if (data.admin_password) {
            formData.append('admin_password', data.admin_password);
        }
        
        // UMKM data
        formData.append('name', data.name);
        formData.append('category_id', data.category_id);
        formData.append('owner_name', data.owner_name);
        formData.append('description', data.description);
        formData.append('address', data.address);
        formData.append('latitude', data.latitude);
        formData.append('longitude', data.longitude);
        formData.append('phone', data.phone);
        formData.append('whatsapp', data.whatsapp);
        formData.append('email', data.email);
        
        // Logo
        if (logoFile) {
            formData.append('logo', logoFile);
        }
        
        router.post(route('admin.umkm.store'), formData, {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout
            title="Tambah UMKM"
            pageTitle="Tambah UMKM Baru"
            breadcrumbs={[
                { label: 'Dashboard', href: route('admin.dashboard') },
                { label: 'UMKM', href: route('admin.umkm.index') },
                { label: 'Tambah' },
            ]}
        >
            <form onSubmit={handleSubmit} className="max-w-3xl">
                {/* Flash Error Display */}
                {flash?.error && (
                    <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg text-error text-sm">
                        {flash.error}
                    </div>
                )}

                {/* Admin Account Section */}
                <div className="card p-6 mb-6">
                    <h2 className="text-lg font-semibold text-foreground mb-4">
                        Akun Admin UMKM
                    </h2>
                    <p className="text-sm text-muted mb-6">
                        Buat akun untuk pengelola UMKM. Jika password dikosongkan, sistem akan generate otomatis.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Nama Admin <span className="text-error">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.admin_name}
                                onChange={(e) => setData('admin_name', e.target.value)}
                                className="input"
                                placeholder="Nama lengkap admin"
                            />
                            {errors.admin_name && (
                                <p className="text-sm text-error mt-1">{errors.admin_name}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Email Admin <span className="text-error">*</span>
                            </label>
                            <input
                                type="email"
                                value={data.admin_email}
                                onChange={(e) => setData('admin_email', e.target.value)}
                                className="input"
                                placeholder="email@example.com"
                            />
                            {errors.admin_email && (
                                <p className="text-sm text-error mt-1">{errors.admin_email}</p>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Password (Opsional)
                            </label>
                            <input
                                type="password"
                                value={data.admin_password}
                                onChange={(e) => setData('admin_password', e.target.value)}
                                className="input"
                                placeholder="Kosongkan untuk generate otomatis"
                            />
                            <p className="text-xs text-muted mt-1">
                                Minimal 8 karakter. Jika dikosongkan, password akan digenerate dan ditampilkan setelah submit.
                            </p>
                            {errors.admin_password && (
                                <p className="text-sm text-error mt-1">{errors.admin_password}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Logo Section */}
                <div className="card p-6 mb-6">
                    <h2 className="text-lg font-semibold text-foreground mb-4">
                        Logo UMKM
                    </h2>
                    <ImageUpload
                        onChange={(file) => setLogoFile(file)}
                        maxSize={2}
                    />
                    {(errors as any).logo && (
                        <p className="text-sm text-error mt-2">{(errors as any).logo}</p>
                    )}
                </div>

                {/* UMKM Data Section */}
                <div className="card p-6 mb-6">
                    <h2 className="text-lg font-semibold text-foreground mb-4">
                        Data UMKM
                    </h2>

                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">
                                    Nama UMKM <span className="text-error">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="input"
                                    placeholder="Nama usaha"
                                />
                                {errors.name && (
                                    <p className="text-sm text-error mt-1">{errors.name}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">
                                    Kategori <span className="text-error">*</span>
                                </label>
                                <select
                                    value={data.category_id}
                                    onChange={(e) => setData('category_id', e.target.value)}
                                    className="input"
                                >
                                    <option value="">Pilih Kategori</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                {errors.category_id && (
                                    <p className="text-sm text-error mt-1">{errors.category_id}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Nama Pemilik <span className="text-error">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.owner_name}
                                onChange={(e) => setData('owner_name', e.target.value)}
                                className="input"
                                placeholder="Nama pemilik usaha"
                            />
                            {errors.owner_name && (
                                <p className="text-sm text-error mt-1">{errors.owner_name}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Deskripsi
                            </label>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="input min-h-[100px]"
                                placeholder="Deskripsi singkat tentang usaha"
                            />
                            {errors.description && (
                                <p className="text-sm text-error mt-1">{errors.description}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Alamat
                            </label>
                            <textarea
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                className="input min-h-[80px]"
                                placeholder="Alamat lengkap UMKM"
                            />
                            {errors.address && (
                                <p className="text-sm text-error mt-1">{errors.address}</p>
                            )}
                        </div>

                        {/* Google Maps Link */}
                        <div className="p-4 bg-surface-hover rounded-lg border border-border">
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
                            
                            <div className="grid grid-cols-2 gap-4 mt-3">
                                <div>
                                    <label className="block text-xs font-medium text-muted mb-1">Latitude</label>
                                    <input
                                        type="text"
                                        value={data.latitude}
                                        onChange={(e) => setData('latitude', e.target.value)}
                                        className="input text-sm"
                                        placeholder="-7.xxxxxx"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-muted mb-1">Longitude</label>
                                    <input
                                        type="text"
                                        value={data.longitude}
                                        onChange={(e) => setData('longitude', e.target.value)}
                                        className="input text-sm"
                                        placeholder="110.xxxxxx"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">
                                    Telepon
                                </label>
                                <input
                                    type="text"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    className="input"
                                    placeholder="08xxxxxxxxxx"
                                />
                                {errors.phone && (
                                    <p className="text-sm text-error mt-1">{errors.phone}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">
                                    WhatsApp
                                </label>
                                <input
                                    type="text"
                                    value={data.whatsapp}
                                    onChange={(e) => setData('whatsapp', e.target.value)}
                                    className="input"
                                    placeholder="08xxxxxxxxxx"
                                />
                                {errors.whatsapp && (
                                    <p className="text-sm text-error mt-1">{errors.whatsapp}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">
                                    Email UMKM
                                </label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="input"
                                    placeholder="umkm@example.com"
                                />
                                {errors.email && (
                                    <p className="text-sm text-error mt-1">{errors.email}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="btn-primary"
                    >
                        {processing ? (
                            <>
                                <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Menyimpan...
                            </>
                        ) : (
                            'Simpan UMKM'
                        )}
                    </button>
                    <a
                        href={route('admin.umkm.index')}
                        className="btn-secondary"
                    >
                        Batal
                    </a>
                </div>
            </form>
        </AdminLayout>
    );
}
