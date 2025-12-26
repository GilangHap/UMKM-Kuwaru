<?php

namespace App\Http\Controllers\Umkm;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\MarketplaceClick;
use App\Models\PageView;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controller untuk dashboard Admin UMKM.
 * 
 * Dashboard ini menampilkan:
 * - Informasi UMKM milik user
 * - Statistik artikel dan produk
 * - Insight kunjungan dan klik marketplace
 */
class UmkmDashboardController extends Controller
{
    /**
     * Display the UMKM dashboard.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $umkm = $user->umkm;

        // Load relationships
        $umkm->load(['category:id,name', 'theme', 'logo']);

        // Statistik
        $stats = [
            'total_articles' => Article::where('umkm_id', $umkm->id)->count(),
            'total_articles_published' => Article::where('umkm_id', $umkm->id)->published()->count(),
            'total_articles_pending' => Article::where('umkm_id', $umkm->id)->pending()->count(),
            'total_products' => Product::where('umkm_id', $umkm->id)->count(),
            'total_products_featured' => Product::where('umkm_id', $umkm->id)->featured()->count(),
        ];

        // Insight kunjungan (30 hari terakhir)
        $thirtyDaysAgo = now()->subDays(30);
        $insights = [
            'page_views_30d' => PageView::where('umkm_id', $umkm->id)
                ->where('viewed_at', '>=', $thirtyDaysAgo)
                ->count(),
            'marketplace_clicks_30d' => MarketplaceClick::where('umkm_id', $umkm->id)
                ->where('clicked_at', '>=', $thirtyDaysAgo)
                ->count(),
        ];

        // Artikel terbaru (max 5)
        $recentArticles = Article::where('umkm_id', $umkm->id)
            ->latest()
            ->take(5)
            ->get(['id', 'title', 'slug', 'status', 'published_at', 'created_at']);

        // Produk unggulan
        $featuredProducts = Product::where('umkm_id', $umkm->id)
            ->featured()
            ->with(['media' => function ($query) {
                $query->orderByPivot('sort_order')->take(1);
            }])
            ->take(4)
            ->get(['id', 'name', 'slug', 'price_range']);

        return Inertia::render('Umkm/Dashboard', [
            'umkm' => $umkm,
            'stats' => $stats,
            'insights' => $insights,
            'recentArticles' => $recentArticles,
            'featuredProducts' => $featuredProducts,
        ]);
    }
}
