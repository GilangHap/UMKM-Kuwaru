<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Model Product untuk katalog produk UMKM.
 * 
 * Bersifat showcase (tanpa transaksi/cart).
 * Produk dapat memiliki multiple gambar melalui product_media.
 */
class Product extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'umkm_id',
        'name',
        'slug',
        'description',
        'price_range',
        'is_featured',
        'shopee_url',
        'tokopedia_url',
        'other_marketplace_url',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_featured' => 'boolean',
        ];
    }

    /* =====================================================
     * RELATIONSHIPS
     * ===================================================== */

    /**
     * UMKM pemilik produk.
     */
    public function umkm(): BelongsTo
    {
        return $this->belongsTo(Umkm::class);
    }

    /**
     * Relasi ke product_media (pivot).
     */
    public function productMedia(): HasMany
    {
        return $this->hasMany(ProductMedia::class)->orderBy('sort_order');
    }

    /**
     * Media files produk (many-to-many melalui pivot).
     */
    public function media(): BelongsToMany
    {
        return $this->belongsToMany(MediaFile::class, 'product_media', 'product_id', 'media_id')
                    ->withPivot('sort_order')
                    ->orderByPivot('sort_order');
    }

    /* =====================================================
     * HELPER METHODS
     * ===================================================== */

    /**
     * Get primary/thumbnail image (sort_order = 0).
     */
    public function getThumbnail(): ?MediaFile
    {
        return $this->media()->wherePivot('sort_order', 0)->first();
    }

    /**
     * Scope untuk produk unggulan.
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }
}
