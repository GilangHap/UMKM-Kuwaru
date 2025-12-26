<?php

namespace App\Listeners;

use App\Services\ActivityLogService;
use Illuminate\Auth\Events\Login;

/**
 * Listener untuk mencatat aktivitas login berhasil.
 */
class LogSuccessfulLogin
{
    /**
     * Handle the event.
     */
    public function handle(Login $event): void
    {
        $user = $event->user;

        // Update last_login_at
        $user->update([
            'last_login_at' => now(),
        ]);

        // Log aktivitas login
        ActivityLogService::logLogin($user);
    }
}
