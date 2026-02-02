<?php

namespace App\Http\Controllers\Umkm;

use App\Http\Controllers\Controller;
use App\Models\MediaFile;
use App\Models\UmkmMedia;
use App\Enums\MediaType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class UmkmGalleryController extends Controller
{
    /**
     * Display the UMKM gallery management page.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $umkm = $user->umkm;
        
        $umkm->load(['logo', 'gallery', 'category']);

        return Inertia::render('Umkm/Gallery', [
            'umkm' => $umkm,
        ]);
    }

    /**
     * Upload images to UMKM gallery.
     */
    public function upload(Request $request)
    {
        $request->validate([
            'images' => 'required|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ]);

        $user = $request->user();
        $umkm = $user->umkm;

        $uploadedMedia = [];
        $currentMaxOrder = UmkmMedia::where('umkm_id', $umkm->id)->max('sort_order') ?? -1;

        foreach ($request->file('images') as $index => $file) {
            $path = $file->store('umkm/gallery/' . $umkm->id, 'public');
            
            $mediaFile = MediaFile::create([
                'file_path' => $path,
                'file_type' => MediaType::IMAGE,
                'alt_text' => $umkm->name . ' gallery image',
                'uploaded_by' => $user->id,
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
    public function destroy(Request $request, MediaFile $media)
    {
        $user = $request->user();
        $umkm = $user->umkm;

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
    public function reorder(Request $request)
    {
        $request->validate([
            'order' => 'required|array',
            'order.*' => 'uuid',
        ]);

        $user = $request->user();
        $umkm = $user->umkm;

        foreach ($request->order as $index => $mediaId) {
            UmkmMedia::where('umkm_id', $umkm->id)
                ->where('media_id', $mediaId)
                ->update(['sort_order' => $index]);
        }

        return back()->with('success', 'Urutan foto berhasil diperbarui.');
    }
}
