/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React, { useEffect, useState } from 'react';
import { StyleSheet, ActivityIndicator, FlatList, Dimensions, RefreshControl } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { stocks } from '../data/stockData';
import { normalize } from '../utilis/dimensions';
import StockCard from '../components/StockCard';

const TopGainers = ({ data, refreshing, onRefresh }) => (
    <FlatList data={data}
        keyExtractor={(item) => item.ticker}
        renderItem={({ item }) => <StockCard stock={item} />}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={styles.gridContainerStyle}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} />
);

const TopLosers = ({ data, refreshing, onRefresh }) => (
    <FlatList data={data}
        keyExtractor={(item) => item.ticker}
        renderItem={({ item }) => <StockCard stock={item} />}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={styles.gridContainerStyle}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} />
);

const ExploreScreen = () => {
    const [index, setIndex] = useState(0);
    const [data] = useState({ Gainers: [], Losers: [] });
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [routes] = useState([
        { key: 'Gainers', title: 'Top Gainers' },
        { key: 'Losers', title: 'Top Losers' },
    ]);

    const fetchData = async () => {
        setLoading(true);
        try {
            stocks.map((item) => {
                if (item.priceChangePercentage > 0) {
                    data.Gainers.push(item);
                }
                else {
                    data.Losers.push(item);
                }
            });
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchData().then(() => setRefreshing(false));
    };

    const renderScene = SceneMap({
        Gainers: () => <TopGainers data={data.Gainers} refreshing={refreshing} onRefresh={onRefresh} />,
        Losers: () => <TopLosers data={data.Losers} refreshing={refreshing} onRefresh={onRefresh} />,
    });

    if (loading) {
        return <ActivityIndicator style={styles.loadingStyle} size="large" />;
    }

    return (
        <TabView navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: Dimensions.get('window').width }}
            renderTabBar={props => (
                <TabBar {...props}
                    labelStyle={styles.labelStyle}
                    indicatorStyle={{ backgroundColor: 'trainsparent' }}
                    style={{ backgroundColor: '#ffffff' }} />
            )} style={{ backgroundColor: '#ffffff' }} />
    );
};

const styles = StyleSheet.create({
    loadingStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    gridContainerStyle: {
        paddingVertical: normalize(15),
        paddingHorizontal: normalize(10),
    },
    labelStyle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000000',
    },
});

export default ExploreScreen;
