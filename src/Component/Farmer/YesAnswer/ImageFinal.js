import React, { Component } from 'react';
import { Platform, View, Text, StyleSheet, Alert, TouchableOpacity, FlatList, Image, Dimensions, ActivityIndicator } from 'react-native';
import * as ThemeColor from '../../../Global/color'
import BottomButton from '../../../Global/BottomButton'
import ImagePicker from 'react-native-image-picker';
import moment from "moment";
import * as API from '../../../API';

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

const receiveGift = 'HÌNH NHẬN QUÀ'
const signGift = 'HÌNH XÁC NHẬN'

class GiftImage extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: "HÌNH ẢNH XÁC NHẬN",
            headerStyle: {
                backgroundColor: ThemeColor.TEN_COLOR,
            },
            headerTintColor: '#fff',
            headerLeft: null
        };
    };

    constructor(props) {
        super(props);
        this.outletParam = this.props.navigation.state.params;
        this.state = {
            datas: [],
            long: '',
            lat: '',
            status: true,
            time: moment().format("DD/MM/YYYY HH:mm:ss"),
            sttImg1: true,
            sttImg2: true
        }
    }

    componentDidMount() {
        console.log(this.outletParam)
    }

    pressCapture = (status) => {
        ImagePicker.launchCamera(options, (response) => {
            if (response.didCancel) {
                //console.log('User cancelled image picker');
            } else if (response.error) {
                //console.log('ImagePicker Error: ', response.error);
            } else {
                // this.postInfoAPI(response.data, key)
                if (status == receiveGift)   {
                    //api nhan qua
                }
                else {
                    //api ky nhan
                }
            }
        });
    }

    renderCheckin(status) {
        if (status) {
            return(
                <Image
                        source={require('../../../Assets/Images/checked.png')}
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
        const { width, height } = Dimensions.get('window')
        var ratio = 1080 / ((width - 30) / 2);

        return (
            <View
                style={styles.container}>
                <TouchableOpacity
                    style={styles.toucnCap}
                    onPress={() => this.openCamera(receiveGift)}
                >
                    <Image
                        source={require('../../../Assets/Images/iconCamera.jpg')}
                        style={{ width: 25, height: 25, marginLeft: 12, marginRight: 15 }}
                        resizeMode={'contain'}
                    ></Image>
                    <Text>Chụp hình nhận quà</Text>
                    {this.renderCheckin(this.state.sttImg1)}
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.toucnCap}
                    onPress={() => this.openCamera(signGift)}
                >
                    <Image
                        source={require('../../../Assets/Images/iconCamera.jpg')}
                        style={{ width: 25, height: 25, marginLeft: 12, marginRight: 15 }}
                        resizeMode={'contain'}
                    ></Image>
                    <Text>Chụp hình ký nhận </Text>
                    {this.renderCheckin(this.state.sttImg2)}
                </TouchableOpacity>
                <View style={{marginTop: 30}}>
                </View>
                <BottomButton
                    text={'HOÀN THÀNH'}
                    onPress={() => this.doneButtonHandle()}
                />
            </View>
        )
    }

    doneButtonHandle() {
        if (this.state.status) {
            // this.props.navigation.popToTop()
            this.props.navigation.navigate('Receiver', this.outletParam)
        }
        else {
            Alert.alert(
                'Thông báo',
                'Vui lòng chụp ảnh quà tặng',
                [
                    { text: 'OK' },
                ],
                { cancelable: false }
            )
        }
    }

    /************************ API  ******************************/
    postInfoAPI(base64, key) {
        this.setState({ showIndicator: true })
        let obj = {
            "EventStoreID": this.outletParam.eventStoreID,
            "SendStoreID": this.outletParam.sendStoreID,
            "StaffID": this.outletParam.idStaff,
            "ChannelShiftID": this.outletParam.channelShiftID,
            "Note": "Cooler1234",
            "DatePost": this.outletParam.datePost,
            "StatusSendStore":1,
            "Listinfo": [
                {
                    "QuestionID": 36,
                    "QuestionType": 2,
                    "QuestionGroup": 1,
                    "Long": this.outletParam.long,
                    "Lat": this.outletParam.lat,
                    "DatePost": moment().format("DD/MM/YYYY HH:mm:ss"),
                    "Answer": base64
                }
            ]
        }
        API.postImage(obj)
            .then(result => {
                if (result.status) {
                    this.setState({ status: true })
                    this.updateShowing(key)

                    // Alert.alert(
                    //     'Thông báo',
                    //     'Gửi hình ảnh thành công',
                    //     [
                    //         { text: 'OK', onPress: () => this.props.navigation.popToTop() },
                    //     ],
                    //     { cancelable: false }
                    // )
                }
                else {
                    this.deleteData(key)
                    Alert.alert(
                        'Thông báo',
                        JSON.stringify(result),
                        [
                            { text: 'OK' },
                        ],
                        { cancelable: false }
                    )


                }
                //set ActivityIndicator OFF
                this.setState({
                    showIndicator: false
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
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: ThemeColor.BG,
        padding: 10,
        flex: 1,
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
    }

})
export default GiftImage