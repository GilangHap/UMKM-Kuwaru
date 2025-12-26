<?php

namespace App\Http\Controllers\Umkm;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\MediaFile;
use App\Enums\ArticleStatus;
use App\Enums\MediaType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controller untuk mengelola artikel UMKM.
 * 
 * Fitur:
 * - CRUD artikel
 * - Draft & submit untuk review
 * - TIDAK BISA publish sendiri (harus diapprove Admin Desa)
 */
class UmkmArticleController extends Controller
{
    /**
     * Display a listing of articles.
     */
    public function index(Request $request): Response
    {
        $umkm = $request->user()->umkm;

        $query = Article::where('umkm_id', $umkm->id)
            ->with('featuredImage')
            ->latest();

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $articles = $query->paginate(10);

        return Inertia::render('Umkm/Articles/Index', [
            'articles' => $articles,
            'stats' => [
                'total' => Article::where('umkm_id', $umkm->id)->count(),
                'draft' => Article::where('umkm_id', $umkm->id)->where('status', ArticleStatus::DRAFT)->count(),
                'pending' => Article::where('umkm_id', $umkm->id)->where('status', ArticleStatus::PENDING)->count(),
                'approved' => Article::where('umkm_id', $umkm->id)->where('status', ArticleStatus::APPROVED)->count(),
                'rejected' => Article::where('umkm_id', $umkm->id)->where('status', ArticleStatus::REJECTED)->count(),
            ],
            'filters' => $request->only('status'),
        ]);
    }

    /**
     * Show the form for creating a new article.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('Umkm/Articles/Create', [
            'uploadUrl' => route('umkm.editor.upload'),
        ]);
    }

    /**
     * Store a newly created article.
     */
    public function store(Request $request)
    {
        $umkm = $request->user()->umkm;

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'excerpt' => 'nullable|string|max:500',
            'content' => 'required|string',
            'status' => 'required|in:draft,pending',
            'featured_image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        // Handle featured image
        $featuredImageId = null;
        if ($request->hasFile('featured_image')) {
            $file = $request->file('featured_image');
            $path = $file->store('articles', 'public');
            $mediaFile = MediaFile::create([
                'file_path' => $path,
                'file_type' => MediaType::IMAGE,
                'alt_text' => $validated['title'],
                'uploaded_by' => $request->user()->id,
            ]);
            $featuredImageId = $mediaFile->id;
        }

        $article = Article::create([
            'umkm_id' => $umkm->id,
            'title' => $validated['title'],
            'slug' => Str::slug($validated['title']) . '-' . Str::random(5),
            'excerpt' => $validated['excerpt'],
            'content' => $validated['content'],
            'status' => $validated['status'],
            'featured_image_id' => $featuredImageId,
        ]);

        $message = $validated['status'] === 'pending'
            ? 'Artikel berhasil dikirim untuk review.'
            : 'Artikel berhasil disimpan sebagai draft.';

        return redirect()
            ->route('umkm.articles.index')
            ->with('success', $message);
    }

    /**
     * Display the specified article.
     */
    public function show(Request $request, Article $article): Response
    {
        $this->authorizeArticle($request, $article);

        $article->load('featuredImage');

        return Inertia::render('Umkm/Articles/Show', [
            'article' => $article,
        ]);
    }

    /**
     * Show the form for editing the specified article.
     */
    public function edit(Request $request, Article $article): Response
    {
        $this->authorizeArticle($request, $article);

        // Only allow editing if not approved
        if ($article->status === ArticleStatus::APPROVED) {
            return redirect()
                ->route('umkm.articles.index')
                ->with('error', 'Artikel yang sudah disetujui tidak dapat diedit.');
        }

        $article->load('featuredImage');

        return Inertia::render('Umkm/Articles/Edit', [
            'article' => $article,
            'uploadUrl' => route('umkm.editor.upload'),
        ]);
    }

    /**
     * Update the specified article.
     */
    public function update(Request $request, Article $article)
    {
        $this->authorizeArticle($request, $article);

        // Only allow editing if not approved
        if ($article->status === ArticleStatus::APPROVED) {
            return back()->with('error', 'Artikel yang sudah disetujui tidak dapat diedit.');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'excerpt' => 'nullable|string|max:500',
            'content' => 'required|string',
            'status' => 'required|in:draft,pending',
            'featured_image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'remove_featured_image' => 'nullable|boolean',
        ]);

        // Handle featured image
        $featuredImageId = $article->featured_image_id;

        if ($request->boolean('remove_featured_image') && $article->featured_image_id) {
            $oldMedia = MediaFile::find($article->featured_image_id);
            if ($oldMedia) {
                Storage::disk('public')->delete($oldMedia->file_path);
                $oldMedia->delete();
            }
            $featuredImageId = null;
        }

        if ($request->hasFile('featured_image')) {
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
                'file_type' => MediaType::IMAGE,
                'alt_text' => $validated['title'],
                'uploaded_by' => $request->user()->id,
            ]);
            $featuredImageId = $mediaFile->id;
        }

        // Clear rejection notes if resubmitting
        $rejectionNotes = $article->rejection_notes;
        if ($article->status === ArticleStatus::REJECTED && $validated['status'] === 'pending') {
            $rejectionNotes = null;
        }

        $article->update([
            'title' => $validated['title'],
            'excerpt' => $validated['excerpt'],
            'content' => $validated['content'],
            'status' => $validated['status'],
            'featured_image_id' => $featuredImageId,
            'rejection_notes' => $rejectionNotes,
        ]);

        $message = $validated['status'] === 'pending'
            ? 'Artikel berhasil dikirim untuk review.'
            : 'Artikel berhasil disimpan sebagai draft.';

        return redirect()
            ->route('umkm.articles.index')
            ->with('success', $message);
    }

    /**
     * Remove the specified article.
     */
    public function destroy(Request $request, Article $article)
    {
        $this->authorizeArticle($request, $article);

        // Delete featured image
        if ($article->featured_image_id) {
            $media = MediaFile::find($article->featured_image_id);
            if ($media) {
                Storage::disk('public')->delete($media->file_path);
                $media->delete();
            }
        }

        $article->delete();

        return redirect()
            ->route('umkm.articles.index')
            ->with('success', 'Artikel berhasil dihapus.');
    }

    /**
     * Ensure article belongs to user's UMKM.
     */
    private function authorizeArticle(Request $request, Article $article): void
    {
        $umkm = $request->user()->umkm;
        if ($article->umkm_id !== $umkm->id) {
            abort(403, 'Anda tidak memiliki akses ke artikel ini.');
        }
    }
}
