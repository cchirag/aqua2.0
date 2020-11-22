import React, {useState, useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import AuthStack from './AuthStack';
import auth from '@react-native-firebase/auth';
import HomeStack from './HomeStack';

const Stack = createStackNavigator();

export default AppStack = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    var isMounted = true;
    auth().onAuthStateChanged((user) => {
      if (user) {
        if (isMounted) {
          setIsAuthenticated(true);
        }
      } else {
        if (isMounted) {
          setIsAuthenticated(false);
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  return (
    <Stack.Navigator screenOptions={{header: () => null}}>
      {isAuthenticated ? (
        <Stack.Screen name="HomeStack" component={HomeStack}></Stack.Screen>
      ) : (
        <Stack.Screen name="AuthStack" component={AuthStack}></Stack.Screen>
      )}
    </Stack.Navigator>
  );
};
