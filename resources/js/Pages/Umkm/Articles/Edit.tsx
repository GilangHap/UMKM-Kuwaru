import { useState } from 'react';
import { useForm, router, Link } from '@inertiajs/react';
import UmkmLayout from '@/Layouts/UmkmLayout';
import RichTextEditor from '@/Components/RichTextEditor';
import ImageUpload from '@/Components/ImageUpload';
import ConfirmModal from '@/Components/ConfirmModal';
import { PageProps } from '@/types';

interface Article {
    id: string;
    title: string;
    excerpt?: string;
    content: string;
    status: 'draft' | 'pending' | 'approved' | 'rejected';
    rejection_notes?: string;
    featured_image?: { id: string; url?: string; file_path?: string };
}

interface Props extends PageProps {
    article: Article;
    uploadUrl: string;
}

export default function Edit({ article, uploadUrl }: Props) {
    const [featuredImage, setFeaturedImage] = useState<File | null>(null);
    const [removeFeaturedImage, setRemoveFeaturedImage] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const existingImageUrl = article.featured_image?.url ||
        (article.featured_image?.file_path ? `/storage/${article.featured_image.file_path}` : null);

    const { data, setData, processing, errors } = useForm({
        title: article.title,
        excerpt: article.excerpt || '',
        content: article.content,
        status: article.status === 'rejected' ? 'draft' : article.status,
    });

    const handleSubmit = (e: React.FormEvent, submitStatus: 'draft' | 'pending') => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('title', data.title);
        formData.append('excerpt', data.excerpt);
        formData.append('content', data.content);
        formData.append('status', submitStatus);

        if (featuredImage) {
            formData.append('featured_image', featuredImage);
        }
        if (removeFeaturedImage) {
            formData.append('remove_featured_image', '1');
        }

        router.post(route('umkm.articles.update', article.id), formData, {
            forceFormData: true,
        });
    };

    const handleDelete = () => {
        router.delete(route('umkm.articles.destroy', article.id));
    };

    return (
        <UmkmLayout
            title="Edit Artikel"
            pageTitle="Edit Artikel"
            breadcrumbs={[
                { label: 'Dashboard', href: route('umkm.dashboard') },
                { label: 'Artikel', href: route('umkm.articles.index') },
                { label: article.title },
            ]}
        >
            {/* Rejection Warning */}
            {article.status === 'rejected' && article.rejection_notes && (
                <div className="max-w-4xl mb-6 p-4 bg-error/10 border border-error/20 rounded-lg">
                    <p className="text-sm font-medium text-error mb-1">Artikel Ditolak</p>
                    <p className="text-sm text-error/80">{article.rejection_notes}</p>
                    <p className="text-xs text-muted mt-2">Perbaiki artikel Anda dan kirim ulang untuk review.</p>
                </div>
            )}

            <form className="max-w-4xl space-y-6">
                {/* Featured Image */}
                <div className="card p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-4">
                        Gambar Utama
                    </h2>
                    <ImageUpload
                        value={removeFeaturedImage ? null : existingImageUrl}
                        onChange={(file) => {
                            setFeaturedImage(file);
                            setRemoveFeaturedImage(false);
                        }}
                        onRemove={() => {
                            setFeaturedImage(null);
                            setRemoveFeaturedImage(true);
                        }}
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
                            />
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
                    />
                    {errors.content && (
                        <p className="text-sm text-error mt-2">{errors.content}</p>
                    )}
                </div>

                {/* Actions */}
                <div className="card p-6">
                    <div className="flex flex-wrap items-center gap-4">
                        <button
                            type="button"
                            onClick={() => setShowDeleteModal(true)}
                            className="text-error hover:underline text-sm"
                        >
                            Hapus Artikel
                        </button>

                        <div className="ml-auto flex flex-wrap gap-4">
                            <Link href={route('umkm.articles.index')} className="btn-secondary">
                                Batal
                            </Link>

                            <button
                                type="button"
                                disabled={processing}
                                onClick={(e) => handleSubmit(e as any, 'draft')}
                                className="btn-secondary"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Draft'}
                            </button>

                            <button
                                type="button"
                                disabled={processing}
                                onClick={(e) => handleSubmit(e as any, 'pending')}
                                className="btn-primary"
                            >
                                {processing ? 'Mengirim...' : 'Kirim untuk Review'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>

            {/* Delete Confirmation */}
            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                title="Hapus Artikel"
                message="Yakin ingin menghapus artikel ini? Tindakan ini tidak dapat dibatalkan."
                confirmLabel="Ya, Hapus"
                variant="danger"
            />
        </UmkmLayout>
    );
}
