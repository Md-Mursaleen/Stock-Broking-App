# Stock Viewer App

This is a React Native application that allows users to view stock data fetched from the Alpha Vantage API. It includes a product screen where users can search for stocks by symbol and view detailed information about each stock.

## Features

- **Product Screen**: Displays stock data including symbol, price, and other relevant information.
- **Search Functionality**: Users can search for stocks using the Alpha Vantage API by entering the stock symbol.
- **Detailed Stock Information**: Provides detailed information for each stock, such as open price, high price, low price, and current price.

## Screenshots

Include screenshots or GIFs demonstrating your application in this section.

## Installation

To run this application locally, follow these steps:

1. Clone the repository: `git clone https://github.com/your-username/stock-viewer-app.git`
2. Navigate into the project directory: `cd stock-viewer-app`
3. Install dependencies: `npm install` or `yarn install`
4. Start the Metro bundler: `npm start` or `yarn start`
5. Run the application on Android or iOS:
   - Android: `npm run android` or `yarn android`
   - iOS: `npm run ios` or `yarn ios`

## Configuration

Before running the application, make sure to configure your Alpha Vantage API key in the source code.

1. Obtain an API key from Alpha Vantage: [Alpha Vantage API](https://www.alphavantage.co/support/#api-key)
2. Replace `YOUR_API_KEY` in `src/api/StockService.js` with your actual API key.

```javascript
const API_KEY = 'YOUR_API_KEY';
