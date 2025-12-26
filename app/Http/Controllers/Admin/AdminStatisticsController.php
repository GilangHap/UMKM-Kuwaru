<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Umkm;
use App\Models\User;
use App\Enums\ArticleStatus;
use App\Enums\UmkmStatus;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminStatisticsController extends Controller
{
    /**
     * Display statistics overview.
     */
    public function index()
    {
        // UMKM Statistics
        $umkmStats = [
            'total' => Umkm::count(),
            'active' => Umkm::where('status', UmkmStatus::ACTIVE)->count(),
            'inactive' => Umkm::where('status', UmkmStatus::INACTIVE)->count(),
            'suspended' => Umkm::where('status', UmkmStatus::SUSPENDED)->count(),
            'featured' => Umkm::where('is_featured', true)->count(),
        ];

        // Article Statistics
        $articleStats = [
            'total' => Article::count(),
            'published' => Article::where('status', ArticleStatus::APPROVED)->count(),
            'pending' => Article::where('status', ArticleStatus::PENDING)->count(),
            'rejected' => Article::where('status', ArticleStatus::REJECTED)->count(),
        ];

        // Top UMKM by views (mock for now - needs page_views table)
        $topUmkm = Umkm::where('status', UmkmStatus::ACTIVE)
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get(['id', 'name', 'slug']);

        // Top Articles by views
        $topArticles = Article::where('status', ArticleStatus::APPROVED)
            ->with('umkm:id,name')
            ->orderBy('views_count', 'desc')
            ->take(10)
            ->get(['id', 'title', 'slug', 'umkm_id', 'views_count']);

        // Recent activity
        $recentUmkm = Umkm::with('category')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        $recentArticles = Article::with('umkm:id,name')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('Admin/Statistics/Index', [
            'umkmStats' => $umkmStats,
            'articleStats' => $articleStats,
            'topUmkm' => $topUmkm,
            'topArticles' => $topArticles,
            'recentUmkm' => $recentUmkm,
            'recentArticles' => $recentArticles,
        ]);
    }
}
