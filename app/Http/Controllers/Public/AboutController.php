<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Models\Umkm;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controller untuk halaman Tentang Desa.
 */
class AboutController extends Controller
{
    /**
     * Display about page.
     */
    public function index(): Response
    {
        $settings = Setting::getMany([
            'site_name',
            'site_description',
            'village_name',
            'village_description',
            'village_vision',
            'village_address',
            'contact_email',
            'contact_phone',
        ]);

        // Stats
        $stats = [
            'total_umkm' => Umkm::where('status', 'active')->count(),
        ];

        return Inertia::render('Public/About', [
            'settings' => $settings,
            'stats' => $stats,
        ]);
    }
}
