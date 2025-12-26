<?php

namespace App\Http\Controllers\Umkm;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controller untuk akun & keamanan UMKM owner.
 * 
 * Fitur:
 * - Lihat info akun
 * - Ubah password
 */
class UmkmAccountController extends Controller
{
    /**
     * Display account information.
     */
    public function show(Request $request): Response
    {
        $user = $request->user();
        $umkm = $user->umkm;

        return Inertia::render('Umkm/Account/Index', [
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'created_at' => $user->created_at,
            ],
            'umkm' => [
                'name' => $umkm->name,
                'status' => $umkm->status,
            ],
        ]);
    }

    /**
     * Update the user's password.
     */
    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => 'required|current_password',
            'password' => ['required', 'confirmed', Password::defaults()],
        ], [
            'current_password.current_password' => 'Password saat ini tidak sesuai.',
        ]);

        $request->user()->update([
            'password' => Hash::make($validated['password']),
        ]);

        return back()->with('success', 'Password berhasil diubah.');
    }
}
