/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Dimensions, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { selectStock } from '../utilis/searchStocks';
import { normalize } from '../utilis/dimensions';
import { LineChart } from 'react-native-chart-kit';
import { fetchStockData, getCompanyOverview } from '../services/api';

const screenWidth = Dimensions.get('window').width;

const ProductScreen = ({ route }) => {
    const { ticker } = route.params;
    const stock = selectStock(ticker);
    const [stockData, setStockData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [interval, setInterval] = useState('1D');
    const [companyData, setCompanyData] = useState(null);

    const intervals = {
        '1D': '1day',
        '1W': '1week',
        '1M': '1month',
        '3M': '3month',
        '6M': '6month',
        '1Y': '1year',
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const { data } = await fetchStockData(ticker, interval);
                if (data && data.values) {
                    setStockData(data);
                } else {
                    setError(new Error('No stock data available'));
                }
            } catch (e) {
                setError(e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [ticker, interval]);

    useEffect(() => {
        const fetchCompanyData = async () => {
            setLoading(true);
            try {
                const { data } = await getCompanyOverview(ticker);
                if (data) {
                    setCompanyData(data);
                } else {
                    setError(new Error('No company data available'));
                }
            } catch (e) {
                setError(e);
            } finally {
                setLoading(false);
            }

        };
        fetchCompanyData();
    }, [ticker]);

    if (loading) {
        return <ActivityIndicator style={styles.loaderStyle} size="large" />;
    }

    if (error) {
        return <Text style={styles.errorTextStyle}>Error fetching data</Text>;
    }

    let startIndex = 0;
    let endIndex = stockData?.values?.length > 10 ? 10 : stockData?.values?.length;

    const chartData = {
        labels: stockData?.values?.length > 0 ? stockData?.values?.slice([startIndex], [endIndex]).map(value => new Date(value.datetime).getDate()) : [],
        datasets: [
            {
                data: stockData?.values?.length > 0 ? stockData?.values?.map(value => parseFloat(value?.close)) : [],
            },
        ],
    };

    function truncate(string, n) {
        return string?.length > n ? string.substr(0, n - 1) + '..' : string;
    }

    const cryptoMarketCap = (market_cap) => {
        if (market_cap > 1e12) {
            return `${(market_cap / 1e12).toFixed(2)} Tn`;
        }
        if (market_cap > 1e9) {
            return `${(market_cap / 1e9).toFixed(2)} Bn`;
        }
        if (market_cap > 1e6) {
            return `${(market_cap / 1e6).toFixed(2)} Mn`;
        }
        if (market_cap > 1e3) {
            return `${(market_cap / 1e3).toFixed(2)} K`;
        }
        return market_cap;
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.headerContainer}>
                <View style={styles.headerSubContainer}>
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: stock?.image }} style={styles.imageStyle} />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.nameTextStyle}>{stock?.companyName.toUpperCase()}</Text>
                        <Text style={styles.tickerTextStyle}>{stock?.ticker}, {companyData?.AssetType}</Text>
                        <Text style={styles.exchangeTextStyle}>{stock?.exchange}</Text>
                    </View>
                </View>
                <View>
                    <Text style={styles.priceTextStyle}>${stock?.price.toFixed(2)}</Text>
                    <View style={styles.percentageChangeContainer}>
                        <Text style={[styles.percentageChangeTextStyle,
                        { color: parseFloat(stock?.priceChangePercentage) > 0 ? '#008000' : '#ff0000' }]}>
                            {parseFloat(stock?.priceChangePercentage).toFixed(2)}%
                        </Text>
                        <Text style={[styles.percentageChangeTextStyle,
                        { color: parseFloat(stock?.priceChangePercentage) > 0 ? '#008000' : '#ff0000' }]}>
                            {parseFloat(stock?.priceChangePercentage) > 0 ? '▲' : '▼'}</Text>
                    </View>
                </View>
            </View>
            <View style={styles.lineChartContainer}>
                <LineChart data={chartData}
                    width={screenWidth - 40}
                    height={260}
                    yAxisLabel="$"
                    chartConfig={{
                        backgroundColor: '#ffffff',
                        backgroundGradientFrom: '#ffffff',
                        backgroundGradientTo: '#ffffff',
                        decimalPlaces: 2,
                        color: (opacity = 1) => `rgba(108, 122, 137, ${opacity})`,
                        labelColor: () => '#000000',
                        propsForDots: {
                            r: '0',
                            strokeWidth: '2',
                            stroke: '#ffffff',
                        },
                        propsForBackgroundLines: {
                            strokeDasharray: '',
                        },
                    }}
                    bezier
                    style={{ marginVertical: normalize(10) }} />
                <View style={styles.filterContainer}>
                    {Object?.keys(intervals).map(key => (
                        <TouchableOpacity key={key} onPress={() => setInterval(key)}
                            style={[styles.filterButtonContainer,
                            interval === key ? { backgroundColor: '#a9613b' } : null]}>
                            <Text style={[{ color: '#000000' }, interval === key ?
                                { color: '#ffffff' } : null]}>{key}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
            <View style={styles.detailsContainer}>
                <Text style={styles.textStyle}>About {stock?.companyName.toUpperCase()}</Text>
                <Text style={styles.descriptionTextStyle}>{companyData?.Description}</Text>
                <View style={styles.detailsSubContainer}>
                    <View style={styles.detailSubContainer}>
                        <Text style={styles.detailTextStyle}>Industry: {truncate(companyData?.Industry, 15)}</Text>
                    </View>
                    <View style={styles.detailSubContainer}>
                        <Text style={styles.detailTextStyle}>Sector: {truncate(companyData?.Sector, 10)}</Text>
                    </View>
                </View>
                <View style={[styles.detailsBottomContainer, { justifyContent: 'space-between' }]}>
                    <View style={[styles.bottomSubContainer, { alignItems: 'flex-start' }]}>
                        <Text style={styles.keyTextStyle}>52 Week Low</Text>
                        <Text style={styles.valueTextStyle}>${companyData?.['52WeekLow']}</Text>
                    </View>
                    <View style={styles.lineContainer}>
                        <View style={styles.lineStyle} />
                    </View>
                    <View style={[styles.bottomSubContainer, { alignItems: 'flex-end' }]}>
                        <Text style={styles.keyTextStyle}>52 Week High</Text>
                        <Text style={styles.valueTextStyle}>${companyData?.['52WeekHigh']}</Text>
                    </View>
                </View>
                <View style={[styles.detailsBottomContainer, { marginHorizontal: normalize(0) }]}>
                    <View style={styles.bottomSubContainer}>
                        <Text style={styles.keyTextStyle}>Market Cap | </Text>
                        <Text style={styles.valueTextStyle}>
                            ${cryptoMarketCap(Number(companyData?.MarketCapitalization))}</Text>
                    </View>
                    <View style={styles.bottomSubContainer}>
                        <Text style={styles.keyTextStyle}> P/E Ratio | </Text>
                        <Text style={styles.valueTextStyle}>{companyData?.PERatio}</Text>
                    </View>
                    <View style={styles.bottomSubContainer}>
                        <Text style={styles.keyTextStyle}> Beta | </Text>
                        <Text style={styles.valueTextStyle}>{companyData?.Beta}</Text>
                    </View>
                    <View style={styles.bottomSubContainer}>
                        <Text style={styles.keyTextStyle}> Divid. Yield | </Text>
                        <Text style={styles.valueTextStyle}>{companyData?.DividendYield}%</Text>
                    </View>
                    <View style={styles.bottomSubContainer}>
                        <Text style={styles.keyTextStyle}> Profit Margin</Text>
                        <Text style={styles.valueTextStyle}>{companyData?.ProfitMargin}</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

export default ProductScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    headerContainer: {
        marginHorizontal: normalize(10),
        marginTop: normalize(30),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerSubContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    imageContainer: {
        width: normalize(60),
        height: normalize(60),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#eeeeee',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#eeeeee',
        borderRadius: 50,
    },
    imageStyle: {
        width: normalize(40),
        height: normalize(40),
        resizeMode: 'contain',
        borderRadius: 50,
    },
    textContainer: {
        marginLeft: normalize(15),
        flexDirection: 'column',
    },
    nameTextStyle: {
        fontSize: 14.5,
        fontWeight: '600',
        color: '#000000',
    },
    tickerTextStyle: {
        fontSize: 12,
        fontWeight: '500',
        color: '#000000',
    },
    exchangeTextStyle: {
        fontSize: 11,
        fontWeight: '700',
        color: '#a9613b',
    },
    priceTextStyle: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#000000',
    },
    percentageChangeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    iconTextStyle: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    percentageChangeTextStyle: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    lineChartContainer: {
        padding: normalize(10),
        marginHorizontal: normalize(10),
        marginTop: normalize(15),
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#000000',
        borderRadius: 8,
    },
    detailsContainer: {
        paddingHorizontal: normalize(11),
        paddingVertical: normalize(13),
        marginHorizontal: normalize(10),
        marginVertical: normalize(20),
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#000000',
        borderRadius: 8,
        overflow: 'hidden',
    },
    textStyle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#000000',
    },
    descriptionTextStyle: {
        marginTop: normalize(5),
        fontSize: 12,
        fontWeight: '400',
        color: '#000000',
    },
    detailsSubContainer: {
        marginTop: normalize(18),
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    detailSubContainer: {
        padding: normalize(14),
        width: 'auto',
        height: 'auto',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ecd2c3',
        borderRadius: 30,
    },
    detailTextStyle: {
        fontSize: 12,
        fontWeight: '500',
        color: '#a9613b',
    },
    filterContainer: {
        marginBottom: normalize(10),
        flexDirection: 'row',
        justifyContent: 'center',
    },
    filterButtonContainer: {
        padding: normalize(8),
        marginHorizontal: normalize(4),
        borderWidth: 1,
        borderColor: '#cccccc',
        borderRadius: 4,
    },
    loaderStyle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorTextStyle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ff0000',
    },
    detailsBottomContainer: {
        marginHorizontal: normalize(5),
        marginTop: normalize(30),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    bottomSubContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
    },
    keyTextStyle: {
        fontSize: 14,
        fontWeight: '500',
        color: '#808080',
    },
    valueTextStyle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#000000',
    },
    lineContainer: {
        flex: 1,
        position: 'relative',
        width: '100%',
        height: 0,
    },
    lineStyle: {
        position: 'absolute',
        top: '50%',
        width: '100%',
        height: normalize(4),
        backgroundColor: '#808080',
    },
});
