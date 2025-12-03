# Voluntry Mobile App

React Native mobile application for iOS and Android using Expo.

## Features

- ✅ Splash Screen with smooth animations
- ✅ User Registration with validation
- ✅ User Login with secure authentication
- ✅ Token persistence using AsyncStorage
- ✅ API integration with error handling

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp env.example .env
```

Edit `.env` and set your API URL:
```
EXPO_PUBLIC_API_URL=http://localhost:4000/api
```

For physical devices, use your computer's IP address:
```
EXPO_PUBLIC_API_URL=http://192.168.1.100:4000/api
```

## Running the App

### Development
```bash
npm start
```

### iOS
```bash
npm run ios
```

### Android
```bash
npm run android
```

## Project Structure

```
mobile/
├── src/
│   ├── screens/
│   │   ├── SplashScreen.js      # App splash screen
│   │   ├── LoginScreen.js        # User login
│   │   └── RegisterScreen.js     # User registration
│   └── api.js                    # API client configuration
├── App.js                        # Main app component
└── package.json
```

## API Endpoints Used

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/users/me` - Get current user (after login)

## Next Steps

After login/registration, you can add:
- Dashboard screen
- Activity listing
- Profile screen
- Chat/AI coach screen
- Settings screen

## Notes

- The app uses AsyncStorage to persist authentication tokens
- All API calls include proper error handling
- The splash screen shows for 2.5 seconds before navigation
- Form validation is implemented on both login and registration screens

