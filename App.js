import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Image, View, Text, TouchableOpacity} from 'react-native';
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';
import { NavigationContainer, useRoute } from '@react-navigation/native';
import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import  CreateAccScreen  from './Screens/CreateAcc';
import  LoginScreen  from './Screens/Login';
import  TimeSheetScreen  from './Screens/TimeSheet';
import  AdminHomeScreen from './Screens/AdminHome';
import  UserHomeScreen from './Screens/UserHome';
import  CreateEmployeeAccScreen from './Screens/CreateEmployeeAcc';
import logo from './assets/JPMLogo.png'; 
import { AntDesign } from '@expo/vector-icons';

import "firebase/auth";
import "firebase/database";
import firebase from 'firebase/app'

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
      screenOptions={{ 
        width: '100%',
        headerRight: () => <JPMIcon />,
        headerStyle: {
          backgroundColor: '#0be',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          color: '#0be',
          backgroundColor: 'white',
          borderRadius: 8,
          paddingVertical: 9,
          paddingHorizontal: 15,
          alignSelf: 'center',
          marginLeft: '15%',
          width: 'auto',
  
          shadowColor: '#171717',
          shadowOffset: {width: -2, height: 4},
          shadowOpacity: 0.2,
          shadowRadius: 3,
          elevation: 6
        }
        }}>
        <Stack.Screen name="Login" component={LoginScreen} 
        options={{ title: 'Login'}}/>
        <Stack.Screen name="CreateAccount" component={CreateAccScreen} 
        options={{ title: 'Create account'}}/>
        <Stack.Screen name="UserHome" component={UserHomeScreen} 
        options={{ title: 'Home'}}/>
        <Stack.Screen name="TimeSheet" component={TimeSheetScreen} 
        options={{ title: 'Time-Sheet'}}/>
        <Stack.Screen name="AdminHome" component={AdminHomeScreen} 
        options={{ title: 'Admin Home'}}/>
        <Stack.Screen name="CreateEmployeeAcc" component={CreateEmployeeAccScreen} 
        options={{ title: 'Create account'}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export function JPMIcon()
{
  console.log(useRoute().name)
  return(
    <View style={{width: 80}}>
      <Image source={logo} 
        style={{
          alignSelf: 'flex-end',
          marginRight: '15%',
          resizeMode: 'contain', 
          width: '60%',
          //marginLeft: (useRoute.name == 'Login') ? '3%' : '30',
          }} /> 
    </View>
  );
}

const styles = StyleSheet.create({


  textExtraLarge: {
    margin: vh(1),
    marginTop: vh(5),
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 25
  },

  textLarge: {
    margin: vh(1),
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20
  },

  input: {
    width: '50%',
    alignContent: 'center',
    padding: '1%',
    borderBottomWidth: 2,
    borderColor: '#00bbee'
  },

  textMedium: {
    margin: 10,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15
  },

  pageTxt: {
    margin: vh(0.7),
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
    alignSelf: 'center'
  },

  pageTxtLarge: {
    marginVertical: vh(3),
    color: '#000',
    fontWeight: 'bold',
    fontSize: 24,
    alignSelf: 'center'
  },
  
  inputArea: {
    margin: vh(1),
    alignSelf: 'center',
    flexDirection: 'row'
  },

  header: {
    backgroundColor: '#0be',
    marginHorizontal: 'auto',
    alignSelf: 'center',
    alignItems: 'center',
    width: '100%'
  },
  pageContent:{
    padding: vh(1),
    flex: 1,
    backgroundColor: '#fff',
    marginVertical: vh(2),
    marginHorizontal: '25%',
    width: '90%',
    maxWidth: 800,
    alignSelf: 'center',
    borderRadius: 5,
    flexDirection: 'column',

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 6.27,
    
    elevation: 10,
  },

  btn1:{
    margin: '2%',
    backgroundColor: '#0be',
    borderRadius: 5,
    alignSelf: 'center',
  },

  btn2:{
    margin: '2%',
    backgroundColor: '#0be',
    borderRadius: 5,
    alignSelf: 'center',
  },

  btn3:{
    backgroundColor: '#0be',
    alignSelf: 'flex-end',
    marginHorizontal: 'auto',
    borderRadius: 5,
  },

  loginArea:{
    alignSelf: 'center',
    marginTop: vh(35),
    alignContent: 'center',
    flexDirection: 'row'
  },

  createAccOption: {
    marginTop: vh(5),
    alignSelf: 'center',
  },

  container: {
    flex: 1,
    backgroundColor: '#ddd',
    alignItems: 'flex-start',
    flexDirection: 'column'
  },

});
