import React, { Component } from 'react';

import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert
} from 'react-native';
import moment from "moment";
import SelectMultiple from 'react-native-select-multiple'
const products = ['Antracol', 'Aliet', 'Nativo', 'Folicur', 'Luna', 'Prevathon']

export default class ProductKnowledge extends Component {
  static navigationOptions = ({ navigation }) => {
    return { 
      title: 'SẢN PHẨM',
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
      time: moment().format("DD/MM/YYYY HH:mm:ss"),
      selectedOption:'',
      selectedProduct: []
    })
  }

  renderButton() {
      return (
        <View style={styles.viewButton}>
          <TouchableOpacity style={styles.touchLogin} onPress={() => this.noHandle()}>
            <Text style={styles.btnStyle}>KHÔNG BIẾT</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.touchLogin} onPress={() => this.yesHandle()}>
            <Text style={styles.btnStyle}>TIẾP TỤC</Text>
          </TouchableOpacity>
        </View>
      )
  }

  onSelectionsChange = (selectedProducts) => {
    console.log(selectedProducts)

    if (selectedProducts.length == 0) {
        this.setState({selectedProduct: selectedProducts })
    }
    else {
        this.setState({selectedProduct: selectedProducts })
    }
  }

  render() {
    return (
      <View style={styles.viewContent}>
        <View style={{margin:10}}>
            <Text style={{fontSize:15, color:'#2f3640'}}>Hiện tại anh/chị có biết những sản phẩm nào trong 6 sản phẩm sau đây của Bayer: </Text>
        </View>
        <SelectMultiple
          items={products}
          selectedItems={this.state.selectedProduct}
          onSelectionsChange={this.onSelectionsChange} />
        {this.renderButton()}
      </View>
    );
  }

  yesHandle = async () => {
      if(this.state.selectedProduct.length > 0) {
        this.props.navigation.navigate('TechnicalProperties', this.outletParam)
      }
      else {
        Alert.alert(
            'Thông báo',
            'Vui lòng chọn ít nhất 1 sản phẩm để tiếp tục',
            [
                { text: 'OK' },
            ],
            { cancelable: false }
        )
      }
  }

  noHandle = async () => {
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
    this.props.navigation.navigate('NewProducts', this.outletParam)
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
    width: Dimensions.get('window').width / 2 - 20,
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