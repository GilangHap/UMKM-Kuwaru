import { Link } from '@inertiajs/react';
import UmkmLayout from '@/Layouts/UmkmLayout';
import { PageProps } from '@/types';
import StatusBadge from '@/Components/StatusBadge';
import EmptyState from '@/Components/EmptyState';

interface Product {
    id: string;
    name: string;
    slug: string;
    price_range?: string;
    is_featured: boolean;
    created_at: string;
    media?: Array<{ id: string; url?: string; file_path?: string }>;
}

interface Props extends PageProps {
    products: {
        data: Product[];
        links: any;
        current_page: number;
        last_page: number;
    };
    stats: {
        total: number;
        featured: number;
    };
    flash?: { success?: string; error?: string };
}

export default function Index({ products, stats, flash }: Props) {
    return (
        <UmkmLayout
            title="Produk"
            pageTitle="Produk Saya"
            breadcrumbs={[
                { label: 'Dashboard', href: route('umkm.dashboard') },
                { label: 'Produk' },
            ]}
            actions={
                <Link href={route('umkm.products.create')} className="btn-primary">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Tambah Produk
                </Link>
            }
        >
            {/* Flash Messages */}
            {flash?.success && (
                <div className="mb-6 p-4 bg-success/10 border border-success/20 rounded-lg text-success text-sm">
                    ✓ {flash.success}
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="card p-4">
                    <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                    <p className="text-sm text-muted">Total Produk</p>
                </div>
                <div className="card p-4">
                    <p className="text-2xl font-bold text-primary">{stats.featured}</p>
                    <p className="text-sm text-muted">Produk Unggulan</p>
                </div>
            </div>

            {/* Products Grid */}
            {products.data.length === 0 ? (
                <EmptyState
                    title="Belum Ada Produk"
                    description="Tambahkan produk pertama Anda untuk mulai mempromosikan usaha."
                    action={
                        <Link href={route('umkm.products.create')} className="btn-primary">
                            Tambah Produk Pertama
                        </Link>
                    }
                />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {products.data.map((product) => {
                        const imageUrl = product.media?.[0]?.url || 
                            (product.media?.[0]?.file_path ? `/storage/${product.media[0].file_path}` : null);
                        
                        return (
                            <div key={product.id} className="card overflow-hidden group">
                                {/* Image */}
                                <div className="aspect-square bg-surface-hover relative">
                                    {imageUrl ? (
                                        <img 
                                            src={imageUrl} 
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <svg className="w-12 h-12 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}
                                    
                                    {/* Featured Badge */}
                                    {product.is_featured && (
                                        <span className="absolute top-2 right-2 px-2 py-1 bg-primary text-white text-xs font-medium rounded">
                                            Unggulan
                                        </span>
                                    )}

                                    {/* Hover Actions */}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <Link 
                                            href={route('umkm.products.edit', product.id)}
                                            className="p-2 bg-white rounded-lg hover:bg-gray-100"
                                        >
                                            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="p-4">
                                    <h3 className="font-medium text-foreground truncate">{product.name}</h3>
                                    {product.price_range && (
                                        <p className="text-sm text-primary font-medium mt-1">{product.price_range}</p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Pagination */}
            {products.last_page > 1 && (
                <div className="mt-6 flex justify-center gap-2">
                    {products.links.map((link: any, index: number) => (
                        <Link
                            key={index}
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
