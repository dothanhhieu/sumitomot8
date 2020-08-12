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
    TextInput,
    Image,
    PermissionsAndroid,
    FlatList
} from 'react-native';
import InputType from '../../Global/InputType';
import { ScrollView } from 'react-native-gesture-handler';
import DropdownType from '../../Global/DropdownType';
import { Header } from 'react-navigation';
import { exProvince, exProvinceName } from '../../API/SampleAPI';
import * as API from '../../API';
import moment from "moment";
import Geolocation from 'react-native-geolocation-service';

var RNFS = require('react-native-fs');
const filename = 'test.mp4';

export default class UpdateAddress extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: "Thêm nông dân",
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
            nameStore: '',
            noStore: '',
            phone: '',
            province: exProvinceName,
            provinceSelected: 'Hồ Chí Minh',
            districtSelected: '',
            wardSelected: '',
            streetSelected: 'Chọn tên đường',
            codeWard: '',
            codeDistrict: '',
            codeProvince: '',
            arrDistrict: [],
            arrIdDistrict: [],
            arrWard: [],
            arrIdWard: [],
            arrIdStreet:[],
            arrStreet:[],
            ward: '',
            errStore: false,
            errNo: false,
            errStreet: false,
            errPhone: false,
            objProvince: exProvince,
            objDistrict: '',
            objWard: '',
            objStreet: [],
            disabledWard: true,
            SendStoreID: 0,
            error: '',
            datePost: moment().format("DD/MM/YYYY HH:mm:ss"),
            long: '',
            lat: '',
            disabledButton: false
        }
    }

    componentDidMount() {
        this.getListDistrict("")
        this.getLocation()
    }

    renderOutletName() {
        return (
            <View>
                <InputType
                    title={"Tên nông dân"}
                    value={this.state.nameStore}
                    marginView={10}
                    editText={true}
                    textValue={this.textValue.bind(this)}
                    error={this.state.errStore}
                />
                <InputType
                title={"Điện thoại liên hệ"}
                value={this.state.phone}
                keyboardType='phone-pad'
                marginView={10}
                editText={true}
                textValue={this.textValue.bind(this)}
                error={this.state.errPhone}
            />
            </View>
        )
    }

    renderAddress() {
        return (
            <View>
                <InputType
                    title={"Số nhà, tên ấp"}
                    value={this.state.noStore}
                    marginView={10}
                    editText={true}
                    textValue={this.textValue.bind(this)}
                    error={this.state.errNo}
                />
            </View>
        )
    }

    renderButton() {
        return (
            <View style={styles.viewButton}>
                <TouchableOpacity style={styles.touchLogin} onPress={() => this.updateInfo()} disabled={this.state.disabledButton}>
                    {this.state.showIndicatorUpdate ? <ActivityIndicator size="small" color="#0000ff" style={{ marginRight: 5 }} /> : null}   
                    <Text style={styles.btnStyle}>CẬP NHẬT</Text>
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        return (
            <KeyboardAvoidingView style={styles.viewContent} behavior="padding" enabled={Platform.OS === 'ios' ? true : false} keyboardVerticalOffset={Header.HEIGHT + 25}>
                <ScrollView>
                    {this.renderOutletName()}
                    {this.renderAddress()}
                </ScrollView>
                {this.renderButton()}
            </KeyboardAvoidingView>
        )
    }

    textValue(title, value) {
        switch (title) {
            case "Tên nông dân": this.setState({ 'nameStore': value })
                break;
            case "Số nhà, tên ấp": this.setState({ 'noStore': value })
                break;
            case "Điện thoại liên hệ": this.setState({ 'phone': value })
                break;
            default: break
        }
    }

    checkDataUsed() {
        if ((this.state.nameStore == this.outletParam.nameStore) &&
            (this.state.codeProvince == this.outletParam.province) &&
            (this.state.codeDistrict == this.outletParam.district) &&
            (this.state.codeWard == this.outletParam.ward) &&
            (this.state.noStore == this.outletParam.numberHouse) &&
            (this.state.street == this.outletParam.streetName) &&
            (this.state.phone == this.outletParam.contactnumber)) {

            return true
        }

        return false
    }

    validateDistrict() {
        if (this.state.objDistrict.length > 0) {
            const result = this.state.objDistrict.filter(item => item.name == this.state.districtSelected);
            
            return result.length > 0 ? true : false
        }

        return true
    }

    validateWard() {
        if (this.state.objWard.length > 0) {
            const result = this.state.objWard.filter(item => item.name == this.state.wardSelected);
            
            return result.length > 0 ? true : false
        }

        return true
    }

    mobileValidate(text) {
        var phoneInput = text
        if (phoneInput.charAt(0) === '0' && ((text.length == 10) || (text.length == 11))) {
    
          return true;
        }
    
        return false;
      }

    updateInfo() {

        this.props.navigation.navigate('FarmerSurvey')
        // if (!this.checkDataUsed()) {
        //     console.log(this.state.codeWard)
        //     console.log(this.state.codeDistrict)
        //     console.log(this.state.codeProvince)

        //     if ((this.state.codeWard !== "") || (this.state.codeDistrict !== "") || (this.state.codeProvince !== '')) {
        //         if ((this.state.nameStore !== "") &&
        //         (this.state.noStore !== "") &&
        //         (this.state.street !== "")) {
        //             this.validateData()
        //         }
        //         else {
        //             Alert.alert(
        //                 'Thông báo',
        //                 'Vui lòng nhập đầy đủ dữ liệu',
        //                 [
        //                     { text: 'OK' },
        //                 ],
        //                 { cancelable: false }
        //             )
        //         }
        //     }
        //     else {
        //         Alert.alert(
        //             'Thông báo',
        //             'Vui lòng cập nhật Phường/ Xã, Quận/ Huyện, Tỉnh/ TP',
        //             [
        //                 { text: 'OK' },
        //             ],
        //             { cancelable: false }
        //         )
        //     }
        // }
        // else {
        //     Alert.alert(
        //         'Thông báo',
        //         'Vui lòng cập nhật lại thông tin outlet',
        //         [
        //             { text: 'OK' },
        //         ],
        //         { cancelable: false }
        //     )
        // }
    }

    validateData() {
        if (this.validateDistrict() == false) {
            Alert.alert(
                'Thông báo',
                'Quận/ Huyện không hợp lệ',
                [
                    { text: 'OK' },
                ],
                { cancelable: false }
            )
        }
        else if (this.validateWard() == false) {
            Alert.alert(
                'Thông báo',
                'Phường/ Xã không hợp lệ',
                [
                    { text: 'OK' },
                ],
                { cancelable: false }
            )
        }
        else {
            this.updateStoreAPI()
        }
    }
    //********************** API *****************************************/
    postDataInfo(base64) {
        this.setState({showIndicatorAudio: true, disabledButton: true})
        let obj = {
          "EventStoreID":this.outletParam.eventStoreID,
          "StaffID": this.outletParam.idStaff,
          "ChannelShiftID":this.outletParam.channelShiftID,
          "Note": "Audio",
          "DatePost": this.state.datePost,
          "StatusSendStore":1,
          'SendStoreID': this.state.SendStoreID,
          "Listinfo":[
              {
                "QuestionID": 40,
                "QuestionType": 9,
                "QuestionGroup": 4,
                "Long":this.state.long,
                "Lat":this.state.lat,
                "DatePost":this.state.datePost,
                "Answer": base64
              }
          ]
        }
        API.postInfo(obj)
            .then(result => {
                if (result.status) {
                    console.log(result)
                    if (this.state.SendStoreID == 0) {
                        this.setState({
                            SendStoreID: result.result
                        })
                    }
                    Alert.alert(
                        'Thông báo',
                        'Gửi file ghi âm thành công',
                        [
                            { text: 'OK' },
                        ],
                        { cancelable: false }
                    );
                    this.setState({
                        recordStatus: true
                    })
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
                    showIndicatorAudio: false,
                    disabledButton: false
                })
            })
      } 

    getListDistrict(id) {
        API.getDistrictWard(id)
            .then(objResult => {
                console.log(objResult)
                if (objResult.status) {
                    var arrDistrict = []
                    objResult.result.map(
                        item => {
                            arrDistrict.push(item.name)
                            this.state.arrIdDistrict.push(item.code)
                        }
                    )
                    this.setState({
                        'objDistrict': objResult.result,
                        'arrDistrict': arrDistrict,
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

    getListWard(id) {
        API.getDistrictWard(id)
            .then(objResult => {
                if (objResult.status) {
                    var arrWard = []
                    objResult.result.map(
                        item => {
                            arrWard.push(item.name)
                            this.state.arrIdWard.push(item.code)
                        }
                    )
                    this.setState({
                        'objWard': objResult.result,
                        'arrWard': arrWard,
                        'disabledWard': false
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

    getListStreet(id) {
        API.getStreet(id)
            .then(objResult => {
                if (objResult.status) {
                    var arrStreet = []
                    objResult.result.map(
                        item => {
                            arrStreet.push(item.streetName)
                            this.state.arrIdStreet.push(item.streetId)
                        }
                    )
                    arrStreet.push('Không tìm thấy tên đường')

                    this.setState({
                        'objStreet': objResult.result,
                        'arrStreet': arrStreet,
                        'disabledStreet': false
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

    updateStoreAPI() {
        this.setState({showIndicatorUpdate: true, disabledButton: true})
        let obj = {
            "eventStoreId": this.outletParam.eventStoreID,
            "nameOutlet": this.state.nameStore,
            "no": this.state.noStore,
            "streetId" :this.state.streetId,
            "street": this.state.street,
            "ward": this.state.codeWard,
            "district": this.state.codeDistrict,
            "province": this.state.codeProvince,
            "contact": this.state.phone,
            "userCreate": this.outletParam.idStaff,
            'ChannelShiftID': this.outletParam.channelShiftID,
            'StatusSendStore': 1,
            'sendStoreId': this.state.SendStoreID,
            'DatePost': moment().format("DD/MM/YYYY HH:mm:ss")
        }
        API.updateOutlet(obj)
            .then(result => {
                if (result.status) {
                    console.log(result)
                    if (this.state.SendStoreID == 0) {
                        this.setState({
                            SendStoreID: result.result
                        })
                    }
                    
                    Alert.alert(
                        'Thông báo',
                        'Cập nhật thông tin thành công',
                        [
                            {text: 'OK'},
                        ],
                        { cancelable: false }
                    )
                }
                else {
                    Alert.alert(
                        'Thông báo',
                        result.message,
                        [
                            { text: 'OK' },
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

export const removeAccents = (str) => {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
  
    return str.toLowerCase();
  }