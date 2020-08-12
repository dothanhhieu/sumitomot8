import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    View,
    StyleSheet,
    Image,
    TextInput,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback
}
    from 'react-native';

export default class InputType extends Component {
    constructor(props) {
        super(props);
        this.state = {
            textInput: this.props.value,
            error: this.props.error,
            multiline: false
        };
    }

    validation(text) {
        this.setState({textInput:text})
        this.props.textValue(this.props.title, text)
    }

    render() {
        return (
            <TouchableWithoutFeedback>
                <View style={{ height: 55, margin:this.props.marginView}}>
                    <Text style={{color:'#4A4A4A', fontSize:12, marginBottom:5, marginTop:5}}>{this.props.title}</Text>
                    <View style={{
                        flexDirection: 'row',
                        height: 44,
                        borderColor: this.state.error ? '#DC0021' : '#EDEDED',
                        borderWidth: 1,
                        backgroundColor: 'white',
                        borderRadius: 2,
                        alignItems:'center'
                    }}>
                        <TextInput
                            multiline = {this.props.multiline}
                            style={styles.input}
                            underlineColorAndroid='transparent'
                            onChangeText={(text) => this.validation(text)}
                            // onEndEditing={this.onEndEditInput.bind(this)}
                            value={this.state.textInput}
                            secureTextEntry={this.props.secureText}
                            placeholderTextColor='#A0A0A0'
                            placeholder={this.props.placeHolder}
                            keyboardType={this.props.keyboardType}
                            editable={this.props.editText}
                        />
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    title: {
        fontSize: 12, 
        fontWeight: 'bold',
        color: '#D4D7D9'
    },
    input: {
        marginTop: 0,  
        marginLeft: 8,   
        paddingTop:0,
        paddingBottom: 0,
        fontSize: 14,
        color: '#4A4A4A',
        width: '85%',
        borderColor: '#48BBEC',
        fontWeight:'500'
        }
});