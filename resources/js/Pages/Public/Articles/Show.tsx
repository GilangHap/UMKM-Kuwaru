import PublicLayout from '@/Layouts/PublicLayout';
import { Link } from '@inertiajs/react';

interface RelatedArticle {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    published_at?: string;
    featured_image?: string;
}

interface Article {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    published_at?: string;
    featured_image?: string;
    umkm?: {
        name: string;
        slug: string;
        logo_url?: string;
    };
}

interface Props {
    article: Article;
    relatedArticles: RelatedArticle[];
}

export default function Show({ article, relatedArticles }: Props) {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    
    return (
        <PublicLayout
            title={`${article.title} - UMKM Desa Kuwaru`}
            description={article.excerpt || article.title}
        >
            {/* ============================================= */}
            {/* HERO HEADER SECTION */}
            {/* ============================================= */}
            <section className="relative min-h-[40vh] md:min-h-[50vh] flex items-end overflow-hidden">
                {/* Background */}
                {article.featured_image ? (
                    <>
                        <div 
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${article.featured_image})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/40" />
                    </>
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-orange-950 to-slate-900">
                        {/* Floating Orbs for non-image background */}
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute top-20 left-20 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl animate-pulse" />
                            <div className="absolute bottom-20 right-20 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                        </div>
                    </div>
                )}
                
                {/* Content */}
                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 w-full">
                    {/* UMKM Badge */}
                    {article.umkm && (
                        <Link 
                            href={`/umkm/${article.umkm.slug}`}
                            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors mb-6"
                        >
                            {article.umkm.logo_url ? (
                                <img 
                                    src={article.umkm.logo_url} 
                                    alt={article.umkm.name}
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">
                                        {article.umkm.name.charAt(0)}
                                    </span>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <span className="text-white font-medium">{article.umkm.name}</span>
                                {article.published_at && (
                                    <>
                                        <span className="text-white/50">•</span>
                                        <span className="text-white/70 text-sm">{article.published_at}</span>
                                    </>
                                )}
                            </div>
                        </Link>
                    )}
                    
                    {/* Title */}
                    <h1 
                        className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight"
                        style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                        {article.title}
                    </h1>
                </div>
            </section>

            {/* ============================================= */}
            {/* ARTICLE CONTENT SECTION */}
            {/* ============================================= */}
            <section className="relative py-12 md:py-16 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Article Content */}
                    <div 
                        className="prose prose-lg max-w-none 
                            prose-headings:text-white prose-headings:font-bold
                            prose-p:text-slate-300 prose-p:leading-relaxed
                            prose-a:text-orange-400 prose-a:no-underline hover:prose-a:underline
                            prose-strong:text-white
                            prose-img:rounded-2xl prose-img:shadow-xl
                            prose-blockquote:border-l-orange-500 prose-blockquote:bg-white/5 prose-blockquote:rounded-r-xl prose-blockquote:py-2 prose-blockquote:text-slate-300
                            prose-code:text-orange-400 prose-code:bg-white/10 prose-code:px-2 prose-code:py-0.5 prose-code:rounded
                            prose-pre:bg-slate-800/50 prose-pre:border prose-pre:border-white/10
                            prose-ul:text-slate-300 prose-ol:text-slate-300
                            prose-li:marker:text-orange-400"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />

                    {/* Share Section */}
                    <div className="mt-16 pt-8 border-t border-white/10">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                            <div>
                                <p className="text-white font-medium mb-2">Bagikan artikel ini</p>
                                <p className="text-slate-400 text-sm">Sebarkan informasi ini kepada teman-teman Anda</p>
                            </div>
                            <div className="flex gap-3">
                                <a
                                    href={`https://wa.me/?text=${encodeURIComponent(article.title + ' - ' + shareUrl)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors shadow-lg shadow-green-500/25"
                                    title="Share to WhatsApp"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                    </svg>
                                </a>
                                <a
                                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/25"
                                    title="Share to Facebook"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                    </svg>
                                </a>
                                <a
                                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(shareUrl)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors shadow-lg shadow-slate-700/25"
                                    title="Share to X"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                    </svg>
                                </a>
                                <button
                                    onClick={() => navigator.clipboard.writeText(shareUrl)}
                                    className="p-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors border border-white/20"
                                    title="Copy Link"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================= */}
            {/* RELATED ARTICLES SECTION */}
            {/* ============================================= */}
            {relatedArticles.length > 0 && (
                <section className="relative py-16 md:py-20 bg-gradient-to-b from-slate-800 via-slate-900 to-slate-900 overflow-hidden">
                    {/* Background Decorations */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
                    </div>
                    
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Section Header */}
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-orange-500/20 backdrop-blur-sm border border-orange-500/30 mb-6">
                                <span className="text-xl">📰</span>
                                <span className="text-orange-300 text-sm font-semibold tracking-wide uppercase">Artikel Lainnya</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white">
                                Baca Juga Artikel <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">Terkait</span>
                            </h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedArticles.map((related, index) => (
                                <Link
                                    key={related.id}
                                    href={`/artikel/${related.slug}`}
                                    className="group relative"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className="relative h-full rounded-3xl overflow-hidden bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-md border border-white/10 hover:border-orange-400/50 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/10">
                                        {/* Image */}
                                        <div className="relative h-44 overflow-hidden">
                                            {related.featured_image ? (
                                                <img 
                                                    src={related.featured_image} 
                                                    alt={related.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-orange-500/20 via-amber-500/10 to-yellow-500/20 flex items-center justify-center">
                                                    <svg className="w-12 h-12 text-orange-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                                            
                                            {/* Date Badge */}
                                            {related.published_at && (
                                                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-sm text-white text-xs font-medium">
                                                    {related.published_at}
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="p-5">
                                            <h3 className="font-bold text-white line-clamp-2 group-hover:text-orange-300 transition-colors">
                                                {related.title}
                                            </h3>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ============================================= */}
            {/* BACK LINK SECTION */}
            {/* ============================================= */}
            <section className="py-10 bg-slate-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <Link
                        href="/artikel"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 hover:border-orange-500/30 transition-all"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Kembali ke Daftar Artikel
                    </Link>
                </div>
            </section>
        </PublicLayout>
    );
}
