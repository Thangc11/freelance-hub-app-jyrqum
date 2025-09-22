
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { commonStyles, colors } from '../styles/commonStyles';
import { useData } from '../hooks/useData';
import Icon from '../components/Icon';

export default function HomeScreen() {
  const router = useRouter();
  const { appointments, invoices, projects } = useData();

  const todayAppointments = appointments.filter(apt => {
    const today = new Date();
    const aptDate = new Date(apt.date);
    return aptDate.toDateString() === today.toDateString();
  });

  const pendingInvoices = invoices.filter(inv => inv.status === 'sent' || inv.status === 'overdue');
  const activeProjects = projects.filter(proj => proj.status === 'active');

  const QuickActionCard = ({ title, icon, onPress, color = colors.primary }: any) => (
    <TouchableOpacity style={[commonStyles.card, { flex: 1, marginHorizontal: 4 }]} onPress={onPress}>
      <View style={commonStyles.centerContent}>
        <Icon name={icon} size={32} color={color} />
        <Text style={[commonStyles.textSecondary, { marginTop: 8, textAlign: 'center' }]}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const StatCard = ({ title, value, subtitle, onPress }: any) => (
    <TouchableOpacity style={commonStyles.card} onPress={onPress}>
      <View style={commonStyles.row}>
        <View>
          <Text style={commonStyles.subtitle}>{value}</Text>
          <Text style={commonStyles.text}>{title}</Text>
          {subtitle && (
            <Text style={commonStyles.textSecondary}>{subtitle}</Text>
          )}
        </View>
        <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        <View style={commonStyles.section}>
          <Text style={commonStyles.title}>Good morning! 👋</Text>
          <Text style={commonStyles.textSecondary}>
            Here&apos;s what&apos;s happening today
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={commonStyles.section}>
          <Text style={[commonStyles.subtitle, { marginBottom: 12 }]}>Quick Actions</Text>
          <View style={{ flexDirection: 'row', marginHorizontal: -4 }}>
            <QuickActionCard
              title="New Appointment"
              icon="add-circle-outline"
              onPress={() => router.push('/appointments/new')}
            />
            <QuickActionCard
              title="Add Client"
              icon="person-add-outline"
              onPress={() => router.push('/clients/new')}
            />
            <QuickActionCard
              title="Create Invoice"
              icon="receipt-outline"
              onPress={() => router.push('/invoices/new')}
            />
          </View>
        </View>

        {/* Today's Overview */}
        <View style={commonStyles.section}>
          <Text style={[commonStyles.subtitle, { marginBottom: 12 }]}>Today&apos;s Overview</Text>
          
          <StatCard
            title="Appointments Today"
            value={todayAppointments.length}
            subtitle={todayAppointments.length > 0 ? `Next at ${todayAppointments[0]?.startTime}` : 'No appointments'}
            onPress={() => router.push('/appointments')}
          />

          <StatCard
            title="Pending Invoices"
            value={pendingInvoices.length}
            subtitle={`$${pendingInvoices.reduce((sum, inv) => sum + inv.total, 0).toFixed(2)} outstanding`}
            onPress={() => router.push('/invoices')}
          />

          <StatCard
            title="Active Projects"
            value={activeProjects.length}
            subtitle={`${activeProjects.reduce((sum, proj) => sum + proj.totalHours, 0)} hours logged`}
            onPress={() => router.push('/time-logs')}
          />
        </View>

        {/* Recent Activity */}
        <View style={commonStyles.section}>
          <Text style={[commonStyles.subtitle, { marginBottom: 12 }]}>Recent Activity</Text>
          
          {todayAppointments.slice(0, 3).map((appointment) => (
            <View key={appointment.id} style={commonStyles.card}>
              <View style={commonStyles.row}>
                <View>
                  <Text style={commonStyles.text}>Appointment</Text>
                  <Text style={commonStyles.textSecondary}>
                    {appointment.startTime} - ${appointment.totalAmount}
                  </Text>
                </View>
                <View style={[
                  { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
                  appointment.status === 'scheduled' && { backgroundColor: colors.accent }
                ]}>
                  <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
                    {appointment.status}
                  </Text>
                </View>
              </View>
            </View>
          ))}

          {todayAppointments.length === 0 && (
            <View style={[commonStyles.card, commonStyles.centerContent, { paddingVertical: 32 }]}>
              <Icon name="calendar-outline" size={48} color={colors.textSecondary} />
              <Text style={[commonStyles.textSecondary, { marginTop: 12 }]}>
                No appointments today
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
