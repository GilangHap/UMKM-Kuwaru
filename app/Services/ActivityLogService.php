<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

/**
 * Service untuk mencatat aktivitas user.
 * 
 * Digunakan untuk:
 * - Audit trail
 * - Tracking aksi penting
 * - Keamanan dan compliance
 */
class ActivityLogService
{
    /**
     * Action constants untuk konsistensi.
     */
    public const ACTION_LOGIN = 'login';
    public const ACTION_LOGOUT = 'logout';
    public const ACTION_CREATE = 'create';
    public const ACTION_UPDATE = 'update';
    public const ACTION_DELETE = 'delete';
    public const ACTION_APPROVE = 'approve';
    public const ACTION_REJECT = 'reject';
    public const ACTION_VIEW = 'view';

    /**
     * Log aktivitas generik.
     *
     * @param User $user User yang melakukan aksi
     * @param string $action Jenis aksi (login, logout, create, update, dll)
     * @param string $targetType Tipe target (umkm, article, product, dll)
     * @param string $targetId UUID target
     * @param string|null $description Deskripsi tambahan (opsional)
     */
    public static function log(
        User $user,
        string $action,
        string $targetType,
        string $targetId,
        ?string $description = null
    ): ActivityLog {
        return ActivityLog::create([
            'user_id' => $user->id,
            'action' => $action,
            'target_type' => $targetType,
            'target_id' => $targetId,
            'description' => $description,
        ]);
    }

    /**
     * Log aktivitas login.
     */
    public static function logLogin(User $user): ActivityLog
    {
        return self::log(
            user: $user,
            action: self::ACTION_LOGIN,
            targetType: 'user',
            targetId: $user->id,
            description: 'User logged in successfully'
        );
    }

    /**
     * Log aktivitas logout.
     */
    public static function logLogout(User $user): ActivityLog
    {
        return self::log(
            user: $user,
            action: self::ACTION_LOGOUT,
            targetType: 'user',
            targetId: $user->id,
            description: 'User logged out'
        );
    }

    /**
     * Log aksi pada model Eloquent.
     *
     * @param User $user User yang melakukan aksi
     * @param string $action Jenis aksi
     * @param Model $model Model yang dikenai aksi
     * @param string|null $description Deskripsi tambahan
     */
    public static function logModelAction(
        User $user,
        string $action,
        Model $model,
        ?string $description = null
    ): ActivityLog {
        // Ambil nama tabel sebagai target_type
        $targetType = $model->getTable();
        
        // Singularize (hapus 's' di akhir jika ada)
        if (str_ends_with($targetType, 's')) {
            $targetType = substr($targetType, 0, -1);
        }

        return self::log(
            user: $user,
            action: $action,
            targetType: $targetType,
            targetId: $model->getKey(),
            description: $description
        );
    }

    /**
     * Log aksi create.
     */
    public static function logCreate(User $user, Model $model, ?string $description = null): ActivityLog
    {
        return self::logModelAction($user, self::ACTION_CREATE, $model, $description);
    }

    /**
     * Log aksi update.
     */
    public static function logUpdate(User $user, Model $model, ?string $description = null): ActivityLog
    {
        return self::logModelAction($user, self::ACTION_UPDATE, $model, $description);
    }

    /**
     * Log aksi delete.
     */
    public static function logDelete(User $user, Model $model, ?string $description = null): ActivityLog
    {
        return self::logModelAction($user, self::ACTION_DELETE, $model, $description);
    }

    /**
     * Log aksi approve (untuk artikel).
     */
    public static function logApprove(User $user, Model $model, ?string $description = null): ActivityLog
    {
        return self::logModelAction($user, self::ACTION_APPROVE, $model, $description);
    }

    /**
     * Log aksi reject (untuk artikel).
     */
    public static function logReject(User $user, Model $model, ?string $description = null): ActivityLog
    {
        return self::logModelAction($user, self::ACTION_REJECT, $model, $description);
    }
}
