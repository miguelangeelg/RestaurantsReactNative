import React, {useState} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Input, Button, Icon } from 'react-native-elements'
import {size, trim} from 'lodash'
import {useNavigation} from '@react-navigation/native'
import Loading from '../Loading'
export default function LogginForm() {
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState(defaultFormValue())
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const onChange = (e, type) => {
        setFormData({...formData, [type]:e.nativeEvent.text});
    }

    const [errorEmail, setErrorEmail] = useState("")
    const [errorPassword, setErrorPassword] = useState("")

    const doLogin = () => {
        alert('Login!');
    }

    return (
        <View style={styles.container}>
                <Input
                containerStyle={styles.input}
                placeholder="Entry your email"
                onChange= {(e) => onChange(e, "email")}
                keyboardType="email-address"
                errorMessage={errorEmail}
                defaultValue={formData.email}
            />
             <Input
                containerStyle={styles.input}
                placeholder="Entry your password"
                onChange= {(e) => onChange(e, "password")}
                password={true}
                secureTextEntry={!showPassword}
                errorMessage={errorPassword}
                defaultValue={formData.password}
                rightIcon={
                    <Icon 
                    onPress={()=>{
                        setShowPassword(!showPassword);
                    }}
                    type="material-community"
                    name={!showPassword ? "eye-outline" : "eye-off-outline"}
                    iconStyle={styles.icon}
                    />
                    }
            />
             <Button
                containerStyle={styles.btnContainer}
                buttonStyle={styles.buttons}
                onPress= {()=> doLogin()}
                title="Login"
            />
            <Loading isVisible={loading} text="Logging in" />

        </View>
    )

  
}

const defaultFormValue = () => {
        return { email : "", password : "", confirm : ""}
}    
const styles = StyleSheet.create({
    buttons:{
        backgroundColor:"#eb2c2c"
    },
    btnContainer:{
        marginTop:20,
        width:"95%",
        alignSelf:"center"
    },
    icon:{
        color:"#eb2c2c"
    },
    container:{
        flex:1,
        alignItems:"center",
        justifyContent: "center",
        marginTop:30
    },
    input:{
        width:"100%"
    }
})
