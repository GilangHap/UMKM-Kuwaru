import { useState } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Link } from '@inertiajs/react';

interface Product {
    id: string;
    name: string;
    slug: string;
    description?: string;
    price_range?: string;
    is_featured: boolean;
    thumbnail?: string;
    shopee_url?: string;
    tokopedia_url?: string;
    other_marketplace_url?: string;
}

interface Article {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    published_at?: string;
    featured_image?: string;
}

interface Umkm {
    id: string;
    name: string;
    slug: string;
    tagline?: string;
    description?: string;
    address?: string;
    phone?: string;
    whatsapp?: string;
    email?: string;
    latitude?: number;
    longitude?: number;
    category?: string;
    logo_url?: string;
    theme?: {
        primary_color?: string;
        secondary_color?: string;
        accent_color?: string;
    };
}

interface Props {
    umkm: Umkm;
    products: Product[];
    articles: Article[];
}

export default function Show({ umkm, products = [], articles = [] }: Props) {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [showShareMenu, setShowShareMenu] = useState(false);

    if (!umkm) {
        return (
            <PublicLayout title="Memuat...">
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-gray-500">Memuat data UMKM...</p>
                    </div>
                </div>
            </PublicLayout>
        );
    }

    const primaryColor = umkm.theme?.primary_color || '#16a34a';
    const secondaryColor = umkm.theme?.secondary_color || '#0891b2';
    const accentColor = umkm.theme?.accent_color || '#f59e0b';

    const hasMarketplace = (product: Product) => 
        product.shopee_url || product.tokopedia_url || product.other_marketplace_url;

    // Format WhatsApp number to international format (Indonesia)
    const formatWhatsApp = (phone: string) => {
        let cleaned = phone.replace(/\D/g, '');
        // If starts with 0, replace with 62 (Indonesia code)
        if (cleaned.startsWith('0')) {
            cleaned = '62' + cleaned.substring(1);
        }
        // If doesn't start with 62, add it
        if (!cleaned.startsWith('62')) {
            cleaned = '62' + cleaned;
        }
        return cleaned;
    };

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareText = `${umkm.name} - ${umkm.tagline || 'UMKM Desa Kuwaru'}`;

    const featuredProducts = products.filter(p => p.is_featured);
    const regularProducts = products.filter(p => !p.is_featured);


    return (
        <PublicLayout 
            title={`${umkm.name} - UMKM Desa Kuwaru`}
            description={umkm.tagline || umkm.description || `${umkm.name} - UMKM di Desa Kuwaru`}
        >
            {/* Hero Section - Premium Design */}
            <section className="relative min-h-[60vh] md:min-h-[70vh] overflow-hidden">
                {/* Animated Background */}
                <div 
                    className="absolute inset-0"
                    style={{ 
                        background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 50%, ${primaryColor} 100%)`,
                        backgroundSize: '400% 400%',
                        animation: 'gradient 15s ease infinite'
                    }}
                />
                
                {/* Decorative Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-1/2 -right-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl" 
                         style={{ backgroundColor: accentColor }} />
                    <div className="absolute -bottom-1/4 -left-1/4 w-80 h-80 rounded-full opacity-20 blur-3xl" 
                         style={{ backgroundColor: secondaryColor }} />
                </div>

                {/* Pattern Overlay */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }} />
                </div>

                {/* Content */}
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                    <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
                        {/* Logo with Glow Effect */}
                        <div className="relative group">
                            <div 
                                className="absolute inset-0 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"
                                style={{ backgroundColor: accentColor }}
                            />
                            {umkm.logo_url ? (
                                <img 
                                    src={umkm.logo_url} 
                                    alt={umkm.name}
                                    className="relative w-32 h-32 md:w-44 md:h-44 rounded-3xl object-cover border-4 border-white/30 shadow-2xl transform group-hover:scale-105 transition-transform duration-300"
                                />
                            ) : (
                                <div 
                                    className="relative w-32 h-32 md:w-44 md:h-44 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-6xl md:text-7xl font-bold text-white border-4 border-white/30"
                                >
                                    {umkm.name.charAt(0)}
                                </div>
                            )}
                        </div>
                        
                        {/* Info */}
                        <div className="text-center lg:text-left text-white flex-1">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm mb-4">
                                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                                {umkm.category || 'UMKM'}
                            </div>
                            
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg">
                                {umkm.name}
                            </h1>
                            
                            {umkm.tagline && (
                                <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-2xl leading-relaxed">
                                    {umkm.tagline}
                                </p>
                            )}

                            {/* Quick Stats */}
                            <div className="flex flex-wrap justify-center lg:justify-start gap-6 mb-8">
                                <div className="text-center px-4">
                                    <div className="text-3xl font-bold">{products.length}</div>
                                    <div className="text-sm opacity-75">Produk</div>
                                </div>
                                <div className="text-center px-4 border-l border-white/30">
                                    <div className="text-3xl font-bold">{articles.length}</div>
                                    <div className="text-sm opacity-75">Artikel</div>
                                </div>
                                {featuredProducts.length > 0 && (
                                    <div className="text-center px-4 border-l border-white/30">
                                        <div className="text-3xl font-bold">{featuredProducts.length}</div>
                                        <div className="text-sm opacity-75">Unggulan</div>
                                    </div>
                                )}
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                                {umkm.whatsapp && (
                                    <a
                                        href={`https://wa.me/${formatWhatsApp(umkm.whatsapp)}?text=Halo, saya tertarik dengan produk ${umkm.name}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-green-600 font-semibold rounded-xl hover:bg-green-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                        </svg>
                                        Chat WhatsApp
                                    </a>
                                )}
                                <button
                                    onClick={() => setShowShareMenu(!showShareMenu)}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/30 transition-all duration-200 border border-white/30"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                    </svg>
                                    Bagikan
                                </button>
                            </div>

                            {/* Share Menu Popup */}
                            {showShareMenu && (
                                <div className="mt-4 p-4 bg-white/20 backdrop-blur-sm rounded-xl inline-flex gap-3 animate-fade-in">
                                    <a
                                        href={`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
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
                                        className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        title="Share to Facebook"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                        </svg>
                                    </a>
                                    <a
                                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                                        title="Share to X"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                        </svg>
                                    </a>
                                    <button
                                        onClick={() => navigator.clipboard.writeText(shareUrl)}
                                        className="p-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                        title="Copy Link"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Wave Divider */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                        <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
                    </svg>
                </div>
            </section>

            {/* Floating Action Buttons - Mobile */}
            <div className="md:hidden fixed bottom-4 right-4 z-50 flex flex-col gap-3">
                {umkm.whatsapp && (
                    <a
                        href={`https://wa.me/${formatWhatsApp(umkm.whatsapp)}?text=Halo, saya tertarik dengan produk ${umkm.name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-14 h-14 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                    </a>
                )}
                {umkm.phone && (
                    <a
                        href={`tel:${umkm.phone}`}
                        className="w-14 h-14 rounded-full text-white flex items-center justify-center shadow-lg transition-colors"
                        style={{ backgroundColor: primaryColor }}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                    </a>
                )}
            </div>

            {/* About Section */}
            {umkm.description && (
                <section className="py-16 md:py-20 bg-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-4 mb-8">
                            <div 
                                className="w-1 h-12 rounded-full"
                                style={{ backgroundColor: primaryColor }}
                            />
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Tentang Kami</h2>
                        </div>
                        <p className="text-lg text-gray-600 leading-relaxed whitespace-pre-line">
                            {umkm.description}
                        </p>
                    </div>
                </section>
            )}

            {/* Featured Products */}
            {featuredProducts.length > 0 && (
                <section className="py-16 md:py-20" style={{ backgroundColor: `${primaryColor}08` }}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <span 
                                className="inline-block px-4 py-1 rounded-full text-sm font-medium mb-4"
                                style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
                            >
                                ⭐ Unggulan
                            </span>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Produk Andalan
                            </h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Produk pilihan yang paling diminati pelanggan kami
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                            {featuredProducts.map((product) => (
                                <div 
                                    key={product.id}
                                    className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                                >
                                    <div className="relative aspect-square overflow-hidden">
                                        {product.thumbnail ? (
                                            <img 
                                                src={product.thumbnail} 
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div 
                                                className="w-full h-full flex items-center justify-center"
                                                style={{ backgroundColor: `${primaryColor}15` }}
                                            >
                                                <svg className="w-20 h-20" style={{ color: primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                </svg>
                                            </div>
                                        )}
                                        <div 
                                            className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg"
                                            style={{ backgroundColor: accentColor }}
                                        >
                                            ⭐ BEST
                                        </div>
                                    </div>
                                    
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                                        {product.description && (
                                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                                        )}
                                        
                                        {product.price_range && (
                                            <p 
                                                className="text-lg font-bold mb-4"
                                                style={{ color: primaryColor }}
                                            >
                                                {product.price_range}
                                            </p>
                                        )}

                                        {hasMarketplace(product) && (
                                            <div className="flex flex-wrap gap-2">
                                                {product.shopee_url && (
                                                    <a
                                                        href={product.shopee_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex-1 py-2 px-4 text-center text-sm font-medium bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
                                                    >
                                                        🛒 Shopee
                                                    </a>
                                                )}
                                                {product.tokopedia_url && (
                                                    <a
                                                        href={product.tokopedia_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex-1 py-2 px-4 text-center text-sm font-medium bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
                                                    >
                                                        🛒 Tokopedia
                                                    </a>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* All Products */}
            {regularProducts.length > 0 && (
                <section className="py-16 md:py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between mb-12">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                                    Semua Produk
                                </h2>
                                <p className="text-gray-600">
                                    {products.length} produk tersedia
                                </p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                            {regularProducts.map((product) => (
                                <div 
                                    key={product.id}
                                    className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:border-transparent transition-all duration-300"
                                >
                                    <div className="relative aspect-square overflow-hidden">
                                        {product.thumbnail ? (
                                            <img 
                                                src={product.thumbnail} 
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div 
                                                className="w-full h-full flex items-center justify-center"
                                                style={{ backgroundColor: `${primaryColor}10` }}
                                            >
                                                <svg className="w-12 h-12" style={{ color: primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="p-4">
                                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
                                        
                                        {product.price_range && (
                                            <p 
                                                className="text-sm font-medium mb-3"
                                                style={{ color: primaryColor }}
                                            >
                                                {product.price_range}
                                            </p>
                                        )}

                                        {hasMarketplace(product) && (
                                            <div className="flex gap-2">
                                                {product.shopee_url && (
                                                    <a
                                                        href={product.shopee_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex-1 py-1.5 text-center text-xs font-medium bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                                                    >
                                                        Shopee
                                                    </a>
                                                )}
                                                {product.tokopedia_url && (
                                                    <a
                                                        href={product.tokopedia_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex-1 py-1.5 text-center text-xs font-medium bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                                    >
                                                        Tokopedia
                                                    </a>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Articles Section */}
            {articles.length > 0 && (
                <section className="py-16 md:py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Berita & Artikel
                            </h2>
                            <p className="text-gray-600">
                                Informasi terbaru dari {umkm.name}
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {articles.map((article) => (
                                <Link
                                    key={article.id}
                                    href={`/artikel/${article.slug}`}
                                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                                >
                                    <div className="aspect-video overflow-hidden">
                                        {article.featured_image ? (
                                            <img 
                                                src={article.featured_image} 
                                                alt={article.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div 
                                                className="w-full h-full flex items-center justify-center"
                                                style={{ backgroundColor: `${primaryColor}10` }}
                                            >
                                                <svg className="w-12 h-12" style={{ color: primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-5">
                                        <p className="text-sm text-gray-500 mb-2">{article.published_at}</p>
                                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-700 transition-colors">
                                            {article.title}
                                        </h3>
                                        {article.excerpt && (
                                            <p className="text-sm text-gray-600 line-clamp-2">{article.excerpt}</p>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Contact & Map Section */}
            <section className="py-16 md:py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Hubungi Kami
                        </h2>
                        <p className="text-gray-600">
                            Kami siap melayani Anda
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Contact Cards */}
                        <div className="space-y-4">
                            {umkm.whatsapp && (
                                <a
                                    href={`https://wa.me/${formatWhatsApp(umkm.whatsapp)}?text=Halo, saya tertarik dengan produk ${umkm.name}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-4 p-5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl"
                                >
                                    <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                                        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm opacity-90">WhatsApp</p>
                                        <p className="font-bold text-lg">{umkm.whatsapp}</p>
                                    </div>
                                    <svg className="w-6 h-6 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </a>
                            )}

                            {umkm.phone && (
                                <a
                                    href={`tel:${umkm.phone}`}
                                    className="flex items-center gap-4 p-5 rounded-2xl border-2 border-gray-100 hover:border-gray-200 transition-all"
                                    style={{ 
                                        background: `linear-gradient(135deg, ${primaryColor}05 0%, ${primaryColor}10 100%)` 
                                    }}
                                >
                                    <div 
                                        className="w-14 h-14 rounded-xl flex items-center justify-center"
                                        style={{ backgroundColor: `${primaryColor}20` }}
                                    >
                                        <svg className="w-7 h-7" style={{ color: primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Telepon</p>
                                        <p className="font-bold text-lg text-gray-900">{umkm.phone}</p>
                                    </div>
                                </a>
                            )}

                            {umkm.email && (
                                <a
                                    href={`mailto:${umkm.email}`}
                                    className="flex items-center gap-4 p-5 rounded-2xl border-2 border-gray-100 hover:border-gray-200 transition-all"
                                >
                                    <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center">
                                        <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="font-bold text-lg text-gray-900">{umkm.email}</p>
                                    </div>
                                </a>
                            )}

                            {umkm.address && (
                                <div className="flex items-start gap-4 p-5 rounded-2xl border-2 border-gray-100 bg-gray-50">
                                    <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
                                        <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Alamat</p>
                                        <p className="font-medium text-gray-900">{umkm.address}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Map */}
                        {umkm.latitude && umkm.longitude && (
                            <div className="bg-gray-100 rounded-2xl overflow-hidden shadow-lg h-80 lg:h-auto lg:min-h-[400px]">
                                <iframe
                                    src={`https://www.google.com/maps?q=${umkm.latitude},${umkm.longitude}&z=15&output=embed`}
                                    className="w-full h-full"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Back Link */}
            <section className="py-8 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <Link
                        href="/umkm"
                        className="inline-flex items-center text-gray-600 hover:text-gray-900 font-medium transition-colors"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Kembali ke Direktori UMKM
                    </Link>
                </div>
            </section>

            {/* CSS Animations */}
            <style>{`
                @keyframes gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out;
                }
            `}</style>
        </PublicLayout>
    );
}
