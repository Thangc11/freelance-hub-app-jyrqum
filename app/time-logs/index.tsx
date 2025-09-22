
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { commonStyles, colors } from '../../styles/commonStyles';
import { useData } from '../../hooks/useData';
import Icon from '../../components/Icon';

export default function TimeLogsScreen() {
  const router = useRouter();
  const { timeLogs, clients, projects } = useData();
  const [activeTimer, setActiveTimer] = useState<string | null>(null);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const TimeLogCard = ({ timeLog }: any) => {
    const client = clients.find(c => c.id === timeLog.clientId);
    
    return (
      <TouchableOpacity 
        style={commonStyles.card}
        onPress={() => router.push(`/time-logs/${timeLog.id}`)}
      >
        <View style={commonStyles.row}>
          <View style={{ flex: 1 }}>
            <Text style={[commonStyles.text, { fontWeight: '600' }]}>
              {timeLog.projectName}
            </Text>
            <Text style={commonStyles.text}>{client?.name}</Text>
            <Text style={commonStyles.textSecondary}>
              {timeLog.description}
            </Text>
            <View style={[commonStyles.row, { marginTop: 8 }]}>
              <Text style={commonStyles.textSecondary}>
                {formatTime(timeLog.startTime)} - {timeLog.endTime ? formatTime(timeLog.endTime) : 'Running'}
              </Text>
              <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                ${timeLog.totalAmount.toFixed(2)}
              </Text>
            </View>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={[commonStyles.text, { fontWeight: '600', fontSize: 18 }]}>
              {timeLog.duration ? formatDuration(timeLog.duration) : '0h 0m'}
            </Text>
            <Text style={commonStyles.textSecondary}>
              ${timeLog.hourlyRate}/hr
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const ProjectSummaryCard = ({ project }: any) => {
    const client = clients.find(c => c.id === project.clientId);
    
    return (
      <TouchableOpacity style={commonStyles.card}>
        <View style={commonStyles.row}>
          <View style={{ flex: 1 }}>
            <Text style={[commonStyles.text, { fontWeight: '600' }]}>
              {project.name}
            </Text>
            <Text style={commonStyles.textSecondary}>{client?.name}</Text>
            <View style={[commonStyles.row, { marginTop: 4 }]}>
              <Text style={commonStyles.textSecondary}>
                {formatDuration(project.totalHours * 60)}
              </Text>
              <View style={[
                { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
                { backgroundColor: colors.success + '20' }
              ]}>
                <Text style={[
                  commonStyles.textSecondary, 
                  { fontSize: 12, color: colors.success }
                ]}>
                  {project.status}
                </Text>
              </View>
            </View>
          </View>
          <Text style={[commonStyles.text, { fontWeight: '600', fontSize: 18 }]}>
            ${project.totalAmount.toFixed(2)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const totalHours = timeLogs.reduce((sum, log) => sum + (log.duration || 0), 0);
  const totalEarnings = timeLogs.reduce((sum, log) => sum + log.totalAmount, 0);
  const activeProjects = projects.filter(p => p.status === 'active');

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.content}>
        <View style={commonStyles.row}>
          <Text style={commonStyles.title}>Time Tracking</Text>
          <TouchableOpacity onPress={() => router.push('/time-logs/new')}>
            <Icon name="add" size={28} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Summary Cards */}
        <View style={{ flexDirection: 'row', marginBottom: 16, marginHorizontal: -4 }}>
          <View style={[commonStyles.card, { flex: 1, marginHorizontal: 4 }]}>
            <Text style={[commonStyles.text, { fontWeight: '600', fontSize: 18 }]}>
              {formatDuration(totalHours)}
            </Text>
            <Text style={commonStyles.textSecondary}>Total Hours</Text>
          </View>
          <View style={[commonStyles.card, { flex: 1, marginHorizontal: 4 }]}>
            <Text style={[commonStyles.text, { fontWeight: '600', fontSize: 18 }]}>
              ${totalEarnings.toFixed(2)}
            </Text>
            <Text style={commonStyles.textSecondary}>Total Earnings</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Active Projects */}
          {activeProjects.length > 0 && (
            <View style={commonStyles.section}>
              <Text style={[commonStyles.subtitle, { marginBottom: 12 }]}>Active Projects</Text>
              {activeProjects.map((project) => (
                <ProjectSummaryCard key={project.id} project={project} />
              ))}
            </View>
          )}

          {/* Recent Time Logs */}
          <View style={commonStyles.section}>
            <Text style={[commonStyles.subtitle, { marginBottom: 12 }]}>Recent Time Logs</Text>
            {timeLogs.slice(0, 10).map((timeLog) => (
              <TimeLogCard key={timeLog.id} timeLog={timeLog} />
            ))}
          </View>

          {timeLogs.length === 0 && (
            <View style={[commonStyles.card, commonStyles.centerContent, { paddingVertical: 48 }]}>
              <Icon name="time-outline" size={64} color={colors.textSecondary} />
              <Text style={[commonStyles.textSecondary, { marginTop: 16, textAlign: 'center' }]}>
                No time logs yet
              </Text>
              <TouchableOpacity
                style={[commonStyles.card, { backgroundColor: colors.primary, marginTop: 16 }]}
                onPress={() => router.push('/time-logs/new')}
              >
                <Text style={[commonStyles.text, { color: 'white', textAlign: 'center' }]}>
                  Start Your First Timer
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
