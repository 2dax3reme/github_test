import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  Animated,
  Easing 
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { useUser } from '../context/UserContext';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const Login: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useUser();
  
  const carAnim1 = new Animated.Value(0);
  const carAnim2 = new Animated.Value(0);

  React.useEffect(() => {
    const animateCars = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(carAnim1, {
            toValue: 1,
            duration: 3000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(carAnim1, {
            toValue: 0,
            duration: 3000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(carAnim2, {
            toValue: 1,
            duration: 4000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(carAnim2, {
            toValue: 0,
            duration: 4000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animateCars();
  }, []);

  const car1TranslateY = carAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  const car2TranslateY = carAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -30],
  });

  const handleLogin = () => {
    if (login(username, password)) {
      const user = username === 'admin' ? 'admin' : 'customer';
      navigation.replace(user === 'admin' ? 'AddCar' : 'RentCar');
    } else {
      Alert.alert('Error', 'Invalid credentials. Use admin/admin123 or customer/customer123');
    }
  };

  return (
    <View style={styles.container}>
      <Animated.Text 
        style={[
          styles.floatingCar,
          { transform: [{ translateY: car1TranslateY }], left: '10%', top: '20%' }
        ]}
      >
        🚗
      </Animated.Text>
      
      <Animated.Text 
        style={[
          styles.floatingCar,
          { transform: [{ translateY: car2TranslateY }], right: '15%', top: '60%' }
        ]}
      >
        🏎️
      </Animated.Text>

      <View style={styles.loginForm}>
        <Text style={styles.title}>🚗 CarBooking Pro</Text>
        <Text style={styles.subtitle}>Welcome back! Please sign in to continue.</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#999"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />
        
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
        
        <View style={styles.demoContainer}>
          <Text style={styles.demoTitle}>Demo Accounts:</Text>
          <Text style={styles.demoText}>Admin: admin / admin123</Text>
          <Text style={styles.demoText}>Customer: customer / customer123</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#667eea',
    position: 'relative',
  },
  floatingCar: {
    position: 'absolute',
    fontSize: 48,
    zIndex: 1,
  },
  loginForm: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    zIndex: 2,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 2,
    borderColor: '#e1e5e9',
  },
  button: {
    backgroundColor: '#764ba2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  demoContainer: {
    marginTop: 30,
    padding: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
  },
  demoTitle: {
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  demoText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default Login;