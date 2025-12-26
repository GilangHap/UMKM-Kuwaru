<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Model PageView untuk tracking kunjungan halaman.
 * 
 * Digunakan untuk:
 * - Analytics dasar
 * - Insight jumlah pengunjung per UMKM
 * - Tracking halaman populer
 * 
 * umkm_id nullable untuk halaman non-UMKM (home, about, etc.)
 */
class PageView extends Model
{
    use HasFactory, HasUuids;

    /**
     * Disable timestamps (menggunakan viewed_at custom).
     */
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'umkm_id',
        'page_type',
        'page_slug',
        'ip_address',
        'user_agent',
        'viewed_at',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'viewed_at' => 'datetime',
        ];
    }

    /* =====================================================
     * RELATIONSHIPS
     * ===================================================== */

    /**
     * UMKM yang dikunjungi (nullable).
     */
    public function umkm(): BelongsTo
    {
        return $this->belongsTo(Umkm::class);
    }

    /* =====================================================
     * HELPER METHODS
     * ===================================================== */

    /**
     * Scope untuk filter berdasarkan tipe halaman.
     */
    public function scopeOfType($query, string $type)
    {
        return $query->where('page_type', $type);
    }

    /**
     * Scope untuk filter berdasarkan rentang waktu.
     */
    public function scopeBetween($query, $startDate, $endDate)
    {
        return $query->whereBetween('viewed_at', [$startDate, $endDate]);
    }

    /**
     * Scope untuk hari ini.
     */
    public function scopeToday($query)
    {
        return $query->whereDate('viewed_at', today());
    }
}
