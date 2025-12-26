import { useState, lazy, Suspense } from 'react';
import { useForm, Link, usePage, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import ImageUpload from '@/Components/ImageUpload';
import { PageProps } from '@/types';

// Lazy load RichTextEditor
const RichTextEditor = lazy(() => import('@/Components/RichTextEditor'));

interface Umkm {
    id: string;
    name: string;
}

interface Props extends PageProps {
    umkms: Umkm[];
}

export default function Create({ umkms }: Props) {
    const { flash } = usePage().props as any;
    const [featuredImage, setFeaturedImage] = useState<File | null>(null);
    
    const { data, setData, post, processing, errors } = useForm({
        umkm_id: '',
        title: '',
        excerpt: '',
        content: '',
        seo_title: '',
        seo_description: '',
        status: 'draft' as 'draft' | 'pending' | 'approved',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('umkm_id', data.umkm_id);
        formData.append('title', data.title);
        formData.append('excerpt', data.excerpt);
        formData.append('content', data.content);
        formData.append('seo_title', data.seo_title);
        formData.append('seo_description', data.seo_description);
        formData.append('status', data.status);
        
        if (featuredImage) {
            formData.append('featured_image', featuredImage);
        }
        
        router.post(route('admin.articles.store'), formData, {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout
            title="Buat Artikel"
            pageTitle="Buat Artikel"
            breadcrumbs={[
                { label: 'Dashboard', href: route('admin.dashboard') },
                { label: 'Artikel', href: route('admin.articles.index') },
                { label: 'Buat' },
            ]}
        >
            {/* Flash Messages */}
            {flash?.error && (
                <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg text-error text-sm">
                    {flash.error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
                {/* Featured Image */}
                <div className="card p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-4">Gambar Utama</h2>
                    <ImageUpload
                        onChange={(file) => setFeaturedImage(file)}
                        maxSize={2}
                    />
                    {(errors as any).featured_image && (
                        <p className="text-sm text-error mt-2">{(errors as any).featured_image}</p>
                    )}
                </div>

                {/* Main Content */}
                <div className="card p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-6">Konten Artikel</h2>
                    
                    <div className="space-y-4">
                        {/* UMKM Selection */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                UMKM <span className="text-error">*</span>
                            </label>
                            <select
                                value={data.umkm_id}
                                onChange={(e) => setData('umkm_id', e.target.value)}
                                className="input"
                            >
                                <option value="">Pilih UMKM...</option>
                                {umkms.map((umkm) => (
                                    <option key={umkm.id} value={umkm.id}>{umkm.name}</option>
                                ))}
                            </select>
                            {errors.umkm_id && (
                                <p className="text-sm text-error mt-1">{errors.umkm_id}</p>
                            )}
                        </div>

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Judul Artikel <span className="text-error">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className="input"
                                placeholder="Masukkan judul artikel"
                            />
                            {errors.title && (
                                <p className="text-sm text-error mt-1">{errors.title}</p>
                            )}
                        </div>

                        {/* Excerpt */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Ringkasan (Excerpt)
                            </label>
                            <textarea
                                value={data.excerpt}
                                onChange={(e) => setData('excerpt', e.target.value)}
                                className="input min-h-[80px]"
                                placeholder="Ringkasan singkat artikel (opsional)"
                            />
                            {errors.excerpt && (
                                <p className="text-sm text-error mt-1">{errors.excerpt}</p>
                            )}
                        </div>

                        {/* Content */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Konten <span className="text-error">*</span>
                            </label>
                            <Suspense fallback={
                                <div className="border border-border rounded-lg p-8 text-center text-muted">
                                    Memuat editor...
                                </div>
                            }>
                                <RichTextEditor
                                    content={data.content}
                                    onChange={(content) => setData('content', content)}
                                />
                            </Suspense>
                            {errors.content && (
                                <p className="text-sm text-error mt-1">{errors.content}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* SEO Settings */}
                <div className="card p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-6">SEO (Opsional)</h2>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                SEO Title
                            </label>
                            <input
                                type="text"
                                value={data.seo_title}
                                onChange={(e) => setData('seo_title', e.target.value)}
                                className="input"
                                placeholder="Judul untuk mesin pencari (max 60 karakter)"
                                maxLength={60}
                            />
                            <p className="text-xs text-muted mt-1">{data.seo_title.length}/60</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                SEO Description
                            </label>
                            <textarea
                                value={data.seo_description}
                                onChange={(e) => setData('seo_description', e.target.value)}
                                className="input min-h-[80px]"
                                placeholder="Deskripsi untuk mesin pencari (max 160 karakter)"
                                maxLength={160}
                            />
                            <p className="text-xs text-muted mt-1">{data.seo_description.length}/160</p>
                        </div>
                    </div>
                </div>

                {/* Status & Actions */}
                <div className="card p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-6">Status</h2>
                    
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-foreground mb-1">
                            Status Artikel
                        </label>
                        <select
                            value={data.status}
                            onChange={(e) => setData('status', e.target.value as any)}
                            className="input w-full md:w-64"
                        >
                            <option value="draft">Draft (Simpan saja)</option>
                            <option value="pending">Pending (Untuk review)</option>
                            <option value="approved">Approved (Langsung publish)</option>
                        </select>
                        <p className="text-xs text-muted mt-1">
                            {data.status === 'approved' && 'Artikel akan langsung dipublikasikan.'}
                            {data.status === 'pending' && 'Artikel akan masuk antrian review.'}
                            {data.status === 'draft' && 'Artikel disimpan sebagai draft.'}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="submit"
                            disabled={processing}
                            className="btn-primary"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Artikel'}
                        </button>
                        <Link href={route('admin.articles.index')} className="btn-secondary">
                            Batal
                        </Link>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
