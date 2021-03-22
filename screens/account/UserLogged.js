import React,{useState, useRef, useEffect} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button } from 'react-native-elements'
import { useNavigation} from '@react-navigation/native'
import { closeSession, getCurrentUser } from '../../utils/actions';
import Toast from 'react-native-easy-toast';
import Loading from '../../components/Loading';
import InfoUser from './InfoUser';
import AccountOptions from './AccountOptions';
export default function UserLogget() {
    const toastReference = useRef();
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [loadingText, setLoadingText] = useState("");
    const [user, setUser] = useState(null);
    const [reloadUser, setReloadUser] = useState(false);
    useEffect(() => {
       setUser(getCurrentUser());
       setReloadUser(false);
    }, [reloadUser])

    return (
        <View style={styles.container}>
            {
               user && 
               <View>
                  <InfoUser
                   setLoading={setLoading}
                   setLoadingText={setLoadingText}
                   user={user} />
                  <AccountOptions setReloadUser={setReloadUser} user={user} toastRef={toastReference} />
               </View>

            }
            <Button
            buttonStyle = {styles.btnCloseSession}
            titleStyle  = {styles.btnCloseSessionTitle}
                title = "Sign out"
                onPress= { () => {
                    closeSession();
                    navigation.navigate('restaurants');
                } }
            />
            <Toast ref={toastReference} position="center" opacity={0.9} />
            <Loading isVisible={loading} text={loadingText} />
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        minHeight:"100%"
    },
    btnCloseSession:{
        marginTop:30,
        borderRadius:5,
        backgroundColor:"#eb2c2c",
        borderTopWidth:1,
        borderTopColor:"#47240d",
        borderBottomWidth:1,
        borderBottomColor:"#eb2c2c",
        paddingVertical:10
    },
    btnCloseSessionTitle:{
        color:"#FFFF"
    }
})
