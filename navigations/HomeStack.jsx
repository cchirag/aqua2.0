import React from 'react'
import {createStackNavigator, CardStyleInterpolators} from '@react-navigation/stack'
import MyCardsScreen from '../screens/MyCardsScreen';
import CreateCardScreen from '../screens/CreateCardScreen';

const Stack = createStackNavigator();

export default HomeStack = () => {
    return(
        <Stack.Navigator screenOptions = {{cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS}}>
            <Stack.Screen name = 'MyCardScreen' component = {MyCardsScreen} options = {{title: "My Stickers"}}></Stack.Screen>
            <Stack.Screen name = 'CreateCardScreen' component = {CreateCardScreen} options = {{title: "Add Sticker"}}></Stack.Screen>
        </Stack.Navigator>
    )
}