"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function ChangePasswordPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [adminEmail, setAdminEmail] = useState("");
    const [adminMessage, setAdminMessage] = useState("");
    const [adminError, setAdminError] = useState("");
    const [adminSubmitting, setAdminSubmitting] = useState(false);

    useEffect(() => {
        if (status === "loading") return;
        if (!session) {
            router.push("/login");
        }
    }, [session, status, router]);

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (newPassword !== confirmNewPassword) {
            setError("New passwords do not match.");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            const data = await res.json();
            if (!res.ok) {
                setError(data.error || "Failed to change password.");
            } else {
                setMessage("Password changed successfully.");
                setCurrentPassword("");
                setNewPassword("");
                setConfirmNewPassword("");
            }
        } catch (err) {
            setError("Unexpected error. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAdminReset = async (e) => {
        e.preventDefault();
        setAdminMessage("");
        setAdminError("");
        setAdminSubmitting(true);

        try {
            const res = await fetch("/api/admin/set-basic-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: adminEmail }),
            });
            const data = await res.json();
            if (!res.ok) {
                setAdminError(data.error || "Failed to reset password.");
            } else {
                setAdminMessage(
                    `Password reset for ${adminEmail}. User can log in with "Password123" and must change it.`
                );
                setAdminEmail("");
            }
        } catch (err) {
            setAdminError("Unexpected error. Please try again.");
        } finally {
            setAdminSubmitting(false);
        }
    };

    if (status === "loading" || !session) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p className="text-gray-600">Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4">
            <div className="max-w-3xl mx-auto bg-white shadow rounded-lg p-6 space-y-8">
                <header className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Change Password</h1>
                        <p className="text-sm text-gray-500">Signed in as {session.user.email}</p>
                    </div>
                    <button
                        onClick={() => router.push("/admin-dashboard")}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                        ← Back to dashboard
                    </button>
                </header>

                <form onSubmit={handleChangePassword} className="space-y-4">
                    {message && <p className="text-green-600 text-sm">{message}</p>}
                    {error && <p className="text-red-600 text-sm">{error}</p>}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Current password</label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm new password</label>
                        <input
                            type="password"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-60"
                    >
                        {isSubmitting ? "Updating..." : "Update password"}
                    </button>
                </form>

                {session.user.account_type === "admin" && (
                    <div className="border-t border-gray-200 pt-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Admin: Set basic password</h2>
                        <p className="text-sm text-gray-500 mb-4">
                            Sets the user's password to <span className="font-mono">Password123</span>. Ask them to log in and change it immediately.
                        </p>
                        <form onSubmit={handleAdminReset} className="space-y-4">
                            {adminMessage && <p className="text-green-600 text-sm">{adminMessage}</p>}
                            {adminError && <p className="text-red-600 text-sm">{adminError}</p>}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">User email</label>
                                <input
                                    type="email"
                                    value={adminEmail}
                                    onChange={(e) => setAdminEmail(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={adminSubmitting}
                                className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition disabled:opacity-60"
                            >
                                {adminSubmitting ? "Resetting..." : "Set basic password"}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
