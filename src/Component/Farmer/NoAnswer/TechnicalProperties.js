import React, { Component } from 'react';

import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert
} from 'react-native';
import QuestionForm from '../../../Global/QuestionForm';
import moment from "moment";

const BDKS = 'TIẾP TỤC';
const QS1 = 'Anh/chị cho biết về  đặc tính của các sản phẩm trên (ít nhất đặc tính của 1 trong 6 sản phẩm)';

export default class TechnicalProperties extends Component {
  static navigationOptions = ({ navigation }) => {
    return { 
      title: 'ĐẶC TÍNH KỸ THUẬT',
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
      titleButton: '',
      showButton: false,
      time: moment().format("DD/MM/YYYY HH:mm:ss"),
      selectedOption:'',
    })
  }

  renderButton() {
    if (this.state.showButton) {
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
        <QuestionForm question={QS1} selected={this.selectedOption.bind(this)} />
        {this.renderButton()}
      </View>
    );
  }

  nextPage = async () => {
    if(this.state.selectedOption == 'CÓ') {
      let itemInfo = {
        "quest_id": 11,
        "quest_type": 2,
        "infogroup": 1,
        "_lat": 0.0,
        "_long": 0.0,
        "answer": 'KHÔNG ĐẠT 1',
        "date_create": moment().format("DD/MM/YYYY HH:mm:ss")
      }
      this.outletParam.listInfo.push(itemInfo)
    }
    else {
      let itemInfo = {
        "quest_id": 11,
        "quest_type": 2,
        "infogroup": 1,
        "_lat": 0.0,
        "_long": 0.0,
        "answer": 'KHÔNG ĐẠT 2',
        "date_create": moment().format("DD/MM/YYYY HH:mm:ss")
      }
      this.outletParam.listInfo.push(itemInfo)
    }
    let itemInfo = {
      "quest_id": 10,
      "quest_type": 2,
      "infogroup": 1,
      "_lat": 0.0,
      "_long": 0.0,
      "answer": this.state.selectedOption,
      "date_create": moment().format("DD/MM/YYYY HH:mm:ss")
    }
    this.outletParam.listInfo.push(itemInfo)
    this.props.navigation.navigate('NewProducts', this.outletParam)
  }

  //******************** API ***************************************/
  selectedOption(value) {
    this.setState({ selectedOption: value })
    this.setState({ titleButton: BDKS, showButton: true })
  }
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