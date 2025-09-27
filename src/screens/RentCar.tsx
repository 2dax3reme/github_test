import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Animated,
  Alert
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { useUser } from '../context/UserContext';

type RentCarScreenNavigationProp = StackNavigationProp<RootStackParamList, 'RentCar'>;

interface Props {
  navigation: RentCarScreenNavigationProp;
}

const RentCar: React.FC<Props> = ({ navigation }) => {
  const [selectedCarId, setSelectedCarId] = useState<string>('');
  const [days, setDays] = useState<number>(1);
  const [showModal, setShowModal] = useState(false);
  const { cars, addBooking } = useUser();

  const selectedCar = cars.find(car => car.id === selectedCarId);
  const total = selectedCar ? selectedCar.costPerDay * days : 0;

  const modalAnim = new Animated.Value(0);

  const handleBook = () => {
    if (!selectedCar) {
      Alert.alert('Error', 'Please select a car first');
      return;
    }
    setShowModal(true);
    Animated.spring(modalAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleConfirm = () => {
    if (selectedCar) {
      addBooking({
        carId: selectedCar.id,
        car: selectedCar,
        days,
        total
      });
      Animated.spring(modalAnim, {
        toValue: 0,
        useNativeDriver: true,
      }).start(() => {
        setShowModal(false);
        navigation.navigate('Confirmation');
      });
    }
  };

  const handleCancel = () => {
    Animated.spring(modalAnim, {
      toValue: 0,
      useNativeDriver: true,
    }).start(() => {
      setShowModal(false);
    });
  };

  const modalScale = modalAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  const modalOpacity = modalAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Rent a Car 🏎️</Text>
          <Text style={styles.subtitle}>Choose your perfect ride for your journey</Text>
        </View>

        <View style={styles.bookingForm}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Select Car</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carScroll}>
              {cars.map(car => (
                <TouchableOpacity
                  key={car.id}
                  style={[
                    styles.carOption,
                    selectedCarId === car.id && styles.selectedCar
                  ]}
                  onPress={() => setSelectedCarId(car.id)}
                >
                  <Text style={styles.carEmoji}>{car.image}</Text>
                  <Text style={styles.carText}>{car.make} {car.model}</Text>
                  <Text style={styles.carPrice}>${car.costPerDay}/day</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Number of Days</Text>
            <View style={styles.daysContainer}>
              <TouchableOpacity 
                style={styles.dayButton}
                onPress={() => setDays(Math.max(1, days - 1))}
              >
                <Text style={styles.dayButtonText}>-</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.daysInput}
                value={days.toString()}
                onChangeText={(text) => setDays(Math.max(1, parseInt(text) || 1))}
                keyboardType="numeric"
              />
              <TouchableOpacity 
                style={styles.dayButton}
                onPress={() => setDays(days + 1)}
              >
                <Text style={styles.dayButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {selectedCar && (
            <Animated.View 
              style={[
                styles.pricePreview,
                { opacity: modalOpacity }
              ]}
            >
              <Text style={styles.priceTitle}>Price Preview</Text>
              <Text style={styles.priceText}>
                ${selectedCar.costPerDay} × {days} days = 
                <Text style={styles.totalText}> ${total}</Text>
              </Text>
            </Animated.View>
          )}

          <TouchableOpacity
            style={[
              styles.bookButton,
              !selectedCar && styles.disabledButton
            ]}
            onPress={handleBook}
            disabled={!selectedCar}
          >
            <Text style={styles.bookButtonText}>Book Now</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.availableTitle}>Available Cars</Text>
        <View style={styles.carsGrid}>
          {cars.map(car => (
            <TouchableOpacity
              key={car.id}
              style={[
                styles.carCard,
                selectedCarId === car.id && styles.selectedCarCard
              ]}
              onPress={() => setSelectedCarId(car.id)}
            >
              <Text style={styles.carCardEmoji}>{car.image}</Text>
              <Text style={styles.carCardText}>{car.make} {car.model}</Text>
              <Text style={styles.carCardPrice}>${car.costPerDay}/day</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <Animated.View style={[
            styles.modalContent,
            {
              opacity: modalOpacity,
              transform: [{ scale: modalScale }]
            }
          ]}>
            <Text style={styles.modalTitle}>Confirm Booking</Text>
            {selectedCar && (
              <View style={styles.bookingDetails}>
                <Text style={styles.carImageLarge}>{selectedCar.image}</Text>
                <Text style={styles.carName}>{selectedCar.make} {selectedCar.model}</Text>
                <Text style={styles.bookingInfo}>Duration: {days} day(s)</Text>
                <Text style={styles.totalAmount}>Total: ${total}</Text>
              </View>
            )}
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                <Text style={styles.confirmButtonText}>Confirm Booking</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#667eea',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  bookingForm: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  carScroll: {
    flexDirection: 'row',
  },
  carOption: {
    alignItems: 'center',
    padding: 15,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#e1e5e9',
    borderRadius: 10,
    minWidth: 100,
  },
  selectedCar: {
    borderColor: '#667eea',
    backgroundColor: '#f0f4ff',
  },
  carEmoji: {
    fontSize: 24,
    marginBottom: 5,
  },
  carText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  carPrice: {
    fontSize: 12,
    color: '#667eea',
    fontWeight: '600',
  },
  daysContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayButton: {
    backgroundColor: '#667eea',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  daysInput: {
    borderWidth: 2,
    borderColor: '#e1e5e9',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 10,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    minWidth: 60,
  },
  pricePreview: {
    backgroundColor: '#f0f4ff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  priceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  priceText: {
    fontSize: 16,
    color: '#666',
  },
  totalText: {
    fontWeight: 'bold',
    color: '#667eea',
    fontSize: 18,
  },
  bookButton: {
    backgroundColor: '#667eea',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  bookButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  availableTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginBottom: 10,
    color: '#333',
  },
  carsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    justifyContent: 'space-between',
  },
  carCard: {
    width: '48%',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  selectedCarCard: {
    borderColor: '#667eea',
    backgroundColor: '#f0f4ff',
  },
  carCardEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  carCardText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  carCardPrice: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 15,
    width: '100%',
    maxWidth: 350,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  bookingDetails: {
    alignItems: 'center',
    marginBottom: 25,
  },
  carImageLarge: {
    fontSize: 48,
    marginBottom: 10,
  },
  carName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  bookingInfo: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#667eea',
    marginTop: 10,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#e1e5e9',
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#667eea',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 10,
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default RentCar;