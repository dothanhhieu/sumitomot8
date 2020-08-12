import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    View,
    StyleSheet,
    Image,
    Dimensions,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback
}
    from 'react-native';

export default class QuestionFormOption extends Component {
    constructor(props) {
        super(props);
        this.state = {
            textInput: this.props.value,
            nameInput: '',
            arrInput: this.props.arrInput,
            colorSelectedYes:false,
            colorSelectedNo1:false,
            colorSelectedNo2:false
        };
    }

    selectedOption(key) {
        this.props.selected(key, this.props.idQuestion)
        if (key === "ĐẠT") {
            this.setState({colorSelectedYes:true, colorSelectedNo1:false, colorSelectedNo2:false})
        }
        else if (key === "KHÔNG ĐẠT 1") {
            this.setState({colorSelectedYes:false, colorSelectedNo1:true, colorSelectedNo2:false})
        }
        else {
            this.setState({colorSelectedYes:false, colorSelectedNo1:false, colorSelectedNo2:true})
        }
    }

    render() {
        return (
            <View style={styles.viewContent}>
            <Text style={styles.txtQuestion}>{this.props.question}</Text>
            <View style={styles.viewOption}>
                <TouchableOpacity style={{
                    borderRadius:18, 
                    backgroundColor:this.state.colorSelectedYes ? '#4A4A4A': 'white',
                    borderColor: '#979797', 
                    borderWidth:1, 
                    height:35, 
                    width:Dimensions.get('window').width / 3 - 30, 
                    justifyContent:'center', 
                    alignItems:'center'
                }} onPress={() => this.selectedOption('ĐẠT')}>
                    <Text style={{
                        color:this.state.colorSelectedYes ? "white" : '#4A4A4A', 
                        fontSize:12
                    }}>ĐẠT</Text>
                </TouchableOpacity>
              <TouchableOpacity style={{
                borderRadius:18, 
                backgroundColor:this.state.colorSelectedNo1 ? '#4A4A4A': 'white',
                borderColor: '#979797', 
                borderWidth:1, 
                height:35, 
                width:Dimensions.get('window').width / 3 - 30,
                justifyContent:'center', 
                alignItems:'center'
            }} onPress={() => this.selectedOption('KHÔNG ĐẠT 1')}>
                <Text style={{
                    color:this.state.colorSelectedNo1 ? "white" : '#4A4A4A', 
                    fontSize:12
                }}>KHÔNG ĐẠT 1</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{
                borderRadius:18, 
                backgroundColor:this.state.colorSelectedNo2 ? '#4A4A4A': 'white',
                borderColor: '#979797', 
                borderWidth:1, 
                height:35, 
                width:Dimensions.get('window').width / 3 - 30, 
                justifyContent:'center', 
                alignItems:'center'
            }} onPress={() => this.selectedOption('KHÔNG ĐẠT 2')}>
                <Text style={{
                    color:this.state.colorSelectedNo2 ? "white" : '#4A4A4A', 
                    fontSize:12
                }}>KHÔNG ĐẠT 2</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
    }
}

const styles = StyleSheet.create({
    viewContent: {
        margin:10, 
        backgroundColor:'white'
    },
    txtQuestion:{
        color:'#4A4A4A', 
        fontSize:14, 
        fontWeight:'bold',
        margin: 10,
    },
    viewOption: {
        flexDirection:'row', 
        justifyContent:'space-between', 
        margin:20
    },
    btnOptionNo: {
        borderRadius:18, 
        borderColor:'#979797', 
        borderWidth:1, 
        height:35, 
        width:Dimensions.get('window').width / 2 - 40, 
        justifyContent:'center', 
        alignItems:'center'
    },
    btnOptionYes: {
        borderRadius:18, 
        borderColor:'#979797', 
        borderWidth:1, 
        height:35, 
        width:Dimensions.get('window').width / 2 - 40, 
        justifyContent:'center', 
        alignItems:'center'
    },
    txtOptionNo: {
        color:"#4A4A4A", 
        fontSize:14
    },
    txtOptionYes: {
        color:"#4A4A4A", 
        fontSize:14
    }
});