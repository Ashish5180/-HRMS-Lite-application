"use client";

import { Trash2, Plus, Mail, Building2, Fingerprint, Loader2, AlertCircle } from "lucide-react";
import { Button } from "./ui/Button";
import { Card, CardContent } from "./ui/Card";
import { motion, AnimatePresence } from "framer-motion";

interface Employee {
    _id: string;
    employeeId: string;
    fullName: string;
    email: string;
    department: string;
}

interface EmployeeListProps {
    employees: Employee[];
    isLoading: boolean;
    error: string | null;
    onDelete: (id: string) => void;
    onAdd: () => void;
    onViewHistory: (employee: Employee) => void;
}

export function EmployeeList({ employees, isLoading, error, onDelete, onAdd, onViewHistory }: EmployeeListProps) {
    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-64 flex-col items-center justify-center space-y-4 rounded-xl border-2 border-dashed border-red-200 bg-red-50 p-8 dark:border-red-900/30 dark:bg-red-900/10">
                <AlertCircle className="h-10 w-10 text-red-500" />
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-red-800 dark:text-red-400">Oops! Something went wrong</h3>
                    <p className="text-sm text-red-600 dark:text-red-500">{error}</p>
                </div>
                <Button variant="danger" onClick={() => window.location.reload()}>Try Again</Button>
            </div>
        );
    }

    if (employees.length === 0) {
        return (
            <div className="flex h-64 flex-col items-center justify-center space-y-4 rounded-xl border-2 border-dashed border-zinc-200 p-8 dark:border-zinc-800">
                <div className="rounded-full bg-zinc-100 p-4 dark:bg-zinc-800">
                    <Plus className="h-8 w-8 text-zinc-400" />
                </div>
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">No employees yet</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Start by adding your first employee to the system.</p>
                </div>
                <Button onClick={onAdd} icon={Plus}>Add Employee</Button>
            </div>
        );
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
                {employees.map((employee) => (
                    <motion.div
                        key={employee._id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Card className="group relative overflow-hidden transition-all hover:shadow-lg dark:hover:border-zinc-700">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-4 w-full">
                                        <div className="flex items-center space-y-1">
                                            <div>
                                                <h4 className="text-lg font-bold text-zinc-900 dark:text-white">
                                                    {employee.fullName}
                                                </h4>
                                                <div className="flex items-center text-xs font-medium text-zinc-500 dark:text-zinc-400">
                                                    <Fingerprint className="mr-1 h-3 w-3" />
                                                    {employee.employeeId}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <div className="flex items-center text-sm text-zinc-600 dark:text-zinc-400">
                                                <Mail className="mr-2 h-4 w-4 text-indigo-500" />
                                                {employee.email}
                                            </div>
                                            <div className="flex items-center text-sm text-zinc-600 dark:text-zinc-400">
                                                <Building2 className="mr-2 h-4 w-4 text-indigo-500" />
                                                {employee.department}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 pt-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1 text-xs"
                                                onClick={() => onViewHistory(employee)}
                                            >
                                                History
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 w-8 dark:text-red-400 dark:hover:bg-red-400/10 text-zinc-400 hover:text-red-600 hover:bg-red-50 border-zinc-100 dark:border-zinc-800"
                                                onClick={() => onDelete(employee._id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
