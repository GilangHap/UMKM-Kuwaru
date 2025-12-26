<?php

namespace App\Policies;

use App\Enums\ArticleStatus;
use App\Enums\UserRole;
use App\Models\Article;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

/**
 * Policy untuk otorisasi aksi pada Article.
 * 
 * Aturan:
 * - admin_desa: Akses penuh + bisa approve/reject
 * - admin_umkm: CRUD artikel miliknya (via UMKM)
 */
class ArticlePolicy
{
    use HandlesAuthorization;

    /**
     * Determine if the user can view any articles.
     * 
     * admin_desa: ✅ Lihat semua
     * admin_umkm: ✅ Lihat artikel UMKM-nya
     */
    public function viewAny(User $user): bool
    {
        // Semua role bisa view list (dengan filter masing-masing)
        return in_array($user->role, [UserRole::ADMIN_DESA, UserRole::ADMIN_UMKM]);
    }

    /**
     * Determine if the user can view the article.
     * 
     * admin_desa: ✅ Lihat semua
     * admin_umkm: ✅ Hanya artikel UMKM-nya
     */
    public function view(User $user, Article $article): bool
    {
        if ($user->role === UserRole::ADMIN_DESA) {
            return true;
        }

        // admin_umkm hanya bisa view artikel UMKM-nya
        return $user->role === UserRole::ADMIN_UMKM 
            && $user->umkm
            && $article->umkm_id === $user->umkm->id;
    }

    /**
     * Determine if the user can create articles.
     * 
     * admin_desa: ✅ Bisa create untuk UMKM manapun
     * admin_umkm: ✅ Bisa create untuk UMKM-nya
     */
    public function create(User $user): bool
    {
        if ($user->role === UserRole::ADMIN_DESA) {
            return true;
        }

        // admin_umkm harus punya UMKM untuk create artikel
        return $user->role === UserRole::ADMIN_UMKM && $user->umkm;
    }

    /**
     * Determine if the user can update the article.
     * 
     * admin_desa: ✅ Update semua
     * admin_umkm: ✅ Hanya artikel UMKM-nya (dan belum approved)
     */
    public function update(User $user, Article $article): bool
    {
        if ($user->role === UserRole::ADMIN_DESA) {
            return true;
        }

        // admin_umkm hanya bisa update artikel UMKM-nya
        if ($user->role !== UserRole::ADMIN_UMKM || !$user->umkm) {
            return false;
        }

        if ($article->umkm_id !== $user->umkm->id) {
            return false;
        }

        // Tidak bisa update jika sudah approved (harus minta admin desa)
        // Tapi bisa update jika masih draft atau rejected
        return in_array($article->status, [
            ArticleStatus::DRAFT,
            ArticleStatus::REJECTED,
            ArticleStatus::PENDING,
        ]);
    }

    /**
     * Determine if the user can delete the article.
     * 
     * admin_desa: ✅ Delete semua
     * admin_umkm: ✅ Hanya draft miliknya
     */
    public function delete(User $user, Article $article): bool
    {
        if ($user->role === UserRole::ADMIN_DESA) {
            return true;
        }

        // admin_umkm hanya bisa delete draft artikel UMKM-nya
        return $user->role === UserRole::ADMIN_UMKM 
            && $user->umkm
            && $article->umkm_id === $user->umkm->id
            && $article->status === ArticleStatus::DRAFT;
    }

    /**
     * Determine if the user can approve the article.
     * 
     * admin_desa: ✅ Bisa approve
     * admin_umkm: ❌ Tidak bisa approve
     */
    public function approve(User $user, Article $article): bool
    {
        // Hanya admin desa yang bisa approve
        if ($user->role !== UserRole::ADMIN_DESA) {
            return false;
        }

        // Hanya artikel pending yang bisa di-approve
        return $article->status === ArticleStatus::PENDING;
    }

    /**
     * Determine if the user can reject the article.
     * 
     * admin_desa: ✅ Bisa reject
     * admin_umkm: ❌ Tidak bisa reject
     */
    public function reject(User $user, Article $article): bool
    {
        // Hanya admin desa yang bisa reject
        if ($user->role !== UserRole::ADMIN_DESA) {
            return false;
        }

        // Hanya artikel pending yang bisa di-reject
        return $article->status === ArticleStatus::PENDING;
    }

    /**
     * Determine if the user can submit article for review.
     * 
     * admin_desa: ❌ Tidak perlu submit
     * admin_umkm: ✅ Submit draft untuk review
     */
    public function submit(User $user, Article $article): bool
    {
        // admin_desa tidak perlu submit (langsung approve)
        if ($user->role === UserRole::ADMIN_DESA) {
            return false;
        }

        // admin_umkm bisa submit draft/rejected untuk review
        return $user->role === UserRole::ADMIN_UMKM 
            && $user->umkm
            && $article->umkm_id === $user->umkm->id
            && in_array($article->status, [ArticleStatus::DRAFT, ArticleStatus::REJECTED]);
    }
}
