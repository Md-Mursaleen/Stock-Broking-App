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
//tab switching problem
//caching problem