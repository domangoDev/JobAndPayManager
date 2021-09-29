import { StatusBar } from 'expo-status-bar';
import React , { useEffect, useState } from 'react';
import { StyleSheet, Button, View, Alert, Text, FlatList, TouchableOpacity, TextInput} from 'react-native';
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';
import 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';
import Display from 'react-native-display';
import { Overlay } from 'react-native-elements';
import {GetUserData, UpdateUserData} from './UserData';
import {Picker} from '@react-native-community/picker';

import "firebase/auth";
import "firebase/database";
import firebase from 'firebase/app'


export default function AdminHomeScreen({navigation}) {
  
  const [btn1BackColour, setBtn1BackColour] = useState('#333');
  const [btn2BackColour, setBtn2BackColour] = useState('#0be');
  const [btn3BackColour, setBtn3BackColour] = useState('#0be');
  const [pageTitle, setPageTitle] = useState('Confirm Time-Sheets');

  const [TSDisplay, setTSDispay] = useState(true);
  const [EmployeeDisplay, setEmployeeDispay] = useState(false);
  const [JobDisplay, setJobDispay] = useState(false);

  const [selectedItem, setSelectedItem] = useState([{}]);

  const [jobCount, setJobCount] = useState(0);

  const [filteredTSData, setFilteredTSData] = useState();
  const [oldTSData, setOldTSData] = useState([]);
  const [selStatus, setSelStatus] = useState('All');
  const [filterName, setFilterName] = useState();

  const [curItemKey, setCurItemKey] = useState(0);
  const [details1, setDetails1] = useState('');
  const [details2, setDetails2] = useState('');
  const [details3, setDetails3] = useState('');
  const [details4, setDetails4] = useState('');
  const [details5, setDetails5] = useState('');
  const [details6, setDetails6] = useState('');
  const [details7, setDetails7] = useState(0);

  const [TSVisible, setTSVisible] = useState(false);

  const [jobVisible, setJobVisible] = useState(false);
  const [creatingJob, setCreatingJob] = useState(false);
  const [tasks, setTasks] = useState();

  const [employeeVisible, setEmployeeVisible] = useState(false);

  const [textEditable, setTextEditable] = useState(false);
  const [textUnderline, setTextUnderline] = useState(0);

  const [overlayBtn1, setOverlayBtn1] = useState('edit');
  const [overlayBtn2, setOverlayBtn2] = useState('delete');

  const [employeeData, setEmployeeData] = useState();
  const [jobData, setJobData] = useState();
  const [newEmp, setNewEmp] = useState();

  const [view, setView] = useState(20);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState();
  let userData = GetUserData();
  let tempTSData = [];
  let allUserIDs = [];

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => 
        <TouchableOpacity style={{width: 80}} onPress={() => { firebase.auth().signOut(); navigation.navigate("Login")}}>
          <AntDesign style={{marginLeft: '20%', fontWeight: 'bold'}} name="logout" color={'#fff'} size={25}/>
        </TouchableOpacity>,
    });
  }, []);

  useEffect(() => {
    firebase.database().ref('Businesses/' + userData.userID + '/NewEmployees').on('value', (snapshot) => {
      if(snapshot.val())
      {
         let tempArray = [];
         snapshot.forEach(userID => {
          firebase.database().ref('users/' + userID.val()).on('value', (userSnapshot) => {
            tempArray.push({key: tempArray.length.toString(), userId: userID.val(), name: userSnapshot.val().FullName});
          });
        });
        setNewEmp(tempArray);
      }
    });

    firebase.database().ref('Businesses/' + userData.userID + '/Employees').on('value', (snapshot) => {
      if(snapshot.val())
      {
        let tempArray = [];
        let tsTotal = 0;
        allUserIDs = snapshot.val();
        snapshot.forEach(userID => {
        firebase.database().ref('users/' + userID.val()).on('value', (userSnapshot) => {
          tempArray.push({
            key: tempArray.length.toString(), 
            userId: userID.val(), 
            name: userSnapshot.val().FullName, 
            contact: userSnapshot.val().Contact, 
            email: userSnapshot.val().Email});

            if(userSnapshot.val().TimeSheets)
            {
              let tsCount = 0;
              for (const [key, value] of Object.entries(userSnapshot.val().TimeSheets)){
                //tsCount++;
                //if(tsCount > (Object.entries(userSnapshot.val().TimeSheets).length) - 10) 
                const ref = "users/" + userID.val() + "/TimeSheets/" + key;
                let icon, colour;
                if (value.Status == "Approved") {icon = "checkcircle"; colour = "#090"}
                else if (value.Status == "Declined") {icon = "closecircle"; colour = "#900"}
                else {icon = "questioncircle"; colour = "#222"}
                tempTSData.push({key: tsTotal.toString(), date: GetDate(value.tsDate), icon: icon, ref: ref, colour: colour, Status: value.Status, Name: userSnapshot.val().FullName, ...value});
                tsTotal++;
              }
            }

            if(tempArray.length == snapshot.numChildren())
            {
              let temp = tempTSData;
              setOldTSData(temp);
              tempTSData = [];
              setEmployeeData(tempArray);
              filterTSData(temp);
            }
          });
        });
      }
    });

    firebase.database().ref('Businesses/' + userData.userID + '/Jobs').on('value', (snapshot) => {
      let tempArray = [];
      if(snapshot.val())
      {
         snapshot.forEach(job => {
          tempArray.push({key: ( tempArray.length +1).toString(), ...job.val() })
        });
      }
      setJobData(tempArray);
    });

    firebase.database().ref('Businesses/' + userData.userID + '/JobCount').on('value', (snapshot) => {
      if(snapshot.val()) setJobCount(snapshot.val());
    });

  }, []);

  function ResetDetails()
  {
    setDetails1('');
    setDetails2('');
    setDetails3('');
    setDetails4('');
    setDetails5('');
    setDetails6('');
    setDetails7('');
  }

  function AcceptEmployee(item)
  {
    firebase.database().ref('Businesses/' + userData.userID).child("Employees").push(item.userId);
    firebase.database().ref('Businesses/' + userData.userID + '/NewEmployees').on('value', (snapshot) => {
      if(snapshot.val())
      {
         snapshot.forEach(userID => {
          if(item.userId == userID.val()) userID.getRef().remove();
        });
      }
    });
    const updatedEmpArray = newEmp.filter(item => item.name == item.name);
    setNewEmp(updatedEmpArray);
  }

  function ToggleTSOverlay()
  {
    setTSVisible(!TSVisible);
  }
  function ToggleJobOverlay()
  {
     setJobVisible(!jobVisible);
     CancelEditing();
  }
  function ToggleCreateJobOverlay()
  {
    if(!jobVisible) { 
      ResetDetails(); 
      EditJob(); 
      setDetails1(jobCount + 1);
    }
    setCreatingJob(!creatingJob);
    setTextEditable(!textEditable);
    setJobVisible(!jobVisible);
  }

  function ToggleEmployeeOverlay()
  {
     setEmployeeVisible(!employeeVisible);
  }
  
  function EnableJobOverlay(itemData)
  {
    /*ModalComponent={Modal} */
    setDetails1(itemData.jobNumber);
    setDetails2(itemData.jobName);
    setDetails3(itemData.client);
    setDetails4(itemData.location);
    setDetails5(itemData.number);
    setDetails6(itemData.email);
    setDetails7(itemData.timeSpent);
    setSelectedItem(itemData);

    firebase.database().ref("Businesses/" + userData.userID + "/Jobs/" + itemData.jobNumber + "/Tasks").once('value', (snapshot) => {
        let temp = []
        let count = 0;
        if(snapshot.exists)
        {
          snapshot.forEach(item => {
            temp.push({key: count.toString(), Name: item.val().Name, Desc: item.val().Desc, Time: item.val().Time, Date: item.val().Date});
            count++;
          });
        }
        setTasks(temp);
    });

    ToggleJobOverlay();
  }

  function EnableEmployeeOverlay(itemData)
  {
    setCurItemKey(itemData.key);
    setDetails1(itemData.name);
    setDetails2(itemData.email);
    setDetails3(itemData.contact);
    setSelectedItem(itemData);
    ToggleEmployeeOverlay();
  }
  function EnableTSOverlay(itemData)
  {
    setDetails1(itemData.Name);
    setDetails2(itemData.tsDate);
    setDetails3(itemData.Total);
    setSelectedItem(itemData);
    ToggleTSOverlay();
  }

  function CreateNewJob()
  {
    if(details2 == ' ' || details2 == '' || !details2) Alert.alert("You have not entered a Job Name for this job");
    else if(details3 == ' ' || details3 == '' || !details3) Alert.alert("You have not entered the Client's Name for this job");
    else if(details4 == ' ' || details4 == '' || !details4) Alert.alert("You have not entered a Location for this job");
    else if(details5 == ' ' || details5 == '' || !details5) Alert.alert("You have not entered a Contact number for this job");
    else if(details6 == ' ' || details6 == '' || !details6) Alert.alert("You have not entered an Email address for this job");
    else
    {
      (parseFloat(details7) && details7 != "") ? setDetails7(parseFloat(details7)) : setDetails7(0);

      firebase.database().ref('Businesses/' + userData.userID).child('JobCount').set(jobCount + 1);

      firebase
      .database().ref('Businesses/' + userData.userID).child('Jobs').child(jobCount + 1).set({
        jobNumber: details1, 
        jobName: details2, 
        client: details3, 
        location: details4, 
        number: details5,  
        email: details6, 
        timeSpent: details7
      });
      ToggleCreateJobOverlay();
    }
  }

  function DeleteEmployee(item)
  {
    Alert.alert(
      "WARNING",
      "Are you sure you want to delete this Employee?",
      [
        { text: "Cancel", onPress: () => console.log("Ask me later pressed")},
        { text: "OK", onPress: () => {
          firebase.database().ref('Businesses/' + userData.userID + '/Employees').on('value', (snapshot) => {
            if(snapshot.val())
            {
               snapshot.forEach(userId => {
                if(item.userId == userId.val()) userId.getRef().remove();
              });
            }
          });
        }
      },
    ]);
    if (employeeVisible) ToggleEmployeeOverlay();
    if(textEditable) CancelEditing();
  }

  function EditJob()
  {
    if(creatingJob)
    {
      CreateNewJob();
    }
    else if(textEditable)
    {
      (parseFloat(details7) && details7 != "") ? setDetails7(parseFloat(details7)) : setDetails7(0);
      firebase
      .database().ref('Businesses/' + userData.userID).child('Jobs').child(selectedItem.jobNumber).set({
        jobNumber: details1, 
        jobName: details2, 
        client: details3, 
        location: details4, 
        number: details5,  
        email: details6, 
        timeSpent: details7,
        Tasks: tasks
      });
      CancelEditing()
    }
    else
    {
      setTextEditable(true);
      setTextUnderline(2);
      setOverlayBtn1("checkcircle");
      setOverlayBtn2("closecircle");
    }
  }

  function CancelEditing()
  {
    setCreatingJob(false);
    setTextEditable(false);
    setTextUnderline(0);
    setOverlayBtn1("edit");
    setOverlayBtn2("delete");
  }

  function DeleteJob(item)
  {
    if(creatingJob) { ToggleJobOverlay(); return}
    if(textEditable) { CancelEditing(); return}
    Alert.alert(
      "WARNING",
      "Are you sure you want to delete this job?",
      [
        { text: "Cancel", onPress: () => console.log("Ask me later pressed")},
        { text: "OK", onPress: () => {
          firebase.database().ref('Businesses/' + userData.userID + '/Jobs').on('value', (snapshot) => {
            if(snapshot.val())
            {
               snapshot.forEach(job => {
                if(item.jobNumber == job.val().jobNumber) job.getRef().remove();
              });
            }
          });
        }
      },
    ]);
    if (jobVisible) ToggleJobOverlay();
  }

  function AcceptTS(itemData)
  {
    userData = GetUserData();
    itemData.Status = "Accepted"
    itemData.icon = "checkcircle"; 
    itemData.colour = "#090";
    firebase.database().ref(itemData.ref).child("Status").set("Approved");
    itemData.Jobs.forEach(jobItem => {
      let jobCurVal;
      let jobExists = false;
      firebase.database().ref("Businesses/" + userData.userID + "/Jobs/" + jobItem.job).limitToFirst(1).once('value', (snapshot) => 
      {
        if(snapshot.exists())
        {
          jobCurVal = snapshot.val().timeSpent;
          jobExists = true;
        }
        else alert("Job " + jobItem.job + " was not found. " + jobItem.time + " hours were not allocated ");
      });
      if(jobExists) 
      {
        firebase.database().ref("Businesses/" + userData.userID + "/Jobs/" + jobItem.job + "/timeSpent").set(
          (jobCurVal) ?  (parseFloat(jobCurVal) + parseFloat(jobItem.time)) : jobItem.time
        );
        firebase.database().ref("Businesses/" + userData.userID + "/Jobs/" + jobItem.job + "/Tasks").push({
          Date: itemData.tsDate, Name: itemData.Name, Desc: jobItem.desc, Time: jobItem.time         
        });
      }      
    })
    ToggleTSOverlay();
    filterTSData();
  }
  function DeclineTS(itemData)
  {
    itemData.Status = "Declined";
    itemData.icon = "closecircle"; 
    itemData.colour = "#900";
    firebase.database().ref(itemData.ref).child("Status").set("Declined");
    ToggleTSOverlay();
    filterTSData();
  }

  function ShowTimeSheets()
  {
    ResetDisplay();
    setTSDispay(true);
    setBtn1BackColour('#333');
    setPageTitle('Manage Time-Sheets');
  }

  function ShowJobs()
  {
    ResetDisplay();
    setJobDispay(true);
    setBtn2BackColour('#333');
    setPageTitle('Manage Jobs');

  }
  function ShowEmployees()
  {
    ResetDisplay();
    setEmployeeDispay(true);
    setBtn3BackColour('#333');
    setPageTitle('Manage Employees');
  }

  function ResetDisplay()
  {
    setBtn1BackColour('#0be');
    setBtn2BackColour('#0be');
    setBtn3BackColour('#0be');
    setEmployeeDispay(false);
    setTSDispay(false);
    setJobDispay(false);
  }

  function filterTSData(data)
  {
    let tempData = data;
    let max = (tempData.length % view > 0) ? Math.floor(tempData.length / view) + 1 : Math.floor(tempData.length / view);
    let p = Math.round(parseFloat(page));
    let v = Math.round(parseFloat(view));

    p = (p > max) ? max : p;
    p = (p < 1) ? 1 : p;
    v = (v > 50) ? 50 : v;
    v = (v < 1) ? 1 : v;

    if(filterName && filterName.length != " ") tempData = tempData.filter(item => item.Name.toLowerCase().includes(filterName.toLowerCase()));
    if(selStatus && selStatus != "All") tempData = tempData.filter(item => item.Status.toLowerCase() == selStatus.toLowerCase());  
    tempData.sort((a,b)=> b.date.getTime() - a.date.getTime());
    tempData = tempData.slice((p-1) * v, ((p-1) * v) + parseFloat(v));

    setView(v);
    setMaxPage(max);
    setPage(p);
    setFilteredTSData(tempData);
  }

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
      <View style={styles.optionsBar}>
        <View style={styles.btnHolder}>
          <TouchableOpacity style={[styles.navBtns, {backgroundColor: btn1BackColour}]} 
            onPress={ShowTimeSheets}>
            <Text style={styles.textMedium}>Time-Sheets</Text>
          </TouchableOpacity >
          <TouchableOpacity style={[styles.navBtns, {backgroundColor: btn2BackColour, width: '22%'}]}  
            onPress={ShowJobs}>
            <Text style={styles.textMedium}>Jobs</Text>
          </TouchableOpacity >
          <TouchableOpacity style={[styles.navBtns, {backgroundColor: btn3BackColour}]}  
            onPress={ShowEmployees}>
            <Text style={styles.textMedium}>Employees</Text>
          </TouchableOpacity >
        </View>
      </View>
      <View style={styles.pageContent}>
        <Text style={[styles.pageTxtLarge, {marginBottom: 20, fontSize: 20}]}>{pageTitle}</Text>
        <Display enable={TSDisplay}>
          <View style={[styles.row, {width: "55%"}]}>
            <Text style={[styles.pageTxt, {fontSize: 16}]}>Status</Text>
            <View style={{marginHorizontal: '5%', height: 35, width: '65%', backgroundColor: '#dedede', borderRadius: 5}}>
              <Picker
                style={{width: '100%', height: '100%'}}
                //itemStyle={{textAlign: 'center', fontSize: 5}}
                value
                selectedValue={selStatus}
                onValueChange={(itemValue, itemIndex) => setSelStatus(itemValue)
                }>
                <Picker.Item label="All" value="All" />
                <Picker.Item label="Waiting" value="Waiting" />
                <Picker.Item label="Approved" value="Approved" />
                <Picker.Item label="Declined" value="Declined" />
              </Picker>
            </View>
          </View>
          <View style={[styles.row, {width: "55%"}]}>
            <AntDesign style={{marginTop: '9%'}}name="user" color={'#000'} size={25}/>
            <TextInput 
              multiline={false} 
              placeholder="Employee Name" 
              value={filterName}
              onChangeText={text => setFilterName(text)} 
              style={[styles.input, {marginLeft: 10, marginTop: '9%', color: '#000', width:'80%', borderBottomWidth: 2, height: 25}]}/>
          </View>
          <View style={[styles.row, {width: "55%"}]}>
            <Text style={[styles.pageTxt, {marginTop: '3%'}]}>View: </Text>
            <TextInput 
              multiline={false} 
              placeholder="10" 
              value={view.toString()}
              keyboardType={'numeric'}
              onChangeText={text => setView(text)} 
              style={[styles.input, {marginLeft: 10, marginTop: '2%', color: '#000', width:'15%', borderBottomWidth: 2, height: 25}]}/>
            <Text style={[styles.pageTxt, {marginTop: '3%'}]}>Page: </Text>
            <TextInput 
              multiline={false} 
              placeholder="10" 
              value={page.toString()}
              keyboardType={'numeric'}
              onChangeText={text => setPage(text)} 
              style={[styles.input, {marginLeft: 10, marginTop: '2%', color: '#000', width:'15%', borderBottomWidth: 2, height: 25}]}/>
              <Text style={[styles.pageTxt, {marginTop: '3%'}]}>{' of ' + maxPage} </Text>
          </View>
          
          <TouchableOpacity onPress={() => filterTSData(oldTSData)} style={[styles.createBtn, {margin: '4%'}]}>
            <Text style={[styles.textMedium, {margin: 4, marginVertical: 4}]}>Filter</Text>
          </TouchableOpacity>
            <View style={[styles.listContainer, {height: '55%'}]}>
            <FlatList
              data={filteredTSData}
              renderItem={({item}) => 
                <TouchableOpacity onPress={() => EnableTSOverlay(item)} style={styles.listItem}>
                  <View style={[styles.itemRow, {width: '23%'}]}>
                    <AntDesign name="calendar" color={'#000'} size={20}/>
                    <Text style={styles.itemTxt}> {item.tsDate}</Text> 
                  </View> 
                  <View style={styles.itemRow} >
                    <AntDesign name="user" color={'#000'} size={20}/>
                    <Text style={[styles.itemTxt]}>{item.Name} </Text> 
                  </View>
                  <View style={[styles.itemRow, {width: '20%'}]}>
                    <AntDesign name="clockcircle" color={'#000'} size={20}/>
                    <Text style={styles.itemTxt}> {item.Total}</Text> 
                  </View>
                  <View style={[styles.itemRow, {width: '20%'}]}>
                    <AntDesign name={item.icon} color={item.colour} size={25}/>
                  </View>
                </TouchableOpacity>
              }/>
          </View>
        </Display>
        <Display enable={EmployeeDisplay}>
          <View style={[styles.listContainer, {height: vh(30)}]}>
            <FlatList
              data={employeeData}
              renderItem={({item}) => 
                <TouchableOpacity onPress={() => EnableEmployeeOverlay(item)} style={styles.listItem}>
                  <View style={[styles.itemRow, {width: '40%'}]}>
                    <AntDesign name="user" color={'#000'} size={15}/>
                    <Text style={styles.itemTxt}> {item.name}</Text> 
                  </View> 
                  <View style={[styles.itemRow, {width: '60%'}]}>
                    <AntDesign name="mail" color={'#000'} size={15}/>
                    <Text style={[styles.itemTxt, {fontSize: 10}]}> {item.email}</Text> 
                  </View>
                </TouchableOpacity>
              }/>
            </View>
            <Text style={[styles.pageTxtLarge, {fontSize: 19, marginBottom: vh(0)}]}>New Employee Requests</Text>
            <View style={[styles.listContainer, {height: vh(20)}]}>
              <FlatList
                data={newEmp}
                renderItem={({item}) => 
                <TouchableOpacity style={styles.listItem}>
                  <View style={[styles.itemRow, {width: '80%'}]} >
                    <AntDesign name="user" color={'#000'} size={20}/>
                    <Text style={[styles.itemTxt, {fontSize: 15}]}>{item.name} </Text> 
                  </View>
                  <TouchableOpacity style={[styles.itemRow, {width: '10%'}]} onPress={() => AcceptEmployee(item)}>
                    <AntDesign name="checkcircle" color={'#0be'} size={25}/>
                  </TouchableOpacity>
                </TouchableOpacity>
              }/>
            </View>
        </Display>
        <Display enable={JobDisplay}>
          <View style={styles.listContainer}>
            <FlatList
              data={jobData}
              renderItem={({item}) => 
                <TouchableOpacity onPress={() => EnableJobOverlay(item)} style={styles.listItem}>
                  <View style={[styles.itemRow, {width: '20%'}]}>
                    <AntDesign name="tag" color={'#000'} size={20}/>
                    <Text style={styles.itemTxt}> {item.jobNumber}</Text> 
                  </View> 
                  <View style={[styles.itemRow, {width: '65%'}]}>
                    <AntDesign name="idcard" color={'#000'} size={20}/>    
                    <Text style={[styles.itemTxt, {fontSize: 11, paddingLeft: '2%'}]}>{item.jobName} </Text> 
                  </View>
                  <TouchableOpacity style={[styles.itemRow, {width: '8%'}]} onPress={() => DeleteJob(item)}>
                    <AntDesign name='closecircle' color={'#0be'} size={20}/>
                  </TouchableOpacity>
                </TouchableOpacity>
              }/>
          </View>
          <TouchableOpacity style={styles.createBtn} onPress={() => ToggleCreateJobOverlay()}>
            <Text style={styles.textLarge}>CREATE A NEW JOB</Text>
          </TouchableOpacity >
        </Display>
        
        <Overlay  isVisible={TSVisible} onBackdropPress={ToggleTSOverlay}>
          <View style={styles.DetailsModal}>
            <View style={[styles.itemDetails, {backgroundColor: '#0be', paddingHorizontal: '10%'}]}>
              <AntDesign name="user" color={'#fff'} size={25}/>
              <Text style={[styles.itemDetailsTxt, {fontSize: 20, color: '#fff'}]}> {details1} </Text>
            </View>
            <View style={styles.itemDetails}>
              <AntDesign name="calendar" color={'#000'} size={20}/>
              <Text style={[styles.itemDetailsTxt, {fontSize: 16}]}>{details2}</Text>
            </View>
            <View style={styles.itemDetails}>
              <AntDesign name="clockcircle" color={'#000'} size={20}/>
              <Text style={[styles.itemDetailsTxt, {fontSize: 16}]}>{details3}</Text>
            </View>
            <View style={[styles.itemDetails, {paddingVertical: 2}]}>
              <Text style={[styles.itemDetailsTxt, {fontSize: 16}]}>Start Time: </Text>
              <Text style={[styles.itemDetailsTxt, {fontSize: 16}]}>{selectedItem.StartTime}</Text>
            </View>
            <View style={[styles.itemDetails, {paddingVertical: 2}]}>
              <Text style={[styles.itemDetailsTxt, {fontSize: 16}]}>End Time: </Text>
              <Text style={[styles.itemDetailsTxt, {fontSize: 16}]}>{selectedItem.EndTime}</Text>
            </View>
            <View style={[styles.itemDetails, {paddingVertical: 2, display: (selectedItem.Status == "Waiting") ? 'none' : 'flex'}]}>
              <Text style={[styles.itemDetailsTxt, {fontSize: 16}]}>Status: </Text>
              <Text style={[styles.itemDetailsTxt, {fontSize: 16}]}>{selectedItem.Status}</Text>
            </View>
            <View style={[styles.listContainer, {height: '34%'}]}>
              <FlatList
                data={selectedItem.Jobs}
                renderItem={({item}) => 
                  <View style={styles.listItem}> 
                    <View style={[styles.itemRow, {marginLeft: '3%', width: '25%'}]} >
                      <AntDesign name="tag" color={'#000'} size={15}/>
                      <Text style={[styles.itemTxt1, {paddingLeft: '7%'}]}>{item.job} </Text> 
                    </View>
                    <View style={[{width: '55%'}]}>
                      <Text style={[styles.itemTxt2, {fontSize: 11}]}> {item.desc}</Text> 
                    </View>
                    <View style={styles.itemRow}>
                      <AntDesign name="clockcircle" color={'#000'} size={15}/>
                      <Text style={styles.itemTxt3}> {item.time}</Text> 
                    </View>
                  </View>}
                />
            </View>
          </View>
          <View style={[styles.row, {paddingVertical: 0,marginVertical: 0, display: (selectedItem.Status == "Waiting") ? 'flex' : 'none'}]}>
            <TouchableOpacity style={[styles.createBtn, { marginLeft: '15%', marginRight: '5%'}]} onPress={() => AcceptTS(selectedItem)}>
              <Text style={styles.textLarge}>Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.createBtn, { marginLeft: '5%', marginRight: '15%'}]} onPress={() => DeclineTS(selectedItem)}>
              <Text style={styles.textLarge}>Decline</Text>
            </TouchableOpacity>
          </View>
        </Overlay>
        <Overlay  isVisible={employeeVisible} onBackdropPress={ToggleEmployeeOverlay}>
            <View style={styles.DetailsModal}>
              <View style={[styles.itemDetails, {backgroundColor: '#0be', paddingHorizontal: '10%'}]}>
                <AntDesign name="user" color={'#fff'} size={20}/>
                <TextInput onChangeText={text => setDetails1(text)} editable={textEditable}
                  style={[styles.itemEditTxt, {fontSize: 25, color: '#fff', borderColor: '#fff', borderBottomWidth: textUnderline}]}>
                  {details1}
                </TextInput>
              </View>
              <View style={styles.itemDetails}>
                <AntDesign name="mail" color={'#000'} size={20}/>
                <TextInput onChangeText={text => setDetails2(text)} editable={textEditable} style={[styles.itemEditTxt, {borderBottomWidth: textUnderline}]}>
                  {details2}
                </TextInput>
              </View>
              <View style={styles.itemDetails}>
                <AntDesign name="phone" color={'#000'} size={20}/>
                <TextInput onChangeText={text => setDetails3(text)} editable={textEditable} style={[styles.itemEditTxt, {borderBottomWidth: textUnderline}]}>
                  {details3}
                </TextInput>
              </View>
            </View>
            <TouchableOpacity style={[styles.createBtn, {margin: 'auto'}]} onPress={() => DeleteEmployee(selectedItem)}>
              <AntDesign name={overlayBtn2} color={'#fff'} size={30}/>
            </TouchableOpacity>
          </Overlay>
        <Overlay  isVisible={jobVisible} onBackdropPress={ToggleJobOverlay}>
          <View style={{maxHeight: 580}}>
            <View style={styles.DetailsModal}>
              <View style={[styles.itemDetails, {backgroundColor: '#0be', paddingHorizontal: '30%'}]}>
                <AntDesign name="tag" color={'#fff'} size={25}/>
                <Text style={[styles.itemDetailsTxt, {fontSize: 25, color: '#fff'}]}> {details1} </Text>
              </View>
              <View style={styles.jobDetails}>
                <AntDesign name="idcard" color={'#000'} size={20}/>
                <TextInput placeholder="Job Name" onChangeText={text => setDetails2(text)} editable={textEditable} 
                style={[styles.itemEditTxt, {borderBottomWidth: textUnderline, marginVertical: (creatingJob) ? 8 : 2}]}>
                  {details2}
                </TextInput>
              </View>
              <View style={styles.jobDetails}>
                <AntDesign name="user" color={'#000'} size={20}/>
                <TextInput placeholder="Client Name" onChangeText={text => setDetails3(text)} editable={textEditable} 
                style={[styles.itemEditTxt, {borderBottomWidth: textUnderline, marginVertical: (creatingJob) ? 8 : 0}]}>
                  {details3}
                </TextInput>
              </View>
              <View style={styles.jobDetails}>
                <AntDesign name="enviroment" color={'#000'} size={20}/>
                <TextInput placeholder="Job Location" onChangeText={text => setDetails4(text)} editable={textEditable} 
                style={[styles.itemEditTxt, {borderBottomWidth: textUnderline, marginVertical: (creatingJob) ? 8 : 0}]}>
                  {details4}
                </TextInput>
              </View>
              <View style={styles.jobDetails}>
                <AntDesign name="phone" color={'#000'} size={20}/>
                <TextInput placeholder="Client's Contact" onChangeText={text => setDetails5(text)} editable={textEditable} 
                style={[styles.itemEditTxt, {borderBottomWidth: textUnderline, marginVertical: (creatingJob) ? 8 : 0}]}>
                  {details5}
                </TextInput>
              </View>
              <View style={styles.jobDetails}>
                <AntDesign name="mail" color={'#000'} size={20}/>
                <TextInput placeholder="Client's Email" onChangeText={text => setDetails6(text)}editable={textEditable} 
                style={[styles.itemEditTxt, {borderBottomWidth: textUnderline, marginVertical: (creatingJob) ? 8 : 0}]}>
                  {details6}
                </TextInput>
              </View>
              <View style={styles.jobDetails}>
                <AntDesign name="clockcircle" color={'#000'} size={20}/>
                <TextInput placeholder="Time Spent (Hours)" onChangeText={text => setDetails7(text)}editable={textEditable} 
                style={[styles.itemEditTxt, {borderBottomWidth: textUnderline, marginVertical: (creatingJob) ? 8 : 0}]}>
                  {details7}
                </TextInput>
              </View>
            </View>
            <View style={[styles.listContainer, {marginVertical: '3%', height: '33%', display: (creatingJob) ? 'none' : 'flex'}]}>
            <FlatList
              data={tasks}
              renderItem={({item}) => 
                <TouchableOpacity style={styles.listItem}>
                  <View style={[styles.itemRow, {width: '27%'}]} >
                    <AntDesign name="user" color={'#000'} size={20}/>
                    <Text style={[styles.itemTxt]}>{item.Name} </Text> 
                  </View>
                  <View style={[styles.itemRow, {width: '45%', marginRight: '10%'}]}>
                    <AntDesign name="message1" color={'#000'} size={20} style={{alignSelf: 'center', marginRight: '3%'}}/>
                    <Text style={[styles.itemTxt, {fontSize: 10, fontWeight: 'normal'}]}> {item.Desc}</Text> 
                  </View> 
                  <View style={[styles.itemRow, {width: '9%'}]}>
                    <AntDesign name="clockcircle" color={'#000'} size={20}/>
                    <Text style={styles.itemTxt}> {item.Time}</Text> 
                  </View>
                </TouchableOpacity>
              }/>
            </View>
              <View style={styles.row}>
                <TouchableOpacity style={[styles.createBtn, {marginLeft: '30%', marginRight: '5%'}]} onPress={EditJob}>
                  <AntDesign name={overlayBtn1} color={'#fff'} size={30}/>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.createBtn, {marginLeft: '5%', marginRight: '30%'}]} onPress={() => DeleteJob(selectedItem)}>
                  <AntDesign name={overlayBtn2} color={'#fff'} size={30}/>
                </TouchableOpacity>
              </View>
            </View>
          </Overlay>
       
      </View>
    </View>
    );
}
const styles = StyleSheet.create({

  row: {
    alignSelf: 'center',
    width: 300,
    flexDirection: 'row',
  },

  itemDetails:{
    alignItems: 'center',
    paddingVertical: 10,
    width: 'auto',
    paddingHorizontal: '10%',
    borderRadius: 5,
    flexDirection: 'row',
    marginVertical: 10,
  },

  jobDetails:{
    alignItems: 'center',
    paddingVertical: 2,
    width: 300,
    paddingHorizontal: '10%',
    borderRadius: 5,
    flexDirection: 'row',
    marginVertical: 3,
  },

  itemDetailsTxt: {
    textAlign: 'center',
    color: '#000',
    fontWeight: 'bold',
    paddingHorizontal: 5,
  },

  itemEditTxt: {
    marginLeft: 10,
    textAlign: 'left',
    color: '#000',
    fontWeight: 'bold',
    paddingHorizontal: 5,
    minWidth: 180, 
    borderColor: '#00bbee', 
    fontSize: 16
  },


  DetailsModal: {
    width: '90%',
    minWidth: 300,
    minHeight: 300,
    height: 'auto',
    paddingVertical: 0,
    marginVertical: 0,
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
    height: 300
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
    width: '32%',
    flexDirection: 'row',
    alignSelf: 'center',
    marginLeft: '2%'
  },

  optionsBar:{
      backgroundColor: '#fff',
      width: '100%',
      borderBottomLeftRadius: 15,
      borderBottomRightRadius: 15,
    },

    btnHolder: {
      flexDirection: 'row',
      width: '100%',
      maxWidth: 700,
      alignSelf: 'center',
    },

    navBtns:{
      backgroundColor: '#0be',
      borderRadius: 5,
      marginVertical: vh(2),
      marginHorizontal: '1.5%',
      width: '34%',
      maxWidth: 300,
    },

    textMedium: {
      alignSelf: 'center',  
      marginVertical: 10,
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },

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
      fontSize: 16,
    },
  
    input: {
      width: '50%',
      alignContent: 'center',
      padding: '1%',
      borderBottomWidth: 2,
      borderColor: '#00bbee'
    },

    createInput: {
      width: '75%',
      alignContent: 'center',
      padding: '1%',
      marginHorizontal: '12.5%',
      borderBottomWidth: 2,
      borderColor: '#00bbee'
    },

    createBtn: {
      paddingHorizontal: '2%',
      paddingVertical: '1%',
      backgroundColor: '#0be',
      borderRadius: 5,
      marginVertical: vh(2),
      alignSelf: 'center',
      maxWidth: 250,
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
      width: '98%',
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
    
    container: {
      flex: 1,
      backgroundColor: '#ddd',
      alignItems: 'flex-start',
      flexDirection: 'column'
    },
  
});
  
  