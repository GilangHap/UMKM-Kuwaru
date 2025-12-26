<?php

namespace App\Http\Controllers\Umkm;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\MarketplaceClick;
use App\Models\PageView;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controller untuk statistik UMKM.
 * 
 * Menampilkan:
 * - Jumlah pengunjung halaman UMKM
 * - Artikel terpopuler
 * - Produk paling banyak diklik
 * - Klik WhatsApp & marketplace
 */
class UmkmStatisticsController extends Controller
{
    /**
     * Display statistics dashboard.
     */
    public function index(Request $request): Response
    {
        $umkm = $request->user()->umkm;

        // Date range (default: last 30 days)
        $days = $request->get('days', 30);
        $startDate = now()->subDays($days);

        // Overview stats
        $stats = [
            'total_page_views' => PageView::where('umkm_id', $umkm->id)
                ->where('viewed_at', '>=', $startDate)
                ->count(),
            'total_marketplace_clicks' => MarketplaceClick::where('umkm_id', $umkm->id)
                ->where('clicked_at', '>=', $startDate)
                ->count(),
            'total_products' => Product::where('umkm_id', $umkm->id)->count(),
            'total_articles' => Article::where('umkm_id', $umkm->id)->count(),
            'articles_published' => Article::where('umkm_id', $umkm->id)->published()->count(),
        ];

        // Page views by day (for chart)
        $pageViewsByDay = PageView::where('umkm_id', $umkm->id)
            ->where('viewed_at', '>=', $startDate)
            ->select(DB::raw('DATE(viewed_at) as date'), DB::raw('COUNT(*) as views'))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(fn($row) => [
                'date' => $row->date,
                'views' => $row->views,
            ]);

        // Top articles by views
        $topArticles = Article::where('umkm_id', $umkm->id)
            ->where('views_count', '>', 0)
            ->orderByDesc('views_count')
            ->take(5)
            ->get(['id', 'title', 'views_count', 'status']);

        // Marketplace clicks breakdown
        $marketplaceBreakdown = MarketplaceClick::where('umkm_id', $umkm->id)
            ->where('clicked_at', '>=', $startDate)
            ->select('platform', DB::raw('COUNT(*) as clicks'))
            ->groupBy('platform')
            ->get()
            ->map(fn($row) => [
                'platform' => $row->platform,
                'clicks' => $row->clicks,
            ]);

        // Recent page views (table)
        $recentViews = PageView::where('umkm_id', $umkm->id)
            ->orderByDesc('viewed_at')
            ->take(10)
            ->get(['page_type', 'page_slug', 'viewed_at', 'ip_address']);

        return Inertia::render('Umkm/Statistics/Index', [
            'stats' => $stats,
            'pageViewsByDay' => $pageViewsByDay,
            'topArticles' => $topArticles,
            'marketplaceBreakdown' => $marketplaceBreakdown,
            'recentViews' => $recentViews,
            'days' => $days,
        ]);
    }
}
