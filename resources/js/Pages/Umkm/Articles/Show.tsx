import { Link } from '@inertiajs/react';
import UmkmLayout from '@/Layouts/UmkmLayout';
import { PageProps } from '@/types';

interface Article {
    id: string;
    title: string;
    content: string;
    excerpt?: string;
    status: string;
    published_at?: string;
    created_at: string;
    featured_image?: { id: string; url?: string; file_path?: string };
}

interface Props extends PageProps {
    article: Article;
}

export default function Show({ article }: Props) {
    const imageUrl = article.featured_image?.url || 
        (article.featured_image?.file_path ? `/storage/${article.featured_image.file_path}` : null);

    return (
        <UmkmLayout
            title={article.title}
            pageTitle="Detail Artikel"
            breadcrumbs={[
                { label: 'Dashboard', href: route('umkm.dashboard') },
                { label: 'Artikel', href: route('umkm.articles.index') },
                { label: article.title },
            ]}
            actions={
                article.status !== 'approved' && (
                    <Link href={route('umkm.articles.edit', article.id)} className="btn-secondary">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                    </Link>
                )
            }
        >
            <div className="max-w-3xl">
                {/* Status */}
                <div className="mb-6">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        article.status === 'approved' ? 'bg-success/10 text-success' :
                        article.status === 'pending' ? 'bg-warning/10 text-warning' :
                        article.status === 'rejected' ? 'bg-error/10 text-error' :
                        'bg-muted/10 text-muted'
                    }`}>
                        {article.status === 'approved' ? 'Disetujui' :
                         article.status === 'pending' ? 'Menunggu Review' :
                         article.status === 'rejected' ? 'Ditolak' : 'Draft'}
                    </span>
                </div>

                {/* Featured Image */}
                {imageUrl && (
                    <div className="mb-6 rounded-lg overflow-hidden">
                        <img 
                            src={imageUrl} 
                            alt={article.title}
                            className="w-full h-auto"
                        />
                    </div>
                )}

                {/* Title */}
                <h1 className="text-2xl font-bold text-foreground mb-4">
                    {article.title}
                </h1>

                {/* Meta */}
                <div className="mb-6 text-sm text-muted">
                    Dibuat: {new Date(article.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'long', year: 'numeric'
                    })}
                </div>

                {/* Content */}
                <div 
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                />
            </div>
        </UmkmLayout>
    );
}
