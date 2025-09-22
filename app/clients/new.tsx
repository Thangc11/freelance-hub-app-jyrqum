
import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { commonStyles, colors } from '../../styles/commonStyles';
import { useData } from '../../hooks/useData';
import Icon from '../../components/Icon';

export default function NewClientScreen() {
  const router = useRouter();
  const { addClient } = useData();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
  });

  const handleSave = () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter a client name');
      return;
    }

    if (!formData.email.trim()) {
      Alert.alert('Error', 'Please enter an email address');
      return;
    }

    try {
      addClient(formData);
      Alert.alert('Success', 'Client added successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.log('Error adding client:', error);
      Alert.alert('Error', 'Failed to add client');
    }
  };

  const InputField = ({ label, value, onChangeText, placeholder, multiline = false }: any) => (
    <View style={{ marginBottom: 16 }}>
      <Text style={[commonStyles.text, { marginBottom: 8, fontWeight: '600' }]}>{label}</Text>
      <TextInput
        style={[
          commonStyles.card,
          { 
            paddingVertical: multiline ? 16 : 12,
            minHeight: multiline ? 80 : 48,
            textAlignVertical: multiline ? 'top' : 'center'
          }
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        multiline={multiline}
      />
    </View>
  );

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.content}>
        <View style={[commonStyles.row, { marginBottom: 24 }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <Icon name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[commonStyles.title, { flex: 1, textAlign: 'center', marginRight: 24 }]}>
            New Client
          </Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <InputField
            label="Full Name *"
            value={formData.name}
            onChangeText={(text: string) => setFormData(prev => ({ ...prev, name: text }))}
            placeholder="Enter client's full name"
          />

          <InputField
            label="Email Address *"
            value={formData.email}
            onChangeText={(text: string) => setFormData(prev => ({ ...prev, email: text }))}
            placeholder="client@example.com"
          />

          <InputField
            label="Phone Number"
            value={formData.phone}
            onChangeText={(text: string) => setFormData(prev => ({ ...prev, phone: text }))}
            placeholder="+1 (555) 123-4567"
          />

          <InputField
            label="Address"
            value={formData.address}
            onChangeText={(text: string) => setFormData(prev => ({ ...prev, address: text }))}
            placeholder="Street address, City, State, ZIP"
            multiline
          />

          <InputField
            label="Notes"
            value={formData.notes}
            onChangeText={(text: string) => setFormData(prev => ({ ...prev, notes: text }))}
            placeholder="Any special notes about this client..."
            multiline
          />

          <TouchableOpacity
            style={[commonStyles.card, { backgroundColor: colors.primary, marginTop: 24 }]}
            onPress={handleSave}
          >
            <Text style={[commonStyles.text, { color: 'white', textAlign: 'center', fontWeight: '600' }]}>
              Save Client
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
