import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { useUser } from '../context/UserContext';

type ConfirmationScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Confirmation'>;

interface Props {
  navigation: ConfirmationScreenNavigationProp;
}

const Confirmation: React.FC<Props> = ({ navigation }) => {
  const { currentBooking } = useUser();
  
  const scaleAnim = new Animated.Value(0);
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  useEffect(() => {
    if (!currentBooking) {
      navigation.navigate('RentCar');
      return;
    }

    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  if (!currentBooking) {
    return (
      <View style={styles.container}>
        <Text>No booking found</Text>
        <TouchableOpacity onPress={() => navigation.navigate('RentCar')}>
          <Text>Back to Booking</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Animated.View 
          style={[
            styles.successIcon,
            {
              transform: [{ scale: scaleAnim }],
              opacity: fadeAnim
            }
          ]}
        >
          <Text style={styles.checkmark}>✅</Text>
        </Animated.View>

        <Animated.View 
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }}
        >
          <Text style={styles.title}>Booking Confirmed! 🎉</Text>
          <Text style={styles.subtitle}>Your car rental has been successfully booked</Text>
        </Animated.View>

        <Animated.View 
          style={[
            styles.bookingCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.carImageLarge}>{currentBooking.car.image}</Text>
          
          <View style={styles.detailsGrid}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Car:</Text>
              <Text style={styles.detailValue}>{currentBooking.car.make} {currentBooking.car.model}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Rental Period:</Text>
              <Text style={styles.detailValue}>{currentBooking.days} day(s)</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Cost per Day:</Text>
              <Text style={styles.detailValue}>${currentBooking.car.costPerDay}</Text>
            </View>
            
            <View style={[styles.detailRow, styles.totalRow]}>
              <Text style={styles.detailLabel}>Total Amount Due:</Text>
              <Text style={styles.totalValue}>${currentBooking.total}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Booking Date:</Text>
              <Text style={styles.detailValue}>
                {new Date(currentBooking.bookingDate).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View 
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }}
        >
          <TouchableOpacity 
            style={styles.bookAgainButton}
            onPress={() => navigation.navigate('RentCar')}
          >
            <Text style={styles.bookAgainText}>Book Another Car</Text>
          </TouchableOpacity>

          <View style={styles.thankYou}>
            <Text style={styles.thankYouText}>
              Thank you for choosing CarBooking Pro! 🚗
            </Text>
            <Text style={styles.instructions}>
              Please bring your ID and payment method when picking up the car.
            </Text>
          </View>
        </Animated.View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  successIcon: {
    marginBottom: 20,
  },
  checkmark: {
    fontSize: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
  },
  bookingCard: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 15,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 30,
  },
  carImageLarge: {
    fontSize: 60,
    textAlign: 'center',
    marginBottom: 20,
  },
  detailsGrid: {
    width: '100%',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  totalRow: {
    borderTopWidth: 2,
    borderTopColor: '#667eea',
    borderBottomWidth: 0,
    marginTop: 10,
    paddingTop: 15,
  },
  detailLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#667eea',
  },
  bookAgainButton: {
    backgroundColor: '#667eea',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30,
    minWidth: 200,
  },
  bookAgainText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  thankYou: {
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  thankYouText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '500',
  },
  instructions: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default Confirmation;