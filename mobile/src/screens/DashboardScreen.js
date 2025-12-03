import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import API from '../api';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function DashboardScreen({ navigation, user, onLogout }) {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    hoursContributed: 0,
    eventsCompleted: 0,
    impactPoints: 0,
  });
  const [userStats, setUserStats] = useState({
    participatedCount: 0,
    ownedCount: 0,
    hours: 0,
  });
  const [activities, setActivities] = useState([]);
  const [upcomingActivities, setUpcomingActivities] = useState([]);

  const loadDashboardData = async () => {
    try {
      // Load dashboard stats
      const dashboardRes = await API.get('/stats/dashboard');
      if (dashboardRes.data?.stats) {
        setStats(dashboardRes.data.stats);
      }

      // Load user stats
      if (user?.id) {
        try {
          const userStatsRes = await API.get(`/stats/user/${user.id}`);
          if (userStatsRes.data) {
            setUserStats(userStatsRes.data);
          }
        } catch (error) {
          console.log('User stats not available:', error.message);
        }

        // Load user activities
        try {
          const activitiesRes = await API.get(`/users/${user.id}/activities`);
          if (activitiesRes.data?.activities) {
            setActivities(activitiesRes.data.activities);
            // Filter upcoming activities
            const upcoming = activitiesRes.data.activities
              .filter(
                (activity) =>
                  activity.status === 'upcoming' || activity.status === 'ongoing'
              )
              .slice(0, 5);
            setUpcomingActivities(upcoming);
          }
        } catch (error) {
          console.log('Activities not available:', error.message);
        }
      }

      // Also try to load public activities
      try {
        const publicActivitiesRes = await API.get('/activities?limit=5&page=1');
        if (publicActivitiesRes.data?.activities && activities.length === 0) {
          setActivities(publicActivitiesRes.data.activities);
        }
      } catch (error) {
        console.log('Public activities not available:', error.message);
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  // Refresh when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadDashboardData();
    });
    return unsubscribe;
  }, [navigation]);

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: onLogout,
      },
    ]);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.userName}>{user?.name || 'User'}!</Text>
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>⏱️</Text>
            <Text style={styles.statValue}>
              {stats.hoursContributed || userStats.hours || 0}
            </Text>
            <Text style={styles.statLabel}>Hours</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statIcon}>✅</Text>
            <Text style={styles.statValue}>
              {stats.eventsCompleted || userStats.participatedCount || 0}
            </Text>
            <Text style={styles.statLabel}>Events</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🌟</Text>
            <Text style={styles.statValue}>
              {stats.impactPoints || 0}
            </Text>
            <Text style={styles.statLabel}>Impact</Text>
          </View>
        </View>

        {/* Additional Stats */}
        {(userStats.participatedCount > 0 || userStats.ownedCount > 0) && (
          <View style={styles.additionalStats}>
            <View style={styles.additionalStatItem}>
              <Text style={styles.additionalStatValue}>
                {userStats.participatedCount || 0}
              </Text>
              <Text style={styles.additionalStatLabel}>Participated</Text>
            </View>
            <View style={styles.additionalStatItem}>
              <Text style={styles.additionalStatValue}>
                {userStats.ownedCount || 0}
              </Text>
              <Text style={styles.additionalStatLabel}>Created</Text>
            </View>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('Activities')}
            >
              <Text style={styles.actionIcon}>📋</Text>
              <Text style={styles.actionText}>Activities</Text>
            </TouchableOpacity>

            {user?.role === 'admin' && (
              <TouchableOpacity
                style={styles.actionCard}
                onPress={() => navigation.navigate('CreateActivity')}
              >
                <Text style={styles.actionIcon}>➕</Text>
                <Text style={styles.actionText}>Create</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('Chat')}
            >
              <Text style={styles.actionIcon}>💬</Text>
              <Text style={styles.actionText}>AI Chat</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('Profile')}
            >
              <Text style={styles.actionIcon}>👤</Text>
              <Text style={styles.actionText}>Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Upcoming Activities */}
        {upcomingActivities.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Upcoming Activities</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Activities')}
              >
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            {upcomingActivities.map((activity) => (
              <TouchableOpacity
                key={activity._id}
                style={styles.activityCard}
                onPress={() =>
                  navigation.navigate('ActivityDetail', { id: activity._id })
                }
              >
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle} numberOfLines={1}>
                    {activity.title}
                  </Text>
                  {activity.description && (
                    <Text style={styles.activityDescription} numberOfLines={2}>
                      {activity.description}
                    </Text>
                  )}
                  <View style={styles.activityMeta}>
                    {activity.date && (
                      <Text style={styles.activityDate}>
                        📅{' '}
                        {new Date(activity.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </Text>
                    )}
                    {activity.location && (
                      <Text style={styles.activityLocation}>
                        📍 {activity.location}
                      </Text>
                    )}
                  </View>
                  <View style={styles.activityFooter}>
                    <View
                      style={[
                        styles.statusBadge,
                        activity.status === 'ongoing' && styles.statusOngoing,
                        activity.status === 'completed' &&
                          styles.statusCompleted,
                      ]}
                    >
                      <Text style={styles.statusText}>
                        {activity.status || 'upcoming'}
                      </Text>
                    </View>
                    {activity.participants && (
                      <Text style={styles.participantsText}>
                        👥 {activity.participants.length} participants
                      </Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* All Activities Link */}
        {activities.length > 0 && (
          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={() => navigation.navigate('Activities')}
          >
            <Text style={styles.viewAllText}>View All Activities →</Text>
          </TouchableOpacity>
        )}

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  profileButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  additionalStats: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  additionalStatItem: {
    alignItems: 'center',
  },
  additionalStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 4,
  },
  additionalStatLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  activityCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  activityDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  activityMeta: {
    marginBottom: 12,
  },
  activityDate: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  activityLocation: {
    fontSize: 12,
    color: '#6b7280',
  },
  activityFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#e0e7ff',
  },
  statusOngoing: {
    backgroundColor: '#fef3c7',
  },
  statusCompleted: {
    backgroundColor: '#d1fae5',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#667eea',
    textTransform: 'capitalize',
  },
  participantsText: {
    fontSize: 12,
    color: '#6b7280',
  },
  viewAllButton: {
    backgroundColor: '#667eea',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  viewAllText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

