import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View , ScrollView} from 'react-native'
import { Avatar, Button, Icon, Input,Image } from 'react-native-elements';
import CountryPicker from 'react-native-country-picker-modal';
import AddRestaurant from '../../screens/restaurants/AddRestaurant';
import {map,size, filter} from 'lodash';
import { getCurrentLocation, loadImageFromGalery } from '../../utils/helpers';
import { Alert } from 'react-native';
import { Dimensions } from 'react-native';
import Modal from '../Modal';
import MapView from 'react-native-maps';

const widthScreen = Dimensions.get("window").width;


export default function AddRestaurantForm({toastRef, setLoading, navigation}) {

    const [formData, setFormData] = useState(defaultFormData())
    const [errorName, setErrorName] = useState(null);
    const [errorDescription, setErrorDescription] = useState(null);
    const [errorEmail, setErrorEmail] = useState(null);
    const [errorAddress, setErrorAddress] = useState(null);
    const [errorPhone, setErrorPhone] = useState(null);
    const [imageSelected, setImageSelected] = useState([]);
    const [isVisibleMap, setIsVisibleMap] = useState(false);
    const [locationRestaurant, setLocationRestaurant] = useState(null);

    const addRestaurant = () => {
        console.log(formData)
    }
    return (
        <ScrollView style={styles.containerView}>
            <ImageRestaurant imageRestaurant={imageSelected[0]} />
            <FormAdd 
             formData={formData}
             setFormData={setFormData}
             errorName={errorName}
             errorDescription={errorDescription}
             errorEmail={errorEmail}
             errorAddress={errorAddress}
             errorPhone={errorPhone}
             setIsVisibleMap={setIsVisibleMap}
            />
            <UploadImage
                toastRef={toastRef}
                imageSelected={imageSelected}
                setImageSelected={setImageSelected}
            />
            <Button 
             title="create"
             buttonStyle={styles.button}
             onPress={addRestaurant}
            />  
            <MapRestaurant 
                isVisibleMap={isVisibleMap} 
                setIsVisibleMap={setIsVisibleMap} 
                setLocationRestaurant={setLocationRestaurant}
                toastRef={toastRef}
                locationRestaurant={locationRestaurant}
            />
        </ScrollView>
    )
}

function MapRestaurant({isVisibleMap, setIsVisibleMap, setLocationRestaurant, toastRef,locationRestaurant}){
    useEffect(() => {
       (async()=>{
           const response = await getCurrentLocation();
           if (!response.status) {
            return;
           }
           setLocationRestaurant(response.location);
       })()
    }, [])
    return (
        <Modal isVisible={isVisibleMap} setVisible={setIsVisibleMap} >
           <View>
               {
                   locationRestaurant && (
                       <MapView
                        style={styles.mapView}
                        initialRegion={locationRestaurant}
                        showsUserLocation={true}
                        onRegionChange={(region)=>{setLocationRestaurant(region)}}
                       >
                           <MapView.Marker
                            coordinate = {{
                                latitude: locationRestaurant.latitude, 
                                longitude: locationRestaurant.longitude
                            }}
                            draggable={true}
                            
                           />
                       </MapView>
                   )
               }
           </View>
           <View style={styles.viewMapBtn}>
               <Button
                    title="Save ubication"
                    containerStyle={styles.btnContainerButtonMap}
                    buttonStyle = {styles.btnButtonMap}
               />
               <Button
                    title="Cancel ubication"
                    containerStyle={styles.btnContainerButtonMapCancel}
                    buttonStyle = {styles.btnButtonMapCancel}
               />
           </View>
        </Modal>
    );
}

function ImageRestaurant({ imageRestaurant }){
    return (
        <View style={styles.viewPhoto} >
            <Image
                style = {{width:widthScreen, height:200}}
                source={
                    imageRestaurant ? {uri: imageRestaurant} : require('../../assets/no-image.png')
                }
            />
        </View>
    );
}

function UploadImage({toastRef, imageSelected, setImageSelected}){
    const imageSelect = async () => {
        let result = await loadImageFromGalery([4,3]);
        if (!result.status){
            toastRef.current.show('you have not selected a image');
        }

        setImageSelected([...imageSelected,result.image])


    }
    const removeImage = (image) => {
        Alert.alert('delete image','are you sure wanna delete the image?',
        [{text:'no',style:"cancel"},{text:'yes',onPress: () => {
            setImageSelected(
                filter(imageSelected, (imageURL)=> imageURL != image)
            )
        }}],
        {cancelable: false}
        
        );
    }
    return (
        <ScrollView
            horizontal={true}
            style={styles.viewImage}
        >
            {
                size(imageSelected)<10 && (
                 <Icon
                type="material-community"
                name="camera"
                color="#eb2c2c"
                containerStyle={styles.containerIcon}
                onPress={imageSelect}
            />
                )
            }
            {
            map(imageSelected,(imageRestaurant, index) => (
                <Avatar
                    key={index}
                    style={styles.miniature}
                    source={{uri: imageRestaurant}}
                    onPress={()=> removeImage(imageRestaurant)}
                />
            ))
            }
          
        </ScrollView>
    )
}

