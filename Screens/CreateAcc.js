import { StatusBar } from 'expo-status-bar';
import React , { useEffect, useState, Component } from 'react';
import { StyleSheet, Button, View, SafeAreaView, Text, Alert, TouchableOpacity, TextInput } from 'react-native';
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';
import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import firebase from 'firebase/app'
import "firebase/auth";
import "firebase/database";
import {GetUserData, UpdateUserData} from './UserData';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'


const Stack = createStackNavigator();

export default function CreateAccScreen({ route, navigation }) {
  const [business, setBusiness] = useState(' ');
  const [email, setEmail] = useState(' ');
  const [password, setPassword] = useState(' ');
  const [confirm, setConfirm] = useState(' ');
  const [businesses, setBusinesses] = useState([]);
  const [accCreated, setAccCreated] = useState(false);
  
  function CreateUserData(user)
  {
    console.log("Set business Data");
    firebase
    .database()
    .ref('Businesses/' + user.uid)
    .set({

      BusinessName: business,
      Email: email.toLowerCase(),
      Business: business
    });
    UpdateUserData(user.uid);
  }

  useEffect(() => {
    firebase.database().ref('Businesses/').on('value', (snapshot) => {
      if(snapshot.val())
      {
         let tempArray = [];
         for (const [key, value] of Object.entries(snapshot.val())){
           tempArray.push(value.Email);
           console.log(value.Email);
         }
         setBusinesses(tempArray);  
      }
    });
  }, []);


  return (
    <KeyboardAwareScrollView style={{flex: 1}}>
    <View style={styles.container}>
      <View style={styles.pageContent}>
        <Text style={styles.pageTxtLarge}>ENTER CREDENTIALS</Text>
        <View style={styles.inputArea}>
          <Text style={styles.loginTxt}>Business Name: </Text>
          <TextInput
            style={styles.input}
            onChangeText={text => setBusiness(text)}
            //value={number}
            placeholder="Business Name"
          />
        </View>
        <View style={styles.inputArea}>
          <Text style={styles.loginTxt}>Employeer Email: </Text>
          <TextInput
            style={styles.input}
            onChangeText={text => setEmail(text)}
            //value={number}
            placeholder="Employeer@gmail.com"
          />
        </View>
        <View style={styles.inputArea}>
          <Text style={styles.loginTxt}>Employeer Password: </Text>
          <TextInput
            style={styles.input}
            onChangeText={text => setPassword(text)}
            placeholder=" ******"
            secureTextEntry
          />
        </View>
        <View style={styles.inputArea}>
          <Text style={styles.loginTxt}>Confirm Password: </Text>
          <TextInput
            style={styles.input}
            onChangeText={text => setConfirm(text)}
            placeholder=" ******"
            secureTextEntry
          />
        </View>
        <View style={styles.createAccBtn}>
        <Text style={styles.WarningTxt}>Employee's will need to create their own accounts and you will need to add them using the admin home </Text>
          <TouchableOpacity style={styles.btn2} onPress={CreateAccount} >
              <Text style={styles.textMedium}>Create Business Account</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.createAccOption}>
            <Text style={styles.pageTxt}>Already have an account?</Text>
            <TouchableOpacity style={styles.btn3} onPress={() => navigation.navigate('Login')}>
              <Text style={styles.textMedium}>Login</Text>
          </TouchableOpacity >
        </View>

      </View>
    </View>
    </KeyboardAwareScrollView>
  );



  function CreateAccount()
  {
    if(business.length < 3) alert('Please enter a valid Business Name');
    else if(email.length < 7) alert('Please enter a vaild email address');
    else if(password.length < 6) alert('Please enter a more complex passsword');
    else if(confirm != password) alert('Your passwords do not match');
    else if(businesses.includes(email.toLowerCase())) alert('A business with this email address already exists');
    else  {
      let failed = false;
      firebase.auth().createUserWithEmailAndPassword(email, password)
        .catch(error =>{
          failed = true;
          setAccCreated(false);
          alert("Creating Account Failed \n\n Please ensure you are entered a valid email address and a long enough password")
          }).then(() => {
          if(!failed)
          {
            CreateUserData(firebase.auth().currentUser)
            setAccCreated(true);
            navigation.replace('AdminHome');
          }
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
      width: '90%',
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
  