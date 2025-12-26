<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Model MarketplaceClick untuk tracking klik link marketplace.
 * 
 * Platform yang didukung:
 * - shopee
 * - tokopedia
 * - traveloka
 * - tiket
 * 
 * Berguna untuk mengukur konversi ke platform eksternal.
 */
class MarketplaceClick extends Model
{
    use HasFactory, HasUuids;

    /**
     * Disable timestamps (menggunakan clicked_at custom).
     */
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'umkm_id',
        'platform',
        'clicked_at',
        'ip_address',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'clicked_at' => 'datetime',
        ];
    }

    /* =====================================================
     * RELATIONSHIPS
     * ===================================================== */

    /**
     * UMKM yang diklik marketplace-nya.
     */
    public function umkm(): BelongsTo
    {
        return $this->belongsTo(Umkm::class);
    }

    /* =====================================================
     * HELPER METHODS
     * ===================================================== */

    /**
     * Scope untuk filter berdasarkan platform.
     */
    public function scopeOfPlatform($query, string $platform)
    {
        return $query->where('platform', $platform);
    }

    /**
     * Scope untuk filter berdasarkan rentang waktu.
     */
    public function scopeBetween($query, $startDate, $endDate)
    {
        return $query->whereBetween('clicked_at', [$startDate, $endDate]);
    }

    /**
     * Scope untuk hari ini.
     */
    public function scopeToday($query)
    {
        return $query->whereDate('clicked_at', today());
    }
}
