"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Navbar } from "./components/Navbar";
import { EmployeeList } from "./components/EmployeeList";
import { EnhancedEmployeeList } from "./components/EnhancedEmployeeList";
import { AddEmployeeModal } from "./components/AddEmployeeModal";
import { EditEmployeeModal } from "./components/EditEmployeeModal";
import { AttendanceManager } from "./components/AttendanceManager";
import { DashboardSummary } from "./components/DashboardSummary";
import { AttendanceHistoryModal } from "./components/AttendanceHistoryModal";
import { LoginPage } from "./components/LoginPage";
import { Button } from "./components/ui/Button";
import { employeeApi, attendanceApi } from "./lib/api";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

interface Employee {
  _id: string;
  employeeId: string;
  fullName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  joiningDate: string;
}

interface AttendanceRecord {
  _id: string;
  employee: string;
  date: string;
  status: string;
}

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendanceToday, setAttendanceToday] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
  const [historyEmployee, setHistoryEmployee] = useState<Employee | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      const [empRes, attRes] = await Promise.all([
        employeeApi.getAll(),
        attendanceApi.getAll(today)
      ]);
      setEmployees(empRes.data.data);
      setAttendanceToday(attRes.data.data);
    } catch {
      setError("Failed to fetch data. Please check if the backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check if user is authenticated
    const authStatus = localStorage.getItem("isAuthenticated");
    if (authStatus === "true") {
      setIsAuthenticated(true);
      fetchData();
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    fetchData();
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
    setEmployees([]);
    setAttendanceToday([]);
  };

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const totalEmployees = employees.length;
  // Count Present, Half Day, and Work From Home as "working"
  const presentToday = attendanceToday.filter((a) =>
    ['Present', 'Half Day', 'Work From Home'].includes(a.status)
  ).length;
  const absentToday = attendanceToday.filter((a) => a.status === 'Absent').length;

  const handleDeleteEmployee = async (id: string) => {
    try {
      await employeeApi.delete(id);
      fetchData();
    } catch {
      alert("Failed to delete employee");
    }
  };

  const handleUpdateEmployee = async (id: string, data: Record<string, unknown>) => {
    try {
      await employeeApi.update(id, data);
      fetchData();
      setEditEmployee(null);
    } catch (err) {
      alert("Failed to update employee");
      throw err;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-zinc-950">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-50">Dashboard</h1>
                  <p className="mt-1 text-base text-stone-600 dark:text-stone-400">Overview of your workforce and attendance metrics.</p>
                </div>
                <Button icon={Plus} onClick={() => setIsModalOpen(true)}>Add Employee</Button>
              </div>

              <DashboardSummary
                totalEmployees={totalEmployees}
                presentToday={presentToday}
                absentToday={absentToday}
              />

              <div className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-50">Recent Employees</h2>
                <EmployeeList
                  employees={employees.slice(0, 3)}
                  isLoading={isLoading}
                  error={error}
                  onDelete={handleDeleteEmployee}
                  onAdd={() => setIsModalOpen(true)}
                  onViewHistory={setHistoryEmployee}
                />
              </div>
            </motion.div>
          )}

          {activeTab === 'employees' && (
            <motion.div
              key="employees"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold tracking-tight" style={{ color: '#FAFAFA' }}>Employees</h1>
                  <p className="mt-1 text-base" style={{ color: '#B1B1B8' }}>Manage your employee directory with advanced features.</p>
                </div>
                <Button icon={Plus} onClick={() => setIsModalOpen(true)} style={{ background: 'linear-gradient(135deg, #C9A227 0%, #b8911f 100%)', color: '#0E0E10' }}>
                  Add Employee
                </Button>
              </div>

              <EnhancedEmployeeList
                employees={employees}
                isLoading={isLoading}
                error={error}
                onDelete={handleDeleteEmployee}
                onEdit={setEditEmployee}
                onViewHistory={setHistoryEmployee}
              />
            </motion.div>
          )}

          {activeTab === 'attendance' && (
            <motion.div
              key="attendance"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <AttendanceManager />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AddEmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchData}
      />

      {editEmployee && (
        <EditEmployeeModal
          isOpen={!!editEmployee}
          onClose={() => setEditEmployee(null)}
          employee={editEmployee}
          onUpdate={handleUpdateEmployee}
        />
      )}

      <AttendanceHistoryModal
        isOpen={!!historyEmployee}
        onClose={() => setHistoryEmployee(null)}
        employee={historyEmployee}
      />
    </div>
  );
}
