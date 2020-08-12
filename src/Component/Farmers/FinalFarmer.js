import React, { Component } from 'react';

import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import QuestionFormOption from '../../Global/QuestionFormOption';
import moment from "moment";
import * as API from '../../API';
import InputType from '../../Global/InputType';

const BDKS = 'HOÀN THÀNH';
const QS1 = 'Chấm điểm cửa hàng:';

export default class FinalFarmer extends Component {
  static navigationOptions = ({ navigation }) => {
    return { 
      title: 'KHẢO SÁT THÔNG TIN',
      headerStyle: {
        backgroundColor: '#143146',
      },
      headerTintColor: '#fff',
      headerBackTitle: null,
      headerLeft: null
    };
  };

  constructor(props) {
    super(props);
    this.dataParam= this.props.navigation.state.params;
    this.state = ({
      titleButton: '',
      showButton: false,
      time: moment().format("DD/MM/YYYY HH:mm:ss"),
      selectedOption:'',
      listInfo: [],
      disabledButton: false,
      showIndicatorUpdate: false,
      culArea: ''
    })
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

  render() {
    return (
      <KeyboardAvoidingView style={styles.viewContent} behavior="padding" enabled={Platform.OS === 'ios' ? true : false}>
        <InputType
            title={"Số công ruộng"}
            value={this.state.culArea}
            marginView={10}
            editText={true}
            textValue={this.textValue.bind(this)}
            keyboardType='decimal-pad'

        />
        <QuestionFormOption question={QS1} selected={this.selectedOption.bind(this)} />
        {this.renderButton(this.state.titleButton)}
      </KeyboardAvoidingView>
    );
  }

  textValue(title, value) {
    this.setState({ 'culArea': value })
}

  doneButtonHandle = async () => {
    if(this.state.selectedOption !== '') {
        let cloneParam = this.dataParam
        cloneParam.DatePost = moment().format("DD/MM/YYYY HH:mm:ss")
        cloneParam.ListInfo = [{
            "QuestionID": 14,
            "QuestionType": 1,
            "QuestionGroup": 2,
            "Long": this.dataParam.Longtitude,
            "Lat": this.dataParam.Latitude,
            "DatePost": moment().format("DD/MM/YYYY HH:mm:ss"),
            "Answer": this.state.selectedOption,
            "infogroup":"0932612443"
        },
        {
            "QuestionID": 10,
            "QuestionType": 1,
            "QuestionGroup": 2,
            "Long": this.dataParam.Longtitude,
            "Lat": this.dataParam.Latitude,
            "DatePost": moment().format("DD/MM/YYYY HH:mm:ss"),
            "Answer": this.state.culArea,
            "infogroup":"0932612443"
        }]
        this.postInfoAPI(cloneParam)
    }
    else {
        Alert.alert(
            'Thông báo',
            'Vui lòng chấm điểm cửa hàng trước khi gửi thông tin',
            [
                { text: 'OK'},
            ],
            { cancelable: false }
        )
    }
    
  }

  //******************** API ***************************************/
  selectedOption(value) {
    this.setState({ selectedOption: value })
    console.log(value)
    this.setState({ titleButton: BDKS, showButton: true })
  }

  /************************ API  ******************************/
  postInfoAPI(paramObj) {
    this.setState({showIndicatorUpdate: true, disabledButton: true})
    console.log(paramObj)

    API.postInfo(paramObj)
        .then(result => {
            console.log(result)
            if (result.status) {
                Alert.alert(
                    'Thông báo',
                    'Gửi thông tin thành công',
                    [
                        { text: 'OK', onPress: () => this.props.navigation.popToTop()},
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
  viewContent: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  touchLogin: {
    backgroundColor: '#7cd036',
    marginTop: 20,
    width: Dimensions.get('window').width - 20,
    height: 44,
    justifyContent: "center",
    alignItems: 'center',
    borderRadius: 2,
    flexDirection:'row'
  },
  btnStyle: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
  },
  viewButton: {
    flexDirection:'row', 
    justifyContent: 'space-between',  
    margin:10
  }
});