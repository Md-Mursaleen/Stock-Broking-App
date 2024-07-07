/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Dimensions, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { selectStock } from '../utilis/searchStocks';
import { normalize } from '../utilis/dimensions';
import { LineChart } from 'react-native-chart-kit';
import { fetchStockData } from '../services/api';

const screenWidth = Dimensions.get('window').width;

const ProductScreen = ({ route }) => {
    const { ticker } = route.params;
    const stock = selectStock(ticker);
    const [stockData, setStockData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [interval, setInterval] = useState('1D');

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
                setStockData(data);
                setLoading(false);
            } catch (e) {
                setError(e);
                setLoading(false);
            }
        };
        fetchData();
    }, [ticker, interval]);

    if (loading) {
        return <ActivityIndicator style={styles.loaderStyle} size="large" />;
    }

    if (error) {
        return <Text style={styles.errorTextStyle}>Error fetching data</Text>;
    }

    const chartData = {
        labels: stockData.values.slice([0], [15]).map(value => new Date(value.datetime).getDate()),
        datasets: [
            {
                data: stockData.values.map(value => parseFloat(value.close)),
            },
        ],
    };

    function truncate(string, n) {
        return string?.length > n ? string.substr(0, n - 1) + '..' : string;
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.headerContainer}>
                <View style={styles.headerSubContainer}>
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: stock.image }} style={styles.imageStyle} />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.nameTextStyle}>{stock.companyName.toUpperCase()}</Text>
                        <Text style={styles.tickerTextStyle}>{stock.ticker}, Comman Stock</Text>
                        <Text style={styles.exchangeTextStyle}>{stock.exchange}</Text>
                    </View>
                </View>
                <View>
                    <Text style={styles.priceTextStyle}>${stock.price.toFixed(2)}</Text>
                    <View style={styles.percentageChangeContainer}>
                        <Text style={[styles.percentageChangeTextStyle,
                        { color: parseFloat(stock.priceChangePercentage) > 0 ? '#008000' : '#ff0000' }]}>
                            {parseFloat(stock.priceChangePercentage).toFixed(2)}%
                        </Text>
                        <Text style={[styles.percentageChangeTextStyle,
                        { color: parseFloat(stock.priceChangePercentage) > 0 ? '#008000' : '#ff0000' }]}>
                            {parseFloat(stock.priceChangePercentage) > 0 ? '▲' : '▼'}</Text>
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
                    {Object.keys(intervals).map(key => (
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
                <Text style={styles.textStyle}>About {stock.companyName.toUpperCase()}</Text>
                <Text style={styles.descriptionTextStyle}>{stock.description}</Text>
                <View style={styles.detailsSubContainer}>
                    <View style={styles.detailSubContainer}>
                        <Text style={styles.detailTextStyle}>Industry: {stock.industry}</Text>
                    </View>
                    <View style={styles.detailSubContainer}>
                        <Text style={styles.detailTextStyle}>Sector: {truncate(stock.sector, 15)}</Text>
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
        padding: normalize(10),
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
        fontWeight: '500',
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
});
