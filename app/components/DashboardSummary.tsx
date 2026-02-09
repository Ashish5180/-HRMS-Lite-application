"use client";

import { Users, UserCheck, UserX, TrendingUp } from "lucide-react";
import { Card, CardContent } from "./ui/Card";
import { motion } from "framer-motion";

interface DashboardSummaryProps {
    totalEmployees: number;
    presentToday: number;
    absentToday: number;
}

export function DashboardSummary({ totalEmployees, presentToday, absentToday }: DashboardSummaryProps) {
    const stats = [
        { label: 'Total Employees', value: totalEmployees, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-100' },
        { label: 'Present Today', value: presentToday, icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-100' },
        { label: 'Absent Today', value: absentToday, icon: UserX, color: 'text-rose-600', bg: 'bg-rose-100' },
        {
            label: 'Attendance Rate',
            value: totalEmployees > 0 ? `${Math.round((presentToday / totalEmployees) * 100)}%` : '0%',
            icon: TrendingUp,
            color: 'text-amber-600',
            bg: 'bg-amber-100'
        },
    ];

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <Card className="overflow-hidden border-none shadow-md">
                        <CardContent className="flex items-center p-6">
                            <div className={`mr-4 rounded-xl ${stat.bg} p-3`}>
                                <stat.icon className={`h-6 w-6 ${stat.color}`} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                                    {stat.label}
                                </p>
                                <h4 className="text-2xl font-bold text-zinc-900 dark:text-white">
                                    {stat.value}
                                </h4>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
}
