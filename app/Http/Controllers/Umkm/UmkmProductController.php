<?php

namespace App\Http\Controllers\Umkm;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\MediaFile;
use App\Enums\MediaType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controller untuk mengelola produk UMKM.
 * 
 * Fitur:
 * - CRUD produk
 * - Upload foto produk (multiple)
 * - Link marketplace (Shopee, Tokopedia, dll)
 */
class UmkmProductController extends Controller
{
    /**
     * Display a listing of products.
     */
    public function index(Request $request): Response
    {
        $umkm = $request->user()->umkm;

        $products = Product::where('umkm_id', $umkm->id)
            ->with(['media' => fn($q) => $q->orderByPivot('sort_order')->take(1)])
            ->latest()
            ->paginate(12);

        return Inertia::render('Umkm/Products/Index', [
            'products' => $products,
            'stats' => [
                'total' => Product::where('umkm_id', $umkm->id)->count(),
                'featured' => Product::where('umkm_id', $umkm->id)->where('is_featured', true)->count(),
            ],
        ]);
    }

    /**
     * Show the form for creating a new product.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('Umkm/Products/Create');
    }

    /**
     * Store a newly created product.
     */
    public function store(Request $request)
    {
        try {
            DB::beginTransaction();

            $umkm = $request->user()->umkm;

            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string|max:5000',
                'price_range' => 'nullable|string|max:100',
                'is_featured' => 'nullable|boolean',
                'shopee_url' => 'nullable|url|max:500',
                'tokopedia_url' => 'nullable|url|max:500',
                'other_marketplace_url' => 'nullable|url|max:500',
                'images' => 'nullable|array|max:5',
                'images.*' => 'image|mimes:jpeg,png,jpg,webp|max:2048',
            ]);

            $product = Product::create([
                'umkm_id' => $umkm->id,
                'name' => $validated['name'],
                'slug' => Str::slug($validated['name']) . '-' . Str::random(5),
                'description' => $validated['description'] ?? null,
                'price_range' => $validated['price_range'] ?? null,
                'is_featured' => $request->boolean('is_featured'),
                'shopee_url' => $validated['shopee_url'] ?? null,
                'tokopedia_url' => $validated['tokopedia_url'] ?? null,
                'other_marketplace_url' => $validated['other_marketplace_url'] ?? null,
            ]);

            // Handle image uploads
            if ($request->hasFile('images')) {
                $sortOrder = 0;
                foreach ($request->file('images') as $image) {
                    $path = $image->store('products', 'public');
                    $mediaFile = MediaFile::create([
                        'file_path' => $path,
                        'file_type' => MediaType::IMAGE,
                        'alt_text' => $validated['name'],
                        'uploaded_by' => $request->user()->id,
                    ]);
                    
                    // Use explicit create instead of attach to ensure ID is generated
                    \App\Models\ProductMedia::create([
                        'product_id' => $product->id,
                        'media_id' => $mediaFile->id,
                        'sort_order' => $sortOrder++,
                    ]);
                }
            }

            DB::commit();

            return redirect()
                ->route('umkm.products.index')
                ->with('success', 'Produk berhasil ditambahkan.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Gagal menyimpan produk: ' . $e->getMessage())->withInput();
        }
    }

    /**
     * Display the specified product.
     */
    public function show(Request $request, Product $product): Response
    {
        $this->authorizeProduct($request, $product);

        $product->load('media');

        return Inertia::render('Umkm/Products/Show', [
            'product' => $product,
        ]);
    }

    /**
     * Show the form for editing the specified product.
     */
    public function edit(Request $request, Product $product): Response
    {
        $this->authorizeProduct($request, $product);

        $product->load('media');

        return Inertia::render('Umkm/Products/Edit', [
            'product' => $product,
        ]);
    }

    /**
     * Update the specified product.
     */
    public function update(Request $request, Product $product)
    {
        $this->authorizeProduct($request, $product);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:5000',
            'price_range' => 'nullable|string|max:100',
            'is_featured' => 'nullable|boolean',
            'shopee_url' => 'nullable|url|max:500',
            'tokopedia_url' => 'nullable|url|max:500',
            'other_marketplace_url' => 'nullable|url|max:500',
            'images' => 'nullable|array|max:5',
            'images.*' => 'image|mimes:jpeg,png,jpg,webp|max:2048',
            'remove_images' => 'nullable|array',
        ]);

        $product->update([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'price_range' => $validated['price_range'],
            'is_featured' => $request->boolean('is_featured'),
            'shopee_url' => $validated['shopee_url'],
            'tokopedia_url' => $validated['tokopedia_url'],
            'other_marketplace_url' => $validated['other_marketplace_url'],
        ]);

        // Remove images
        if (!empty($validated['remove_images'])) {
            foreach ($validated['remove_images'] as $mediaId) {
                $media = MediaFile::find($mediaId);
                if ($media) {
                    Storage::disk('public')->delete($media->file_path);
                    $product->media()->detach($mediaId);
                    $media->delete();
                }
            }
        }

        // Add new images
        if ($request->hasFile('images')) {
            $maxSort = $product->media()->max('sort_order') ?? -1;
            foreach ($request->file('images') as $image) {
                $path = $image->store('products', 'public');
                $mediaFile = MediaFile::create([
                    'file_path' => $path,
                    'file_type' => MediaType::IMAGE,
                    'alt_text' => $validated['name'],
                    'uploaded_by' => $request->user()->id,
                ]);
                \App\Models\ProductMedia::create([
                    'product_id' => $product->id,
                    'media_id' => $mediaFile->id,
                    'sort_order' => ++$maxSort,
                ]);
            }
        }

        return redirect()
            ->route('umkm.products.index')
            ->with('success', 'Produk berhasil diperbarui.');
    }

    /**
     * Remove the specified product.
     */
    public function destroy(Request $request, Product $product)
    {
        $this->authorizeProduct($request, $product);

        // Delete associated media
        foreach ($product->media as $media) {
            Storage::disk('public')->delete($media->file_path);
            $media->delete();
        }

        $product->delete();

        return redirect()
            ->route('umkm.products.index')
            ->with('success', 'Produk berhasil dihapus.');
    }

    /**
     * Ensure product belongs to user's UMKM.
     */
    private function authorizeProduct(Request $request, Product $product): void
    {
        $umkm = $request->user()->umkm;
        if ($product->umkm_id !== $umkm->id) {
            abort(403, 'Anda tidak memiliki akses ke produk ini.');
        }
    }
}
