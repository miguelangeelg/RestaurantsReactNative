import React, { useState, useCallback, useRef } from 'react'
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import { Button, Card, Icon, Image } from 'react-native-elements'
import { useFocusEffect } from '@react-navigation/native'
import Toast from 'react-native-easy-toast'
import firebase from 'firebase/app'
import { StatusBar } from "react-native";

import { getFavorites, removeFavoriteAction } from '../utils/actions'
import Loading from '../components/Loading'

export default function Saved({ navigation }) {
    const toastRef = useRef()
    const [restaurants, setRestaurants] = useState(null)
    const [userLogged, setUserLogged] = useState(false)
    const [loading, setLoading] = useState(false)
    const [reloadData, setReloadData] = useState(false)  // To reload data when delete favorite

    firebase.auth().onAuthStateChanged((user) =>{
        user ? setUserLogged(true) : setUserLogged(false)
    })
   

    useFocusEffect(
        useCallback(() => {
            if(userLogged){                
                async function getData(){
                    setLoading(true)
                    const response = await getFavorites()
                    setRestaurants(response.favorites)
                    setLoading(false)                
                }
                getData()
            }
            setReloadData(false)
        }, [userLogged, reloadData])  // this method executes the firts time the screen reload and when this values change
    )

    if(!userLogged){
        return <UserNoLogged navigation={navigation} /> 
    }
    if(!restaurants){
        return <Loading isVisible={true} text="Loading Restaurants..." />
    }else if(restaurants?.length === 0){ 
        return <NotFoundRestaurant/>
    }

    return (
        <View style={styles.viewSaved}>
                  <StatusBar barStyle="light-content" />
            {
                restaurants ? (
                    <FlatList 
                    data={restaurants}
                        keyExtractor={(item, index) => index.toString() }
                        renderItem={(restaurant) =>(
                            <Restaurant   //Internal component
                                restaurant={restaurant}
                                setLoading={setLoading}
                                toastRef={toastRef}
                                navigation={navigation}
                                setReloadData={setReloadData}
                            />
                        )}
                    />
                ) : (
                    <View style={styles.loaderRestaurant} >
                        <ActivityIndicator size="large"/>
                        <Text style={{textAlign:"center"}} >
                           Loading restaurants...
                        </Text>
                    </View>
                )
            }
            <Toast ref={toastRef} position="center" opacity={0.9}/>
            <Loading isVisible={loading} text="moment..." />
        </View>
    )
}

function Restaurant({ restaurant, setLoading, toastRef, navigation, setReloadData }){
    const { id, name, images } = restaurant.item

    const confirmRemoveFavorite = () =>{
        Alert.alert(
            "Delete restaurant",
            "are you sure delete it?",
            [
                {
                    text: "No",
                    style: "cancel"
                },
                {
                    text: "Yes",
                    onPress: removeFavoriteRestaurant
                }
            ],
            { cancelable: false}
        )
    }

    const removeFavoriteRestaurant = async() =>{
        setLoading(true)
        const response = await removeFavoriteAction(id)
        setLoading(false)
        if (response.statusResponse) {
            setReloadData(true)
            toastRef.current.show("Restaurant deleted!", 3000)
        } else{
            toastRef.current.show("Error when it was tried delete it", 3000)
        }
    }

    return(
        <View style={styles.restaurant}>
            <Card containerStyle={{borderRadius:15,width:"98%"}}>
            <TouchableOpacity onPress={() => navigation.navigate("restaurants",{
                screen: "restaurant",
                params:{id, name}
            })} >

                <Image
                    resizeMode= "cover"
                    style={styles.imageRestaurant}
                    PlaceholderContent={<ActivityIndicator color="#fff" />}
                    source={{uri: images[0]}}
                />  
            </TouchableOpacity>
            <View style={styles.info} > 
                <Text style={styles.name} >{name}</Text>
                <Icon
                    type="material-community"
                    name="bookmark"
                    color="#f00"
                    containerStyle={styles.favorite}
                    underlayColor="transparent"
                    onPress={confirmRemoveFavorite}
                />
            </View>
            </Card>
        </View>
    )
}


function NotFoundRestaurant() {
    return(
        <View style={{flex:1, alignItems:"center", justifyContent:"center"}} >
            <Icon type= "material-community" name= "alert-remove" size={70} color={"#151c4c"}  />
            <Text style={{ fontSize: 20, fontWeight: "bold", color: "#151c4c", marginTop: 40 }}>
                Aún no tienes espacios deportivos guardados.
            </Text>
        </View>
    )
}

function UserNoLogged({ navigation }) {
    return(
        <View style={{flex:1, alignItems:"center", justifyContent:"center"}} >
            <Icon type= "material-community" name= "alert-outline" size={70} color="#151c4c"/>
            <Text style={{ fontSize: 20, fontWeight: "bold", color: "#151c4c", marginTop: 40  }}>
                Inicia Sesión para ver tus guardados.
            </Text>
            <Button 
                buttonStyle={styles.button}
                title="Inicia Sesión"
                icon={{
                    type:"material-community",
                    name: "hiking",
                    size: 25,
                    color: "#e6e7e9"
                  }}
                  onPress= {()=> navigation.navigate("account", { screen: "login" })}
                  />
        </View>

    )
}

const styles = StyleSheet.create({
    viewSaved:{
        flex: 1,
        backgroundColor:"#f2f2f2"
    },
    loaderRestaurant:{
        marginVertical: 10
    },
    restaurant:{
        marginTop: 10,
        alignItems:"center"
    },
    imageRestaurant:{
        width:"100%",
        height:180
    },
    info:{
        flex: 1,
        alignItems:"center",
        justifyContent:"space-between", //Para que reparta el espacio entre el corazon y el titulo
        flexDirection: "row",
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginTop: -30,
        backgroundColor:"#fff"
    },
    name:{
        fontWeight:"bold",
        fontSize: 20
    },
    favorite:{
        marginTop:-35,
        backgroundColor:"#fff",
        padding: 15,
        borderRadius: 100,
    },
    button:{
        backgroundColor: "#ec5a46",
        marginHorizontal: 40,
        marginVertical: 15,
        borderColor:"#6ad5d7",
        borderWidth:2,
        borderRadius:20
    }
})

