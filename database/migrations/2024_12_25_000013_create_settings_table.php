<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Tabel settings untuk pengaturan global website desa.
     * Key-value store sederhana untuk konfigurasi dinamis.
     * Contoh: site_name, site_description, contact_email, etc.
     */
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            // Key sebagai primary key (string)
            $table->string('key')->primary();
            
            // Value bisa berisi apa saja (JSON, string, etc.)
            $table->text('value');
            
            // Hanya updated_at (settings selalu di-update, tidak di-create baru)
            $table->timestamp('updated_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
