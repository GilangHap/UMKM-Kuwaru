<?php

namespace App\Http\Middleware;

use App\Enums\UserRole;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Middleware untuk validasi role user.
 * 
 * Penggunaan:
 * - role:admin_desa  → Hanya admin desa
 * - role:admin_umkm  → Hanya admin UMKM
 * - role:any         → admin_desa atau admin_umkm
 * 
 * @example Route::middleware('role:admin_desa')
 * @example Route::middleware('role:admin_umkm')
 * @example Route::middleware('role:any')
 */
class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  $role  Role yang diizinkan (admin_desa, admin_umkm, atau any)
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        // Pastikan user sudah login
        if (!$request->user()) {
            return redirect()->route('login');
        }

        $userRole = $request->user()->role;

        // Jika role adalah 'any', izinkan semua role yang valid
        if ($role === 'any') {
            $allowedRoles = [UserRole::ADMIN_DESA, UserRole::ADMIN_UMKM];
            
            if (!in_array($userRole, $allowedRoles)) {
                abort(403, 'Anda tidak memiliki akses ke halaman ini.');
            }
            
            return $next($request);
        }

        // Map string role ke enum
        $requiredRole = match ($role) {
            'admin_desa' => UserRole::ADMIN_DESA,
            'admin_umkm' => UserRole::ADMIN_UMKM,
            default => null,
        };

        // Validasi role
        if ($requiredRole === null || $userRole !== $requiredRole) {
            abort(403, 'Anda tidak memiliki akses ke halaman ini.');
        }

        return $next($request);
    }
}
