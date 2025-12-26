<?php

namespace App\Models;

use App\Enums\UmkmStatus;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * Model Umkm sebagai entitas inti platform.
 * 
 * Setiap UMKM:
 * - Dimiliki oleh 1 user (admin_umkm)
 * - Memiliki 1 kategori
 * - Memiliki koordinat untuk peta
 * - Dapat memiliki tema kustom
 * - Dapat memiliki banyak artikel dan produk
 */
class Umkm extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'admin_user_id',
        'category_id',
        'name',
        'slug',
        'owner_name',
        'description',
        'address',
        'latitude',
        'longitude',
        'phone',
        'whatsapp',
        'email',
        'logo_id',
        'status',
        'is_featured',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'latitude' => 'decimal:8',
            'longitude' => 'decimal:8',
            'status' => UmkmStatus::class,
            'is_featured' => 'boolean',
        ];
    }

    /* =====================================================
     * RELATIONSHIPS
     * ===================================================== */

    /**
     * User pemilik UMKM (admin_umkm) - legacy.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Admin user UMKM (admin_umkm).
     */
    public function admin(): BelongsTo
    {
        return $this->belongsTo(User::class, 'admin_user_id');
    }

    /**
     * Kategori UMKM.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Logo UMKM (media file).
     */
    public function logo(): BelongsTo
    {
        return $this->belongsTo(MediaFile::class, 'logo_id');
    }

    /**
     * Tema kustom UMKM (1:1).
     */
    public function theme(): HasOne
    {
        return $this->hasOne(UmkmTheme::class);
    }

    /**
     * Artikel yang dimiliki UMKM.
     */
    public function articles(): HasMany
    {
        return $this->hasMany(Article::class);
    }

    /**
     * Produk yang dimiliki UMKM.
     */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    /**
     * Rekaman page view untuk UMKM ini.
     */
    public function pageViews(): HasMany
    {
        return $this->hasMany(PageView::class);
    }

    /**
     * Rekaman klik marketplace untuk UMKM ini.
     */
    public function marketplaceClicks(): HasMany
    {
        return $this->hasMany(MarketplaceClick::class);
    }

    /* =====================================================
     * HELPER METHODS
     * ===================================================== */

    /**
     * Cek apakah UMKM aktif.
     */
    public function isActive(): bool
    {
        return $this->status === UmkmStatus::ACTIVE;
    }

    /**
     * Cek apakah UMKM di-suspend.
     */
    public function isSuspended(): bool
    {
        return $this->status === UmkmStatus::SUSPENDED;
    }

    /**
     * Scope untuk UMKM aktif saja.
     */
    public function scopeActive($query)
    {
        return $query->where('status', UmkmStatus::ACTIVE);
    }

    /**
     * Scope untuk pencarian berdasarkan bounding box (peta).
     */
    public function scopeWithinBounds($query, float $minLat, float $maxLat, float $minLng, float $maxLng)
    {
        return $query->whereBetween('latitude', [$minLat, $maxLat])
                     ->whereBetween('longitude', [$minLng, $maxLng]);
    }
}
