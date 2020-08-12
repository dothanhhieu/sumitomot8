import React, { Component } from 'react';
import { Dimensions, View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import * as ThemeColor from '../../Global/color'
import moment from "moment";

class ListTypeAudit extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: "CHỌN SUẤT",
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
            data: [
                {
                    id: 1,
                    title: 'Suất 1 (5 thùng Guru)'
                },
                {
                    id: 2,
                    title: 'Suất 2 (4 thùng Fizzi)'
                }
            ]
        }
    }

    componentDidMount() {
        console.log(this.dataParam)
    }

    /*********** FlatList Item Render *************/
    _rendItem = ({ item, index }) => {
        return (
            <View style={styles.viewItem}>
                <TouchableOpacity style={styles.renderTouch} onPress={() => this.handlePush(item, index)}>
                    <Text style={{color:'white', fontSize:14}}>{item.title}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.data}
                    renderItem={this._rendItem}
                    keyExtractor={(item, index) => (item + index)}
                    numColumns={3}
                    style={{ backgroundColor: '#F8F8F8' }}
                />
            </View>
        )
    }

    renderButton() {
        return (
            <View style={styles.viewButton}>
                <TouchableOpacity style={styles.touchLogin} onPress={() => this.props.navigation.popToTop()}>
                    <Text style={styles.btnStyle}>DANH SÁCH CỬA HÀNG</Text>
                </TouchableOpacity>
            </View>
        )
    }

    handlePush(item, indexItem) {
        //IDSuat-EventStoreIdddmmyyyyHHMMssSSS
        let infogroup = item.id + '-' + this.dataParam.eventStoreID + moment().format("DDMMYYYYHHmmssSSS")
        let cloneData =  this.dataParam
        cloneData.indexItem = indexItem
        cloneData.infogroup = infogroup
        this.props.navigation.navigate('TypeAuditDetail', cloneData)
      }
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: ThemeColor.BG,
        padding: 10,
        flex: 1,
        justifyContent:'space-between'
    },
    renderTouch: {
        height: 50, 
        width:((Dimensions.get('window').width / 2)-10), 
        justifyContent:'center', 
        alignItems:'center', 
        backgroundColor:'#27ae60', 
        borderRadius:5
    },
    viewItem: {
        justifyContent:'center', 
        alignItems:'center', 
        width: Dimensions.get('window').width / 2, 
        marginBottom:20, 
        marginTop:20
    },
    viewButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
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
    }
})
export default ListTypeAudit