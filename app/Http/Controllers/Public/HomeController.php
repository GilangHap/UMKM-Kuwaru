<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Category;
use App\Models\Setting;
use App\Models\Umkm;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controller untuk halaman publik Homepage.
 * 
 * Menampilkan:
 * - Hero section dengan branding desa
 * - Statistik UMKM
 * - Kategori UMKM
 * - UMKM unggulan
 * - Artikel terbaru
 */
class HomeController extends Controller
{
    /**
     * Display the homepage.
     */
    public function index(): Response
    {
        // Get site settings
        $settings = Setting::getMany([
            'site_name',
            'site_description', 
            'site_tagline',
            'site_logo',
            'hero_image',
            'contact_email',
            'contact_phone',
        ]);

        // Statistics
        $stats = [
            'total_umkm' => Umkm::where('status', 'active')->count(),
            'total_categories' => Category::count(),
            'total_articles' => Article::where('status', 'approved')->count(),
            'total_products' => \App\Models\Product::count(),
        ];

        // Categories with UMKM count
        $categories = Category::withCount(['umkms' => function ($query) {
            $query->where('status', 'active');
        }])
            ->orderBy('name')
            ->get();

        // Featured UMKMs
        $featuredUmkms = Umkm::where('status', 'active')
            ->with(['category', 'logo', 'theme'])
            ->latest()
            ->take(8)
            ->get()
            ->map(function ($umkm) {
                return [
                    'id' => $umkm->id,
                    'name' => $umkm->name,
                    'slug' => $umkm->slug,
                    'tagline' => $umkm->tagline,
                    'category' => $umkm->category?->name,
                    'logo_url' => $umkm->logo ? "/storage/{$umkm->logo->file_path}" : null,
                    'theme' => $umkm->theme ? [
                        'primary_color' => $umkm->theme->primary_color,
                        'secondary_color' => $umkm->theme->secondary_color,
                    ] : null,
                ];
            });

        // Recent approved articles
        $recentArticles = Article::where('status', 'approved')
            ->with(['umkm', 'featuredImage'])
            ->latest('published_at')
            ->take(6)
            ->get()
            ->map(function ($article) {
                return [
                    'id' => $article->id,
                    'title' => $article->title,
                    'slug' => $article->slug,
                    'excerpt' => $article->excerpt,
                    'published_at' => $article->published_at?->format('d M Y'),
                    'umkm_name' => $article->umkm?->name,
                    'umkm_slug' => $article->umkm?->slug,
                    'featured_image' => $article->featuredImage 
                        ? "/storage/{$article->featuredImage->file_path}" 
                        : null,
                ];
            });

        return Inertia::render('Public/Home', [
            'settings' => $settings,
            'stats' => $stats,
            'categories' => $categories,
            'featuredUmkms' => $featuredUmkms,
            'recentArticles' => $recentArticles,
        ]);
    }
}
