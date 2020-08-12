import React, { Component } from 'react'
import { View, Text, Image, ActivityIndicator, Dimensions, StyleSheet } from 'react-native';


const { width, height } = Dimensions.get('window')
var widthImage = ((width - 26) / 2)
const ItemImage = (props) => {
    return (
        <View
            style={styles.wrapper}
        >
            
            {props.wait
                ?
                <ActivityIndicator
                    size="large"
                    color="#FFF"
                />
                :
                <Image 
                    source={props.source}
                    style={{width : widthImage, height: widthImage}}
                    resizeMode={'cover'}
                >
                </Image>
            }

        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        margin: 2,
        width: ((width - 20) / 2),
        height: ((width - 20) / 2),
        backgroundColor: '#CECECE',
        justifyContent: 'center',
        alignItems: 'center'

    }
})

export default ItemImage