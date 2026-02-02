<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductMedia;
use App\Models\Umkm;
use App\Models\MediaFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controller untuk mengelola produk UMKM oleh Admin.
 */
class AdminUmkmProductController extends Controller
{
    /**
     * Display a listing of products for a UMKM.
     */
    public function index(Umkm $umkm): Response
    {
        $products = Product::where('umkm_id', $umkm->id)
            ->with('media')
            ->orderBy('is_featured', 'desc')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($product) {
                $thumbnail = $product->media->first();
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'slug' => $product->slug,
                    'price_range' => $product->price_range,
                    'is_featured' => $product->is_featured,
                    'image' => $thumbnail ? [
                        'id' => $thumbnail->id,
                        'file_path' => $thumbnail->file_path,
                    ] : null,
                ];
            });

        return Inertia::render('Admin/Umkm/Products/Index', [
            'umkm' => $umkm,
            'products' => $products,
        ]);
    }

    /**
     * Show the form for creating a new product.
     */
    public function create(Umkm $umkm): Response
    {
        return Inertia::render('Admin/Umkm/Products/Create', [
            'umkm' => $umkm,
        ]);
    }

    /**
     * Store a newly created product.
     */
    public function store(Request $request, Umkm $umkm)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price_range' => 'nullable|string|max:255',
            'is_featured' => 'boolean',
            'shopee_url' => 'nullable|url',
            'tokopedia_url' => 'nullable|url',
            'other_marketplace_url' => 'nullable|url',
            'image' => 'nullable|image|max:2048',
        ]);

        DB::beginTransaction();

        try {
            // Generate slug
            $slug = Str::slug($validated['name']);
            $originalSlug = $slug;
            $counter = 1;
            while (Product::where('umkm_id', $umkm->id)->where('slug', $slug)->exists()) {
                $slug = $originalSlug . '-' . $counter++;
            }

            // Create product
            $product = Product::create([
                'umkm_id' => $umkm->id,
                'name' => $validated['name'],
                'slug' => $slug,
                'description' => $validated['description'] ?? null,
                'price_range' => $validated['price_range'] ?? null,
                'is_featured' => $validated['is_featured'] ?? false,
                'shopee_url' => $validated['shopee_url'] ?? null,
                'tokopedia_url' => $validated['tokopedia_url'] ?? null,
                'other_marketplace_url' => $validated['other_marketplace_url'] ?? null,
            ]);

            // Handle image upload
            if ($request->hasFile('image')) {
                $file = $request->file('image');
                $path = $file->store("products/{$umkm->id}", 'public');
                
                $media = MediaFile::create([
                    'file_path' => $path,
                    'file_type' => 'image',
                    'mime_type' => $file->getMimeType(),
                    'file_size' => $file->getSize(),
                    'original_name' => $file->getClientOriginalName(),
                    'uploaded_by' => auth()->id(),
                ]);

                // Attach media to product via pivot
                ProductMedia::create([
                    'product_id' => $product->id,
                    'media_id' => $media->id,
                    'sort_order' => 0,
                ]);
            }

            DB::commit();

            return redirect()
                ->route('admin.umkm.show', $umkm)
                ->with('success', 'Produk berhasil ditambahkan.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Gagal menambahkan produk: ' . $e->getMessage());
        }
    }

    /**
     * Show the form for editing the specified product.
     */
    public function edit(Umkm $umkm, Product $product): Response
    {
        $product->load('media');
        
        $thumbnail = $product->media->first();
        $productData = $product->toArray();
        $productData['image'] = $thumbnail ? [
            'id' => $thumbnail->id,
            'file_path' => $thumbnail->file_path,
        ] : null;

        return Inertia::render('Admin/Umkm/Products/Edit', [
            'umkm' => $umkm,
            'product' => $productData,
        ]);
    }

    /**
     * Update the specified product.
     */
    public function update(Request $request, Umkm $umkm, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price_range' => 'nullable|string|max:255',
            'is_featured' => 'boolean',
            'shopee_url' => 'nullable|url',
            'tokopedia_url' => 'nullable|url',
            'other_marketplace_url' => 'nullable|url',
            'image' => 'nullable|image|max:2048',
            'remove_image' => 'boolean',
        ]);

        DB::beginTransaction();

        try {
            // Update slug if name changed
            if ($product->name !== $validated['name']) {
                $slug = Str::slug($validated['name']);
                $originalSlug = $slug;
                $counter = 1;
                while (Product::where('umkm_id', $umkm->id)->where('slug', $slug)->where('id', '!=', $product->id)->exists()) {
                    $slug = $originalSlug . '-' . $counter++;
                }
                $validated['slug'] = $slug;
            }

            // Handle image removal
            if ($request->boolean('remove_image')) {
                $existingMedia = $product->media()->first();
                if ($existingMedia) {
                    Storage::disk('public')->delete($existingMedia->file_path);
                    $product->media()->detach($existingMedia->id);
                    $existingMedia->delete();
                }
            }

            // Handle new image upload
            if ($request->hasFile('image')) {
                // Delete old image
                $existingMedia = $product->media()->first();
                if ($existingMedia) {
                    Storage::disk('public')->delete($existingMedia->file_path);
                    $product->media()->detach($existingMedia->id);
                    $existingMedia->delete();
                }

                $file = $request->file('image');
                $path = $file->store("products/{$umkm->id}", 'public');
                
                $media = MediaFile::create([
                    'file_path' => $path,
                    'file_type' => 'image',
                    'mime_type' => $file->getMimeType(),
                    'file_size' => $file->getSize(),
                    'original_name' => $file->getClientOriginalName(),
                    'uploaded_by' => auth()->id(),
                ]);

                // Attach media to product via pivot
                ProductMedia::create([
                    'product_id' => $product->id,
                    'media_id' => $media->id,
                    'sort_order' => 0,
                ]);
            }

            unset($validated['image'], $validated['remove_image']);
            $product->update($validated);

            DB::commit();

            return redirect()
                ->route('admin.umkm.show', $umkm)
                ->with('success', 'Produk berhasil diperbarui.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Gagal memperbarui produk: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified product.
     */
    public function destroy(Umkm $umkm, Product $product)
    {
        DB::beginTransaction();

        try {
            // Delete all product media
            foreach ($product->media as $media) {
                Storage::disk('public')->delete($media->file_path);
                $media->delete();
            }
            
            // Delete product (pivot will be deleted by cascade or manually)
            ProductMedia::where('product_id', $product->id)->delete();
            $product->delete();

            DB::commit();

            return redirect()
                ->route('admin.umkm.show', $umkm)
                ->with('success', 'Produk berhasil dihapus.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Gagal menghapus produk: ' . $e->getMessage());
        }
    }
}
