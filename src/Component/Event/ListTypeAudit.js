import React, { Component } from 'react';
import { Dimensions, View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import * as ThemeColor from '../../Global/color'
import moment from "moment";

class ListTypeAudit extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: "Ghi nhận thông tin",
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
                    title: 'Hình ảnh tổng quan'
                },
                {
                    id: 2,
                    title: 'Thông tin nông dân'
                },
                {
                    id: 3,
                    title: 'Báo cáo cuối ngày'
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
                    // numColumns={3}
                    style={{ backgroundColor: '#F8F8F8' }}
                />
                {this.renderButton()}
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
        if(indexItem == 0) {
            this.props.navigation.navigate('DetailEvent', this.dataParam)

        }
        else if(indexItem == 1) {
            let infogroup = this.dataParam.EventStoreID + moment().format("DDMMYYYYHHmmssSSS")
            let cloneData =  this.dataParam
            cloneData.infogroup = infogroup
            // cloneData.indexItem = indexItem
            // console.log(infogroup)
            this.props.navigation.navigate('InfoEvent', this.dataParam)
        }
        else {
            this.props.navigation.navigate('FinalEvent', this.dataParam)
        }
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
        width:((Dimensions.get('window').width)-10), 
        justifyContent:'center', 
        alignItems:'center', 
        backgroundColor:'#27ae60', 
        borderRadius:5
    },
    viewItem: {
        justifyContent:'center', 
        alignItems:'center', 
        width: Dimensions.get('window').width - 20, 
        marginBottom:10, 
        marginTop:10
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