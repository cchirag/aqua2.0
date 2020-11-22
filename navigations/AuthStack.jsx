import React from 'react'
import {createStackNavigator, CardStyleInterpolators} from '@react-navigation/stack'
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';

const Stack = createStackNavigator();

export default AuthStack = () => {
    return(
        <Stack.Navigator screenOptions = {{header: () => null, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS}}>
            <Stack.Screen name = 'SignInScreen' component = {SignInScreen}></Stack.Screen>
            <Stack.Screen name = 'SignUpScreen' component = {SignUpScreen}></Stack.Screen>
        </Stack.Navigator>
    )
}