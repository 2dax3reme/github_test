import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Animated
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { useUser } from '../context/UserContext';

type AddCarScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddCar'>;

interface Props {
  navigation: AddCarScreenNavigationProp;
}

const carImages = ['🚗', '🏎️', '🚙', '🚕', '🚓', '🚚'];

const AddCar: React.FC<Props> = ({ navigation }) => {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [costPerDay, setCostPerDay] = useState('');
  const [selectedImage, setSelectedImage] = useState(carImages[0]);
  const { addCar, cars } = useUser();

  const scaleAnim = new Animated.Value(1);

  const handleSubmit = () => {
    if (!make || !model || !costPerDay) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      addCar({
        make,
        model,
        costPerDay: parseFloat(costPerDay),
        image: selectedImage
      });

      setMake('');
      setModel('');
      setCostPerDay('');
      setSelectedImage(carImages[0]);
      
      Alert.alert('Success', 'Car added to fleet!');
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Add New Car 🚗</Text>
        <Text style={styles.subtitle}>Add cars to your rental fleet</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Car Make</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Toyota, Honda, BMW"
            value={make}
            onChangeText={setMake}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Car Model</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Camry, Civic, X5"
            value={model}
            onChangeText={setModel}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Cost Per Day ($)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 50"
            value={costPerDay}
            onChangeText={setCostPerDay}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Car Image</Text>
          <View style={styles.imageSelector}>
            {carImages.map((image, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.imageOption,
                  selectedImage === image && styles.selectedImage
                ]}
                onPress={() => setSelectedImage(image)}
              >
                <Text style={styles.imageText}>{image}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Add Car to Fleet</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      <View style={styles.carsList}>
        <Text style={styles.carsTitle}>Current Fleet ({cars.length} cars)</Text>
        <View style={styles.carsGrid}>
          {cars.map((car) => (
            <View key={car.id} style={styles.carCard}>
              <Text style={styles.carImage}>{car.image}</Text>
              <Text style={styles.carMakeModel}>{car.make} {car.model}</Text>
              <Text style={styles.carPrice}>${car.costPerDay}/day</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  form: {
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
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 2,
    borderColor: '#e1e5e9',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
  imageSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  imageOption: {
    width: '30%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#e1e5e9',
    borderRadius: 10,
    marginBottom: 10,
  },
  selectedImage: {
    borderColor: '#667eea',
    backgroundColor: '#f0f4ff',
  },
  imageText: {
    fontSize: 24,
  },
  submitButton: {
    backgroundColor: '#667eea',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  carsList: {
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
  carsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#333',
  },
  carsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  carCard: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  carImage: {
    fontSize: 32,
    marginBottom: 8,
  },
  carMakeModel: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  carPrice: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
  },
});

export default AddCar;