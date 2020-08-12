
import React, { Component } from 'react'
import { TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

const NavigationOptions = ({ navigation }) => ({
    title: 'DANH SÁCH ĐẠI LÝ',
    headerBackTitle: null,
    // headerRight: (
    //     <TouchableOpacity
    //         style={{ flexDirection: 'row', marginRight: 10 }}
    //         onPress={async () => {
    //             navigation.navigate('Profile')
    //         }}
    //     >
    //         <Image
    //             source={require('../../Assets/Images/profile.png')}
    //             style={{ width: 40 , height: 40 }}
    //         />
    //     </TouchableOpacity>
    // ),
    headerStyle: {
        backgroundColor: '#143146',
    },
    headerTintColor: '#fff',
})

export default NavigationOptions