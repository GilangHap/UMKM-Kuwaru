<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Tabel umkm_themes untuk dynamic branding per UMKM.
     * Memungkinkan setiap UMKM memiliki tampilan unik.
     * Relasi 1:1 dengan umkms.
     */
    public function up(): void
    {
        Schema::create('umkm_themes', function (Blueprint $table) {
            $table->uuid('id')->primary();
            
            // Relasi 1:1 dengan UMKM (unique constraint)
            $table->foreignUuid('umkm_id')->unique()->constrained('umkms')->cascadeOnDelete();
            
            // Warna tema (hex color codes)
            $table->string('primary_color', 7)->default('#3B82F6'); // Format: #RRGGBB
            $table->string('secondary_color', 7)->nullable();
            $table->string('accent_color', 7)->nullable();
            
            // Typography
            $table->string('font_family')->nullable(); // e.g., 'Inter', 'Roboto', 'Poppins'
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('umkm_themes');
    }
};
