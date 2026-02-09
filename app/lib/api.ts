import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const employeeApi = {
    getAll: () => api.get('/employees'),
    create: (data: any) => api.post('/employees', data),
    delete: (id: string) => api.delete(`/employees/${id}`),
};

export const attendanceApi = {
    mark: (data: { employeeId: string; date: string; status: string }) => api.post('/attendance', data),
    getEmployeeAttendance: (employeeId: string) => api.get(`/attendance/${employeeId}`),
    getAll: (date?: string) => api.get('/attendance', { params: { date } }),
};

export default api;
