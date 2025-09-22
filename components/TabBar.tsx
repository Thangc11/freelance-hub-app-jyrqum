
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { colors, commonStyles } from '../styles/commonStyles';
import Icon from './Icon';

const TabBar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { name: 'home', icon: 'home-outline', activeIcon: 'home', route: '/' },
    { name: 'clients', icon: 'people-outline', activeIcon: 'people', route: '/clients' },
    { name: 'appointments', icon: 'calendar-outline', activeIcon: 'calendar', route: '/appointments' },
    { name: 'invoices', icon: 'receipt-outline', activeIcon: 'receipt', route: '/invoices' },
    { name: 'time', icon: 'time-outline', activeIcon: 'time', route: '/time-logs' },
  ];

  return (
    <View style={[styles.container, commonStyles.bottomTabBar]}>
      {tabs.map((tab) => {
        const isActive = pathname === tab.route;
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tab}
            onPress={() => router.push(tab.route as any)}
          >
            <Icon
              name={isActive ? tab.activeIcon as any : tab.icon as any}
              size={24}
              color={isActive ? colors.primary : colors.textSecondary}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
});

export default TabBar;
