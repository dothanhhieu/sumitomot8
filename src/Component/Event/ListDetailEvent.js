import React, { Component } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  AsyncStorage,
  Alert,
  Image,
  TextInput,
  Keyboard
} from 'react-native';
import * as API from '../../API';
import moment from "moment";
import GetLocation from 'react-native-get-location'

export default class ListDetailEvent extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: 'SUMITOMO T8',
      headerStyle: {
        backgroundColor: '#e84118',
      },
      headerTintColor: '#fff',
      headerBackTitle: null,
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      idStaff: '',
      data: '',
      roleID: '',
      eventID: '',
      keyword:'',
      channelShiftID: '',
      long: '',
      lat: '',
      statusLocation: ''
      }
  }

  componentDidMount() {
    this.getLocation()
    console.log(this.dataParam)
  }

  async loadData() {
    try {
      let userData = JSON.parse(await AsyncStorage.getItem('accounts'))
      let eventID = JSON.parse(await AsyncStorage.getItem('eventID'))

      this.setState({
        idStaff: userData.staffID,
        roleID: userData.role,
        eventID: eventID,
        channelShiftID: userData.channelShiftID,
      })

      this.getListStore(eventID, userData.staffID, userData.role, '')

    } catch (e) {
      alert(e)
    }
  }

  componentWillUnmount() {
    this.reRenderSomething;
  }

  componentDidMount() {
    this.reRenderSomething = this.props.navigation.addListener('willFocus', () => {
      this.loadData();
      this.getLocation()
    });
  }

  renderSearchInput() {
    return (
      <View style={styles.viewContentSearch}>
        <View style={styles.viewItemSearch}>
          <Image
            source={require('../../Assets/Images/search.png')}
            style={{ width: 20, height: 20, marginLeft: 10 }}
          />
          <TextInput
            placeholder={'Tìm kiếm ...'}
            underlineColorAndroid={'transparent'}
            style={styles.textInputSearch}
            onChangeText={(text) => { this.setState({ keyword: text }) }}
            value={this.state.keyword}
          />
          <TouchableOpacity onPress={() => { Keyboard.dismiss(), this.searchHandle() }} style={styles.btnSearch}>
            <Text style={styles.textSearch}>Tìm</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  /*********** FlatList Item Render *************/
  _rendItem = ({ item, index }) => {
    return (
      <TouchableOpacity style={styles.viewRenderItem} onPress={() => this.handlePush(item)} >
        <View style={styles.viewContentItem}>
          <Text style={styles.textNameStore}>{item.nameStore}</Text>
          <View style={styles.viewPhoneKey}>
            <Text style={styles.textItem}>{item.address}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View
        style={styles.viewContent}>
        {this.renderSearchInput()}
        <FlatList
          data={this.state.data}
          renderItem={this._rendItem}
          keyExtractor={(item, index) => (item + index)}
          initialNumToRender={4}
          style={{ backgroundColor: '#F8F8F8' }}
        />
        {this.renderButtonLogout()}
      </View>
    )
  }

  renderButtonLogout() {
    return (
      <View style={styles.viewButton}>
        <TouchableOpacity style={styles.btnStyle} onPress={this._signOutAsync}>
          <Text style={styles.btnTextStyle}>ĐĂNG XUẤT</Text>
        </TouchableOpacity>
      </View>
    )
  }

  _signOutAsync = async () => {
    await AsyncStorage.removeItem('accounts');
    await AsyncStorage.removeItem('eventID');
    this.props.navigation.navigate('AuthLoading')
  }

  handlePush(item) {
    if (this.state.statusLocation !== 'UNAUTHORIZED') {
        let dataParam = {
        "EventStoreID": item.eventStoreID,
        "StaffID": this.state.idStaff,
        "ChannelShiftID": this.state.channelShiftID,
        "Note": "Sumitomo T8",
        "DatePost": moment().format("DD/MM/YYYY HH:mm:ss"),
        "ListInfo": [
          {
            "QuestionID": 1,
            "QuestionType": 1,
            "QuestionGroup": 1,
            "Long": this.state.long,
            "Lat": this.state.lat,
            "DatePost": moment().format("DD/MM/YYYY HH:mm:ss"),
            "Answer": ""
          }
        ]
      }
      Alert.alert(
        'Khảo sát',
        'Đại lý có tham gia trưng bày không?',
        [
          {
            text: 'Có',
            onPress: () => this.postInfoAPI(dataParam, 'Có'),
            style: 'cancel',
          },
          {
            text: 'Không',
            onPress: () => this.postInfoAPI(dataParam, 'Không'),
            style: 'cancel',
          }
        ],
        { cancelable: false }
      )
    }
    else {
      alert(`Không thể lấy vị trí thiết bị`)
    }
  }
  

//********************** API *****************************************/
postInfoAPI(paramObj, value) {
  //  let param = {
  //   idStaff: this.state.idStaff,
  //   roleID: this.state.roleID,
  //   eventID: this.state.eventID,
  //   eventStoreID: paramObj.EventStoreID,
  //   channelShiftID: this.state.channelShiftID,
  //   long: this.state.long,
  //   lat: this.state.lat
  // }
  // this.props.navigation.navigate('NotSurvey', param)

  if(value === 'Có') { 
    paramObj.ListInfo[0].Answer = 1
  }
  else {
    paramObj.ListInfo[0].Answer = 0
  }
  let param = {
    idStaff: this.state.idStaff,
    roleID: this.state.roleID,
    eventID: this.state.eventID,
    eventStoreID: paramObj.EventStoreID,
    channelShiftID: this.state.channelShiftID,
    long: this.state.long,
    lat: this.state.lat,
  }
  console.log(paramObj)
  API.postInfo(paramObj, value)
    .then(result => {
      if(result.status) {
        if(value === 'Có') {
          console.log('da vao')
          this.props.navigation.navigate('DetailEvent', param)
        }
        else {
          this.props.navigation.navigate('NotSurvey', param)
        }
      }
      else {
        alert(result.message)
      }
    })
    .catch(err => {
      Alert.alert(
        'Thông báo',
        'Không thể gửi thông tin',
        [
          { text: 'OK' },
        ],
        { cancelable: false }
      )
    })
}

getListStore(eventID, idStaff, roleID, keyword) {
  API.getListStore(eventID, idStaff, roleID, keyword)
    .then(results => {
      console.log(results)
      if (results.status) {
        this.setState({ data: results.result })
      }
    })
}

  //******************** Handle ***************************************/
  searchHandle() {
    this.getListStore(this.state.eventID, this.state.idStaff, this.state.roleID, this.state.keyword)
  }

/***********************Location ***************/
async getLocation()  {
  await GetLocation.getCurrentPosition({
    enableHighAccuracy: true,
    timeout: 15000,
  })
    .then(location => {
      console.log(location);
      this.setState({
        'long': location.longitude,
        'lat': location.latitude
      })
    })
    .catch(error => {
      const { code, message } = error;
      this.setState({
        'statusLocation': code
      })
      console.warn(code, message);
      console.log(code);
      console.log(message);
    })
}
}

const styles = StyleSheet.create({
  /* View Render */
  viewRenderItem: {
    backgroundColor: 'white',
    marginTop: 10
  },
  viewContentItem: {
    margin: 10
  },
  textNameStore: {
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 5,
    marginBottom: 5,
    color: '#143146'
  },
  viewContent: {
    flex: 1,
    backgroundColor: '#F8F8F8'
  },
  textItem: {
    fontWeight: '300',
  },
  btnStyle: {
    backgroundColor: '#e84118',
    marginTop: 20,
    width: Dimensions.get('window').width - 20,
    height: 44,
    justifyContent: "center",
    alignItems: 'center',
    borderRadius: 2
  },
  btnTextStyle: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
  },
  viewButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 10
  },
  viewContentSearch: {
    backgroundColor: '#F8F8F8',
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textInputSearch: {
    margin: 5,
    height: 35,
    marginRight: 8,
    backgroundColor: 'white',
    borderRadius: 21,
    flex: 1
  },
  viewItemSearch: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    height: 40,
    width: '97%',
    borderRadius: 21
  },
  btnSearch: {
    backgroundColor: '#D8D8D8',
    width: 64,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5
  },
  textSearch: {
    color: 'black',
    fontSize: 15
  }
  ,
  inpTextWrapper: {
      alignItems: 'center',
      marginBottom: 0,
      marginTop: 10,
      flexDirection: 'row',
      backgroundColor: 'white',
      padding: 10,
      height: 44,
      borderRadius: 2,
      borderWidth: 0.5,
      borderColor: '#636e72',
      height: 40
  },
});