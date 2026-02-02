import { Link, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import StatusBadge from '@/Components/StatusBadge';
import { PageProps, Umkm, Category } from '@/types';

interface GalleryItem {
    id: string;
    file_path: string;
    alt_text?: string;
}

interface Product {
    id: string;
    name: string;
    slug: string;
    price_range?: string;
    description?: string;
    is_featured: boolean;
    image?: {
        id: string;
        file_path: string;
    };
}

interface ExtendedUmkm extends Omit<Umkm, 'category' | 'admin' | 'logo' | 'theme'> {
    tagline?: string;
    category?: Category;
    admin?: {
        id: string;
        name: string;
        email: string;
    };
    logo?: {
        id: string;
        file_path: string;
    };
    theme?: {
        id?: string;
        umkm_id?: string;
        primary_color?: string;
        secondary_color?: string;
        accent_color?: string;
    };
    gallery?: GalleryItem[];
    products?: Product[];
}

interface Stats {
    products: number;
    articles: number;
    gallery: number;
    total_views: number;
    monthly_views: number;
}

interface Props extends PageProps {
    umkm: ExtendedUmkm;
    stats: Stats;
}

export default function Show({ umkm, stats }: Props) {
    const { flash } = usePage().props as any;

    return (
        <AdminLayout
            title={`Detail UMKM - ${umkm.name}`}
            pageTitle="Detail UMKM"
            breadcrumbs={[
                { label: 'Dashboard', href: route('admin.dashboard') },
                { label: 'UMKM', href: route('admin.umkm.index') },
                { label: umkm.name },
            ]}
            actions={
                <div className="flex items-center gap-3">
                    <Link
                        href={route('admin.umkm.gallery', umkm.id)}
                        className="btn-outline flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Kelola Galeri
                    </Link>
                    <Link
                        href={route('admin.umkm.edit', umkm.id)}
                        className="btn-primary flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit UMKM
                    </Link>
                </div>
            }
        >
            {/* Flash Messages */}
            {flash?.success && (
                <div className="mb-6 p-4 bg-success/10 border border-success/20 rounded-lg text-success text-sm">
                    {flash.success}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info Card */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Profile Section */}
                    <div className="card p-6">
                        <div className="flex items-start gap-6">
                            {/* Logo */}
                            <div className="shrink-0">
                                {umkm.logo ? (
                                    <img
                                        src={`/storage/${umkm.logo.file_path}`}
                                        alt={umkm.name}
                                        className="w-24 h-24 rounded-xl object-cover border border-border"
                                    />
                                ) : (
                                    <div
                                        className="w-24 h-24 rounded-xl flex items-center justify-center text-3xl font-bold text-white"
                                        style={{
                                            background: umkm.theme?.primary_color
                                                ? `linear-gradient(135deg, ${umkm.theme.primary_color}, ${umkm.theme.secondary_color || umkm.theme.primary_color})`
                                                : 'linear-gradient(135deg, #10b981, #06b6d4)'
                                        }}
                                    >
                                        {umkm.name.charAt(0)}
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-2">
                                    <h2 className="text-2xl font-bold text-foreground truncate">
                                        {umkm.name}
                                    </h2>
                                    <StatusBadge status={umkm.status as any} />
                                    {umkm.is_featured && (
                                        <span className="px-2 py-1 bg-warning/10 text-warning text-xs font-medium rounded-full flex items-center gap-1">
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                            Unggulan
                                        </span>
                                    )}
                                </div>

                                {umkm.tagline && (
                                    <p className="text-muted mb-3">{umkm.tagline}</p>
                                )}

                                {umkm.category && (
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                        </svg>
                                        {umkm.category.name}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        {umkm.description && (
                            <div className="mt-6 pt-6 border-t border-border">
                                <h3 className="text-sm font-medium text-muted mb-2">Deskripsi</h3>
                                <p className="text-foreground whitespace-pre-line">{umkm.description}</p>
                            </div>
                        )}
                    </div>

                    {/* Contact Info */}
                    <div className="card p-6">
                        <h3 className="text-lg font-semibold text-foreground mb-4">Informasi Kontak</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {umkm.address && (
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted">Alamat</p>
                                        <p className="text-foreground">{umkm.address}</p>
                                    </div>
                                </div>
                            )}

                            {umkm.phone && (
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted">Telepon</p>
                                        <p className="text-foreground">{umkm.phone}</p>
                                    </div>
                                </div>
                            )}

                            {umkm.whatsapp && (
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                                        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted">WhatsApp</p>
                                        <p className="text-foreground">{umkm.whatsapp}</p>
                                    </div>
                                </div>
                            )}

                            {umkm.email && (
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted">Email</p>
                                        <p className="text-foreground">{umkm.email}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Gallery Preview */}
                    {umkm.gallery && umkm.gallery.length > 0 && (
                        <div className="card p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-foreground">Galeri Foto</h3>
                                <Link
                                    href={route('admin.umkm.gallery', umkm.id)}
                                    className="text-primary text-sm font-medium hover:underline"
                                >
                                    Lihat Semua →
                                </Link>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {umkm.gallery.slice(0, 8).map((item) => (
                                    <div
                                        key={item.id}
                                        className="aspect-square rounded-lg overflow-hidden bg-surface-hover"
                                    >
                                        <img
                                            src={`/storage/${item.file_path}`}
                                            alt={item.alt_text || 'Gallery image'}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Products Section */}
                    <div className="card p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-foreground">Produk</h3>
                            <Link
                                href={route('admin.umkm.products.create', umkm.id)}
                                className="btn-primary text-sm flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Tambah Produk
                            </Link>
                        </div>
                        
                        {umkm.products && umkm.products.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {umkm.products.map((product) => (
                                    <div
                                        key={product.id}
                                        className="group relative bg-surface-hover rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-200"
                                    >
                                        {/* Product Image */}
                                        <div className="aspect-video bg-surface relative overflow-hidden">
                                            {product.image ? (
                                                <img
                                                    src={`/storage/${product.image.file_path}`}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-primary/5">
                                                    <svg className="w-12 h-12 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                    </svg>
                                                </div>
                                            )}
                                            
                                            {/* Featured Badge */}
                                            {product.is_featured && (
                                                <div className="absolute top-2 left-2 px-2 py-1 bg-warning/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full flex items-center gap-1">
                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                    Unggulan
                                                </div>
                                            )}
                                            
                                            {/* Edit Button Overlay */}
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                <Link
                                                    href={route('admin.umkm.products.edit', { umkm: umkm.id, product: product.id })}
                                                    className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors"
                                                    title="Edit Produk"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </Link>
                                            </div>
                                        </div>
                                        
                                        {/* Product Info */}
                                        <div className="p-4">
                                            <h4 className="font-medium text-foreground truncate mb-1">
                                                {product.name}
                                            </h4>
                                            {product.price_range && (
                                                <p className="text-primary font-semibold text-sm">
                                                    {product.price_range}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 bg-surface-hover rounded-lg">
                                <svg className="w-12 h-12 text-muted mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                                <p className="text-muted mb-3">Belum ada produk</p>
                                <Link
                                    href={route('admin.umkm.products.create', umkm.id)}
                                    className="btn-primary text-sm inline-flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Tambah Produk Pertama
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Stats Cards */}
                    <div className="card p-6">
                        <h3 className="text-lg font-semibold text-foreground mb-4">Statistik</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-lg bg-surface-hover">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                    </div>
                                    <span className="text-foreground">Produk</span>
                                </div>
                                <span className="text-xl font-bold text-foreground">{stats.products}</span>
                            </div>

                            <div className="flex items-center justify-between p-3 rounded-lg bg-surface-hover">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                        </svg>
                                    </div>
                                    <span className="text-foreground">Artikel</span>
                                </div>
                                <span className="text-xl font-bold text-foreground">{stats.articles}</span>
                            </div>

                            <div className="flex items-center justify-between p-3 rounded-lg bg-surface-hover">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <span className="text-foreground">Foto Galeri</span>
                                </div>
                                <span className="text-xl font-bold text-foreground">{stats.gallery}</span>
                            </div>

                            <div className="flex items-center justify-between p-3 rounded-lg bg-surface-hover">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </div>
                                    <span className="text-foreground">Total Kunjungan</span>
                                </div>
                                <span className="text-xl font-bold text-foreground">{stats.total_views}</span>
                            </div>

                            <div className="flex items-center justify-between p-3 rounded-lg bg-surface-hover">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <span className="text-foreground">Kunjungan Bulan Ini</span>
                                </div>
                                <span className="text-xl font-bold text-foreground">{stats.monthly_views}</span>
                            </div>
                        </div>
                    </div>

                    {/* Admin Info */}
                    {umkm.admin && (
                        <div className="card p-6">
                            <h3 className="text-lg font-semibold text-foreground mb-4">Pengelola UMKM</h3>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    <span className="text-primary font-semibold">
                                        {umkm.admin.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <p className="font-medium text-foreground">{umkm.admin.name}</p>
                                    <p className="text-sm text-muted">{umkm.admin.email}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Quick Actions */}
                    <div className="card p-6">
                        <h3 className="text-lg font-semibold text-foreground mb-4">Aksi Cepat</h3>
                        <div className="space-y-3">
                            <Link
                                href={route('admin.umkm.gallery', umkm.id)}
                                className="flex items-center gap-3 p-3 rounded-lg bg-surface-hover hover:bg-primary/5 transition-colors group"
                            >
                                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <span className="text-foreground font-medium">Kelola Galeri Foto</span>
                            </Link>

                            <Link
                                href={route('admin.umkm.edit', umkm.id)}
                                className="flex items-center gap-3 p-3 rounded-lg bg-surface-hover hover:bg-primary/5 transition-colors group"
                            >
                                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </div>
                                <span className="text-foreground font-medium">Edit Profil UMKM</span>
                            </Link>

                            <a
                                href={`/umkm/${umkm.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-3 rounded-lg bg-surface-hover hover:bg-primary/5 transition-colors group"
                            >
                                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                                    <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </div>
                                <span className="text-foreground font-medium">Lihat Halaman Publik</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
