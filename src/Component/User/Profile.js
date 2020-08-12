import React, { Component } from 'react';

import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert
} from 'react-native';
import FlashMessage from "react-native-flash-message";
import NavigationOptions from './NavigationOptions'
import AsyncStorage from '@react-native-community/async-storage';
import * as API from '../../API';

export default class Profile extends Component {
  static navigationOptions = NavigationOptions

  constructor(props) {
    super(props);
    this.state = {
        id: '',
        name: '',
        phone: '',
        surveyed: '',
        notYetSurveyed: '',
        reAudit: '',
        idStaff: '',
        roleID: '',
        eventID: ''
    }
  }

  async componentDidMount() {
    try {
        let userData = JSON.parse(await AsyncStorage.getItem('accounts'))
        let eventID = JSON.parse(await AsyncStorage.getItem('eventID'))

        this.setState({
            idStaff: userData.staffID,
            roleID: userData.role,
            eventID: eventID
        })
        this.getProfileAPI(eventID, userData.staffID)
    } catch (e) {
        alert(e)
    }
}

  renderProfile() {
    return (
      <View style={styles.viewHeader}>
        <Image source={require('../../Assets/Images/avatar.png')} style={styles.imgAvatar} />
        <Text style={styles.txtName}>{this.state.name}</Text>
        <Text style={styles.txtPhone}>{this.state.phone}</Text>
      </View>
    );
  }

  renderReport() {
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={styles.viewItem}>
          <Text style={styles.txtItem}>Đã khảo sát</Text>
          <Text style={styles.txtResult}>{this.state.surveyed}</Text>
        </View>
        <View style={styles.viewItem}>
          <Text style={styles.txtItem}>Chưa khảo sát</Text>
          <Text style={styles.txtResult}>{this.state.notYetSurveyed}</Text>
        </View>
        <View style={styles.viewItem}>
          <Text style={styles.txtItem}>Khảo sát lại</Text>
          <Text style={styles.txtResult}>{this.state.reAudit}</Text>
        </View>
      </View>
    )
  }

  renderSum() {
    let sum = parseInt(this.state.surveyed, 10) + parseInt(this.state.notYetSurveyed, 10) + parseInt(this.state.reAudit, 10)
    return (
      <View style={styles.viewSum}>
        <Text style={styles.txtItem}>TỔNG: <Text style={styles.txtSum}>{sum}</Text></Text>
      </View>
    )
  }

  renderButton() {
    return (
      <TouchableOpacity style={styles.touchLogout} onPress={this._signOutAsync}>
        <Text style={styles.txtLogout}>ĐĂNG XUẤT</Text>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={styles.viewContent}>
        <View>
          {this.renderProfile()}
          {this.renderReport()}
          {this.renderSum()}
        </View>
        <View>
          {this.renderButton()}
        </View>
        <FlashMessage position="top" />
      </View>
    )
  }

  //********************** API *****************************************/
  _signOutAsync = async () => {
    await AsyncStorage.removeItem('accounts');
    await AsyncStorage.removeItem('eventID');
    this.props.navigation.navigate('AuthLoading')
  }

  getProfileAPI(eventId, userId) {
    API.getProfile(eventId, userId)
    .then(objResult => {
      if (objResult.status) {
        this.setState({
          name: objResult.result.name,
          phone: objResult.result.userName,
          surveyed: objResult.result.run,
          notYetSurveyed: objResult.result.processing,
          reAudit: objResult.result.rework
        })
      }
      else {
        Alert.alert(
          'Thông báo',
          objResult.message,
          [
            { text: 'OK' },
          ],
          { cancelable: false }
        )
      }
    })
  }
}

const styles = StyleSheet.create({
  viewContent: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    justifyContent: 'space-between'
  },
  viewHeader: {
    justifyContent: "center",
    alignItems: 'center',
    marginTop: 20,
  },
  imgAvatar: {
    width: 80,
    height: 80,
  },
  txtName: {
    color: '#787E8C',
    fontSize: 15,
    fontWeight: '400',
    marginTop: 20
  },
  txtPhone: {
    color: '#787E8C',
    fontSize: 15,
    fontWeight: '400',
    marginTop: 5
  },
  viewSum: {
    width: '90%',
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
    margin: 10,
    marginTop: 25
  },
  viewItem: {
    width: 90,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
    margin: 10,
    marginTop: 25
  },
  txtItem: {
    color: '#999999',
    fontSize: 12
  },
  txtSum: {
    fontSize: 20,
    color: '#FF6B03',
    fontWeight: '500'
  },
  txtResult: {
    fontSize: 16,
    color: '#FF6B03',
    fontWeight: '500'
  },
  txtLogout: {
    color: 'white',
    fontWeight: 'bold'
  },
  touchLogout: {
    backgroundColor: '#FAB863',
    marginLeft: 10,
    marginBottom: 10,
    marginRight: 10,
    height: 44,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center'
  }
});