<?php

namespace App\Http\Controllers\Umkm;

use App\Http\Controllers\Controller;
use App\Models\UmkmTheme;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controller untuk mengelola branding/tampilan UMKM.
 * 
 * Fitur:
 * - Pilih warna primary & secondary
 * - Preview langsung
 * - Reset ke default desa
 */
class UmkmBrandingController extends Controller
{
    /**
     * Show the branding edit form.
     */
    public function edit(Request $request): Response
    {
        $umkm = $request->user()->umkm;
        $umkm->load('theme');

        // Default colors jika belum ada theme
        $theme = $umkm->theme ?? [
            'primary_color' => '#0ea5e9',
            'secondary_color' => '#06b6d4',
            'accent_color' => '#f59e0b',
        ];

        return Inertia::render('Umkm/Branding/Edit', [
            'umkm' => $umkm,
            'theme' => $theme,
            'defaultColors' => [
                'primary' => '#0ea5e9',
                'secondary' => '#06b6d4',
                'accent' => '#f59e0b',
            ],
        ]);
    }

    /**
     * Update the UMKM branding/theme.
     */
    public function update(Request $request)
    {
        $umkm = $request->user()->umkm;

        $validated = $request->validate([
            'primary_color' => 'required|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'secondary_color' => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'accent_color' => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
        ]);

        UmkmTheme::updateOrCreate(
            ['umkm_id' => $umkm->id],
            [
                'primary_color' => $validated['primary_color'],
                'secondary_color' => $validated['secondary_color'] ?? $validated['primary_color'],
                'accent_color' => $validated['accent_color'] ?? '#f59e0b',
            ]
        );

        return back()->with('success', 'Branding UMKM berhasil diperbarui.');
    }

    /**
     * Reset branding to default desa theme.
     */
    public function reset(Request $request)
    {
        $umkm = $request->user()->umkm;

        // Delete custom theme
        UmkmTheme::where('umkm_id', $umkm->id)->delete();

        return back()->with('success', 'Branding berhasil direset ke default.');
    }
}
