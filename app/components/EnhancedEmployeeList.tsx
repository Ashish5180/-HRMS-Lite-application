"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Trash2, Edit, Eye, Search, Download,
    Mail, Phone, Briefcase, Calendar, AlertTriangle,
    CheckCircle2, XCircle, Users, SortAsc, SortDesc,
    Grid3x3, List, Star,
    Building2
} from "lucide-react";
import { Button } from "./ui/Button";
import { Card, CardContent } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { format } from "date-fns";
import { Employee } from "../types";

interface EnhancedEmployeeListProps {
    employees: Employee[];
    isLoading: boolean;
    error: string | null;
    onDelete: (id: string) => void;
    onEdit: (employee: Employee) => void;
    onViewHistory: (employee: Employee) => void;
}

export function EnhancedEmployeeList({
    employees,
    isLoading,
    error,
    onDelete,
    onEdit,
    onViewHistory
}: EnhancedEmployeeListProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState("all");
    const [sortBy, setSortBy] = useState<"name" | "date" | "department">("name");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
    const [favorites, setFavorites] = useState<Set<string>>(new Set());

    // Get unique departments
    const departments = ["all", ...new Set(employees.map(e => e.department))];

    // Filter and sort employees
    const filteredEmployees = employees
        .filter(emp => {
            const matchesSearch =
                emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                emp.department.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesDepartment = selectedDepartment === "all" || emp.department === selectedDepartment;

            return matchesSearch && matchesDepartment;
        })
        .sort((a, b) => {
            let comparison = 0;
            if (sortBy === "name") {
                comparison = a.fullName.localeCompare(b.fullName);
            } else if (sortBy === "date") {
                const dateA = new Date(a.joiningDate).getTime();
                const dateB = new Date(b.joiningDate).getTime();
                comparison = (isNaN(dateA) ? 0 : dateA) - (isNaN(dateB) ? 0 : dateB);
            } else if (sortBy === "department") {
                comparison = a.department.localeCompare(b.department);
            }
            return sortOrder === "asc" ? comparison : -comparison;
        });

    const handleDelete = (id: string) => {
        if (deleteConfirm === id) {
            onDelete(id);
            setDeleteConfirm(null);
        } else {
            setDeleteConfirm(id);
            setTimeout(() => setDeleteConfirm(null), 3000);
        }
    };

    const toggleFavorite = (id: string) => {
        const newFavorites = new Set(favorites);
        if (newFavorites.has(id)) {
            newFavorites.delete(id);
        } else {
            newFavorites.add(id);
        }
        setFavorites(newFavorites);
    };

    const exportToCSV = () => {
        const headers = ["Employee ID", "Name", "Email", "Phone", "Department", "Position", "Joining Date"];
        const rows = filteredEmployees.map(emp => [
            emp.employeeId,
            emp.fullName,
            emp.email,
            emp.phone,
            emp.department,
            emp.position,
            emp.joiningDate && !isNaN(new Date(emp.joiningDate).getTime())
                ? format(new Date(emp.joiningDate), 'yyyy-MM-dd')
                : 'N/A'
        ]);

        const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `employees_${format(new Date(), 'yyyy-MM-dd')}.csv`;
        a.click();
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"
                    style={{ borderColor: '#C9A227', borderTopColor: 'transparent' }} />
            </div>
        );
    }

    if (error) {
        return (
            <Card style={{ background: 'linear-gradient(135deg, #1C1C21 0%, #16161A 100%)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                <CardContent className="p-6 text-center">
                    <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
                    <p className="mt-2" style={{ color: '#FAFAFA' }}>{error}</p>
                </CardContent>
            </Card>
        );
    }

    const departmentStats = departments.slice(1).map(dept => ({
        name: dept,
        count: employees.filter(e => e.department === dept).length
    }));

    return (
        <div className="space-y-6">
            {/* Enhanced Controls */}
            <div className="flex flex-col gap-4">
                {/* Search and Filters Row */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    {/* Search */}
                    <div className="relative flex-1 sm:max-w-md">
                        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2" style={{ color: '#A1A1AA' }} />
                        <input
                            type="text"
                            placeholder="Search by name, ID, email, or department..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-lg border py-2.5 pl-10 pr-4 transition-all focus:outline-none focus:ring-2"
                            style={{
                                background: '#16161A',
                                borderColor: '#27272A',
                                color: '#FAFAFA',
                                boxShadow: searchTerm ? '0 0 0 2px rgba(201, 162, 39, 0.1)' : 'none'
                            }}
                        />
                        {searchTerm && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute right-3 top-1/2 -translate-y-1/2"
                            >
                                <button
                                    onClick={() => setSearchTerm("")}
                                    className="rounded-full p-1 transition-all hover:bg-white/10"
                                    style={{ color: '#C9A227' }}
                                >
                                    <XCircle className="h-4 w-4" />
                                </button>
                            </motion.div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                        {/* Department Filter */}
                        <select
                            value={selectedDepartment}
                            onChange={(e) => setSelectedDepartment(e.target.value)}
                            className="rounded-lg border px-4 py-2.5 transition-all focus:outline-none focus:ring-2"
                            style={{
                                background: '#16161A',
                                borderColor: '#27272A',
                                color: '#FAFAFA',
                            }}
                        >
                            {departments.map(dept => (
                                <option key={dept} value={dept}>
                                    {dept === "all" ? "All Departments" : dept}
                                </option>
                            ))}
                        </select>

                        {/* Sort By */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as "name" | "date" | "department")}
                            className="rounded-lg border px-4 py-2.5 transition-all focus:outline-none focus:ring-2"
                            style={{
                                background: '#16161A',
                                borderColor: '#27272A',
                                color: '#FAFAFA',
                            }}
                        >
                            <option value="name">Sort by Name</option>
                            <option value="date">Sort by Date</option>
                            <option value="department">Sort by Department</option>
                        </select>

                        {/* Sort Order */}
                        <button
                            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                            className="rounded-lg border px-3 py-2.5 transition-all hover:bg-white/5"
                            style={{ borderColor: '#27272A', color: '#C9A227' }}
                            title={sortOrder === "asc" ? "Ascending" : "Descending"}
                        >
                            {sortOrder === "asc" ? <SortAsc className="h-5 w-5" /> : <SortDesc className="h-5 w-5" />}
                        </button>

                        {/* View Mode Toggle */}
                        <div className="flex rounded-lg border" style={{ borderColor: '#27272A' }}>
                            <button
                                onClick={() => setViewMode("grid")}
                                className="px-3 py-2.5 transition-all"
                                style={{
                                    background: viewMode === "grid" ? 'rgba(201, 162, 39, 0.1)' : 'transparent',
                                    color: viewMode === "grid" ? '#C9A227' : '#B1B1B8'
                                }}
                            >
                                <Grid3x3 className="h-5 w-5" />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className="px-3 py-2.5 transition-all"
                                style={{
                                    background: viewMode === "list" ? 'rgba(201, 162, 39, 0.1)' : 'transparent',
                                    color: viewMode === "list" ? '#C9A227' : '#B1B1B8'
                                }}
                            >
                                <List className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Export */}
                        <Button
                            variant="ghost"
                            icon={Download}
                            onClick={exportToCSV}
                            style={{ color: '#C9A227', borderColor: '#27272A' }}
                        >
                            Export
                        </Button>
                    </div>
                </div>

                {/* Department Quick Filters */}
                <div className="flex flex-wrap gap-2">
                    {departmentStats.map(dept => (
                        <motion.button
                            key={dept.name}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedDepartment(dept.name)}
                            className="rounded-lg px-3 py-1.5 text-sm font-medium transition-all"
                            style={{
                                background: selectedDepartment === dept.name ? 'rgba(201, 162, 39, 0.2)' : '#16161A',
                                border: `1px solid ${selectedDepartment === dept.name ? '#C9A227' : '#27272A'}`,
                                color: selectedDepartment === dept.name ? '#C9A227' : '#B1B1B8'
                            }}
                        >
                            <Building2 className="inline h-3 w-3 mr-1" />
                            {dept.name} ({dept.count})
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-3">
                <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <Card style={{ background: 'linear-gradient(135deg, #1C1C21 0%, #16161A 100%)', border: '1px solid rgba(201, 162, 39, 0.2)' }}>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg p-2" style={{ background: 'rgba(201, 162, 39, 0.1)' }}>
                                    <Users className="h-5 w-5" style={{ color: '#C9A227' }} />
                                </div>
                                <div>
                                    <p className="text-sm" style={{ color: '#B1B1B8' }}>Total Employees</p>
                                    <p className="text-2xl font-bold" style={{ color: '#FAFAFA' }}>{employees.length}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <Card style={{ background: 'linear-gradient(135deg, #1C1C21 0%, #16161A 100%)', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg p-2" style={{ background: 'rgba(34, 197, 94, 0.1)' }}>
                                    <CheckCircle2 className="h-5 w-5" style={{ color: '#22c55e' }} />
                                </div>
                                <div>
                                    <p className="text-sm" style={{ color: '#B1B1B8' }}>Showing</p>
                                    <p className="text-2xl font-bold" style={{ color: '#FAFAFA' }}>{filteredEmployees.length}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <Card style={{ background: 'linear-gradient(135deg, #1C1C21 0%, #16161A 100%)', border: '1px solid rgba(201, 162, 39, 0.2)' }}>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg p-2" style={{ background: 'rgba(201, 162, 39, 0.1)' }}>
                                    <Briefcase className="h-5 w-5" style={{ color: '#C9A227' }} />
                                </div>
                                <div>
                                    <p className="text-sm" style={{ color: '#B1B1B8' }}>Departments</p>
                                    <p className="text-2xl font-bold" style={{ color: '#FAFAFA' }}>{departments.length - 1}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Employee Grid/List */}
            <AnimatePresence mode="popLayout">
                {filteredEmployees.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                    >
                        <Card style={{ background: 'linear-gradient(135deg, #1C1C21 0%, #16161A 100%)', border: '1px solid #27272A' }}>
                            <CardContent className="p-12 text-center">
                                <Users className="mx-auto h-16 w-16" style={{ color: '#A1A1AA' }} />
                                <p className="mt-4 text-lg font-medium" style={{ color: '#FAFAFA' }}>No employees found</p>
                                <p className="mt-1" style={{ color: '#B1B1B8' }}>Try adjusting your search or filters</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ) : viewMode === "grid" ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredEmployees.map((employee, index) => {
                            const isFavorite = favorites.has(employee._id);
                            const isSelected = selectedEmployee === employee._id;

                            return (
                                <motion.div
                                    key={employee._id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: index * 0.03 }}
                                    whileHover={{ y: -8, transition: { duration: 0.2 } }}
                                >
                                    <Card
                                        className="group relative overflow-hidden transition-all cursor-pointer"
                                        style={{
                                            background: 'linear-gradient(135deg, #1C1C21 0%, #16161A 100%)',
                                            border: isSelected ? '2px solid #C9A227' : '1px solid #27272A',
                                            boxShadow: isSelected ? '0 8px 30px rgba(201, 162, 39, 0.3)' : '0 4px 20px rgba(0, 0, 0, 0.3)'
                                        }}
                                        onClick={() => setSelectedEmployee(isSelected ? null : employee._id)}
                                    >
                                        {/* Favorite Star */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleFavorite(employee._id);
                                            }}
                                            className="absolute right-3 top-3 z-10 rounded-full p-1.5 transition-all hover:bg-white/10"
                                        >
                                            <Star
                                                className="h-4 w-4 transition-all"
                                                style={{
                                                    color: isFavorite ? '#C9A227' : '#71717A',
                                                    fill: isFavorite ? '#C9A227' : 'none'
                                                }}
                                            />
                                        </button>

                                        <CardContent className="p-6">
                                            {/* Header */}
                                            <div className="mb-4 flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-bold" style={{ color: '#FAFAFA' }}>
                                                        {employee.fullName}
                                                    </h3>
                                                    <p className="text-sm" style={{ color: '#C9A227' }}>
                                                        {employee.employeeId}
                                                    </p>
                                                </div>
                                                <Badge variant="secondary" style={{ background: 'rgba(201, 162, 39, 0.1)', color: '#C9A227' }}>
                                                    {employee.department}
                                                </Badge>
                                            </div>

                                            {/* Details */}
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-sm" style={{ color: '#B1B1B8' }}>
                                                    <Briefcase className="h-4 w-4" />
                                                    <span>{employee.position}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm" style={{ color: '#B1B1B8' }}>
                                                    <Mail className="h-4 w-4" />
                                                    <span className="truncate">{employee.email}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm" style={{ color: '#B1B1B8' }}>
                                                    <Phone className="h-4 w-4" />
                                                    <span>{employee.phone}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm" style={{ color: '#B1B1B8' }}>
                                                    <Calendar className="h-4 w-4" />
                                                    <span>
                                                        Joined {employee.joiningDate && !isNaN(new Date(employee.joiningDate).getTime())
                                                            ? format(new Date(employee.joiningDate), 'MMM dd, yyyy')
                                                            : 'N/A'}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{
                                                    opacity: isSelected ? 1 : 0,
                                                    height: isSelected ? 'auto' : 0
                                                }}
                                                className="mt-4 flex gap-2 border-t pt-4 overflow-hidden"
                                                style={{ borderColor: '#27272A' }}
                                            >
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onViewHistory(employee);
                                                    }}
                                                    className="flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-white/5"
                                                    style={{ color: '#C9A227' }}
                                                >
                                                    <Eye className="inline h-4 w-4 mr-1" /> History
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onEdit(employee);
                                                    }}
                                                    className="flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-white/5"
                                                    style={{ color: '#3b82f6' }}
                                                >
                                                    <Edit className="inline h-4 w-4 mr-1" /> Edit
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(employee._id);
                                                    }}
                                                    className="flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-red-500/10"
                                                    style={{ color: deleteConfirm === employee._id ? '#ef4444' : '#f87171' }}
                                                >
                                                    {deleteConfirm === employee._id ? (
                                                        <><AlertTriangle className="inline h-4 w-4 mr-1" /> Confirm?</>
                                                    ) : (
                                                        <><Trash2 className="inline h-4 w-4 mr-1" /> Delete</>
                                                    )}
                                                </button>
                                            </motion.div>
                                        </CardContent>

                                        {/* Hover Glow Effect */}
                                        <div
                                            className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none"
                                            style={{
                                                background: 'radial-gradient(circle at center, rgba(201, 162, 39, 0.05) 0%, transparent 70%)'
                                            }}
                                        />
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <Card style={{ background: 'linear-gradient(135deg, #1C1C21 0%, #16161A 100%)', border: '1px solid #27272A' }}>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead style={{ background: '#16161A', color: '#B1B1B8' }}>
                                        <tr>
                                            <th className="px-6 py-4 font-semibold">Employee</th>
                                            <th className="px-6 py-4 font-semibold">Department</th>
                                            <th className="px-6 py-4 font-semibold">Position</th>
                                            <th className="px-6 py-4 font-semibold">Contact</th>
                                            <th className="px-6 py-4 font-semibold">Joined</th>
                                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y" style={{ borderColor: '#27272A' }}>
                                        {filteredEmployees.map((employee, index) => {
                                            const isFavorite = favorites.has(employee._id);

                                            return (
                                                <motion.tr
                                                    key={employee._id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.02 }}
                                                    className="group transition-colors hover:bg-white/5"
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <button
                                                                onClick={() => toggleFavorite(employee._id)}
                                                                className="rounded-full p-1 transition-all hover:bg-white/10"
                                                            >
                                                                <Star
                                                                    className="h-4 w-4"
                                                                    style={{
                                                                        color: isFavorite ? '#C9A227' : '#71717A',
                                                                        fill: isFavorite ? '#C9A227' : 'none'
                                                                    }}
                                                                />
                                                            </button>
                                                            <div>
                                                                <div className="font-medium" style={{ color: '#FAFAFA' }}>{employee.fullName}</div>
                                                                <div className="text-xs" style={{ color: '#C9A227' }}>{employee.employeeId}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <Badge variant="secondary" style={{ background: 'rgba(201, 162, 39, 0.1)', color: '#C9A227' }}>
                                                            {employee.department}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-4" style={{ color: '#B1B1B8' }}>{employee.position}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-xs" style={{ color: '#B1B1B8' }}>
                                                            <div>{employee.email}</div>
                                                            <div>{employee.phone}</div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4" style={{ color: '#B1B1B8' }}>
                                                        {employee.joiningDate && !isNaN(new Date(employee.joiningDate).getTime())
                                                            ? format(new Date(employee.joiningDate), 'MMM dd, yyyy')
                                                            : 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                onClick={() => onViewHistory(employee)}
                                                                className="rounded-lg p-2 transition-all hover:bg-white/5"
                                                                style={{ color: '#C9A227' }}
                                                                title="View History"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => onEdit(employee)}
                                                                className="rounded-lg p-2 transition-all hover:bg-white/5"
                                                                style={{ color: '#3b82f6' }}
                                                                title="Edit"
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(employee._id)}
                                                                className="rounded-lg p-2 transition-all hover:bg-red-500/10"
                                                                style={{ color: deleteConfirm === employee._id ? '#ef4444' : '#f87171' }}
                                                                title={deleteConfirm === employee._id ? "Confirm Delete" : "Delete"}
                                                            >
                                                                {deleteConfirm === employee._id ? (
                                                                    <AlertTriangle className="h-4 w-4" />
                                                                ) : (
                                                                    <Trash2 className="h-4 w-4" />
                                                                )}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </AnimatePresence>
        </div>
    );
}
