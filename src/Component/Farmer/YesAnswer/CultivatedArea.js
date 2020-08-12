import React, { Component } from 'react';

import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import moment from "moment";
import InputType from '../../../Global/InputType';

export default class CultivatedArea extends Component {
  static navigationOptions = ({ navigation }) => {
    return { 
      title: 'DIỆN TÍCH CANH TÁC',
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
    this.outletParam = this.props.navigation.state.params;
    this.state = ({
      acreage: '',
      showButton: false,
      time: moment().format("DD/MM/YYYY HH:mm:ss"),
    })
  }

  componentDidMount() {
    console.log(this.outletParam)
}

  renderButton() {
    if (this.state.acreage !== '') {
      return (
        <View style={styles.viewButton}>
          <TouchableOpacity style={styles.touchLogin} onPress={() => this.nextPage()}>
            <Text style={styles.btnStyle}>TIẾP TỤC</Text>
          </TouchableOpacity>
        </View>
      )
    }

    return null
  }

  render() {
    return (
      <View style={styles.viewContent}>
            <ScrollView style={{margin:10}} keyboardShouldPersistTaps='handled'>
                <Text style={{fontSize:15, color:'#2f3640', marginBottom:20}}>Anh/chị hiện có là bao nhiêu công ruộng?</Text>
                <InputType
                title={"Số công ruộng"}
                value={this.state.acreage}
                editText={true}
                textValue={this.textValue.bind(this)}
                keyboardType='phone-pad'
                placeHolder={"Nhập số lượng công ruộng"}
            />
            </ScrollView>
            {this.renderButton()}
      </View>
    );
  }

  textValue(title, value) {
    this.setState({ acreage: value })
  }

  addParamListInfo() {
    let itemInfo = {
      "quest_id": 7,
      "quest_type": 2,
      "infogroup": 1,
      "_lat": 0.0,
      "_long": 0.0,
      "answer": this.state.acreage,
      "date_create": moment().format("DD/MM/YYYY HH:mm:ss")
    }

    this.outletParam.listInfo.push(itemInfo)
  }

  nextPage = async () => {
    this.addParamListInfo()
    this.props.navigation.navigate('ImageFinal', this.outletParam)
  }

  //******************** API ***************************************/
}

const styles = StyleSheet.create({
  viewContent: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    justifyContent: 'space-between'
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
    flexDirection:'row', 
    justifyContent: 'space-between',  
    margin:10
  }
});