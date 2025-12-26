<?php

namespace App\Enums;

/**
 * Enum ArticleStatus untuk status moderasi artikel.
 */
enum ArticleStatus: string
{
    case DRAFT = 'draft';
    case PENDING = 'pending';
    case APPROVED = 'approved';
    case REJECTED = 'rejected';

    /**
     * Get label untuk tampilan UI.
     */
    public function label(): string
    {
        return match ($this) {
            self::DRAFT => 'Draft',
            self::PENDING => 'Menunggu Review',
            self::APPROVED => 'Disetujui',
            self::REJECTED => 'Ditolak',
        };
    }

    /**
     * Get badge color untuk UI.
     */
    public function color(): string
    {
        return match ($this) {
            self::DRAFT => 'gray',
            self::PENDING => 'yellow',
            self::APPROVED => 'green',
            self::REJECTED => 'red',
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
