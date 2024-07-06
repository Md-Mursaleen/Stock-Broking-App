/* eslint-disable prettier/prettier */
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_KEY = 'K4Z2AG9I2IIPBABK';
const CLEARBIT_LOGO_URL = 'https://logo.clearbit.com/';
const CLEARBIT_COMPANY_SEARCH_URL = 'https://autocomplete.clearbit.com/v1/companies/suggest?query=';

const fetchData = async (params) => {
    const cacheKey = `${params.function}-${params.symbol || ''}`;
    const cachedResponse = await AsyncStorage.getItem(cacheKey);

    if (cachedResponse) {
        return JSON.parse(cachedResponse);
    }

    try {
        const response = await axios.get('https://www.alphavantage.co/query', {
            params: { ...params, apikey: API_KEY },
        });

        await AsyncStorage.setItem(cacheKey, JSON.stringify(response.data));
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const getCompanyLogo = async (ticker) => {
    try {
        const response = await axios.get(`${CLEARBIT_COMPANY_SEARCH_URL}${ticker}`);
        if (response.data && response.data.length > 0) {
            const company = response.data[0];
            return `${CLEARBIT_LOGO_URL}${company.domain}`;
        }
    } catch (error) {
        console.error('Logo fetch error:', error);
    }
    return 'https://via.placeholder.com/40';
};

const getCompanyOverview = async (ticker) => {
    const data = await fetchData({ function: 'OVERVIEW', symbol: ticker });
    return {
        name: data.Name,
        logo_url: await getCompanyLogo(ticker),
    };
};

export const getTopGainersLosers = async () => {
    const data = await fetchData({ function: 'TOP_GAINERS_LOSERS' });
    const topGainers = data.top_gainers.map(async (stock) => {
        const overview = await getCompanyOverview(stock.ticker);
        return {
            ...stock,
            ...overview,
        };
    });
    const topLosers = data.top_losers.map(async (stock) => {
        const overview = await getCompanyOverview(stock.ticker);
        return {
            ...stock,
            ...overview,
        };
    });

    return {
        top_gainers: await Promise.all(topGainers),
        top_losers: await Promise.all(topLosers),
    };


};

