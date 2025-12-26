import { useState } from 'react';
import { useForm, router, Link } from '@inertiajs/react';
import UmkmLayout from '@/Layouts/UmkmLayout';
import RichTextEditor from '@/Components/RichTextEditor';
import ImageUpload from '@/Components/ImageUpload';
import { PageProps } from '@/types';

interface Props extends PageProps {
    uploadUrl: string;
}

export default function Create({ uploadUrl }: Props) {
    const [featuredImage, setFeaturedImage] = useState<File | null>(null);

    const { data, setData, processing, errors } = useForm({
        title: '',
        excerpt: '',
        content: '',
        status: 'draft' as 'draft' | 'pending',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('excerpt', data.excerpt);
        formData.append('content', data.content);
        formData.append('status', data.status);

        if (featuredImage) {
            formData.append('featured_image', featuredImage);
        }

        router.post(route('umkm.articles.store'), formData, {
            forceFormData: true,
        });
    };

    return (
        <UmkmLayout
            title="Tulis Artikel"
            pageTitle="Tulis Artikel Baru"
            breadcrumbs={[
                { label: 'Dashboard', href: route('umkm.dashboard') },
                { label: 'Artikel', href: route('umkm.articles.index') },
                { label: 'Tulis' },
            ]}
        >
            <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
                {/* Featured Image */}
                <div className="card p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-4">
                        Gambar Utama
                    </h2>
                    <p className="text-sm text-muted mb-4">
                        Gambar ini akan ditampilkan sebagai thumbnail artikel.
                    </p>
                    <ImageUpload
                        value={null}
                        onChange={(file) => setFeaturedImage(file)}
                        onRemove={() => setFeaturedImage(null)}
                        maxSize={2}
                    />
                </div>

                {/* Title & Excerpt */}
                <div className="card p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-4">
                        Informasi Artikel
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Judul Artikel <span className="text-error">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className="input"
                                placeholder="Judul yang menarik perhatian..."
                            />
                            {errors.title && (
                                <p className="text-sm text-error mt-1">{errors.title}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Ringkasan Singkat
                            </label>
                            <textarea
                                value={data.excerpt}
                                onChange={(e) => setData('excerpt', e.target.value)}
                                className="input min-h-[80px]"
                                placeholder="1-2 kalimat yang menggambarkan isi artikel..."
                            />
                            <p className="text-xs text-muted mt-1">Maksimal 500 karakter. Ditampilkan di daftar artikel.</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="card p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-4">
                        Isi Artikel <span className="text-error">*</span>
                    </h2>
                    <RichTextEditor
                        content={data.content}
                        onChange={(content) => setData('content', content)}
                        uploadUrl={uploadUrl}
                        placeholder="Tulis artikel Anda di sini..."
                    />
                    {errors.content && (
                        <p className="text-sm text-error mt-2">{errors.content}</p>
                    )}
                </div>

                {/* Actions */}
                <div className="card p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-4">
                        Simpan Sebagai
                    </h2>

                    <div className="flex flex-wrap gap-4">
                        <button
                            type="submit"
                            disabled={processing}
                            onClick={() => setData('status', 'draft')}
                            className="btn-secondary"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                            </svg>
                            {processing && data.status === 'draft' ? 'Menyimpan...' : 'Simpan Draft'}
                        </button>

                        <button
                            type="submit"
                            disabled={processing}
                            onClick={() => setData('status', 'pending')}
                            className="btn-primary"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                            {processing && data.status === 'pending' ? 'Mengirim...' : 'Kirim untuk Review'}
                        </button>

                        <Link href={route('umkm.articles.index')} className="btn-secondary ml-auto">
                            Batal
                        </Link>
                    </div>

                    <p className="text-xs text-muted mt-4">
                        💡 <strong>Draft</strong> = Disimpan, belum dikirim ke Admin Desa.<br/>
                        💡 <strong>Kirim untuk Review</strong> = Artikel akan di-review oleh Admin Desa sebelum dipublikasikan.
                    </p>
                </div>
            </form>
        </UmkmLayout>
    );
}
