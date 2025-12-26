<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\Umkm;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

/**
 * Policy untuk otorisasi aksi pada UMKM.
 * 
 * Aturan:
 * - admin_desa: Akses penuh ke semua UMKM
 * - admin_umkm: Hanya bisa akses UMKM miliknya sendiri
 */
class UmkmPolicy
{
    use HandlesAuthorization;

    /**
     * Determine if the user can view any UMKM.
     * 
     * admin_desa: ✅ Lihat semua
     * admin_umkm: ❌ Tidak bisa lihat list semua
     */
    public function viewAny(User $user): bool
    {
        return $user->role === UserRole::ADMIN_DESA;
    }

    /**
     * Determine if the user can view the UMKM.
     * 
     * admin_desa: ✅ Lihat semua
     * admin_umkm: ✅ Hanya miliknya
     */
    public function view(User $user, Umkm $umkm): bool
    {
        if ($user->role === UserRole::ADMIN_DESA) {
            return true;
        }

        return $user->role === UserRole::ADMIN_UMKM 
            && $user->id === $umkm->user_id;
    }

    /**
     * Determine if the user can create UMKM.
     * 
     * admin_desa: ✅ Bisa create
     * admin_umkm: ❌ Tidak bisa create (sudah punya 1)
     */
    public function create(User $user): bool
    {
        return $user->role === UserRole::ADMIN_DESA;
    }

    /**
     * Determine if the user can update the UMKM.
     * 
     * admin_desa: ✅ Update semua
     * admin_umkm: ✅ Hanya miliknya
     */
    public function update(User $user, Umkm $umkm): bool
    {
        if ($user->role === UserRole::ADMIN_DESA) {
            return true;
        }

        return $user->role === UserRole::ADMIN_UMKM 
            && $user->id === $umkm->user_id;
    }

    /**
     * Determine if the user can delete the UMKM.
     * 
     * admin_desa: ✅ Delete semua
     * admin_umkm: ❌ Tidak bisa delete
     */
    public function delete(User $user, Umkm $umkm): bool
    {
        return $user->role === UserRole::ADMIN_DESA;
    }

    /**
     * Determine if the user can change UMKM status (activate/suspend).
     * 
     * admin_desa: ✅ Bisa ubah status
     * admin_umkm: ❌ Tidak bisa ubah status
     */
    public function changeStatus(User $user, Umkm $umkm): bool
    {
        return $user->role === UserRole::ADMIN_DESA;
    }

    /**
     * Determine if the user can manage UMKM theme.
     * 
     * admin_desa: ✅ Manage semua theme
     * admin_umkm: ✅ Hanya theme miliknya
     */
    public function manageTheme(User $user, Umkm $umkm): bool
    {
        if ($user->role === UserRole::ADMIN_DESA) {
            return true;
        }

        return $user->role === UserRole::ADMIN_UMKM 
            && $user->id === $umkm->user_id;
    }
}
