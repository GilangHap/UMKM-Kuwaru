<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Model UmkmTheme untuk dynamic branding per UMKM.
 * 
 * Memungkinkan setiap UMKM memiliki tampilan unik dengan:
 * - Warna primer, sekunder, dan aksen
 * - Font family kustom
 * 
 * Relasi 1:1 dengan Umkm.
 */
class UmkmTheme extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'umkm_id',
        'primary_color',
        'secondary_color',
        'accent_color',
        'font_family',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            //
        ];
    }

    /* =====================================================
     * RELATIONSHIPS
     * ===================================================== */

    /**
     * UMKM pemilik tema ini.
     */
    public function umkm(): BelongsTo
    {
        return $this->belongsTo(Umkm::class);
    }

    /* =====================================================
     * HELPER METHODS
     * ===================================================== */

    /**
     * Generate CSS variables untuk tema ini.
     */
    public function toCssVariables(): array
    {
        return [
            '--color-primary' => $this->primary_color,
            '--color-secondary' => $this->secondary_color ?? $this->primary_color,
            '--color-accent' => $this->accent_color ?? $this->primary_color,
            '--font-family' => $this->font_family ?? 'Inter, sans-serif',
        ];
    }
}
