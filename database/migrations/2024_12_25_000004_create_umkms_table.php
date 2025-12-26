<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Tabel umkms sebagai entitas inti platform.
     * Setiap UMKM dimiliki oleh 1 user (admin_umkm).
     * Menyimpan informasi lokasi untuk peta interaktif.
     */
    public function up(): void
    {
        Schema::create('umkms', function (Blueprint $table) {
            $table->uuid('id')->primary();
            
            // Relasi ke user (1 UMKM = 1 admin_umkm)
            $table->foreignUuid('user_id')->unique()->constrained('users')->cascadeOnDelete();
            
            // Relasi ke kategori
            $table->foreignUuid('category_id')->constrained('categories')->cascadeOnDelete();
            
            // Informasi dasar
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description');
            $table->text('address');
            
            // Koordinat untuk peta (latitude: -90 to 90, longitude: -180 to 180)
            $table->decimal('latitude', 10, 8);
            $table->decimal('longitude', 11, 8);
            
            // Kontak (opsional)
            $table->string('phone')->nullable();
            $table->string('whatsapp')->nullable();
            $table->string('email')->nullable();
            
            // Logo UMKM (opsional)
            $table->foreignUuid('logo_id')->nullable()->constrained('media_files')->nullOnDelete();
            
            // Status UMKM
            $table->string('status')->default('active'); // active, inactive, suspended
            
            $table->timestamps();

            // Indexes untuk query yang sering digunakan
            $table->index('slug');
            $table->index('category_id');
            $table->index('status');
            $table->index('user_id');
            
            // Index untuk pencarian di peta (bounding box query)
            $table->index(['latitude', 'longitude']);
        });

        // Check constraint untuk status enum (PostgreSQL)
        DB::statement("ALTER TABLE umkms ADD CONSTRAINT umkms_status_check CHECK (status IN ('active', 'inactive', 'suspended'))");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('umkms');
    }
};
