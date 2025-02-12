import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function UIComponent({ location, sensorData, onCenterPress }: { location: any; sensorData: any; onCenterPress: () => void }) {
    return (
        <View style={styles.container}>
            {location && (
                <>
                    <Text style={styles.text}>📍 Pin Location:</Text>
                    <Text style={styles.coords}>Lat: {location.latitude.toFixed(6)}, Long: {location.longitude.toFixed(6)}</Text>
                </>
            )}

            {sensorData && (
                <View style={styles.sensorContainer}>
                    <Text style={styles.text}>📡 Sensor Data:</Text>
                    <Text>Accel: X:{sensorData.accel.x} Y:{sensorData.accel.y} Z:{sensorData.accel.z}</Text>
                    <Text>Gyro: X:{sensorData.gyro.x} Y:{sensorData.gyro.y} Z:{sensorData.gyro.z}</Text>
                    <Text>Magnet: X:{sensorData.magnet.x} Y:{sensorData.magnet.y} Z:{sensorData.magnet.z}</Text>
                </View>
            )}

            {/* Center Button */}
            <TouchableOpacity style={styles.centerButton} onPress={onCenterPress}>
                <Text style={styles.buttonText}>Center</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: "#f8f8f8",
        alignItems: "center",
    },
    text: {
        fontSize: 16,
        fontWeight: "bold",
    },
    coords: {
        fontSize: 14,
        marginBottom: 8,
    },
    sensorContainer: {
        marginTop: 10,
        alignItems: "center",
    },
    centerButton: {
        marginTop: 15,
        padding: 12,
        backgroundColor: "#34C759",
        borderRadius: 5,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});