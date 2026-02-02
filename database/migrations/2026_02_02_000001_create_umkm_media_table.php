<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Tabel pivot umkm_media untuk relasi UMKM ↔ media.
     * Mendukung multiple images per UMKM dengan urutan kustom.
     */
    public function up(): void
    {
        Schema::create('umkm_media', function (Blueprint $table) {
            $table->uuid('id')->primary();
            
            // Relasi ke UMKM
            $table->foreignUuid('umkm_id')->constrained('umkms')->cascadeOnDelete();
            
            // Relasi ke media file
            $table->foreignUuid('media_id')->constrained('media_files')->cascadeOnDelete();
            
            // Urutan tampilan (0 = pertama/thumbnail utama)
            $table->integer('sort_order')->default(0);
            
            // Hanya created_at
            $table->timestamp('created_at')->useCurrent();

            // Unique constraint - tidak boleh ada duplikat media di UMKM yang sama
            $table->unique(['umkm_id', 'media_id']);
            
            // Indexes
            $table->index('umkm_id');
            $table->index('media_id');
            $table->index(['umkm_id', 'sort_order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('umkm_media');
    }
};
