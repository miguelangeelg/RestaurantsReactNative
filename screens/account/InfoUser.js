import React, {useState} from 'react'
import { Alert } from 'react-native'
import { StyleSheet, Text, View } from 'react-native'
import { Avatar } from 'react-native-elements'
import { updateProfile, uploadImage } from '../../utils/actions'
import { loadImageFromGalery } from '../../utils/helpers'

export default function InfoUser({user, setLoading, setLoadingText}) {

    const [imageUserUrl, setImageUserUrl] = useState(user.photoURL);
   const changePhoto = async () => {
      const result = await loadImageFromGalery([1, 1]);
      if (!result.status) {
        return;
      }
      setLoadingText("Updating image");
      setLoading(true);
      const resultUploadImage = await uploadImage(result.image, "Avatars", user.uid);

      if (!resultUploadImage.statusResponse) {
        setLoading(false);
        Alert.alert("An error occurred uploading the profile image");
        return;
      }
      const resultUpdateProfile = await updateProfile({photoURL: resultUploadImage.url});
      setLoading(false);
      if (resultUpdateProfile.statusResponse){
        setImageUserUrl(resultUploadImage.url);
      } else{
          Alert.alert("An error ocurred");
      }
    }

    return (
        <View style={styles.cointainer}>
            <Avatar
                rounded={true}
                size="large"
                onPress={changePhoto}
                source={
                    imageUserUrl ? {uri: imageUserUrl} : require("../../assets/avatar-default.jpeg")
                }
            />
            <View style={styles.infoUser}>
                <Text style={styles.userNameDisplay}> {user.displayName ? user.displayName : "Anonymous" }   </Text>
                <Text>{user.email}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    cointainer: {
        alignItems:"center",
        justifyContent: "center",
        flexDirection:"row",
        paddingVertical: 30
    },
    infoUser:{
        marginLeft:20
    },
    userNameDisplay:{
        fontWeight:"bold",
        paddingBottom:5
    }
})
