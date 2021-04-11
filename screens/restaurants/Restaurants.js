import React, { useEffect, useState,useCallback } from 'react'
import { Text, StyleSheet, View } from 'react-native'
import { Icon } from 'react-native-elements'
import { getCurrentUser, getMoreRestaurants, getRestaurants } from '../../utils/actions';
import { useFocusEffect } from '@react-navigation/native'
import Loading from '../../components/Loading';
import RestaurantList from './RestaurantList';
import { size } from 'lodash';

export default function Restaurants({navigation}) {
    
    const [login, setLogin] = useState(false);
    const [user, setUser] = useState(null)
    const [startRestaurant, setStartRestaurant] = useState(null);
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(false);
    const restaurantLimit = 7;

    useFocusEffect(
        useCallback(() => {

             setUser(getCurrentUser);
             setLogin( user ? true : false );
            
         
            async function getData() {
                setLoading(true)
                const response = await getRestaurants(restaurantLimit)
                if (response.statusResponse) {
                    setStartRestaurant(response.startRestaurant)
                    setRestaurants(response.restaurants)
                }
                setLoading(false)
            }
            getData();
        }, [])
    )

    const handlerLoadMore = async () =>{
        if (!startRestaurant){
            return;
        }
        const response = await getMoreRestaurants(restaurantLimit,startRestaurant);
        if (response.statusResponse){
            setStartRestaurant(response.startRestaurant);
            setRestaurants([...restaurants,...response.restaurants]);
        }

    }


    if (user == null) {
        <Loading isVisible={true} text="loading" />
    }

        return (
            <View style={styles.view}>
                {
                    size(restaurants) > 0 
                    ? (<RestaurantList restaurants={restaurants} navigation={navigation} handlerLoadMore={handlerLoadMore} />)
                    : (
                        <View style={styles.notFoundView}>
                            <Text style={styles.notFoundText}>There are nor restaurants...</Text>
                        </View>
                    )

                }
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
                <Loading isVisible={loading} text="loading"/>
             
            </View>
        )
    
}

const styles = StyleSheet.create({
    notFoundText:{
        fontSize:10,
        fontWeight:"bold"
    },
    notFoundView:{
        flex:1,
        justifyContent:"center",
        alignItems:"center"
    },
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
