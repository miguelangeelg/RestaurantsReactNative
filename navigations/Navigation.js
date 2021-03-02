import React from 'react'
import {NavigationContainer } from '@react-navigation/native';
import {createBottomTabNavigator}  from '@react-navigation/bottom-tabs';
import Restaurants from '../screens/Restaurants';
import Account from '../screens/Account';
import Favorites from '../screens/Favorites';
import Search from '../screens/Search';
import TopRestaurant from '../screens/TopRestaurant';
import RestaurantsStack from './RestaurantsStack';
import FavoritesStack from './FavoritesStack';
import TopRestaurantsStack from './TopRestaurantsStack';
import SearchStack from './SearchStack';
import AccountsStack from './AccountsStack';


const Tab = createBottomTabNavigator();


export default function Navigation() {
    return (
        <NavigationContainer>
              <Tab.Navigator>
                <Tab.Screen
                    name="restaurants"
                    component={RestaurantsStack}
                    options={{title:"Restaurants"}}
                />
                    <Tab.Screen
                       name="favorites"
                       component={FavoritesStack}
                       options={{title:"Favorites"}}
                   />
                    <Tab.Screen
                      name="top-restaurants"
                      component={TopRestaurantsStack}
                      options={{title:"Top 5"}}
                  />
                 <Tab.Screen
                    name="search"
                    component={SearchStack}
                    options={{title:"Search"}}
                />
                 <Tab.Screen
                    name="account"
                    component={AccountsStack}
                    options={{title:"Account"}}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
