"use client";

import { useState, useEffect } from "react";
import { Modal } from "./ui/Modal";
import { Badge } from "./ui/Badge";
import { attendanceApi } from "@/app/lib/api";
import { format } from "date-fns";
import { Calendar, Loader2 } from "lucide-react";

interface AttendanceRecord {
    _id: string;
    date: string;
    status: 'Present' | 'Absent';
}

interface AttendanceHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    employee: {
        _id: string;
        fullName: string;
        employeeId: string;
    } | null;
}

export function AttendanceHistoryModal({ isOpen, onClose, employee }: AttendanceHistoryModalProps) {
    const [records, setRecords] = useState<AttendanceRecord[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen && employee?._id) {
            const fetchHistory = async () => {
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
            fetchHistory();
        }
    }, [isOpen, employee]);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={employee ? `${employee.fullName}'s Attendance History` : "Attendance History"}
        >
            <div className="space-y-4">
                {isLoading ? (
                    <div className="flex h-40 items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                    </div>
                ) : records.length === 0 ? (
                    <div className="flex h-40 flex-col items-center justify-center text-zinc-500">
                        <Calendar className="mb-2 h-10 w-10 opacity-20" />
                        <p>No attendance records found.</p>
                    </div>
                ) : (
                    <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                            {records.map((record) => (
                                <div key={record._id} className="flex items-center justify-between py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-lg bg-zinc-100 p-2 dark:bg-zinc-800">
                                            <Calendar className="h-4 w-4 text-zinc-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                                {format(new Date(record.date), 'MMMM dd, yyyy')}
                                            </p>
                                            <p className="text-xs text-zinc-500">
                                                {format(new Date(record.date), 'EEEE')}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge variant={record.status === 'Present' ? 'success' : 'danger'}>
                                        {record.status}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
}
