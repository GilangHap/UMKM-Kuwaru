<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Tabel activity_logs untuk audit trail dan keamanan.
     * Mencatat setiap aksi penting yang dilakukan user.
     * Immutable records (hanya created_at).
     */
    public function up(): void
    {
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            
            // User yang melakukan aksi
            $table->foreignUuid('user_id')->constrained('users')->cascadeOnDelete();
            
            // Deskripsi aksi (e.g., 'create', 'update', 'delete', 'login', 'logout')
            $table->string('action');
            
            // Target yang dikenai aksi (polymorphic-style tapi manual)
            $table->string('target_type'); // e.g., 'umkm', 'article', 'product'
            $table->uuid('target_id');
            
            // Deskripsi tambahan (opsional)
            $table->text('description')->nullable();
            
            // Hanya created_at (log tidak pernah diupdate)
            $table->timestamp('created_at')->useCurrent();

            // Indexes untuk query audit
            $table->index('user_id');
            $table->index('action');
            $table->index('target_type');
            $table->index('created_at');
            
            // Compound index untuk lookup target spesifik
            $table->index(['target_type', 'target_id']);
            
            // Compound index untuk audit per user
            $table->index(['user_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
    }
};