function FormAdd({formData,setFormData,errorName,errorDescription,errorEmail,errorAddress,errorPhone, setIsVisibleMap}){
    const [country, setCountry] = useState("CA");
    const [callingCode, setCallingCode] = useState("1");
    const [phone, setPhone] = useState("");

    let onChange = (e,type) =>{
        setFormData({...formData,[type]:e.nativeEvent.text});
        console.log(formData)
    }

    return (
        <View style={styles.viewForm}>
            <Input
                placeholder="Restaurant's name"
                defaultValue={formData.name}
                onChange={(e) => {onChange(e,"name")}}
                errorMessage={errorName}
            />
            <Input
                placeholder="Restaurant's address"
                defaultValue={formData.address}
                onChange={(e) => {onChange(e,"adress")}}
                errorMessage={errorAddress}
                rightIcon={{
                    type:"material-community",
                    name: "google-maps",
                    color: "#eb2c2c",
                    onPress: () => {setIsVisibleMap(true)}
                }}
            />
            <Input
                 keyboardType="email-address"
                placeholder="Restaurant's email"
                defaultValue={formData.email}
                onChange={(e) => {onChange(e,"email")}}
                errorMessage={errorEmail}
            />
            <View style={styles.phoneView}>
                <CountryPicker
                    withFlag
                    withCallingCode
                    withFilter
                    withCallingCodeButton
                    containerStyle={styles.countryPicker}
                    countryCode={country}
                    defaultValue={formData.country}
                    onSelect={(country)=>{
                        setCountry(country.cca2)
                        setCallingCode(country.callingCode[0])
                    }
                    }
                    onSelect={(country)=>{
                        setFormData({...formData,"callingCode":country.callingCode[0]})
                        setFormData({...formData,country:country.cca2})
                        console.log(country.cca2)

                        setCountry(country.cca2); 
                        setCallingCode(country.callingCode[0])}}
                />
                <Input
                  placeholder="Restaurant's whatsapp"
                  keyboardType="phone-pad"
                  defaultValue={formData.phone}
                  onChange={(e) => {onChange(e,"phone")}}
                  errorMessage={errorPhone}
                  containerStyle={styles.inputPhone}
                />
            
            </View>
            <Input
                  placeholder="Restaurant's description"
                  defaultValue={formData.description}
                  onChange={(e) => {onChange(e,"description")}}
                  errorMessage={errorDescription}
                  multiline={true}
                  containerStyle={styles.textArea}
                />
        </View>
    )
}
const defaultFormData = () => {
     return {
        country:"CA",
        name: "",
        description:"",
        email:"",
        phone:"",
        address:"",
        callingCode:"1"

     };
}

const styles = StyleSheet.create({
    btnButtonMapCancel:{
        backgroundColor:"#ea2d2c"
    },
    btnButtonMap:{
        backgroundColor: "#48250f",
    },
    btnContainerButtonMapCancel:{
        paddingLeft:5
    },
    btnContainerButtonMap:{
        paddingRight:5
    },
    viewMapBtn:{
        flexDirection: "row",
        justifyContent:"center",
        marginTop:10
    },
    mapView:{
        width:"100%",
        height: 550
    },
    viewPhoto:{
        alignItems:"center",
        height:200,
        marginBottom:20
    },
    miniature:{
        width:70,
        height:70,
        marginRight:10
    },
    containerIcon:{
        alignItems:"center",
        justifyContent:"center",
        marginRight:10,
        height:70,
        width:70,
        backgroundColor:"#E3E3E3"
    },
    viewImage:{
        flexDirection: "row",
        marginHorizontal:20
    },
    containerView:{
        height:"100%"
    },
    button:{
        backgroundColor:"#eb2c2c",
        margin:20
    },
    viewForm: {
        marginHorizontal:10
    },
    phoneView:{
        width:"80%",
        flexDirection:'row'
    },
    countryPicker:{

    },
    inputPhone:{
        width:"80%"
    },
    textArea: {
        height:100,
        width:"100%"
    }
})
