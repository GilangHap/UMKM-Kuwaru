<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('umkms', function (Blueprint $table) {
            // Admin user for this UMKM
            $table->foreignUuid('admin_user_id')
                ->nullable()
                ->after('user_id')
                ->constrained('users')
                ->nullOnDelete();
            
            // Owner name (display name)
            $table->string('owner_name')
                ->nullable()
                ->after('name');
            
            // Featured flag
            $table->boolean('is_featured')
                ->default(false)
                ->after('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('umkms', function (Blueprint $table) {
            $table->dropForeign(['admin_user_id']);
            $table->dropColumn(['admin_user_id', 'owner_name', 'is_featured']);
        });
    }
};
