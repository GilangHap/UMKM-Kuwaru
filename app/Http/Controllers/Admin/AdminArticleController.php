<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\MediaFile;
use App\Models\Umkm;
use App\Enums\ArticleStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminArticleController extends Controller
{
    /**
     * Display a listing of articles.
     */
    public function index(Request $request)
    {
        $query = Article::query()
            ->with(['umkm', 'approvedBy']);

        // Search
        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        } else {
            // Default: show pending first
            $query->orderByRaw("CASE WHEN status = 'pending' THEN 0 ELSE 1 END");
        }

        // Sorting
        $sortBy = $request->get('sort', 'created_at');
        $sortDir = $request->get('direction', 'desc');
        $query->orderBy($sortBy, $sortDir);

        $articles = $query->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Articles/Index', [
            'articles' => $articles,
            'filters' => $request->only(['search', 'status', 'sort', 'direction']),
            'statusOptions' => [
                ['value' => 'draft', 'label' => 'Draft'],
                ['value' => 'pending', 'label' => 'Menunggu Review'],
                ['value' => 'approved', 'label' => 'Disetujui'],
                ['value' => 'rejected', 'label' => 'Ditolak'],
            ],
        ]);
    }

    /**
     * Show form to create a new article.
     */
    public function create()
    {
        $umkms = Umkm::active()
            ->select('id', 'name')
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/Articles/Create', [
            'umkms' => $umkms,
        ]);
    }

    /**
     * Store a newly created article.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'umkm_id' => 'required|exists:umkms,id',
            'title' => 'required|string|max:255',
            'excerpt' => 'nullable|string|max:500',
            'content' => 'required|string',
            'seo_title' => 'nullable|string|max:60',
            'seo_description' => 'nullable|string|max:160',
            'status' => 'required|in:draft,pending,approved',
            'featured_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        $slug = Str::slug($validated['title']);
        $originalSlug = $slug;
        $counter = 1;
        while (Article::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $counter++;
        }

        // Handle featured image upload
        $featuredImageId = null;
        if ($request->hasFile('featured_image')) {
            $file = $request->file('featured_image');
            $path = $file->store('articles', 'public');
            
            $mediaFile = MediaFile::create([
                'file_path' => $path,
                'file_type' => 'image',
                'alt_text' => $validated['title'],
                'uploaded_by' => auth()->id(),
            ]);
            $featuredImageId = $mediaFile->id;
        }

        $article = Article::create([
            'umkm_id' => $validated['umkm_id'],
            'title' => $validated['title'],
            'slug' => $slug,
            'excerpt' => $validated['excerpt'],
            'content' => $validated['content'],
            'seo_title' => $validated['seo_title'],
            'seo_description' => $validated['seo_description'],
            'featured_image_id' => $featuredImageId,
            'status' => $validated['status'] === 'approved' ? ArticleStatus::APPROVED : 
                       ($validated['status'] === 'pending' ? ArticleStatus::PENDING : ArticleStatus::DRAFT),
            'approved_by' => $validated['status'] === 'approved' ? auth()->id() : null,
            'approved_at' => $validated['status'] === 'approved' ? now() : null,
            'published_at' => $validated['status'] === 'approved' ? now() : null,
        ]);

        return redirect()
            ->route('admin.articles.index')
            ->with('success', 'Artikel berhasil dibuat.');
    }

    /**
     * Display the specified article for review.
     */
    public function show(Article $article)
    {
        $article->load(['umkm', 'approvedBy', 'featuredImage']);

        return Inertia::render('Admin/Articles/Show', [
            'article' => $article,
        ]);
    }

    /**
     * Show form to edit an article.
     */
    public function edit(Article $article)
    {
        $umkms = Umkm::active()
            ->select('id', 'name')
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/Articles/Edit', [
            'article' => $article,
            'umkms' => $umkms,
        ]);
    }

    /**
     * Update the specified article.
     */
    public function update(Request $request, Article $article)
    {
        $validated = $request->validate([
            'umkm_id' => 'required|exists:umkms,id',
            'title' => 'required|string|max:255',
            'excerpt' => 'nullable|string|max:500',
            'content' => 'required|string',
            'seo_title' => 'nullable|string|max:60',
            'seo_description' => 'nullable|string|max:160',
            'status' => 'required|in:draft,pending,approved',
            'featured_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'remove_featured_image' => 'nullable|boolean',
        ]);

        // Generate new slug if title changed
        if ($validated['title'] !== $article->title) {
            $slug = Str::slug($validated['title']);
            $originalSlug = $slug;
            $counter = 1;
            while (Article::where('slug', $slug)->where('id', '!=', $article->id)->exists()) {
                $slug = $originalSlug . '-' . $counter++;
            }
            $validated['slug'] = $slug;
        }

        // Handle featured image
        $featuredImageId = $article->featured_image_id;
        
        // Remove image if requested
        if ($request->boolean('remove_featured_image') && $article->featured_image_id) {
            $oldMedia = MediaFile::find($article->featured_image_id);
            if ($oldMedia) {
                Storage::disk('public')->delete($oldMedia->file_path);
                $oldMedia->delete();
            }
            $featuredImageId = null;
        }
        
        // Upload new image
        if ($request->hasFile('featured_image')) {
            // Delete old image first
            if ($article->featured_image_id) {
                $oldMedia = MediaFile::find($article->featured_image_id);
                if ($oldMedia) {
                    Storage::disk('public')->delete($oldMedia->file_path);
                    $oldMedia->delete();
                }
            }
            
            $file = $request->file('featured_image');
            $path = $file->store('articles', 'public');
            
            $mediaFile = MediaFile::create([
                'file_path' => $path,
                'file_type' => 'image',
                'alt_text' => $validated['title'],
                'uploaded_by' => auth()->id(),
            ]);
            $featuredImageId = $mediaFile->id;
        }

        // Handle status change
        $newStatus = $validated['status'] === 'approved' ? ArticleStatus::APPROVED : 
                    ($validated['status'] === 'pending' ? ArticleStatus::PENDING : ArticleStatus::DRAFT);
        
        $approvedBy = $article->approved_by;
        $approvedAt = $article->approved_at;
        $publishedAt = $article->published_at;
        
        if ($newStatus === ArticleStatus::APPROVED && $article->status !== ArticleStatus::APPROVED) {
            $approvedBy = auth()->id();
            $approvedAt = now();
            $publishedAt = now();
        }

        $article->update([
            'umkm_id' => $validated['umkm_id'],
            'title' => $validated['title'],
            'slug' => $validated['slug'] ?? $article->slug,
            'excerpt' => $validated['excerpt'],
            'content' => $validated['content'],
            'seo_title' => $validated['seo_title'],
            'seo_description' => $validated['seo_description'],
            'featured_image_id' => $featuredImageId,
            'status' => $newStatus,
            'approved_by' => $approvedBy,
            'approved_at' => $approvedAt,
            'published_at' => $publishedAt,
        ]);

        return redirect()
            ->route('admin.articles.index')
            ->with('success', 'Artikel berhasil diperbarui.');
    }

    /**
     * Approve the article.
     */
    public function approve(Article $article)
    {
        if ($article->status !== ArticleStatus::PENDING) {
            return back()->with('error', 'Hanya artikel dengan status pending yang dapat disetujui.');
        }

        $article->update([
            'status' => ArticleStatus::APPROVED,
            'approved_by' => auth()->id(),
            'approved_at' => now(),
            'published_at' => now(),
            'rejection_notes' => null,
        ]);

        return redirect()
            ->route('admin.articles.index')
            ->with('success', 'Artikel berhasil disetujui dan dipublikasikan.');
    }

    /**
     * Reject the article.
     */
    public function reject(Request $request, Article $article)
    {
        if ($article->status !== ArticleStatus::PENDING) {
            return back()->with('error', 'Hanya artikel dengan status pending yang dapat ditolak.');
        }

        $validated = $request->validate([
            'rejection_notes' => 'required|string|max:1000',
        ]);

        $article->update([
            'status' => ArticleStatus::REJECTED,
            'approved_by' => auth()->id(),
            'approved_at' => now(),
            'rejection_notes' => $validated['rejection_notes'],
        ]);

        return redirect()
            ->route('admin.articles.index')
            ->with('success', 'Artikel berhasil ditolak.');
    }
}

