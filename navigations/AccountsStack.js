import React from 'react'
import {createStackNavigator} from '@react-navigation/stack';
import Account from '../screens/account/Account';
import Login from '../screens/account/Login';
import Register from '../screens/Register';

const Stack = createStackNavigator();

export default function AccountsStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name= "account"
          component= {Account}
          options={{title:"Account"}}
        />
        <Stack.Screen
          name= "login"
          component= {Login}
          options={{title:"Login"}}
        />
          <Stack.Screen
          name= "register"
          component= {Register}
          options={{title:"Register"}}
        />
      </Stack.Navigator> 
    );
}
