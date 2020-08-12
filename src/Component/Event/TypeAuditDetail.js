import React, { Component } from 'react';
import { FlatList, Platform, View, TextInput, Text, StyleSheet, Alert, TouchableOpacity, Keyboard, Image, Dimensions, ActivityIndicator, PermissionsAndroid} from 'react-native';
import * as ThemeColor from '../../Global/color'
import ImagePicker from 'react-native-image-picker';
import moment from "moment";
import * as API from '../../API';
import Geolocation from 'react-native-geolocation-service';
import Permissions from 'react-native-permissions';
import { exListTypeOption } from '../../API/typeOption'

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

class TypeAuditDetail extends Component {
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
            long: this.dataParam.long,
            lat: this.dataParam.lat,
            infogroup: this.dataParam.infogroup,
            txtSLS:'',
            txtSLT: '',
            status: true,
            disabledButton: false,
            showIndicatorUpdate: false,
            time: moment().format("DD/MM/YYYY HH:mm:ss"),
            disabledAll: false,
            data: exListTypeOption[this.dataParam.indexItem].content,
            paramPostInfo: {
                "EventStoreID": this.dataParam.eventStoreID,
                "StaffID": this.dataParam.idStaff,
                "ChannelShiftID": this.dataParam.channelShiftID,
                "Note": "Progibb Audit",
                "DatePost": moment().format("DD/MM/YYYY HH:mm:ss"),
                "ListInfo": []
            },
        }
    }

    componentDidMount() {
        console.log(this.dataParam)
    }

    renderTextSLS() {
        return (
            <View style={styles.inpTextWrapper}>
                <Text>Số lượng suất</Text>
                <TextInput
                    placeholder={'Nhập số lượng'}
                    underlineColorAndroid={'transparent'}
                    style={styles.inpText}
                    onChangeText={(text) => { this.setState({ txtSLS: text }) }}
                    value={this.state.txtSLS}
                    keyboardType='number-pad'
                />
            </View>
        );
    }

    renderTextSLT() {
        return (
            <View style={styles.inpTextWrapper}>
                <Text>Số lượng thùng</Text>
                <TextInput
                    placeholder={'Nhập số lượng'}
                    underlineColorAndroid={'transparent'}
                    style={styles.inpText}
                    onChangeText={(text) => { this.setState({ txtSLT: text }) }}
                    value={this.state.txtSLT}
                    keyboardType='number-pad'
                />
            </View>
        );
    }

    /*********** FlatList Item Render *************/

    _rendItem = ({ item, index }) => {
        return (
            <TouchableOpacity style={styles.toucnCap} onPress={() => this.pressCapture(item, index)} disabled={this.state.disabledButton}>
                <Image source={require('../../Assets/Images/iconCamera.jpg')} style={styles.imgIcon} resizeMode={'contain'}></Image>
                <Text>{item.title}</Text>
                {this.renderCheckin(item.sttCapture)}
            </TouchableOpacity>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={{color:'#ee5253', fontSize:15, margin:10}}>* {exListTypeOption[this.dataParam.indexItem].title}:</Text>
                {this.renderTextSLS()}
                {this.renderTextSLT()}
                <FlatList
                  data={this.state.data}
                  renderItem={this._rendItem}
                  keyExtractor={(item, index) => (item + index)}
                  style={{ backgroundColor: '#F8F8F8' }}
                />
                {this.renderButton()}
            </View>
        )
    }

    renderButton() {
        return (
            <View style={styles.viewButton}>
                <TouchableOpacity style={styles.touchLogin} onPress={() => this.doneButtonHandle()} disabled={this.state.disabledButton}>
                {this.state.showIndicatorUpdate ? <ActivityIndicator size="small" color="#0000ff" style={{ marginRight: 5 }} /> : null}   
                    <Text style={styles.btnStyle}>GỬI THÔNG TIN</Text>
                </TouchableOpacity>
            </View>
        )
    }

    pressCapture = (item, index) => {
        ImagePicker.launchCamera(options, (response) => {
            if (response.didCancel) {
                //console.log('User cancelled image picker');
            } 
            else if (response.error) {
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
            } 
            else {
                this.postUploadImage(response.uri, item, index)
            }
        });
    }

    updateState(index) {
        let newArray = [...this.state.data];
        newArray[index].sttCapture = true;
        this.setState({data: newArray});
    }
 
    async resetJson() {
        let newArray = [...this.state.data];
        for (let i = 0; i < this.state.data.length; i++) {
            newArray[i].sttCapture = false;
        }
        await this.setState({data: newArray});
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

    //Upload image
    postUploadImage(uriImage, item, index) {
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
                        "QuestionID": item.QuestionID,
                        "QuestionType": item.QuestionType,
                        "QuestionGroup": item.QuestionGroup,
                        "Long": this.state.long,
                        "Lat": this.state.lat,
                        "DatePost": moment().format("DD/MM/YYYY HH:mm:ss"),
                        "infogroup":this.state.infogroup,
                        "Answer": data.result
                    }]
                    console.log(cloneParam)
                    API.postInfo(cloneParam)
                        .then(result => {
                            console.log(result)
                            if (result.status) {
                                this.updateState(index)
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

    doneButtonHandle() {

        if(this.state.txtSLS == '' || this.state.txtSLT == '') {
            alert('Vui lòng điền đầy đủ thông tin')
        }
        else {
            Alert.alert(
                'Chú ý',
                'Bạn có muốn chụp thêm suất khác hay không?',
                [

                    {
                        text: 'Không',
                        onPress: () => this.pushViewDone('Next'),
                    },
                    {
                        text: 'Có',
                        onPress: () => this.pushViewDone('Back'),
                    }
                ],
                { cancelable: false }
            )
        }
    }

    pushViewDone(status) {
        if(this.dataParam.indexItem == 0) {
            this.postDataDone(5, 6, 1, status)
        }
        else {
            this.postDataDone(18, 19, 2, status)
        }
    }

    postDataDone(idSLS, idSLT, idGroup, status) {
        let param = {
            'EventStoreID': this.dataParam.eventStoreID,
            'StaffID': this.dataParam.idStaff,
            'ChannelShiftID': this.dataParam.channelShiftID,
            'Note': 'Sumitomo Audit',
            'DatePost': moment().format("DD/MM/YYYY HH:mm:ss"),
            'ListInfo': [{
                "QuestionID": idSLS,
                "QuestionType": 1,
                "QuestionGroup": idGroup,
                "Long": this.state.long,
                "Lat": this.state.lat,
                "DatePost": moment().format("DD/MM/YYYY HH:mm:ss"),
                "infogroup":this.state.infogroup,
                "Answer": this.state.txtSLS
            },
            {
                "QuestionID": idSLT,
                "QuestionType": 1,
                "QuestionGroup": idGroup,
                "Long": this.state.long,
                "Lat": this.state.lat,
                "DatePost": moment().format("DD/MM/YYYY HH:mm:ss"),
                "infogroup":this.state.infogroup,
                "Answer": this.state.txtSLT
            }
            ]
        }
        console.log(param)
        this.postInfoAPI(param, status)
    }

    /************************ API  ******************************/
    postInfoAPI(paramObj, status) {
        this.setState({showIndicatorUpdate: true, disabledButton: true})
        API.postInfo(paramObj)
            .then(result => {
                console.log(result)
                if (result.status) {
                    this.resetJson()
                    if(status == 'Next') {
                        let param = {
                            idStaff: this.dataParam.idStaff,
                            roleID: this.dataParam.roleID,
                            eventID: this.dataParam.eventID,
                            eventStoreID: this.dataParam.eventStoreID,
                            channelShiftID: this.dataParam.channelShiftID,
                            long: this.dataParam.long,
                            lat: this.dataParam.lat,
                            indexItem: this.dataParam.indexItem
                          }
                        this.props.navigation.navigate('FinalEvent', param)
                    }
                    else {
                        this.props.navigation.goBack()
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
                    err,
                    [
                        { text: 'OK' },
                    ],
                    { cancelable: false }
                )
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
    }
})
export default TypeAuditDetail