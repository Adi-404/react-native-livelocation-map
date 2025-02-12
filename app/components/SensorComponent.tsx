import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Accelerometer, Gyroscope, Magnetometer } from "expo-sensors";

// ✅ Define the correct type for sensor data
interface SensorData {
    accel: { x: number; y: number; z: number };
    gyro: { x: number; y: number; z: number };
    magnet: { x: number; y: number; z: number };
}

interface SensorComponentProps {
    onSensorUpdate: (data: SensorData) => void;
}

export default function SensorComponent({ onSensorUpdate }: SensorComponentProps) {
    const [sensorData, setSensorData] = useState<SensorData>({
        accel: { x: 0, y: 0, z: 0 },
        gyro: { x: 0, y: 0, z: 0 },
        magnet: { x: 0, y: 0, z: 0 },
    });

    useEffect(() => {
        // ✅ Send sensor data to `HomeScreen.tsx`
        onSensorUpdate(sensorData);
    }, [sensorData, onSensorUpdate]);

    useEffect(() => {
        const accelSub = Accelerometer.addListener(data => {
            setSensorData(prev => ({ ...prev, accel: data }));
        });
        Accelerometer.setUpdateInterval(1000);

        const gyroSub = Gyroscope.addListener(data => {
            setSensorData(prev => ({ ...prev, gyro: data }));
        });
        Gyroscope.setUpdateInterval(1000);

        const magnetSub = Magnetometer.addListener(data => {
            setSensorData(prev => ({ ...prev, magnet: data }));
        });
        Magnetometer.setUpdateInterval(1000);

        return () => {
            accelSub.remove();
            gyroSub.remove();
            magnetSub.remove();
        };
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>📡 Sensor Data</Text>
            <Text>📍 Accelerometer - X: {sensorData.accel.x.toFixed(2)}, Y: {sensorData.accel.y.toFixed(2)}, Z: {sensorData.accel.z.toFixed(2)}</Text>
            <Text>🔄 Gyroscope - X: {sensorData.gyro.x.toFixed(2)}, Y: {sensorData.gyro.y.toFixed(2)}, Z: {sensorData.gyro.z.toFixed(2)}</Text>
            <Text>🧭 Magnetometer - X: {sensorData.magnet.x.toFixed(2)}, Y: {sensorData.magnet.y.toFixed(2)}, Z: {sensorData.magnet.z.toFixed(2)}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 16, backgroundColor: "#f8f8f8", alignItems: "center" },
    title: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
});