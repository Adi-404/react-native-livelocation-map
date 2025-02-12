import { Accelerometer, Gyroscope, Magnetometer } from "expo-sensors";

// ✅ Function to start listening to sensor data
export const startSensorListeners = (
    onUpdate: (data: { accel: any; gyro: any; magnet: any }) => void
) => {
    const sensorData = {
        accel: { x: 0, y: 0, z: 0 },
        gyro: { x: 0, y: 0, z: 0 },
        magnet: { x: 0, y: 0, z: 0 },
    };

    const accelSub = Accelerometer.addListener((data) => {
        sensorData.accel = data;
        onUpdate({ ...sensorData });
    });
    Accelerometer.setUpdateInterval(1000);

    const gyroSub = Gyroscope.addListener((data) => {
        sensorData.gyro = data;
        onUpdate({ ...sensorData });
    });
    Gyroscope.setUpdateInterval(1000);

    const magnetSub = Magnetometer.addListener((data) => {
        sensorData.magnet = data;
        onUpdate({ ...sensorData });
    });
    Magnetometer.setUpdateInterval(1000);

    return () => {
        accelSub.remove();
        gyroSub.remove();
        magnetSub.remove();
    };
};