import { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import DataTable from '@/Components/DataTable';
import StatusBadge from '@/Components/StatusBadge';
import { PageProps } from '@/types';

interface ArticleWithUmkm {
    id: string;
    umkm_id: string;
    title: string;
    slug: string;
    excerpt?: string;
    content: string;
    status: 'draft' | 'pending' | 'approved' | 'rejected';
    views_count?: number;
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
}

interface Props extends PageProps {
    articles: {
        data: ArticleWithUmkm[];
        links: any[];
        from: number;
        to: number;
        total: number;
    };
    filters: {
        search?: string;
        status?: string;
    };
    statusOptions: { value: string; label: string }[];
}

export default function Index({ articles, filters, statusOptions }: Props) {
    const { flash } = usePage().props as any;
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('admin.articles.index'), { search, status: statusFilter }, { preserveState: true });
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

    const columns = [
        {
            key: 'title',
            label: 'Artikel',
            sortable: true,
            render: (article: ArticleWithUmkm) => (
                <div>
                    <p className="font-medium text-foreground line-clamp-1">{article.title}</p>
                    <p className="text-xs text-muted">{article.umkm?.name || '-'}</p>
                </div>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            render: (article: ArticleWithUmkm) => (
                <StatusBadge status={getStatusType(article.status)} />
            ),
        },
        {
            key: 'created_at',
            label: 'Tanggal',
            sortable: true,
            render: (article: ArticleWithUmkm) => (
                <span className="text-sm text-muted">
                    {new Date(article.created_at).toLocaleDateString('id-ID')}
                </span>
            ),
        },
        {
            key: 'views_count',
            label: 'Views',
            className: 'text-center',
            render: (article: ArticleWithUmkm) => (
                <span className="text-sm">{article.views_count || 0}</span>
            ),
        },
        {
            key: 'actions',
            label: '',
            className: 'text-right',
            render: (article: ArticleWithUmkm) => (
                <div className="flex items-center justify-end gap-2">
                    <Link
                        href={route('admin.articles.show', article.id)}
                        className="p-2 rounded-lg hover:bg-surface-hover text-muted hover:text-foreground transition-colors"
                        title="Lihat"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    </Link>
                    <Link
                        href={route('admin.articles.edit', article.id)}
                        className="p-2 rounded-lg hover:bg-surface-hover text-muted hover:text-foreground transition-colors"
                        title="Edit"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </Link>
                    {article.status === 'pending' && (
                        <button
                            onClick={() => router.post(route('admin.articles.approve', article.id))}
                            className="p-2 rounded-lg hover:bg-green-50 text-muted hover:text-success transition-colors"
                            title="Setujui"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </button>
                    )}
                </div>
            ),
        },
    ];

    // Count pending articles
    const pendingCount = articles.data.filter(a => a.status === 'pending').length;

    return (
        <AdminLayout
            title="Manajemen Artikel"
            pageTitle="Artikel"
            breadcrumbs={[
                { label: 'Dashboard', href: route('admin.dashboard') },
                { label: 'Artikel' },
            ]}
            actions={
                <Link href={route('admin.articles.create')} className="btn-primary">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Buat Artikel
                </Link>
            }
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

            {/* Pending Alert */}
            {pendingCount > 0 && !filters.status && (
                <div className="mb-6 p-4 bg-warning/10 border border-warning/20 rounded-lg flex items-center gap-3">
                    <svg className="w-5 h-5 text-warning flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-sm text-warning">
                        Ada <strong>{pendingCount}</strong> artikel menunggu review.
                    </p>
                </div>
            )}

            {/* Filters */}
            <div className="card p-4 mb-6">
                <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4">
                    <input
                        type="text"
                        placeholder="Cari judul artikel..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input flex-1"
                    />
                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            router.get(route('admin.articles.index'), { search, status: e.target.value }, { preserveState: true });
                        }}
                        className="input lg:w-48"
                    >
                        <option value="">Semua Status</option>
                        {statusOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                    <button type="submit" className="btn-primary">
                        Cari
                    </button>
                </form>
            </div>

            {/* Table */}
            <DataTable
                columns={columns}
                data={articles.data}
                pagination={{
                    links: articles.links,
                    from: articles.from,
                    to: articles.to,
                    total: articles.total,
                }}
                emptyMessage="Belum ada artikel."
            />
        </AdminLayout>
    );
}
