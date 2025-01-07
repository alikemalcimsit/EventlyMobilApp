import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Login from './screens/Login';
import HomeScreen from './screens/HomeScreen';
import Register from './screens/Register';
import 'react-native-gesture-handler';
import EventDetail from './screens/EventDetail';
import MapScreen from './screens/MapScreen';
import Profile from './screens/Profile';


const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function HomeDrawer() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Drawer.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false }} // Header'ı devre dışı bırak
        drawerStyle={styles.drawerStyle} // Çekmece menüsünün stili
      >
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Register" component={Register} />
        <Drawer.Screen name="EventDetail" component={EventDetail} />
        <Drawer.Screen name="Map" component={MapScreen}/>
        <Drawer.Screen name="Profile" component={Profile}/>


      </Drawer.Navigator>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
   <Stack.Navigator initialRouteName="Login">
  <Stack.Screen name="Login" options={{ headerShown: false }} component={Login} />
  <Stack.Screen name="Home" options={{ headerShown: false }} component={HomeDrawer} />
  <Stack.Screen name="Register" options={{ headerShown: false }} component={Register} />
</Stack.Navigator>

    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  drawerStyle: {
    flex: 1,
    backgroundColor: '#ffffff', // Çekmece menüsünün arka plan rengi
  },
});
