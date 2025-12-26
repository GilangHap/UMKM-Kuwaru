<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Umkm;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controller untuk halaman artikel publik.
 * 
 * Fitur:
 * - List artikel dengan search & filter
 * - Detail artikel
 */
class ArticleController extends Controller
{
    /**
     * Display article list.
     */
    public function index(Request $request): Response
    {
        $query = Article::where('status', 'approved')
            ->with(['umkm', 'featuredImage']);

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'ilike', "%{$search}%")
                  ->orWhere('excerpt', 'ilike', "%{$search}%")
                  ->orWhere('content', 'ilike', "%{$search}%");
            });
        }

        // Filter by UMKM
        if ($request->filled('umkm')) {
            $query->where('umkm_id', $request->umkm);
        }

        $articles = $query->latest('published_at')
            ->paginate(12)
            ->through(function ($article) {
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

        // Get UMKMs for filter
        $umkms = Umkm::where('status', 'active')
            ->whereHas('articles', fn($q) => $q->where('status', 'approved'))
            ->orderBy('name')
            ->get(['id', 'name', 'slug']);

        return Inertia::render('Public/Articles/Index', [
            'articles' => $articles,
            'umkms' => $umkms,
            'filters' => [
                'search' => $request->search ?? '',
                'umkm' => $request->umkm ?? '',
            ],
        ]);
    }

    /**
     * Display article detail.
     */
    public function show(string $slug): Response
    {
        $article = Article::where('slug', $slug)
            ->where('status', 'approved')
            ->with(['umkm.logo', 'featuredImage'])
            ->firstOrFail();

        // Track page view
        \App\Models\PageView::create([
            'umkm_id' => $article->umkm_id,
            'page_type' => 'article',
            'page_slug' => $slug,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);

        // Related articles (same UMKM)
        $relatedArticles = Article::where('umkm_id', $article->umkm_id)
            ->where('id', '!=', $article->id)
            ->where('status', 'approved')
            ->with('featuredImage')
            ->latest('published_at')
            ->take(3)
            ->get()
            ->map(function ($a) {
                return [
                    'id' => $a->id,
                    'title' => $a->title,
                    'slug' => $a->slug,
                    'excerpt' => $a->excerpt,
                    'published_at' => $a->published_at?->format('d M Y'),
                    'featured_image' => $a->featuredImage 
                        ? "/storage/{$a->featuredImage->file_path}" 
                        : null,
                ];
            });

        return Inertia::render('Public/Articles/Show', [
            'article' => [
                'id' => $article->id,
                'title' => $article->title,
                'slug' => $article->slug,
                'content' => $article->content,
                'excerpt' => $article->excerpt,
                'published_at' => $article->published_at?->format('d M Y'),
                'featured_image' => $article->featuredImage 
                    ? "/storage/{$article->featuredImage->file_path}" 
                    : null,
                'umkm' => $article->umkm ? [
                    'name' => $article->umkm->name,
                    'slug' => $article->umkm->slug,
                    'logo_url' => $article->umkm->logo 
                        ? "/storage/{$article->umkm->logo->file_path}" 
                        : null,
                ] : null,
            ],
            'relatedArticles' => $relatedArticles,
        ]);
    }
}
