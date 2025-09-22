
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { commonStyles, colors } from '../../styles/commonStyles';
import { useData } from '../../hooks/useData';
import Icon from '../../components/Icon';

export default function AppointmentDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { appointments, clients, services } = useData();
  
  const appointment = appointments.find(apt => apt.id === id);
  const client = appointment ? clients.find(c => c.id === appointment.clientId) : null;
  const appointmentServices = appointment ? 
    appointment.serviceIds.map(serviceId => services.find(s => s.id === serviceId)).filter(Boolean) : [];

  if (!appointment || !client) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={commonStyles.content}>
          <Text style={commonStyles.title}>Appointment not found</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={[commonStyles.text, { color: colors.primary }]}>Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return colors.primary;
      case 'completed': return colors.success;
      case 'cancelled': return colors.error;
      case 'no-show': return colors.warning;
      default: return colors.textSecondary;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleStatusChange = (newStatus: string) => {
    Alert.alert(
      'Update Status',
      `Change appointment status to ${newStatus}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm', 
          onPress: () => {
            console.log(`Status changed to ${newStatus}`);
            Alert.alert('Success', 'Appointment status updated');
          }
        }
      ]
    );
  };

  const StatusButton = ({ status, label, color }: { status: string, label: string, color: string }) => (
    <TouchableOpacity
      style={[
        commonStyles.card,
        { 
          backgroundColor: appointment.status === status ? color + '20' : colors.card,
          borderWidth: 1,
          borderColor: appointment.status === status ? color : colors.border,
          flex: 1,
          marginHorizontal: 4
        }
      ]}
      onPress={() => handleStatusChange(status)}
    >
      <Text style={[
        commonStyles.text,
        { 
          textAlign: 'center',
          color: appointment.status === status ? color : colors.text,
          fontWeight: appointment.status === status ? '600' : '400'
        }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.content}>
        <View style={commonStyles.row}>
          <TouchableOpacity onPress={() => router.back()}>
            <Icon name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={commonStyles.title}>Appointment Details</Text>
          <TouchableOpacity onPress={() => console.log('Edit appointment')}>
            <Icon name="create-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Status */}
          <View style={commonStyles.card}>
            <View style={[commonStyles.row, { marginBottom: 16 }]}>
              <Text style={[commonStyles.text, { fontWeight: '600' }]}>Status</Text>
              <View style={[
                { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
                { backgroundColor: getStatusColor(appointment.status) + '20' }
              ]}>
                <Text style={[
                  commonStyles.text,
                  { color: getStatusColor(appointment.status), fontWeight: '600' }
                ]}>
                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row' }}>
              <StatusButton status="scheduled" label="Scheduled" color={colors.primary} />
              <StatusButton status="completed" label="Completed" color={colors.success} />
              <StatusButton status="cancelled" label="Cancelled" color={colors.error} />
              <StatusButton status="no-show" label="No Show" color={colors.warning} />
            </View>
          </View>

          {/* Client Information */}
          <View style={commonStyles.card}>
            <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 12 }]}>
              Client Information
            </Text>
            <View style={{ marginBottom: 8 }}>
              <Text style={commonStyles.textSecondary}>Name</Text>
              <Text style={commonStyles.text}>{client.name}</Text>
            </View>
            <View style={{ marginBottom: 8 }}>
              <Text style={commonStyles.textSecondary}>Phone</Text>
              <Text style={commonStyles.text}>{client.phone}</Text>
            </View>
            <View style={{ marginBottom: 8 }}>
              <Text style={commonStyles.textSecondary}>Email</Text>
              <Text style={commonStyles.text}>{client.email}</Text>
            </View>
            {client.notes && (
              <View>
                <Text style={commonStyles.textSecondary}>Notes</Text>
                <Text style={commonStyles.text}>{client.notes}</Text>
              </View>
            )}
          </View>

          {/* Appointment Details */}
          <View style={commonStyles.card}>
            <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 12 }]}>
              Appointment Details
            </Text>
            <View style={{ marginBottom: 8 }}>
              <Text style={commonStyles.textSecondary}>Date</Text>
              <Text style={commonStyles.text}>{formatDate(appointment.date)}</Text>
            </View>
            <View style={{ marginBottom: 8 }}>
              <Text style={commonStyles.textSecondary}>Time</Text>
              <Text style={commonStyles.text}>
                {appointment.startTime} - {appointment.endTime}
              </Text>
            </View>
            <View style={{ marginBottom: 8 }}>
              <Text style={commonStyles.textSecondary}>Services</Text>
              {appointmentServices.map((service, index) => (
                <Text key={index} style={commonStyles.text}>
                  {service?.name} - {service?.duration} min - ${service?.price}
                </Text>
              ))}
            </View>
            {appointment.notes && (
              <View>
                <Text style={commonStyles.textSecondary}>Notes</Text>
                <Text style={commonStyles.text}>{appointment.notes}</Text>
              </View>
            )}
          </View>

          {/* Payment Information */}
          <View style={commonStyles.card}>
            <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 12 }]}>
              Payment Information
            </Text>
            <View style={[commonStyles.row, { marginBottom: 8 }]}>
              <Text style={commonStyles.textSecondary}>Subtotal</Text>
              <Text style={commonStyles.text}>${appointment.totalAmount}</Text>
            </View>
            <View style={[commonStyles.row, { marginBottom: 8 }]}>
              <Text style={commonStyles.textSecondary}>Tax</Text>
              <Text style={commonStyles.text}>${(appointment.totalAmount * 0.08).toFixed(2)}</Text>
            </View>
            <View style={[commonStyles.row, { paddingTop: 8, borderTopWidth: 1, borderTopColor: colors.border }]}>
              <Text style={[commonStyles.text, { fontWeight: '600' }]}>Total</Text>
              <Text style={[commonStyles.text, { fontWeight: '600', fontSize: 18 }]}>
                ${(appointment.totalAmount * 1.08).toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 40 }}>
            <TouchableOpacity
              style={[
                commonStyles.card,
                { backgroundColor: colors.primary, flex: 1 }
              ]}
              onPress={() => {
                Alert.alert('Call Client', `Call ${client.name} at ${client.phone}?`, [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Call', onPress: () => console.log('Calling client') }
                ]);
              }}
            >
              <View style={[commonStyles.row, { justifyContent: 'center' }]}>
                <Icon name="call" size={20} color="white" style={{ marginRight: 8 }} />
                <Text style={[commonStyles.text, { color: 'white', fontWeight: '600' }]}>
                  Call Client
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                commonStyles.card,
                { backgroundColor: colors.success, flex: 1 }
              ]}
              onPress={() => {
                Alert.alert('Send Message', `Send SMS to ${client.name}?`, [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Send', onPress: () => console.log('Sending message') }
                ]);
              }}
            >
              <View style={[commonStyles.row, { justifyContent: 'center' }]}>
                <Icon name="chatbubble" size={20} color="white" style={{ marginRight: 8 }} />
                <Text style={[commonStyles.text, { color: 'white', fontWeight: '600' }]}>
                  Message
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
