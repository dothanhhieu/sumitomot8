import React, { Component } from 'react';

import {
  StatusBar,
  Platform,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Alert
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import * as API from '../../API';
import AsyncStorage from '@react-native-community/async-storage';

export default class Login extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      phone: '',
      pass: '',
      loading: false,
      visible: false,
      disabled: false
    }
  }

  renderTextPhoneInput() {
    return (
      <View style={styles.inpTextWrapper}>
        <Image
          source={require('../../Assets/Images/phone.png')}
          style={styles.imgLeftInpText}
          resizeMode={'contain'} />
        <TextInput
          placeholder={'Tên đăng nhập'}
          underlineColorAndroid={'transparent'}
          style={styles.inpText}
          onChangeText={(text) => { this.setState({ phone: text }) }}
          value={this.state.phone}
        />
      </View>
    );
  }

  renderTextPassInput() {
    return (
      <View style={styles.inpTextWrapper}>
        <Image
          source={require('../../Assets/Images/block.png')}
          style={styles.imgLeftInpText}
          resizeMode={'contain'} />
        <TextInput
          placeholder={'Mật khẩu'}
          underlineColorAndroid={'transparent'}
          style={styles.inpText}
          onChangeText={(text) => { this.setState({ pass: text }) }}
          value={this.state.pass}
          secureTextEntry={true}
        />
      </View>
    );
  }

  loginLoading() {
    return (
      <TouchableOpacity style={styles.touchLogin} onPress={this._signInAsync} disabled={this.state.disabled}>
        {this.state.loading ?
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.btnLog}> ĐĂNG NHẬP </Text>
            <ActivityIndicator size="small" color="white" />
          </View> :
          <Text style={styles.btnLog}> ĐĂNG NHẬP </Text>
        }
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <ScrollView style={styles.main}>
        <StatusBar
          backgroundColor="#EFEFEF"
          barStyle="light-content"
        />
        <KeyboardAvoidingView
          behavior="padding"
          enabled={Platform.OS == 'ios' ? true : false}
          style={styles.keyAvoidView}>
          <Image
            source={require('../../Assets/Images/logo.png')}
            style={styles.logo}
            resizeMode={'contain'} />
          {this.renderTextPhoneInput()}
          {this.renderTextPassInput()}
          {this.loginLoading()}
          <Text style={{color: "#b2bec3", fontSize:10, marginTop:50}}>Version 1.0</Text>
        </KeyboardAvoidingView>
      </ScrollView>
    );
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

  //validate text input
  checkDataInput(phone, pass) {
    if (phone !== "" && pass !== "") {

      return true;
    }

    return false
  }

  //sigin handle
  _signInAsync = async () => {
    this.setState({
      loading: true,
      disabled: true
    })
    let validateInput = this.checkDataInput(this.state.phone, this.state.pass)

    if (validateInput) {
      //call API
      let data = {
        UserName: this.state.phone,
        PassWord: this.state.pass
      }
      this.loginAPI(data)
    }
    else {
      Alert.alert(
        'Thông báo',
        'Vui lòng điền đầy đủ thông tin',
        [
            { text: 'OK', onPress: () => this.props.navigation.goBack() },
        ],
        { cancelable: false }
      )
      this.setState({
        loading: false,
        disabled: false
      })
    }
  };

  //********************** API *****************************************/
  loginAPI(data) {
    API.login(data)
      .then(async res => {
        this.setState({
          loading: false,
          disabled: false
        })
        if (res.status) {
          try {
            console.log(res.result.accounts)
            console.log(res.result.detailEvent.eventID)

            await AsyncStorage.setItem('accounts', JSON.stringify(res.result.accounts));
            await AsyncStorage.setItem('eventID', JSON.stringify(res.result.detailEvent.eventID));
            this.props.navigation.navigate('App');
          } catch (error) {
            alert("Không thể đăng nhập\nVui lòng thử lại")
          }
        } else {
          if (res.message != undefined && res.message != null) {
            alert(res.message)
          }
        }
      })
      .catch(error => {
        console.log(error)
        alert("Không thể đăng nhập\nVui lòng thử lại")
      })
  }
}

const styles = StyleSheet.create({
  main: { 
    backgroundColor: '#ffffff',
  },
  keyAvoidView: {
    flex: 1,
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginTop: 100,
  },
  inpTextWrapper: {
    alignItems: 'center',
    margin: 40,
    marginBottom: 0,
    marginTop: 10,
    flexDirection: 'row',
    backgroundColor: '#F8F8F8',
    padding: 10,
    height: 44,
    borderRadius: 2
  },
  imgLeftInpText: {
    width: 15,
    height: 15
  },
  inpText: {
    flex: 1,
    paddingLeft: 10,
    padding: 0
  },
  btnLog: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
    margin: 12
  },
  touchLogin: {
    backgroundColor: '#e84118',
    marginTop: 20,
    width: Dimensions.get('window').width - 80,
    height: 44,
    justifyContent: "center",
    alignItems: 'center',
    borderRadius: 2
  }
})