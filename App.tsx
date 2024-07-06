import React from 'react';
import { LogBox, SafeAreaView, StyleSheet } from 'react-native';
import RootNavigation from './src/navigation/RootNavigation';

LogBox.ignoreAllLogs();

function App() {
  return (
    <SafeAreaView style={styles.container}>
      <RootNavigation />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});

export default App;

//api connect with the explore screen
//serach func if possible
//UI change in product screen
//make a separate api call if required in product screeen to fetch more data about the stocks as in original UI.
