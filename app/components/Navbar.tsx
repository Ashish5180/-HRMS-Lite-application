"use client";

import { Users, CalendarCheck, LayoutDashboard, LogOut } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { motion } from "framer-motion";

interface NavbarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    onLogout?: () => void;
}

export function Navbar({ activeTab, setActiveTab, onLogout }: NavbarProps) {
    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'employees', label: 'Employees', icon: Users },
        { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
    ];

    return (
        <div className="sticky top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
            <motion.nav
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="mx-auto max-w-7xl overflow-hidden rounded-2xl border border-white/20 bg-white/70 shadow-lg shadow-zinc-900/5 backdrop-blur-xl dark:border-zinc-700/50 dark:bg-zinc-900/70 dark:shadow-zinc-950/20"
            >
                <div className="flex h-16 items-center justify-between px-6">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <motion.div
                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg"
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            transition={{ duration: 0.2 }}
                        >
                            <span className="text-sm font-bold text-white">HR</span>
                        </motion.div>
                        <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
                            HRMS<span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Lite</span>
                        </span>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="hidden items-center gap-2 md:flex">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <motion.button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        "relative inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all",
                                        isActive
                                            ? "text-white shadow-lg"
                                            : "text-zinc-600 hover:bg-white/50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-white"
                                    )}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600"
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        />
                                    )}
                                    <Icon className="relative h-4 w-4" />
                                    <span className="relative">{tab.label}</span>
                                </motion.button>
                            );
                        })}
                    </div>

                    {/* Admin & Logout */}
                    <div className="flex items-center gap-3">
                        <div className="hidden items-center gap-2 rounded-xl bg-zinc-100/80 px-3 py-1.5 dark:bg-zinc-800/80 sm:flex">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-xs font-bold text-white">
                                A
                            </div>
                            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Admin</span>
                        </div>
                        {onLogout && (
                            <motion.button
                                onClick={onLogout}
                                className="flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition-all hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <LogOut className="h-4 w-4" />
                                <span className="hidden sm:inline">Logout</span>
                            </motion.button>
                        )}
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className="flex border-t border-zinc-200/50 dark:border-zinc-700/50 md:hidden">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium transition-colors",
                                    isActive
                                        ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400"
                                        : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50"
                                )}
                            >
                                <Icon className="h-5 w-5" />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>
            </motion.nav>
        </div>
    );
}
