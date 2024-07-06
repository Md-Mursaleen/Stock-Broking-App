/* eslint-disable prettier/prettier */
import axios from 'axios';
import { cacheData, getCachedData } from '../utilis/cache';
import { BASE_URL, API_KEY } from '../utilis/env';

const CACHE_EXPIRY_TIME = 1000 * 60 * 5;

export const fetchStockData = async (ticker, interval) => {
    const intervals = {
        '1D': '1day',
        '1W': '1week',
        '1M': '1month',
        '3M': '3month',
        '6M': '6month',
        '1Y': '1year',
    };

    try {
        const cachedData = await getCachedData(`${ticker}-${interval}`, CACHE_EXPIRY_TIME);
        if (cachedData) {
            return { data: cachedData, fromCache: true };
        } else {
            const response = await axios.get(`${BASE_URL}symbol=${ticker}&interval=${intervals[interval]}&apikey=${API_KEY}`);
            await cacheData(`${ticker}-${interval}`, response.data);
            return { data: response.data, fromCache: false };
        }
    } catch (error) {
        throw error;
    }
};
