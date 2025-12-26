import UmkmLayout from '@/Layouts/UmkmLayout';
import { PageProps, Umkm, UmkmDashboardStats, UmkmInsights, Article, Product } from '@/types';

interface Props extends PageProps {
    umkm: Umkm;
    stats: UmkmDashboardStats;
    insights: UmkmInsights;
    recentArticles: Article[];
    featuredProducts: Product[];
}

export default function Dashboard({ umkm, stats, insights, recentArticles, featuredProducts }: Props) {
    const statusConfig = {
        active: { text: 'Aktif', class: 'badge-success' },
        inactive: { text: 'Tidak Aktif', class: 'bg-gray-100 text-gray-800' },
        suspended: { text: 'Ditangguhkan', class: 'badge-error' },
    };

    const articleStatusConfig = {
        draft: { text: 'Draft', class: 'bg-gray-100 text-gray-800' },
        pending: { text: 'Menunggu Review', class: 'badge-warning' },
        approved: { text: 'Disetujui', class: 'badge-success' },
        rejected: { text: 'Ditolak', class: 'badge-error' },
    };

    return (
        <UmkmLayout 
            title="Dashboard UMKM"
            pageTitle="Dashboard"
            breadcrumbs={[
                { label: 'Dashboard' }
            ]}
        >
            {/* UMKM Info Card */}
            <div className="card p-6 mb-8">
                <div className="flex items-start gap-4">
                    {umkm.logo ? (
                        <img 
                            src={umkm.logo.url || `/storage/${umkm.logo.file_path}`}
                            alt={umkm.name}
                            className="h-16 w-16 rounded-xl object-cover"
                        />
                    ) : (
                        <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center">
                            <span className="text-2xl font-bold text-primary">
                                {umkm.name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-xl font-semibold text-foreground truncate">{umkm.name}</h2>
                            <span className={`badge ${statusConfig[umkm.status].class}`}>
                                {statusConfig[umkm.status].text}
                            </span>
                        </div>
                        <p className="text-sm text-muted">{umkm.category?.name}</p>
                        <p className="text-sm text-muted mt-1 line-clamp-2">{umkm.address}</p>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-8">
                {/* Artikel */}
                <div className="card p-5">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-info/10 rounded-lg">
                            <svg className="w-5 h-5 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{stats.total_articles_published}</p>
                    <p className="text-xs text-muted">dari {stats.total_articles} artikel</p>
                </div>

                {/* Produk */}
                <div className="card p-5">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{stats.total_products}</p>
                    <p className="text-xs text-muted">{stats.total_products_featured} unggulan</p>
                </div>

                {/* Page Views */}
                <div className="card p-5">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-success/10 rounded-lg">
                            <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{insights.page_views_30d}</p>
                    <p className="text-xs text-muted">kunjungan 30 hari</p>
                </div>

                {/* Marketplace Clicks */}
                <div className="card p-5">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-warning/10 rounded-lg">
                            <svg className="w-5 h-5 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{insights.marketplace_clicks_30d}</p>
                    <p className="text-xs text-muted">klik marketplace</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Recent Articles */}
                <div className="card">
                    <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                        <h3 className="font-semibold text-foreground">Artikel Terbaru</h3>
                        <a href="#" className="text-sm text-primary hover:underline">Lihat Semua</a>
                    </div>
                    <ul className="divide-y divide-border">
                        {recentArticles.length === 0 ? (
                            <li className="px-6 py-8 text-center text-muted">
                                <svg className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p className="text-sm mb-2">Belum ada artikel.</p>
                                <a href="#" className="text-sm text-primary hover:underline">Buat artikel pertama</a>
                            </li>
                        ) : (
                            recentArticles.map((article) => (
                                <li key={article.id} className="px-6 py-4 hover:bg-surface-hover transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="min-w-0 flex-1">
                                            <p className="font-medium text-foreground truncate">{article.title}</p>
                                            <p className="text-xs text-muted">
                                                {new Date(article.created_at).toLocaleDateString('id-ID')}
                                            </p>
                                        </div>
                                        <span className={`badge ml-4 ${articleStatusConfig[article.status].class}`}>
                                            {articleStatusConfig[article.status].text}
                                        </span>
                                    </div>
                                </li>
                            ))
                        )}
                    </ul>
                </div>

                {/* Featured Products */}
                <div className="card">
                    <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                        <h3 className="font-semibold text-foreground">Produk Unggulan</h3>
                        <a href="#" className="text-sm text-primary hover:underline">Lihat Semua</a>
                    </div>
                    <ul className="divide-y divide-border">
                        {featuredProducts.length === 0 ? (
                            <li className="px-6 py-8 text-center text-muted">
                                <svg className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                                <p className="text-sm mb-2">Belum ada produk unggulan.</p>
                                <a href="#" className="text-sm text-primary hover:underline">Tambah produk</a>
                            </li>
                        ) : (
                            featuredProducts.map((product) => (
                                <li key={product.id} className="px-6 py-4 hover:bg-surface-hover transition-colors">
                                    <div className="flex items-center gap-4">
                                        {product.media && product.media[0] ? (
                                            <img 
                                                src={product.media[0].url || `/storage/${product.media[0].file_path}`}
                                                alt={product.name}
                                                className="h-12 w-12 rounded-lg object-cover"
                                            />
                                        ) : (
                                            <div className="h-12 w-12 rounded-lg bg-surface-hover flex items-center justify-center">
                                                <svg className="w-6 h-6 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}
                                        <div className="min-w-0 flex-1">
                                            <p className="font-medium text-foreground truncate">{product.name}</p>
                                            {product.price_range && (
                                                <p className="text-sm text-muted">{product.price_range}</p>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            </div>
        </UmkmLayout>
    );
}
