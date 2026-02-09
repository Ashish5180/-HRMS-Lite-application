"use client";

import { Users, UserCheck, UserX, TrendingUp, Sparkles } from "lucide-react";
import { Card, CardContent } from "./ui/Card";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";

interface DashboardSummaryProps {
    totalEmployees: number;
    presentToday: number;
    absentToday: number;
}

function AnimatedCounter({ value, suffix = "" }: { value: number | string; suffix?: string }) {
    const [displayValue, setDisplayValue] = useState(0);
    const numericValue = typeof value === 'string' ? parseInt(value) || 0 : value;

    useEffect(() => {
        const controls = animate(0, numericValue, {
            duration: 1,
            onUpdate: (v) => setDisplayValue(Math.floor(v))
        });
        return () => controls.stop();
    }, [numericValue]);

    return <span>{displayValue}{suffix}</span>;
}

export function DashboardSummary({ totalEmployees, presentToday, absentToday }: DashboardSummaryProps) {
    const attendanceRate = totalEmployees > 0 ? Math.round((presentToday / totalEmployees) * 100) : 0;

    const stats = [
        {
            label: 'Total Employees',
            value: totalEmployees,
            icon: Users,
            color: 'text-indigo-700 dark:text-indigo-300',
            bg: 'bg-gradient-to-br from-indigo-50 via-indigo-100 to-purple-50 dark:from-indigo-950/40 dark:via-indigo-900/30 dark:to-purple-950/40',
            iconBg: 'bg-gradient-to-br from-indigo-600 to-indigo-700',
            glow: 'group-hover:shadow-indigo-200/50 dark:group-hover:shadow-indigo-900/30',
            ring: 'ring-indigo-100 dark:ring-indigo-900/30'
        },
        {
            label: 'Present Today',
            value: presentToday,
            icon: UserCheck,
            color: 'text-emerald-700 dark:text-emerald-300',
            bg: 'bg-gradient-to-br from-emerald-50 via-emerald-100 to-teal-50 dark:from-emerald-950/40 dark:via-emerald-900/30 dark:to-teal-950/40',
            iconBg: 'bg-gradient-to-br from-emerald-600 to-emerald-700',
            glow: 'group-hover:shadow-emerald-200/50 dark:group-hover:shadow-emerald-900/30',
            ring: 'ring-emerald-100 dark:ring-emerald-900/30'
        },
        {
            label: 'Absent Today',
            value: absentToday,
            icon: UserX,
            color: 'text-rose-700 dark:text-rose-300',
            bg: 'bg-gradient-to-br from-rose-50 via-rose-100 to-pink-50 dark:from-rose-950/40 dark:via-rose-900/30 dark:to-pink-950/40',
            iconBg: 'bg-gradient-to-br from-rose-600 to-rose-700',
            glow: 'group-hover:shadow-rose-200/50 dark:group-hover:shadow-rose-900/30',
            ring: 'ring-rose-100 dark:ring-rose-900/30'
        },
        {
            label: 'Attendance Rate',
            value: attendanceRate,
            suffix: '%',
            icon: TrendingUp,
            color: 'text-amber-700 dark:text-amber-300',
            bg: 'bg-gradient-to-br from-amber-50 via-amber-100 to-orange-50 dark:from-amber-950/40 dark:via-amber-900/30 dark:to-orange-950/40',
            iconBg: 'bg-gradient-to-br from-amber-600 to-amber-700',
            glow: 'group-hover:shadow-amber-200/50 dark:group-hover:shadow-amber-900/30',
            ring: 'ring-amber-100 dark:ring-amber-900/30'
        },
    ];

    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="group"
                >
                    <Card className={`overflow-hidden border-none shadow-lg ring-1 transition-all duration-300 ${stat.ring} ${stat.glow} hover:shadow-xl`}>
                        <CardContent className={`relative p-6 ${stat.bg}`}>
                            {/* Animated background gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-white/5" />

                            <div className="relative flex items-center justify-between">
                                <div className="flex-1">
                                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400">
                                        {stat.label}
                                    </p>
                                    <h4 className={`text-4xl font-bold tracking-tight ${stat.color} transition-all duration-300 group-hover:scale-105`}>
                                        <AnimatedCounter value={stat.value} suffix={stat.suffix || ''} />
                                    </h4>
                                </div>

                                {/* Animated Icon */}
                                <motion.div
                                    className={`relative rounded-2xl ${stat.iconBg} p-4 shadow-lg`}
                                    whileHover={{ rotate: 360, scale: 1.1 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    {/* Pulsing ring effect */}
                                    <motion.div
                                        className={`absolute inset-0 rounded-2xl ${stat.iconBg} opacity-75`}
                                        animate={{
                                            scale: [1, 1.2, 1],
                                            opacity: [0.75, 0, 0.75],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                    />
                                    <stat.icon className="relative h-7 w-7 text-white" />
                                </motion.div>
                            </div>

                            {/* Progress bar for attendance rate */}
                            {stat.label === 'Attendance Rate' && (
                                <motion.div
                                    className="mt-4 h-2 overflow-hidden rounded-full bg-white/50 dark:bg-zinc-800/50"
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ delay: 0.5, duration: 0.5 }}
                                >
                                    <motion.div
                                        className={`h-full rounded-full ${stat.iconBg}`}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${attendanceRate}%` }}
                                        transition={{ delay: 0.7, duration: 1, ease: "easeOut" }}
                                    />
                                </motion.div>
                            )}

                            {/* Sparkle effect on hover */}
                            <motion.div
                                className="absolute right-2 top-2"
                                initial={{ opacity: 0, scale: 0 }}
                                whileHover={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Sparkles className={`h-4 w-4 ${stat.color}`} />
                            </motion.div>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
}
