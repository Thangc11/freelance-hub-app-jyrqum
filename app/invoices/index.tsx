
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { commonStyles, colors } from '../../styles/commonStyles';
import { useData } from '../../hooks/useData';
import Icon from '../../components/Icon';

export default function InvoicesScreen() {
  const router = useRouter();
  const { invoices, clients } = useData();
  const [filter, setFilter] = useState<'all' | 'draft' | 'sent' | 'paid' | 'overdue'>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return colors.textSecondary;
      case 'sent': return colors.warning;
      case 'paid': return colors.success;
      case 'overdue': return colors.error;
      default: return colors.textSecondary;
    }
  };

  const filteredInvoices = invoices.filter(invoice => 
    filter === 'all' || invoice.status === filter
  );

  const InvoiceCard = ({ invoice }: any) => {
    const client = clients.find(c => c.id === invoice.clientId);
    
    return (
      <TouchableOpacity 
        style={commonStyles.card}
        onPress={() => router.push(`/invoices/${invoice.id}`)}
      >
        <View style={commonStyles.row}>
          <View style={{ flex: 1 }}>
            <View style={[commonStyles.row, { marginBottom: 4 }]}>
              <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                Invoice #{invoice.id}
              </Text>
              <View style={[
                { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
                { backgroundColor: getStatusColor(invoice.status) + '20' }
              ]}>
                <Text style={[
                  commonStyles.textSecondary, 
                  { fontSize: 12, color: getStatusColor(invoice.status) }
                ]}>
                  {invoice.status}
                </Text>
              </View>
            </View>
            <Text style={commonStyles.text}>{client?.name}</Text>
            <Text style={commonStyles.textSecondary}>
              Due: {invoice.dueDate.toLocaleDateString()}
            </Text>
            <Text style={[commonStyles.text, { fontWeight: '600', fontSize: 18 }]}>
              ${invoice.total.toFixed(2)}
            </Text>
          </View>
          <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
        </View>
      </TouchableOpacity>
    );
  };

  const FilterButton = ({ status, label }: any) => (
    <TouchableOpacity
      style={[
        commonStyles.card,
        { 
          marginRight: 8,
          backgroundColor: filter === status ? colors.primary : colors.card
        }
      ]}
      onPress={() => setFilter(status)}
    >
      <Text style={[
        commonStyles.textSecondary,
        { 
          color: filter === status ? 'white' : colors.textSecondary,
          fontSize: 14
        }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const totalAmount = filteredInvoices.reduce((sum, inv) => sum + inv.total, 0);
  const paidAmount = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total, 0);
  const pendingAmount = invoices.filter(inv => inv.status === 'sent' || inv.status === 'overdue').reduce((sum, inv) => sum + inv.total, 0);

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.content}>
        <View style={commonStyles.row}>
          <Text style={commonStyles.title}>Invoices</Text>
          <TouchableOpacity onPress={() => router.push('/invoices/new')}>
            <Icon name="add" size={28} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Summary Cards */}
        <View style={{ flexDirection: 'row', marginBottom: 16, marginHorizontal: -4 }}>
          <View style={[commonStyles.card, { flex: 1, marginHorizontal: 4 }]}>
            <Text style={[commonStyles.text, { fontWeight: '600', fontSize: 18 }]}>
              ${paidAmount.toFixed(2)}
            </Text>
            <Text style={commonStyles.textSecondary}>Paid</Text>
          </View>
          <View style={[commonStyles.card, { flex: 1, marginHorizontal: 4 }]}>
            <Text style={[commonStyles.text, { fontWeight: '600', fontSize: 18 }]}>
              ${pendingAmount.toFixed(2)}
            </Text>
            <Text style={commonStyles.textSecondary}>Pending</Text>
          </View>
        </View>

        {/* Filter Buttons */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 16 }}
        >
          <FilterButton status="all" label="All" />
          <FilterButton status="draft" label="Draft" />
          <FilterButton status="sent" label="Sent" />
          <FilterButton status="paid" label="Paid" />
          <FilterButton status="overdue" label="Overdue" />
        </ScrollView>

        <ScrollView showsVerticalScrollIndicator={false}>
          {filteredInvoices.map((invoice) => (
            <InvoiceCard key={invoice.id} invoice={invoice} />
          ))}

          {filteredInvoices.length === 0 && (
            <View style={[commonStyles.card, commonStyles.centerContent, { paddingVertical: 48 }]}>
              <Icon name="receipt-outline" size={64} color={colors.textSecondary} />
              <Text style={[commonStyles.textSecondary, { marginTop: 16, textAlign: 'center' }]}>
                {filter === 'all' ? 'No invoices yet' : `No ${filter} invoices`}
              </Text>
              {filter === 'all' && (
                <TouchableOpacity
                  style={[commonStyles.card, { backgroundColor: colors.primary, marginTop: 16 }]}
                  onPress={() => router.push('/invoices/new')}
                >
                  <Text style={[commonStyles.text, { color: 'white', textAlign: 'center' }]}>
                    Create Your First Invoice
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
