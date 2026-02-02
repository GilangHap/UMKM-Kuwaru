<?php

namespace App\Models;

use App\Enums\MediaType;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

/**
 * Model MediaFile untuk manajemen file terpusat.
 * 
 * Digunakan untuk:
 * - Logo UMKM
 * - Gambar produk
 * - Gambar artikel
 * - Video promosi
 */
class MediaFile extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'file_path',
        'file_type',
        'alt_text',
        'uploaded_by',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array<string>
     */
    protected $appends = ['url'];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'file_type' => MediaType::class,
        ];
    }

    /**
     * Get the full URL for the media file.
     */
    public function getUrlAttribute(): string
    {
        return '/storage/' . $this->file_path;
    }

    /* =====================================================
     * RELATIONSHIPS
     * ===================================================== */

    /**
     * User yang mengupload file ini.
     */
    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    /**
     * Relasi ke product_media (pivot).
     */
    public function productMedia(): HasMany
    {
        return $this->hasMany(ProductMedia::class, 'media_id');
    }

    /**
     * UMKM yang menggunakan file ini sebagai logo.
     */
    public function logoForUmkm(): HasMany
    {
        return $this->hasMany(Umkm::class, 'logo_id');
    }

    /**
     * Relasi ke umkm_media (pivot) untuk galeri.
     */
    public function umkmMedia(): HasMany
    {
        return $this->hasMany(UmkmMedia::class, 'media_id');
    }

    /* =====================================================
     * HELPER METHODS
     * ===================================================== */

    /**
     * Cek apakah file adalah gambar.
     */
    public function isImage(): bool
    {
        return $this->file_type === MediaType::IMAGE;
    }

    /**
     * Cek apakah file adalah video.
     */
    public function isVideo(): bool
    {
        return $this->file_type === MediaType::VIDEO;
    }
}
