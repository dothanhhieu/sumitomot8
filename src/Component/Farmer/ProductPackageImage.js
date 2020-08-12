import React, { Component } from 'react';
import {View, Text, StyleSheet, Alert, TouchableOpacity, FlatList, Image, Dimensions, ActivityIndicator } from 'react-native';
import * as ThemeColor from '.././../Global/color'
import BottomButton from '../../Global/BottomButton'
import ItemImage from './ItemImage'
import ImagePicker from 'react-native-image-picker';
import moment from "moment";
import * as API from '../../API';

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

const KBB = 'KHÔNG BAO BÌ'
const TT = 'TIẾP TỤC'

class ProductPackageImage extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: "HÌNH ẢNH BAO BÌ",
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
            titleBtn: KBB,
            status: true,
            time: moment().format("DD/MM/YYYY HH:mm:ss"),
            arrImg:[]
        }
    }

    componentDidMount() {
        console.log(this.outletParam)
    }

    updateShowing = (key) => {
        
            let clone = this.state.datas;

            clone.map(item => {
                if (item.key == key) {
                    item.wait = false;
                }
            })

            this.setState({ datas: clone })
        
    }

    deleteData = (key) => {
        let clone = this.state.datas;

            clone.map((item, index) => {
                if (item.key == key) {
                   delete clone[index];
                }
            })

        this.setState({ datas: clone })
    }

    pressCapture = () => {
        ImagePicker.launchCamera(options, (response) => {
            if (response.didCancel) {
                //console.log('User cancelled image picker');
            } else if (response.error) {
                //console.log('ImagePicker Error: ', response.error);
            } else {
                let key = Date.now()
                // moment().format("DD/MM/YYYY HH:mm:ss")
                this.setState({
                    datas: this.state.datas.concat({
                        source: { uri: 'data:image/jpeg;base64,' + response.data },
                        wait: true,
                        key: key
                    })
                });
                this.addImageItemArray(response.data, key)
            }
        });
    }

        // Add Image Array
    addImageItemArray(data, key) {
        let itemImg = {
            "questionId": 2,
            "questionType": 2,
            "answer": data
        }
        this.setState({
            arrImg: [...this.state.arrImg, itemImg]
        })
        this.updateShowing(key)
    }


    render() {
        const { width, height } = Dimensions.get('window')
        var ratio = 1080 / ((width - 30) / 2);

        return (
            <View
                style={styles.container}>
                <View style={{margin:10}}>
                    <Text style={{fontSize:15, color:'#2f3640'}}>Anh/chị vui lòng trình ra gói/chai của những sản phẩm mình đang sử dụng (ít nhất 1 trong 6 sản phẩm)?</Text>
                </View>
                <TouchableOpacity
                    style={styles.toucnCap}
                    onPress={this.pressCapture}
                >
                    <Image
                        source={require('../../Assets/Images/iconCamera.jpg')}
                        style={{ width: 30, height: 30, marginLeft: 12, marginRight: 15 }}
                        resizeMode={'contain'}
                    ></Image>
                    <Text>Chụp hình bao bì sản phẩm</Text>
                </TouchableOpacity>

                <FlatList
                    style={{ marginTop: 17 }}
                    numColumns={2}
                    data={this.state.datas}
                    renderItem={({ item }) => <ItemImage time={item.time} wait={item.wait} source={item.source} />}
                    keyExtractor={(item, index) => item + index}
                >
                </FlatList>
                {this.renderButton()}
            </View>
        )
    }

    renderButton() {
        return(
            <BottomButton
                text={this.state.titleBtn}
                onPress={() => this.doneButtonHandle()}
            />
        )
    }

    doneButtonHandle() {
        if (this.state.status) {
            this.props.navigation.navigate('ProductDetail', this.outletParam)
        }
        else {
            this.props.navigation.navigate('TechnicalProperties', this.outletParam)
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
                    this.setState({ status: true, titleBtn: TT})
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
    },

    wineTypeStl: {
        color: 'rgb(74,74,74)',
        fontSize: 12
    }

})
export default ProductPackageImage