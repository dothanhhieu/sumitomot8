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
    ActivityIndicator,
    PermissionsAndroid,
    Keyboard
} from 'react-native';
import InputType from '../../Global/InputType';
import { ScrollView } from 'react-native-gesture-handler';
import { Header } from 'react-navigation';
import { exProvince, exProvinceName } from '../../API/SampleAPI';
import * as API from '../../API';
import moment from "moment";
import Geolocation from 'react-native-geolocation-service';
import Permissions from 'react-native-permissions';

export default class CreateStore extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: "Thêm đại lý",
            headerStyle: {
                backgroundColor: '#143146',
            },
            headerTintColor: '#fff',
            headerBackTitle: null
        };
    };

    constructor(props) {
        super(props);
        this.dataParam = this.props.navigation.state.params;
        this.state = {
            nameStore: '',
            address: '',
            phone: '',
            datePost: moment().format("DD/MM/YYYY HH:mm:ss"),
            long: '',
            lat: '',
            disabledButton: false,
            locationPermission:''
        }
    }

    componentDidMount() {
        this.getLocation()
    }

    renderOutletName() {
        return (
            <View>
                <InputType
                    title={"Tên đại lý"}
                    value={this.state.nameStore}
                    marginView={10}
                    editText={true}
                    textValue={this.textValue.bind(this)}
                />
                <InputType
                    title={"Điện thoại liên hệ"}
                    value={this.state.phone}
                    keyboardType='phone-pad'
                    marginView={10}
                    editText={true}
                    textValue={this.textValue.bind(this)}
                />
                <InputType
                    title={"Địa chỉ"}
                    value={this.state.noStore}
                    marginView={10}
                    editText={true}
                    textValue={this.textValue.bind(this)}
                />
            </View>
        )
    }

    renderButton() {
        return (
            <View style={styles.viewButton}>
                <TouchableOpacity style={styles.touchLogin} onPress={() => this.createStore()} disabled={this.state.disabledButton}>
                    {this.state.showIndicatorUpdate ? <ActivityIndicator size="small" color="#0000ff" style={{ marginRight: 5 }} /> : null}   
                    <Text style={styles.btnStyle}>THÊM ĐẠI LÝ</Text>
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        return (
            <KeyboardAvoidingView style={styles.viewContent} behavior="padding" enabled={Platform.OS === 'ios' ? true : false} keyboardVerticalOffset={Header.HEIGHT + 25}>
                <ScrollView>
                    {this.renderOutletName()}
                </ScrollView>
                {this.renderButton()}
            </KeyboardAvoidingView>
        )
    }

    textValue(title, value) {
        switch (title) {
            case "Tên đại lý": this.setState({ 'nameStore': value })
                break;
            case "Địa chỉ": this.setState({ 'address': value })
                break;
            case "Điện thoại liên hệ": this.setState({ 'phone': value })
                break;
            default: break
        }
    }

    mobileValidate(text) {
        var phoneInput = text
        if (phoneInput.charAt(0) === '0' && ((text.length == 10) || (text.length == 11))) {
    
          return true;
        }
    
        return false;
      }

    //********************** Handle API ************************************
    checkPermissionLocationSetting() {
        Permissions.request('location').then(response => {
            // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
            if (response !== 'authorized') {
                Alert.alert(
                    'Thông báo',
                    'Không thể truy cập vị trí, vui lòng vào cài đặt để cấp quyền cho ứng dụng',
                    [
                        {
                            text: 'Để sau',
                            onPress: () => console.log('Permission denied'),
                            style: 'cancel',
                        },
                        Platform.OS === 'ios'
                            ? { text: 'Mở cài đặt', onPress: Permissions.openSettings }
                            : { text: 'OK' },
                    ],
                    { cancelable: false }
                )
            }
            else {
                this.createStoreAPI()
            }
        });
    }
    // Create Store
    createStore() {
        Keyboard.dismiss()
        if(this.mobileValidate(this.state.phone)) {
            this.checkPermissionLocationSetting()
        }
        else {
            Alert.alert(
                'Thông báo',
                'Số điện thoại không hợp lệ, vui lòng kiểm tra lại số điện thoại',
                [
                    { text: 'OK' },
                ],
                { cancelable: false }
            )
        }
    }

    createStoreAPI() {
        this.setState({showIndicatorUpdate: true, disabledButton: true})
        let obj = {
            "NameStore": this.state.nameStore,
            "Phone": this.state.phone,
            "Address": this.state.address,
            "ChannelId": this.dataParam.channelShiftID,
            "EventId": this.dataParam.eventID,
            "StaffId": this.dataParam.idStaff,
            "RoleId": this.dataParam.roleID
        }
        API.createStore(obj)
            .then(results => {
                console.log(results)
                if (results.status) {
                    Alert.alert(
                        'Thông báo',
                        'Tạo cửa hàng thành công.',
                        [
                            { text: 'OK', onPress: () => this.pushViewStore(results.result) },
                        ],
                        { cancelable: false }
                    )
                }
                //set ActivityIndicator OFF
                this.setState({
                    showIndicatorUpdate: false,
                    disabledButton: false
                })
            })
    }

pushViewStore(resultEventStoreID) {
        let clone = this.dataParam
        clone.eventStoreID = resultEventStoreID,
        clone.long = this.state.long,
        clone.lat = this.state.lat
        this.props.navigation.navigate('ImageStore', clone)
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
    viewText: {
        flexDirection: 'row',
        height: 44,
        borderColor: '#EDEDED',
        borderWidth: 1,
        backgroundColor: 'white',
        borderRadius: 2,
        alignItems:'center',
        width:'100%'
    },
    input: {
        marginTop: 0,  
        marginLeft: 8,   
        paddingTop:0,
        paddingBottom: 0,
        fontSize: 14,
        color: '#4A4A4A',
        width: '100%',
        borderColor: '#48BBEC',
        fontWeight:'500'
        },
    viewContent: {
        backgroundColor: '#F8F8F8',
        justifyContent: 'space-between',
        flex: 1
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
        justifyContent: 'space-between',
        margin: 10
    }
});