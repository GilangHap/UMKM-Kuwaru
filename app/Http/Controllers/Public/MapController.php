<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Setting;
use App\Models\Umkm;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controller untuk peta UMKM interaktif.
 */
class MapController extends Controller
{
    /**
     * Display UMKM map.
     */
    public function index(Request $request): Response
    {
        // Get map center from settings
        $settings = Setting::getMany([
            'map_center_lat',
            'map_center_lng',
            'map_default_zoom',
        ]);

        // Get all UMKMs with coordinates
        $query = Umkm::where('status', 'active')
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->with(['category', 'logo']);

        // Filter by category
        if ($request->filled('category')) {
            $query->where('category_id', $request->category);
        }

        $umkms = $query->get()
            ->map(function ($umkm) {
                return [
                    'id' => $umkm->id,
                    'name' => $umkm->name,
                    'slug' => $umkm->slug,
                    'tagline' => $umkm->tagline,
                    'category' => $umkm->category?->name,
                    'category_id' => $umkm->category_id,
                    'latitude' => (float) $umkm->latitude,
                    'longitude' => (float) $umkm->longitude,
                    'logo_url' => $umkm->logo ? "/storage/{$umkm->logo->file_path}" : null,
                ];
            });

        $categories = Category::orderBy('name')->get(['id', 'name', 'slug']);

        return Inertia::render('Public/Map', [
            'umkms' => $umkms,
            'categories' => $categories,
            'mapCenter' => [
                'lat' => (float) ($settings['map_center_lat'] ?? -7.9797),
                'lng' => (float) ($settings['map_center_lng'] ?? 110.3643),
            ],
            'mapZoom' => (int) ($settings['map_default_zoom'] ?? 14),
            'filters' => [
                'category' => $request->category ?? '',
            ],
        ]);
    }
}
