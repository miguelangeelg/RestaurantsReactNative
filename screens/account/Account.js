import React, { Component, useState, useEffect } from 'react'
import { Text, StyleSheet, View } from 'react-native'
import { isUserLogged,getCurrentUser } from '../../utils/actions';
import  UserLogged from './UserLogged';
import  UserGuest from './UserGuest';
import Loading from '../../components/Loading';

export default function Account()  {
    const [login, setLogin] = useState(null);
    useEffect(() => {
        const user = getCurrentUser();
        user ? setLogin(true) : setLogin(false);
    }, []);

 //   if (login == null) {
        return <Loading isVisible={true} text="Loading" />
   // }

   // return login ? <UserLogged/> : <UserGuest/>;
     
}

const styles = StyleSheet.create({})
