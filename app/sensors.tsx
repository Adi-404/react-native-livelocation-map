import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Accelerometer, Gyroscope, Magnetometer } from 'expo-sensors';

export default function TestSensor() {
    const [accelerometerData, setAccelerometerData] = useState({ x: 0, y: 0, z: 0 });
    const [gyroscopeData, setGyroscopeData] = useState({ x: 0, y: 0, z: 0 });
    const [magnetometerData, setMagnetometerData] = useState({ x: 0, y: 0, z: 0 });

    useEffect(() => {
        // Accelerometer subscription
        const accelerometerSubscription = Accelerometer.addListener(data => {
            setAccelerometerData(data);
        });
        Accelerometer.setUpdateInterval(1000);

        // Gyroscope subscription
        const gyroscopeSubscription = Gyroscope.addListener(data => {
            setGyroscopeData(data);
        });
        Gyroscope.setUpdateInterval(1000);

        // Magnetometer subscription
        const magnetometerSubscription = Magnetometer.addListener(data => {
            setMagnetometerData(data);
        });
        Magnetometer.setUpdateInterval(1000);

        // Cleanup subscriptions
        return () => {
            accelerometerSubscription && accelerometerSubscription.remove();
            gyroscopeSubscription && gyroscopeSubscription.remove();
            magnetometerSubscription && magnetometerSubscription.remove();
        };
    }, []);

    interface SensorData {
        x: number;
        y: number;
        z: number;
    }

    const formatData = (data: SensorData): { x: string; y: string; z: string } => ({
        x: data.x?.toFixed(2) || '0.00',
        y: data.y?.toFixed(2) || '0.00',
        z: data.z?.toFixed(2) || '0.00',
    });

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.sensorContainer}>
                <Text style={styles.title}>Accelerometer:</Text>
                <Text>x: {formatData(accelerometerData).x}</Text>
                <Text>y: {formatData(accelerometerData).y}</Text>
                <Text>z: {formatData(accelerometerData).z}</Text>
            </View>
            <View style={styles.sensorContainer}>
                <Text style={styles.title}>Gyroscope:</Text>
                <Text>x: {formatData(gyroscopeData).x}</Text>
                <Text>y: {formatData(gyroscopeData).y}</Text>
                <Text>z: {formatData(gyroscopeData).z}</Text>
            </View>
            <View style={styles.sensorContainer}>
                <Text style={styles.title}>Magnetometer:</Text>
                <Text>x: {formatData(magnetometerData).x}</Text>
                <Text>y: {formatData(magnetometerData).y}</Text>
                <Text>z: {formatData(magnetometerData).z}</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f9f9f9',
    },
    sensorContainer: {
        marginBottom: 24,
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
});