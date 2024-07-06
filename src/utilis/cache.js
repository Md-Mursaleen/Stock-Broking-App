/* eslint-disable prettier/prettier */
import AsyncStorage from '@react-native-async-storage/async-storage';

export const cacheData = async (key, data) => {
    const timestamp = new Date().getTime();
    const value = { data, timestamp };
    await AsyncStorage.setItem(key, JSON.stringify(value));
};

export const getCachedData = async (key, expiryTime) => {
    const value = await AsyncStorage.getItem(key);
    if (!value) {
        return null;
    }
    const { data, timestamp } = JSON.parse(value);
    const now = new Date().getTime();
    if (now - timestamp < expiryTime) {
        return data;
    } else {
        await AsyncStorage.removeItem(key);
        return null;
    }
};

