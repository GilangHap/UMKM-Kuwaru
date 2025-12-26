<?php

namespace App\Enums;

/**
 * Enum UserRole untuk role user.
 * 
 * - admin_desa: Super admin yang mengelola seluruh platform
 * - admin_umkm: Pemilik UMKM yang mengelola usahanya sendiri
 */
enum UserRole: string
{
    case ADMIN_DESA = 'admin_desa';
    case ADMIN_UMKM = 'admin_umkm';

    /**
     * Get label untuk tampilan UI.
     */
    public function label(): string
    {
        return match ($this) {
            self::ADMIN_DESA => 'Admin Desa',
            self::ADMIN_UMKM => 'Admin UMKM',
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
