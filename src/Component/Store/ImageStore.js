import React, { Component } from 'react';
import { Platform, View, Text, StyleSheet, Alert, TouchableOpacity, Keyboard, Image, Dimensions, ActivityIndicator, PermissionsAndroid} from 'react-native';
import * as ThemeColor from '../../Global/color'
import ImagePicker from 'react-native-image-picker';
import moment from "moment";
import * as API from '../../API';
import Geolocation from 'react-native-geolocation-service';
import Permissions from 'react-native-permissions';

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

const camStore = 'Hình chụp đại lý'
const camPOSM = 'Hình trưng bài POSM'
const camProduct = 'Hình trưng bài sản phẩm'
const camOder = 'Hình đơn hàng nông dân mua sản phẩm'
const camSurvey = 'Hình biên bản khảo sát'
const camSign = 'Hình DS ký nhận quà'
const camMascot = 'Hình đại lý nhận quà (đứng kế Mascot)'

class ImageStore extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: "GHI NHẬN HÌNH ẢNH",
            headerStyle: {
                backgroundColor: ThemeColor.TEN_COLOR,
            },
            headerTintColor: '#fff',
            headerLeft: null
        };
    };

    constructor(props) {
        super(props);
        this.dataParam = this.props.navigation.state.params;
        this.state = {
            datas: [],
            long: '',
            lat: '',
            status: true,
            disabledButton: false,
            showIndicatorUpdate: false,
            time: moment().format("DD/MM/YYYY HH:mm:ss"),
            sttImgStore: false,
            sttImgPOSM: false,
            sttImgProduct: false,
            sttImgOrder: false,
            sttImgSurvey: false,
            sttImgSign: false,
            sttImgMascot: false,
            paramPostInfo: {
                "EventStoreID": this.dataParam.eventStoreID,
                "StaffID": this.dataParam.idStaff,
                "ChannelShiftID": this.dataParam.channelShiftID,
                "Note": "MysteryShopper",
                "DatePost": '',
                "Longtitude": this.dataParam.long,
                "Latitude": this.dataParam.lat,
                "ListInfo": []
            },
            disabledAll: false
            
        }
    }

    componentDidMount() {
        this.getLocation()
        console.log(this.dataParam)
    }

    pressCapture = (status) => {
        ImagePicker.launchCamera(options, (response) => {
            if (response.didCancel) {
                //console.log('User cancelled image picker');
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
                        Platform.OS === 'ios'
                            ? { text: 'Mở cài đặt', onPress: Permissions.openSettings }
                            : { text: 'OK' },
                    ],
                    { cancelable: false }
                )
            } else {
                Keyboard.dismiss()
                switch (status) {
                    case camStore: {
                        let cloneParam = this.state.paramPostInfo
                        if(this.state.long == '' || this.state.lat == '') {
                            cloneParam.Longtitude = 0,
                            cloneParam.Latitude = 0
                        }
                        else {
                            cloneParam.Longtitude = this.state.long,
                            cloneParam.Latitude = this.state.lat
                        }
                        cloneParam.DatePost = moment().format("DD/MM/YYYY HH:mm:ss")
                        cloneParam.ListInfo = [{
                            "QuestionID": 9,
                            "QuestionType": 0,
                            "QuestionGroup": 1,
                            "Long": this.state.long,
                            "Lat": this.state.lat,
                            "DatePost": moment().format("DD/MM/YYYY HH:mm:ss"),
                            "Answer": response.data,
                            "infogroup":"0932612443"
                        }]
                        this.postInfoAPI(cloneParam, camStore)
                    }
                        break;
                    case camPOSM: {
                        let cloneParam = this.state.paramPostInfo
                        if(this.state.long == '' || this.state.lat == '') {
                            cloneParam.Longtitude = 0,
                            cloneParam.Latitude = 0
                        }
                        else {
                            cloneParam.Longtitude = this.state.long,
                            cloneParam.Latitude = this.state.lat
                        }
                        cloneParam.DatePost = moment().format("DD/MM/YYYY HH:mm:ss")
                        cloneParam.ListInfo = [{
                            "QuestionID": 1,
                            "QuestionType": 0,
                            "QuestionGroup": 1,
                            "Long": this.state.long,
                            "Lat": this.state.lat,
                            "DatePost": moment().format("DD/MM/YYYY HH:mm:ss"),
                            "Answer": response.data,
                            "infogroup":"0932612443"
                        }]
                        this.postInfoAPI(cloneParam, camPOSM)
                    }
                        break;
                    case camProduct: {
                        let cloneParam = this.state.paramPostInfo
                        if(this.state.long == '' || this.state.lat == '') {
                            cloneParam.Longtitude = 0,
                            cloneParam.Latitude = 0
                        }
                        else {
                            cloneParam.Longtitude = this.state.long,
                            cloneParam.Latitude = this.state.lat
                        }
                        cloneParam.DatePost = moment().format("DD/MM/YYYY HH:mm:ss")
                        cloneParam.ListInfo = [{
                            "QuestionID": 2,
                            "QuestionType": 0,
                            "QuestionGroup": 1,
                            "Long": this.state.long,
                            "Lat": this.state.lat,
                            "DatePost": moment().format("DD/MM/YYYY HH:mm:ss"),
                            "Answer": response.data,
                            "infogroup":"0932612443"
                        }]
                        this.postInfoAPI(cloneParam, camProduct)
                    }
                        break;
                    case camOder: {
                        let cloneParam = this.state.paramPostInfo
                        if(this.state.long == '' || this.state.lat == '') {
                            cloneParam.Longtitude = 0,
                            cloneParam.Latitude = 0
                        }
                        else {
                            cloneParam.Longtitude = this.state.long,
                            cloneParam.Latitude = this.state.lat
                        }
                        cloneParam.DatePost = moment().format("DD/MM/YYYY HH:mm:ss")
                        cloneParam.ListInfo = [{
                            "QuestionID": 3,
                            "QuestionType": 0,
                            "QuestionGroup": 1,
                            "Long": this.state.long,
                            "Lat": this.state.lat,
                            "DatePost": moment().format("DD/MM/YYYY HH:mm:ss"),
                            "Answer": response.data,
                            "infogroup":"0932612443"
                        }]
                        this.postInfoAPI(cloneParam, camOder)
                    }
                        break;       
                    case camSurvey: {
                        let cloneParam = this.state.paramPostInfo
                        if(this.state.long == '' || this.state.lat == '') {
                            cloneParam.Longtitude = 0,
                            cloneParam.Latitude = 0
                        }
                        else {
                            cloneParam.Longtitude = this.state.long,
                            cloneParam.Latitude = this.state.lat
                        }
                        cloneParam.DatePost = moment().format("DD/MM/YYYY HH:mm:ss")
                        cloneParam.ListInfo = [{
                            "QuestionID": 4,
                            "QuestionType": 0,
                            "QuestionGroup": 1,
                            "Long": this.state.long,
                            "Lat": this.state.lat,
                            "DatePost": moment().format("DD/MM/YYYY HH:mm:ss"),
                            "Answer": response.data,
                            "infogroup":"0932612443"
                        }]
                        this.postInfoAPI(cloneParam, camSurvey)
                    }
                        break;  
                    case camSign: {
                        let cloneParam = this.state.paramPostInfo
                        if(this.state.long == '' || this.state.lat == '') {
                            cloneParam.Longtitude = 0,
                            cloneParam.Latitude = 0
                        }
                        else {
                            cloneParam.Longtitude = this.state.long,
                            cloneParam.Latitude = this.state.lat
                        }
                        cloneParam.DatePost = moment().format("DD/MM/YYYY HH:mm:ss")
                        cloneParam.ListInfo = [{
                            "QuestionID": 5,
                            "QuestionType": 0,
                            "QuestionGroup": 1,
                            "Long": this.state.long,
                            "Lat": this.state.lat,
                            "DatePost": moment().format("DD/MM/YYYY HH:mm:ss"),
                            "Answer": response.data,
                            "infogroup":"0932612443"
                        }]
                        this.postInfoAPI(cloneParam, camSign)
                    }
                        break;
                    case camMascot: {
                        let cloneParam = this.state.paramPostInfo
                        if(this.state.long == '' || this.state.lat == '') {
                            cloneParam.Longtitude = 0,
                            cloneParam.Latitude = 0
                        }
                        else {
                            cloneParam.Longtitude = this.state.long,
                            cloneParam.Latitude = this.state.lat
                        }
                        cloneParam.DatePost = moment().format("DD/MM/YYYY HH:mm:ss")
                        cloneParam.ListInfo = [{
                            "QuestionID": 6,
                            "QuestionType": 0,
                            "QuestionGroup": 1,
                            "Long": this.state.long,
                            "Lat": this.state.lat,
                            "DatePost": moment().format("DD/MM/YYYY HH:mm:ss"),
                            "Answer": response.data,
                            "infogroup":"0932612443"
                        }]
                        this.postInfoAPI(cloneParam, camMascot)
                    }
                        break;
                    default: break
                    }
            }
        });
    }

    renderCheckin(status) {
        if (status) {
            return(
                <Image source={require('../../Assets/Images/checked.png')}
                        style={{ width: 20, height: 20, marginLeft: 15}}
                        resizeMode={'contain'}
                    >
                </Image>
            )
        }

        return null
    }

    openCamera(sttCamera) {
        this.pressCapture(sttCamera)
    }

    render() {
        return (
            <View style={styles.container}>
                <View>
                    <TouchableOpacity style={styles.toucnCap} onPress={() => this.openCamera(camStore)} disabled={this.state.disabledButton}>
                        <Image source={require('../../Assets/Images/iconCamera.jpg')} style={styles.imgIcon} resizeMode={'contain'}></Image>
                        <Text>{camStore}</Text>
                        {this.renderCheckin(this.state.sttImgStore)}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.toucnCap} onPress={() => this.openCamera(camPOSM)} disabled={this.state.disabledButton}>
                        <Image source={require('../../Assets/Images/iconCamera.jpg')} style={styles.imgIcon} resizeMode={'contain'}></Image>
                        <Text>{camPOSM}</Text>
                        {this.renderCheckin(this.state.sttImgPOSM)}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.toucnCap} onPress={() => this.openCamera(camProduct)} disabled={this.state.disabledButton}>
                        <Image source={require('../../Assets/Images/iconCamera.jpg')} style={styles.imgIcon} resizeMode={'contain'}></Image>
                        <Text>{camProduct}</Text>
                        {this.renderCheckin(this.state.sttImgProduct)}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.toucnCap} onPress={() => this.openCamera(camOder)} disabled={this.state.disabledButton}>
                        <Image source={require('../../Assets/Images/iconCamera.jpg')} style={styles.imgIcon} resizeMode={'contain'}></Image>
                        <Text>{camOder}</Text>
                        {this.renderCheckin(this.state.sttImgOrder)}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.toucnCap} onPress={() => this.openCamera(camSurvey)} disabled={this.state.disabledButton}>
                        <Image source={require('../../Assets/Images/iconCamera.jpg')} style={styles.imgIcon} resizeMode={'contain'}></Image>
                        <Text>{camSurvey}</Text>
                        {this.renderCheckin(this.state.sttImgSurvey)}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.toucnCap} onPress={() => this.openCamera(camSign)} disabled={this.state.disabledButton}>
                        <Image source={require('../../Assets/Images/iconCamera.jpg')} style={styles.imgIcon} resizeMode={'contain'}></Image>
                        <Text>{camSign}</Text>
                        {this.renderCheckin(this.state.sttImgSign)}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.toucnCap} onPress={() => this.openCamera(camMascot)} disabled={this.state.disabledButton}>
                        <Image source={require('../../Assets/Images/iconCamera.jpg')} style={styles.imgIcon} resizeMode={'contain'}></Image>
                        <Text>{camMascot}</Text>
                        {this.renderCheckin(this.state.sttImgMascot)}
                    </TouchableOpacity>
                </View>
                {this.renderButton()}
            </View>
        )
    }

    renderButton() {
        return (
            <View style={styles.viewButton}>
                <TouchableOpacity style={styles.touchLogin} onPress={() => this.doneButtonHandle()} disabled={this.state.disabledButton}>
                    {this.state.showIndicatorUpdate ? <ActivityIndicator size="small" color="#0000ff" style={{ marginRight: 5 }} /> : null}   
                    <Text style={styles.btnStyle}>TIẾP THEO</Text>
                </TouchableOpacity>
            </View>
        )
    }

    doneButtonHandle() {
        this.checkDataPushView()
    }

    showCheckinCamera(cameraName) {
        switch (cameraName) {
            case camStore: this.setState({"sttImgStore":true})
                break;

            case camPOSM: this.setState({"sttImgPOSM":true})
                break;

            case camProduct: this.setState({"sttImgProduct":true})
                break;

            case camOder: this.setState({"sttImgOrder":true})
                break;

            case camSurvey: this.setState({"sttImgSurvey":true})
                break;

            case camSign: this.setState({"sttImgSign":true})
                break;

            case camMascot: this.setState({"sttImgMascot":true})
                break;

            default: break
            }
    }

    checkDataPushView() {
        let paramPostInfo = this.state.paramPostInfo
        if (this.state.long == '' || this.state.lat == '') {
            paramPostInfo.Longtitude = 0,
            paramPostInfo.Latitude = 0,
            paramPostInfo.ListInfo.Long = 0,
            paramPostInfo.ListInfo.Lat = 0
        }
        else {
            paramPostInfo.Longtitude = this.state.long,
            paramPostInfo.Latitude = this.state.lat,
            paramPostInfo.ListInfo.Long = this.state.long,
            paramPostInfo.ListInfo.Lat = this.state.lat
        }

        this.props.navigation.navigate('FinalStore', paramPostInfo)
    }

    /************************ API  ******************************/
    postInfoAPI(paramObj, sttImage) {
        this.setState({showIndicatorUpdate: true, disabledButton: true})
        console.log(paramObj)
        console.log(sttImage)

        API.postInfo(paramObj)
            .then(result => {
                console.log(result)
                if (result.status) {
                    this.showCheckinCamera(sttImage)
                }
                
                //set ActivityIndicator OFF
                this.setState({
                    showIndicatorUpdate: false,
                    disabledButton: false
                })
            })
            .catch(err => {
                this.deleteData(key)
                Alert.alert(
                    'Thông báo',
                    err,
                    [
                        { text: 'OK' },
                    ],
                    { cancelable: false }
                )
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
    container: {
        backgroundColor: ThemeColor.BG,
        padding: 10,
        flex: 1,
        justifyContent:'space-between'
    },
    toucnCap: {
        backgroundColor: 'rgb(255,255,255)',
        borderWidth: 1,
        borderColor: ThemeColor.BORDER_INP,
        height: 44,
        alignItems: 'center',
        flexDirection: 'row',
        marginTop:10,
        marginBottom:10
    },

    wineTypeStl: {
        color: 'rgb(74,74,74)',
        fontSize: 12
    },
    imgIcon: { 
        width: 25, 
        height: 25, 
        marginLeft: 12, 
        marginRight: 15 
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
    }
})
export default ImageStore