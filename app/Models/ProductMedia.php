<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Model ProductMedia sebagai pivot table untuk Product ↔ MediaFile.
 * 
 * Mendukung:
 * - Multiple images per produk
 * - Urutan kustom (sort_order)
 * - Thumbnail detection (sort_order = 0)
 */
class ProductMedia extends Pivot
{
    use HasFactory, HasUuids;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'product_media';

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
        'product_id',
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
     * Produk yang memiliki media ini.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
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
