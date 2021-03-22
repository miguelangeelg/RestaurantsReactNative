import { isEmpty } from 'lodash';
import React, {useState} from 'react'
import { StyleSheet, View } from 'react-native'
import {Button, Input} from 'react-native-elements'
import { updateProfile } from '../../utils/actions';
export default function ChangeNames({displayName, setShowM,setReloadUser,toastRef}) {
    const [newDisplayName, setNewDisplayName] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const onSubmit = async () => {
        if (!validateForm()){
            return;
        }
        setLoading(true);

        const response =  await updateProfile({displayName: newDisplayName});
        setLoading(false);
        if (!response.statusResponse) {
            setError("Error updating names");
            return;
        }
        setReloadUser(true);
        toastRef.current.show("Names updated",3000);
        setShowM(false);
    }

    const validateForm = () => {
        setError(null);
        if (isEmpty(newDisplayName)) {
            setError('Entry names!')
            return false;
        }
        if (newDisplayName === displayName) {
            setError('You must enter a diferent name to update it!')
            return false;
        }
        return true;
    }

    return (
        <View style={styles.view}>
            <Input
                placeholder = "Entry names"
                containerStyles = {styles.input}
                defaultValue = {displayName}
                rightIcon = {{
                    type:"material-community",
                    name:"account-circle-outline",
                    color: "#eb2c2c" 
                }}
                onChange = {(event)=>{setNewDisplayName(event.nativeEvent.text)}}
                errorMessage = {error}
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
