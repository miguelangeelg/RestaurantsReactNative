import React from 'react'
import {createStackNavigator} from '@react-navigation/stack';
import TopRestaurant from '../screens/TopRestaurant';

const Stack = createStackNavigator();

export default function TopRestaurantsStack() {
    return (
      <Stack.Navigator>
          <Stack.Screen
            name= "top-restaurants"
            component= {TopRestaurant}
            options={{title:"Top 5"}}
          />
      </Stack.Navigator> 
    );
}
