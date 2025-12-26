<?php

namespace App\Models;

use App\Enums\ArticleStatus;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Model Article untuk konten SEO UMKM.
 * 
 * Status workflow:
 * - draft: Belum siap untuk review
 * - pending: Menunggu moderasi Admin Desa
 * - approved: Disetujui dan bisa dipublikasi
 * - rejected: Ditolak oleh Admin Desa
 */
class Article extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'umkm_id',
        'title',
        'slug',
        'excerpt',
        'content',
        'status',
        'seo_title',
        'seo_description',
        'featured_image_id',
        'approved_by',
        'approved_at',
        'rejection_notes',
        'views_count',
        'published_at',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
            'approved_at' => 'datetime',
            'status' => ArticleStatus::class,
            'views_count' => 'integer',
        ];
    }

    /* =====================================================
     * RELATIONSHIPS
     * ===================================================== */

    /**
     * UMKM pemilik artikel.
     */
    public function umkm(): BelongsTo
    {
        return $this->belongsTo(Umkm::class);
    }

    /**
     * Featured image.
     */
    public function featuredImage(): BelongsTo
    {
        return $this->belongsTo(MediaFile::class, 'featured_image_id');
    }

    /**
     * User yang approve artikel.
     */
    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /**
     * Riwayat revisi artikel.
     */
    public function revisions(): HasMany
    {
        return $this->hasMany(ArticleRevision::class);
    }

    /* =====================================================
     * HELPER METHODS
     * ===================================================== */

    /**
     * Cek apakah artikel sudah dipublikasi.
     */
    public function isPublished(): bool
    {
        return $this->status === ArticleStatus::APPROVED && $this->published_at !== null;
    }

    /**
     * Cek apakah artikel menunggu moderasi.
     */
    public function isPending(): bool
    {
        return $this->status === ArticleStatus::PENDING;
    }

    /**
     * Get SEO title (fallback ke title biasa).
     */
    public function getSeoTitleAttribute(): string
    {
        return $this->attributes['seo_title'] ?? $this->title;
    }

    /**
     * Scope untuk artikel yang sudah dipublikasi.
     */
    public function scopePublished($query)
    {
        return $query->where('status', ArticleStatus::APPROVED)
                     ->whereNotNull('published_at')
                     ->where('published_at', '<=', now());
    }

    /**
     * Scope untuk artikel yang menunggu moderasi.
     */
    public function scopePending($query)
    {
        return $query->where('status', ArticleStatus::PENDING);
    }
}
