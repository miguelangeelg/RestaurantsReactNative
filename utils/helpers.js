import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import {Alert} from 'react-native';
import * as Location from 'expo-location';
import {size} from 'lodash';
export const formatPhone = (callingCode, phone) => {
    if (size(phone) < 10)
    {
        return `+(${callingCode}) ${phone}`
    }
    return `+(${callingCode}) ${phone.substr(0, 3)} ${phone.substr(3, 3)} ${phone.substr(6, 4)}`
}


export const getCurrentLocation = async () => {
    const response = {status: false, location: null};
    const resultPermission = await Permissions.askAsync(Permissions.LOCATION);

    if (resultPermission.status === "denied") {
        Alert.alert('You may accept the permissions')
        return response;
    }

    const position = await Location.getCurrentPositionAsync({});
    const location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0.001,
        longitudDelta: 0.001
    };

    response.status   = true;
    response.location = location;

    return response; 
}


export function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email)
}

export const loadImageFromGalery = async (array) => {
    const response = {status: false, image: null};
    const resultPermissions = await Permissions.askAsync(Permissions.CAMERA);
    if (resultPermissions.status === "denied") {
        Alert.alert.alert("You have that allow permissions to get the phone image");
        return response;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: array
    })

    if (result.cancelled) {
        return response;
    }
    response.status = true;
    response.image  = result.uri;

    return response;
}

export const fileToBlob = async (path) => {
    const file = await fetch(path);
    const blob = await file.blob();
    
    return blob;
}

