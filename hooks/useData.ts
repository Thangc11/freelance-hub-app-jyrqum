
import { useState, useEffect } from 'react';
import { Client, Service, Appointment, Invoice, TimeLog, Project } from '../types';
import { 
  mockClients, 
  mockServices, 
  mockAppointments, 
  mockInvoices, 
  mockTimeLogs, 
  mockProjects 
} from '../data/mockData';

export const useData = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    // Load mock data
    setClients(mockClients);
    setServices(mockServices);
    setAppointments(mockAppointments);
    setInvoices(mockInvoices);
    setTimeLogs(mockTimeLogs);
    setProjects(mockProjects);
  }, []);

  const addClient = (client: Omit<Client, 'id' | 'createdAt'>) => {
    const newClient: Client = {
      ...client,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setClients(prev => [...prev, newClient]);
    return newClient;
  };

  const addAppointment = (appointment: Omit<Appointment, 'id'>) => {
    const newAppointment: Appointment = {
      ...appointment,
      id: Date.now().toString(),
    };
    setAppointments(prev => [...prev, newAppointment]);
    return newAppointment;
  };

  const addInvoice = (invoice: Omit<Invoice, 'id' | 'createdAt'>) => {
    const newInvoice: Invoice = {
      ...invoice,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setInvoices(prev => [...prev, newInvoice]);
    return newInvoice;
  };

  const addTimeLog = (timeLog: Omit<TimeLog, 'id'>) => {
    const newTimeLog: TimeLog = {
      ...timeLog,
      id: Date.now().toString(),
    };
    setTimeLogs(prev => [...prev, newTimeLog]);
    return newTimeLog;
  };

  const getClientById = (id: string) => clients.find(client => client.id === id);
  const getServiceById = (id: string) => services.find(service => service.id === id);

  return {
    clients,
    services,
    appointments,
    invoices,
    timeLogs,
    projects,
    addClient,
    addAppointment,
    addInvoice,
    addTimeLog,
    getClientById,
    getServiceById,
  };
};
