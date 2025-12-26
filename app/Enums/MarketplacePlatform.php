<?php

namespace App\Enums;

/**
 * Enum MarketplacePlatform untuk platform marketplace yang didukung.
 */
enum MarketplacePlatform: string
{
    case SHOPEE = 'shopee';
    case TOKOPEDIA = 'tokopedia';
    case TRAVELOKA = 'traveloka';
    case TIKET = 'tiket';

    /**
     * Get label untuk tampilan UI.
     */
    public function label(): string
    {
        return match ($this) {
            self::SHOPEE => 'Shopee',
            self::TOKOPEDIA => 'Tokopedia',
            self::TRAVELOKA => 'Traveloka',
            self::TIKET => 'Tiket.com',
        };
    }

    /**
     * Get URL base untuk marketplace.
     */
    public function baseUrl(): string
    {
        return match ($this) {
            self::SHOPEE => 'https://shopee.co.id',
            self::TOKOPEDIA => 'https://www.tokopedia.com',
            self::TRAVELOKA => 'https://www.traveloka.com',
            self::TIKET => 'https://www.tiket.com',
        };
    }

    /**
     * Get icon class untuk UI.
     */
    public function iconColor(): string
    {
        return match ($this) {
            self::SHOPEE => '#EE4D2D',
            self::TOKOPEDIA => '#42B549',
            self::TRAVELOKA => '#0194F3',
            self::TIKET => '#0064D2',
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
