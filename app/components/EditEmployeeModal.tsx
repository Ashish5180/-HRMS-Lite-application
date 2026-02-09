"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Save, User, Mail, Phone, Briefcase, Calendar, Hash } from "lucide-react";
import { Button } from "./ui/Button";
import { Employee } from "../types";

interface EditEmployeeModalProps {
    isOpen: boolean;
    onClose: () => void;
    employee: Employee;
    onUpdate: (id: string, data: Partial<Employee>) => Promise<void>;
}

export function EditEmployeeModal({ isOpen, onClose, employee, onUpdate }: EditEmployeeModalProps) {
    const [formData, setFormData] = useState({
        fullName: employee?.fullName || '',
        email: employee?.email || '',
        phone: employee?.phone || '',
        department: employee?.department || '',
        position: employee?.position || '',
        joiningDate: employee?.joiningDate ? employee.joiningDate.split('T')[0] : '',
    });
    const [isLoading, setIsLoading] = useState(false);

    // Update form data when employee changes
    useEffect(() => {
        if (employee) {
            setFormData({
                fullName: employee.fullName || '',
                email: employee.email || '',
                phone: employee.phone || '',
                department: employee.department || '',
                position: employee.position || '',
                joiningDate: employee.joiningDate ? employee.joiningDate.split('T')[0] : '',
            });
        }
    }, [employee]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await onUpdate(employee._id, formData);
            onClose();
        } catch (error) {
            console.error("Failed to update employee", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-2xl overflow-hidden rounded-2xl border shadow-2xl"
                style={{
                    background: 'linear-gradient(135deg, #1C1C21 0%, #16161A 100%)',
                    borderColor: 'rgba(201, 162, 39, 0.2)',
                }}
            >
                {/* Header */}
                <div className="border-b px-6 py-4" style={{ borderColor: '#27272A' }}>
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold" style={{ color: '#FAFAFA' }}>
                                Edit Employee
                            </h2>
                            <p className="mt-1 text-sm" style={{ color: '#B1B1B8' }}>
                                Update employee information
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="rounded-lg p-2 transition-colors hover:bg-white/5"
                            style={{ color: '#A1A1AA' }}
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                        {/* Full Name */}
                        <div className="sm:col-span-2">
                            <label className="mb-2 block text-sm font-medium" style={{ color: '#FAFAFA' }}>
                                <User className="mb-1 inline h-4 w-4" /> Full Name
                            </label>
                            <input
                                type="text"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                className="w-full rounded-lg border px-4 py-2.5 transition-all focus:outline-none focus:ring-2"
                                style={{
                                    background: '#16161A',
                                    borderColor: '#27272A',
                                    color: '#FAFAFA',
                                }}
                                required
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="mb-2 block text-sm font-medium" style={{ color: '#FAFAFA' }}>
                                <Mail className="mb-1 inline h-4 w-4" /> Email
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full rounded-lg border px-4 py-2.5 transition-all focus:outline-none focus:ring-2"
                                style={{
                                    background: '#16161A',
                                    borderColor: '#27272A',
                                    color: '#FAFAFA',
                                }}
                                required
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="mb-2 block text-sm font-medium" style={{ color: '#FAFAFA' }}>
                                <Phone className="mb-1 inline h-4 w-4" /> Phone
                            </label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full rounded-lg border px-4 py-2.5 transition-all focus:outline-none focus:ring-2"
                                style={{
                                    background: '#16161A',
                                    borderColor: '#27272A',
                                    color: '#FAFAFA',
                                }}
                                required
                            />
                        </div>

                        {/* Department */}
                        <div>
                            <label className="mb-2 block text-sm font-medium" style={{ color: '#FAFAFA' }}>
                                <Briefcase className="mb-1 inline h-4 w-4" /> Department
                            </label>
                            <input
                                type="text"
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                className="w-full rounded-lg border px-4 py-2.5 transition-all focus:outline-none focus:ring-2"
                                style={{
                                    background: '#16161A',
                                    borderColor: '#27272A',
                                    color: '#FAFAFA',
                                }}
                                required
                            />
                        </div>

                        {/* Position */}
                        <div>
                            <label className="mb-2 block text-sm font-medium" style={{ color: '#FAFAFA' }}>
                                <Hash className="mb-1 inline h-4 w-4" /> Position
                            </label>
                            <input
                                type="text"
                                value={formData.position}
                                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                className="w-full rounded-lg border px-4 py-2.5 transition-all focus:outline-none focus:ring-2"
                                style={{
                                    background: '#16161A',
                                    borderColor: '#27272A',
                                    color: '#FAFAFA',
                                }}
                                required
                            />
                        </div>

                        {/* Joining Date */}
                        <div className="sm:col-span-2">
                            <label className="mb-2 block text-sm font-medium" style={{ color: '#FAFAFA' }}>
                                <Calendar className="mb-1 inline h-4 w-4" /> Joining Date
                            </label>
                            <input
                                type="date"
                                value={formData.joiningDate}
                                onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                                className="w-full rounded-lg border px-4 py-2.5 transition-all focus:outline-none focus:ring-2"
                                style={{
                                    background: '#16161A',
                                    borderColor: '#27272A',
                                    color: '#FAFAFA',
                                    colorScheme: 'dark',
                                }}
                                required
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                            className="flex-1"
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            icon={Save}
                            className="flex-1"
                            disabled={isLoading}
                            style={{
                                background: 'linear-gradient(135deg, #C9A227 0%, #b8911f 100%)',
                                color: '#0E0E10',
                            }}
                        >
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
