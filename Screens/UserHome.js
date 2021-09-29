import { StatusBar } from 'expo-status-bar';
import React , { useEffect, useState, Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList} from 'react-native';
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';
import 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';
import { TextInput } from 'react-native';
import firebase from 'firebase/app'
import "firebase/auth";
import "firebase/database";
import {GetUserData, UpdateUserData} from './UserData';

//import "firebase/firestore";
//import "firebase/functions";
//import "firebase/storage";

export default function UserHomeScreen({navigation}) {

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => 
        <TouchableOpacity style={{width: 80}} onPress={() => { firebase.auth().signOut(); navigation.navigate("Login")}}>
          <AntDesign style={{marginLeft: '20%', fontWeight: 'bold'}} name="logout" color={'#fff'} size={25}/>
        </TouchableOpacity>,
    });
  }, []);

  let userData;
  const [name, setName] = useState('Full Name');
  const [email, setEmail] = useState( 'user@domain.com');
  const [contact, setContact] = useState('000 000 0000');

  const [editable, setEditable] = useState(false);
  const [border, setBorder] = useState(0);
  const [img, setImg] = useState('edit');
  const [prevData, setPrevData] = useState();
  
  function EnableEditing()
  {
    if(editable)
    {
      userData = GetUserData();
      console.log(name);
      firebase.database().ref('users/'+ userData.userID).child('FullName').set(name);
      firebase.database().ref('users/'+ userData.userID).child('Contact').set(contact);

      setEditable(false);
      setBorder(0);
      setImg('edit');
    }
    else
    {
      setEditable(true);
      setBorder(2);
      setImg('checkcircle');
    }
  }

  useEffect(() => {
    userData = GetUserData();   
    firebase.database().ref('users/'+ userData.userID).on('value', (snapshot) => {
      setName(snapshot.val().FullName);
      setEmail(snapshot.val().Email);
      setContact(snapshot.val().Contact);
      
      if(snapshot.val().TimeSheets)
      {
         let tempArray = [];
         for (const [key, value] of Object.entries(snapshot.val().TimeSheets)){
            let icon, colour;
            if(value.Status == "Waiting") {icon = "questioncircle"; colour = "#222"}
            else if (value.Status == "Approved") {icon = "checkcircle"; colour = "#090"}
            else if (value.Status == "Declined") {icon = "closecircle"; colour = "#009"}
           tempArray.push({key: ( tempArray.length +1).toString(), date: value.tsDate, time: value.Total, status: value.Status, icon: icon, colour: colour})
         }
         tempArray.sort((a,b)=> GetDate(b.date).getTime() - GetDate(a.date).getTime());
         setPrevData(tempArray);  
      }
    });
  }, []);


  function GetDate(tsDate)
  {
    let array = tsDate.split("-")
    array[1] = ("0" + array[1]).slice(-2);
    array[0] = ("0" + array[0]).slice(-2);
    var date = new Date(array[2] + "-" + array[1] + "-" + array[0]);
    return date;
  }

