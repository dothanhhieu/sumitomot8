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

export default class ChooseProducts extends Component {
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
      showButton: false,
      time: moment().format("DD/MM/YYYY HH:mm:ss"),
      selectedOption:'',
      selectedProduct: [],
      arrProduct:[]
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

  onSelectionsChange = (selectedProducts) => {
    if (selectedProducts.length == 0) {
        this.setState({showButton: false, selectedProduct: selectedProducts })
    }
    else {
        this.setState({showButton: true, selectedProduct: selectedProducts })
    }
  }

  render() {
    return (
      <View style={styles.viewContent}>
        <View style={{margin:10}}>
            <Text style={{fontSize:15, color:'#2f3640'}}>Hiện tại anh/chị đang sử dụng những sản phẩm nào trong 6 sản phẩm sau đây của Bayer: </Text>
        </View>
        <SelectMultiple
          items={products}
          selectedItems={this.state.selectedProduct}
          onSelectionsChange={this.onSelectionsChange} />
        {this.renderButton()}
      </View>
    );
  }

  renderValue(arrInput) {
    arrInput.map(item => {
          this.state.arrProduct.push(item.value)
      })

      return this.state.arrProduct
  }

  nextPage = async () => {
    let param = {
      "quest_id": 3,
      "quest_type": 2,
      "infogroup": 1,
      "_lat": 0.0,
      "_long": 0.0,
      "answer": this.renderValue(this.state.selectedProduct),
      "date_create": moment().format("DD/MM/YYYY HH:mm:ss")
    }
    let listParam = this.outletParam
    listParam.listInfo.push(param)
    this.props.navigation.navigate('ProductPackageImage',listParam)
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