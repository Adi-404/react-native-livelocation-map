import React, { useEffect, useState } from "react";
import { WebView } from "react-native-webview";

interface MapProps {
    userLocation: { latitude: number; longitude: number };
    pinLocation: { latitude: number; longitude: number };
    onPinMove: (location: { latitude: number; longitude: number }) => void;
}

export default function MapComponent({ userLocation, pinLocation, onPinMove }: MapProps) {
    const [webViewKey, setWebViewKey] = useState(0);

    useEffect(() => {
        setWebViewKey(prev => prev + 1); // Reload map on location change
    }, [userLocation, pinLocation]);

    const generateMapHTML = (userLat: number, userLng: number, pinLat: number, pinLng: number) => `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Leaflet Map</title>
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
            <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
            <style>#map { width: 100vw; height: 100vh; }</style>
        </head>
        <body>
            <div id="map"></div>
            <script>
                var map = L.map('map').setView([${pinLat}, ${pinLng}], 15);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap contributors' }).addTo(map);

                L.circle([${userLat}, ${userLng}], { color: 'blue', fillColor: '#30f', fillOpacity: 0.4, radius: 10 }).addTo(map);

                var marker = L.marker([${pinLat}, ${pinLng}], { draggable: true }).addTo(map);
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
        <WebView
            key={webViewKey}
            originWhitelist={["*"]}
            source={{ html: generateMapHTML(userLocation.latitude, userLocation.longitude, pinLocation.latitude, pinLocation.longitude) }}
            onMessage={event => onPinMove(JSON.parse(event.nativeEvent.data))}
        />
    );
}