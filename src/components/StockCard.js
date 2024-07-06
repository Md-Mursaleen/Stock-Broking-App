/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { normalize } from '../utilis/dimensions';

const StockCard = ({ stock }) => {
    return (
        <View style={styles.cardContainer}>
            <View style={styles.imageContainer}>
                <Image source={{ uri: stock.image }} style={styles.imageStyle} />
            </View>
            <View style={{ marginTop: normalize(15) }}>
                <Text style={styles.nameTextStyle}>{stock.companyName} ({stock.ticker})</Text>
                <View style={styles.infoSubContainer}>
                    <Text style={styles.priceTextStyle}>${stock.price}</Text>
                    <View style={styles.percentageChangeContainer}>
                        <Text style={[styles.percentageChangeTextStyle,
                        { color: parseFloat(stock.priceChangePercentage) > 0 ? '#008000' : '#ff0000' }]}> {parseFloat(stock.priceChangePercentage) > 0 ? '▲' : '▼'}</Text>
                        <Text style={[styles.percentageChangeTextStyle,
                        { color: parseFloat(stock.priceChangePercentage) > 0 ? '#008000' : '#ff0000' }]}>
                            {parseFloat(stock.priceChangePercentage).toFixed(2)}%
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        flex: 1,
        padding: normalize(10),
        margin: normalize(5),
        width: 'auto',
        height: normalize(170),
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e2e2e2',
        borderRadius: 5,
    },
    imageContainer: {
        width: normalize(55),
        height: normalize(55),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#eeeeee',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#d3d3d3',
        borderRadius: 50,
    },
    imageStyle: {
        width: normalize(40),
        height: normalize(40),
        resizeMode: 'contain',
        borderRadius: 50,
    },
    nameTextStyle: {
        marginTop: normalize(-8),
        fontSize: 14,
        fontWeight: '600',
        color: '#000000',
    },
    infoSubContainer: {
        marginTop: normalize(15),
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    priceTextStyle: {
        fontSize: 14,
        fontWeight: '500',
        color: '#000000',
    },
    percentageChangeContainer: {
        right: normalize(5),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    iconTextStyle: {
        fontSize: 14,
        fontWeight: '400',
    },
    percentageChangeTextStyle: {
        fontSize: 14,
        fontWeight: '400',
    },
});

export default StockCard;
