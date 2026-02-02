<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Model UmkmMedia sebagai pivot table untuk Umkm ↔ MediaFile.
 * 
 * Mendukung:
 * - Multiple images per UMKM (galeri foto)
 * - Urutan kustom (sort_order)
 * - Thumbnail detection (sort_order = 0)
 */
class UmkmMedia extends Pivot
{
    use HasFactory, HasUuids;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'umkm_media';

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
        'umkm_id',
        'media_id',
        'sort_order',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
            'created_at' => 'datetime',
        ];
    }

    /* =====================================================
     * RELATIONSHIPS
     * ===================================================== */

    /**
     * UMKM yang memiliki media ini.
     */
    public function umkm(): BelongsTo
    {
        return $this->belongsTo(Umkm::class);
    }

    /**
     * File media.
     */
    public function media(): BelongsTo
    {
        return $this->belongsTo(MediaFile::class, 'media_id');
    }

    /* =====================================================
     * HELPER METHODS
     * ===================================================== */

    /**
     * Cek apakah ini adalah thumbnail (gambar utama).
     */
    public function isThumbnail(): bool
    {
        return $this->sort_order === 0;
    }
}
