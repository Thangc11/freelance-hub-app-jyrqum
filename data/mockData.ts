
import { Client, Service, Appointment, Invoice, TimeLog, Project } from '../types';

export const mockClients: Client[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, City, State 12345',
    notes: 'Prefers gel manicures',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Emily Davis',
    email: 'emily.davis@email.com',
    phone: '+1 (555) 987-6543',
    address: '456 Oak Ave, City, State 12345',
    notes: 'Regular customer, comes every 2 weeks',
    createdAt: new Date('2024-02-01'),
  },
  {
    id: '3',
    name: 'Jessica Wilson',
    email: 'jessica.wilson@email.com',
    phone: '+1 (555) 456-7890',
    createdAt: new Date('2024-02-15'),
  },
];

export const mockServices: Service[] = [
  {
    id: '1',
    name: 'Classic Manicure',
    duration: 45,
    price: 35,
    description: 'Basic nail care with polish',
  },
  {
    id: '2',
    name: 'Gel Manicure',
    duration: 60,
    price: 50,
    description: 'Long-lasting gel polish application',
  },
  {
    id: '3',
    name: 'Pedicure',
    duration: 60,
    price: 45,
    description: 'Complete foot care and polish',
  },
  {
    id: '4',
    name: 'Nail Art',
    duration: 30,
    price: 25,
    description: 'Custom nail designs',
  },
];

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    clientId: '1',
    serviceIds: ['2'],
    date: new Date('2024-12-20'),
    startTime: '10:00',
    endTime: '11:00',
    status: 'scheduled',
    totalAmount: 50,
  },
  {
    id: '2',
    clientId: '2',
    serviceIds: ['1', '4'],
    date: new Date('2024-12-20'),
    startTime: '14:00',
    endTime: '15:15',
    status: 'scheduled',
    totalAmount: 60,
  },
  {
    id: '3',
    clientId: '3',
    serviceIds: ['3'],
    date: new Date('2024-12-21'),
    startTime: '11:00',
    endTime: '12:00',
    status: 'scheduled',
    totalAmount: 45,
  },
];

export const mockInvoices: Invoice[] = [
  {
    id: '1',
    clientId: '1',
    appointmentId: '1',
    items: [
      {
        id: '1',
        serviceId: '2',
        quantity: 1,
        unitPrice: 50,
        total: 50,
      },
    ],
    subtotal: 50,
    tax: 4,
    total: 54,
    status: 'sent',
    dueDate: new Date('2024-12-27'),
    createdAt: new Date('2024-12-20'),
  },
  {
    id: '2',
    clientId: '2',
    items: [
      {
        id: '2',
        serviceId: '1',
        quantity: 1,
        unitPrice: 35,
        total: 35,
      },
      {
        id: '3',
        serviceId: '4',
        quantity: 1,
        unitPrice: 25,
        total: 25,
      },
    ],
    subtotal: 60,
    tax: 4.8,
    total: 64.8,
    status: 'paid',
    dueDate: new Date('2024-12-27'),
    createdAt: new Date('2024-12-20'),
    paidAt: new Date('2024-12-20'),
  },
];

export const mockTimeLogs: TimeLog[] = [
  {
    id: '1',
    clientId: '1',
    projectName: 'Website Design',
    description: 'Initial design mockups',
    startTime: new Date('2024-12-19T09:00:00'),
    endTime: new Date('2024-12-19T12:00:00'),
    duration: 180,
    hourlyRate: 75,
    totalAmount: 225,
  },
  {
    id: '2',
    clientId: '2',
    projectName: 'Brand Identity',
    description: 'Logo design concepts',
    startTime: new Date('2024-12-19T14:00:00'),
    endTime: new Date('2024-12-19T16:30:00'),
    duration: 150,
    hourlyRate: 85,
    totalAmount: 212.5,
  },
];

export const mockProjects: Project[] = [
  {
    id: '1',
    clientId: '1',
    name: 'Website Redesign',
    description: 'Complete website overhaul with modern design',
    status: 'active',
    startDate: new Date('2024-12-01'),
    totalHours: 25,
    totalAmount: 1875,
  },
  {
    id: '2',
    clientId: '2',
    name: 'Brand Identity Package',
    description: 'Logo, business cards, and brand guidelines',
    status: 'active',
    startDate: new Date('2024-12-10'),
    totalHours: 15,
    totalAmount: 1275,
  },
];
