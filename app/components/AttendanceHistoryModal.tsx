"use client";

import { useState, useEffect } from "react";
import { Modal } from "./ui/Modal";
import { Card, CardContent } from "./ui/Card";
import { attendanceApi } from "@/app/lib/api";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, subMonths, isSameDay, startOfWeek, endOfWeek, addDays } from "date-fns";
import {
    Calendar, Loader2, Award, CheckCircle2, XCircle,
    Clock, Home, Coffee, Heart, Briefcase, ChevronLeft, ChevronRight,
    Download, BarChart3, PieChart
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Employee, AttendanceRecord } from "../types";

interface AttendanceHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    employee: Employee | null;
}

const statusConfig: Record<string, { icon: React.ElementType; color: string; bg: string; label: string }> = {
    'Present': { icon: CheckCircle2, color: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)', label: 'Present' },
    'Half Day': { icon: Clock, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', label: 'Half Day' },
    'Work From Home': { icon: Home, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)', label: 'WFH' },
    'Paid Leave': { icon: Coffee, color: '#C9A227', bg: 'rgba(201, 162, 39, 0.1)', label: 'Paid Leave' },
    'Sick Leave': { icon: Heart, color: '#ec4899', bg: 'rgba(236, 72, 153, 0.1)', label: 'Sick Leave' },
    'Casual Leave': { icon: Briefcase, color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)', label: 'Casual' },
    'Absent': { icon: XCircle, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', label: 'Absent' },
};

export function AttendanceHistoryModal({ isOpen, onClose, employee }: AttendanceHistoryModalProps) {
    const [records, setRecords] = useState<AttendanceRecord[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const [viewMode, setViewMode] = useState<'calendar' | 'list' | 'stats'>('calendar');
    const [hoveredDay, setHoveredDay] = useState<{ date: Date; status: string; notes?: string } | null>(null);

    const fetchHistory = async () => {
        if (!employee?._id) return;
        setIsLoading(true);
        try {
            const res = await attendanceApi.getEmployeeAttendance(employee._id);
            setRecords(res.data.data);
        } catch (err) {
            console.error("Failed to fetch attendance history", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen && employee?._id) {
            fetchHistory();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, employee]);

    // Calculate statistics
    const stats = {
        present: records.filter(r => r.status === 'Present').length,
        halfDay: records.filter(r => r.status === 'Half Day').length,
        wfh: records.filter(r => r.status === 'Work From Home').length,
        paidLeave: records.filter(r => r.status === 'Paid Leave').length,
        sickLeave: records.filter(r => r.status === 'Sick Leave').length,
        casualLeave: records.filter(r => r.status === 'Casual Leave').length,
        absent: records.filter(r => r.status === 'Absent').length,
    };

    const totalDays = records.length;
    const workingDays = stats.present + stats.halfDay + stats.wfh;
    const attendanceRate = totalDays > 0 ? Math.round((workingDays / totalDays) * 100) : 0;

    // Get calendar days for selected month
    const monthStart = startOfMonth(selectedMonth);
    const monthEnd = endOfMonth(selectedMonth);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);
    const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    // Create attendance map
    const attendanceMap = new Map(
        records.map(record => [
            format(new Date(record.date), 'yyyy-MM-dd'),
            record
        ])
    );

    const getDayStatus = (date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        return attendanceMap.get(dateStr);
    };

    const exportToCSV = () => {
        const headers = ["Date", "Status", "Notes"];
        const rows = records.map(r => [
            format(new Date(r.date), 'yyyy-MM-dd'),
            r.status,
            r.notes || ''
        ]);
        const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${employee?.fullName}_attendance_${format(new Date(), 'yyyy-MM-dd')}.csv`;
        a.click();
    };

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title=""
        >
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold" style={{ color: '#FAFAFA' }}>
                            {employee?.fullName}
                        </h2>
                        <p className="text-sm" style={{ color: '#B1B1B8' }}>
                            {employee?.employeeId} • Attendance History
                        </p>
                    </div>
                    <button
                        onClick={exportToCSV}
                        className="flex items-center gap-2 rounded-lg px-4 py-2 transition-all hover:bg-white/5"
                        style={{ color: '#C9A227', border: '1px solid #27272A' }}
                    >
                        <Download className="h-4 w-4" />
                        Export
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex h-96 items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#C9A227' }} />
                    </div>
                ) : (
                    <>
                        {/* View Mode Tabs */}
                        <div className="flex gap-2 rounded-lg p-1" style={{ background: '#16161A' }}>
                            {[
                                { mode: 'calendar', icon: Calendar, label: 'Calendar' },
                                { mode: 'list', icon: BarChart3, label: 'Timeline' },
                                { mode: 'stats', icon: PieChart, label: 'Statistics' },
                            ].map((tab) => (
                                <button
                                    key={tab.mode}
                                    onClick={() => setViewMode(tab.mode as 'calendar' | 'list' | 'stats')}
                                    className="relative flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all"
                                    style={{
                                        color: viewMode === tab.mode ? '#0E0E10' : '#B1B1B8',
                                        background: viewMode === tab.mode ? 'linear-gradient(135deg, #C9A227 0%, #b8911f 100%)' : 'transparent'
                                    }}
                                >
                                    <tab.icon className="inline h-4 w-4 mr-2" />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Stats Overview */}
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                            <Card style={{ background: 'linear-gradient(135deg, #1C1C21 0%, #16161A 100%)', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                                <CardContent className="p-3">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="h-5 w-5" style={{ color: '#22c55e' }} />
                                        <div>
                                            <p className="text-xs" style={{ color: '#B1B1B8' }}>Working</p>
                                            <p className="text-xl font-bold" style={{ color: '#FAFAFA' }}>{workingDays}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card style={{ background: 'linear-gradient(135deg, #1C1C21 0%, #16161A 100%)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                                <CardContent className="p-3">
                                    <div className="flex items-center gap-2">
                                        <XCircle className="h-5 w-5" style={{ color: '#ef4444' }} />
                                        <div>
                                            <p className="text-xs" style={{ color: '#B1B1B8' }}>Absent</p>
                                            <p className="text-xl font-bold" style={{ color: '#FAFAFA' }}>{stats.absent}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card style={{ background: 'linear-gradient(135deg, #1C1C21 0%, #16161A 100%)', border: '1px solid rgba(201, 162, 39, 0.2)' }}>
                                <CardContent className="p-3">
                                    <div className="flex items-center gap-2">
                                        <Coffee className="h-5 w-5" style={{ color: '#C9A227' }} />
                                        <div>
                                            <p className="text-xs" style={{ color: '#B1B1B8' }}>Leaves</p>
                                            <p className="text-xl font-bold" style={{ color: '#FAFAFA' }}>
                                                {stats.paidLeave + stats.sickLeave + stats.casualLeave}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card style={{ background: 'linear-gradient(135deg, #1C1C21 0%, #16161A 100%)', border: '1px solid rgba(201, 162, 39, 0.2)' }}>
                                <CardContent className="p-3">
                                    <div className="flex items-center gap-2">
                                        <Award className="h-5 w-5" style={{ color: '#C9A227' }} />
                                        <div>
                                            <p className="text-xs" style={{ color: '#B1B1B8' }}>Rate</p>
                                            <p className="text-xl font-bold" style={{ color: '#FAFAFA' }}>{attendanceRate}%</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Calendar View */}
                        <AnimatePresence mode="wait">
                            {viewMode === 'calendar' && (
                                <motion.div
                                    key="calendar"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-4"
                                >
                                    {/* Month Navigator */}
                                    <div className="flex items-center justify-between">
                                        <button
                                            onClick={() => setSelectedMonth(subMonths(selectedMonth, 1))}
                                            className="rounded-lg p-2 transition-all hover:bg-white/5"
                                            style={{ color: '#C9A227' }}
                                        >
                                            <ChevronLeft className="h-5 w-5" />
                                        </button>
                                        <h3 className="text-lg font-bold" style={{ color: '#FAFAFA' }}>
                                            {format(selectedMonth, 'MMMM yyyy')}
                                        </h3>
                                        <button
                                            onClick={() => setSelectedMonth(addDays(selectedMonth, 30))}
                                            className="rounded-lg p-2 transition-all hover:bg-white/5"
                                            style={{ color: '#C9A227' }}
                                        >
                                            <ChevronRight className="h-5 w-5" />
                                        </button>
                                    </div>

                                    {/* Calendar Grid */}
                                    <Card style={{ background: 'linear-gradient(135deg, #1C1C21 0%, #16161A 100%)', border: '1px solid #27272A' }}>
                                        <CardContent className="p-4">
                                            {/* Week Days Header */}
                                            <div className="mb-2 grid grid-cols-7 gap-2">
                                                {weekDays.map(day => (
                                                    <div key={day} className="text-center text-xs font-semibold" style={{ color: '#B1B1B8' }}>
                                                        {day}
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Calendar Days */}
                                            <div className="grid grid-cols-7 gap-2">
                                                {calendarDays.map((day, index) => {
                                                    const record = getDayStatus(day);
                                                    const isCurrentMonth = day.getMonth() === selectedMonth.getMonth();
                                                    const isToday = isSameDay(day, new Date());
                                                    const config = record ? statusConfig[record.status] : null;

                                                    return (
                                                        <motion.div
                                                            key={index}
                                                            whileHover={{ scale: 1.1 }}
                                                            className="relative aspect-square cursor-pointer rounded-lg transition-all"
                                                            style={{
                                                                background: config ? config.bg : isCurrentMonth ? '#16161A' : '#0E0E10',
                                                                border: isToday ? '2px solid #C9A227' : '1px solid #27272A',
                                                                opacity: isCurrentMonth ? 1 : 0.3
                                                            }}
                                                            onMouseEnter={() => record && setHoveredDay({ date: day, status: record.status, notes: record.notes })}
                                                            onMouseLeave={() => setHoveredDay(null)}
                                                        >
                                                            <div className="flex h-full flex-col items-center justify-center p-1">
                                                                <span className="text-xs font-medium" style={{ color: config ? config.color : '#FAFAFA' }}>
                                                                    {format(day, 'd')}
                                                                </span>
                                                                {config && (
                                                                    <config.icon className="h-3 w-3 mt-0.5" style={{ color: config.color }} />
                                                                )}
                                                            </div>
                                                        </motion.div>
                                                    );
                                                })}
                                            </div>

                                            {/* Hover Tooltip */}
                                            {hoveredDay && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="mt-4 rounded-lg border p-3"
                                                    style={{ background: '#1C1C21', borderColor: '#27272A' }}
                                                >
                                                    <p className="text-sm font-medium" style={{ color: '#FAFAFA' }}>
                                                        {format(hoveredDay.date, 'EEEE, MMMM dd, yyyy')}
                                                    </p>
                                                    <div className="mt-2 flex items-center gap-2">
                                                        {statusConfig[hoveredDay.status as keyof typeof statusConfig] && (
                                                            <>
                                                                {(() => {
                                                                    const Icon = statusConfig[hoveredDay.status as keyof typeof statusConfig].icon;
                                                                    return <Icon className="h-4 w-4" style={{ color: statusConfig[hoveredDay.status as keyof typeof statusConfig].color }} />;
                                                                })()}
                                                                <span className="text-sm" style={{ color: statusConfig[hoveredDay.status as keyof typeof statusConfig].color }}>
                                                                    {hoveredDay.status}
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>
                                                    {hoveredDay.notes && (
                                                        <p className="mt-2 text-xs" style={{ color: '#B1B1B8' }}>
                                                            Note: {hoveredDay.notes}
                                                        </p>
                                                    )}
                                                </motion.div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}

                            {/* List View */}
                            {viewMode === 'list' && (
                                <motion.div
                                    key="list"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                >
                                    <Card style={{ background: 'linear-gradient(135deg, #1C1C21 0%, #16161A 100%)', border: '1px solid #27272A' }}>
                                        <CardContent className="p-0">
                                            <div className="max-h-96 overflow-y-auto">
                                                {records.length === 0 ? (
                                                    <div className="flex h-40 flex-col items-center justify-center" style={{ color: '#B1B1B8' }}>
                                                        <Calendar className="mb-2 h-10 w-10 opacity-20" />
                                                        <p>No attendance records found.</p>
                                                    </div>
                                                ) : (
                                                    records.slice().reverse().map((record, index) => {
                                                        const config = statusConfig[record.status];
                                                        const Icon = config.icon;
                                                        return (
                                                            <motion.div
                                                                key={record._id}
                                                                initial={{ opacity: 0, x: -20 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                transition={{ delay: index * 0.02 }}
                                                                className="flex items-center justify-between border-b p-4 transition-colors hover:bg-white/5"
                                                                style={{ borderColor: '#27272A' }}
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <div className="rounded-lg p-2" style={{ background: config.bg }}>
                                                                        <Icon className="h-4 w-4" style={{ color: config.color }} />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-sm font-medium" style={{ color: '#FAFAFA' }}>
                                                                            {format(new Date(record.date), 'EEEE, MMMM dd, yyyy')}
                                                                        </p>
                                                                        {record.notes && (
                                                                            <p className="text-xs" style={{ color: '#B1B1B8' }}>
                                                                                {record.notes}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className="rounded-lg px-3 py-1" style={{ background: config.bg, color: config.color }}>
                                                                    <span className="text-xs font-semibold">{config.label}</span>
                                                                </div>
                                                            </motion.div>
                                                        );
                                                    })
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}

                            {/* Stats View */}
                            {viewMode === 'stats' && (
                                <motion.div
                                    key="stats"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="grid gap-3 sm:grid-cols-2"
                                >
                                    {Object.entries(statusConfig).map(([status, config]) => {
                                        const count = records.filter(r => r.status === status).length;
                                        const percentage = totalDays > 0 ? Math.round((count / totalDays) * 100) : 0;
                                        const Icon = config.icon;

                                        return (
                                            <Card key={status} style={{ background: 'linear-gradient(135deg, #1C1C21 0%, #16161A 100%)', border: `1px solid ${config.color}40` }}>
                                                <CardContent className="p-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="rounded-lg p-2" style={{ background: config.bg }}>
                                                                <Icon className="h-5 w-5" style={{ color: config.color }} />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium" style={{ color: '#FAFAFA' }}>{status}</p>
                                                                <p className="text-xs" style={{ color: '#B1B1B8' }}>{count} days</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-2xl font-bold" style={{ color: config.color }}>{percentage}%</p>
                                                        </div>
                                                    </div>
                                                    <div className="mt-3 h-2 w-full overflow-hidden rounded-full" style={{ background: '#16161A' }}>
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${percentage}%` }}
                                                            transition={{ duration: 1, ease: "easeOut" }}
                                                            className="h-full rounded-full"
                                                            style={{ background: config.color }}
                                                        />
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </>
                )}
            </div>
        </Modal>
    );
}
