import React, { Component } from 'react'
import { ActivityIndicator, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as themeColor from './color'

const BottomButton = (props) => {
    return (
        <TouchableOpacity
            style={styles.buttonCont}
            onPress={() => props.onPress()}>
            {props.showIndicator ? <ActivityIndicator size="small" color="white"/> : null}
            <Text
                style={styles.textCont}
            >
                {props.text}
        </Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    buttonCont: {
        height: 44,
        backgroundColor: '#7cd036',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    }, textCont: {
        color: '#FFF',
        fontSize: 14,
        fontWeight : '500'
    },
})
export default BottomButton