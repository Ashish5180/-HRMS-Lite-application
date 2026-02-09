"use client";

import { useState, useEffect } from "react";
import { Check, X, Calendar, Clock, Home, Briefcase, Coffee, Heart, Loader2 } from "lucide-react";
import { Button } from "./ui/Button";
import { Card, CardContent } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { attendanceApi, employeeApi } from "@/app/lib/api";
import { format } from "date-fns";
import { cn } from "@/app/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Employee {
    _id: string;
    employeeId: string;
    fullName: string;
}

interface AttendanceRecord {
    _id: string;
    employee: string | { _id: string; fullName: string; employeeId: string };
    date: string;
    status: 'Present' | 'Absent' | 'Half Day' | 'Paid Leave' | 'Sick Leave' | 'Casual Leave' | 'Work From Home';
    notes?: string;
}

type AttendanceStatus = 'Present' | 'Absent' | 'Half Day' | 'Paid Leave' | 'Sick Leave' | 'Casual Leave' | 'Work From Home';

const attendanceTypes = [
    { value: 'Present', label: 'Present', icon: Check, color: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)' },
    { value: 'Half Day', label: 'Half Day', icon: Clock, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
    { value: 'Work From Home', label: 'WFH', icon: Home, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
    { value: 'Paid Leave', label: 'Paid Leave', icon: Coffee, color: '#C9A227', bg: 'rgba(201, 162, 39, 0.1)' },
    { value: 'Sick Leave', label: 'Sick Leave', icon: Heart, color: '#ec4899', bg: 'rgba(236, 72, 153, 0.1)' },
    { value: 'Casual Leave', label: 'Casual', icon: Briefcase, color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
    { value: 'Absent', label: 'Absent', icon: X, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
] as const;

export function AttendanceManager() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [records, setRecords] = useState<AttendanceRecord[]>([]);
    const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [isLoading, setIsLoading] = useState(true);
    const [markingId, setMarkingId] = useState<string | null>(null);
    const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [empRes, attRes] = await Promise.all([
                employeeApi.getAll(),
                attendanceApi.getAll(selectedDate)
            ]);
            setEmployees(empRes.data.data);
            setRecords(attRes.data.data);
        } catch (err) {
            console.error("Failed to fetch data", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedDate]);

    const handleMarkAttendance = async (employeeId: string, status: AttendanceStatus) => {
        setMarkingId(`${employeeId}-${status}`);
        try {
            await attendanceApi.mark({ employeeId, date: selectedDate, status });
            fetchData();
            setSelectedEmployee(null);
        } catch (err) {
            console.error("Failed to mark attendance", err);
        } finally {
            setMarkingId(null);
        }
    };

    const getStatus = (employeeId: string) => {
        const record = records.find(r => {
            const empId = typeof r.employee === 'string' ? r.employee : r.employee._id;
            return empId === employeeId;
        });
        return record?.status;
    };

    const getStatusConfig = (status?: string) => {
        return attendanceTypes.find(t => t.value === status) || attendanceTypes[0];
    };

    const getStats = () => {
        const stats = attendanceTypes.map(type => ({
            ...type,
            count: records.filter(r => r.status === type.value).length
        }));
        return stats;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight" style={{ color: '#FAFAFA' }}>Daily Attendance</h2>
                    <p className="mt-1 text-sm" style={{ color: '#B1B1B8' }}>Mark attendance for all employees</p>
                </div>
                <div className="relative">
                    <div className="flex items-center gap-2 rounded-lg border px-4 py-2.5 shadow-sm transition-all hover:border-opacity-50"
                        style={{ background: '#16161A', borderColor: '#27272A' }}>
                        <Calendar className="h-5 w-5" style={{ color: '#C9A227' }} />
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="cursor-pointer bg-transparent text-sm font-medium outline-none"
                            style={{
                                color: '#FAFAFA',
                                colorScheme: 'dark'
                            }}
                        />
                    </div>
                    <div className="mt-1 text-xs" style={{ color: '#B1B1B8' }}>
                        {format(new Date(selectedDate), 'EEEE, MMMM dd, yyyy')}
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
                {getStats().map((stat) => (
                    <Card key={stat.value} style={{ background: 'linear-gradient(135deg, #1C1C21 0%, #16161A 100%)', border: `1px solid ${stat.color}40` }}>
                        <CardContent className="p-3">
                            <div className="flex items-center gap-2">
                                <div className="rounded-lg p-1.5" style={{ background: stat.bg }}>
                                    <stat.icon className="h-4 w-4" style={{ color: stat.color }} />
                                </div>
                                <div>
                                    <p className="text-xs" style={{ color: '#B1B1B8' }}>{stat.label}</p>
                                    <p className="text-lg font-bold" style={{ color: '#FAFAFA' }}>{stat.count}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Employee List */}
            <Card style={{ background: 'linear-gradient(135deg, #1C1C21 0%, #16161A 100%)', border: '1px solid #27272A' }}>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead style={{ background: '#16161A', color: '#B1B1B8' }}>
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Employee</th>
                                    <th className="px-6 py-4 font-semibold text-center">Status</th>
                                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y" style={{ borderColor: '#27272A' }}>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-12 text-center">
                                            <Loader2 className="mx-auto h-6 w-6 animate-spin" style={{ color: '#C9A227' }} />
                                        </td>
                                    </tr>
                                ) : employees.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-12 text-center" style={{ color: '#B1B1B8' }}>
                                            No employees found to mark attendance.
                                        </td>
                                    </tr>
                                ) : (
                                    employees.map((employee) => {
                                        const status = getStatus(employee._id);
                                        const statusConfig = getStatusConfig(status);
                                        const isExpanded = selectedEmployee === employee._id;

                                        return (
                                            <tr key={employee._id} className="group transition-colors hover:bg-white/5">
                                                <td className="px-6 py-4">
                                                    <div className="font-medium" style={{ color: '#FAFAFA' }}>{employee.fullName}</div>
                                                    <div className="text-xs" style={{ color: '#B1B1B8' }}>{employee.employeeId}</div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    {status ? (
                                                        <div className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5"
                                                            style={{ background: statusConfig.bg, color: statusConfig.color }}>
                                                            <statusConfig.icon className="h-4 w-4" />
                                                            <span className="text-xs font-semibold">{statusConfig.label}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs italic" style={{ color: '#71717A' }}>Not Marked</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => setSelectedEmployee(isExpanded ? null : employee._id)}
                                                        className="rounded-lg px-4 py-2 text-sm font-medium transition-all hover:bg-white/5"
                                                        style={{ color: '#C9A227' }}
                                                    >
                                                        {isExpanded ? 'Close' : 'Mark'}
                                                    </button>

                                                    {isExpanded && (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            className="absolute right-6 z-10 mt-2 grid grid-cols-2 gap-2 rounded-lg border p-3 shadow-xl sm:grid-cols-4"
                                                            style={{ background: '#1C1C21', borderColor: '#27272A', minWidth: '400px' }}
                                                        >
                                                            {attendanceTypes.map((type) => (
                                                                <button
                                                                    key={type.value}
                                                                    onClick={() => handleMarkAttendance(employee._id, type.value as AttendanceStatus)}
                                                                    disabled={markingId === `${employee._id}-${type.value}`}
                                                                    className="flex items-center gap-2 rounded-lg p-2 text-left transition-all hover:scale-105 disabled:opacity-50"
                                                                    style={{
                                                                        background: status === type.value ? type.bg : 'transparent',
                                                                        border: `1px solid ${status === type.value ? type.color : '#27272A'}`,
                                                                        color: status === type.value ? type.color : '#FAFAFA'
                                                                    }}
                                                                >
                                                                    <type.icon className="h-4 w-4" />
                                                                    <span className="text-xs font-medium">{type.label}</span>
                                                                </button>
                                                            ))}
                                                        </motion.div>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
