import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'customer';
}

export interface Car {
  id: string;
  make: string;
  model: string;
  costPerDay: number;
  image: string;
}

export interface Booking {
  id: string;
  carId: string;
  car: Car;
  days: number;
  total: number;
  bookingDate: string;
}

interface UserContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  cars: Car[];
  addCar: (car: Omit<Car, 'id'>) => void;
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'bookingDate'>) => void;
  currentBooking: Booking | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const mockUsers: User[] = [
  { id: '1', username: 'admin', password: 'admin123', role: 'admin' },
  { id: '2', username: 'customer', password: 'customer123', role: 'customer' }
];

const carImages = ['🚗', '🏎️', '🚙', '🚕', '🚓', '🚚'];

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [cars, setCars] = useState<Car[]>([
    {
      id: '1',
      make: 'Toyota',
      model: 'Camry',
      costPerDay: 45,
      image: carImages[0]
    },
    {
      id: '2', 
      make: 'Honda',
      model: 'Civic',
      costPerDay: 40,
      image: carImages[1]
    },
    {
      id: '3',
      make: 'BMW',
      model: 'X5',
      costPerDay: 80,
      image: carImages[2]
    }
  ]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);

  const login = (username: string, password: string): boolean => {
    const foundUser = mockUsers.find(u => u.username === username && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  const addCar = (carData: Omit<Car, 'id'>) => {
    const newCar: Car = {
      ...carData,
      id: Date.now().toString()
    };
    setCars(prev => [...prev, newCar]);
  };

  const addBooking = (bookingData: Omit<Booking, 'id' | 'bookingDate'>) => {
    const newBooking: Booking = {
      ...bookingData,
      id: Date.now().toString(),
      bookingDate: new Date().toISOString()
    };
    setBookings(prev => [...prev, newBooking]);
    setCurrentBooking(newBooking);
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      login, 
      logout, 
      cars, 
      addCar, 
      bookings, 
      addBooking, 
      currentBooking 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};