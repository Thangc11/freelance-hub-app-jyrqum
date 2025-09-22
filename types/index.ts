
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  notes?: string;
  createdAt: Date;
}

export interface Service {
  id: string;
  name: string;
  duration: number; // in minutes
  price: number;
  description?: string;
}

export interface Appointment {
  id: string;
  clientId: string;
  serviceIds: string[];
  date: Date;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  totalAmount: number;
}

export interface Invoice {
  id: string;
  clientId: string;
  appointmentId?: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  dueDate: Date;
  createdAt: Date;
  paidAt?: Date;
}

export interface InvoiceItem {
  id: string;
  serviceId: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface TimeLog {
  id: string;
  clientId: string;
  projectName: string;
  description: string;
  startTime: Date;
  endTime?: Date;
  duration?: number; // in minutes
  hourlyRate: number;
  totalAmount: number;
}

export interface Project {
  id: string;
  clientId: string;
  name: string;
  description?: string;
  status: 'active' | 'completed' | 'on-hold';
  startDate: Date;
  endDate?: Date;
  totalHours: number;
  totalAmount: number;
}
