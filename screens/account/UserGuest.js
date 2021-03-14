import React from 'react'
import { StyleSheet, Text, View ,  ScrollView, Image} from 'react-native';
import Loading from '../../components/Loading';
import {Button} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native'
export default function UserGuest() {
    const navigation = useNavigation();
    return (
        <ScrollView
        centerContent={true}
        style={styles.viewBody}
        >
            <Image
            resizeMode="contain"
            source={require('../../assets/logo-restaurant.png')}
            style={styles.image}
            />
            <Text style={styles.title} >Search you profile in restaurants</Text>
            <Text style={styles.description} > How would you describe you better restaurant, Search and look the better restaurants in 
                a simple way, vote witch you like most and comment how has been your experience. 
            </Text>
            <Button 
            buttonStyle={styles.button} 
            onPress={()=> { navigation.navigate("login"); }}
            title="Look you profile" />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    viewBody:{
        marginHorizontal:30,
    },
    image:{
        height:300,
        width:"100",
        marginBottom:10,
    },
    title: {
        fontWeight:"bold",
        fontSize:19,
        marginVertical:10,
        textAlign:"center"
    },
    description:{
        textAlign:"justify",
        marginBottom:20,
        color:"#eb2c2c"
    },
    button:{
        backgroundColor:"#eb2c2c"

    }
})
