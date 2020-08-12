import React, { Component } from 'react';

import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  TextInput,
  Keyboard,
  Alert
} from 'react-native';
import { exListOutlet } from '../../API/SampleAPI'
import NavigationOptions from './NavigationOptions'
import * as API from '../../API';
import AsyncStorage from '@react-native-community/async-storage';

export default class OutletList extends Component {
  static navigationOptions = NavigationOptions

  constructor(props) {
    super(props);
    this.outletParam = this.props.navigation.state.params;
    this.state = {
      data: exListOutlet,
      idStaff:'',
      roleID: '',
      eventID: '',
      channelShiftID:''
      }
    }

  async loadData() {
    this.getListOutletAPI(eventID, userData.staffID, userData.role, "")
  }

  componentWillUnmount() {
    this.reRenderSomething;
  }

  componentDidMount() {
    this.reRenderSomething = this.props.navigation.addListener('willFocus', () => {
      this.loadData();
    });
}

  renderImgReAudit(status) {
    switch (status) {
      case 1: return (
        <Image source={require('../../Assets/Images/checked.png')} style={styles.imgReAudit} />
      );
      case 2: return (
        <Image source={require('../../Assets/Images/reAudit.png')} style={styles.imgReAudit} />
      );
      default: break
    }

    return null
  }

  /*********** FlatList Item Render *************/
  _rendItem = ({ item, index }) => {
    return (
      <TouchableOpacity style={styles.viewRenderItem} onPress={() => this.onItemPress(item)}>
        <View style={styles.viewContentItem}>
          <Text style={styles.textNameStore}>{item.nameStore}</Text>
          <View style={styles.viewPhoneKey}>
          <Text style={styles.textItem}>{item.address}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  renderSearchInput() {
    return (
      <View style={styles.viewContentSearch}>
        <View style={styles.viewItemSearch}>
          <Image
            source={require('../../Assets/Images/search.png')}
            style={{ width: 20, height: 20, marginLeft: 10 }}
          />
          <TextInput
            placeholder={'Tìm kiếm ...'}
            underlineColorAndroid={'transparent'}
            style={styles.textInputSearch}
            onChangeText={(text) => { this.setState({ keyword: text }) }}
            value={this.state.keyword}
          />
          <TouchableOpacity onPress={() => { Keyboard.dismiss(), this.searchHandle() }} style={styles.btnSearch}>
            <Text style={styles.textSearch}>Tìm</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  render() {
    return (
      <View
        style={styles.viewContent}>
        {this.renderSearchInput()}
        <FlatList
          data={this.state.data}
          renderItem={this._rendItem}
          keyExtractor={(item, index) => (item + index)}
          initialNumToRender={4}
          style={{ backgroundColor: '#F8F8F8' }}
        />
      </View>
    )
  }

  //******************** Handle ***************************************/
  searchHandle() {
    this.setState({ 'arrInput': this.state.arrNotAudit })
    this.getListOutletAPI(this.state.eventID, this.state.idStaff, this.state.roleID, this.state.keyword)
  }

  onItemPress = (data) => {
    let clone = data 
    this.props.navigation.navigate('ListDetailEvent', clone)
  }

  //********************** API *****************************************/

}

const styles = StyleSheet.create({
  /* View Render */
  viewRenderItem: {
    backgroundColor: 'white',
    marginTop: 10
  },
  viewContentItem: {
    margin: 10
  },
  textNameStore: {
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 5,
    marginBottom: 5,
    color:'#143146'
  },
  viewContent: {
    flex: 1,
    backgroundColor: '#F8F8F8'
  },
  viewContentSearch: {
    backgroundColor: '#F8F8F8',
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textInputSearch: {
    margin: 5,
    height: 35,
    marginRight: 8,
    backgroundColor: 'white',
    borderRadius: 21,
    flex: 1
  },
  viewPhoneKey: {
    flexDirection: 'row',
    marginTop: 10,
  },
  imgPhone: {
    width: 15,
    height: 15,
    marginRight: 10
  },
  imgKey: {
    width: 15,
    height: 15,
    marginRight: 10,
    marginLeft: 25
  },
  textItem: {
    fontWeight: '300',
  },
  statusTimer: {
    color: '#4EAA32',
    fontWeight: '400',
    fontSize: 15
  },
  textTimer: {
    marginLeft: 5,
    fontSize: 15,
    fontWeight: '400',
  },
  imgReAudit: {
    marginLeft: 50,
    width: 20,
    height: 20,
  },
  viewItemSearch: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    height: 40,
    width: '97%',
    borderRadius: 21
  },
  btnSearch: {
    backgroundColor: '#D8D8D8',
    width: 64,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5
  },
  textSearch: {
    color: 'black',
    fontSize: 15
  },
  viewDropdown: {
    width: '20%',
    flexDirection: 'row',
    borderRadius: 3,
    borderColor: '#EDEDED',
    borderWidth: 1,
    height: 40,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  dropdown: {
    width: '92%',
    textAlign: 'center',
    marginLeft: 5,
  },
  textTitle: {
    color: '#4A4A4A',
    fontSize: 12,
    marginBottom: 5,
    marginTop: 5
  },
  dropDownTextStyle: {
    fontSize: 12,
    color: "#1a1a1a",
  }
});