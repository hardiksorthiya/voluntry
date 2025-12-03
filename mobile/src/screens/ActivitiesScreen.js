import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import API from '../api';

export default function ActivitiesScreen({ navigation, route }) {
  const { user } = route?.params || {};
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
      const [allTags, setAllTags] = useState([]);
  const [joiningActivityId, setJoiningActivityId] = useState(null);
  
  // Get current user from API if not provided
  const [currentUser, setCurrentUser] = useState(user);
  const isAdmin = currentUser?.role === 'admin';

  useEffect(() => {
    if (!currentUser) {
      loadCurrentUser();
    }
  }, []);

  const loadCurrentUser = async () => {
    try {
      const response = await API.get('/users/me');
      if (response.data?.user) {
        setCurrentUser(response.data.user);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const loadActivities = async (pageNum = 1, append = false) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const params = {
        page: pageNum,
        limit: 20,
      };

      if (selectedTag) params.tag = selectedTag;
      if (selectedStatus) params.status = selectedStatus;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const response = await API.get('/activities', { params });

      if (response.data?.activities) {
        const newActivities = response.data.activities;
        
        if (append) {
          setActivities((prev) => [...prev, ...newActivities]);
        } else {
          setActivities(newActivities);
          // Extract unique tags
          const tags = new Set();
          newActivities.forEach((activity) => {
            if (activity.tags && Array.isArray(activity.tags)) {
              activity.tags.forEach((tag) => tags.add(tag));
            }
          });
          setAllTags(Array.from(tags));
        }

        // Check if there are more pages
        const total = response.data.meta?.total || 0;
        const currentCount = append
          ? activities.length + newActivities.length
          : newActivities.length;
        setHasMore(currentCount < total);

        setPage(pageNum);
      }
    } catch (error) {
      console.error('Error loading activities:', error);
      if (pageNum === 1) {
        Alert.alert('Error', 'Failed to load activities');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadActivities(1);
  }, [selectedTag]);

  useEffect(() => {
    // Filter activities by search query and status
    let filtered = [...activities];

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (activity) =>
          activity.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          activity.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (selectedStatus) {
      filtered = filtered.filter(
        (activity) => activity.status === selectedStatus
      );
    }

    setFilteredActivities(filtered);
  }, [searchQuery, selectedStatus, activities]);

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    loadActivities(1);
  };

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      loadActivities(page + 1, true);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ongoing':
        return '#fbbf24';
      case 'completed':
        return '#10b981';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#667eea';
    }
  };

  const getStateColor = (state) => {
    switch (state) {
      case 'open':
        return '#10b981';
      case 'closed':
        return '#6b7280';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#9ca3af';
    }
  };

  const handleJoinActivity = async (activityId) => {
    if (!currentUser) {
      Alert.alert('Error', 'Please login to join activities');
      return;
    }

    setJoiningActivityId(activityId);
    try {
      const response = await API.post(`/activities/${activityId}/join`);
      
      if (response.data?.activity) {
        Alert.alert('Success', 'Successfully joined the activity!');
        // Refresh activities
        loadActivities(1);
      }
    } catch (error) {
      console.error('Join error:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to join activity';
      Alert.alert('Error', errorMessage);
    } finally {
      setJoiningActivityId(null);
    }
  };

  const isUserJoined = (activity) => {
    if (!currentUser || !activity.participants || !currentUser.id) return false;
    const userId = currentUser.id;
    return activity.participants.some((p) => {
      if (!p.user) return false;
      // Handle both populated and non-populated user references
      const participantUserId =
        typeof p.user === 'object' && p.user._id
          ? p.user._id.toString()
          : p.user.toString();
      return participantUserId === userId.toString();
    });
  };

  const canJoin = (activity) => {
    if (!currentUser) return false;
    if (activity.state !== 'open') return false;
    if (isUserJoined(activity)) return false;
    if (activity.slots > 0) {
      const currentCount = activity.participants?.length || 0;
      return currentCount < activity.slots;
    }
    return true;
  };

  const renderActivity = ({ item }) => {
    const userJoined = isUserJoined(item);
    const canJoinActivity = canJoin(item);

    return (
    <TouchableOpacity
      style={styles.activityCard}
      onPress={() => navigation.navigate('ActivityDetail', { id: item._id })}
    >
      <View style={styles.activityHeader}>
        <Text style={styles.activityTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.badgesContainer}>
          {item.status && (
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(item.status) + '20' },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  { color: getStatusColor(item.status) },
                ]}
              >
                {item.status}
              </Text>
            </View>
          )}
          {item.state && item.state !== 'draft' && (
            <View
              style={[
                styles.stateBadge,
                { backgroundColor: getStateColor(item.state) + '20' },
              ]}
            >
              <Text
                style={[
                  styles.stateText,
                  { color: getStateColor(item.state) },
                ]}
              >
                {item.state}
              </Text>
            </View>
          )}
        </View>
      </View>

      {item.description && (
        <Text style={styles.activityDescription} numberOfLines={3}>
          {item.description}
        </Text>
      )}

      <View style={styles.activityMeta}>
        {item.date && (
          <View style={styles.metaItem}>
            <Text style={styles.metaIcon}>📅</Text>
            <Text style={styles.metaText}>{formatDate(item.date)}</Text>
          </View>
        )}
        {item.location && (
          <View style={styles.metaItem}>
            <Text style={styles.metaIcon}>📍</Text>
            <Text style={styles.metaText} numberOfLines={1}>
              {item.location}
            </Text>
          </View>
        )}
      </View>

      {item.tags && item.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {item.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
          {item.tags.length > 3 && (
            <Text style={styles.moreTagsText}>
              +{item.tags.length - 3} more
            </Text>
          )}
        </View>
      )}

      <View style={styles.activityFooter}>
        <View style={styles.footerLeft}>
          {item.slots > 0 && (
            <Text style={styles.slotsText}>
              {item.participants?.length || 0} / {item.slots} slots
            </Text>
          )}
          {item.participants && item.slots === 0 && (
            <Text style={styles.participantsText}>
              👥 {item.participants.length} participants
            </Text>
          )}
          {item.owner && typeof item.owner === 'object' && (
            <Text style={styles.ownerText}>
              by {item.owner.name || 'Unknown'}
            </Text>
          )}
        </View>
        {currentUser && (
          <View style={styles.footerRight}>
            {userJoined ? (
              <View style={styles.joinedBadge}>
                <Text style={styles.joinedText}>✓ Joined</Text>
              </View>
            ) : canJoinActivity ? (
              <TouchableOpacity
                style={styles.joinButton}
                onPress={(e) => {
                  e.stopPropagation();
                  handleJoinActivity(item._id);
                }}
                disabled={joiningActivityId === item._id}
              >
                {joiningActivityId === item._id ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.joinButtonText}>Join</Text>
                )}
              </TouchableOpacity>
            ) : item.state !== 'open' ? (
              <View style={styles.closedBadge}>
                <Text style={styles.closedText}>
                  {item.state === 'closed' ? 'Closed' : 'Not Open'}
                </Text>
              </View>
            ) : null}
          </View>
        )}
      </View>
    </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#667eea" />
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyStateIcon}>📋</Text>
        <Text style={styles.emptyStateText}>No activities found</Text>
        <Text style={styles.emptyStateSubtext}>
          {searchQuery || selectedTag || selectedStatus
            ? 'Try adjusting your filters'
            : 'Be the first to create an activity!'}
        </Text>
        {!searchQuery && !selectedTag && !selectedStatus && isAdmin && (
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigation.navigate('CreateActivity')}
          >
            <Text style={styles.createButtonText}>Create Activity</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Activities</Text>
          {isAdmin && (
            <TouchableOpacity
              style={styles.createButtonHeader}
              onPress={() => navigation.navigate('CreateActivity')}
            >
              <Text style={styles.createButtonHeaderText}>+ Create</Text>
            </TouchableOpacity>
          )}
          {!isAdmin && <View style={styles.placeholder} />}
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search activities..."
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
          contentContainerStyle={styles.filtersContent}
        >
          <TouchableOpacity
            style={[
              styles.filterChip,
              !selectedStatus && styles.filterChipActive,
            ]}
            onPress={() => setSelectedStatus('')}
          >
            <Text
              style={[
                styles.filterChipText,
                !selectedStatus && styles.filterChipTextActive,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          {['upcoming', 'ongoing', 'completed'].map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterChip,
                selectedStatus === status && styles.filterChipActive,
              ]}
              onPress={() => setSelectedStatus(status)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedStatus === status && styles.filterChipTextActive,
                ]}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
          {allTags.map((tag) => (
            <TouchableOpacity
              key={tag}
              style={[
                styles.filterChip,
                selectedTag === tag && styles.filterChipActive,
              ]}
              onPress={() =>
                setSelectedTag(selectedTag === tag ? '' : tag)
              }
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedTag === tag && styles.filterChipTextActive,
                ]}
              >
                #{tag}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading && activities.length === 0 ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#667eea" />
          <Text style={styles.loadingText}>Loading activities...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredActivities}
          renderItem={renderActivity}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#667eea',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  createButtonHeader: {
    padding: 8,
  },
  createButtonHeaderText: {
    fontSize: 16,
    color: '#667eea',
    fontWeight: '600',
  },
  placeholder: {
    width: 60,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  filtersContainer: {
    maxHeight: 50,
  },
  filtersContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#667eea',
  },
  filterChipText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  listContent: {
    padding: 20,
    paddingTop: 12,
  },
  activityCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityHeader: {
    marginBottom: 12,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  badgesContainer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  stateBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  stateText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  activityDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  activityMeta: {
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  metaIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  metaText: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  tag: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: '#667eea',
    fontWeight: '500',
  },
  moreTagsText: {
    fontSize: 12,
    color: '#9ca3af',
    alignSelf: 'center',
  },
  activityFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  footerLeft: {
    flex: 1,
  },
  footerRight: {
    marginLeft: 12,
  },
  joinButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  joinButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  joinedBadge: {
    backgroundColor: '#d1fae5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  joinedText: {
    color: '#10b981',
    fontSize: 14,
    fontWeight: '600',
  },
  closedBadge: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  closedText: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '500',
  },
  slotsText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  participantsText: {
    fontSize: 12,
    color: '#6b7280',
  },
  ownerText: {
    fontSize: 12,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

