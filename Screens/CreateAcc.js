import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Button, View, SafeAreaView, Text, Alert, TouchableOpacity, TextInput } from 'react-native';
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';
import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function CreateAccScreen({ route, navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.pageContent}>
        <Text style={styles.pageTxtLarge}>ENTER CREDENTIALS</Text>

        <View style={styles.inputArea}>
          <Text style={styles.loginTxt}>BUSINESS NAME: </Text>
          <TextInput
            multiline={true}
            style={styles.input}
            //onChangeText={onChangeNumber}
            //value={number}
            placeholder=" username "
          />
        </View>
        <View style={styles.inputArea}>
          <Text style={styles.loginTxt}>EMPLOYEER USERNAME: </Text>
          <TextInput
            multiline={true}
            style={styles.input}
            //onChangeText={onChangeNumber}
            //value={number}
            placeholder=" username "
          />
        </View>
        <View style={styles.inputArea}>
          <Text style={styles.loginTxt}>EMPLOYEER PASSWORD: </Text>
          <TextInput
            multiline={true}
            style={styles.input}
            //onChangeText={onChangeNumber}
            //value={number}
            placeholder=" ******"
          />
        </View>
        <View style={styles.inputArea}>
          <Text style={styles.loginTxt}>CONFIRM EMPLOYEER PASSWORD: </Text>
          <TextInput
            multiline={true}
            style={styles.input}
            //onChangeText={onChangeNumber}
            //value={number}
            placeholder=" ******"
          />
        </View>
        <View style={styles.createAccBtn}>
        <Text style={styles.WarningTxt}>YOU WILL HAVE A CHANCE TO SETUP EMPLOYEES LOGIN LATER</Text>

          <TouchableOpacity style={styles.btn2} onPress={() => alert('YOUR MUM')} >
              <Text style={styles.textMedium}>CREATE BUSINESS ACCOUNT</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.createAccOption}>
            <Text style={styles.pageTxt}>ALREADY HAVE AN ACCOUNT?</Text>
            <TouchableOpacity style={styles.btn3} onPress={() => navigation.navigate('Login')}>
              <Text style={styles.textMedium}>LOGIN</Text>
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
  
    textMedium: {
      margin: 10,
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 15
    },
  
    pageTxt: {
      margin: vh(2),
      color: '#000',
      fontWeight: 'bold',
      fontSize: 14,
      textAlign: 'center',
      alignSelf: 'center'
    },

    inputArea: {
      height: vh(4),
      marginVertical: vh(1),
      flexDirection: 'row',
      alignSelf: 'flex-start',
    },

    loginTxt: {
      width: vw(50),
      marginTop: vh(1.5),
      marginHorizontal: vw(1),
      flex: 1,
      color: '#000',
      fontWeight: 'bold',
      fontSize: 12,
      textAlign: 'right',
    },

    input: {
      width: '50%',
      padding: '1%',
      borderBottomWidth: 2,
      borderColor: '#0be',
      maxWidth: 250,
      marginRight: vw(3)
    },
  
  
    pageTxtLarge: {
      marginVertical: vh(3),
      color: '#000',
      fontWeight: 'bold',
      fontSize: 24,
      alignSelf: 'center'
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
      width: '95%',
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

    WarningTxt: {
      margin: vh(2),
      color: '#f22',
      fontWeight: 'bold',
      fontSize: 12,
      textAlign: 'center',
      alignSelf: 'center'
    },
  
    btn3:{
      backgroundColor: '#0be',
      alignSelf: 'center',
      marginHorizontal: 'auto',
      borderRadius: 5,
    },
  
    loginArea:{
      alignSelf: 'center',
      marginTop: vh(35),
      flexDirection: 'row'
    },
  
    createAccOption: {
      marginTop: vh(3),
      alignSelf: 'center',
    },

    createAccBtn: {
      marginTop: vh(16),
      alignSelf: 'center',
    },
  
    container: {
      flex: 1,
      backgroundColor: '#ddd',
      alignItems: 'flex-start',
      flexDirection: 'column'
    },
  
  });
  