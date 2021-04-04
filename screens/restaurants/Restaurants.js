import React, { useEffect, useState,useCallback } from 'react'
import { Text, StyleSheet, View } from 'react-native'
import { Icon } from 'react-native-elements'
import { getCurrentUser } from '../../utils/actions';
import { useFocusEffect } from '@react-navigation/native'
import Loading from '../../components/Loading';

export default function Restaurants({navigation}) {
    
    const [login, setLogin] = useState(false);
    const [user, setUser] = useState(null)
    useFocusEffect(
        useCallback(() => {
            setUser(getCurrentUser());
            setLogin(user ? true : false )
        }, [])
    )

    if (user == null) {
        <Loading isVisible={true} text="loading" />
    }

        return (
            <View style={styles.view}>
                <Text> Restaurants </Text>
                {
                    user && (
                        <Icon
                        type="material-community"
                        name="plus"
                        color="#eb2c2c"
                        reverse
                        containerStyle={styles.btnContainer}
                        onPress={()=> navigation.navigate("add-restaurant")}
                    />
                    )
                }
             
            </View>
        )
    
}

const styles = StyleSheet.create({
    view:{
        flex: 1
    },
    btnContainer:{
        position: "absolute",
        bottom:10,
        right:10,
        shadowColor:"black",
        shadowOffset:{width:2, height:2},
        shadowOpacity:0.5
    }
})
