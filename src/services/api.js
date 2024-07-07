/* eslint-disable prettier/prettier */
import { cacheData, getCachedData } from '../utilis/cache';
import { BASE_URL, API_KEY, ALPHA_API_KEY, ALPHA_BASE_URL } from '../utilis/env';
import axios from 'axios';

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
        // const cachedData = await getCachedData(`${ticker}-${interval}`, CACHE_EXPIRY_TIME);
        // if (cachedData) {
        //     return { data: cachedData, fromCache: true };
        // } else {
        const response = await axios.get(`${BASE_URL}symbol=${ticker}&interval=${intervals[interval]}&apikey=${API_KEY}`);
        if (response.data && response.data.values) {
            // await cacheData(`${ticker}-${interval}`, response.data);
            return { data: response.data, fromCache: false };
        } else {
            throw new Error('Invalid data from API');
        }
        // }
    } catch (error) {
        throw error;
    }
};

const fetchData = async (params) => {
    try {
        // const cachedData = await getCachedData(`${params}`, CACHE_EXPIRY_TIME);
        // if (cachedData) {
        //     return { data: cachedData, fromCache: true };
        // } else {
        const response = await axios.get(ALPHA_BASE_URL, {
            params: { ...params, apikey: ALPHA_API_KEY },
        });
        if (response.data) {
            // await cacheData(`${params}`, response.data);
            return { data: response.data, fromCache: false };
        } else {
            throw new Error('Invalid data from API');
        }
        // }
    } catch (error) {
        throw error;
    }
};

export const getCompanyOverview = async (ticker) => {
    const data = await fetchData({ function: 'OVERVIEW', symbol: ticker });
    return data;
};

export const searchStocks = async (query) => {
    const response = await axios.get(ALPHA_BASE_URL, {
        params: {
            function: 'SYMBOL_SEARCH',
            keywords: query,
            apikey: API_KEY,
        },
    });

    const results = response.data.bestMatches.map(stock => ({
        symbol: stock?.['1. symbol'],
        name: stock?.['2. name'],
        type: stock?.['3. type'],
        region: stock?.['4. region'],
        marketOpen: stock?.['5. marketOpen'],
        marketClose: stock?.['6. marketClose'],
        timezone: stock?.['7. timezone'],
        currency: stock?.['8. currency'],
        matchScore: stock?.['9. matchScore'],
    }));
    return results;
};

