<?php

namespace App\Models;

use App\Enums\UserRole;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

/**
 * Model User untuk Admin Desa & Admin UMKM.
 * 
 * Role:
 * - admin_desa: Super admin yang mengelola seluruh platform
 * - admin_umkm: Pemilik UMKM yang mengelola usahanya sendiri
 * 
 * Guest tidak disimpan di database.
 */
class User extends Authenticatable
{
    use HasFactory, HasUuids, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'is_active',
        'last_login_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'last_login_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
            'role' => UserRole::class,
        ];
    }

    /* =====================================================
     * RELATIONSHIPS
     * ===================================================== */

    /**
     * UMKM yang dimiliki user (1:1, hanya untuk admin_umkm).
     */
    public function umkm(): HasOne
    {
        return $this->hasOne(Umkm::class);
    }

    /**
     * File media yang diupload oleh user.
     */
    public function mediaFiles(): HasMany
    {
        return $this->hasMany(MediaFile::class, 'uploaded_by');
    }

    /**
     * Revisi artikel yang dibuat oleh user.
     */
    public function articleRevisions(): HasMany
    {
        return $this->hasMany(ArticleRevision::class, 'edited_by');
    }

    /**
     * Log aktivitas user.
     */
    public function activityLogs(): HasMany
    {
        return $this->hasMany(ActivityLog::class);
    }

    /* =====================================================
     * HELPER METHODS
     * ===================================================== */

    /**
     * Cek apakah user adalah Admin Desa.
     */
    public function isAdminDesa(): bool
    {
        return $this->role === UserRole::ADMIN_DESA;
    }

    /**
     * Cek apakah user adalah Admin UMKM.
     */
    public function isAdminUmkm(): bool
    {
        return $this->role === UserRole::ADMIN_UMKM;
    }
}
