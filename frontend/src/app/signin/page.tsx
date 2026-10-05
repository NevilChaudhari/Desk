"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/libs/supabase/supabase";

export default function LoginPage() {
    const router = useRouter()

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setMessage(error.message);
            return;
        }

        console.log("Logged in user:", data.user);
        console.log("Session:", data.session);

        router.push("/chat");

    } catch (error) {
        console.error(error);
        setMessage("Could not connect to server");
    } finally {
        setLoading(false);
    }
}

    return (
        <main className="min-h-screen bg-black flex items-center justify-center px-4">
            <div className="w-full max-w-md">

                {/* Login Card */}
                <div className="rounded-2xl border border-gray-800 bg-gray-950 p-8 shadow-2xl">

                    {/* Logo / Header */}
                    <div className="mb-8 text-center">

                        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-gray-700 bg-gray-900 text-lg font-bold text-white">
                            D
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight text-white">
                            Welcome back
                        </h1>

                        <p className="mt-2 text-sm text-gray-500">
                            Sign in to continue to your account
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-5">

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-medium text-gray-300"
                            >
                                Email
                            </label>

                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                className="w-full rounded-xl border border-gray-800 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 hover:border-gray-700 focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <label
                                    htmlFor="password"
                                    className="text-sm font-medium text-gray-300"
                                >
                                    Password
                                </label>

                                <a
                                    href="/forgot-password"
                                    className="text-xs text-gray-500 transition hover:text-white"
                                >
                                    Forgot password?
                                </a>
                            </div>

                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full rounded-xl border border-gray-800 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 hover:border-gray-700 focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                            />
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading ? "Signing in..." : "Sign in"}
                        </button>
                    </form>

                    {/* Message */}
                    {message && (
                        <div className="mt-5 rounded-xl border border-gray-800 bg-gray-900 px-4 py-3 text-center text-sm text-gray-300">
                            {message}
                        </div>
                    )}

                    {/* Divider */}
                    <div className="my-7 flex items-center gap-4">
                        <div className="h-px flex-1 bg-gray-800" />
                        <span className="text-xs text-gray-600">
                            OR
                        </span>
                        <div className="h-px flex-1 bg-gray-800" />
                    </div>

                    {/* Signup */}
                    <p className="text-center text-sm text-gray-500">
                        Don't have an account?{" "}
                        <a
                            onClick={() => router.push('signup')}
                            className="font-medium cursor-pointer text-white transition hover:text-gray-300"
                        >
                            Create account
                        </a>
                    </p>
                </div>

                {/* Footer */}
                <p className="mt-6 text-center text-xs text-gray-700">
                    © 2026 Desk. All rights reserved.
                </p>
            </div>
        </main>
    );
}