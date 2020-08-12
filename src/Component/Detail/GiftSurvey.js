import React, { Component } from 'react';

import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert
} from 'react-native';
import QuestionForm from '../../Global/QuestionForm';
import moment from "moment";

const BDKS = 'TIẾP TỤC';
const QS1 = 'Cửa hàng có đạt chỉ tiêu không?';

export default class GiftSurvey extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'TRAO QUÀ ĐẠI LÝ',
      headerStyle: {
        backgroundColor: '#143146',
      },
      headerTintColor: '#fff',
    };
  };

  constructor(props) {
    super(props);
    this.outletParam = this.props.navigation.state.params;
    this.state = ({
      titleButton: '',
      showButton: false,
      time: moment().format("DD/MM/YYYY HH:mm:ss"),
      selectedOption:''
    })
  }

  renderButton(title) {
    if (this.state.showButton) {
      return (
        <View style={styles.viewButton}>
          <TouchableOpacity style={styles.touchLogin} onPress={() => this.nextPage()}>
            <Text style={styles.btnStyle}>{title}</Text>
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
        {this.renderButton(this.state.titleButton)}
      </View>
    );
  }

  nextPage = async () => {
    let param = this.outletParam
    param.answer = this.state.selectedOption
    this.props.navigation.navigate('GiftImage', param)
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