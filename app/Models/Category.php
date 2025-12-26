<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Model Category untuk kategorisasi UMKM.
 * 
 * Contoh kategori:
 * - Kuliner
 * - Kerajinan
 * - Jasa
 * - Pertanian
 * - Fashion
 */
class Category extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'slug',
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
            //
        ];
    }

    /* =====================================================
     * RELATIONSHIPS
     * ===================================================== */

    /**
     * UMKM yang termasuk dalam kategori ini.
     */
    public function umkms(): HasMany
    {
        return $this->hasMany(Umkm::class);
    }
}
