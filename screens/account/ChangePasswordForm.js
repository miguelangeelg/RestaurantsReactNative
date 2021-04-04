import { isEmpty, size } from 'lodash';
import React,{useState} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Input , Button, Icon} from 'react-native-elements';
import { reauthenticate, updateEmail, updatePassword } from '../../utils/actions';
import { validateEmail } from '../../utils/helpers';

export default function ChangePasswordForm({setShowM,toastRef}) {
    const [currentPassword, setCurrentPassword] = useState(null);
    const [newPassword, setNewPassword] = useState(null);
    const [newConfirmPassword, setNewConfirmPassword] = useState(null);
    const [errorCurrentPassword, setErrorCurrentPassword] = useState(null);
    const [errorNewPassword, setErrorNewPassword] = useState(null);
    const [errorNewConfirmPassword, setErrorNewConfirmPassword] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false)

    const onSubmit = async () => {
        if (!validateForm()){
            return;
        }
        setLoading(true);
        const resultAuthentication =  await reauthenticate(currentPassword);

        if (!resultAuthentication.statusResponse) {
            setErrorNewPassword("password incorrect");
            return;
        }
        const changeEmail = await updatePassword(newPassword);

        if (!changeEmail.statusResponse) {
            setErrorEmail("Cannot update the password");
            return;
        }
        setLoading(false)
       
        toastRef.current.show("Password update it",3000);

        setShowM(false);
    }

    const validateForm = () => {
        setErrorCurrentPassword(null);
        setErrorNewPassword(null);
        setErrorNewConfirmPassword(null);

        let isValid = true;

        if (size(newPassword)<6) {
            setErrorNewPassword("Your password must be of 6 length min");
            isValid = false;
        }

        if (isEmpty(newPassword)) {
            setErrorNewPassword('Enter you new password')
            isValid =  false;
        }
        if (isEmpty(currentPassword)) {
            setErrorCurrentPassword('Enter your current password')
            isValid = false;
        }

        if (isEmpty(newConfirmPassword)) {
            setErrorNewConfirmPassword('Enter your confirm password')
            isValid = false;
        }

        if (newConfirmPassword !== newPassword) {
            setErrorNewPassword("The confirmation password must be equal");
            isValid = false;
        }

        

        return isValid;
    }

    return (
        <View style={styles.view}>
            <Input
                placeholder = "Enter current password"
                containerStyles = {styles.input}
                defaultValue = {currentPassword}
                password={true}
                secureTextEntry={!showPassword}
                rightIcon = {
                    <Icon
                    
                        type= "material-community"
                        name= { showPassword ? "eye-off-outline" : "eye-outline"}
                        iconStyle= {{color:"#eb2c2c"}} 
                        onPress = {() => setShowPassword(!showPassword)}
                    />
                 }
                onChange = {(event)=>{setCurrentPassword(event.nativeEvent.text)}}
                errorMessage = {errorCurrentPassword}
            />
            <Input
                placeholder = "Enter your new password"
                containerStyles = {styles.input}
                defaultValue = {newPassword}
                password={true}
                secureTextEntry={!showPassword}
                rightIcon = {
                    <Icon
                    
                        type= "material-community"
                        name= { showPassword ? "eye-off-outline" : "eye-outline"}
                        iconStyle= {{color:"#eb2c2c"}} 
                        onPress = {() => setShowPassword(!showPassword)}
                    />
                 }
                onChange = {(event)=>{setNewPassword(event.nativeEvent.text)}}
                errorMessage = {errorCurrentPassword}
            />
            <Input
                placeholder = "Enter your new confirm password"
                containerStyles = {styles.input}
                defaultValue = {newConfirmPassword}
                password={true}
                secureTextEntry={!showPassword}
                rightIcon = {
                    <Icon
                    
                        type= "material-community"
                        name= { showPassword ? "eye-off-outline" : "eye-outline"}
                        iconStyle= {{color:"#eb2c2c"}} 
                        onPress = {() => setShowPassword(!showPassword)}
                    />
                 }
                onChange = {(event)=>{setNewConfirmPassword(event.nativeEvent.text)}}
                errorMessage = {errorNewConfirmPassword}
            />
     
                
            <Button
                title="Update"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress = {onSubmit}
                loading = {loading}
            />
        </View>
    )

}

const styles = StyleSheet.create({
    view:{
        alignItems:"center",
        paddingVertical:10
    },
    input: {
        marginBottom: 10
    },
    btnContainer: {
        width:"95%"
    },
    btn: {
        backgroundColor: "#eb2c2c" 
    }
})
