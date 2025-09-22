
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { commonStyles, colors } from '../../styles/commonStyles';
import { useData } from '../../hooks/useData';
import Icon from '../../components/Icon';

export default function NewAppointmentScreen() {
  const router = useRouter();
  const { clients, services, addAppointment } = useData();
  
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  };

  const calculateEndTime = (startTime: string, duration: number) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + duration;
    const endHours = Math.floor(totalMinutes / 60);
    const endMins = totalMinutes % 60;
    return `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
  };

  const getTotalDuration = () => {
    return selectedServices.reduce((total, serviceId) => {
      const service = services.find(s => s.id === serviceId);
      return total + (service?.duration || 0);
    }, 0);
  };

  const getTotalAmount = () => {
    return selectedServices.reduce((total, serviceId) => {
      const service = services.find(s => s.id === serviceId);
      return total + (service?.price || 0);
    }, 0);
  };

  const handleSave = () => {
    if (!selectedClient || selectedServices.length === 0 || !selectedTime) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const totalDuration = getTotalDuration();
    const endTime = calculateEndTime(selectedTime, totalDuration);
    const totalAmount = getTotalAmount();

    const newAppointment = {
      clientId: selectedClient,
      serviceIds: selectedServices,
      date: selectedDate,
      startTime: selectedTime,
      endTime: endTime,
      status: 'scheduled' as const,
      notes: notes,
      totalAmount: totalAmount,
    };

    addAppointment(newAppointment);
    Alert.alert('Success', 'Appointment scheduled successfully!', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const DateSelector = () => {
    const today = new Date();
    const dates = [];
    
    for (let i = 0; i <= 14; i++) {
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

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.content}>
        <View style={commonStyles.row}>
          <TouchableOpacity onPress={() => router.back()}>
            <Icon name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={commonStyles.title}>New Appointment</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Client Selection */}
          <View style={commonStyles.section}>
            <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 12 }]}>
              Select Client
            </Text>
            {clients.map((client) => (
              <TouchableOpacity
                key={client.id}
                style={[
                  commonStyles.card,
                  { backgroundColor: selectedClient === client.id ? colors.accent + '40' : colors.card }
                ]}
                onPress={() => setSelectedClient(client.id)}
              >
                <View style={commonStyles.row}>
                  <View>
                    <Text style={commonStyles.text}>{client.name}</Text>
                    <Text style={commonStyles.textSecondary}>{client.phone}</Text>
                  </View>
                  {selectedClient === client.id && (
                    <Icon name="checkmark-circle" size={24} color={colors.primary} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Service Selection */}
          <View style={commonStyles.section}>
            <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 12 }]}>
              Select Services
            </Text>
            {services.map((service) => (
              <TouchableOpacity
                key={service.id}
                style={[
                  commonStyles.card,
                  { backgroundColor: selectedServices.includes(service.id) ? colors.accent + '40' : colors.card }
                ]}
                onPress={() => {
                  if (selectedServices.includes(service.id)) {
                    setSelectedServices(prev => prev.filter(id => id !== service.id));
                  } else {
                    setSelectedServices(prev => [...prev, service.id]);
                  }
                }}
              >
                <View style={commonStyles.row}>
                  <View style={{ flex: 1 }}>
                    <Text style={commonStyles.text}>{service.name}</Text>
                    <Text style={commonStyles.textSecondary}>
                      {service.duration} min • ${service.price}
                    </Text>
                  </View>
                  {selectedServices.includes(service.id) && (
                    <Icon name="checkmark-circle" size={24} color={colors.primary} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Date Selection */}
          <View style={commonStyles.section}>
            <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 12 }]}>
              Select Date
            </Text>
            <DateSelector />
            <Text style={[commonStyles.textSecondary, { textAlign: 'center' }]}>
              {formatDate(selectedDate)}
            </Text>
          </View>

          {/* Time Selection */}
          <View style={commonStyles.section}>
            <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 12 }]}>
              Select Time
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {generateTimeSlots().map((time) => (
                <TouchableOpacity
                  key={time}
                  style={[
                    commonStyles.card,
                    { 
                      minWidth: 80,
                      backgroundColor: selectedTime === time ? colors.primary : colors.card
                    }
                  ]}
                  onPress={() => setSelectedTime(time)}
                >
                  <Text style={[
                    commonStyles.text,
                    { 
                      textAlign: 'center',
                      color: selectedTime === time ? 'white' : colors.text
                    }
                  ]}>
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Summary */}
          {selectedServices.length > 0 && selectedTime && (
            <View style={[commonStyles.card, { backgroundColor: colors.backgroundAlt }]}>
              <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 8 }]}>
                Appointment Summary
              </Text>
              <Text style={commonStyles.textSecondary}>
                Duration: {getTotalDuration()} minutes
              </Text>
              <Text style={commonStyles.textSecondary}>
                Time: {selectedTime} - {calculateEndTime(selectedTime, getTotalDuration())}
              </Text>
              <Text style={[commonStyles.text, { fontWeight: '600', marginTop: 8 }]}>
                Total: ${getTotalAmount()}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[
              commonStyles.card,
              { 
                backgroundColor: colors.primary,
                marginTop: 24,
                marginBottom: 40
              }
            ]}
            onPress={handleSave}
          >
            <Text style={[commonStyles.text, { color: 'white', textAlign: 'center', fontWeight: '600' }]}>
              Schedule Appointment
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
