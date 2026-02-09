import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://hrms-lite-application-backend.onrender.com/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const employeeApi = {
    getAll: () => api.get('/employees'),
    create: (data: Record<string, unknown>) => api.post('/employees', data),
    update: (id: string, data: Record<string, unknown>) => api.put(`/employees/${id}`, data),
    delete: (id: string) => api.delete(`/employees/${id}`),
};

export const attendanceApi = {
    mark: (data: { employeeId: string; date: string; status: string }) => api.post('/attendance', data),
    getEmployeeAttendance: (employeeId: string) => api.get(`/attendance/${employeeId}`),
    getAll: (date?: string) => api.get('/attendance', { params: { date } }),
};

export default api;
