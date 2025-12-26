<?php

namespace App\Http\Middleware;

use App\Enums\UserRole;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Middleware khusus untuk admin_umkm.
 * 
 * Memastikan user dengan role admin_umkm memiliki UMKM terkait.
 * Jika tidak punya UMKM, redirect dengan pesan error.
 * 
 * Middleware ini harus dijalankan setelah 'auth' dan 'role:admin_umkm'.
 */
class EnsureUmkmLinked
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

        // Hanya cek untuk admin_umkm
        if ($user->role === UserRole::ADMIN_UMKM) {
            // Cek apakah user punya UMKM
            if (!$user->umkm) {
                // Redirect dengan pesan error yang ramah
                return redirect()
                    ->route('login')
                    ->withErrors([
                        'email' => 'Akun Anda belum terhubung dengan UMKM. Silakan hubungi Administrator Desa untuk mengaktifkan akun.',
                    ]);
            }

            // Cek apakah UMKM aktif
            if (!$user->umkm->isActive()) {
                return redirect()
                    ->route('login')
                    ->withErrors([
                        'email' => 'UMKM Anda sedang tidak aktif atau ditangguhkan. Silakan hubungi Administrator Desa.',
                    ]);
            }
        }

        return $next($request);
    }
}
