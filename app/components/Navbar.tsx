"use client";

import { Users, CalendarCheck, LayoutDashboard } from "lucide-react";
import { cn } from "@/app/lib/utils";

interface NavbarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export function Navbar({ activeTab, setActiveTab }: NavbarProps) {
    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'employees', label: 'Employees', icon: Users },
        { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
    ];

    return (
        <nav className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
                            <span className="text-sm font-bold text-white">HR</span>
                        </div>
                        <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
                            HRMS<span className="text-indigo-600">Lite</span>
                        </span>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        "inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium transition-colors",
                                        isActive
                                            ? "border-indigo-600 text-zinc-900 dark:text-white"
                                            : "border-transparent text-zinc-500 hover:border-zinc-300 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
                                    )}
                                >
                                    <Icon className="mr-2 h-4 w-4" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </nav>
    );
}
