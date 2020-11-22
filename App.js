import { NavigationContainer } from '@react-navigation/native';
import React from 'react'
import { StatusBar, StyleSheet, Text, View } from 'react-native'
import 'react-native-gesture-handler';
import RootStack from './navigations/RootStack';
import theme from './theme.json'

const App = () => {
  return (
    <NavigationContainer>
      <StatusBar backgroundColor = {theme.black} ></StatusBar>
      <RootStack></RootStack>
    </NavigationContainer>

  )
}

export default App

const styles = StyleSheet.create({})

