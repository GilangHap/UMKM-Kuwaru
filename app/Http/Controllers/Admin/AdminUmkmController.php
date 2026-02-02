<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\MediaFile;
use App\Models\Umkm;
use App\Models\User;
use App\Enums\UserRole;
use App\Enums\UmkmStatus;
use App\Enums\MediaType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use App\Models\UmkmMedia;

class AdminUmkmController extends Controller
{
    /**
     * Display a listing of UMKMs.
     */
    public function index(Request $request)
    {
        $query = Umkm::query()
            ->with(['category', 'admin', 'logo'])
            ->withCount(['articles', 'products']);

        // Search
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('owner_name', 'like', '%' . $request->search . '%');
            });
        }

        // Filter by category
        if ($request->filled('category')) {
            $query->where('category_id', $request->category);
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Sorting
        $sortBy = $request->get('sort', 'created_at');
        $sortDir = $request->get('direction', 'desc');
        $query->orderBy($sortBy, $sortDir);

        $umkms = $query->paginate(15)
            ->withQueryString();

        $categories = Category::orderBy('name')->get();

        return Inertia::render('Admin/Umkm/Index', [
            'umkms' => $umkms,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category', 'status', 'sort', 'direction']),
        ]);
    }

    /**
     * Show the form for creating a new UMKM.
     */
    public function create()
    {
        $categories = Category::orderBy('name')->get();

        return Inertia::render('Admin/Umkm/Create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created UMKM.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            // User account
            'admin_name' => 'required|string|max:255',
            'admin_email' => 'required|email|unique:users,email',
            'admin_password' => 'nullable|string|min:8',
            
            // UMKM data
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'owner_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'address' => 'nullable|string|max:500',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'phone' => 'nullable|string|max:20',
            'whatsapp' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        DB::beginTransaction();

        try {
            // Generate password if not provided
            $password = $validated['admin_password'] ?? Str::random(12);

            // Create user account
            $user = User::create([
                'name' => $validated['admin_name'],
                'email' => $validated['admin_email'],
                'password' => Hash::make($password),
                'role' => UserRole::ADMIN_UMKM,
                'is_active' => true,
            ]);

            // Handle logo upload
            $logoId = null;
            if ($request->hasFile('logo')) {
                $file = $request->file('logo');
                $path = $file->store('umkm/logos', 'public');
                
                $mediaFile = MediaFile::create([
                    'file_path' => $path,
                    'file_type' => MediaType::IMAGE,
                    'alt_text' => $validated['name'] . ' logo',
                    'uploaded_by' => auth()->id(),
                ]);
                $logoId = $mediaFile->id;
            }

            // Create UMKM
            $umkm = Umkm::create([
                'name' => $validated['name'],
                'slug' => Str::slug($validated['name']) . '-' . Str::random(5),
                'category_id' => $validated['category_id'],
                'user_id' => $user->id,
                'admin_user_id' => $user->id,
                'owner_name' => $validated['owner_name'],
                'description' => $validated['description'] ?? null,
                'address' => $validated['address'] ?? null,
                'latitude' => $validated['latitude'] ?? null,
                'longitude' => $validated['longitude'] ?? null,
                'phone' => $validated['phone'] ?? null,
                'whatsapp' => $validated['whatsapp'] ?? null,
                'email' => $validated['email'] ?? null,
                'logo_id' => $logoId,
                'status' => UmkmStatus::ACTIVE,
            ]);

            DB::commit();

            // Flash generated password for display and redirect to gallery
            if (!$request->filled('admin_password')) {
                return redirect()
                    ->route('admin.umkm.gallery', $umkm)
                    ->with('success', "UMKM berhasil ditambahkan. Password akun: {$password}. Silakan tambahkan foto-foto UMKM.");
            }

            return redirect()
                ->route('admin.umkm.gallery', $umkm)
                ->with('success', 'UMKM berhasil ditambahkan. Silakan tambahkan foto-foto UMKM.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Gagal menambahkan UMKM: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified UMKM.
     */
    public function show(Umkm $umkm)
    {
        $umkm->load(['category', 'admin', 'logo', 'theme', 'gallery', 'products.media']);
        
        // Get article count
        $articleCount = \App\Models\Article::where('umkm_id', $umkm->id)->count();
        
        // Get page view stats
        $totalViews = \App\Models\PageView::where('umkm_id', $umkm->id)->count();
        $monthlyViews = \App\Models\PageView::where('umkm_id', $umkm->id)
            ->where('viewed_at', '>=', now()->startOfMonth())
            ->count();

        // Transform products to include thumbnail
        $products = $umkm->products->map(function ($product) {
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

        return Inertia::render('Admin/Umkm/Show', [
            'umkm' => array_merge($umkm->toArray(), ['products' => $products]),
            'stats' => [
                'products' => $umkm->products->count(),
                'articles' => $articleCount,
                'gallery' => $umkm->gallery->count(),
                'total_views' => $totalViews,
                'monthly_views' => $monthlyViews,
            ],
        ]);
    }

    /**
     * Show the form for editing the specified UMKM.
     */
    public function edit(Umkm $umkm)
    {
        $umkm->load(['category', 'admin', 'logo']);
        $categories = Category::orderBy('name')->get();

        return Inertia::render('Admin/Umkm/Edit', [
            'umkm' => $umkm,
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified UMKM.
     */
    public function update(Request $request, Umkm $umkm)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'owner_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'address' => 'nullable|string|max:500',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'phone' => 'nullable|string|max:20',
            'whatsapp' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'status' => 'required|in:active,inactive,suspended',
            'is_featured' => 'nullable',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'remove_logo' => 'nullable',
        ]);

        // Update slug if name changed
        if ($umkm->name !== $validated['name']) {
            $validated['slug'] = Str::slug($validated['name']) . '-' . Str::random(5);
        }

        // Handle logo
        $logoId = $umkm->logo_id;
        
        // Remove logo if requested
        if ($request->boolean('remove_logo') && $umkm->logo_id) {
            $oldMedia = MediaFile::find($umkm->logo_id);
            if ($oldMedia) {
                Storage::disk('public')->delete($oldMedia->file_path);
                $oldMedia->delete();
            }
            $logoId = null;
        }
        
        // Upload new logo
        if ($request->hasFile('logo')) {
            // Delete old logo first
            if ($umkm->logo_id) {
                $oldMedia = MediaFile::find($umkm->logo_id);
                if ($oldMedia) {
                    Storage::disk('public')->delete($oldMedia->file_path);
                    $oldMedia->delete();
                }
            }
            
            $file = $request->file('logo');
            $path = $file->store('umkm/logos', 'public');
            
            $mediaFile = MediaFile::create([
                'file_path' => $path,
                'file_type' => MediaType::IMAGE,
                'alt_text' => $validated['name'] . ' logo',
                'uploaded_by' => auth()->id(),
            ]);
            $logoId = $mediaFile->id;
        }

        $umkm->update([
            'name' => $validated['name'],
            'slug' => $validated['slug'] ?? $umkm->slug,
            'category_id' => $validated['category_id'],
            'owner_name' => $validated['owner_name'],
            'description' => $validated['description'],
            'address' => $validated['address'],
            'latitude' => $validated['latitude'],
            'longitude' => $validated['longitude'],
            'phone' => $validated['phone'],
            'whatsapp' => $validated['whatsapp'],
            'email' => $validated['email'],
            'status' => $validated['status'],
            'is_featured' => $request->boolean('is_featured'),
            'logo_id' => $logoId,
        ]);

        return redirect()
            ->route('admin.umkm.index')
            ->with('success', 'UMKM berhasil diperbarui.');
    }

    /**
     * Toggle UMKM status (active/inactive/suspended).
     */
    public function toggleStatus(Request $request, Umkm $umkm)
    {
        $validated = $request->validate([
            'status' => 'required|in:active,inactive,suspended',
        ]);

        $umkm->update(['status' => $validated['status']]);

        $statusLabels = [
            'active' => 'diaktifkan',
            'inactive' => 'dinonaktifkan',
            'suspended' => 'ditangguhkan',
        ];

        return back()->with('success', "UMKM berhasil {$statusLabels[$validated['status']]}.");
    }

    /**
     * Toggle UMKM featured status.
     */
    public function toggleFeatured(Umkm $umkm)
    {
        $umkm->update(['is_featured' => !$umkm->is_featured]);

        $message = $umkm->is_featured 
            ? 'UMKM berhasil ditandai sebagai unggulan.'
            : 'UMKM berhasil dihapus dari unggulan.';

        return back()->with('success', $message);
    }

    /**
     * Remove the specified UMKM.
     */
    public function destroy(Umkm $umkm)
    {
        // Soft delete - keep data for audit
        $umkm->delete();

        return redirect()
            ->route('admin.umkm.index')
            ->with('success', 'UMKM berhasil dihapus.');
    }

    /**
     * Show the gallery management page.
     */
    public function gallery(Umkm $umkm)
    {
        $umkm->load(['category', 'logo', 'gallery']);

        return Inertia::render('Admin/Umkm/Gallery', [
            'umkm' => $umkm,
        ]);
    }

    /**
     * Upload images to UMKM gallery.
     */
    public function uploadGallery(Request $request, Umkm $umkm)
    {
        $request->validate([
            'images' => 'required|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ]);

        $uploadedMedia = [];
        $currentMaxOrder = UmkmMedia::where('umkm_id', $umkm->id)->max('sort_order') ?? -1;

        foreach ($request->file('images') as $index => $file) {
            $path = $file->store('umkm/gallery/' . $umkm->id, 'public');
            
            $mediaFile = MediaFile::create([
                'file_path' => $path,
                'file_type' => MediaType::IMAGE,
                'alt_text' => $umkm->name . ' gallery image',
                'uploaded_by' => auth()->id(),
            ]);

            UmkmMedia::create([
                'umkm_id' => $umkm->id,
                'media_id' => $mediaFile->id,
                'sort_order' => $currentMaxOrder + $index + 1,
            ]);

            $uploadedMedia[] = $mediaFile;
        }

        return back()->with('success', count($uploadedMedia) . ' foto berhasil diupload.');
    }

    /**
     * Delete an image from UMKM gallery.
     */
    public function deleteGalleryImage(Umkm $umkm, MediaFile $media)
    {
        // Check if media belongs to this UMKM
        $umkmMedia = UmkmMedia::where('umkm_id', $umkm->id)
            ->where('media_id', $media->id)
            ->first();

        if (!$umkmMedia) {
            return back()->with('error', 'Foto tidak ditemukan.');
        }

        // Delete file from storage
        Storage::disk('public')->delete($media->file_path);
        
        // Delete records
        $umkmMedia->delete();
        $media->delete();

        return back()->with('success', 'Foto berhasil dihapus.');
    }

    /**
     * Reorder gallery images.
     */
    public function reorderGallery(Request $request, Umkm $umkm)
    {
        $request->validate([
            'order' => 'required|array',
            'order.*' => 'uuid',
        ]);

        foreach ($request->order as $index => $mediaId) {
            UmkmMedia::where('umkm_id', $umkm->id)
                ->where('media_id', $mediaId)
                ->update(['sort_order' => $index]);
        }

        return back()->with('success', 'Urutan foto berhasil diperbarui.');
    }
}
