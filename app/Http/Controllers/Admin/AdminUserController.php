<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Enums\UserRole;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminUserController extends Controller
{
    /**
     * Display a listing of Admin UMKM users.
     */
    public function index(Request $request)
    {
        $query = User::query()
            ->where('role', UserRole::ADMIN_UMKM)
            ->with('umkm');

        // Search
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%');
            });
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('is_active', $request->status === 'active');
        }

        // Sorting
        $sortBy = $request->get('sort', 'created_at');
        $sortDir = $request->get('direction', 'desc');
        $query->orderBy($sortBy, $sortDir);

        $users = $query->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => $request->only(['search', 'status', 'sort', 'direction']),
        ]);
    }

    /**
     * Toggle user active status.
     */
    public function toggleActive(User $user)
    {
        // Prevent toggling own account
        if ($user->id === auth()->id()) {
            return back()->with('error', 'Tidak dapat mengubah status akun sendiri.');
        }

        // Only allow toggling admin_umkm
        if ($user->role !== UserRole::ADMIN_UMKM) {
            return back()->with('error', 'Hanya dapat mengubah status Admin UMKM.');
        }

        $user->update(['is_active' => !$user->is_active]);

        $message = $user->is_active 
            ? 'Akun berhasil diaktifkan.'
            : 'Akun berhasil dinonaktifkan.';

        return back()->with('success', $message);
    }

    /**
     * Reset user password.
     */
    public function resetPassword(User $user)
    {
        // Only allow resetting admin_umkm passwords
        if ($user->role !== UserRole::ADMIN_UMKM) {
            return back()->with('error', 'Hanya dapat reset password Admin UMKM.');
        }

        $newPassword = Str::random(12);
        $user->update(['password' => Hash::make($newPassword)]);

        return back()->with('success', "Password berhasil direset. Password baru: {$newPassword}");
    }
}
