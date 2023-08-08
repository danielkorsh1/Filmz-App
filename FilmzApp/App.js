import React, { createContext, useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

import LoginScreen from './StartPage/LoginScreen';
import RegistrationScreen from './StartPage/RegistrationScreen';
import LoggedInScreen from './StartPage/LoggedInScreen';
import AboutScreen from './StartPage/About';
import FavoriteScreen from './StartPage/FavoriteScreen';

const AuthenticatedUserContext = createContext(null);

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AuthenticatedUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authenticatedUser) => {
      setUser(authenticatedUser);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthenticatedUserContext.Provider value={{ user }}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
};


const BottomTabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveBackgroundColor: '#268A58',
      tabBarInactiveBackgroundColor: '#696969',
      tabBarActiveTintColor: 'black',
      tabBarInactiveTintColor: 'black',
      tabBarLabelStyle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 2,
        marginTop: 2,
      },
      tabBarStyle: {
        display: 'flex',
      },
    }}
  >
  
    <Tab.Screen
      name="Home"
      component={LoggedInScreen}
      options={{
        tabBarIcon: ({ color }) => (
          <AntDesign name="home" size={24} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Favorites"
      component={FavoriteScreen}
      options={{
        tabBarIcon: ({ color }) => (
          <Fontisto name="like" size={24} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
);

const RootNavigator = () => {
  const { user } = useContext(AuthenticatedUserContext);

  if (user) {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="About"
            component={AboutScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Main"
            component={BottomTabNavigator}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Registration" component={RegistrationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <AuthenticatedUserProvider>
      <RootNavigator />
    </AuthenticatedUserProvider>
  );
};

export default App;
