import React, { Component } from 'react';
import { Platform, View, Text, StyleSheet, Alert, TouchableOpacity, TextInput, Image, Dimensions, ActivityIndicator, KeyboardAvoidingView} from 'react-native';
import * as ThemeColor from '../../Global/color'
import ImagePicker from 'react-native-image-picker';
import moment from "moment";
import * as API from '../../API';
import Geolocation from 'react-native-geolocation-service';
import Permissions from 'react-native-permissions';
import { ScrollView } from 'react-native-gesture-handler';
import { Header } from 'react-navigation';

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

const camSelfie = 'Hình tổng quan cửa hiệu'
const camGift = 'Hình cận cảnh khối hàng'
const camBB = 'Hình biên bản đã đủ thông tin'
const daiLyBB = 'Đại lý đang ký tên'
const camQTDL = 'Hình quà tặng cùng đại lý'
const camBBCD = 'Hình biên bản chấm điểm'
const camBBTT = 'Hình biên bản trả thưởng'

class DetailEvent extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: "THÔNG TIN TRƯNG BÀY",
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
            guru5: '',
            go1: '',
            fizzi2: '',
            fizzi6: '',
            starmer4: '',
            starmer2: '',
            banUi: '',
            nonBH: '',
            binhDa: '',
            aoThun: '',
            noiComDien: '',
            datas: [],
            long: this.dataParam.long,
            lat: this.dataParam.lat,
            status: true,
            disabledButton: false,
            showIndicatorUpdate: false,
            time: moment().format("DD/MM/YYYY HH:mm:ss"),
            sttImgSelfie: false,
            sttImgGift: false,
            sttImgBB: false,
            sttImgDaiLyBB: false,
            sttQTDL: false,
            sttBBCD: false,
            sttBBTT: false,
            paramPostInfo: {
                "EventStoreID": this.dataParam.eventStoreID,
                "StaffID": this.dataParam.idStaff,
                "ChannelShiftID": this.dataParam.channelShiftID,
                "Note": "Progibb Audit",
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
                if(status === camSelfie) {
                    this.postUploadImage(response.uri, status, 2)
                }
                else if (status === camGift) {
                    this.postUploadImage(response.uri, status, 3)
                }
                else if (status === camBB) {
                    this.postUploadImage(response.uri, status, 6)
                }
                else if (status === camQTDL) {
                    this.postUploadImage(response.uri, status, 4)
                }
                else if (status === camBBCD) {
                    this.postUploadImage(response.uri, status, 19)
                }
                else if (status === camBBTT) {
                    this.postUploadImage(response.uri, status, 20)
                }
                else {
                    this.postUploadImage(response.uri, status, 5)
                }
            }
        });
    }

    renderTextPhoneInput() {
        return (
            <View>
            <Text style={{marginTop:10, marginBottom:10, fontSize:16, fontWeight:'bold'}}>Suất hàng</Text>
                <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:20}}>
                    <View style={{width:'45%'}}>
                        <Text>Suất 5 thùng Guru:</Text>
                        <View style={styles.inpTextWrapper}>
                            <TextInput
                                placeholder={'Nhập số lượng'}
                                underlineColorAndroid={'transparent'}
                                style={styles.inpText}
                                onChangeText={(text) => { this.setState({ guru5: (text.replace(',', '').replace('.', ''))})}}
                                value={this.state.guru5}
                                keyboardType = {'numeric'}
                            />
                        </View>
                    </View>
                    <View style={{width:'45%'}}>
                        <Text>Suất 10 thùng Sumithion:</Text>
                        <View style={styles.inpTextWrapper}>
                            <TextInput
                                placeholder={'Nhập số lượng'}
                                underlineColorAndroid={'transparent'}
                                style={styles.inpText}
                                onChangeText={(text) => { this.setState({ go1: (text.replace(',', '').replace('.', ''))})}}
                                value={this.state.go1}
                                keyboardType = {'numeric'}
                            />
                        </View>
                    </View>
                </View>
                <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:20}}>
                    <View style={{width:'45%'}}>
                        <Text>Suất 2 thùng Fizzi:</Text>
                        <View style={styles.inpTextWrapper}>
                            <TextInput
                                placeholder={'Nhập số lượng'}
                                underlineColorAndroid={'transparent'}
                                style={styles.inpText}
                                onChangeText={(text) => { this.setState({ fizzi2: (text.replace(',', '').replace('.', ''))})}}
                                value={this.state.fizzi2}
                                keyboardType = {'numeric'}
                            />
                        </View>
                    </View>
                    <View style={{width:'45%'}}>
                        <Text>Suất 6 thùng Fizzi:</Text>
                        <View style={styles.inpTextWrapper}>
                            <TextInput
                                placeholder={'Nhập số lượng'}
                                underlineColorAndroid={'transparent'}
                                style={styles.inpText}
                                onChangeText={(text) => { this.setState({ fizzi6: (text.replace(',', '').replace('.', ''))})}}
                                value={this.state.fizzi6}
                                keyboardType = {'numeric'}
                            />
                        </View>
                    </View>
                </View>
                <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:20}}>
                    <View style={{width:'45%'}}>
                        <Text>Suất 4 thùng Starmer:</Text>
                        <View style={styles.inpTextWrapper}>
                            <TextInput
                                placeholder={'Nhập số lượng'}
                                underlineColorAndroid={'transparent'}
                                style={styles.inpText}
                                onChangeText={(text) => { this.setState({ starmer4: (text.replace(',', '').replace('.', ''))})}}
                                value={this.state.starmer4}
                                keyboardType = {'numeric'}
                            />
                        </View>
                    </View>
                    <View style={{width:'45%'}}>
                        <Text>Suất 2 thùng Starmer:</Text>
                        <View style={styles.inpTextWrapper}>
                            <TextInput
                                placeholder={'Nhập số lượng'}
                                underlineColorAndroid={'transparent'}
                                style={styles.inpText}
                                onChangeText={(text) => { this.setState({ starmer2: (text.replace(',', '').replace('.', ''))})}}
                                value={this.state.starmer2}
                                keyboardType = {'numeric'}
                            />
                        </View>
                    </View>
                </View>
                <Text style={{marginTop:10, marginBottom:10, fontSize:16, fontWeight:'bold'}}>Suất quà</Text>
                <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:20}}>
                    <View style={{width:'45%'}}>
                        <Text>1 bàn ủi Philip:</Text>
                        <View style={styles.inpTextWrapper}>
                            <TextInput
                                placeholder={'Nhập số lượng'}
                                underlineColorAndroid={'transparent'}
                                style={styles.inpText}
                                onChangeText={(text) => { this.setState({ banUi: (text.replace(',', '').replace('.', ''))})}}
                                value={this.state.banUi}
                                keyboardType = {'numeric'}
                            />
                        </View>
                    </View>
                    <View style={{width:'45%'}}>
                        <Text>3 nón bảo hiểm:</Text>
                        <View style={styles.inpTextWrapper}>
                            <TextInput
                                placeholder={'Nhập số lượng'}
                                underlineColorAndroid={'transparent'}
                                style={styles.inpText}
                                onChangeText={(text) => { this.setState({ nonBH: (text.replace(',', '').replace('.', ''))})}}
                                value={this.state.nonBH}
                                keyboardType = {'numeric'}
                            />
                        </View>
                    </View>
                </View>
                <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:20}}>
                    {/**
                    <View style={{width:'45%'}}>
                        <Text>1 áo thun cao cấp:</Text>
                        <View style={styles.inpTextWrapper}>
                            <TextInput
                                placeholder={'Nhập số lượng'}
                                underlineColorAndroid={'transparent'}
                                style={styles.inpText}
                                onChangeText={(text) => { this.setState({ aoThun: (text.replace(',', '').replace('.', ''))})}}
                                value={this.state.aoThun}
                                keyboardType = {'numeric'}
                            />
                        </View>
                    </View>
                     */}
                    <View style={{width:'45%'}}>
                        <Text>1 bình đá Duy Tân:</Text>
                        <View style={styles.inpTextWrapper}>
                            <TextInput
                                placeholder={'Nhập số lượng'}
                                underlineColorAndroid={'transparent'}
                                style={styles.inpText}
                                onChangeText={(text) => { this.setState({ binhDa: (text.replace(',', '').replace('.', ''))})}}
                                value={this.state.binhDa}
                                keyboardType = {'numeric'}
                            />
                        </View>
                    </View>
                    <View style={{width:'45%'}}>
                        <Text>1 nồi cơm điện:</Text>
                        <View style={styles.inpTextWrapper}>
                            <TextInput
                                placeholder={'Nhập số lượng'}
                                underlineColorAndroid={'transparent'}
                                style={styles.inpText}
                                onChangeText={(text) => { this.setState({ noiComDien: (text.replace(',', '').replace('.', ''))})}}
                                value={this.state.noiComDien}
                                keyboardType = {'numeric'}
                            />
                        </View>
                    </View>
                </View>
            </View>
        );
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

    render() {
        return (
            <KeyboardAvoidingView style={styles.viewContent} behavior="padding" enabled={Platform.OS === 'ios' ? true : false} keyboardVerticalOffset={Header.HEIGHT + 25}>
                <ScrollView keyboardShouldPersistTaps='handled'>
                    <View style={styles.container}>
                        <TouchableOpacity style={styles.toucnCap} onPress={() => this.pressCapture(camSelfie)} disabled={this.state.disabledButton}>
                            <Image source={require('../../Assets/Images/iconCamera.jpg')} style={styles.imgIcon} resizeMode={'contain'}></Image>
                            <Text>{camSelfie}</Text>
                            {this.renderCheckin(this.state.sttImgSelfie)}
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.toucnCap} onPress={() => this.pressCapture(camGift)} disabled={this.state.disabledButton}>
                            <Image source={require('../../Assets/Images/iconCamera.jpg')} style={styles.imgIcon} resizeMode={'contain'}></Image>
                            <Text>{camGift}</Text>
                            {this.renderCheckin(this.state.sttImgGift)}
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.toucnCap} onPress={() => this.pressCapture(camBB)} disabled={this.state.disabledButton}>
                            <Image source={require('../../Assets/Images/iconCamera.jpg')} style={styles.imgIcon} resizeMode={'contain'}></Image>
                            <Text>{camBB}</Text>
                            {this.renderCheckin(this.state.sttImgBB)}
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.toucnCap} onPress={() => this.pressCapture(camQTDL)} disabled={this.state.disabledButton}>
                            <Image source={require('../../Assets/Images/iconCamera.jpg')} style={styles.imgIcon} resizeMode={'contain'}></Image>
                            <Text>{camQTDL}</Text>
                            {this.renderCheckin(this.state.sttQTDL)}
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.toucnCap} onPress={() => this.pressCapture(daiLyBB)} disabled={this.state.disabledButton}>
                            <Image source={require('../../Assets/Images/iconCamera.jpg')} style={styles.imgIcon} resizeMode={'contain'}></Image>
                            <Text>{daiLyBB}</Text>
                            {this.renderCheckin(this.state.sttImgDaiLyBB)}
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.toucnCap} onPress={() => this.pressCapture(camBBCD)} disabled={this.state.disabledButton}>
                            <Image source={require('../../Assets/Images/iconCamera.jpg')} style={styles.imgIcon} resizeMode={'contain'}></Image>
                            <Text>{camBBCD}</Text>
                            {this.renderCheckin(this.state.sttBBCD)}
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.toucnCap} onPress={() => this.pressCapture(camBBTT)} disabled={this.state.disabledButton}>
                            <Image source={require('../../Assets/Images/iconCamera.jpg')} style={styles.imgIcon} resizeMode={'contain'}></Image>
                            <Text>{camBBTT}</Text>
                            {this.renderCheckin(this.state.sttBBTT)}
                        </TouchableOpacity>
                        {this.renderTextPhoneInput()}
                        {this.renderButton()}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
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

    addObjItem(questionId, answer) {
        if (answer != '') {
            let obj = {
                "QuestionID": questionId,
                "QuestionType": 1,
                "QuestionGroup": 1,
                "Long": this.state.long,
                "Lat": this.state.lat,
                "DatePost": moment().format("DD/MM/YYYY HH:mm:ss"),
                "Answer": answer
            }
    
            this.state.paramPostInfo.ListInfo.push(obj)
        }
        else {
            let obj = {
                "QuestionID": questionId,
                "QuestionType": 1,
                "QuestionGroup": 1,
                "Long": this.state.long,
                "Lat": this.state.lat,
                "DatePost": moment().format("DD/MM/YYYY HH:mm:ss"),
                "Answer": 0
            }
    
            this.state.paramPostInfo.ListInfo.push(obj)
        }

    }

    checkDataPush() {
        this.addObjItem(8,this.state.guru5)
        this.addObjItem(9,this.state.go1)
        this.addObjItem(10,this.state.fizzi2)
        this.addObjItem(11,this.state.fizzi6)
        this.addObjItem(12,this.state.starmer4)
        this.addObjItem(13,this.state.starmer2)
        this.addObjItem(14,this.state.banUi)
        this.addObjItem(15,this.state.nonBH)
        this.addObjItem(17,this.state.binhDa)
        this.addObjItem(18,this.state.noiComDien)
        console.log(this.state.paramPostInfo)
        this.postInfoAPI(this.state.paramPostInfo)
    }

    doneButtonHandle() {
        if(this.state.sttImgSelfie == true && 
            this.state.sttImgGift == true && 
            this.state.sttImgBB == true && 
            this.state.sttImgDaiLyBB == true &&
            this.state.sttQTDL == true &&
            this.state.sttBBCD == true &&
            this.state.sttBBTT == true
            ) {
            this.checkDataPush()
        }
        else {
            alert('Vui lòng chụp đủ hình')
        }
    }

    /************************ API  ******************************/
    postUploadImage(uriImage, nameImage, idImage) {
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
                    let cloneParam = this.state.paramPostInfo
                    cloneParam.ListInfo = [{
                        "QuestionID": idImage,
                        "QuestionType": 0,
                        "QuestionGroup": 1,
                        "Long": this.state.long,
                        "Lat": this.state.lat,
                        "DatePost": moment().format("DD/MM/YYYY HH:mm:ss"),
                        "Answer": data.result
                    }]
                    console.log(cloneParam)
                    API.postInfo(cloneParam)
                        .then(result => {
                            console.log(result)
                            if (result.status) {
                                if(nameImage === camSelfie) {
                                    this.setState({ "sttImgSelfie": true })
                                }
                                else if (nameImage === camGift) {
                                    this.setState({ "sttImgGift": true })
                                }
                                else if (nameImage === camBB) {
                                    this.setState({"sttImgBB": true})
                                }
                                else if (nameImage === camQTDL) {
                                    this.setState({"sttQTDL": true})
                                }
                                else if (nameImage === camBBCD) {
                                    this.setState({"sttBBCD": true})
                                }
                                else if (nameImage === camBBTT) {
                                    this.setState({"sttBBTT": true})
                                }
                                else {
                                    this.setState({"sttImgDaiLyBB":true})
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

    /************************ API  ******************************/
    postInfoAPI(paramObj) {
        this.setState({ showIndicatorUpdate: true, disabledButton: true })
        API.postInfo(paramObj)
            .then(result => {
                if (result.status) {
                    this.props.navigation.goBack()
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
    inpText: {
        flex: 1,
        paddingLeft: 10,
        padding: 0
    },
})
export default DetailEvent