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
import InputType from '../../Global/InputType';

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

const camSelfie = 'Hình nông dân nhận quà'
const camGift = 'Hình sổ 3 liên'
const camBB = 'Hình danh sách'

class InfoEvent extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: "THÔNG TIN NÔNG DÂN",
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
            name: '',
            phone: '',
            address: '',
            caytrong: '',
            dientich: '',
            slqua: '',
            antra100g: '',
            antra500g: '',
            antra1kg: '',
            ali100g: '',
            ali500g: '',
            regen1: '',
            regen2: '',
            datas: [],
            long: this.dataParam.Long,
            lat: this.dataParam.Lat,
            status: true,
            disabledButton: false,
            showIndicatorUpdate: false,
            time: moment().format("DD/MM/YYYY HH:mm:ss"),
            sttImgSelfie: false,
            sttImgGift: false,
            sttImgBB: false,
            paramPostInfo: {
                "EventStoreID": this.dataParam.EventStoreID,
                "StaffID": this.dataParam.StaffID,
                "ChannelShiftID": this.dataParam.ChannelShiftID,
                "Note": "Pack  Redemption",
                "DatePost": moment().format("DD/MM/YYYY HH:mm:ss"),
                "ListInfo": []
            },
            disabledAll: false,
            infogroup: this.dataParam.infogroup
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
                    //nong dan nhan qua
                    this.postUploadImage(response.uri, status, 21)
                }
                else if (status === camGift) {
                    //so 3 lien
                    this.postUploadImage(response.uri, status, 22)
                }
                else {
                    //dsach
                    this.postUploadImage(response.uri, status, 23)
                }
            }
        });
    }

    renderTextPhoneInput() {
        return (
            <View>
                <InputType
                    title={"Họ và tên nông dân"}
                    value={this.state.name}
                    marginView={10}
                    editText={true}
                    textValue={this.textValue.bind(this)}
                    placeHolder={"Nhập họ tên nông dân ..."}
                />
                <InputType
                    title={"Điện thoại"}
                    value={this.state.name}
                    marginView={10}
                    editText={true}
                    keyboardType='phone-pad'
                    textValue={this.textValue.bind(this)}
                    placeHolder={"Nhập điện thoại nông dân ..."}
                />
                <InputType
                    title={"Địa chỉ"}
                    value={this.state.name}
                    marginView={10}
                    editText={true}
                    textValue={this.textValue.bind(this)}
                    placeHolder={"Nhập địa chỉ nông dân ..."}
                />
                <InputType
                    title={"Cây trồng"}
                    value={this.state.caytrong}
                    marginView={10}
                    editText={true}
                    textValue={this.textValue.bind(this)}
                    placeHolder={"Nhập tên cây trồng ..."}
                />
                <InputType
                    title={"Diện tích"}
                    value={this.state.dientich}
                    marginView={10}
                    editText={true}
                    textValue={this.textValue.bind(this)}
                    placeHolder={"Nhập diện tích ..."}
                />
                <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:20}}>
                    <View style={{width:'45%'}}>
                        <Text>Số lượng quà nhận:</Text>
                        <View style={styles.inpTextWrapper}>
                            <TextInput
                                placeholder={'Nhập số lượng'}
                                underlineColorAndroid={'transparent'}
                                style={styles.inpText}
                                onChangeText={(text) => { this.setState({ slqua: (text.replace(',', '').replace('.', ''))})}}
                                value={this.state.slqua}
                                keyboardType = {'numeric'}
                            />
                        </View>
                    </View>
                    <View style={{width:'45%'}}>
                        <Text>Số lượng Antracol 100g:</Text>
                        <View style={styles.inpTextWrapper}>
                            <TextInput
                                placeholder={'Nhập số lượng'}
                                underlineColorAndroid={'transparent'}
                                style={styles.inpText}
                                onChangeText={(text) => { this.setState({ antra100g: (text.replace(',', '').replace('.', ''))})}}
                                value={this.state.antra100g}
                                keyboardType = {'numeric'}
                            />
                        </View>
                    </View>
                </View>
                <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:20}}>
                    <View style={{width:'45%'}}>
                        <Text>Số lượng Antracol 500g:</Text>
                        <View style={styles.inpTextWrapper}>
                            <TextInput
                                placeholder={'Nhập số lượng'}
                                underlineColorAndroid={'transparent'}
                                style={styles.inpText}
                                onChangeText={(text) => { this.setState({ antra500g: (text.replace(',', '').replace('.', ''))})}}
                                value={this.state.antra500g}
                                keyboardType = {'numeric'}
                            />
                        </View>
                    </View>
                    <View style={{width:'45%'}}>
                        <Text>Số lượng Antracol 1kg:</Text>
                        <View style={styles.inpTextWrapper}>
                            <TextInput
                                placeholder={'Nhập số lượng'}
                                underlineColorAndroid={'transparent'}
                                style={styles.inpText}
                                onChangeText={(text) => { this.setState({ antra1kg: (text.replace(',', '').replace('.', ''))})}}
                                value={this.state.antra1kg}
                                keyboardType = {'numeric'}
                            />
                        </View>
                    </View>
                </View>
                <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:20}}>
                    <View style={{width:'45%'}}>
                        <Text>Số lượng Aliette 100g:</Text>
                        <View style={styles.inpTextWrapper}>
                            <TextInput
                                placeholder={'Nhập số lượng'}
                                underlineColorAndroid={'transparent'}
                                style={styles.inpText}
                                onChangeText={(text) => { this.setState({ ali100g: (text.replace(',', '').replace('.', ''))})}}
                                value={this.state.ali100g}
                                keyboardType = {'numeric'}
                            />
                        </View>
                    </View>
                    <View style={{width:'45%'}}>
                        <Text>Số lượng Aliette 500g:</Text>
                        <View style={styles.inpTextWrapper}>
                            <TextInput
                                placeholder={'Nhập số lượng'}
                                underlineColorAndroid={'transparent'}
                                style={styles.inpText}
                                onChangeText={(text) => { this.setState({ ali500g: (text.replace(',', '').replace('.', ''))})}}
                                value={this.state.ali500g}
                                keyboardType = {'numeric'}
                            />
                        </View>
                    </View>
                </View>
                <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:20}}>
                    <View style={{width:'45%'}}>
                        <Text>Số lượng Regent WG 1g:</Text>
                        <View style={styles.inpTextWrapper}>
                            <TextInput
                                placeholder={'Nhập số lượng'}
                                underlineColorAndroid={'transparent'}
                                style={styles.inpText}
                                onChangeText={(text) => { this.setState({ regen1: (text.replace(',', '').replace('.', ''))})}}
                                value={this.state.regen1}
                                keyboardType = {'numeric'}
                            />
                        </View>
                    </View>
                    <View style={{width:'45%'}}>
                        <Text>Số lượng Regent WG 1.6g:</Text>
                        <View style={styles.inpTextWrapper}>
                            <TextInput
                                placeholder={'Nhập số lượng'}
                                underlineColorAndroid={'transparent'}
                                style={styles.inpText}
                                onChangeText={(text) => { this.setState({ regen2: (text.replace(',', '').replace('.', ''))})}}
                                value={this.state.regen2}
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

    textValue(title, value) {
        switch (title) {
          case "Họ và tên nông dân": this.setState({ name: value })
              break;
          case "Điện thoại": this.setState({ phone: value })
              break;
          case "Địa chỉ": this.setState({ address: value })
              break;
          case "Cây trồng": this.setState({ caytrong: value })
              break;   
          case "Diện tích": this.setState({ dientich: value })
            break;            
          default: break
          }
      }

    addObjItem(questionId, answer) {
        if (answer != '') {
            let obj = {
                "QuestionID": questionId,
                "QuestionType": 1,
                "QuestionGroup": 4,
                "Long": this.state.long,
                "Lat": this.state.lat,
                "DatePost": moment().format("DD/MM/YYYY HH:mm:ss"),
                "Answer": answer,
                "infogroup":this.state.infogroup
            }
    
            this.state.paramPostInfo.ListInfo.push(obj)
        }
        else {
            let obj = {
                "QuestionID": questionId,
                "QuestionType": 1,
                "QuestionGroup": 4,
                "Long": this.state.long,
                "Lat": this.state.lat,
                "DatePost": moment().format("DD/MM/YYYY HH:mm:ss"),
                "Answer": 0,
                "infogroup":this.state.infogroup
            }
    
            this.state.paramPostInfo.ListInfo.push(obj)
        }

    }

    checkDataPush() {
        this.addObjItem(8,this.state.name)
        this.addObjItem(9,this.state.phone)
        this.addObjItem(10,this.state.address)
        this.addObjItem(11,this.state.caytrong)
        this.addObjItem(12,this.state.dientich)
        this.addObjItem(13,this.state.slqua)
        this.addObjItem(14,this.state.antra100g)
        this.addObjItem(15,this.state.antra500g)
        this.addObjItem(16,this.state.antra1kg)
        this.addObjItem(17,this.state.ali100g)
        this.addObjItem(18,this.state.ali500g)
        this.addObjItem(19,this.state.regen1)
        this.addObjItem(20,this.state.regen2)
        console.log(this.state.paramPostInfo)
        this.postInfoAPI(this.state.paramPostInfo)
    }

    doneButtonHandle() {
        if(this.state.sttImgSelfie == true && 
            this.state.sttImgGift == true && 
            this.state.sttImgBB == true 
            ) {
            if(this.state.name == "" || this.state.phone == '' || this.state.address == '' || this.state.caytrong == '' || this.state.dientich == '' || this.state.slqua == '') {
                alert('Vui lòng nhập đủ thông tin nông dân')
            }
            else if (this.state.slqua > 15) {
                alert('Số lượng quà vượt quá số lượng cho phép Bạn cần liên hệ với admin')
            }
            else {
                this.checkDataPush()
            }
            //push
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
                        "QuestionGroup": 4,
                        "Long": this.state.long,
                        "Lat": this.state.lat,
                        "DatePost": moment().format("DD/MM/YYYY HH:mm:ss"),
                        "Answer": data.result,
                        "infogroup":this.state.infogroup
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
                                else {
                                    this.setState({"sttImgBB": true})
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
                    Alert.alert(
                        'Thông báo',
                        'Gửi thông tin thành công',
                        [
                            {
                                text: 'OK',
                                onPress: () =>  this.props.navigation.goBack(),

                                style: 'OK',
                            }
                        ],
                        { cancelable: false }
                    )

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
export default InfoEvent