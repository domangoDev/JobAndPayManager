import { setStatusBarNetworkActivityIndicatorVisible, StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Button, View, SafeAreaView, Text, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';
import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';


export default function TimeSheetScreen({navigation}) {
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [breakTime, setBreakTime] = useState(0);
  const total = (endTime - startTime) - breakTime;
  return (
    <View style={styles.container}>
      <View style={styles.pageContent}>
          <Text style={styles.pageTxtLarge}>ENTER HOURS</Text>
          <View style={styles.inputArea}>
            <Text style={styles.pageTxt}>DATE: </Text>
            <TextInput
                multiline={true}
                style={styles.input}
                //onChangeText={}
                //value={}
                placeholder="00/00/0000"
            />
          </View>
          <View style={styles.jobInputArea}>
            <View style={styles.row}>
              <View style={styles.inputArea}>
                  <Text style={styles.inputTxt}> Job Number: </Text>
                  <TextInput
                      multiline={true}
                      style={styles.input}
                      //onChangeText={text => setBreakTime(text)}
                      //value={breakTime}
                      placeholder="1:00"
                      />
                </View>
                <View style={styles.inputArea}>
                  <Text style={styles.inputTxt}> Time Spent: </Text>
                  <TextInput
                      multiline={true}
                      style={styles.input}
                      //onChangeText={text => setBreakTime(text)}
                      //value={breakTime}
                      placeholder="1:00"
                      />
                </View>
                <View style={styles.inputAreaDesc}>
                  <Text style={styles.inputTxt}> Task Description: </Text>
                  <TextInput
                    multiline={true}
                    style={styles.inputDesc}
                    //onChangeText={text => setBreakTime(text)}
                    //value={breakTime}
                    placeholder="description of task"
                    />
                </View>
            </View>
            <TouchableOpacity style={styles.AddBtn} onPress={() => navigation.navigate('CreateAccount')}>
              <Text style={styles.textMed}>ADD TASK</Text>
            </TouchableOpacity >
          </View>
          <FlatList
            style={styles.listContainer}
            data={[
              {key: 547, desc: 'Wielding beam'},
              {key: 345, desc: 'Cutting steel'},
              {key: 523, desc: 'Painting steel'},
              {key: 547, desc: 'Buffing and cleaning steel'},
              {key: 345, desc: 'Marking and Drilling holes'},
            ]}
            renderItem={({item}) => 
              <View style={styles.listItem}> 
                <Text style={styles.itemTxt1}>{item.key} </Text> 
                <Text style={styles.itemTxt2}> {item.desc}</Text> 
              </View>}
          />
          <View style={styles.row}>
            <View style={styles.inputArea}>
              <Text style={styles.inputTxt}> START TIME: </Text>
              <TextInput
                  multiline={true}
                  style={styles.input}
                  onChangeText={text => setStartTime(text)}
                  value={startTime}
                  placeholder="8:00"
                  />
            </View>
            <View style={styles.inputArea}>
            <Text style={styles.inputTxt}>END TIME: </Text>
            <TextInput
                multiline={true}
                style={styles.input}
                onChangeText={text => setEndTime(text)}
                value={endTime}
                placeholder="17:00"
                />
            </View>
            <View style={styles.inputArea}>
              <Text style={styles.inputTxt}> BREAK: </Text>
              <TextInput
                  multiline={true}
                  style={styles.input}
                  onChangeText={text => setBreakTime(text)}
                  value={breakTime}
                  placeholder="1:00"
                  />
            </View>
          </View>
          <View style={styles.submitBtn}>
            <View style={styles.row}> 
              <Text style={styles.pageTxt}>TOTAL HOURS: </Text>
              <Text style={styles.pageTxt}>{total}</Text>
            </View>
            <TouchableOpacity style={styles.btn3} onPress={() => navigation.navigate('CreateAccount')}>
              <Text style={styles.textMed}>SUBMIT TIME SHEET</Text>
            </TouchableOpacity >
          </View>

        </View>
      </View>
    );
}
const styles = StyleSheet.create({
  
    textMed: {
      margin: 10,
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 15
    },
    
    inputArea: {
      marginTop: vh(2),
      marginHorizontal: 'auto',
      flexDirection: 'row',
      width: '60%'
    },

    input: {
      alignSelf:'center',
      padding: '1%',
      borderBottomWidth: 2,
      borderColor: '#00bbee',
      minWidth: 30,
      width: '10%',
    },

    inputAreaDesc: {
      marginTop: vh(2),
      marginHorizontal: 'auto',
      flexDirection: 'row',
      width: '100%'
    },

    inputDesc: {
      alignSelf:'center',
      padding: '1%',
      borderBottomWidth: 2,
      borderColor: '#00bbee',
      width: '30%',
      minWidth: 50,
    },

    inputTxt: {
      margin: vh(0.7),
      color: '#000',
      fontWeight: 'bold',
      fontSize: 12,
      alignSelf: 'center',
      width: '14%',
    },

    row:{
      width: '100%',
      flexDirection: 'row',
      alignSelf: 'center',
    },

    listContainer: {
      alignSelf: 'center',
      width: '60%',
      marginTop: vh(10),
    },

    listItem: {
      alignSelf: 'center',
      width: '100%',
      borderColor: '#0be',
      flexDirection: 'row',
      borderBottomWidth: 2,

      marginVertical: vh(0.2),
      paddingVertical: vh(0.4),
      backgroundColor: '#eee',
    },
    
    itemTxt1:{
      marginHorizontal: '5%',
      textAlign: 'right',
      color: '#000',
      fontWeight: 'bold'
      
    },

    itemTxt2:{
      width: '100%',
      color: '#000',
      textAlign: 'center',
      fontWeight: 'bold',
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
  
    btn3:{
      backgroundColor: '#0be',
      alignSelf: 'flex-end',
      marginHorizontal: 'auto',
      borderRadius: 5,
    },
  
    submitBtn: {
      marginVertical: vh(5),
      alignSelf: 'center'
    },
  
    container: {
      flex: 1,
      backgroundColor: '#ddd',
      alignItems: 'flex-start',
      flexDirection: 'column'
    },

    jobInputArea:{
      borderRadius: 5,
      backgroundColor: '#eee',
      padding: '1%',
    },

    AddBtn: {
      marginTop: vh(2),
      backgroundColor: '#0be',
      alignSelf: 'flex-end',
      marginHorizontal: 'auto',
      borderRadius: 5,
    }
  
});
  
  