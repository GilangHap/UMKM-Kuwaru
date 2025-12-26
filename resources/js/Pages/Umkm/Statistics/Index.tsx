import UmkmLayout from '@/Layouts/UmkmLayout';
import { PageProps } from '@/types';

interface Props extends PageProps {
    stats: {
        total_page_views: number;
        total_marketplace_clicks: number;
        total_products: number;
        total_articles: number;
        articles_published: number;
    };
    pageViewsByDay: Array<{ date: string; views: number }>;
    topArticles: Array<{ id: string; title: string; views_count: number; status: string }>;
    marketplaceBreakdown: Array<{ platform: string; clicks: number }>;
    recentViews: Array<{ page_type: string; page_id: string; viewed_at: string; ip_address: string }>;
    days: number;
}

export default function Index({ stats, pageViewsByDay, topArticles, marketplaceBreakdown, days }: Props) {
    return (
        <UmkmLayout
            title="Statistik"
            pageTitle="Statistik UMKM"
            breadcrumbs={[
                { label: 'Dashboard', href: route('umkm.dashboard') },
                { label: 'Statistik' },
            ]}
        >
            {/* Period Info */}
            <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-muted">
                    Data {days} hari terakhir
                </p>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="card p-5">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-foreground">{stats.total_page_views.toLocaleString()}</p>
                            <p className="text-sm text-muted">Kunjungan</p>
                        </div>
                    </div>
                </div>

                <div className="card p-5">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                            <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-foreground">{stats.total_marketplace_clicks.toLocaleString()}</p>
                            <p className="text-sm text-muted">Klik Marketplace</p>
                        </div>
                    </div>
                </div>

                <div className="card p-5">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center">
                            <svg className="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-foreground">{stats.total_products}</p>
                            <p className="text-sm text-muted">Total Produk</p>
                        </div>
                    </div>
                </div>

                <div className="card p-5">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                            <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-foreground">{stats.articles_published}</p>
                            <p className="text-sm text-muted">Artikel Terbit</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Page Views Chart */}
                <div className="card p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-4">
                        Kunjungan Harian
                    </h2>
                    {pageViewsByDay.length > 0 ? (
                        <div className="h-48 flex items-end gap-1">
                            {pageViewsByDay.slice(-14).map((day, index) => {
                                const maxViews = Math.max(...pageViewsByDay.map(d => d.views));
                                const height = maxViews > 0 ? (day.views / maxViews) * 100 : 0;
                                return (
                                    <div key={index} className="flex-1 flex flex-col items-center gap-1">
                                        <div 
                                            className="w-full bg-primary rounded-t transition-all hover:bg-primary/80"
                                            style={{ height: `${Math.max(height, 5)}%` }}
                                            title={`${day.date}: ${day.views} kunjungan`}
                                        />
                                        <span className="text-xs text-muted">
                                            {new Date(day.date).getDate()}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="h-48 flex items-center justify-center text-muted">
                            Belum ada data kunjungan
                        </div>
                    )}
                </div>

                {/* Marketplace Clicks */}
                <div className="card p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-4">
                        Klik Marketplace
                    </h2>
                    {marketplaceBreakdown.length > 0 ? (
                        <div className="space-y-4">
                            {marketplaceBreakdown.map((item, index) => {
                                const total = marketplaceBreakdown.reduce((sum, m) => sum + m.clicks, 0);
                                const percentage = total > 0 ? (item.clicks / total) * 100 : 0;
                                const colors = ['bg-orange-500', 'bg-green-500', 'bg-blue-500', 'bg-purple-500'];
                                return (
                                    <div key={index}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="font-medium text-foreground capitalize">{item.platform}</span>
                                            <span className="text-muted">{item.clicks} klik</span>
                                        </div>
                                        <div className="h-2 bg-surface-hover rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full ${colors[index % colors.length]} rounded-full`}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="h-32 flex items-center justify-center text-muted">
                            Belum ada data klik marketplace
                        </div>
                    )}
                </div>

                {/* Top Articles */}
                <div className="card p-6 lg:col-span-2">
                    <h2 className="text-lg font-semibold text-foreground mb-4">
                        Artikel Terpopuler
                    </h2>
                    {topArticles.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="text-left py-2 text-muted font-medium">#</th>
                                        <th className="text-left py-2 text-muted font-medium">Judul Artikel</th>
                                        <th className="text-right py-2 text-muted font-medium">Views</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topArticles.map((article, index) => (
                                        <tr key={article.id} className="border-b border-border/50">
                                            <td className="py-3 text-muted">{index + 1}</td>
                                            <td className="py-3 text-foreground">{article.title}</td>
                                            <td className="py-3 text-right font-medium text-primary">
                                                {article.views_count.toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="py-8 text-center text-muted">
                            Belum ada artikel dengan views
                        </div>
                    )}
                </div>
            </div>

            {/* Tips */}
            <div className="mt-8 p-4 bg-primary/5 border border-primary/10 rounded-lg">
                <h3 className="font-medium text-foreground mb-2">💡 Tips Meningkatkan Kunjungan</h3>
                <ul className="text-sm text-muted space-y-1">
                    <li>• Tambahkan produk baru secara berkala</li>
                    <li>• Tulis artikel yang menarik dan bermanfaat</li>
                    <li>• Pastikan info WhatsApp selalu aktif</li>
                    <li>• Bagikan link UMKM Anda di media sosial</li>
                </ul>
            </div>
        </UmkmLayout>
    );
}
