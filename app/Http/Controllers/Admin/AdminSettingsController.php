<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AdminSettingsController extends Controller
{
    /**
     * Display the settings page.
     */
    public function index()
    {
        $settings = [
            'site_name' => Setting::get('site_name', 'Desa Kuwaru'),
            'site_description' => Setting::get('site_description', ''),
            'site_logo' => Setting::get('site_logo'),
            'contact_email' => Setting::get('contact_email'),
            'contact_phone' => Setting::get('contact_phone'),
            'village_address' => Setting::get('village_address'),
            'footer_text' => Setting::get('footer_text'),
            'map_center_lat' => Setting::get('map_center_lat', -7.9797),
            'map_center_lng' => Setting::get('map_center_lng', 110.2827),
        ];

        return Inertia::render('Admin/Settings/Index', [
            'settings' => $settings,
        ]);
    }

    /**
     * Update the settings.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'site_name' => 'required|string|max:100',
            'site_description' => 'nullable|string|max:500',
            'site_logo' => 'nullable|image|mimes:jpeg,png,jpg,svg|max:2048',
            'contact_email' => 'nullable|email|max:255',
            'contact_phone' => 'nullable|string|max:20',
            'village_address' => 'nullable|string|max:500',
            'footer_text' => 'nullable|string|max:500',
            'map_center_lat' => 'nullable|numeric|between:-90,90',
            'map_center_lng' => 'nullable|numeric|between:-180,180',
        ]);

        // Handle logo upload
        if ($request->hasFile('site_logo')) {
            // Delete old logo
            $oldLogo = Setting::get('site_logo');
            if ($oldLogo && Storage::disk('public')->exists($oldLogo)) {
                Storage::disk('public')->delete($oldLogo);
            }

            // Store new logo
            $path = $request->file('site_logo')->store('logos', 'public');
            Setting::set('site_logo', '/storage/' . $path);
        }

        // Update settings
        Setting::set('site_name', $validated['site_name']);
        Setting::set('site_description', $validated['site_description'] ?? '');
        Setting::set('contact_email', $validated['contact_email'] ?? '');
        Setting::set('contact_phone', $validated['contact_phone'] ?? '');
        Setting::set('village_address', $validated['village_address'] ?? '');
        Setting::set('footer_text', $validated['footer_text'] ?? '');
        Setting::set('map_center_lat', $validated['map_center_lat'] ?? -7.9797);
        Setting::set('map_center_lng', $validated['map_center_lng'] ?? 110.2827);

        // Clear cache
        Cache::forget('site_settings');
        Cache::forget('default_theme');

        return back()->with('success', 'Pengaturan berhasil disimpan.');
    }
}
