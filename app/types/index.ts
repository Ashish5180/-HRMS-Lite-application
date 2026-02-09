export interface Employee {
    _id: string;
    employeeId: string;
    fullName: string;
    email: string;
    phone: string;
    department: string;
    position: string;
    joiningDate: string;
    isFavorite?: boolean;
}

export interface AttendanceRecord {
    _id: string;
    employee: string | Employee;
    date: string;
    status: string;
    notes?: string;
}
