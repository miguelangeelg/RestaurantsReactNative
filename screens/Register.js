import React from 'react'
import { StyleSheet, Text, View , Image} from 'react-native'
import RegisterForm from '../components/account/RegisterForm'
import { KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'

export default function Register() {
    return (
        <KeyboardAwareScrollView >
            <Image
            resizeMode="contain"
            source={require('../assets/logo-restaurant.png')}
            style={styles.image}
           />
            <RegisterForm/>
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    image:{
        height:150,
        width:'100%',
        marginBottom:20
    },
    container:{
        flex:1,
        alignItems:"center",
        justifyContent:"center",
        marginTop:30
    }
})
