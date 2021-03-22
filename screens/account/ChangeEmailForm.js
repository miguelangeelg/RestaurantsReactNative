import { isEmpty } from 'lodash';
import React,{useState} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Input , Button, Icon} from 'react-native-elements';
import { reauthenticate, updateEmail } from '../../utils/actions';
import { validateEmail } from '../../utils/helpers';

export default function ChangeEmailForm({email, setShowM,setReloadUser,toastRef}) {
    const [newEmail, setNewEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [errorEmail, setErrorEmail] = useState(null);
    const [errorPassword, setErrorPassword] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false)

    const onSubmit = async () => {
        if (!validateForm()){
            return;
        }
        setLoading(true);
        const resultAuthentication =  await reauthenticate(password);

        if (!resultAuthentication.statusResponse) {
            setErrorPassword("password incorrect");
            return;
        }

        const changeEmail = await updateEmail(email);

        if (!changeEmail.statusResponse) {
            setErrorEmail("Cannot update email because that email is used for other user");
            return;
        }

       /* const response =  await updateProfile({displayName: newDisplayName});
        setLoading(false);
        if (!response.statusResponse) {
            setError("Error updating names");
            return;
        }
        */
        setReloadUser(true);
        toastRef.current.show("Email updated",3000);

        setShowM(false);
    }

    const validateForm = () => {
        setErrorEmail(null);
        setErrorPassword(null);
        let isValid = true;
        if (!validateEmail(newEmail)) {
            setErrorEmail('Enter a correct format email!')
            isValid =  false;
        }
        if (email === newEmail) {
            setErrorEmail('You must enter a diferent email to update it!')
            isValid = false;
        }

        if (isEmpty(password)) {
            setErrorPassword('You must enter your current password')
            isValid = false;
        }

        return isValid;
    }

    return (
        <View style={styles.view}>
            <Input
                placeholder = "Entry email"
                containerStyles = {styles.input}
                defaultValue = {email}
                keyboardType="email-address"
                rightIcon = {{
                    type:"material-community",
                    name:"at",
                    color: "#eb2c2c" 
                }}
                onChange = {(event)=>{setNewEmail(event.nativeEvent.text)}}
                errorMessage = {errorEmail}
            />
           <Input
                placeholder = "Entry password"
                containerStyles = {styles.input}
                defaultValue = {password}
                rightIcon = {
                    <Icon
                    
                        type= "material-community"
                        name= { showPassword ? "eye-off-outline" : "eye-outline"}
                        iconStyle= {{color:"#eb2c2c"}} 
                        onPress = {() => setShowPassword(!showPassword)}
                    />
                 }
                onChange = {(event)=>{setPassword(event.nativeEvent.text)}}
                errorMessage = {errorPassword}
                password = {true}
                secureTextEntry={!showPassword}
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
