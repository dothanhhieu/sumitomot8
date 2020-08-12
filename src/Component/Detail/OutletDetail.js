import React, { Component } from 'react';

import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
  Alert,
  PermissionsAndroid
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import moment from "moment";
import Geolocation from 'react-native-geolocation-service';

const options = {
  exif: true,
  allowsEditing: false,
  quality: 0.5,
  base64: true,
  maxWidth: 1000,
  maxHeight: 1000,
  storageOptions: {
      skipBackup: true,
      cameraRoll: true
  }
}

export default class OutletDetail extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "MS Đại Lý",
      headerStyle: {
        backgroundColor: '#143146',
      },
      headerTintColor: '#fff',
      headerBackTitle: null
    };
  };

  constructor(props) {
    super(props);
    this.outletParam = this.props.navigation.state.params;
    this.state = {
      datas: [],
      long: '',
      lat: '',
      imageBase64: '',
      time: moment().format("DD/MM/YYYY HH:mm:ss")
    }
  }

  componentDidMount() {
    this.getLocation()
  }

  renderButton() {
    return(
      <View style={styles.viewButton}>
        <TouchableOpacity style={styles.touchLogin} onPress={() => this.pressCapture()} >
            <Text style={styles.btnStyle}>HÌNH ẢNH TỔNG QUAN</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.touchLogin} onPress={() => this.giveAGift()} >
            <Text style={styles.btnStyle}>TRAO QUÀ ĐẠI LÝ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.touchLogin} onPress={() => this.giveAGift()} >
            <Text style={styles.btnStyle}>THÊM NÔNG DÂN</Text>
        </TouchableOpacity> 
      </View>
    )
  }

  giveAGift() {
    this.props.navigation.navigate('UpdateAddress', this.outletParam)
  }

  render() {
    return (
      <View style={styles.viewContent}>
        {this.renderButton()}
      </View>
    )
  }

//********************** Camera *****************************************/
    pressCapture = () => {
    ImagePicker.launchCamera(options, (response) => {
        if (response.didCancel) {
            console.log('User cancelled image picker');
        } else if (response.error) {
            Alert.alert(
              'Thông báo',
              'Không thể truy cập máy ảnh, vui lòng vào cài đặt để cấp quyền cho ứng dụng',
              [
                  {
                      text: 'Để sau',
                      onPress: () => console.log('Permission denied'),
                      style: 'cancel',
                  },
                  { text: 'OK' },
              ],
              { cancelable: false }
            )
        } else {
            this.setState({
                imageBase64: response.data
            });
        }
    });
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
    margin:10
  }
});