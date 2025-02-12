import * as Location from "expo-location";

// ✅ Fetch user's current location
export const getUserLocation = async (): Promise<{ latitude: number; longitude: number; address: string } | null> => {
    try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            console.warn("Permission to access location was denied");
            return null;
        }

        const { coords } = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = coords;

        let response = await Location.reverseGeocodeAsync({ latitude, longitude });
        let address = response[0]?.formattedAddress || "Unknown Location";

        return { latitude, longitude, address };
    } catch (error) {
        console.error("Error fetching location:", error);
        return null;
    }
};