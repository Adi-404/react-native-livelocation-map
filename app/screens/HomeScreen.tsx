import React, { useRef, useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { getUserLocation } from "../services/locationService";
import { startSensorListeners } from "../services/sensorService";
import LiveLocationMap from "../components/LiveLocationMap";

export default function HomeScreen() {
    const mapRef = useRef<{ postMessage: (message: string) => void } | null>(null);
    const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number; address: string } | null>(null);
    const [pinLocation, setPinLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [sensorData, setSensorData] = useState<{ accel: any; gyro: any; magnet: any } | null>(null);

    useEffect(() => {
        getUserLocation().then((location) => {
            if (location) {
                console.log("📍 Current User Location:", {
                    latitude: location.latitude,
                    longitude: location.longitude,
                    address: location.address,
                });
                setUserLocation(location);
                setPinLocation(location);
            }
        });

        const stopSensors = startSensorListeners((data) => {
            console.log("📡 Sensor Data Updated:", {
                accel: {
                    x: data.accel.x.toFixed(2),
                    y: data.accel.y.toFixed(2),
                    z: data.accel.z.toFixed(2),
                },
                gyro: {
                    x: data.gyro.x.toFixed(2),
                    y: data.gyro.y.toFixed(2),
                    z: data.gyro.z.toFixed(2),
                },
                magnet: {
                    x: data.magnet.x.toFixed(2),
                    y: data.magnet.y.toFixed(2),
                    z: data.magnet.z.toFixed(2),
                },
            });
            setSensorData(data);
        });

        return () => stopSensors();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.infoContainer}>
                <Text style={styles.title}>📍 Your Location</Text>
                {userLocation ? (
                    <>
                        <Text>🌍 Lat: {userLocation.latitude.toFixed(6)}</Text>
                        <Text>🌎 Lon: {userLocation.longitude.toFixed(6)}</Text>
                        <Text>🏠 Address: {userLocation.address}</Text>
                    </>
                ) : (
                    <Text>Fetching location...</Text>
                )}

                {pinLocation && (
                    <Text>
                        📌 Pin Location: {pinLocation.latitude.toFixed(6)}, {pinLocation.longitude.toFixed(6)}
                    </Text>
                )}
            </View>

            <View style={styles.infoContainer}>
                <Text style={styles.title}>📡 Sensor Data</Text>
                {sensorData ? (
                    <>
                        <Text>📍 Accelerometer: X: {sensorData.accel.x.toFixed(2)}, Y: {sensorData.accel.y.toFixed(2)}, Z: {sensorData.accel.z.toFixed(2)}</Text>
                        <Text>🔄 Gyroscope: X: {sensorData.gyro.x.toFixed(2)}, Y: {sensorData.gyro.y.toFixed(2)}, Z: {sensorData.gyro.z.toFixed(2)}</Text>
                        <Text>🧭 Magnetometer: X: {sensorData.magnet.x.toFixed(2)}, Y: {sensorData.magnet.y.toFixed(2)}, Z: {sensorData.magnet.z.toFixed(2)}</Text>
                    </>
                ) : (
                    <Text>Fetching sensor data...</Text>
                )}
            </View>

            {userLocation && pinLocation && (
                <LiveLocationMap ref={mapRef} userLocation={userLocation} pinLocation={pinLocation} onPinMove={setPinLocation} />
            )}

            <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    if (userLocation) {
                        console.log("📌 Centering Pin to:", {
                            latitude: userLocation.latitude,
                            longitude: userLocation.longitude,
                        });
                        setPinLocation(userLocation);
                        mapRef.current?.postMessage(JSON.stringify(userLocation));
                    }
                }}
            >
                <Text style={styles.buttonText}>📌 Center Pin</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    infoContainer: { padding: 16, backgroundColor: "#f8f8f8", alignItems: "center" },
    title: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
    button: { backgroundColor: "#007AFF", padding: 10, alignSelf: "center", marginVertical: 10 },
    buttonText: { color: "white", fontWeight: "bold" },
});