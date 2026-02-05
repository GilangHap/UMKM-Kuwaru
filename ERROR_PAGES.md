# Error Pages Documentation

## Halaman Error yang Tersedia

Sistem ini menyediakan halaman error yang konsisten dengan tema aplikasi (emerald/teal gradient) untuk berbagai status HTTP:

### Error Pages Khusus

1. **404 - Not Found** (`Errors/404.tsx`)
   - Halaman tidak ditemukan
   - Icon: Sad face
   - Warna: Emerald/Teal

2. **403 - Forbidden** (`Errors/403.tsx`)
   - Akses ditolak
   - Icon: Lock
   - Warna: Red/Orange
   - Menyarankan untuk login jika belum login

3. **500 - Internal Server Error** (`Errors/500.tsx`)
   - Kesalahan server
   - Icon: Warning triangle
   - Warna: Amber/Orange
   - Hanya ditampilkan di production (local environment menampilkan debug screen)

4. **503 - Service Unavailable** (`Errors/503.tsx`)
   - Maintenance mode
   - Icon: Animated gear
   - Warna: Blue/Indigo
   - Badge "Pemeliharaan Aktif"

### Error Page Umum

**Error.tsx** - Menangani status code lainnya:
- 400 - Bad Request (Yellow)
- 401 - Unauthorized (Orange)
- 402 - Payment Required (Indigo)
- 419 - Session Expired (Purple)
- 429 - Too Many Requests (Red)

## Konfigurasi

Error handling dikonfigurasi di `bootstrap/app.php`:

```php
->withExceptions(function (Exceptions $exceptions): void {
    $exceptions->respond(function (Response $response, Throwable $exception, Request $request) {
        // Auto-detect status code dan render halaman error yang sesuai
    });
})
```

### Fitur:

1. **Auto-detect status code** - Sistem otomatis mendeteksi dan merender halaman error yang sesuai
2. **Dinamis logo & site name** - Mengambil dari Setting model
3. **Skip untuk API requests** - Hanya render halaman error untuk request HTML
4. **Development mode** - Error 500 tidak ditampilkan di local environment

## Testing

Route testing tersedia di development environment:

```
/test-error/400  - Bad Request
/test-error/401  - Unauthorized
/test-error/403  - Forbidden
/test-error/404  - Not Found
/test-error/419  - Session Expired
/test-error/429  - Too Many Requests
/test-error/500  - Internal Server Error
/test-error/503  - Service Unavailable
```

**PENTING:** Hapus route testing ini di production!

## Customization

### Mengubah Warna/Tema

Edit file komponen error yang relevan di `resources/js/Pages/Errors/`:
- Background gradient
- Icon color
- Button styles

### Menambah Status Code Baru

1. Tambahkan di `statusMessages` object di `Error.tsx`
2. Update `bootstrap/app.php` untuk menangani status code tersebut
3. (Opsional) Buat komponen dedicated jika perlu handling khusus

## Props yang Diterima

Semua komponen error menerima props:

```typescript
interface Props {
    status?: number;        // HTTP status code
    siteLogo?: string | null;  // URL logo dari Setting
    siteName?: string;      // Nama site dari Setting
}
```

## Komponen UI

Setiap halaman error memiliki:

1. **Logo desa** (dari Setting atau default)
2. **Error icon** dengan warna yang sesuai
3. **Status code** besar dan bold
4. **Title** deskriptif
5. **Message** penjelasan user-friendly
6. **Action buttons**:
   - Kembali ke Beranda
   - Halaman Sebelumnya / Muat Ulang
7. **Footer** dengan copyright

## Best Practices

1. ✅ Selalu gunakan logo dan site name dari Setting
2. ✅ Berikan pesan error yang jelas dan membantu
3. ✅ Sediakan action yang relevan (kembali, reload, login)
4. ✅ Konsisten dengan tema aplikasi
5. ✅ Responsive untuk semua ukuran layar
6. ❌ Jangan tampilkan technical error message ke user
7. ❌ Jangan lupa hapus testing routes di production

## Maintenance Mode

Untuk mengaktifkan maintenance mode:

```bash
php artisan down
```

Halaman 503 akan otomatis ditampilkan.

Untuk menonaktifkan:

```bash
php artisan up
```

## Notes

- Error 500 menggunakan `!app()->environment('local')` sehingga tetap menampilkan Whoops di development
- Semua halaman error menggunakan Tailwind CSS yang sudah dikonfigurasi
- Animasi menggunakan CSS animation (pulse, spin, bounce)
- Icon menggunakan Heroicons (stroke)
