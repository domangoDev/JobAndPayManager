import React , { useEffect, useState } from 'react';
import { StyleSheet, Button, View, Alert, Text, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';
import 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';
import { Overlay } from 'react-native-elements';
import firebase from 'firebase/app'
import "firebase/auth";
import "firebase/database";
import {GetUserData, UpdateUserData} from './UserData';
import DateTimePicker from '@react-native-community/datetimepicker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default function TimeSheetScreen({navigation}) {

  let userData = GetUserData();
  const [jobsVisible, setJobsVisible] = useState(false);
  const [selJob, setSelJob] = useState();
  const [mode, setMode] = useState();

  const [show, setShow] = useState(false)
  const [showStartTime, setShowStartTime] = useState(false);
  const [showEndTime, setShowEndTime] = useState(false);
  const [showBreakTime, setShowBreakTime] = useState(false);

  const [jobData, setJobData] = useState([]);

  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [breakTime, setBreakTime] = useState(new Date('December 00, 0000 00:00:00'));

  const [timeSpent, setTimeSpent] = useState();
  const [taskDesc, setTaskDesc] = useState(''); 
  
  const [date, setDate] = useState(new Date());
  
  const [viewDate, setViewDate] = useState('00-00-0000');
  const [viewStartTime, setViewStartTime] = useState('00:00');
  const [viewEndTime, setViewEndTime] = useState('00:00');
  const [viewBreakTime, setViewBreakTime] = useState('00:00');

  const [totalTaskTime, setTotalTaskTime] = useState(0); 
  const [total, setTotal] = useState(0);
  const [taskData, setTaskData] = useState([]);

  let dateData = '';

  useEffect(() => {
    let joinedBusiness;
    let BusinessID;
    let tempJobData = [];
    userData = GetUserData();  

    firebase.database().ref('users/'+ userData.userID).on('value', (snapshot) => {joinedBusiness = snapshot.val().Business});

    firebase.database().ref('Businesses/').on('value', (snapshot) => {
      if(snapshot.val())
      {       
        for (const [key, value] of Object.entries(snapshot.val())){
          if(joinedBusiness == value.Email) BusinessID = key;
        }

        firebase.database().ref('Businesses/' + BusinessID + '/Jobs').on('value', (snapshot) => {
          let key = 0;
          snapshot.forEach(job => {
            tempJobData.push({key: key.toString(), ...job.val()});
            key+=1;
          })
        })
        setJobData(tempJobData);
      }
    });
  }, []);


  function updateTotal(start, end, tempBreak)
  {
    let tempTotal = ((((end - start) / 36e5) <= 0) ?  
                      ((end - start) / 36e5) + 24 : 
                      (end - start  ) / 36e5) - (tempBreak.getHours() + (tempBreak.getMinutes() / 60));
    setTotal(tempTotal);
  }
  function OnDateChange(event, selectedDate)
  {
    setShow(false);
    if(selectedDate == null) return;
    setDate(selectedDate);
    dateData = selectedDate.getDate() +'-' + (selectedDate.getMonth() + 1) +'-' + selectedDate.getFullYear();
    setViewDate(dateData);
    console.log(selectedDate + " | " + dateData);
  }

  function OnStartTimeChange(event, selectedTime)
  {
    setShowStartTime(false);
    if(selectedTime == null) return;
    setStartTime(selectedTime);
    setViewStartTime(selectedTime.getHours() + ':' + selectedTime.getMinutes());
    updateTotal(selectedTime, endTime, breakTime);
  }

  function OnEndTimeChange(event, selectedTime)
  {
    setShowEndTime(false);
    if(selectedTime == null) return;
    setEndTime(selectedTime);
    setViewEndTime(selectedTime.getHours() + ':' + selectedTime.getMinutes());
    updateTotal(startTime, selectedTime, breakTime);
  }

  function OnBreakTimeChange(event, selectedTime)
  {
    setShowBreakTime(false);
    if(selectedTime == null) return;
    setBreakTime(selectedTime);
    setViewBreakTime(selectedTime.getHours() + ':' + selectedTime.getMinutes());
    updateTotal(startTime, endTime, selectedTime);
  }

  
  function AddTask(){
    if(selJob == ' ' || selJob == '' || !selJob)
    {
      Alert.alert("You have not selected a Job");
    }
    else if(timeSpent == ' ' || timeSpent == '' || !timeSpent)
    {
      Alert.alert("You have not entered Time Spent");
    }
    else if(taskDesc == ' ' || taskDesc == '' || !taskDesc)
    {
      Alert.alert("You have not entered Task Description");
    }
    else  
    {
      setTotalTaskTime(totalTaskTime + parseFloat(timeSpent));
      setTaskData([...taskData, {key: (taskData.length + 1).toString(), job: selJob.toString(), desc: taskDesc, time: timeSpent}]);
      setTimeSpent('');
      setTaskDesc('');
    }
  }

  function ToggleJobsOverlay()
  {
    setJobsVisible(!jobsVisible);
  }

  function JobSelected(jobNumber)
  {
    ToggleJobsOverlay();
    setSelJob(jobNumber);
  }

  function SubmitTimeSheet()
  {
    console.log(total + " < " + totalTaskTime);

    if(total < totalTaskTime)
    {
      Alert.alert("You have entered too much time in your tasks. Remove " + (totalTaskTime - total) + " Hours");
    }
    else if (total > totalTaskTime)
    {
      Alert.alert("You have not entered enough time in your tasks. Add " + (total - totalTaskTime)  + " Hours");
    }
    else if (viewDate == "00-00-0000") Alert.alert("Please select a date for this time-sheet.")
    else
    {
      Alert.alert('SENT', 'Time-sheet submitted for the ' + viewDate)
      firebase
        .database()
        .ref('users/' + userData.userID +'/TimeSheets/')
        .push({
          tsDate: viewDate,
          Jobs: taskData,
          StartTime: viewStartTime,
          EndTime: viewEndTime,
          BreakTime: viewBreakTime,
          Total: total,
          Status: 'Waiting',
      });
      navigation.navigate('UserHome')
    }

  }

  function deleteItem(selItem)
  {
    setTotalTaskTime(totalTaskTime - selItem.time);
    const tempList = taskData.filter((item) => item.key !== selItem.key);
    setTaskData(tempList);
  }

  return (
    <KeyboardAwareScrollView style={{flex: 1}}>
    <View style={styles.container}>
      <View style={styles.pageContent}>
          <Text style={styles.pageTxtLarge}>Enter Time-Sheet Details</Text>
          <View style={[ styles.inputArea, {marginBottom: '4%'}]} >
            <Text style={styles.pageTxt}>Date: </Text>
            <TouchableOpacity style={[{width: '90%', borderColor: '#0be', borderBottomWidth: 2}]} onPress={() => setShow(true)}>
              <Text style={[{color: '#000', textAlign: 'center', paddingTop: 4}]}>{viewDate}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.jobInputArea}>
            <View style={styles.row}>
              <View style={[styles.inputArea, {marginHorizontal: '7%'}]}>
                  <Text style={styles.inputTxt}> Job Number: </Text>
                  <TouchableOpacity style={[{width: '60%', borderColor: '#0be', borderBottomWidth: 2}]} onPress={ToggleJobsOverlay}>
                    <Text style={[{color: '#000', textAlign: 'center', paddingTop: 4}]}>{selJob}</Text>
                  </TouchableOpacity>
                </View>
                <View style={[styles.inputArea, {marginHorizontal: '7%'}]}>
                  <Text style={styles.inputTxt}> Time Spent: </Text>
                  <TextInput
                      multiline={true}
                      style={styles.input}
                      keyboardType={'numeric'}
                      onChangeText={text => setTimeSpent(text)}
                      value={timeSpent}
                      placeholder="4.5"
                      />
                </View>
            </View>
            <View style={styles.inputAreaDesc}>
              <Text style={styles.inputTxtMed}> Task Description: </Text>
              <TextInput
                multiline={true}
                style={styles.inputDesc}
                onChangeText={text => setTaskDesc(text)}
                value={taskDesc}
                placeholder="description of task"
                />
            </View>
            <TouchableOpacity style={styles.AddBtn} onPress={AddTask}>
              <Text style={styles.textMed}>ADD TASK</Text>
            </TouchableOpacity >
          </View>
          <View style={styles.listContainer}>
            <FlatList
              data={taskData}
              renderItem={({item}) => 
                <View style={styles.listItem}> 
                  <View style={[styles.itemRow, {marginLeft: '2%'}]} >
                    <AntDesign name="tag" color={'#000'} size={20}/>
                    <Text style={[styles.itemTxt1]}>{item.job} </Text> 
                  </View>
                  <View style={[{width: '60%'}]}>
                    <Text style={styles.itemTxt2}> {item.desc}</Text> 
                  </View>
                  <View style={styles.itemRow}>
                    <AntDesign name="clockcircle" color={'#000'} size={20}/>
                    <Text style={styles.itemTxt3}> {item.time}</Text> 
                  </View>
                  <TouchableOpacity style={styles.itemRow} onPress={() => deleteItem(item)}>
                    <AntDesign name="delete" color={'#0be'} size={25}/>
                  </TouchableOpacity>
                </View>}
              />
          </View>
          <View style={styles.row}>
          <View style={styles.inputArea}>
              <Text style={[styles.inputTxt, {minWidth: 40}]}>Start: </Text>
              <TouchableOpacity style={[{width: '40%', borderColor: '#0be', borderBottomWidth: 2}]} onPress={() => setShowStartTime(true)}>
                <Text style={[{color: '#000', textAlign: 'center', paddingTop: 4}]}>{viewStartTime}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.inputArea}>
              <Text style={[styles.inputTxt, {minWidth: 40}]}>End: </Text>
              <TouchableOpacity style={[{width: '40%', borderColor: '#0be', borderBottomWidth: 2}]} onPress={() => setShowEndTime(true)}>
                <Text style={[{color: '#000', textAlign: 'center', paddingTop: 4}]}>{viewEndTime}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.inputArea}>
              <Text style={[styles.inputTxt, {minWidth: 40}]}> Break: </Text>
              <TouchableOpacity style={[{width: '40%', borderColor: '#0be', borderBottomWidth: 2}]} onPress={() => setShowBreakTime(true)}>
                  <Text style={[{color: '#000', textAlign: 'center', paddingTop: 4}]}>{viewBreakTime}</Text>
                </TouchableOpacity>
            </View>
          </View>
          <View style={styles.submitBtn}>
            <View style={styles.row}> 
              <Text style={styles.pageTxt}>TOTAL HOURS: </Text>
              <Text style={styles.pageTxt}>{(total) ? total : 0}</Text>
            </View>
            <TouchableOpacity style={styles.btn3} onPress={SubmitTimeSheet}>
                <Text style={styles.textMed}>SUBMIT</Text>
                <AntDesign style={[{paddingTop: 5}]}name="checkcircle" color={'#fff'} size={25}/>
            </TouchableOpacity >
          </View>

        </View>
      <Overlay isVisible={jobsVisible} onBackdropPress={ToggleJobsOverlay} overlayStyle={styles.overlay}>
          <Text style={[styles.pageTxtLarge, {marginBottom: 0, marginTop: vh(4)}]}>Select Job Below</Text>
          <View style={[styles.listContainer, {width: '94%', height: '70%'}]}>
          <FlatList
            data={jobData}
            renderItem={({item}) => 
              <TouchableOpacity onPress={() => JobSelected(item.jobNumber)} style={styles.listItem}>
                <View style={[styles.itemRow, {width: '20%', marginLeft: '3%'}]}>
                  <AntDesign name="tag" color={'#000'} size={25}/>
                  <Text style={styles.itemTxt}> {item.jobNumber}</Text> 
                </View> 
                <View style={[styles.itemRow, {width: '40%'}]}>
                  <AntDesign name="idcard" color={'#000'} size={25}/>    
                  <Text style={[styles.itemTxt, {fontSize: 12, paddingLeft: '2%'}]}>{item.jobName} </Text> 
                </View>
                <View style={[styles.itemRow, {width: '40%'}]}>
                  <AntDesign name="user" color={'#000'} size={25}/>    
                  <Text style={[styles.itemTxt, {fontSize: 12, paddingLeft: '2%'}]}>{item.client} </Text> 
                </View>
              </TouchableOpacity>
            }/>
          </View>
        </Overlay>
      {show && (<DateTimePicker testID="dateTimePicker" value={date} mode={'date'} is24Hour={true} display="default" onChange={OnDateChange}/>
      )}
      {showStartTime && (<DateTimePicker testID="dateTimePicker" value={startTime} mode={'time'} is24Hour={true} display="default" onChange={OnStartTimeChange}/>
      )}
      {showEndTime && (<DateTimePicker testID="dateTimePicker" value={endTime} mode={'time'} is24Hour={true} display="default" onChange={OnEndTimeChange}/>
      )}
      {showBreakTime && (<DateTimePicker testID="dateTimePicker" value={breakTime} mode={'time'} is24Hour={true} display="spinner" onChange={OnBreakTimeChange}/>
      )}
      </View>
      </KeyboardAwareScrollView>
    );
}
const styles = StyleSheet.create({
    overlay: {
      padding: 0,
      margin: 0,
      height: vh(50),
      width: '92%',
    },

    itemRow: {
      width: '15%',
      flexDirection: 'row',
      alignSelf: 'center',
    },
    textMed: {
      margin: 10,
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 15
    },

    dateInput: {
      alignSelf:'center',
      padding: '1%',
      borderBottomWidth: 2,
      borderColor: '#00bbee',
      width: '70%',
      minWidth: 80,
    },

    inputArea: {
      marginVertical: vh(0.5),
      justifyContent: 'center',
      flexDirection: 'row',
      width: '33%',
      minWidth: 90,
      alignSelf: 'center',
    },

    input: {
      textAlign: 'center',
      alignSelf:'center',
      padding: '1%',
      borderBottomWidth: 2,
      borderColor: '#00bbee',
      width: '50%',
      minWidth: 30,
    },

    inputAreaDesc: {
      marginTop: vh(2),
      flexDirection: 'row',
      width: '100%'
    },

    inputDesc: {
      alignSelf:'center',
      padding: '1%',
      borderBottomWidth: 2,
      borderColor: '#00bbee',
      width: '60%',
    },

    inputTxt: {
      margin: vh(0.7),
      color: '#000',
      fontWeight: 'bold',
      fontSize: 12,
      width: '35%',
      minWidth: 80,
      alignSelf: 'center',
      textAlign: 'right',
    },
    
    inputTxtMed: {
      margin: vh(0.7),
      color: '#000',
      fontWeight: 'bold',
      fontSize: 12,
      alignSelf: 'center',
      textAlign: 'right',
      width: '25%',
      minWidth: 100,
    },

    row:{
      width: '100%',
      flexDirection: 'row',
      alignSelf: 'center',
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
      height: vh(25)
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
    
    itemTxt1:{
      marginLeft: '15%',
      padding: '1%',
      color: '#000',
      fontWeight: 'bold',
      textAlign: 'center',
    },

    itemTxt2:{
      padding: '1%',
      color: '#000',
      textAlign: 'center',
    },

    itemTxt3:{
      padding: '1%',
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
      marginVertical: vh(2),
      color: '#000',
      fontWeight: 'bold',
      fontSize: 24,
      alignSelf: 'center'
    },

    pageContent:{
      minHeight: vh(89),
      padding: vh(1),
      flex: 1,
      backgroundColor: '#fff',
      marginVertical: vh(2),
      marginHorizontal: '25%',
      width: '97%',
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
      flexDirection: 'row',
      backgroundColor: '#0be',
      alignSelf: 'center',
      marginVertical: vh(1),
      marginHorizontal: 'auto',
      paddingHorizontal: 5,
      borderRadius: 5,
    },
  
    submitBtn: {
      marginVertical: vh(3),
      alignSelf: 'center'
    },
  
    container: {
      flex: 1,
      backgroundColor: '#ddd',
      alignItems: 'flex-start',
      flexDirection: 'column'
    },

    jobInputArea:{
      width: '100%',
      borderRadius: 5,
      backgroundColor: '#e5e5e5',
      padding: '1%',
    },

    AddBtn: {
      marginTop: vh(2),
      backgroundColor: '#0be',
      alignSelf: 'center',
      marginHorizontal: 'auto',
      borderRadius: 5,
    },


  
});
  
  