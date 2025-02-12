import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { View, StyleSheet, Text } from "react-native";
import { WebView } from "react-native-webview";

interface LiveLocationMapProps {
    userLocation: { latitude: number; longitude: number; address: string };
    pinLocation: { latitude: number; longitude: number };
    onPinMove: (location: { latitude: number; longitude: number }) => void;
}

const LiveLocationMap = forwardRef(({ userLocation, pinLocation, onPinMove }: LiveLocationMapProps, ref) => {
    const webViewRef = useRef<WebView>(null);

    useImperativeHandle(ref, () => ({
        postMessage: (message: string) => {
            if (webViewRef.current) {
                webViewRef.current.postMessage(message);
            }
        },
    }));

    // ✅ Ensure userLocation and pinLocation are correctly passed
    console.log("📍 LiveLocationMap - User:", userLocation, "Pin:", pinLocation);

    const generateMapHTML = (userLat: number, userLng: number, pinLat: number, pinLng: number) => `
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
            var map = L.map('map').setView([${pinLat}, ${pinLng}], 15);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(map);

            // Fixed blue circle for user location
            L.circle([${userLat}, ${userLng}], {
                color: 'blue',
                fillColor: '#30f',
                fillOpacity: 0.4,
                radius: 10
            }).addTo(map).bindPopup('Your Actual Location');

            // Draggable marker for pin location
            var marker = L.marker([${pinLat}, ${pinLng}], { draggable: true }).addTo(map)
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

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Live Location Map</Text>
            {userLocation && pinLocation ? (
                <WebView
                    ref={webViewRef}
                    originWhitelist={["*"]}
                    source={{ html: generateMapHTML(userLocation.latitude, userLocation.longitude, pinLocation.latitude, pinLocation.longitude) }}
                    style={styles.webview}
                    onMessage={(event) => {
                        const data = JSON.parse(event.nativeEvent.data);
                        console.log("📍 New Marker Position:", data);
                        onPinMove(data);
                    }}
                />
            ) : (
                <Text style={styles.loadingText}>Loading Map...</Text>
            )}
        </View>
    );
});

export default LiveLocationMap;

const styles = StyleSheet.create({
    container: { flex: 1 },
    title: { fontSize: 18, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
    webview: { flex: 1 },
    loadingText: { textAlign: "center", marginTop: 20, fontSize: 18 },
});