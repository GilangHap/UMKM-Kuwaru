<?php

namespace App\Enums;

/**
 * Enum MediaType untuk tipe file media.
 */
enum MediaType: string
{
    case IMAGE = 'image';
    case VIDEO = 'video';

    /**
     * Get label untuk tampilan UI.
     */
    public function label(): string
    {
        return match ($this) {
            self::IMAGE => 'Gambar',
            self::VIDEO => 'Video',
        };
    }

    /**
     * Get allowed MIME types.
     */
    public function mimeTypes(): array
    {
        return match ($this) {
            self::IMAGE => ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
            self::VIDEO => ['video/mp4', 'video/webm', 'video/ogg'],
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
