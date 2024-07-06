/* eslint-disable prettier/prettier */
import { stocks, stockPrices } from '../data/stockData';

export const selectStock = (text) => {
  const stock = stocks.filter((i) => i.ticker === text);
  if (stock) {
    return stock[0];
  }
  return null;
};

export const selectStockPrices = (text) => {
  const stock = stockPrices.filter((i) => i.ticker === text);
  if (stock) {
    return stock[0].prices;
  }
  return null;
};
