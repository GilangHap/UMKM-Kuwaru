import { useState, useEffect } from 'react';
import { useForm, router } from '@inertiajs/react';
import UmkmLayout from '@/Layouts/UmkmLayout';
import { PageProps } from '@/types';

interface UmkmTheme {
    primary_color: string;
    secondary_color: string;
    accent_color: string;
}

interface Props extends PageProps {
    umkm: { id: string; name: string };
    theme: UmkmTheme;
    defaultColors: {
        primary: string;
        secondary: string;
        accent: string;
    };
    flash?: { success?: string; error?: string };
}

export default function Edit({ umkm, theme, defaultColors, flash }: Props) {
    const { data, setData, processing } = useForm({
        primary_color: theme.primary_color || defaultColors.primary,
        secondary_color: theme.secondary_color || defaultColors.secondary,
        accent_color: theme.accent_color || defaultColors.accent,
    });

    // Live preview
    const [previewStyles, setPreviewStyles] = useState<React.CSSProperties>({});

    useEffect(() => {
        setPreviewStyles({
            '--preview-primary': data.primary_color,
            '--preview-secondary': data.secondary_color,
            '--preview-accent': data.accent_color,
        } as React.CSSProperties);
    }, [data]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.put(route('umkm.branding.update'), data);
    };

    const handleReset = () => {
        if (confirm('Yakin ingin reset ke warna default? Perubahan tidak dapat dibatalkan.')) {
            router.post(route('umkm.branding.reset'));
        }
    };

    return (
        <UmkmLayout
            title="Branding"
            pageTitle="Branding UMKM"
            breadcrumbs={[
                { label: 'Dashboard', href: route('umkm.dashboard') },
                { label: 'Branding' },
            ]}
        >
            <div className="max-w-4xl">
                {/* Flash Messages */}
                {flash?.success && (
                    <div className="mb-6 p-4 bg-success/10 border border-success/20 rounded-lg text-success text-sm">
                        {flash.success}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Color Pickers */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="card p-6">
                            <h2 className="text-lg font-semibold text-foreground mb-2">
                                Warna Brand
                            </h2>
                            <p className="text-sm text-muted mb-6">
                                Pilih warna yang mewakili identitas usaha Anda. Warna ini akan ditampilkan di halaman profil UMKM.
                            </p>

                            <div className="space-y-5">
                                {/* Primary Color */}
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Warna Utama
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="color"
                                            value={data.primary_color}
                                            onChange={(e) => setData('primary_color', e.target.value)}
                                            className="w-14 h-10 rounded-lg border border-border cursor-pointer"
                                        />
                                        <input
                                            type="text"
                                            value={data.primary_color}
                                            onChange={(e) => setData('primary_color', e.target.value)}
                                            className="input flex-1 font-mono text-sm"
                                            placeholder="#0ea5e9"
                                        />
                                    </div>
                                    <p className="text-xs text-muted mt-1">Untuk tombol, link, dan elemen penting</p>
                                </div>

                                {/* Secondary Color */}
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Warna Sekunder
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="color"
                                            value={data.secondary_color}
                                            onChange={(e) => setData('secondary_color', e.target.value)}
                                            className="w-14 h-10 rounded-lg border border-border cursor-pointer"
                                        />
                                        <input
                                            type="text"
                                            value={data.secondary_color}
                                            onChange={(e) => setData('secondary_color', e.target.value)}
                                            className="input flex-1 font-mono text-sm"
                                            placeholder="#06b6d4"
                                        />
                                    </div>
                                    <p className="text-xs text-muted mt-1">Untuk background dan aksen tambahan</p>
                                </div>

                                {/* Accent Color */}
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Warna Aksen
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="color"
                                            value={data.accent_color}
                                            onChange={(e) => setData('accent_color', e.target.value)}
                                            className="w-14 h-10 rounded-lg border border-border cursor-pointer"
                                        />
                                        <input
                                            type="text"
                                            value={data.accent_color}
                                            onChange={(e) => setData('accent_color', e.target.value)}
                                            className="input flex-1 font-mono text-sm"
                                            placeholder="#f59e0b"
                                        />
                                    </div>
                                    <p className="text-xs text-muted mt-1">Untuk highlight dan badge</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="btn-primary"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Branding'}
                            </button>
                            <button
                                type="button"
                                onClick={handleReset}
                                className="btn-secondary"
                            >
                                Reset ke Default
                            </button>
                        </div>
                    </form>

                    {/* Live Preview */}
                    <div className="card p-6" style={previewStyles}>
                        <h2 className="text-lg font-semibold text-foreground mb-4">
                            Preview
                        </h2>

                        <div className="space-y-4">
                            {/* Sample Card */}
                            <div 
                                className="p-4 rounded-lg"
                                style={{ backgroundColor: data.secondary_color + '20' }}
                            >
                                <h3 className="font-semibold mb-2" style={{ color: data.primary_color }}>
                                    {umkm.name}
                                </h3>
                                <p className="text-sm text-muted mb-3">
                                    Contoh deskripsi produk atau artikel dari UMKM Anda yang akan ditampilkan kepada pengunjung.
                                </p>
                                <button 
                                    className="px-4 py-2 rounded-lg text-white text-sm font-medium"
                                    style={{ backgroundColor: data.primary_color }}
                                >
                                    Lihat Selengkapnya
                                </button>
                            </div>

                            {/* Badges */}
                            <div className="flex flex-wrap gap-2">
                                <span 
                                    className="px-3 py-1 rounded-full text-xs font-medium text-white"
                                    style={{ backgroundColor: data.primary_color }}
                                >
                                    Produk Unggulan
                                </span>
                                <span 
                                    className="px-3 py-1 rounded-full text-xs font-medium text-white"
                                    style={{ backgroundColor: data.accent_color }}
                                >
                                    Promo
                                </span>
                                <span 
                                    className="px-3 py-1 rounded-full text-xs font-medium"
                                    style={{ 
                                        backgroundColor: data.secondary_color + '30',
                                        color: data.secondary_color 
                                    }}
                                >
                                    Kategori
                                </span>
                            </div>

                            {/* Color Swatches */}
                            <div className="flex gap-3 pt-4 border-t border-border">
                                <div className="text-center">
                                    <div 
                                        className="w-12 h-12 rounded-lg mb-1"
                                        style={{ backgroundColor: data.primary_color }}
                                    />
                                    <span className="text-xs text-muted">Utama</span>
                                </div>
                                <div className="text-center">
                                    <div 
                                        className="w-12 h-12 rounded-lg mb-1"
                                        style={{ backgroundColor: data.secondary_color }}
                                    />
                                    <span className="text-xs text-muted">Sekunder</span>
                                </div>
                                <div className="text-center">
                                    <div 
                                        className="w-12 h-12 rounded-lg mb-1"
                                        style={{ backgroundColor: data.accent_color }}
                                    />
                                    <span className="text-xs text-muted">Aksen</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </UmkmLayout>
    );
}
