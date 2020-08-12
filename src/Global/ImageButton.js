import React, { Component } from 'react'
import { Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as themeColor from './color'

const ImageButton = (props) => {
    return (
        <TouchableOpacity
            style={styles.toucnCap}
            onPress={() => props.onPress()}>
            <Image
                source={require('../Assets/Images/iconCamera.jpg')}
                style={{ width: 30, height: 30, marginLeft: 12, marginRight: 15 }}
                resizeMode={'contain'}
            ></Image>
            <Text>{props.text}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    toucnCap: {
        backgroundColor: 'rgb(255,255,255)',
        borderWidth: 1,
        borderColor: themeColor.BORDER_INP,
        height: 44,
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 15,
    },
    textCont: {
        color: '#FFF',
        fontSize: 14,
        fontWeight : '500'
    },
})
export default ImageButton