export interface User {
    id: string; // UUID
    name: string;
    email: string;
    role: 'admin_desa' | 'admin_umkm';
    is_active: boolean;
    email_verified_at?: string;
    last_login_at?: string;
    created_at: string;
    updated_at: string;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    icon?: string;
}

export interface Umkm {
    id: string;
    user_id: string;
    category_id: string;
    name: string;
    slug: string;
    description: string;
    owner_name: string;
    address: string;
    latitude?: number;
    longitude?: number;
    phone?: string;
    whatsapp?: string;
    email?: string;
    logo_id?: string;
    status: 'active' | 'inactive' | 'suspended';
    is_featured?: boolean;
    created_at: string;
    updated_at: string;
    // Relations
    category?: Category;
    theme?: UmkmTheme;
    logo?: MediaFile;
    admin?: User;
}

export interface UmkmTheme {
    id: string;
    umkm_id: string;
    primary_color: string;
    secondary_color?: string;
    accent_color?: string;
    font_family?: string;
}

export interface MediaFile {
    id: string;
    file_path: string;
    file_type: 'image' | 'video';
    alt_text?: string;
    uploaded_by: string;
    url?: string;
}

export interface Article {
    id: string;
    umkm_id: string;
    title: string;
    slug: string;
    excerpt?: string;
    content: string;
    status: 'draft' | 'pending' | 'approved' | 'rejected';
    seo_title?: string;
    seo_description?: string;
    views_count?: number;
    rejection_notes?: string;
    approved_by?: string;
    approved_at?: string;
    published_at?: string;
    created_at: string;
    updated_at: string;
    // Relations
    umkm?: Partial<Umkm>;
    approvedBy?: User;
    featuredImage?: MediaFile;
}

export interface Product {
    id: string;
    umkm_id: string;
    name: string;
    slug: string;
    description: string;
    price_range?: string;
    is_featured: boolean;
    created_at: string;
    updated_at: string;
    // Relations
    media?: MediaFile[];
}

// Stats types for dashboards
export interface AdminDashboardStats {
    total_umkm: number;
    total_umkm_active: number;
    total_articles: number;
    total_articles_pending: number;
    total_users: number;
    total_users_active: number;
}

export interface UmkmDashboardStats {
    total_articles: number;
    total_articles_published: number;
    total_articles_pending: number;
    total_products: number;
    total_products_featured: number;
}

export interface UmkmInsights {
    page_views_30d: number;
    marketplace_clicks_30d: number;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User | null;
    };
};
