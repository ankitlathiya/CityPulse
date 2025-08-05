import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import {useLanguage} from '../bridge/hooks';
import RNRestart from 'react-native-restart'; // Add this if you have the package, otherwise use DevSettings
import localization from '../localization';

const ProfileScreen = () => {
  const {isRTL, toggleLanguage} = useLanguage();

  const handleToggleLanguage = () => {
    toggleLanguage();
    Alert.alert(
      localization.getString('reloadRequired'),
      localization.getString('reloadMessage'),
      [
        {
          text: localization.getString('reloadNow'),
          onPress: () => {
            if (typeof RNRestart !== 'undefined') {
              RNRestart.Restart();
            } else {
              // Fallback for Expo or if RNRestart is not installed
              if (global && global.__DEV__ && global.DevSettings) {
                global.DevSettings.reload();
              }
            }
          },
        },
      ],
      {cancelable: false},
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Image
          source={{uri: 'https://randomuser.me/api/portraits/men/32.jpg'}}
          style={styles.avatar}
        />
        <Text style={styles.header}>John Doe</Text>
        <Text style={styles.email}>john.doe@example.com</Text>
      </View>
      <View style={styles.infoBox}>
        <Text style={styles.label}>{localization.getString('membership')}</Text>
        <Text style={styles.value}>{localization.getString('premium')}</Text>
        <Text style={styles.label}>{localization.getString('location')}</Text>
        <Text style={styles.value}>New York, USA</Text>
      </View>
      <TouchableOpacity
        style={styles.langButton}
        onPress={handleToggleLanguage}>
        <Text style={styles.langButtonText}>
          {isRTL ? localization.getString('switchToEnglish') : localization.getString('switchToArabic')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 28,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#667eea',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 4,
  },
  email: {
    fontSize: 15,
    color: '#667eea',
    marginBottom: 8,
  },
  infoBox: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 22,
    marginBottom: 30,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 15,
    color: '#718096',
    marginTop: 10,
  },
  value: {
    fontSize: 17,
    color: '#2d3748',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  langButton: {
    backgroundColor: '#667eea',
    borderRadius: 10,
    padding: 18,
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  langButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
});

export default ProfileScreen;
