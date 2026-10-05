"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSignup(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/auth/signup`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username,
                        email,
                        password,
                    }),
                }
            );
            const data = await response.json();
            if (!response.ok) {
                setMessage(data.detail || "Signup failed");
                return;
            }
            // router.push("/signin");

        } catch (error) {
            setMessage(`Something went wrong ${error}`);
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-black flex items-center justify-center px-4">
            <div className="w-full max-w-md">

                {/* Signup Card */}
                <div className="rounded-2xl border border-gray-800 bg-gray-950 p-8 shadow-2xl">

                    {/* Header */}
                    <div className="mb-8 text-center">

                        {/* Logo */}
                        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-gray-700 bg-gray-900 text-lg font-bold text-white">
                            D
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight text-white">
                            Create account
                        </h1>

                        <p className="mt-2 text-sm text-gray-500">
                            Create your account to get started
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSignup} className="space-y-5">

                        {/* Username */}
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-medium text-gray-300"
                            >
                                Username
                            </label>

                            <input
                                id="email"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="username"
                                required
                                className="w-full rounded-xl border border-gray-800 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 hover:border-gray-700 focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                            />
                        </div>
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
                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-medium text-gray-300"
                            >
                                Password
                            </label>

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

                        {/* Signup Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            onClick={handleSignup}
                            className="w-full rounded-xl cursor-pointer bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading ? "Creating account..." : "Create account"}
                        </button>
                    </form>

                    {/* Error / Message */}
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

                    {/* Login */}
                    <p className="text-center text-sm text-gray-500">
                        Already have an account?{" "}
                        <button
                            type="button"
                            onClick={() => router.push("/signin")}
                            className="font-medium cursor-pointer text-white transition hover:text-gray-300"
                        >
                            Sign in
                        </button>
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