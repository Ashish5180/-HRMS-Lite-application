"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, User, Eye, EyeOff, Sparkles, Shield, ArrowRight, Loader2 } from "lucide-react";

interface LoginPageProps {
    onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Hardcoded credentials (kept for logic, removed from UI)
    const ADMIN_USERNAME = "admin";
    const ADMIN_PASSWORD = "admin123";

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        // Simulate network delay for premium feel
        setTimeout(() => {
            if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
                localStorage.setItem("isAuthenticated", "true");
                onLogin();
            } else {
                setError("Invalid credentials. Please try again.");
                setIsLoading(false);
            }
        }, 1200);
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0E0E10]">
            {/* dynamic background with gold/dark accents */}
            <div className="absolute inset-0 z-0">
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: `radial-gradient(circle at 50% 50%, #C9A227 0%, transparent 50%)`,
                        filter: 'blur(100px)'
                    }}
                />
                <motion.div
                    className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#C9A227]/10 rounded-full blur-[120px]"
                    animate={{
                        scale: [1, 1.2, 1],
                        x: [0, 50, 0],
                        y: [0, -30, 0],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#C9A227]/5 rounded-full blur-[120px]"
                    animate={{
                        scale: [1.2, 1, 1.2],
                        x: [0, -50, 0],
                        y: [0, 30, 0],
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>

            {/* Content grid for layout */}
            <div className="relative z-10 w-full max-w-[1200px] px-6 grid lg:grid-cols-2 gap-16 items-center">

                {/* Left Side: Branding/Value Prop */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="hidden lg:block space-y-8"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-2xl bg-gradient-to-br from-[#C9A227] to-[#b8911f] shadow-lg shadow-[#C9A227]/20">
                            <Shield className="h-8 w-8 text-[#0E0E10]" />
                        </div>
                        <span className="text-2xl font-bold tracking-tighter text-[#FAFAFA]">
                            ETHER <span className="text-[#C9A227]">AI</span>
                        </span>
                    </div>

                    <h2 className="text-5xl font-bold leading-tight text-[#FAFAFA]">
                        Manage your workforce <br />
                        <span className="bg-gradient-to-r from-[#C9A227] to-[#fceabb] bg-clip-text text-transparent italic">
                            with intelligence.
                        </span>
                    </h2>

                    <p className="text-lg text-[#B1B1B8] max-w-md">
                        The modern HR management system built for speed, precision, and excellence. Securely manage employees and attendance with ease.
                    </p>

                    <div className="flex gap-12 pt-8">
                        <div>
                            <div className="text-3xl font-bold text-[#FAFAFA]">100%</div>
                            <div className="text-sm text-[#B1B1B8]">Secure Cloud</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-[#FAFAFA]">99.9%</div>
                            <div className="text-sm text-[#B1B1B8]">Uptime Ratio</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-[#FAFAFA]">Zero</div>
                            <div className="text-sm text-[#B1B1B8]">Complexity</div>
                        </div>
                    </div>
                </motion.div>

                {/* Right Side: Login Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="w-full max-w-[440px] mx-auto"
                >
                    <div className="relative group">
                        {/* Card Glow */}
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#C9A227]/50 to-[#b8911f]/50 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>

                        <div
                            className="relative flex flex-col rounded-3xl border border-[#27272A] bg-[#16161A]/80 backdrop-blur-2xl overflow-hidden shadow-2xl"
                        >
                            {/* Decorative Header */}
                            <div className="h-2 bg-gradient-to-r from-[#C9A227] via-[#fceabb] to-[#b8911f]" />

                            <div className="p-8 sm:p-10 space-y-8">
                                <div className="space-y-2">
                                    <h1 className="text-3xl font-bold text-[#FAFAFA]">Admin Login</h1>
                                    <p className="text-[#B1B1B8]">Enter your credentials to access the portal</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-[#B1B1B8] ml-1">Username</label>
                                        <div className="relative group/input">
                                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                                <User className="h-5 w-5 text-[#52525B] group-focus-within/input:text-[#C9A227] transition-colors" />
                                            </div>
                                            <input
                                                type="text"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                className="w-full h-12 bg-[#0E0E10] border border-[#27272A] rounded-xl pl-12 pr-4 text-[#FAFAFA] placeholder:text-[#52525B] focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] outline-none transition-all"
                                                placeholder="admin"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-[#B1B1B8] ml-1">Password</label>
                                        <div className="relative group/input">
                                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                                <Lock className="h-5 w-5 text-[#52525B] group-focus-within/input:text-[#C9A227] transition-colors" />
                                            </div>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full h-12 bg-[#0E0E10] border border-[#27272A] rounded-xl pl-12 pr-12 text-[#FAFAFA] placeholder:text-[#52525B] focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] outline-none transition-all"
                                                placeholder="••••••••"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute inset-y-0 right-4 flex items-center text-[#52525B] hover:text-[#B1B1B8] transition-colors"
                                            >
                                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    <AnimatePresence>
                                        {error && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-center gap-2 text-sm text-red-500"
                                            >
                                                <Sparkles className="h-4 w-4 shrink-0" />
                                                {error}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <motion.button
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full h-12 relative flex items-center justify-center gap-2 bg-gradient-to-r from-[#C9A227] to-[#b8911f] text-[#0E0E10] font-bold rounded-xl overflow-hidden group/btn disabled:opacity-70"
                                    >
                                        {isLoading ? (
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                        ) : (
                                            <>
                                                Sign into Dashboard
                                                <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                                    </motion.button>
                                </form>

                                <div className="pt-4 border-t border-[#27272A] flex justify-between items-center text-xs text-[#52525B]">
                                    <p>© 2026 Ether-AI Systems</p>
                                    <p className="cursor-pointer hover:text-[#B1B1B8] transition-colors">Privacy Policy</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Background Grain/Texture */}
            <div className="absolute inset-0 pointer-events-none h-full w-full opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </div>
    );
}
