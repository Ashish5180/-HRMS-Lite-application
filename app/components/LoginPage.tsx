"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, User, Eye, EyeOff, Sparkles, Shield } from "lucide-react";

interface LoginPageProps {
    onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Hardcoded credentials
    const ADMIN_USERNAME = "admin";
    const ADMIN_PASSWORD = "admin123";

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        // Simulate network delay for better UX
        setTimeout(() => {
            if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
                localStorage.setItem("isAuthenticated", "true");
                onLogin();
            } else {
                setError("Invalid username or password");
                setIsLoading(false);
            }
        }, 800);
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-zinc-900 dark:via-indigo-950 dark:to-purple-950">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-indigo-400/20 blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                <motion.div
                    className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-purple-400/20 blur-3xl"
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.5, 0.3, 0.5],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            </div>

            {/* Login Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-md px-6"
            >
                <motion.div
                    className="overflow-hidden rounded-2xl border border-zinc-200 bg-white/80 shadow-2xl backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/80"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                >
                    {/* Header */}
                    <div className="relative bg-gradient-to-br from-indigo-600 to-purple-600 p-8 text-center">
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"
                            animate={{
                                opacity: [0.1, 0.3, 0.1],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        />
                        <motion.div
                            className="relative mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm"
                            animate={{
                                rotate: [0, 360],
                            }}
                            transition={{
                                duration: 20,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                        >
                            <Shield className="h-10 w-10 text-white" />
                        </motion.div>
                        <h1 className="relative text-3xl font-bold text-white">HRMS Lite</h1>
                        <p className="relative mt-2 text-sm text-indigo-100">Admin Portal</p>
                        <Sparkles className="absolute right-4 top-4 h-6 w-6 text-white/50" />
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6 p-8">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Username
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full rounded-lg border border-zinc-300 bg-white py-3 pl-11 pr-4 text-zinc-900 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                    placeholder="Enter username"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full rounded-lg border border-zinc-300 bg-white py-3 pl-11 pr-12 text-zinc-900 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                    placeholder="Enter password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 transition-colors hover:text-zinc-600 dark:hover:text-zinc-300"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400"
                            >
                                {error}
                            </motion.div>
                        )}

                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            className="w-full rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 py-3 font-semibold text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-50"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <motion.div
                                        className="h-5 w-5 rounded-full border-2 border-white border-t-transparent"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    />
                                    Signing in...
                                </span>
                            ) : (
                                "Sign In"
                            )}
                        </motion.button>

                        {/* Demo Credentials Hint */}
                        <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-800 dark:bg-indigo-900/20">
                            <p className="text-xs font-medium text-indigo-900 dark:text-indigo-300">Demo Credentials:</p>
                            <p className="mt-1 text-xs text-indigo-700 dark:text-indigo-400">
                                Username: <span className="font-mono font-semibold">admin</span>
                            </p>
                            <p className="text-xs text-indigo-700 dark:text-indigo-400">
                                Password: <span className="font-mono font-semibold">admin123</span>
                            </p>
                        </div>
                    </form>
                </motion.div>

                {/* Footer */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400"
                >
                    Secure Admin Access Only
                </motion.p>
            </motion.div>
        </div>
    );
}
