import { useState } from 'react';
import { useForm, router, Link, usePage } from '@inertiajs/react';
import UmkmLayout from '@/Layouts/UmkmLayout';
import { PageProps } from '@/types';

export default function Create() {
    const { flash } = usePage<PageProps & { flash?: { success?: string; error?: string } }>().props;
    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const { data, setData, processing, errors } = useForm({
        name: '',
        description: '',
        price_range: '',
        is_featured: false,
        shopee_url: '',
        tokopedia_url: '',
        other_marketplace_url: '',
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files).slice(0, 5 - images.length);
            setImages(prev => [...prev, ...files]);
            
            // Create previews
            files.forEach(file => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setImagePreviews(prev => [...prev, e.target?.result as string]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('price_range', data.price_range);
        formData.append('is_featured', data.is_featured ? '1' : '0');
        formData.append('shopee_url', data.shopee_url);
        formData.append('tokopedia_url', data.tokopedia_url);
        formData.append('other_marketplace_url', data.other_marketplace_url);

        images.forEach((img, index) => {
            formData.append(`images[${index}]`, img);
        });

        router.post(route('umkm.products.store'), formData, {
            forceFormData: true,
        });
    };

    return (
        <UmkmLayout
            title="Tambah Produk"
            pageTitle="Tambah Produk Baru"
            breadcrumbs={[
                { label: 'Dashboard', href: route('umkm.dashboard') },
                { label: 'Produk', href: route('umkm.products.index') },
                { label: 'Tambah' },
            ]}
        >
            <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
                {/* Flash Messages */}
                {flash?.success && (
                    <div className="p-4 bg-success/10 border border-success/20 rounded-lg text-success text-sm">
                        ✓ {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="p-4 bg-error/10 border border-error/20 rounded-lg text-error text-sm">
                        ⚠ {flash.error}
                    </div>
                )}

                {/* All Errors Summary */}
                {Object.keys(errors).length > 0 && (
                    <div className="p-4 bg-error/10 border border-error/20 rounded-lg text-error text-sm">
                        <p className="font-medium mb-2">Terdapat kesalahan:</p>
                        <ul className="list-disc list-inside space-y-1">
                            {Object.entries(errors).map(([key, message]) => (
                                <li key={key}>{message}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Images */}
                <div className="card p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-4">
                        Foto Produk
                    </h2>
                    <p className="text-sm text-muted mb-4">
                        Upload hingga 5 foto produk. Foto pertama akan menjadi foto utama.
                    </p>

                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                        {imagePreviews.map((preview, index) => (
                            <div key={index} className="relative aspect-square">
                                <img 
                                    src={preview} 
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-full object-cover rounded-lg border border-border"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute -top-2 -right-2 p-1 bg-error text-white rounded-full"
                                >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                {index === 0 && (
                                    <span className="absolute bottom-1 left-1 px-2 py-0.5 bg-primary text-white text-xs rounded">
                                        Utama
                                    </span>
                                )}
                            </div>
                        ))}

                        {images.length < 5 && (
                            <label className="aspect-square border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                                <svg className="w-6 h-6 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                <span className="text-xs text-muted mt-1">Tambah</span>
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleImageChange}
                                    className="hidden"
                                    multiple
                                />
                            </label>
                        )}
                    </div>
                    {(errors as any).images && (
                        <p className="text-sm text-error mt-2">{(errors as any).images}</p>
                    )}
                </div>

                {/* Basic Info */}
                <div className="card p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-4">
                        Informasi Produk
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Nama Produk <span className="text-error">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="input"
                                placeholder="Contoh: Keripik Singkong Pedas"
                            />
                            {errors.name && (
                                <p className="text-sm text-error mt-1">{errors.name}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Deskripsi Produk
                            </label>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="input min-h-[120px]"
                                placeholder="Jelaskan detail produk, bahan, ukuran, varian yang tersedia..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Harga / Range Harga
                            </label>
                            <input
                                type="text"
                                value={data.price_range}
                                onChange={(e) => setData('price_range', e.target.value)}
                                className="input"
                                placeholder="Contoh: Rp 15.000 - Rp 25.000"
                            />
                            <p className="text-xs text-muted mt-1">Bisa berupa harga pasti atau range harga</p>
                        </div>

                        <div>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.is_featured}
                                    onChange={(e) => setData('is_featured', e.target.checked)}
                                    className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                                />
                                <span className="text-sm font-medium text-foreground">
                                    Jadikan produk unggulan
                                </span>
                            </label>
                            <p className="text-xs text-muted mt-1 ml-8">
                                Produk unggulan akan ditampilkan di halaman utama UMKM
                            </p>
                        </div>
                    </div>
                </div>

                {/* Marketplace Links */}
                <div className="card p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-2">
                        Link Marketplace
                    </h2>
                    <p className="text-sm text-muted mb-4">
                        Tambahkan link toko online Anda agar pelanggan bisa langsung membeli.
                    </p>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                <span className="text-orange-500">🛒</span> Shopee
                            </label>
                            <input
                                type="url"
                                value={data.shopee_url}
                                onChange={(e) => setData('shopee_url', e.target.value)}
                                className="input"
                                placeholder="https://shopee.co.id/..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                <span className="text-green-500">🛒</span> Tokopedia
                            </label>
                            <input
                                type="url"
                                value={data.tokopedia_url}
                                onChange={(e) => setData('tokopedia_url', e.target.value)}
                                className="input"
                                placeholder="https://www.tokopedia.com/..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Marketplace Lainnya
                            </label>
                            <input
                                type="url"
                                value={data.other_marketplace_url}
                                onChange={(e) => setData('other_marketplace_url', e.target.value)}
                                className="input"
                                placeholder="https://..."
                            />
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
                        {processing ? 'Menyimpan...' : 'Simpan Produk'}
                    </button>
                    <Link href={route('umkm.products.index')} className="btn-secondary">
                        Batal
                    </Link>
                </div>
            </form>
        </UmkmLayout>
    );
}
