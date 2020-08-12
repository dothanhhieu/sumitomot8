import React, { Component } from 'react';

import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  PermissionsAndroid
} from 'react-native';
import NavigationOptions from './NavigationOptions'
import InputType from '../../Global/InputType';
import QuestionForm from '../../Global/QuestionForm';
import { ScrollView } from 'react-native-gesture-handler';
import DropdownType from '../../Global/DropdownType';
import { Header } from 'react-navigation';
import moment from "moment";
import Geolocation from 'react-native-geolocation-service';
import * as API from '../../API';
export default class Receiver extends Component {
  static navigationOptions = NavigationOptions

  constructor(props) {
    super(props);
    this.outletParam = this.props.navigation.state.params;
    this.state = {
      name:'',
      phone:'',
      long: '',
      lat: '',
      time: moment().format("DD/MM/YYYY HH:mm:ss"),
    }
  }

  componentDidMount() {
    this.getLocation()
}

  renderButton(title) {
      return (
        <View style={styles.viewButton}>
          <TouchableOpacity style={styles.touchLogin} onPress={() => this.updateInfo()}>
            <Text style={styles.btnStyle}>Gửi thông tin</Text>
          </TouchableOpacity>
        </View>
      )
  }

  renderInfo() {
      return (
        <View>
          <InputType
            title={"Tên người nhận quà(*)"}
            value={this.state.name}
            marginView={10}
            editText={true}
            textValue={this.textValue.bind(this)}
            placeHolder={"Nhập tên người khảo sát ..."}
          />
          <InputType
            title={"Điện thoại(*)"}
            value={this.state.phone}
            marginView={10}
            editText={true}
            keyboardType='phone-pad'
            textValue={this.textValue.bind(this)}
            placeHolder={"Nhập số điện thoại ..."}
          />
        </View>
      )
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.viewContent} behavior="padding" enabled={Platform.OS === 'ios' ? true : false}  keyboardVerticalOffset = {Header.HEIGHT + 20}>
        <ScrollView>
          {this.renderInfo()}
        </ScrollView>
        {this.renderButton(this.state.titleButton)}
      </KeyboardAvoidingView>
    )
  }

//********************** Handle *****************************************/

removeObjectDuplicate() {
  var arrListInfo = this.state.listInfo
  var arrCheck = [{'QuestionID':1},{'QuestionID':2},{'QuestionID':3},{'QuestionID':4},{'QuestionID':5},{'QuestionID':6},{'QuestionID':7}]
    
  this.state.listInfo = arrListInfo.filter(item => !arrCheck.some(itemToRemove => item.QuestionID === itemToRemove.QuestionID));
}

addObjListInfo(questionID, questionType, questionGroup, datePost, Answer) {
  let obj = {
    "QuestionID": questionID,
    "QuestionType": questionType,
    "QuestionGroup": questionGroup,
    "Long":this.state.long,
    "Lat":this.state.lat,
    "DatePost":datePost,
    "Answer": Answer
  }
  this.state.listInfo.push(obj)
}

  updateInfo = async () => {
      if((this.state.name === '')||(this.state.phone === '')) {
        alert('Vui lòng nhập họ tên, điện thoại người khảo sát')
      }
      else {
        if(this.mobileValidate(this.state.phone)) {

          let clone =  this.outletParam
          clone.listInfo = this.state.listInfo
          clone.lat = this.state.lat
          clone.long = this.state.long
          clone.datePost = this.state.time

          console.log(this.state.role)
          this.props.navigation.navigate('Question_1', clone)
        }
        else {
          alert('Số điện thoại không hợp lệ')
        }
      }
  }

  textValue(title, value) {
    switch (title) {
      case "Tên người được khảo sát(*)": this.setState({ name: value })
          break;
      case "Điện thoại(*)": this.setState({ phone: value })
          break;
      case "Email": this.setState({ email: value })
          break;          
      default: break
      }
  }

  selectedValue(title, value) {
    if (value === 'Khác') {
      this.setState({roleOther: true})
    }
    else {
      this.setState({ role: value, roleOther: false })
    }
  }
  
  //******************** Handle ***************************************/
  //validate phone
  mobileValidate(text) {
    var phoneInput = text
    if (phoneInput.charAt(0) === '0' && text.length == 10) {

      return true;
    }

    return false;
  }
    
  //******************** API ***************************************/
  postDataInfo() {
    this.setState({showIndicator: true})
    let obj = {
      "EventStoreID": this.outletParam.eventStoreID,
      "StaffID": this.outletParam.idStaff,
      "ChannelShiftID":this.outletParam.channelShiftID,
      "Note": "Cooler1234",
      "DatePost": this.state.time,
      "StatusSendStore":1,
      "Listinfo":this.state.listInfo,
      'SendStoreID': this.outletParam.SendStoreID
    }
    API.postInfo(obj)
        .then(result => {
            if (result.status) {
                Alert.alert(
                    'Thông báo',
                    'Gửi thông tin thành công',
                    [
                        { text: 'OK', onPress: () => this.props.navigation.popToTop() },
                    ],
                    { cancelable: false }
                )
            }
            else {
                Alert.alert(
                    'Thông báo',
                    result.messenger,
                    [
                        { text: 'OK' },
                    ],
                    { cancelable: false }
                )
            }
            //set ActivityIndicator OFF
            this.setState({
                showIndicator: false
            })

        })
}

  /***********************Location ***************/
  hasLocationPermission = async () => {
    if (Platform.OS === 'ios' ||
        (Platform.OS === 'android' && Platform.Version < 23)) {
        return true;
    }

    const hasPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    if (hasPermission) return true;

    const status = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) return true;

    if (status === PermissionsAndroid.RESULTS.DENIED) {
        ToastAndroid.show('Location permission denied by user.', ToastAndroid.LONG);
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        ToastAndroid.show('Location permission revoked by user.', ToastAndroid.LONG);
    }

    return false;
}

getLocation = async () => {
    const hasLocationPermission = await this.hasLocationPermission();
    if (!hasLocationPermission) return;
    this.setState({ loading: true }, () => {
        Geolocation.getCurrentPosition(
            (position) => {
                console.log(position.coords.latitude)
                console.log(position.coords.longitude)

                this.setState({ lat: position.coords.latitude, long: position.coords.longitude });
            },
            (error) => {
                console.log(error);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000, distanceFilter: 50 }
        );
    });
}
}

const styles = StyleSheet.create({
  viewContent: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    justifyContent: 'space-between'
  },
  touchLogin: {
    backgroundColor: '#7cd036',
    marginTop: 20,
    width: Dimensions.get('window').width - 20,
    height: 44,
    justifyContent: "center",
    alignItems: 'center',
    borderRadius: 2
  },
  btnStyle: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
  },
  viewButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 10
  }
});