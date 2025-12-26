import { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import UmkmLayout from '@/Layouts/UmkmLayout';
import ImageUpload from '@/Components/ImageUpload';
import { PageProps, Umkm } from '@/types';
import axios from 'axios';

interface Props extends PageProps {
    umkm: Umkm;
    flash?: { success?: string; error?: string };
}

export default function Edit({ umkm, flash }: Props) {
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [removeLogo, setRemoveLogo] = useState(false);
    const [mapsUrl, setMapsUrl] = useState('');
    const [coordsMessage, setCoordsMessage] = useState<string | null>(null);
    const [resolvingUrl, setResolvingUrl] = useState(false);

    const existingLogoUrl = umkm.logo?.url || 
        (umkm.logo?.file_path ? `/storage/${umkm.logo.file_path}` : null);

    const { data, setData, processing, errors } = useForm({
        name: umkm.name || '',
        description: umkm.description || '',
        address: umkm.address || '',
        phone: umkm.phone || '',
        whatsapp: umkm.whatsapp || '',
        email: umkm.email || '',
        latitude: umkm.latitude?.toString() || '',
        longitude: umkm.longitude?.toString() || '',
    });

    const handleMapsUrlChange = async (url: string) => {
        setMapsUrl(url);
        
        if (!url) {
            setCoordsMessage(null);
            return;
        }

        // Try to extract coordinates from URL patterns
        const patterns = [
            /@(-?\d+\.?\d*),(-?\d+\.?\d*)/,
            /!3d(-?\d+\.?\d*)!4d(-?\d+\.?\d*)/,
        ];

        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) {
                setData(prev => ({ ...prev, latitude: match[1], longitude: match[2] }));
                setCoordsMessage(`✓ Koordinat: ${match[1]}, ${match[2]}`);
                return;
            }
        }

        // For shortened URLs, call backend
        if (url.includes('goo.gl') || url.includes('maps.app')) {
            setResolvingUrl(true);
            setCoordsMessage('⏳ Memproses link...');

            try {
                const response = await axios.post(route('umkm.profile.resolve-map'), { url });
                if (response.data.success) {
                    setData(prev => ({
                        ...prev,
                        latitude: response.data.latitude,
                        longitude: response.data.longitude,
                    }));
                    setCoordsMessage(`✓ Koordinat: ${response.data.latitude}, ${response.data.longitude}`);
                } else {
                    setCoordsMessage('⚠ Tidak dapat mengambil koordinat');
                }
            } catch {
                setCoordsMessage('⚠ Gagal memproses link');
            } finally {
                setResolvingUrl(false);
            }
            return;
        }

        setCoordsMessage('⚠ Format link tidak dikenali');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('address', data.address);
        formData.append('phone', data.phone);
        formData.append('whatsapp', data.whatsapp);
        formData.append('email', data.email);
        formData.append('latitude', data.latitude);
        formData.append('longitude', data.longitude);

        if (logoFile) {
            formData.append('logo', logoFile);
        }
        if (removeLogo) {
            formData.append('remove_logo', '1');
        }

        router.post(route('umkm.profile.update'), formData, {
            forceFormData: true,
        });
    };

    return (
        <UmkmLayout
            title="Profil UMKM"
            pageTitle="Profil UMKM"
            breadcrumbs={[
                { label: 'Dashboard', href: route('umkm.dashboard') },
                { label: 'Profil UMKM' },
            ]}
        >
            <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
                {/* Flash Messages */}
                {flash?.success && (
                    <div className="p-4 bg-success/10 border border-success/20 rounded-lg text-success text-sm">
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="p-4 bg-error/10 border border-error/20 rounded-lg text-error text-sm">
                        {flash.error}
                    </div>
                )}

                {/* Logo Section */}
                <div className="card p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-4">
                        Logo UMKM
                    </h2>
                    <p className="text-sm text-muted mb-4">
                        Logo akan ditampilkan di halaman profil UMKM Anda. Ukuran maksimal 2MB.
                    </p>
                    <ImageUpload
                        value={removeLogo ? null : existingLogoUrl}
                        onChange={(file) => {
                            setLogoFile(file);
                            setRemoveLogo(false);
                        }}
                        onRemove={() => {
                            setLogoFile(null);
                            setRemoveLogo(true);
                        }}
                        maxSize={2}
                    />
                    {(errors as any).logo && (
                        <p className="text-sm text-error mt-2">{(errors as any).logo}</p>
                    )}
                </div>

                {/* Basic Info */}
                <div className="card p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-4">
                        Informasi Dasar
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Nama UMKM <span className="text-error">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="input"
                                placeholder="Nama usaha Anda"
                            />
                            {errors.name && (
                                <p className="text-sm text-error mt-1">{errors.name}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Deskripsi UMKM
                            </label>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="input min-h-[120px]"
                                placeholder="Ceritakan tentang usaha Anda, produk apa yang dijual, apa keunikannya..."
                            />
                            <p className="text-xs text-muted mt-1">Maksimal 2000 karakter</p>
                        </div>
                    </div>
                </div>

                {/* Contact Info */}
                <div className="card p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-4">
                        Kontak
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                No. WhatsApp
                            </label>
                            <input
                                type="text"
                                value={data.whatsapp}
                                onChange={(e) => setData('whatsapp', e.target.value)}
                                className="input"
                                placeholder="08xxxxxxxxxx"
                            />
                            <p className="text-xs text-muted mt-1">Pelanggan akan menghubungi via WhatsApp</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                No. Telepon
                            </label>
                            <input
                                type="text"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                className="input"
                                placeholder="08xxxxxxxxxx"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Email (Opsional)
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="input"
                                placeholder="email@usaha.com"
                            />
                        </div>
                    </div>
                </div>

                {/* Location */}
                <div className="card p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-4">
                        Lokasi
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Alamat Lengkap
                            </label>
                            <textarea
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                className="input min-h-[80px]"
                                placeholder="Jalan, RT/RW, Dusun, Desa..."
                            />
                        </div>

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
                                placeholder="Paste link Google Maps lokasi usaha Anda..."
                                disabled={resolvingUrl}
                            />
                            {coordsMessage && (
                                <p className={`text-sm mt-1 ${coordsMessage.startsWith('✓') ? 'text-success' : 'text-warning'}`}>
                                    {coordsMessage}
                                </p>
                            )}
                            <p className="text-xs text-muted mt-2">
                                💡 Buka Google Maps → Cari lokasi usaha → Klik tombol "Bagikan" → Copy link → Paste di sini
                            </p>

                            {/* Hidden lat/lng for reference */}
                            {data.latitude && data.longitude && (
                                <div className="mt-3 flex items-center gap-2">
                                    <span className="text-xs text-muted">
                                        📍 {data.latitude}, {data.longitude}
                                    </span>
                                    <a
                                        href={`https://www.google.com/maps?q=${data.latitude},${data.longitude}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-primary hover:underline"
                                    >
                                        Lihat di Maps
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <div className="flex items-center gap-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="btn-primary"
                    >
                        {processing ? 'Menyimpan...' : 'Simpan Profil'}
                    </button>
                </div>
            </form>
        </UmkmLayout>
    );
}
