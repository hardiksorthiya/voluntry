import React, { useState, useEffect } from 'react';
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

export default function ProfileUpdateScreen({ navigation, route }) {
  const { user: initialUser } = route?.params || {};
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: initialUser?.name || '',
    phone: initialUser?.profile?.phone || '',
    bio: initialUser?.profile?.bio || '',
    location: initialUser?.profile?.location || '',
    skills: initialUser?.profile?.skills?.join(', ') || '',
    availability: initialUser?.profile?.availability || '',
    avatarUrl: initialUser?.profile?.avatarUrl || '',
  });

  // Load user data if not provided
  useEffect(() => {
    if (!initialUser) {
      loadUserData();
    }
  }, []);

  const loadUserData = async () => {
    try {
      const response = await API.get('/users/me');
      if (response.data?.user) {
        const userData = response.data.user;
        setFormData({
          name: userData.name || '',
          phone: userData.profile?.phone || '',
          bio: userData.profile?.bio || '',
          location: userData.profile?.location || '',
          skills: userData.profile?.skills?.join(', ') || '',
          availability: userData.profile?.availability || '',
          avatarUrl: userData.profile?.avatarUrl || '',
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleUpdate = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }

    setLoading(true);
    try {
      // Prepare update data
      const updateData = {
        name: formData.name.trim(),
      };

      if (formData.phone.trim()) updateData.phone = formData.phone.trim();
      if (formData.bio.trim()) updateData.bio = formData.bio.trim();
      if (formData.location.trim())
        updateData.location = formData.location.trim();
      if (formData.skills.trim()) {
        updateData.skills = formData.skills
          .split(',')
          .map((s) => s.trim())
          .filter((s) => s);
      }
      if (formData.availability.trim())
        updateData.availability = formData.availability.trim();
      if (formData.avatarUrl.trim())
        updateData.avatarUrl = formData.avatarUrl.trim();

      const response = await API.put('/users/me', updateData);

      if (response.data?.user) {
        Alert.alert('Success', 'Profile updated successfully!', [
          {
            text: 'OK',
            onPress: () => {
              navigation.goBack();
              // Refresh profile if there's a refresh callback
              if (route.params?.onUpdate) {
                route.params.onUpdate(response.data.user);
              }
            },
          },
        ]);
      }
    } catch (error) {
      console.error('Update error:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to update profile';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
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
            <Text style={styles.headerTitle}>Edit Profile</Text>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleUpdate}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#667eea" />
              ) : (
                <Text style={styles.saveButtonText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                placeholderTextColor="#9ca3af"
                value={formData.name}
                onChangeText={(text) =>
                  setFormData({ ...formData, name: text })
                }
                editable={!loading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your phone number"
                placeholderTextColor="#9ca3af"
                value={formData.phone}
                onChangeText={(text) =>
                  setFormData({ ...formData, phone: text })
                }
                keyboardType="phone-pad"
                editable={!loading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Bio</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Tell us about yourself"
                placeholderTextColor="#9ca3af"
                value={formData.bio}
                onChangeText={(text) =>
                  setFormData({ ...formData, bio: text })
                }
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                editable={!loading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Location</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your location"
                placeholderTextColor="#9ca3af"
                value={formData.location}
                onChangeText={(text) =>
                  setFormData({ ...formData, location: text })
                }
                editable={!loading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Skills</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter skills (comma separated, e.g., Teaching, Cooking, Gardening)"
                placeholderTextColor="#9ca3af"
                value={formData.skills}
                onChangeText={(text) =>
                  setFormData({ ...formData, skills: text })
                }
                editable={!loading}
              />
              <Text style={styles.hint}>
                Separate multiple skills with commas
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Availability</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Weekends, Evenings, Flexible"
                placeholderTextColor="#9ca3af"
                value={formData.availability}
                onChangeText={(text) =>
                  setFormData({ ...formData, availability: text })
                }
                editable={!loading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Avatar URL</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter image URL for your avatar"
                placeholderTextColor="#9ca3af"
                value={formData.avatarUrl}
                onChangeText={(text) =>
                  setFormData({ ...formData, avatarUrl: text })
                }
                keyboardType="url"
                autoCapitalize="none"
                editable={!loading}
              />
              <Text style={styles.hint}>
                Enter a URL to an image for your profile picture
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.updateButton, loading && styles.buttonDisabled]}
              onPress={handleUpdate}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.updateButtonText}>Update Profile</Text>
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
  saveButton: {
    padding: 8,
    minWidth: 60,
    alignItems: 'flex-end',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#667eea',
    fontWeight: '600',
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
    minHeight: 100,
    paddingTop: 16,
  },
  hint: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
  updateButton: {
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
  updateButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

