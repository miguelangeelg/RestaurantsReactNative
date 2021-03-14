import React, {useState} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Input, Button, Icon } from 'react-native-elements'
import { validateEmail } from '../../utils/helpers'
import { registerUserF} from '../../utils/actions'
import {size, trim} from 'lodash'
import {useNavigation} from '@react-navigation/native'
import Loading from '../Loading'
export default function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState(defaultFormValue())
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const onChange = (e, type) => {
        setFormData({...formData, [type]:e.nativeEvent.text});
    }
    
    const [errorEmail, setErrorEmail] = useState("")
    const [errorPassword, setErrorPassword] = useState("")
    const [errorConfirm, setErrorConfirm] = useState("")
    const registerUser = async () => {
        setLoading(true)
        if (!validateData()){
            return;
        }
        let result = await registerUserF(formData.email, formData.password)
        setLoading(false);
        if (result.statusResponse === false) {
           setErrorEmail(result.error)
            return;
        }
        navigation.navigate('account')
    }

    const validateData = () => {
        setErrorConfirm("");
        setErrorEmail("");
        setErrorPassword("");
        let isValid = true;

        if (!validateEmail(formData.email)) {
            setErrorEmail("Email no valid");
            isValid = false;
        }

        if (size(formData.password)<6) {
            setErrorPassword("your password must be at least 6 characters long")
            isValid = false
        }

        // if (FormData.password+"" !== formData.confirm+"") {
        //     setErrorConfirm("the confirm password must be equal to password")
        //     isValid = false
        // }

        return isValid

    }
    
    return (
        <View style={styles.form}>
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
             <Input
                containerStyle={styles.input}
                placeholder="Confirm your password"
                password={true}
                secureTextEntry={!showPassword}
                errorMessage={errorConfirm}
                defaultValue={formData.confirm}
                onChange= {(e) => onChange(e, "confirm")}
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
                title="Register"
                onPress={()=> registerUser()}
            />
            <Loading isVisible={loading} text="We are creating you account" />
        </View>
    )
}

const defaultFormValue = () => {
    return { email : "", password : "", confirm : ""}
}


const styles = StyleSheet.create({
    icon:{
        color:"#eb2c2c"
    },
    buttons:{
        backgroundColor:"#eb2c2c"
    },
    btnContainer:{
        marginTop:20,
        width:"95%",
        alignSelf:"center"
    },
    form:{
        marginTop:30,

    },
    input:{
        width:"100%"
    }
})
