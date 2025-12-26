import { Link } from '@inertiajs/react';
import UmkmLayout from '@/Layouts/UmkmLayout';
import { PageProps } from '@/types';
import StatusBadge from '@/Components/StatusBadge';
import EmptyState from '@/Components/EmptyState';

interface Article {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    status: 'draft' | 'pending' | 'approved' | 'rejected';
    rejection_notes?: string;
    published_at?: string;
    created_at: string;
    featured_image?: { id: string; url?: string; file_path?: string };
}

interface Props extends PageProps {
    articles: {
        data: Article[];
        links: any;
        current_page: number;
        last_page: number;
    };
    stats: {
        total: number;
        draft: number;
        pending: number;
        approved: number;
        rejected: number;
    };
    filters: { status?: string };
    flash?: { success?: string; error?: string };
}

const statusLabels: Record<string, { label: string; color: string }> = {
    draft: { label: 'Draft', color: 'secondary' },
    pending: { label: 'Menunggu Review', color: 'warning' },
    approved: { label: 'Disetujui', color: 'success' },
    rejected: { label: 'Ditolak', color: 'error' },
};

export default function Index({ articles, stats, filters, flash }: Props) {
    return (
        <UmkmLayout
            title="Artikel"
            pageTitle="Artikel Saya"
            breadcrumbs={[
                { label: 'Dashboard', href: route('umkm.dashboard') },
                { label: 'Artikel' },
            ]}
            actions={
                <Link href={route('umkm.articles.create')} className="btn-primary">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Tulis Artikel
                </Link>
            }
        >
            {/* Flash Messages */}
            {flash?.success && (
                <div className="mb-6 p-4 bg-success/10 border border-success/20 rounded-lg text-success text-sm">
                    ✓ {flash.success}
                </div>
            )}
            {flash?.error && (
                <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg text-error text-sm">
                    {flash.error}
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <Link 
                    href={route('umkm.articles.index')}
                    className={`card p-4 ${!filters.status ? 'ring-2 ring-primary' : ''}`}
                >
                    <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                    <p className="text-sm text-muted">Semua</p>
                </Link>
                <Link 
                    href={route('umkm.articles.index', { status: 'draft' })}
                    className={`card p-4 ${filters.status === 'draft' ? 'ring-2 ring-primary' : ''}`}
                >
                    <p className="text-2xl font-bold text-muted">{stats.draft}</p>
                    <p className="text-sm text-muted">Draft</p>
                </Link>
                <Link 
                    href={route('umkm.articles.index', { status: 'pending' })}
                    className={`card p-4 ${filters.status === 'pending' ? 'ring-2 ring-primary' : ''}`}
                >
                    <p className="text-2xl font-bold text-warning">{stats.pending}</p>
                    <p className="text-sm text-muted">Menunggu</p>
                </Link>
                <Link 
                    href={route('umkm.articles.index', { status: 'approved' })}
                    className={`card p-4 ${filters.status === 'approved' ? 'ring-2 ring-primary' : ''}`}
                >
                    <p className="text-2xl font-bold text-success">{stats.approved}</p>
                    <p className="text-sm text-muted">Disetujui</p>
                </Link>
            </div>

            {/* Info Box */}
            <div className="mb-6 p-4 bg-primary/5 border border-primary/10 rounded-lg">
                <p className="text-sm text-foreground">
                    <strong>💡 Catatan:</strong> Artikel yang Anda tulis akan di-review terlebih dahulu oleh Admin Desa sebelum ditampilkan ke publik.
                </p>
            </div>

            {/* Articles List */}
            {articles.data.length === 0 ? (
                <EmptyState
                    title="Belum Ada Artikel"
                    description="Tulis artikel pertama Anda untuk berbagi cerita atau promosi usaha."
                    action={
                        <Link href={route('umkm.articles.create')} className="btn-primary">
                            Tulis Artikel Pertama
                        </Link>
                    }
                />
            ) : (
                <div className="space-y-4">
                    {articles.data.map((article) => {
                        const imageUrl = article.featured_image?.url || 
                            (article.featured_image?.file_path ? `/storage/${article.featured_image.file_path}` : null);
                        const statusInfo = statusLabels[article.status];
                        
                        return (
                            <div key={article.id} className="card p-4 flex gap-4">
                                {/* Thumbnail */}
                                <div className="w-24 h-24 bg-surface-hover rounded-lg flex-shrink-0 overflow-hidden">
                                    {imageUrl ? (
                                        <img src={imageUrl} alt={article.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <svg className="w-8 h-8 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-0">
                                            <h3 className="font-medium text-foreground truncate">{article.title}</h3>
                                            {article.excerpt && (
                                                <p className="text-sm text-muted mt-1 line-clamp-2">{article.excerpt}</p>
                                            )}
                                        </div>
                                        <span className={`flex-shrink-0 px-2 py-1 rounded-full text-xs font-medium bg-${statusInfo.color}/10 text-${statusInfo.color}`}>
                                            {statusInfo.label}
                                        </span>
                                    </div>

                                    {/* Rejection Notes */}
                                    {article.status === 'rejected' && article.rejection_notes && (
                                        <div className="mt-2 p-2 bg-error/5 border border-error/10 rounded text-xs text-error">
                                            <strong>Alasan penolakan:</strong> {article.rejection_notes}
                                        </div>
                                    )}

                                    {/* Meta & Actions */}
                                    <div className="mt-3 flex items-center justify-between">
                                        <span className="text-xs text-muted">
                                            {new Date(article.created_at).toLocaleDateString('id-ID', {
                                                day: 'numeric', month: 'short', year: 'numeric'
                                            })}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            {article.status !== 'approved' && (
                                                <Link 
                                                    href={route('umkm.articles.edit', article.id)}
                                                    className="text-sm text-primary hover:underline"
                                                >
                                                    Edit
                                                </Link>
                                            )}
                                            <Link 
                                                href={route('umkm.articles.show', article.id)}
                                                className="text-sm text-muted hover:text-foreground"
                                            >
                                                Lihat
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Pagination */}
            {articles.last_page > 1 && (
                <div className="mt-6 flex justify-center gap-2">
                    {articles.links.map((link: any, i: number) => (
                        <Link
                            key={i}
                            href={link.url || '#'}
                            className={`px-3 py-2 rounded ${
                                link.active 
                                    ? 'bg-primary text-white' 
                                    : 'bg-surface hover:bg-surface-hover text-foreground'
                            } ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            )}
        </UmkmLayout>
    );
}
