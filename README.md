# 🚗 CarBooking Pro: React Native Rental App

CarBooking Pro is a simple, demo-focused mobile application built with React Native and TypeScript for managing and booking rental cars. It features separate flows for an admin (to add cars to the fleet) and a customer (to rent available cars).

## ✨ Features

* **User Authentication:** Simple demo login for Admin and Customer roles.
* **Admin Functionality (AddCar Screen):**
    * Add new cars to the rental fleet (Make, Model, Cost Per Day, Image).
    * View the current list of all cars in the fleet.
    * Uses a simple scale animation on car submission.
* **Customer Functionality (RentCar Screen):**
    * Browse and select from the available car fleet.
    * Specify the number of rental days.
    * View a price preview (Cost Per Day × Days = Total).
    * **Booking Confirmation Modal:** Animated modal to confirm booking details.
* **Booking Confirmation Screen:** Displays a detailed summary of the confirmed rental with engaging animations (scale, fade, slide).
* **Animations:** Utilizes `Animated` from React Native for engaging UI elements (e.g., floating cars on Login, smooth transitions on Confirmation and Modals).
* **Global State Management:** Uses a `UserContext` (not provided, but inferred from usage) to manage user state, car fleet, and booking data.
* **Navigation:** Uses `@react-navigation/stack` for screen transitions.

## 🚀 Screens & Navigation Flow

| Screen Name | File | Access/Role | Primary Action | Navigation on Success |
| :--- | :--- | :--- | :--- | :--- |
| **Login** | `Login.tsx` | Both | Sign In | Admin: `AddCar` / Customer: `RentCar` |
| **Add Car** | `AddCar.tsx` | Admin | Add Car to Fleet | Stays on screen (shows success alert) |
| **Rent Car** | `RentCar.tsx` | Customer | Book Now (via Modal) | `Confirmation` |
| **Confirmation** | `Confirmation.tsx` | Customer | View Booking Details | `RentCar` (on 'Book Another Car') |

### Demo Credentials

| Role | Username | Password | Starting Screen |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin` | `admin123` | `AddCar` |
| **Customer** | `customer` | `customer123` | `RentCar` |

## 🛠️ Technologies Used

* **React Native**
* **TypeScript**
* `@react-navigation/stack` (Inferred)
* React Native's `Animated` API

## 📝 Setup and Installation

*Steps assume you have Node.js, npm/yarn, and the React Native environment set up.*

1.  **Clone the repository (or set up files):**
    ```bash
    # Assuming you have the surrounding project structure
    # (e.g., a "screens" or "src" folder)
    ```
    * Place `Login.tsx`, `AddCar.tsx`, `RentCar.tsx`, and `Confirmation.tsx` into your screens directory.
    * Ensure your `App.tsx` and `UserContext.tsx` files (not provided, but necessary) are correctly implemented to support the imports.

2.  **Install dependencies:**
    ```bash
    npm install @react-navigation/stack react-native-reanimated react-native-gesture-handler # And other core dependencies
    # or
    yarn add @react-navigation/stack react-native-reanimated react-native-gesture-handler
    ```
    *Note: `react-native-reanimated` may require additional setup for the new architecture.*

3.  **Run the application:**
    ```bash
    npx react-native run-android
    # or
    npx react-native run-ios
    ```

## 📂 Project Structure (Inferred)
