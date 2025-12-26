<?php

namespace App\Enums;

/**
 * Enum PageType untuk tipe halaman yang di-track.
 */
enum PageType: string
{
    case HOME = 'home';
    case UMKM = 'umkm';
    case ARTICLE = 'article';

    /**
     * Get label untuk tampilan UI.
     */
    public function label(): string
    {
        return match ($this) {
            self::HOME => 'Halaman Utama',
            self::UMKM => 'Halaman UMKM',
            self::ARTICLE => 'Halaman Artikel',
        };
    }

    /**
     * Get semua values sebagai array.
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
