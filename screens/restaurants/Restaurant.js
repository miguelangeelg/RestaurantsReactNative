import React,{useState, useEffect} from 'react'
import { StyleSheet, Text, View, Alert , Dimensions} from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import Loading from '../../components/Loading';
import { getDocumentById } from '../../utils/actions';
import CarouselImages from '../CarouselImages';

const widthScreen = Dimensions.get('window').width;
export default function Restaurant({navigation,route}) {
    const {id, name} = route.params;
    const [restaurant, setRestaurant] = useState(null);
    const [activeSlide, setActiveSlide] = useState(0)

    navigation.setOptions({title:name});

    useEffect(() => {
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
            <Text>{restaurant.description}</Text>

       </ScrollView>
    )
}

const styles = StyleSheet.create({
    viewBody:{
        flex:1
    }
})
