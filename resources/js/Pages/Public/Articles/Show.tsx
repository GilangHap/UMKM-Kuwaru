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
    return (
        <PublicLayout
            title={`${article.title} - UMKM Desa Kuwaru`}
            description={article.excerpt || article.title}
        >
            {/* Article Header */}
            <article className="bg-white">
                {/* Featured Image */}
                {article.featured_image && (
                    <div className="w-full max-h-[500px] overflow-hidden">
                        <img 
                            src={article.featured_image} 
                            alt={article.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                    {/* Meta */}
                    <div className="flex items-center gap-4 mb-6">
                        {article.umkm && (
                            <Link 
                                href={`/umkm/${article.umkm.slug}`}
                                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                            >
                                {article.umkm.logo_url ? (
                                    <img 
                                        src={article.umkm.logo_url} 
                                        alt={article.umkm.name}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                        <span className="text-green-600 font-bold">
                                            {article.umkm.name.charAt(0)}
                                        </span>
                                    </div>
                                )}
                                <div>
                                    <p className="font-medium text-gray-900">{article.umkm.name}</p>
                                    {article.published_at && (
                                        <p className="text-sm text-gray-500">{article.published_at}</p>
                                    )}
                                </div>
                            </Link>
                        )}
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                        {article.title}
                    </h1>

                    {/* Content */}
                    <div 
                        className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-green-600 prose-img:rounded-xl"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />

                    {/* Share */}
                    <div className="mt-12 pt-8 border-t border-gray-200">
                        <p className="text-sm font-medium text-gray-500 mb-4">Bagikan artikel ini:</p>
                        <div className="flex gap-3">
                            <a
                                href={`https://wa.me/?text=${encodeURIComponent(article.title + ' - ' + window.location.href)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                </svg>
                            </a>
                            <a
                                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                </svg>
                            </a>
                            <a
                                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(window.location.href)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </article>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
                <section className="py-12 md:py-16 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8">Artikel Lainnya</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedArticles.map((related) => (
                                <Link
                                    key={related.id}
                                    href={`/artikel/${related.slug}`}
                                    className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300"
                                >
                                    {related.featured_image ? (
                                        <div className="aspect-video overflow-hidden">
                                            <img 
                                                src={related.featured_image} 
                                                alt={related.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                    ) : (
                                        <div className="aspect-video bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                                            <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                    )}
                                    <div className="p-5">
                                        {related.published_at && (
                                            <p className="text-sm text-gray-500 mb-2">{related.published_at}</p>
                                        )}
                                        <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-green-700 transition-colors">
                                            {related.title}
                                        </h3>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Back Link */}
            <section className="py-8 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <Link
                        href="/artikel"
                        className="inline-flex items-center text-gray-600 hover:text-gray-900 font-medium"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Kembali ke Daftar Artikel
                    </Link>
                </div>
            </section>
        </PublicLayout>
    );
}
