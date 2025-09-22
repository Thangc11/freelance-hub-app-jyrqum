
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { commonStyles, colors } from '../../styles/commonStyles';
import { useData } from '../../hooks/useData';
import Icon from '../../components/Icon';

export default function ClientBookingScreen() {
  const router = useRouter();
  const { services, addAppointment, addClient } = useData();
  
  const [step, setStep] = useState(1);
  const [clientInfo, setClientInfo] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');

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

  const handleBooking = () => {
    if (!clientInfo.name || !clientInfo.email || !clientInfo.phone) {
      Alert.alert('Error', 'Please fill in all your contact information');
      return;
    }

    if (selectedServices.length === 0 || !selectedTime) {
      Alert.alert('Error', 'Please select services and time');
      return;
    }

    // Add new client
    const newClient = addClient(clientInfo);

    // Create appointment
    const totalDuration = getTotalDuration();
    const endTime = calculateEndTime(selectedTime, totalDuration);
    const totalAmount = getTotalAmount();

    const newAppointment = {
      clientId: newClient.id,
      serviceIds: selectedServices,
      date: selectedDate,
      startTime: selectedTime,
      endTime: endTime,
      status: 'scheduled' as const,
      totalAmount: totalAmount,
    };

    addAppointment(newAppointment);
    
    Alert.alert(
      'Booking Confirmed!', 
      `Your appointment has been scheduled for ${selectedDate.toLocaleDateString()} at ${selectedTime}. We'll send you a confirmation email shortly.`,
      [{ text: 'OK', onPress: () => router.push('/') }]
    );
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

  const StepIndicator = () => (
    <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 24 }}>
      {[1, 2, 3, 4].map((stepNumber) => (
        <View key={stepNumber} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={[
            {
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: step >= stepNumber ? colors.primary : colors.grey,
              alignItems: 'center',
              justifyContent: 'center',
            }
          ]}>
            <Text style={[
              commonStyles.text,
              { 
                color: step >= stepNumber ? 'white' : colors.textSecondary,
                fontWeight: '600',
                fontSize: 14
              }
            ]}>
              {stepNumber}
            </Text>
          </View>
          {stepNumber < 4 && (
            <View style={{
              width: 40,
              height: 2,
              backgroundColor: step > stepNumber ? colors.primary : colors.grey,
              marginHorizontal: 8
            }} />
          )}
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.content}>
        <View style={commonStyles.row}>
          <TouchableOpacity onPress={() => step > 1 ? setStep(step - 1) : router.back()}>
            <Icon name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={commonStyles.title}>Book Appointment</Text>
          <View style={{ width: 24 }} />
        </View>

        <StepIndicator />

        <ScrollView showsVerticalScrollIndicator={false}>
          {step === 1 && (
            <View>
              <Text style={[commonStyles.subtitle, { textAlign: 'center', marginBottom: 24 }]}>
                Your Information
              </Text>
              
              <View style={commonStyles.card}>
                <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 8 }]}>
                  Full Name *
                </Text>
                <TextInput
                  style={[
                    commonStyles.card,
                    { 
                      borderWidth: 1,
                      borderColor: colors.border,
                      marginBottom: 16
                    }
                  ]}
                  value={clientInfo.name}
                  onChangeText={(text) => setClientInfo(prev => ({ ...prev, name: text }))}
                  placeholder="Enter your full name"
                />

                <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 8 }]}>
                  Email Address *
                </Text>
                <TextInput
                  style={[
                    commonStyles.card,
                    { 
                      borderWidth: 1,
                      borderColor: colors.border,
                      marginBottom: 16
                    }
                  ]}
                  value={clientInfo.email}
                  onChangeText={(text) => setClientInfo(prev => ({ ...prev, email: text }))}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 8 }]}>
                  Phone Number *
                </Text>
                <TextInput
                  style={[
                    commonStyles.card,
                    { 
                      borderWidth: 1,
                      borderColor: colors.border,
                      marginBottom: 16
                    }
                  ]}
                  value={clientInfo.phone}
                  onChangeText={(text) => setClientInfo(prev => ({ ...prev, phone: text }))}
                  placeholder="Enter your phone number"
                  keyboardType="phone-pad"
                />
              </View>

              <TouchableOpacity
                style={[
                  commonStyles.card,
                  { 
                    backgroundColor: colors.primary,
                    marginTop: 24
                  }
                ]}
                onPress={() => {
                  if (!clientInfo.name || !clientInfo.email || !clientInfo.phone) {
                    Alert.alert('Error', 'Please fill in all fields');
                    return;
                  }
                  setStep(2);
                }}
              >
                <Text style={[commonStyles.text, { color: 'white', textAlign: 'center', fontWeight: '600' }]}>
                  Continue
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {step === 2 && (
            <View>
              <Text style={[commonStyles.subtitle, { textAlign: 'center', marginBottom: 24 }]}>
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
                      <Text style={[commonStyles.text, { fontWeight: '600' }]}>{service.name}</Text>
                      <Text style={commonStyles.textSecondary}>{service.description}</Text>
                      <Text style={[commonStyles.text, { marginTop: 4 }]}>
                        {service.duration} min • ${service.price}
                      </Text>
                    </View>
                    {selectedServices.includes(service.id) && (
                      <Icon name="checkmark-circle" size={24} color={colors.primary} />
                    )}
                  </View>
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                style={[
                  commonStyles.card,
                  { 
                    backgroundColor: selectedServices.length > 0 ? colors.primary : colors.grey,
                    marginTop: 24
                  }
                ]}
                onPress={() => {
                  if (selectedServices.length === 0) {
                    Alert.alert('Error', 'Please select at least one service');
                    return;
                  }
                  setStep(3);
                }}
                disabled={selectedServices.length === 0}
              >
                <Text style={[
                  commonStyles.text, 
                  { 
                    color: 'white', 
                    textAlign: 'center', 
                    fontWeight: '600' 
                  }
                ]}>
                  Continue
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {step === 3 && (
            <View>
              <Text style={[commonStyles.subtitle, { textAlign: 'center', marginBottom: 24 }]}>
                Select Date & Time
              </Text>
              
              <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 12 }]}>
                Choose Date
              </Text>
              <DateSelector />
              <Text style={[commonStyles.textSecondary, { textAlign: 'center', marginBottom: 24 }]}>
                {formatDate(selectedDate)}
              </Text>

              <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 12 }]}>
                Available Times
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
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

              <TouchableOpacity
                style={[
                  commonStyles.card,
                  { 
                    backgroundColor: selectedTime ? colors.primary : colors.grey,
                    marginTop: 24
                  }
                ]}
                onPress={() => {
                  if (!selectedTime) {
                    Alert.alert('Error', 'Please select a time');
                    return;
                  }
                  setStep(4);
                }}
                disabled={!selectedTime}
              >
                <Text style={[
                  commonStyles.text, 
                  { 
                    color: 'white', 
                    textAlign: 'center', 
                    fontWeight: '600' 
                  }
                ]}>
                  Continue
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {step === 4 && (
            <View>
              <Text style={[commonStyles.subtitle, { textAlign: 'center', marginBottom: 24 }]}>
                Confirm Booking
              </Text>
              
              <View style={commonStyles.card}>
                <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 16 }]}>
                  Appointment Details
                </Text>
                
                <View style={{ marginBottom: 12 }}>
                  <Text style={commonStyles.textSecondary}>Client</Text>
                  <Text style={commonStyles.text}>{clientInfo.name}</Text>
                </View>

                <View style={{ marginBottom: 12 }}>
                  <Text style={commonStyles.textSecondary}>Services</Text>
                  {selectedServices.map(serviceId => {
                    const service = services.find(s => s.id === serviceId);
                    return (
                      <Text key={serviceId} style={commonStyles.text}>
                        {service?.name} - ${service?.price}
                      </Text>
                    );
                  })}
                </View>

                <View style={{ marginBottom: 12 }}>
                  <Text style={commonStyles.textSecondary}>Date & Time</Text>
                  <Text style={commonStyles.text}>
                    {formatDate(selectedDate)}
                  </Text>
                  <Text style={commonStyles.text}>
                    {selectedTime} - {calculateEndTime(selectedTime, getTotalDuration())}
                  </Text>
                </View>

                <View style={{ marginBottom: 12 }}>
                  <Text style={commonStyles.textSecondary}>Duration</Text>
                  <Text style={commonStyles.text}>{getTotalDuration()} minutes</Text>
                </View>

                <View style={[commonStyles.row, { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.border }]}>
                  <Text style={[commonStyles.text, { fontWeight: '600' }]}>Total Amount</Text>
                  <Text style={[commonStyles.text, { fontWeight: '600', fontSize: 18 }]}>
                    ${getTotalAmount()}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={[
                  commonStyles.card,
                  { 
                    backgroundColor: colors.primary,
                    marginTop: 24,
                    marginBottom: 40
                  }
                ]}
                onPress={handleBooking}
              >
                <Text style={[commonStyles.text, { color: 'white', textAlign: 'center', fontWeight: '600' }]}>
                  Confirm Booking
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
