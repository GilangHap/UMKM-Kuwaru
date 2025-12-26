import { useState } from 'react';
import { router, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import StatusBadge from '@/Components/StatusBadge';
import ConfirmModal from '@/Components/ConfirmModal';
import { PageProps } from '@/types';

interface ArticleWithRelations {
    id: string;
    umkm_id: string;
    title: string;
    slug: string;
    excerpt?: string;
    content: string;
    status: 'draft' | 'pending' | 'approved' | 'rejected';
    views_count?: number;
    rejection_notes?: string;
    published_at?: string;
    created_at: string;
    updated_at: string;
    umkm?: {
        id: number;
        name: string;
    };
    approved_by?: {
        id: number;
        name: string;
    };
    featured_image?: {
        id: number;
        url: string;
    };
}

interface Props extends PageProps {
    article: ArticleWithRelations;
}

export default function Show({ article }: Props) {
    const { flash } = usePage().props as any;
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showApproveConfirm, setShowApproveConfirm] = useState(false);
    
    const { data, setData, post, processing, errors } = useForm({
        rejection_notes: '',
    });

    const handleApprove = () => {
        router.post(route('admin.articles.approve', article.id), {}, {
            onSuccess: () => setShowApproveConfirm(false),
        });
    };

    const handleReject = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.articles.reject', article.id), {
            onSuccess: () => setShowRejectModal(false),
        });
    };

    const getStatusType = (status: string) => {
        switch (status) {
            case 'pending': return 'pending';
            case 'approved': return 'approved';
            case 'rejected': return 'rejected';
            case 'draft': return 'draft';
            default: return 'info';
        }
    };

    return (
        <AdminLayout
            title={`Review: ${article.title}`}
            pageTitle="Review Artikel"
            breadcrumbs={[
                { label: 'Dashboard', href: route('admin.dashboard') },
                { label: 'Artikel', href: route('admin.articles.index') },
                { label: 'Review' },
            ]}
        >
            {/* Flash Messages */}
            {flash?.success && (
                <div className="mb-6 p-4 bg-success/10 border border-success/20 rounded-lg text-success text-sm">
                    {flash.success}
                </div>
            )}
            {flash?.error && (
                <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg text-error text-sm">
                    {flash.error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Article Content */}
                <div className="lg:col-span-2">
                    <div className="card">
                        {/* Featured Image */}
                        {article.featured_image && (
                            <div className="aspect-video bg-surface-hover rounded-t-xl overflow-hidden">
                                <img 
                                    src={article.featured_image.url} 
                                    alt={article.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        <div className="p-6">
                            <h1 className="text-2xl font-bold text-foreground mb-4">
                                {article.title}
                            </h1>

                            {article.excerpt && (
                                <p className="text-muted italic mb-4 pb-4 border-b border-border">
                                    {article.excerpt}
                                </p>
                            )}

                            <div 
                                className="prose prose-sm max-w-none"
                                dangerouslySetInnerHTML={{ __html: article.content }}
                            />
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Status Card */}
                    <div className="card p-6">
                        <h3 className="text-sm font-semibold text-foreground mb-4">Status</h3>
                        <StatusBadge status={getStatusType(article.status)} size="md" />
                        
                        {article.status === 'rejected' && article.rejection_notes && (
                            <div className="mt-4 p-3 bg-error/10 rounded-lg">
                                <p className="text-sm font-medium text-error mb-1">Alasan Penolakan:</p>
                                <p className="text-sm text-error">{article.rejection_notes}</p>
                            </div>
                        )}
                    </div>

                    {/* Info Card */}
                    <div className="card p-6">
                        <h3 className="text-sm font-semibold text-foreground mb-4">Informasi</h3>
                        <dl className="space-y-3 text-sm">
                            <div>
                                <dt className="text-muted">UMKM</dt>
                                <dd className="font-medium">{article.umkm?.name || '-'}</dd>
                            </div>
                            <div>
                                <dt className="text-muted">Tanggal Dibuat</dt>
                                <dd className="font-medium">
                                    {new Date(article.created_at).toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </dd>
                            </div>
                            {article.published_at && (
                                <div>
                                    <dt className="text-muted">Tanggal Publikasi</dt>
                                    <dd className="font-medium">
                                        {new Date(article.published_at).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                        })}
                                    </dd>
                                </div>
                            )}
                            <div>
                                <dt className="text-muted">Jumlah Views</dt>
                                <dd className="font-medium">{article.views_count || 0}</dd>
                            </div>
                        </dl>
                    </div>

                    {/* Actions */}
                    {article.status === 'pending' && (
                        <div className="card p-6">
                            <h3 className="text-sm font-semibold text-foreground mb-4">Aksi</h3>
                            <div className="space-y-3">
                                <button
                                    onClick={() => setShowApproveConfirm(true)}
                                    className="w-full btn-primary flex items-center justify-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Setujui & Publikasikan
                                </button>
                                <button
                                    onClick={() => setShowRejectModal(true)}
                                    className="w-full btn-secondary text-error hover:bg-error/10 flex items-center justify-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Tolak
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Back Button */}
                    <a href={route('admin.articles.index')} className="btn-secondary w-full flex items-center justify-center">
                        ← Kembali
                    </a>
                </div>
            </div>

            {/* Approve Confirm */}
            <ConfirmModal
                isOpen={showApproveConfirm}
                onClose={() => setShowApproveConfirm(false)}
                onConfirm={handleApprove}
                title="Setujui Artikel"
                message={`Apakah Anda yakin ingin menyetujui dan mempublikasikan artikel "${article.title}"?`}
                confirmLabel="Setujui & Publikasikan"
                variant="info"
            />

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-surface rounded-xl shadow-xl w-full max-w-md">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-foreground mb-2">
                                Tolak Artikel
                            </h3>
                            <p className="text-sm text-muted mb-4">
                                Berikan alasan penolakan agar penulis dapat memperbaiki artikelnya.
                            </p>
                            <form onSubmit={handleReject}>
                                <textarea
                                    value={data.rejection_notes}
                                    onChange={(e) => setData('rejection_notes', e.target.value)}
                                    className="input min-h-[120px]"
                                    placeholder="Contoh: Konten tidak sesuai dengan tema UMKM, gambar tidak jelas, dll."
                                    required
                                />
                                {errors.rejection_notes && (
                                    <p className="text-sm text-error mt-1">{errors.rejection_notes}</p>
                                )}
                                <div className="flex justify-end gap-3 mt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowRejectModal(false)}
                                        className="btn-secondary"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center px-4 py-2 bg-error text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                        {processing ? 'Memproses...' : 'Tolak Artikel'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