return (
    <View style={styles.container}>
     <View style={styles.pageContent}>
        <Text style={styles.pageTxtLarge}>Your Profile </Text>
        <View style={styles.profile}>
          <AntDesign name="solution1" color={'#fff'} size={50}/>
          <View style={styles.row}>
            <AntDesign style={styles.icon} name="user" color={'#fff'} size={20}/>
            <TextInput style={[styles.detailsTxt, {borderBottomWidth: border}]} 
            onChangeText={text => setName(text)} 
            editable={editable}>
              {name}
            </TextInput>
          </View>
          <View style={styles.row}>
            <AntDesign style={styles.icon} name="phone" color={'#fff'} size={20}/>
            <TextInput style={[styles.detailsTxt, {borderBottomWidth: border}]} 
            onChangeText={text => setContact(text)} 
            editable={editable}>
              {contact}
            </TextInput>
          </View>
          <View style={styles.row}>
            <AntDesign name="mail" style={styles.icon} color={'#fff'} size={20}/>
            <TextInput style={styles.detailsTxt} 
            onChangeText={text => setEmail(text)} 
            editable={false}>
              {email}
            </TextInput>
          </View>
          <TouchableOpacity style={[{width: '20%'}]} onPress={EnableEditing}>
            <AntDesign name={img} color={'#fff'} size={40}/>
          </TouchableOpacity >
        </View>
        <Text style={styles.pageTxtLarge}>Your Previous Time-Sheets </Text>
        <View style={styles.listContainer}>
            <FlatList
              data={prevData}
              renderItem={({item}) => 
                <TouchableOpacity style={styles.listItem}>
                  <View style={[styles.itemRow, {width: '30%'}]}>
                    <AntDesign name="calendar" color={'#000'} size={20}/>
                    <Text style={styles.itemTxt}> {item.date}</Text> 
                  </View> 
                  <View style={[styles.itemRow, {width: '25%'}]}>
                    <AntDesign name="clockcircle" color={'#000'} size={20}/>
                    <Text style={styles.itemTxt}> {item.time}</Text> 
                  </View>
                  <TouchableOpacity style={[styles.itemRow, {width: '40%'}]}>
                    <AntDesign name={item.icon} color={item.colour} size={25}/>
                    <Text style={[styles.itemTxt, {paddingLeft: '5%'}]}>{item.status} </Text> 
                  </TouchableOpacity>
                </TouchableOpacity>
              }/>
            </View>
        <View style={styles.createAccOption}>
          <TouchableOpacity style={styles.btn3} onPress={async () => GoToCreateAcc()}>
            <Text style={styles.textMedium}>NEW TIME-SHEET</Text>
          </TouchableOpacity >
        </View>
      </View>
    </View>
    );
    async function GoToCreateAcc()
    {
      navigation.navigate('TimeSheet')
    }
}
const styles = StyleSheet.create({

  icon: {
    paddingVertical: 10, 
    width: 'auto', 
    //marginLeft: '15%',
    alignSelf: 'flex-end'
  },

  itemTxt:{
    color: '#000',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 12,
  },

    listContainer: {
      paddingVertical: 5,
      borderColor: '#0be',
      backgroundColor: '#ddd',
      borderBottomWidth: 4,
      borderTopWidth: 4,
      borderRadius: 5,
      alignSelf: 'center',
      width: '97%',
      marginVertical: vh(2),
      height: vh(26)
    },
  
    listItem: {
      alignSelf: 'center',
      width: '95%',
      borderRadius: 2,
      flexDirection: 'row',
      marginVertical: vh(0.4),
      paddingVertical: vh(1),
      backgroundColor: '#fff',
  
      shadowOffset: {width: -2, height: 4},
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 6
    },

    itemRow: {
      width: '35%',
      paddingLeft: '2%',
      flexDirection: 'row',
      alignSelf: 'center',
      marginLeft: '2%'
    },

    profile: {
      alignSelf: 'center',
      alignItems: 'center',
      backgroundColor: '#0be',
      borderRadius: 10,
      width: "70%",
      padding: '5%',
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

    detailsTxt: {
      margin: 6,
      width: 'auto',
      minWidth: 70,
      borderBottomColor: '#fff',
      textAlign: 'left',
      color: '#fff',
      fontSize: 15,
      alignSelf: 'flex-end'
    },
  
    pageTxt: {
      margin: vh(0.7),
      color: '#000',
      fontWeight: 'bold',
      fontSize: 14,
      alignSelf: 'center'
    },
  
    pageTxtLarge: {
      marginTop: '5%',
      color: '#000',
      fontWeight: 'bold',
      fontSize: 20,
      alignSelf: 'center'
    },
    
    row: {
      alignItems: 'center',
      width: 'auto',
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
      marginTop: vh(3),
      alignSelf: 'center',
    },
  
    container: {
      flex: 1,
      backgroundColor: '#ddd',
      alignItems: 'flex-start',
      flexDirection: 'column'
    },
  
});
  
  