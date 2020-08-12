import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    View,
    StyleSheet,
    Image,
    Text
}
    from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';

export default class DropdownType extends Component {
    constructor(props) {
        super(props);
        this.state = {
            textInput: this.props.value,
            nameInput: this.props.nameInput,
            arrInput: this.props.arrInput,
        };
    }

    dropDownSelected(id, value) {
        this.props.selected(this.props.title, value)
    }

    render() {
        return(
            <View style={styles.viewContent}>
                <Text style={styles.textTitle}>{this.props.title}</Text>
                <View style={styles.viewDropdown}>
                    <ModalDropdown
                        disabled={this.props.disabled}
                        options={this.props.arrInput}
                        defaultValue={this.props.nameInput}
                        style={styles.dropdown}
                        dropdownStyle={{ width: '70%' }}
                        dropdownTextStyle={styles.dropDownTextStyle}
                        textStyle={{
                            fontSize: 14,
                            color: '#4A4A4A',
                            textAlignVertical: 'center',
                            marginVertical: 10,
                            marginHorizontal: 6
                        }}
                        onSelect={(id, value) => this.dropDownSelected(id, value)}
                    />
                    <Image
                        source={require("../Assets/Images/dropdown.png")}
                        style={styles.imgDropdown}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    viewContent: {
        height: 55,
        margin: 10,
        justifyContent: 'center'
    },
    viewDropdown: {
        flexDirection: 'row',
        borderRadius: 3,
        borderColor: '#EDEDED',
        borderWidth: 1,
        height: 40,
        backgroundColor: 'white',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dropdown: {
        width: '92%',
        textAlign: 'center',
        marginLeft: 5
    },
    imgDropdown: {
        width: 10,
        height: 10,
        resizeMode: 'contain',
        marginRight: 5,
    },
    textTitle: {
        color: '#4A4A4A',
        fontSize: 12,
        marginBottom: 5,
        marginTop: 5
    },
    dropDownTextStyle: {
        fontSize: 14,
        color: "#1a1a1a",
    }
});