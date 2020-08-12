import React, {Component} from 'react';
import {StyleSheet, Text, View, StatusBar} from 'react-native';
import Home from './src/Route'

export default class App extends Component {
  render() {
    return (
      <View style={styles.container}>
         <StatusBar backgroundColor="#f7a63b" barStyle="light-content" />
        <Home/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  }
});
