import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import PlaceholderScreen from './src/screens/PlaceholderScreen';
import API, { setToken } from './src/api';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Check if user is already logged in
      const token = await AsyncStorage.getItem('authToken');
      const userData = await AsyncStorage.getItem('user');

      if (token && userData) {
        // Set token for API requests
        setToken(token);
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleRegister = (userData) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('refreshToken');
      await AsyncStorage.removeItem('user');
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Show splash screen first
  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  // Show loading while checking auth
  if (isLoading) {
    return null; // You can add a loading screen here if needed
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        >
          {user ? (
            // Authenticated screens
            <>
              <Stack.Screen name="Dashboard">
                {(props) => (
                  <DashboardScreen
                    {...props}
                    user={user}
                    onLogout={handleLogout}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="Activities">
                {(props) => (
                  <PlaceholderScreen
                    {...props}
                    title="Activities"
                    description="Browse and join volunteer activities"
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="CreateActivity">
                {(props) => (
                  <PlaceholderScreen
                    {...props}
                    title="Create Activity"
                    description="Create a new volunteer activity"
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="Chat">
                {(props) => (
                  <PlaceholderScreen
                    {...props}
                    title="AI Chat"
                    description="Chat with AI volunteer coach"
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="Profile">
                {(props) => (
                  <PlaceholderScreen
                    {...props}
                    title="Profile"
                    description="View and edit your profile"
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="ActivityDetail">
                {(props) => (
                  <PlaceholderScreen
                    {...props}
                    title="Activity Details"
                    description="View activity details"
                  />
                )}
              </Stack.Screen>
            </>
          ) : (
          // Auth screens
          <>
            <Stack.Screen name="Login">
              {(props) => (
                <LoginScreen
                  {...props}
                  onLogin={handleLogin}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="Register">
              {(props) => (
                <RegisterScreen
                  {...props}
                  onRegister={handleRegister}
                />
              )}
            </Stack.Screen>
          </>
        )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
