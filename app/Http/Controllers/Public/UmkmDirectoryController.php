<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Umkm;
use App\Models\Article;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controller untuk direktori dan halaman publik UMKM.
 * 
 * Fitur:
 * - List semua UMKM dengan search & filter
 * - Mini website UMKM (profil publik)
 */
class UmkmDirectoryController extends Controller
{
    /**
     * Display UMKM directory.
     */
    public function index(Request $request): Response
    {
        $query = Umkm::where('status', 'active')
            ->with(['category', 'logo', 'theme', 'gallery']);

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                  ->orWhere('tagline', 'ilike', "%{$search}%")
                  ->orWhere('description', 'ilike', "%{$search}%");
            });
        }

        // Filter by category
        if ($request->filled('category')) {
            $query->where('category_id', $request->category);
        }

        $umkms = $query->orderBy('name')
            ->paginate(12)
            ->through(function ($umkm) {
                $galleryThumbnail = $umkm->gallery->first();
                return [
                    'id' => $umkm->id,
                    'name' => $umkm->name,
                    'slug' => $umkm->slug,
                    'tagline' => $umkm->tagline,
                    'category' => $umkm->category?->name,
                    'category_id' => $umkm->category_id,
                    'logo_url' => $umkm->logo ? "/storage/{$umkm->logo->file_path}" : null,
                    'gallery_thumbnail' => $galleryThumbnail ? "/storage/{$galleryThumbnail->file_path}" : null,
                    'theme' => $umkm->theme ? [
                        'primary_color' => $umkm->theme->primary_color,
                    ] : null,
                ];
            });

        $categories = Category::orderBy('name')->get(['id', 'name', 'slug']);

        return Inertia::render('Public/UmkmDirectory/Index', [
            'umkms' => $umkms,
            'categories' => $categories,
            'filters' => [
                'search' => $request->search ?? '',
                'category' => $request->category ?? '',
            ],
        ]);
    }

    /**
     * Display UMKM public profile (mini website).
     */
    public function show(string $slug): Response
    {
        $umkm = Umkm::where('slug', $slug)
            ->where('status', 'active')
            ->with([
                'category',
                'logo',
                'theme',
                'gallery',
                'products' => function ($q) {
                    $q->with(['productMedia.media'])
                      ->orderByDesc('is_featured')
                      ->orderBy('name');
                },
            ])
            ->firstOrFail();

        // Get approved articles
        $articles = Article::where('umkm_id', $umkm->id)
            ->where('status', 'approved')
            ->with('featuredImage')
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
                    'featured_image' => $article->featuredImage 
                        ? "/storage/{$article->featuredImage->file_path}" 
                        : null,
                ];
            });

        // Transform products
        $products = $umkm->products->map(function ($product) {
            $firstMedia = $product->productMedia->first();
            $thumbnail = $firstMedia?->media;
            return [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'description' => $product->description,
                'price_range' => $product->price_range,
                'is_featured' => $product->is_featured,
                'thumbnail' => $thumbnail ? "/storage/{$thumbnail->file_path}" : null,
                'shopee_url' => $product->shopee_url,
                'tokopedia_url' => $product->tokopedia_url,
                'other_marketplace_url' => $product->other_marketplace_url,
            ];
        });

        // Track page view
        \App\Models\PageView::create([
            'umkm_id' => $umkm->id,
            'page_type' => 'umkm',
            'page_slug' => $slug,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);

        return Inertia::render('Public/UmkmDirectory/Show', [
            'umkm' => [
                'id' => $umkm->id,
                'name' => $umkm->name,
                'slug' => $umkm->slug,
                'tagline' => $umkm->tagline,
                'description' => $umkm->description,
                'address' => $umkm->address,
                'phone' => $umkm->phone,
                'whatsapp' => $umkm->whatsapp,
                'email' => $umkm->email,
                'latitude' => $umkm->latitude,
                'longitude' => $umkm->longitude,
                'category' => $umkm->category?->name,
                'logo_url' => $umkm->logo ? "/storage/{$umkm->logo->file_path}" : null,
                'gallery' => $umkm->gallery->map(fn ($media) => [
                    'id' => $media->id,
                    'url' => "/storage/{$media->file_path}",
                    'alt_text' => $media->alt_text,
                ]),
                'gallery_thumbnail' => $umkm->gallery->first() 
                    ? "/storage/{$umkm->gallery->first()->file_path}" 
                    : null,
                'theme' => $umkm->theme ? [
                    'primary_color' => $umkm->theme->primary_color,
                    'secondary_color' => $umkm->theme->secondary_color,
                    'accent_color' => $umkm->theme->accent_color,
                ] : null,
            ],
            'products' => $products,
            'articles' => $articles,
        ]);
    }
}
