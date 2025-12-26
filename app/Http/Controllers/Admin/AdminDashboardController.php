<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Umkm;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controller untuk dashboard Admin Desa.
 * 
 * Dashboard ini menampilkan:
 * - Statistik ringkasan (jumlah UMKM, artikel, user)
 * - Artikel pending untuk moderasi
 * - Aktivitas terbaru
 */
class AdminDashboardController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function index(Request $request): Response
    {
        // Statistik ringkasan
        $stats = [
            'total_umkm' => Umkm::count(),
            'total_umkm_active' => Umkm::active()->count(),
            'total_articles' => Article::count(),
            'total_articles_pending' => Article::pending()->count(),
            'total_users' => User::count(),
            'total_users_active' => User::where('is_active', true)->count(),
        ];

        // Artikel pending untuk review (max 5 terbaru)
        $pendingArticles = Article::with(['umkm:id,name,slug'])
            ->pending()
            ->latest()
            ->take(5)
            ->get(['id', 'umkm_id', 'title', 'slug', 'created_at']);

        // UMKM terbaru (max 5)
        $recentUmkms = Umkm::with(['category:id,name'])
            ->latest()
            ->take(5)
            ->get(['id', 'category_id', 'name', 'slug', 'status', 'created_at']);

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'pendingArticles' => $pendingArticles,
            'recentUmkms' => $recentUmkms,
        ]);
    }
}
