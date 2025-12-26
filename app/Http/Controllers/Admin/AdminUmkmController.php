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

            // Flash generated password for display
            if (!$request->filled('admin_password')) {
                return redirect()
                    ->route('admin.umkm.index')
                    ->with('success', "UMKM berhasil ditambahkan. Password akun: {$password}");
            }

            return redirect()
                ->route('admin.umkm.index')
                ->with('success', 'UMKM berhasil ditambahkan.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Gagal menambahkan UMKM: ' . $e->getMessage());
        }
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
}
