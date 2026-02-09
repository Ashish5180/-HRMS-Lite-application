"use client";

import { useState, useEffect } from "react";
import { Plus, Users, CalendarCheck, LayoutDashboard } from "lucide-react";
import { Navbar } from "./components/Navbar";
import { EmployeeList } from "./components/EmployeeList";
import { AddEmployeeModal } from "./components/AddEmployeeModal";
import { AttendanceManager } from "./components/AttendanceManager";
import { DashboardSummary } from "./components/DashboardSummary";
import { AttendanceHistoryModal } from "./components/AttendanceHistoryModal";
import { Button } from "./components/ui/Button";
import { employeeApi, attendanceApi } from "./lib/api";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [employees, setEmployees] = useState([]);
  const [attendanceToday, setAttendanceToday] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [historyEmployee, setHistoryEmployee] = useState<any>(null);

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
    } catch (err: any) {
      setError("Failed to fetch data. Please check if the backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalEmployees = employees.length;
  const presentToday = attendanceToday.filter((a: any) => a.status === 'Present').length;
  const absentToday = attendanceToday.filter((a: any) => a.status === 'Absent').length;

  const handleDeleteEmployee = async (id: string) => {
    if (confirm("Are you sure you want to delete this employee? All attendance records will be removed.")) {
      try {
        await employeeApi.delete(id);
        fetchData();
      } catch (err) {
        alert("Failed to delete employee");
      }
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

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
                  <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Dashboard</h1>
                  <p className="text-zinc-500 dark:text-zinc-400">Overview of your workforce and attendance.</p>
                </div>
                <Button icon={Plus} onClick={() => setIsModalOpen(true)}>Add Employee</Button>
              </div>

              <DashboardSummary
                totalEmployees={totalEmployees}
                presentToday={presentToday}
                absentToday={absentToday}
              />

              <div className="space-y-4">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Recent Employees</h2>
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
                  <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Employees</h1>
                  <p className="text-zinc-500 dark:text-zinc-400">Manage your employee directory.</p>
                </div>
                <Button icon={Plus} onClick={() => setIsModalOpen(true)}>Add Employee</Button>
              </div>

              <EmployeeList
                employees={employees}
                isLoading={isLoading}
                error={error}
                onDelete={handleDeleteEmployee}
                onAdd={() => setIsModalOpen(true)}
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

      <AttendanceHistoryModal
        isOpen={!!historyEmployee}
        onClose={() => setHistoryEmployee(null)}
        employee={historyEmployee}
      />
    </div>
  );
}
