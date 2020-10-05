import React, { Component } from 'react';
import { Platform, View, Text, StyleSheet, Alert, TextInput, TouchableOpacity, Keyboard, Image, Dimensions, ActivityIndicator, PermissionsAndroid } from 'react-native';
import * as ThemeColor from '../../Global/color'
import ImagePicker from 'react-native-image-picker';
import moment from "moment";
import * as API from '../../API';
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

const camDL = 'Hình nhân sự checkout'
const camBB = 'Hình danh sách cuối ngày'

class FinalEvent extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: "BÁO CÁO CUỐI CA",
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
        console.log(this.dataParam)
        this.state = {
            note: '',
            datas: [],
            long: this.dataParam.Long,
            lat: this.dataParam.Lat,
            status: true,
            disabledButton: false,
            showIndicatorUpdate: false,
            time: moment().format("DD/MM/YYYY HH:mm:ss"),
            sttImgDL: false,
            sttImgBB: false,
            paramPostInfo: {
                "EventStoreID": this.dataParam.EventStoreID,
                "StaffID": this.dataParam.StaffID,
                "ChannelShiftID": this.dataParam.ChannelShiftID,
                "Note": "PACK REDEMPTION",
                "DatePost": moment().format("DD/MM/YYYY HH:mm:ss"),
                "ListInfo": []
            },
            disabledAll: false
        }
    }

    componentDidMount() {
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

                let cloneParam = this.state.paramPostInfo
                //checkout
                if (status === camDL) {
                    cloneParam.ListInfo = [{
                        "QuestionID": 24,
                        "QuestionType": 0,
                        "QuestionGroup": 5,
                        "Long": this.state.long,
                        "Lat": this.state.lat,
                        "DatePost": moment().format("DD/MM/YYYY HH:mm:ss"),
                        "Answer": ''
                    }]
                }
                //ds cuối ngày
                else {
                    cloneParam.ListInfo = [{
                        "QuestionID": 25,
                        "QuestionType": 0,
                        "QuestionGroup": 5,
                        "Long": this.state.long,
                        "Lat": this.state.lat,
                        "DatePost": moment().format("DD/MM/YYYY HH:mm:ss"),
                        "Answer": ''
                    }]
                }
                cloneParam.DatePost = moment().format("DD/MM/YYYY HH:mm:ss")

                this.postUploadImage(response.uri, cloneParam, status)
            }
        });
    }

    renderCheckin(status) {
        if (status) {
            return (
                <Image source={require('../../Assets/Images/checked.png')}
                    style={{ width: 20, height: 20, marginLeft: 15 }}
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
                <View sty>
                    <TouchableOpacity style={styles.toucnCap} onPress={() => this.openCamera(camDL)} disabled={this.state.disabledButton}>
                        <Image source={require('../../Assets/Images/iconCamera.jpg')} style={styles.imgIcon} resizeMode={'contain'}></Image>
                        <Text>{camDL}</Text>
                        {this.renderCheckin(this.state.sttImgDL)}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.toucnCap} onPress={() => this.openCamera(camBB)} disabled={this.state.disabledButton}>
                        <Image source={require('../../Assets/Images/iconCamera.jpg')} style={styles.imgIcon} resizeMode={'contain'}></Image>
                        <Text>{camBB}</Text>
                        {this.renderCheckin(this.state.sttImgBB)}
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
                    <Text style={styles.btnStyle}>HOÀN THÀNH</Text>
                </TouchableOpacity>
            </View>
        )
    }

    doneButtonHandle() {
        if (this.state.sttImgDL == true && this.state.sttImgBB == true) {
            // if(this.dataParam.indexItem == 0) {
            //     this.props.navigation.navigate('ListTypeAudit')
            // }
            // else {
                this.props.navigation.popToTop()
            // }
        }
        else {
            alert('Vui lòng chụp đầy đủ hình biên bản')
        }
    }

    postUploadImage(uriImage, param, imgName) {
        this.setState({ showIndicatorUpdate: true, disabledButton: true })
        var fd = new FormData()
        fd.append('Item',
            {
                uri: Platform.OS === 'android' ? uriImage : uriImage.replace('file://', ''),
                type: 'image/jpg',
                name: 'testPhotoName.jpg'
            })
        API.postUploadImageAPI(fd)
            .then(data => {
                if (data.status == 200) {
                    console.log(data)
                    param.ListInfo[0].Answer = data.result
                    console.log(param)
                    API.postInfo(param)
                        .then(result => {
                            console.log(result)
                            if (result.status) {
                                if(imgName == camDL) {
                                    this.setState({ "sttImgDL": true })
                                }
                                else {
                                    this.setState({ "sttImgBB": true })
                                }
                            }
                            else {
                                alert(result.message)
                            }

                            //set ActivityIndicator OFF
                            this.setState({
                                showIndicatorUpdate: false,
                                disabledButton: false
                            })
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
                            //set ActivityIndicator OFF
                            this.setState({
                                showIndicatorUpdate: false,
                                disabledButton: false
                            })
                        })
                }
            })
            .catch(e => {
                alert(`Không thể gửi thông tin\nVui lòng thử lại\n\nMã lỗi [${e}]`)
            })
    }
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: ThemeColor.BG,
        padding: 10,
        flex: 1,
        justifyContent: 'space-between'
    },
    toucnCap: {
        backgroundColor: 'rgb(255,255,255)',
        borderWidth: 1,
        borderColor: ThemeColor.BORDER_INP,
        height: 44,
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 10
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
        backgroundColor: '#e84118',
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
    },
    inpText: {
        flex: 1,
        paddingLeft: 10,
        padding: 0
    },
    imgLeftInpText: {
        width: 15,
        height: 15
    },
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
})
export default FinalEvent