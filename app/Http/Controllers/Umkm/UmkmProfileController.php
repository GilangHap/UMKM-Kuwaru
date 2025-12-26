<?php

namespace App\Http\Controllers\Umkm;

use App\Http\Controllers\Controller;
use App\Models\MediaFile;
use App\Enums\MediaType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controller untuk mengelola profil UMKM.
 * 
 * Fitur:
 * - Edit informasi dasar UMKM
 * - Upload logo
 * - Input Google Maps link → auto extract lat/lng
 */
class UmkmProfileController extends Controller
{
    /**
     * Show the profile edit form.
     */
    public function edit(Request $request): Response
    {
        $umkm = $request->user()->umkm;
        $umkm->load(['category', 'logo']);

        return Inertia::render('Umkm/Profile/Edit', [
            'umkm' => $umkm,
        ]);
    }

    /**
     * Update the UMKM profile.
     */
    public function update(Request $request)
    {
        $umkm = $request->user()->umkm;

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:2000',
            'address' => 'nullable|string|max:500',
            'phone' => 'nullable|string|max:20',
            'whatsapp' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'remove_logo' => 'nullable|boolean',
        ]);

        // Handle logo upload
        $logoId = $umkm->logo_id;

        if ($request->boolean('remove_logo') && $umkm->logo_id) {
            $oldMedia = MediaFile::find($umkm->logo_id);
            if ($oldMedia) {
                Storage::disk('public')->delete($oldMedia->file_path);
                $oldMedia->delete();
            }
            $logoId = null;
        }

        if ($request->hasFile('logo')) {
            // Delete old logo
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
                'uploaded_by' => $request->user()->id,
            ]);
            $logoId = $mediaFile->id;
        }

        $umkm->update([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'address' => $validated['address'],
            'phone' => $validated['phone'],
            'whatsapp' => $validated['whatsapp'],
            'email' => $validated['email'],
            'latitude' => $validated['latitude'],
            'longitude' => $validated['longitude'],
            'logo_id' => $logoId,
        ]);

        return back()->with('success', 'Profil UMKM berhasil diperbarui.');
    }

    /**
     * Resolve Google Maps short URL and extract coordinates.
     */
    public function resolveMapUrl(Request $request)
    {
        $request->validate([
            'url' => 'required|url',
        ]);

        $url = $request->url;

        try {
            // Follow redirects for shortened URLs
            if (str_contains($url, 'goo.gl') || str_contains($url, 'maps.app')) {
                $url = $this->followRedirects($url);
            }

            $coords = $this->extractCoordinates($url);

            if ($coords) {
                return response()->json([
                    'success' => true,
                    'latitude' => $coords['lat'],
                    'longitude' => $coords['lng'],
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Tidak dapat mengambil koordinat dari URL',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memproses URL',
            ], 500);
        }
    }

    private function followRedirects(string $url, int $max = 5): string
    {
        $current = $url;
        for ($i = 0; $i < $max; $i++) {
            $response = Http::withOptions(['allow_redirects' => false, 'verify' => false])
                ->withHeaders(['User-Agent' => 'Mozilla/5.0'])
                ->get($current);

            if ($response->status() >= 300 && $response->status() < 400) {
                $location = $response->header('Location');
                if ($location) {
                    if (!str_starts_with($location, 'http')) {
                        $parsed = parse_url($current);
                        $location = $parsed['scheme'] . '://' . $parsed['host'] . $location;
                    }
                    $current = $location;
                    continue;
                }
            }
            break;
        }
        return $current;
    }

    private function extractCoordinates(string $url): ?array
    {
        $decoded = urldecode($url);

        if (preg_match('/@(-?\d+\.?\d*),(-?\d+\.?\d*)/', $decoded, $m)) {
            return ['lat' => $m[1], 'lng' => $m[2]];
        }
        if (preg_match('/!3d(-?\d+\.?\d*)!4d(-?\d+\.?\d*)/', $decoded, $m)) {
            return ['lat' => $m[1], 'lng' => $m[2]];
        }
        if (preg_match('/[?&](?:q|ll)=(-?\d+\.?\d*),(-?\d+\.?\d*)/', $decoded, $m)) {
            return ['lat' => $m[1], 'lng' => $m[2]];
        }
        if (preg_match('/!8m2!3d(-?\d+\.?\d*)!4d(-?\d+\.?\d*)/', $decoded, $m)) {
            return ['lat' => $m[1], 'lng' => $m[2]];
        }

        return null;
    }
}
