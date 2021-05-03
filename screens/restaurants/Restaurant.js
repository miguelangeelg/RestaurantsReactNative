import { rest } from 'lodash';
import React,{useState, useEffect, useCallback, useRef} from 'react'
import { StyleSheet, Text, View, Alert , Dimensions} from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import Loading from '../../components/Loading';
import { useFocusEffect } from '@react-navigation/native'
import { getDocumentById, getIsFavorite , addDocumentWithoutId, getCurrentUser, removeFavoriteAction} from '../../utils/actions';
import CarouselImages from '../CarouselImages';
import { Rating ,ListItem,Icon } from 'react-native-elements';
import MapRestaurant from '../../components/restaurants/MapRestaurant';
import {formatPhone} from '../../utils/helpers';
import firebase from 'firebase/app';
import Toast from 'react-native-easy-toast';
import { map } from 'lodash';
import ListReviews from './ListReviews';


const widthScreen = Dimensions.get('window').width;
export default function Restaurant({navigation,route}) {
    const {id, name} = route.params;
    const [restaurant, setRestaurant] = useState(null);
    const [activeSlide, setActiveSlide] = useState(0)
    const [isFavorite, setIsFavorite] = useState(false)
    const [userLogged, setUserLogged] = useState(false);
    const [loading, setLoading] = useState(false)
    const toasRef = useRef();


    navigation.setOptions({title:name});

    firebase.auth().onAuthStateChanged(user => {
        user ? setUserLogged(true) : setUserLogged(false);
      })

    useFocusEffect(
        useCallback(() => {
            (async()=>{
                const response = await getDocumentById('Restaurants',id);
                if (response.statusResponse){
                 setRestaurant(response.document)
                }else{
                    setRestaurant({});
                    Alert.alert('an error ocurred gettin the restaurant, try it later');
                }
            })()
        }, [])
    )

    useEffect(() => {
        (async () => {
              if (userLogged && restaurant) {         
                  const response = await getIsFavorite(id);
                  response.statusResponse && setIsFavorite(response.isFavorite)                   
            } 
        })();
      }, [userLogged,restaurant]);

      const addFavorite = async() => {
        if (!userLogged){
            toasRef.current.show("to save the restaurant you have that be logged.",3000);
            return;
        }
        setLoading(true);
        const response = await addDocumentWithoutId("favorites",{
            idUser: getCurrentUser().uid,
            idRestaurant: restaurant.id
        });
        setLoading(false);
        if (response.statusResponse) {
            setIsFavorite(true);
            toasRef.current.show("restaurant saved!",3000);
        }else{
            toasRef.current.show("it cannot save it",3000);
        }
    }
    
    const removeFavorite = async() => {  
        setLoading(true);
        const removeResponse = await removeFavoriteAction(restaurant.id);
        setLoading(false)
    
        if (removeResponse.statusResponse) {
            setIsFavorite(!isFavorite);
            toasRef.current.show("restaurant deleted",3000);
        }else{
            toasRef.current.show("restaurant cannot delete it",3000);
        }
    }
    
 

    if (!restaurant) {
        return <Loading isVisible={true} text="loading..." />
    }

    return (
       <ScrollView style={styles.viewBody}>
           <CarouselImages
           setActiveSlide={setActiveSlide}
           activeSlide={activeSlide}
           images={restaurant.images}
           height={250}
           width={widthScreen}
            />
        <View style={styles.viewFavorite}>
              <Icon
                  type="material-community"
                  name={ isFavorite ? "bookmark" : "bookmark-outline"}
                  onPress={ isFavorite ? removeFavorite : addFavorite}
                  color={"#73d6d6"}
                  size={35}
                  underlayColor="transparent"
              />
          </View>
            <TitleRestaurant
                name={restaurant.name}
                description={restaurant.description}
                rating={restaurant.rating}
            />
         <RestaurantInfo
                name={restaurant.name}
                location={restaurant.location}
                address={restaurant.address}
                email={restaurant.email}
                phone={formatPhone(restaurant.callingCode,restaurant.phone)}
      />
         <ListReviews
              navigation = {navigation}
              idRestaurant = {restaurant.id}
          />
          <Toast ref={toasRef} position="center" opacity={0.9} />

       </ScrollView>
    )
}


function RestaurantInfo({name,location,address,email,phone}){
    const listInfo = [
        {
            text:address, iconName: "map-marker"
        },
        {
            text: phone, iconName: "phone"
        },
        {
            text: email, iconName: "at"
        }
    ];

    return(
        <View style={styles.viewInfoRestaurant}>
            <Text style={styles.RestaurantInfoTitle}>Información sobre el Restaurant</Text>
            <MapRestaurant
                location={location}
                name={name}
                height={150}
            />
            {
                map(listInfo, (item, index) =>(
                    <ListItem
                    key={index}
                    style={styles.containerListItem}
                    >
                        <Icon
                            type="material-community"
                            name={item.iconName}
                            color="#161f48"
                        />
                        <ListItem.Content>
                            <ListItem.Title>
                                {item.text}
                            </ListItem.Title>
                        </ListItem.Content>
                    </ListItem>
                ))
            }
        </View>


    );
}


function TitleRestaurant({name,description,rating}){
    return (
        <View style={styles.viewRestaurantTitle}>
          <View style={styles.viewRestaurantContainer}>
            <Text style={styles.RestaurantName}>{name}</Text>
            <Rating
              style={styles.rating}
              readonly={true}
              imageSize={20}
              startingValue={parseFloat(rating)}
            />
          </View>
    
          <Text style={styles.descriptionRestaurant}>{description}</Text>
        </View>
      );
}

const styles = StyleSheet.create({
    viewFavorite:{
        position:"absolute",
        top:0,
        right:0,
        backgroundColor:"#fff",
        borderBottomLeftRadius:100,
        padding:5,
        paddingLeft:15
      },
    viewBody:{
        flex:1
    },
    viewFavorite:{
        position:"absolute",
        top:0,
        right:0,
        backgroundColor:"#fff",
        borderBottomLeftRadius:100,
        padding:5,
        paddingLeft:15
      },
        containerListItem:{
            borderBottomColor:"#ec5a4b",
            borderBottomWidth:1
        },
        RestaurantInfoTitle:{
            fontSize:20,
            fontWeight:"bold",
            marginBottom:15
        },
        viewInfoRestaurant:{
            margin:15,
            marginTop:25
        },
        rating:{
            position:"absolute",
            right:0
        },
      viewRestaurantContainer:{
          flexDirection:"row"
      },
      descriptionRestaurant: {
          marginTop:8,
          color:"grey",
          textAlign:"justify"
      },
      RestaurantName: {
          fontWeight:"bold"
      },
      viewRestaurantTitle: {
        padding: 15,
      },
     
})
