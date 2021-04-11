import React from 'react'
import { ActivityIndicator } from 'react-native';
import { StyleSheet, Text, View,FlatList } from 'react-native'
import { Image } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { size } from 'lodash';
import {formatPhone} from '../../utils/helpers';
export default function RestaurantList({restaurants,navigation,handlerLoadMore}) {
    return (
        <View>
            <FlatList
                data={restaurants}
                keyExtractor={(item,index)=>index.toString()}
                onEndReachedThreshold={0.5}
                onEndReached={handlerLoadMore}
                renderItem={(restaurant)=>(
                    <Restaurant
                        restaurant={restaurant}
                        navigation={navigation}
                    />

                )}
            />
        </View>
    )
}


function Restaurant({restaurant,navigation}){
    const {id, images, name, address, description, phone, callingCode} = restaurant.item;
    const restaurantImage = images[0];

    const goRestaurant = () =>{
        navigation.navigate('restaurant',{id, name});
    }

    return (
        <TouchableOpacity
            onPress={goRestaurant}
        >
            <View style={styles.viewRestaurant}>
                <View style={styles.viewRestaurantImage}>
                <Image
                    resizeMode="cover"
                    PlaceholderContent={<ActivityIndicator color="#fff" />}
                    source={{uri: restaurantImage}}
                    style={styles.restaurantImage}
                />
                </View>
            <View>
                <Text style={styles.restaurantTitle}>{name}</Text>
                <Text style={styles.restaurantInformation}>{address}</Text>
                <Text style={styles.restaurantInformation}>{formatPhone(callingCode,phone)}</Text>
                <Text style={styles.restaurantDescription}>
                    {
                       size(description) > 0 
                       ? `${description.substr(0,60)}...`
                       : `${description}`
                    }
                </Text>

            </View>
            </View>

        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    restaurantInformation:{
        paddingTop:2,
        color:"grey",
        width:"75%"
    },
    restaurantTitle:{
        fontWeight:"bold"
    },
    viewRestaurantImage:{
        marginRight:15
    },
    viewRestaurant:{
        flexDirection: "row",
        margin: 10
    },
    restaurantImage:{
        width:90,
        height:90
    },  
    restaurantTitle:{},
    restaurantInformation:{
        paddingTop: 2,
        color: "grey"
    },
    restaurantDescription:{
        paddingTop: 2,
        color: "grey",
        width: "75%"
    }
})
