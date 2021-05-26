import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Button, View, SafeAreaView, Text, Alert, TouchableOpacity, TextInput } from 'react-native';
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';
import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';

export default function LoginScreen({navigation}) {
return (
    <View style={styles.container}>
    <View style={styles.pageContent}>
        <Text style={styles.pageTxtLarge}>ENTER CREDENTIALS</Text>
        <View style={styles.inputArea}>
        <Text style={styles.pageTxt}>USERNAME: </Text>
        <TextInput
            multiline={true}
            style={styles.input}
            //onChangeText={onChangeNumber}
            //value={number}
            placeholder="username"
        />
        </View>
        <View style={styles.inputArea}>
        <Text style={styles.pageTxt}>PASSWORD: </Text>
        <TextInput
            multiline={true}
            style={styles.input}
            //onChangeText={onChangeNumber}
            //value={number}
            placeholder="*****"
        />
        </View>
        <View style={styles.loginArea}>
        <TouchableOpacity style={styles.btn1} onPress={() => navigation.navigate('TimeSheet')}  >
            <Text style={styles.textMedium}>EMPLOYEE LOGIN</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn2} onPress={() => navigation.navigate('TimeSheet')} >
            <Text style={styles.textMedium}>EMPLOYEER LOGIN</Text>
        </TouchableOpacity>
        </View>
        <View style={styles.createAccOption}>
            <Text style={styles.pageTxt}>DON'T HAVE AN ACCOUNT?</Text>
            <TouchableOpacity style={styles.btn3} onPress={() => navigation.navigate('CreateAccount')}>
            <Text style={styles.textMedium}>CREATE BUSINESS ACCOUNT</Text>
        </TouchableOpacity >
        </View>
    </View>
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
  
  