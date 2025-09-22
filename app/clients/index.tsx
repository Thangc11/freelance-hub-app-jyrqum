
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { commonStyles, colors } from '../../styles/commonStyles';
import { useData } from '../../hooks/useData';
import Icon from '../../components/Icon';

export default function ClientsScreen() {
  const router = useRouter();
  const { clients } = useData();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const ClientCard = ({ client }: any) => (
    <TouchableOpacity 
      style={commonStyles.card}
      onPress={() => router.push(`/clients/${client.id}`)}
    >
      <View style={commonStyles.row}>
        <View style={{ flex: 1 }}>
          <Text style={commonStyles.text}>{client.name}</Text>
          <Text style={commonStyles.textSecondary}>{client.email}</Text>
          <Text style={commonStyles.textSecondary}>{client.phone}</Text>
        </View>
        <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.content}>
        <View style={commonStyles.row}>
          <Text style={commonStyles.title}>Clients</Text>
          <TouchableOpacity onPress={() => router.push('/clients/new')}>
            <Icon name="add" size={28} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={[commonStyles.card, { marginBottom: 16 }]}>
          <View style={[commonStyles.row, { alignItems: 'center' }]}>
            <Icon name="search" size={20} color={colors.textSecondary} />
            <TextInput
              style={[commonStyles.text, { flex: 1, marginLeft: 12, padding: 0 }]}
              placeholder="Search clients..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {filteredClients.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))}

          {filteredClients.length === 0 && (
            <View style={[commonStyles.card, commonStyles.centerContent, { paddingVertical: 48 }]}>
              <Icon name="people-outline" size={64} color={colors.textSecondary} />
              <Text style={[commonStyles.textSecondary, { marginTop: 16, textAlign: 'center' }]}>
                {searchQuery ? 'No clients found' : 'No clients yet'}
              </Text>
              {!searchQuery && (
                <TouchableOpacity
                  style={[commonStyles.card, { backgroundColor: colors.primary, marginTop: 16 }]}
                  onPress={() => router.push('/clients/new')}
                >
                  <Text style={[commonStyles.text, { color: 'white', textAlign: 'center' }]}>
                    Add Your First Client
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
