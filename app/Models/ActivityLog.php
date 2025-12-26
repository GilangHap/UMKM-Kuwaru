<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Model ActivityLog untuk audit trail dan keamanan.
 * 
 * Mencatat aksi penting seperti:
 * - create, update, delete pada entitas
 * - login, logout
 * - Perubahan status moderasi
 * 
 * Immutable records - tidak pernah di-update atau dihapus.
 */
class ActivityLog extends Model
{
    use HasFactory, HasUuids;

    /**
     * Disable updated_at timestamp.
     */
    const UPDATED_AT = null;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'action',
        'target_type',
        'target_id',
        'description',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
        ];
    }

    /* =====================================================
     * RELATIONSHIPS
     * ===================================================== */

    /**
     * User yang melakukan aksi.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /* =====================================================
     * HELPER METHODS
     * ===================================================== */

    /**
     * Scope untuk filter berdasarkan aksi.
     */
    public function scopeOfAction($query, string $action)
    {
        return $query->where('action', $action);
    }

    /**
     * Scope untuk filter berdasarkan target type.
     */
    public function scopeOfTargetType($query, string $targetType)
    {
        return $query->where('target_type', $targetType);
    }

    /**
     * Scope untuk filter berdasarkan target spesifik.
     */
    public function scopeForTarget($query, string $targetType, string $targetId)
    {
        return $query->where('target_type', $targetType)
                     ->where('target_id', $targetId);
    }

    /**
     * Scope untuk audit per user.
     */
    public function scopeByUser($query, string $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Static helper untuk log aksi.
     */
    public static function log(
        string $userId,
        string $action,
        string $targetType,
        string $targetId,
        ?string $description = null
    ): self {
        return self::create([
            'user_id' => $userId,
            'action' => $action,
            'target_type' => $targetType,
            'target_id' => $targetId,
            'description' => $description,
        ]);
    }
}
