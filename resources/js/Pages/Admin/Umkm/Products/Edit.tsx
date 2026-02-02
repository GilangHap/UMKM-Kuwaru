import { useState } from 'react';
import { useForm, router, Link, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageProps, Umkm } from '@/types';

interface Product {
    id: string;
    name: string;
    slug: string;
    description?: string;
    price_range?: string;
    is_featured: boolean;
    shopee_url?: string;
    tokopedia_url?: string;
    other_marketplace_url?: string;
    image?: {
        id: string;
        file_path: string;
    };
}

interface Props extends PageProps {
    umkm: Umkm;
    product: Product;
}

export default function Edit({ umkm, product }: Props) {
    const { flash } = usePage<PageProps & { flash?: { success?: string; error?: string } }>().props;
    const [imagePreview, setImagePreview] = useState<string | null>(
        product.image ? `/storage/${product.image.file_path}` : null
    );
    const [removeExistingImage, setRemoveExistingImage] = useState(false);

    const { data, setData, processing, errors } = useForm({
        name: product.name,
        description: product.description || '',
        price_range: product.price_range || '',
        is_featured: product.is_featured,
        shopee_url: product.shopee_url || '',
        tokopedia_url: product.tokopedia_url || '',
        other_marketplace_url: product.other_marketplace_url || '',
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
                setRemoveExistingImage(false);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImagePreview(null);
        setRemoveExistingImage(true);
        const input = document.getElementById('image-input') as HTMLInputElement;
        if (input) input.value = '';
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('price_range', data.price_range);
        formData.append('is_featured', data.is_featured ? '1' : '0');
        formData.append('shopee_url', data.shopee_url);
        formData.append('tokopedia_url', data.tokopedia_url);
        formData.append('other_marketplace_url', data.other_marketplace_url);
        formData.append('remove_image', removeExistingImage ? '1' : '0');

        const imageInput = document.getElementById('image-input') as HTMLInputElement;
        if (imageInput?.files?.[0]) {
            formData.append('image', imageInput.files[0]);
        }

        router.post(route('admin.umkm.products.update', { umkm: umkm.id, product: product.id }), formData, {
            forceFormData: true,
        });
    };

    const handleDelete = () => {
        if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
            router.delete(route('admin.umkm.products.destroy', { umkm: umkm.id, product: product.id }));
        }
    };

    return (
        <AdminLayout
            title={`Edit Produk - ${product.name}`}
            pageTitle="Edit Produk"
            breadcrumbs={[
                { label: 'Dashboard', href: route('admin.dashboard') },
                { label: 'UMKM', href: route('admin.umkm.index') },
                { label: umkm.name, href: route('admin.umkm.show', umkm.id) },
                { label: 'Edit Produk' },
            ]}
            actions={
                <button
                    onClick={handleDelete}
                    className="btn-outline text-error border-error hover:bg-error hover:text-white flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Hapus Produk
                </button>
            }
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

                {/* Image */}
                <div className="card p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-4">
                        Foto Produk
                    </h2>

                    {/* Hidden file input - always in DOM */}
                    <input 
                        type="file" 
                        id="image-input"
                        accept="image/*" 
                        onChange={handleImageChange}
                        className="hidden"
                    />

                    <div className="flex items-start gap-4">
                        {imagePreview ? (
                            <div className="relative w-32 h-32">
                                <img 
                                    src={imagePreview} 
                                    alt="Preview"
                                    className="w-full h-full object-cover rounded-lg border border-border"
                                />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute -top-2 -right-2 p-1 bg-error text-white rounded-full"
                                >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ) : (
                            <label 
                                htmlFor="image-input"
                                className="w-32 h-32 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
                            >
                                <svg className="w-8 h-8 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                <span className="text-xs text-muted mt-1">Tambah Foto</span>
                            </label>
                        )}
                    </div>
                    {(errors as any).image && (
                        <p className="text-sm text-error mt-2">{(errors as any).image}</p>
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
                        Tambahkan link toko online agar pelanggan bisa langsung membeli.
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
                        {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                    <Link href={route('admin.umkm.show', umkm.id)} className="btn-secondary">
                        Batal
                    </Link>
                </div>
            </form>
        </AdminLayout>
    );
}
