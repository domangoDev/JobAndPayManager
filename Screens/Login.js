import { StatusBar } from 'expo-status-bar';
import React , { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';
import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler';
import firebase from 'firebase/app'

import "firebase/auth";
import "firebase/database";
//import "firebase/firestore";
//import "firebase/functions";
//import "firebase/storage";

import {GetUserData, UpdateUserData} from './UserData';

const firebaseConfig = {
  apiKey: 'AIzaSyD1p6ZBUPwpfECpebdSqgL7depJylewTrk',
  authDomain: 'job-and-pay-manager-default-rtdb.firebaseio.com',
  databaseURL: 'https://job-and-pay-manager-default-rtdb.firebaseio.com/',
  projectId: 'job-and-pay-manager',
  storageBucket: 'job-and-pay-manager.appspot.com',
  messagingSenderId: 'sender-id',
  appId: 'job-and-pay-manager',
  measurementId: 'G-measurement-id',
};

//firebase.initializeApp(firebaseConfig);

export default function LoginScreen({navigation}) {

  useEffect(() => { 
    if(firebase.apps.length === 0) firebase.initializeApp(firebaseConfig);
  }, []);

  const [email, setEmail] = useState(' ');
  const [password, setPassword] = useState(' ');
  const [loading, setLoading] = useState(false);

return (
    <View style={styles.container}>
    <View style={styles.pageContent}>
        <Text style={styles.pageTxtLarge}>ENTER CREDENTIALS</Text>
        <View style={styles.inputArea}>
          <Text style={styles.pageTxt}>Email: </Text>
          <TextInput
              value={email}
              style={styles.input}
              onChangeText={text => setEmail(text)}
              placeholder="user@domain.com"
          />
        </View>
        <View style={styles.inputArea}>
          <Text style={styles.pageTxt}>Password: </Text>
          <TextInput
              value={password}
              style={styles.input}
              onChangeText={text => setPassword(text)}
              secureTextEntry
              placeholder="*******"
          />
        </View>
        <View style={styles.loginArea}>
        <TouchableOpacity style={styles.btn1} onPress={() => loginWithCreds()}  >
            <Text style={styles.textMedium}>Login</Text>
        </TouchableOpacity>
        </View>
        <View style={[{marginTop: vh(4)}]}>
          <ActivityIndicator color='#0be' animating={loading} size="large" />
        </View>
        <View style={[styles.createAccOption, {marginTop: '20%'}]}>
          <Text style={styles.pageTxt}>Don't have an employee account?</Text>
          <TouchableOpacity style={styles.btn3} onPress={() => navigation.navigate('CreateEmployeeAcc')}>
            <Text style={styles.textMedium}>Create Employee Account</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.createAccOption, {marginTop: '10%'}]}>
          <Text style={styles.pageTxt}>Don't have a business account?</Text>
          <TouchableOpacity style={styles.btn3} onPress={async () => GoToCreateAcc()}>
            <Text style={styles.textMedium}>Create Business Account</Text>
          </TouchableOpacity >
        </View>
        <View style={styles.createAccOption}>

        </View>
    </View>
    </View>
    );

    async function GoToCreateAcc()
    {
      navigation.navigate('CreateAccount')
    }
    
    async function loginWithCreds()
    {
      if(email.length < 5) Alert.alert("Invalid Email Address", "Please enter a valid email address");
      else if(password.length < 4) Alert.alert("Invalid Password", "Please enter a valid passsword");
      else
      {
        setLoading(true);
        let failed = false;
        firebase.auth().signInWithEmailAndPassword(email, password)
        .catch(error =>{
          failed = true;
          Alert.alert("Sign In Failed", "Please ensure you are entering the correct email and password")
          }).then(() => {
          if(!failed)
          {
            UpdateUserData(firebase.auth().currentUser.uid);
            firebase.database().ref('users/' + firebase.auth().currentUser.uid).on('value', (snapshot) => {
              setEmail('');
              setPassword('');
              if(snapshot.val()) navigation.navigate('UserHome');
              else navigation.navigate('AdminHome')
            });

          }
          setLoading(false);
  
        })
      }
  }
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
      width: '60%',
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
      alignSelf: 'flex-end',
      marginRight: '15%',
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
      padding: 3,
      margin: '1%',
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
      marginTop: vh(6),
      alignContent: 'center',
      flexDirection: 'row'
    },
  
    createAccOption: {
      marginTop: vh(1),
      alignSelf: 'center',
    },
  
    container: {
      flex: 1,
      backgroundColor: '#ddd',
      alignItems: 'flex-start',
      flexDirection: 'column'
    },
  
});
  
  