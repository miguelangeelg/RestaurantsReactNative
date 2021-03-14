import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button } from 'react-native-elements'
import { useNavigation} from '@react-navigation/native'
import { closeSession } from '../../utils/actions';
export default function UserLogget() {
    const navigation = useNavigation();
    return (
        <View>
            <Text>UsserLogged...</Text>
            <Button
                title = "Sign out"
                onPress= { () => {
                    closeSession();
                    navigation.navigate('restaurants');
                } }
            />
        </View>
    )
}

const styles = StyleSheet.create({})
