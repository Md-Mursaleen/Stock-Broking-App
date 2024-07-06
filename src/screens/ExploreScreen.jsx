/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React, { useEffect, useState } from 'react';
import { StyleSheet, ActivityIndicator, FlatList, Dimensions, RefreshControl } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { stocks } from '../data/stockData';
import { normalize } from '../utilis/dimensions';
import StockCard from '../components/StockCard';

const StockList = ({ data, refreshing, onRefresh }) => (
    <FlatList data={data}
        keyExtractor={(item) => item.ticker}
        renderItem={({ item }) => <StockCard stock={item} />}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={styles.contentContainerStyle}
        refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
    />
);

const ExploreScreen = () => {
    const [index, setIndex] = useState(0);
    const [data, setData] = useState({ gainers: [], losers: [] });
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [routes] = useState([
        { key: 'gainers', title: 'Top Gainers' },
        { key: 'losers', title: 'Top Losers' },
    ]);

    const fetchData = () => {
        setLoading(true);
        let gainers = [];
        let losers = [];
        try {
            stocks.map((item) => {
                if (item.priceChangePercentage > 0) {
                    gainers.push(item);
                } else {
                    losers.push(item);
                }
            });
            setData({ gainers: gainers, losers: losers });
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
        fetchData();
        setRefreshing(false);
    };

    const renderScene = SceneMap({
        gainers: () => (
            <StockList data={data.gainers} refreshing={refreshing} onRefresh={onRefresh} />
        ),
        losers: () => (
            <StockList data={data.losers} refreshing={refreshing} onRefresh={onRefresh} />
        ),
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
                    style={styles.tabStyle} />
            )} style={{ backgroundColor: '#ffffff' }} />
    );
};

const styles = StyleSheet.create({
    contentContainerStyle: {
        paddingVertical: normalize(15),
        paddingHorizontal: normalize(10),
    },
    loadingStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    labelStyle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000000',
    },
    tabStyle: {
        height: normalize(50),
        backgroundColor: '#ffffff',
    },
});

export default ExploreScreen;
