<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Model Setting untuk pengaturan global website desa.
 * 
 * Key-value store untuk konfigurasi dinamis seperti:
 * - site_name: Nama website
 * - site_description: Deskripsi website
 * - contact_email: Email kontak
 * - contact_phone: Telepon kontak
 * - village_address: Alamat desa
 * - map_center_lat: Koordinat pusat peta (latitude)
 * - map_center_lng: Koordinat pusat peta (longitude)
 * - map_default_zoom: Zoom level default peta
 */
class Setting extends Model
{
    use HasFactory;

    /**
     * Primary key adalah string (key).
     */
    protected $primaryKey = 'key';
    public $incrementing = false;
    protected $keyType = 'string';

    /**
     * Disable created_at timestamp.
     */
    const CREATED_AT = null;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'key',
        'value',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'updated_at' => 'datetime',
        ];
    }

    /* =====================================================
     * STATIC HELPER METHODS
     * ===================================================== */

    /**
     * Get setting value by key.
     */
    public static function get(string $key, mixed $default = null): mixed
    {
        $setting = self::find($key);
        return $setting ? $setting->value : $default;
    }

    /**
     * Set setting value by key.
     */
    public static function set(string $key, mixed $value): self
    {
        return self::updateOrCreate(
            ['key' => $key],
            ['value' => $value]
        );
    }

    /**
     * Get multiple settings as array.
     */
    public static function getMany(array $keys): array
    {
        $settings = self::whereIn('key', $keys)->pluck('value', 'key');
        
        $result = [];
        foreach ($keys as $key) {
            $result[$key] = $settings[$key] ?? null;
        }
        
        return $result;
    }

    /**
     * Set multiple settings at once.
     */
    public static function setMany(array $settings): void
    {
        foreach ($settings as $key => $value) {
            self::set($key, $value);
        }
    }

    /**
     * Get setting as JSON decoded value.
     */
    public static function getJson(string $key, mixed $default = null): mixed
    {
        $value = self::get($key);
        if ($value === null) {
            return $default;
        }
        
        $decoded = json_decode($value, true);
        return json_last_error() === JSON_ERROR_NONE ? $decoded : $default;
    }

    /**
     * Set setting as JSON encoded value.
     */
    public static function setJson(string $key, mixed $value): self
    {
        return self::set($key, json_encode($value));
    }
}
