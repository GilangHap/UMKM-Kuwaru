<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Tabel pivot product_media untuk relasi produk ↔ media.
     * Mendukung multiple images per produk dengan urutan kustom.
     * Hanya memiliki created_at.
     */
    public function up(): void
    {
        Schema::create('product_media', function (Blueprint $table) {
            $table->uuid('id')->primary();
            
            // Relasi ke produk
            $table->foreignUuid('product_id')->constrained('products')->cascadeOnDelete();
            
            // Relasi ke media file
            $table->foreignUuid('media_id')->constrained('media_files')->cascadeOnDelete();
            
            // Urutan tampilan (0 = pertama/thumbnail utama)
            $table->integer('sort_order')->default(0);
            
            // Hanya created_at
            $table->timestamp('created_at')->useCurrent();

            // Unique constraint - tidak boleh ada duplikat media di produk yang sama
            $table->unique(['product_id', 'media_id']);
            
            // Indexes
            $table->index('product_id');
            $table->index('media_id');
            $table->index(['product_id', 'sort_order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_media');
    }
};
