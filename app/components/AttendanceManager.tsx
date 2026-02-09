"use client";

import { useState, useEffect } from "react";
import { Check, X, Calendar, Search, Loader2 } from "lucide-react";
import { Button } from "./ui/Button";
import { Card, CardContent } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { Input } from "./ui/Input";
import { attendanceApi, employeeApi } from "@/app/lib/api";
import { format } from "date-fns";
import { cn } from "@/app/lib/utils";

interface Employee {
    _id: string;
    employeeId: string;
    fullName: string;
}

interface AttendanceRecord {
    _id: string;
    employee: string | { _id: string; fullName: string; employeeId: string };
    date: string;
    status: 'Present' | 'Absent';
}

export function AttendanceManager() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [records, setRecords] = useState<AttendanceRecord[]>([]);
    const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [isLoading, setIsLoading] = useState(true);
    const [markingId, setMarkingId] = useState<string | null>(null);

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

    const handleMarkAttendance = async (employeeId: string, status: 'Present' | 'Absent') => {
        setMarkingId(`${employeeId}-${status}`);
        try {
            await attendanceApi.mark({ employeeId, date: selectedDate, status });
            fetchData();
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

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Daily Attendance</h2>
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-zinc-500" />
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm dark:border-zinc-800 dark:bg-zinc-950"
                    />
                </div>
            </div>

            <Card className="overflow-hidden border-none shadow-md">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-zinc-50 text-zinc-500 dark:bg-zinc-900/50 dark:text-zinc-400">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Employee</th>
                                    <th className="px-6 py-4 font-semibold text-center">Status</th>
                                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-12 text-center">
                                            <Loader2 className="mx-auto h-6 w-6 animate-spin text-indigo-600" />
                                        </td>
                                    </tr>
                                ) : employees.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-12 text-center text-zinc-500">
                                            No employees found to mark attendance.
                                        </td>
                                    </tr>
                                ) : (
                                    employees.map((employee) => {
                                        const status = getStatus(employee._id);
                                        return (
                                            <tr key={employee._id} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50">
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-zinc-900 dark:text-zinc-100">{employee.fullName}</div>
                                                    <div className="text-xs text-zinc-500">{employee.employeeId}</div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    {status ? (
                                                        <Badge variant={status === 'Present' ? 'success' : 'danger'}>
                                                            {status}
                                                        </Badge>
                                                    ) : (
                                                        <span className="text-xs text-zinc-400 italic">Not Marked</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant={status === 'Present' ? 'primary' : 'outline'}
                                                            className={cn(
                                                                "h-8 px-2",
                                                                status === 'Present' && "bg-emerald-600 hover:bg-emerald-700 active:scale-95"
                                                            )}
                                                            onClick={() => handleMarkAttendance(employee._id, 'Present')}
                                                            isLoading={markingId === `${employee._id}-Present`}
                                                        >
                                                            <Check className="h-4 w-4 mr-1" />
                                                            Present
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant={status === 'Absent' ? 'danger' : 'outline'}
                                                            className={cn(
                                                                "h-8 px-2",
                                                                status === 'Absent' && "active:scale-95"
                                                            )}
                                                            onClick={() => handleMarkAttendance(employee._id, 'Absent')}
                                                            isLoading={markingId === `${employee._id}-Absent`}
                                                        >
                                                            <X className="h-4 w-4 mr-1" />
                                                            Absent
                                                        </Button>
                                                    </div>
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
