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
     * Tabel media_files untuk manajemen file terpusat.
     * Digunakan untuk logo UMKM, gambar produk, dll.
     */
    public function up(): void
    {
        Schema::create('media_files', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('file_path');
            $table->string('file_type'); // image, video
            $table->string('alt_text')->nullable();
            $table->foreignUuid('uploaded_by')->constrained('users')->cascadeOnDelete();
            $table->timestamps();

            // Index untuk query berdasarkan uploader
            $table->index('uploaded_by');
            $table->index('file_type');
        });

        // Check constraint untuk file_type enum (PostgreSQL)
        DB::statement("ALTER TABLE media_files ADD CONSTRAINT media_files_file_type_check CHECK (file_type IN ('image', 'video'))");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('media_files');
    }
};
