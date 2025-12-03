import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import API from '../api';

export default function CreateActivityScreen({ navigation, route }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    slots: '',
    tags: '',
    state: 'open', // Published by default
    status: 'upcoming',
  });

  const handleCreate = async () => {
    // Validation
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Title is required');
      return;
    }

    if (!formData.date) {
      Alert.alert('Error', 'Date is required');
      return;
    }

    // Combine date and time
    let dateTime = formData.date;
    if (formData.time) {
      dateTime = `${formData.date}T${formData.time}`;
    } else {
      dateTime = `${formData.date}T12:00:00`;
    }

    setLoading(true);
    try {
      const activityData = {
        title: formData.title.trim(),
        date: new Date(dateTime).toISOString(),
      };

      if (formData.description.trim())
        activityData.description = formData.description.trim();
      if (formData.location.trim())
        activityData.location = formData.location.trim();
      if (formData.slots) activityData.slots = parseInt(formData.slots) || 0;
      if (formData.tags.trim()) {
        activityData.tags = formData.tags
          .split(',')
          .map((t) => t.trim())
          .filter((t) => t);
      }
      if (formData.state) activityData.state = formData.state;
      if (formData.status) activityData.status = formData.status;

      const response = await API.post('/activities', activityData);

      if (response.data?.activity) {
        Alert.alert('Success', 'Activity created successfully!', [
          {
            text: 'OK',
            onPress: () => {
              navigation.goBack();
              // Refresh activities if there's a callback
              if (route.params?.onActivityCreated) {
                route.params.onActivityCreated(response.data.activity);
              }
            },
          },
        ]);
      }
    } catch (error) {
      console.error('Create activity error:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to create activity';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backButtonText}>← Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Create Activity</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Title * <Text style={styles.required}>(Required)</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Community Food Drive"
                placeholderTextColor="#9ca3af"
                value={formData.title}
                onChangeText={(text) =>
                  setFormData({ ...formData, title: text })
                }
                editable={!loading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe the activity, what volunteers will do, etc."
                placeholderTextColor="#9ca3af"
                value={formData.description}
                onChangeText={(text) =>
                  setFormData({ ...formData, description: text })
                }
                multiline
                numberOfLines={5}
                textAlignVertical="top"
                editable={!loading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Date * <Text style={styles.required}>(Required)</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#9ca3af"
                value={formData.date}
                onChangeText={(text) =>
                  setFormData({ ...formData, date: text })
                }
                editable={!loading}
              />
              <Text style={styles.hint}>
                Format: YYYY-MM-DD (e.g., {getTodayDate()})
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Time</Text>
              <TextInput
                style={styles.input}
                placeholder="HH:MM (24-hour format)"
                placeholderTextColor="#9ca3af"
                value={formData.time}
                onChangeText={(text) =>
                  setFormData({ ...formData, time: text })
                }
                editable={!loading}
              />
              <Text style={styles.hint}>
                Format: HH:MM (e.g., 14:30 for 2:30 PM)
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Location</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Community Center, 123 Main St"
                placeholderTextColor="#9ca3af"
                value={formData.location}
                onChangeText={(text) =>
                  setFormData({ ...formData, location: text })
                }
                editable={!loading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Available Slots</Text>
              <TextInput
                style={styles.input}
                placeholder="Number of volunteers needed (0 = unlimited)"
                placeholderTextColor="#9ca3af"
                value={formData.slots}
                onChangeText={(text) =>
                  setFormData({ ...formData, slots: text })
                }
                keyboardType="number-pad"
                editable={!loading}
              />
              <Text style={styles.hint}>
                Enter 0 for unlimited volunteers
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tags</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., food, community, environment (comma separated)"
                placeholderTextColor="#9ca3af"
                value={formData.tags}
                onChangeText={(text) =>
                  setFormData({ ...formData, tags: text })
                }
                editable={!loading}
              />
              <Text style={styles.hint}>
                Separate tags with commas
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Publish Status</Text>
              <View style={styles.radioGroup}>
                {['open', 'draft', 'closed'].map((state) => (
                  <TouchableOpacity
                    key={state}
                    style={[
                      styles.radioOption,
                      formData.state === state && styles.radioOptionSelected,
                    ]}
                    onPress={() =>
                      setFormData({ ...formData, state })
                    }
                    disabled={loading}
                  >
                    <Text
                      style={[
                        styles.radioText,
                        formData.state === state && styles.radioTextSelected,
                      ]}
                    >
                      {state === 'open' ? 'Published' : state === 'draft' ? 'Draft' : 'Closed'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.hint}>
                Published: Visible to all users | Draft: Not visible | Closed: No more volunteers
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Status</Text>
              <View style={styles.radioGroup}>
                {['upcoming', 'ongoing', 'completed'].map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.radioOption,
                      formData.status === status && styles.radioOptionSelected,
                    ]}
                    onPress={() =>
                      setFormData({ ...formData, status })
                    }
                    disabled={loading}
                  >
                    <Text
                      style={[
                        styles.radioText,
                        formData.status === status && styles.radioTextSelected,
                      ]}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={[styles.createButton, loading && styles.buttonDisabled]}
              onPress={handleCreate}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.createButtonText}>Create Activity</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  placeholder: {
    width: 60,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  required: {
    color: '#ef4444',
    fontSize: 12,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1f2937',
  },
  textArea: {
    minHeight: 120,
    paddingTop: 16,
  },
  hint: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  radioOption: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  radioOptionSelected: {
    borderColor: '#667eea',
    backgroundColor: '#e0e7ff',
  },
  radioText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  radioTextSelected: {
    color: '#667eea',
    fontWeight: '600',
  },
  createButton: {
    backgroundColor: '#667eea',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

