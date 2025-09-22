
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { commonStyles, colors } from '../../styles/commonStyles';
import { useData } from '../../hooks/useData';
import Icon from '../../components/Icon';

export default function AppointmentsScreen() {
  const router = useRouter();
  const { appointments, clients, services } = useData();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(apt => {
      const aptDate = new Date(apt.date);
      return aptDate.toDateString() === date.toDateString();
    }).sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return colors.primary;
      case 'completed': return colors.success;
      case 'cancelled': return colors.error;
      case 'no-show': return colors.warning;
      default: return colors.textSecondary;
    }
  };

  const AppointmentCard = ({ appointment }: any) => {
    const client = clients.find(c => c.id === appointment.clientId);
    const appointmentServices = appointment.serviceIds.map((id: string) => 
      services.find(s => s.id === id)
    ).filter(Boolean);

    return (
      <TouchableOpacity 
        style={commonStyles.card}
        onPress={() => router.push(`/appointments/${appointment.id}`)}
      >
        <View style={commonStyles.row}>
          <View style={{ flex: 1 }}>
            <View style={[commonStyles.row, { marginBottom: 4 }]}>
              <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                {appointment.startTime} - {appointment.endTime}
              </Text>
              <View style={[
                { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
                { backgroundColor: getStatusColor(appointment.status) + '20' }
              ]}>
                <Text style={[
                  commonStyles.textSecondary, 
                  { fontSize: 12, color: getStatusColor(appointment.status) }
                ]}>
                  {appointment.status}
                </Text>
              </View>
            </View>
            <Text style={commonStyles.text}>{client?.name}</Text>
            <Text style={commonStyles.textSecondary}>
              {appointmentServices.map(s => s?.name).join(', ')}
            </Text>
            <Text style={[commonStyles.textSecondary, { fontWeight: '600' }]}>
              ${appointment.totalAmount}
            </Text>
          </View>
          <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
        </View>
      </TouchableOpacity>
    );
  };

  const DateSelector = () => {
    const today = new Date();
    const dates = [];
    
    for (let i = -3; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }

    return (
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 16 }}
      >
        {dates.map((date, index) => {
          const isSelected = date.toDateString() === selectedDate.toDateString();
          const isToday = date.toDateString() === today.toDateString();
          
          return (
            <TouchableOpacity
              key={index}
              style={[
                commonStyles.card,
                { 
                  marginRight: 8, 
                  minWidth: 80,
                  backgroundColor: isSelected ? colors.primary : colors.card
                }
              ]}
              onPress={() => setSelectedDate(date)}
            >
              <Text style={[
                commonStyles.textSecondary,
                { 
                  textAlign: 'center', 
                  fontSize: 12,
                  color: isSelected ? 'white' : colors.textSecondary
                }
              ]}>
                {date.toLocaleDateString('en-US', { weekday: 'short' })}
              </Text>
              <Text style={[
                commonStyles.text,
                { 
                  textAlign: 'center', 
                  fontWeight: '600',
                  color: isSelected ? 'white' : (isToday ? colors.primary : colors.text)
                }
              ]}>
                {date.getDate()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  };

  const dayAppointments = getAppointmentsForDate(selectedDate);

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.content}>
        <View style={commonStyles.row}>
          <Text style={commonStyles.title}>Appointments</Text>
          <TouchableOpacity onPress={() => router.push('/appointments/new')}>
            <Icon name="add" size={28} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <DateSelector />

        <Text style={[commonStyles.subtitle, { marginBottom: 12 }]}>
          {formatDate(selectedDate)}
        </Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          {dayAppointments.map((appointment) => (
            <AppointmentCard key={appointment.id} appointment={appointment} />
          ))}

          {dayAppointments.length === 0 && (
            <View style={[commonStyles.card, commonStyles.centerContent, { paddingVertical: 48 }]}>
              <Icon name="calendar-outline" size={64} color={colors.textSecondary} />
              <Text style={[commonStyles.textSecondary, { marginTop: 16, textAlign: 'center' }]}>
                No appointments scheduled
              </Text>
              <TouchableOpacity
                style={[commonStyles.card, { backgroundColor: colors.primary, marginTop: 16 }]}
                onPress={() => router.push('/appointments/new')}
              >
                <Text style={[commonStyles.text, { color: 'white', textAlign: 'center' }]}>
                  Schedule Appointment
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
