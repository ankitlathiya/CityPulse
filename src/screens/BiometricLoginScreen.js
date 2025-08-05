import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';
import localization from '../localization';

const BiometricLoginScreen = ({navigation}) => {
  const handleBiometric = async () => {
    const rnBiometrics = new ReactNativeBiometrics();
    const {available, biometryType} = await rnBiometrics.isSensorAvailable();

    if (!available) {
      Alert.alert(
        localization.getString('biometricUnavailable'),
        localization.getString('biometricUnavailableMessage'),
        [
          {
            text: localization.getString('okay'),
          },
        ],
      );
      return;
    }

    rnBiometrics
      .simplePrompt({
        promptMessage: 'Authenticate with your fingerprint or face to continue',
      })
      .then(resultObject => {
        const {success} = resultObject;
        if (success) {
          navigateToHome();
        } else {
          Alert.alert(
            localization.getString('authenticationCancelled'),
            localization.getString('authenticationCancelledMessage'),
            [
              {
                text: localization.getString('okay'),
              },
            ],
          );
        }
      })
      .catch(() => {
        Alert.alert(
          localization.getString('authenticationFailed'),
          localization.getString('authenticationFailedMessage'),
          [
            {
              text: localization.getString('tryAgain'),
              onPress: handleBiometric,
            },
            {
              text: localization.getString('skip'),
              onPress: () => navigateToHome(),
            },
          ],
        );
      });
  };

  const navigateToHome = () => {
    navigation.replace('Home');
  };

  useEffect(() => {
    handleBiometric();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#667eea" barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.title}>
          {localization.getString('secureLogin')}
        </Text>
        <Text style={styles.subtitle}>
          {localization.getString('biometricSubtitle')}
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>🔒</Text>
        </View>

        <Text style={styles.description}>
          {localization.getString('biometricDescription')}
        </Text>

        <TouchableOpacity
          style={styles.biometricButton}
          onPress={handleBiometric}>
          <Text style={styles.biometricButtonText}>
            {localization.getString('tryBiometric')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.skipButton} onPress={navigateToHome}>
          <Text style={styles.skipButtonText}>
            {localization.getString('skipForNow')}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          You can always enable biometric login later in settings
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#667eea',
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
    textAlign: 'center',
    marginTop: 5,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  icon: {
    fontSize: 40,
  },
  description: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  biometricButton: {
    backgroundColor: '#667eea',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 40,
    marginBottom: 16,
    minWidth: 200,
  },
  biometricButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  skipButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#667eea',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 40,
    minWidth: 200,
  },
  skipButtonText: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  footerText: {
    fontSize: 14,
    color: '#a0aec0',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default BiometricLoginScreen;
