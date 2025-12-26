import AdminLayout from '@/Layouts/AdminLayout';
import StatCard from '@/Components/StatCard';
import { PageProps } from '@/types';

interface Props extends PageProps {
    umkmStats: {
        total: number;
        active: number;
        inactive: number;
        suspended: number;
        featured: number;
    };
    articleStats: {
        total: number;
        published: number;
        pending: number;
        rejected: number;
    };
    topUmkm: { id: number; name: string; slug: string }[];
    topArticles: { id: number; title: string; slug: string; umkm_id: number; views_count: number }[];
    recentUmkm: any[];
    recentArticles: any[];
}

export default function Index({ 
    umkmStats, 
    articleStats, 
    topUmkm, 
    topArticles, 
    recentUmkm, 
    recentArticles 
}: Props) {
    return (
        <AdminLayout
            title="Statistik"
            pageTitle="Statistik & Insight"
            breadcrumbs={[
                { label: 'Dashboard', href: route('admin.dashboard') },
                { label: 'Statistik' },
            ]}
        >
            {/* UMKM Stats */}
            <div className="mb-8">
                <h2 className="text-lg font-semibold text-foreground mb-4">Statistik UMKM</h2>
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    <StatCard
                        title="Total UMKM"
                        value={umkmStats.total}
                        icon={
                            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        }
                    />
                    <StatCard
                        title="Aktif"
                        value={umkmStats.active}
                        icon={
                            <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                        iconBg="bg-success/10"
                    />
                    <StatCard
                        title="Tidak Aktif"
                        value={umkmStats.inactive}
                        icon={
                            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                        iconBg="bg-gray-100"
                    />
                    <StatCard
                        title="Ditangguhkan"
                        value={umkmStats.suspended}
                        icon={
                            <svg className="w-6 h-6 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                        }
                        iconBg="bg-error/10"
                    />
                    <StatCard
                        title="Unggulan"
                        value={umkmStats.featured}
                        icon={
                            <svg className="w-6 h-6 text-warning" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        }
                        iconBg="bg-warning/10"
                    />
                </div>
            </div>

            {/* Article Stats */}
            <div className="mb-8">
                <h2 className="text-lg font-semibold text-foreground mb-4">Statistik Artikel</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        title="Total Artikel"
                        value={articleStats.total}
                        icon={
                            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        }
                    />
                    <StatCard
                        title="Dipublikasi"
                        value={articleStats.published}
                        icon={
                            <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        }
                        iconBg="bg-success/10"
                    />
                    <StatCard
                        title="Menunggu Review"
                        value={articleStats.pending}
                        icon={
                            <svg className="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                        iconBg="bg-warning/10"
                    />
                    <StatCard
                        title="Ditolak"
                        value={articleStats.rejected}
                        icon={
                            <svg className="w-6 h-6 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        }
                        iconBg="bg-error/10"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top UMKM */}
                <div className="card">
                    <div className="p-4 border-b border-border">
                        <h3 className="font-semibold text-foreground">UMKM Terbaru</h3>
                    </div>
                    <div className="divide-y divide-border">
                        {topUmkm.length > 0 ? (
                            topUmkm.map((umkm, index) => (
                                <div key={umkm.id} className="p-4 flex items-center gap-3">
                                    <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                                        {index + 1}
                                    </span>
                                    <span className="text-sm font-medium text-foreground">{umkm.name}</span>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-muted text-sm">
                                Belum ada data UMKM.
                            </div>
                        )}
                    </div>
                </div>

                {/* Top Articles */}
                <div className="card">
                    <div className="p-4 border-b border-border">
                        <h3 className="font-semibold text-foreground">Artikel Terpopuler</h3>
                    </div>
                    <div className="divide-y divide-border">
                        {topArticles.length > 0 ? (
                            topArticles.map((article, index) => (
                                <div key={article.id} className="p-4 flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary flex-shrink-0">
                                            {index + 1}
                                        </span>
                                        <span className="text-sm font-medium text-foreground truncate">{article.title}</span>
                                    </div>
                                    <span className="text-xs text-muted flex-shrink-0">
                                        {article.views_count} views
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-muted text-sm">
                                Belum ada data artikel.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
