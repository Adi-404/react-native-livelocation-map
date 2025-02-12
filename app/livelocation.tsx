import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, SafeAreaView, TouchableOpacity } from "react-native";
import * as Location from "expo-location";
import { WebView } from "react-native-webview";

function LiveLocationMap() {
    const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null); // Actual location
    const [markerLocation, setMarkerLocation] = useState<{ latitude: number; longitude: number } | null>(null); // Draggable marker location
    const [displayCurrentAddress, setDisplayCurrentAddress] = useState("Fetching location...");
    const [webViewKey, setWebViewKey] = useState(0); // Forces WebView reload

    useEffect(() => {
        checkIfLocationEnabled();
        fetchLiveLocation();
    }, []);

    // ✅ Check if location services are enabled
    const checkIfLocationEnabled = async () => {
        let enabled = await Location.hasServicesEnabledAsync();
        if (!enabled) {
            Alert.alert("Location not enabled", "Please enable your location services.", [
                { text: "OK", onPress: () => console.log("Location Services Off") },
            ]);
        }
    };

    // ✅ Fetch the user's live location
    const fetchLiveLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Permission denied", "Allow the app to use location services.", [
                { text: "OK", onPress: () => console.log("Permission Denied") },
            ]);
            return;
        }

        const { coords } = await Location.getCurrentPositionAsync({});
        if (coords) {
            const { latitude, longitude } = coords;
            setUserLocation({ latitude, longitude }); // Update actual location
            setMarkerLocation({ latitude, longitude }); // Also reset marker to user's location
            console.log(`Live Location -> Latitude: ${latitude}, Longitude: ${longitude}`);

            // Fetch address
            let response = await Location.reverseGeocodeAsync({ latitude, longitude });
            for (let item of response) {
                let address = `${item.name}, ${item.city}, ${item.postalCode}`;
                setDisplayCurrentAddress(address);
            }

            // Reload map
            setWebViewKey(prevKey => prevKey + 1);
        }
    };

    // ✅ Generate dynamic Leaflet Map HTML with a **fixed small circle** for user’s location and **draggable marker**
    const generateMapHTML = (userLat: number, userLng: number, markerLat: number, markerLng: number) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Leaflet Map</title>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
        <style>
            #map { width: 100vw; height: 100vh; }
        </style>
    </head>
    <body>
        <div id="map"></div>
        <script>
            var map = L.map('map').setView([${markerLat}, ${markerLng}], 15);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(map);

            // Small blue circle indicating real user location
            L.circle([${userLat}, ${userLng}], {
                color: 'blue',
                fillColor: '#30f',
                fillOpacity: 0.4,
                radius: 10
            }).addTo(map).bindPopup('Your Actual Location');

            // Draggable marker for custom positioning
            var marker = L.marker([${markerLat}, ${markerLng}], { draggable: true }).addTo(map)
                .bindPopup('Move the marker!')
                .openPopup();

            // Listen for marker movement and update React state
            marker.on('dragend', function (event) {
                var newLat = event.target.getLatLng().lat;
                var newLng = event.target.getLatLng().lng;
                window.ReactNativeWebView.postMessage(JSON.stringify({ latitude: newLat, longitude: newLng }));
            });
        </script>
    </body>
    </html>
  `;

    // ✅ Handle marker updates from WebView
    const handleWebViewMessage = (event: any) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            console.log("New Marker Position:", data);
            setMarkerLocation(data); // Update state with new marker location
        } catch (error) {
            console.log("Error parsing WebView message:", error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.addressContainer}>
                <Text style={styles.addressText}>Your Location:</Text>
                <Text style={styles.address}>{displayCurrentAddress}</Text>

                {markerLocation && (
                    <Text style={styles.latLongText}>
                        📍 Pin Location: {markerLocation.latitude.toFixed(6)}, {markerLocation.longitude.toFixed(6)}
                    </Text>
                )}

                <View style={styles.buttonContainer}>
                    {/* ✅ Fetch new live location (does NOT reset the marker) */}
                    <TouchableOpacity style={styles.refreshButton} onPress={fetchLiveLocation}>
                        <Text style={styles.buttonText}>Refresh</Text>
                    </TouchableOpacity>

                    {/* ✅ Center marker back to the actual user location */}
                    <TouchableOpacity
                        style={styles.centerButton}
                        onPress={() => {
                            if (userLocation) {
                                setMarkerLocation(userLocation); // Reset marker to user's location
                                setWebViewKey(prevKey => prevKey + 1);
                            }
                        }}
                    >
                        <Text style={styles.buttonText}>Center</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.mapContainer}>
                {userLocation && markerLocation ? (
                    <WebView
                        key={webViewKey} // Forces WebView to reload when location updates
                        originWhitelist={["*"]}
                        source={{ html: generateMapHTML(userLocation.latitude, userLocation.longitude, markerLocation.latitude, markerLocation.longitude) }}
                        style={styles.webview}
                        onMessage={handleWebViewMessage} // Listen for marker drag updates
                    />
                ) : (
                    <Text style={styles.loadingText}>Fetching location...</Text>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    addressContainer: {
        padding: 20,
        backgroundColor: "#f8f8f8",
        alignItems: "center",
    },
    addressText: {
        fontSize: 18,
        fontWeight: "bold",
    },
    address: {
        fontSize: 16,
        marginTop: 5,
        textAlign: "center",
    },
    latLongText: {
        fontSize: 14,
        marginTop: 5,
        fontStyle: "italic",
    },
    buttonContainer: {
        flexDirection: "row",
        marginTop: 15,
    },
    refreshButton: {
        padding: 12,
        backgroundColor: "#007AFF",
        borderRadius: 5,
        marginRight: 10,
    },
    centerButton: {
        padding: 12,
        backgroundColor: "#34C759",
        borderRadius: 5,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    mapContainer: {
        flex: 1,
    },
    webview: {
        flex: 1,
    },
    loadingText: {
        textAlign: "center",
        marginTop: 20,
        fontSize: 18,
    },
});

export default LiveLocationMap;