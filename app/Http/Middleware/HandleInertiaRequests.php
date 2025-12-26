<?php

namespace App\Http\Middleware;

use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            
            // Auth user
            'auth' => [
                'user' => $request->user(),
            ],
            
            // Site settings
            'settings' => $this->getSiteSettings(),
            
            // Default theme (can be overridden per page)
            'theme' => $this->getDefaultTheme(),
            
            // Flash messages
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'warning' => fn () => $request->session()->get('warning'),
                'info' => fn () => $request->session()->get('info'),
            ],
        ];
    }

    /**
     * Get site settings from database.
     */
    protected function getSiteSettings(): array
    {
        // Cache settings untuk performance
        return cache()->remember('site_settings', 3600, function () {
            return [
                'site_name' => Setting::get('site_name', 'Desa Kuwaru'),
                'site_description' => Setting::get('site_description', 'Platform Digital UMKM Desa Kuwaru'),
                'site_logo' => Setting::get('site_logo'),
                'contact_email' => Setting::get('contact_email'),
                'contact_phone' => Setting::get('contact_phone'),
                'village_address' => Setting::get('village_address'),
                'map_center_lat' => Setting::get('map_center_lat', -7.9797),
                'map_center_lng' => Setting::get('map_center_lng', 110.2827),
            ];
        });
    }

    /**
     * Get default theme colors.
     */
    protected function getDefaultTheme(): array
    {
        return cache()->remember('default_theme', 3600, function () {
            return [
                'primary' => Setting::get('theme_primary', '22 163 74'),
                'primaryLight' => Setting::get('theme_primary_light', '34 197 94'),
                'primaryDark' => Setting::get('theme_primary_dark', '21 128 61'),
                'secondary' => Setting::get('theme_secondary', '34 197 94'),
                'accent' => Setting::get('theme_accent', '250 204 21'),
            ];
        });
    }
}
