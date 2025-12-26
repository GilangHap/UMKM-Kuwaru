<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

/**
 * Middleware untuk memastikan user aktif.
 * 
 * Jika user tidak aktif (is_active = false):
 * - Logout paksa
 * - Redirect ke login dengan pesan error
 * 
 * Middleware ini harus dijalankan setelah 'auth'.
 */
class EnsureUserIsActive
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // Jika tidak ada user, biarkan middleware auth yang handle
        if (!$user) {
            return $next($request);
        }

        // Cek apakah user aktif
        if (!$user->is_active) {
            // Logout user
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            // Redirect dengan pesan error yang ramah
            return redirect()
                ->route('login')
                ->withErrors([
                    'email' => 'Akun Anda telah dinonaktifkan. Silakan hubungi Administrator Desa untuk informasi lebih lanjut.',
                ]);
        }

        return $next($request);
    }
}
