import { Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import StatCard from '@/Components/StatCard';
import StatusBadge from '@/Components/StatusBadge';
import { PageProps } from '@/types';

interface Props extends PageProps {
    stats: {
        total_umkm: number;
        total_umkm_active: number;
        total_articles: number;
        total_articles_pending: number;
        total_users: number;
        total_users_active: number;
    };
    pendingArticles: {
        id: number;
        umkm_id: number;
        title: string;
        slug: string;
        created_at: string;
        umkm?: { id: number; name: string; slug: string };
    }[];
    recentUmkms: {
        id: number;
        category_id: number;
        name: string;
        slug: string;
        status: string;
        created_at: string;
        category?: { id: number; name: string };
    }[];
}

export default function Dashboard({ stats, pendingArticles, recentUmkms }: Props) {
    return (
        <AdminLayout
            title="Dashboard Admin"
            pageTitle="Dashboard"
            breadcrumbs={[{ label: 'Dashboard' }]}
        >
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard
                    title="Total UMKM"
                    value={stats.total_umkm}
                    subtitle={`${stats.total_umkm_active} aktif`}
                    icon={
                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    }
                />
                <StatCard
                    title="UMKM Aktif"
                    value={stats.total_umkm_active}
                    icon={
                        <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                    iconBg="bg-success/10"
                />
                <StatCard
                    title="Artikel Pending"
                    value={stats.total_articles_pending}
                    subtitle="Menunggu review"
                    icon={
                        <svg className="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                    iconBg="bg-warning/10"
                />
                <StatCard
                    title="Total Artikel"
                    value={stats.total_articles}
                    icon={
                        <svg className="w-6 h-6 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    }
                    iconBg="bg-info/10"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pending Articles */}
                <div className="card">
                    <div className="p-4 border-b border-border flex items-center justify-between">
                        <h2 className="font-semibold text-foreground">Artikel Menunggu Review</h2>
                        <Link 
                            href={route('admin.articles.index')} 
                            className="text-sm text-primary hover:underline"
                        >
                            Lihat Semua
                        </Link>
                    </div>
                    <div className="divide-y divide-border">
                        {pendingArticles.length > 0 ? (
                            pendingArticles.map((article) => (
                                <Link 
                                    key={article.id} 
                                    href={route('admin.articles.show', article.id)}
                                    className="p-4 flex items-center justify-between hover:bg-surface-hover transition-colors block"
                                >
                                    <div className="min-w-0 flex-1">
                                        <p className="font-medium text-foreground truncate">{article.title}</p>
                                        <p className="text-xs text-muted">{article.umkm?.name || 'Unknown'}</p>
                                    </div>
                                    <StatusBadge status="pending" size="sm" />
                                </Link>
                            ))
                        ) : (
                            <div className="p-8 text-center">
                                <svg className="w-12 h-12 mx-auto text-muted-foreground/30 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-sm text-muted">Tidak ada artikel pending</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent UMKM */}
                <div className="card">
                    <div className="p-4 border-b border-border flex items-center justify-between">
                        <h2 className="font-semibold text-foreground">UMKM Terbaru</h2>
                        <Link 
                            href={route('admin.umkm.index')} 
                            className="text-sm text-primary hover:underline"
                        >
                            Lihat Semua
                        </Link>
                    </div>
                    <div className="divide-y divide-border">
                        {recentUmkms.length > 0 ? (
                            recentUmkms.map((umkm) => (
                                <Link 
                                    key={umkm.id} 
                                    href={route('admin.umkm.show', umkm.id)}
                                    className="p-4 flex items-center justify-between hover:bg-surface-hover transition-colors block"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <span className="text-primary font-semibold text-sm">
                                                {umkm.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-medium text-foreground truncate">{umkm.name}</p>
                                            <p className="text-xs text-muted">{umkm.category?.name || 'Uncategorized'}</p>
                                        </div>
                                    </div>
                                    <StatusBadge status={umkm.status as any} size="sm" />
                                </Link>
                            ))
                        ) : (
                            <div className="p-8 text-center">
                                <svg className="w-12 h-12 mx-auto text-muted-foreground/30 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                <p className="text-sm text-muted">Belum ada UMKM</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8">
                <h2 className="font-semibold text-foreground mb-4">Aksi Cepat</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link 
                        href={route('admin.umkm.create')}
                        className="card p-4 flex items-center gap-3 hover:shadow-md transition-shadow"
                    >
                        <div className="p-2 rounded-lg bg-primary/10">
                            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </div>
                        <span className="font-medium text-foreground text-sm">Tambah UMKM</span>
                    </Link>
                    <Link 
                        href={route('admin.categories.index')}
                        className="card p-4 flex items-center gap-3 hover:shadow-md transition-shadow"
                    >
                        <div className="p-2 rounded-lg bg-info/10">
                            <svg className="w-5 h-5 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                        </div>
                        <span className="font-medium text-foreground text-sm">Kelola Kategori</span>
                    </Link>
                    <Link 
                        href={route('admin.articles.index', { status: 'pending' })}
                        className="card p-4 flex items-center gap-3 hover:shadow-md transition-shadow"
                    >
                        <div className="p-2 rounded-lg bg-warning/10">
                            <svg className="w-5 h-5 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <span className="font-medium text-foreground text-sm">Review Artikel</span>
                    </Link>
                    <Link 
                        href={route('admin.settings.index')}
                        className="card p-4 flex items-center gap-3 hover:shadow-md transition-shadow"
                    >
                        <div className="p-2 rounded-lg bg-surface-hover">
                            <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <span className="font-medium text-foreground text-sm">Pengaturan</span>
                    </Link>
                </div>
            </div>
        </AdminLayout>
    );
}
