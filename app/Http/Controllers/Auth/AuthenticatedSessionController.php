<?php

namespace App\Http\Controllers\Auth;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controller untuk autentikasi session.
 * 
 * Custom flow:
 * - Validasi is_active sebelum login
 * - Redirect berdasarkan role setelah login
 * - Validasi UMKM terhubung untuk admin_umkm
 */
class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
            'siteLogo' => \App\Models\Setting::get('site_logo'),
            'siteName' => \App\Models\Setting::get('site_name', 'UMKM Kuwaru'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        $user = $request->user();

        // Cek apakah user aktif (double check, middleware juga cek)
        if (!$user->is_active) {
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()
                ->route('login')
                ->withErrors([
                    'email' => 'Akun Anda telah dinonaktifkan. Silakan hubungi Administrator Desa.',
                ]);
        }

        // Redirect berdasarkan role
        return $this->redirectBasedOnRole($user);
    }

    /**
     * Redirect user berdasarkan role.
     */
    protected function redirectBasedOnRole($user): RedirectResponse
    {
        return match ($user->role) {
            UserRole::ADMIN_DESA => redirect()->route('admin.dashboard'),
            UserRole::ADMIN_UMKM => $this->redirectAdminUmkm($user),
            default => redirect()->route('login')->withErrors([
                'email' => 'Role tidak valid. Silakan hubungi Administrator.',
            ]),
        };
    }

    /**
     * Handle redirect untuk admin_umkm.
     */
    protected function redirectAdminUmkm($user): RedirectResponse
    {
        // Cek apakah punya UMKM
        if (!$user->umkm) {
            Auth::guard('web')->logout();
            
            return redirect()
                ->route('login')
                ->withErrors([
                    'email' => 'Akun Anda belum terhubung dengan UMKM. Silakan hubungi Administrator Desa.',
                ]);
        }

        // Cek apakah UMKM aktif
        if (!$user->umkm->isActive()) {
            Auth::guard('web')->logout();
            
            return redirect()
                ->route('login')
                ->withErrors([
                    'email' => 'UMKM Anda sedang tidak aktif atau ditangguhkan. Silakan hubungi Administrator Desa.',
                ]);
        }

        return redirect()->route('umkm.dashboard');
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
