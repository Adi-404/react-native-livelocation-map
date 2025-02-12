# IMU Sensor & Live Location Tracker

This is an [Expo](https://expo.dev) React Native project that integrates IMU sensors (Accelerometer, Gyroscope, Magnetometer) and live location tracking with a movable pin on a Leaflet map.

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/yourproject.git
   cd yourproject
   ```

2. Install dependencies (**use `--legacy-peer-deps` to avoid dependency conflicts**):
   ```bash
   npm install --legacy-peer-deps
   ```
   or if using Yarn:
   ```bash
   yarn install
   ```

## 🚀 Running the App

1. Start the Metro bundler:
   ```bash
   npx expo start
   ```

2. Run the app on an Android device/emulator:
   ```bash
   yarn android
   ```
   or using npm:
   ```bash
   npx expo run:android
   ```

## 🛠 Features

- **Live Location Tracking** 📍
- **Movable Map Pin** to adjust coordinates 🗺️
- **IMU Sensor Data** (Accelerometer, Gyroscope, Magnetometer) 📡
- **Dynamic UI Updates** for real-time sensor readings

## 📂 Project Structure

```
project-root/
│── app/
│   ├── components/   # UI components (Map, Sensors, etc.)
│   ├── services/     # Location & Sensor logic
│   ├── screens/      # HomeScreen and other screens
│── android/          # Android native code
│── package.json      # Project dependencies
│── README.md         # Project documentation
```

## 🛠 Development Notes
- Ensure Android Emulator has location enabled for testing.
- If dependencies cause issues, use:
  ```bash
  npm install --legacy-peer-deps
  ```
- Use Expo Go or a physical device for real-time sensor readings.

## 🤝 Contributing
- Fork the repo 🍴
- Create a new branch 🔀
- Commit your changes ✅
- Submit a pull request 🚀

## 📜 License
MIT License © 2025 

## 👨🏽‍💻 Author
- Adinm 

---
Happy Coding! 🚀