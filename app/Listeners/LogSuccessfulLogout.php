<?php

namespace App\Listeners;

use App\Services\ActivityLogService;
use Illuminate\Auth\Events\Logout;

/**
 * Listener untuk mencatat aktivitas logout berhasil.
 */
class LogSuccessfulLogout
{
    /**
     * Handle the event.
     */
    public function handle(Logout $event): void
    {
        $user = $event->user;

        // Pastikan user ada (bisa null jika session expired)
        if ($user) {
            ActivityLogService::logLogout($user);
        }
    }
}
