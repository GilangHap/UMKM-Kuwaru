<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Tabel products untuk katalog produk UMKM.
     * Bersifat showcase (tanpa transaksi/cart).
     * Mendukung featured product untuk promosi.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->uuid('id')->primary();
            
            // Relasi ke UMKM pemilik produk
            $table->foreignUuid('umkm_id')->constrained('umkms')->cascadeOnDelete();
            
            // Informasi produk
            $table->string('name');
            $table->string('slug');
            $table->text('description');
            
            // Range harga (format bebas, e.g., "Rp 50.000 - Rp 100.000")
            $table->string('price_range')->nullable();
            
            // Flag untuk produk unggulan
            $table->boolean('is_featured')->default(false);
            
            $table->timestamps();

            // Indexes
            $table->index('umkm_id');
            $table->index('is_featured');
            
            // Unique constraint slug per UMKM (bukan global)
            $table->unique(['umkm_id', 'slug']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
