import React from 'react'
import { StyleSheet, Text, View, ScrollView , Image} from 'react-native'
import { Divider } from 'react-native-elements';
import {useNavigation} from '@react-navigation/native'
import LogginForm from '../../components/account/LogginForm';
export default function Login() {
    return (
       <ScrollView>
           <Image
            source={require('../../assets/logo-restaurant.png')}
            resizeMode="contain"
            style={styles.image}
           />
           <View style={styles.container}>
            <LogginForm/>
           <CreateAccount/>
           </View>
           <Divider style={styles.Divider} />
       </ScrollView>
    )


}

function CreateAccount(props) {
    const navigation = useNavigation();
    return(
        <Text style={styles.register}
        onPress={()=>{
            navigation.navigate('register');
        }}
        >
           you do not have an account yet? {" "}
           <Text style={styles.btnRegister}>
               Sign on
           </Text>
        </Text>
    );
}

const styles = StyleSheet.create({
    image:{
        height:150,
        width:'100%',
        marginBottom:20
    },
    container: {
        marginHorizontal:40
    },
    Divider:{
        backgroundColor:"#eb2c2c",
        margin:40
    },
    register: {
        marginTop:15,
        marginHorizontal:10,
        alignSelf:"center"
    },
    btnRegister:{
        color:"#eb2c2c",
        fontWeight:"bold"
    }
})
