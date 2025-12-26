<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MediaFile;
use App\Enums\MediaType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class EditorImageController extends Controller
{
    /**
     * Upload an image for the rich text editor.
     */
    public function upload(Request $request)
    {
        try {
            $request->validate([
                'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            ]);

            $file = $request->file('image');
            $path = $file->store('editor', 'public');

            $mediaFile = MediaFile::create([
                'file_path' => $path,
                'file_type' => MediaType::IMAGE,
                'alt_text' => pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME),
                'uploaded_by' => auth()->id(),
            ]);

            return response()->json([
                'url' => $mediaFile->url,
            ]);
        } catch (\Exception $e) {
            Log::error('Editor image upload error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Gagal upload: ' . $e->getMessage(),
            ], 500);
        }
    }
}

