
import { firebaseApp } from './firebase'
import firebase from 'firebase/app';
import { fileToBlob } from './helpers';
require('firebase/firestore');
require('firebase/auth');
require('firebase/storage');
const db = firebase.firestore(firebaseApp);


export const loginWithEmailAndPassword = async(email, password) => {
    const result = { statusResponse: true, error: null}
    try {
        await firebase.auth().signInWithEmailAndPassword(email, password)
    } catch (error) {
        result.statusResponse = false
        result.error = "Usuario o contraseña no válidos."
    }
    return result
}


export const isUserLogged = () => {
    let isLogged = false; 
    firebase.auth().onAuthStateChanged( (user) => {
        user !== null && (isLogged = true);

    } )
    return isLogged;
}

export const getCurrentUser = () => {
    return firebase.auth().currentUser
}

export const closeSession = () => {
    return firebase.auth().signOut()
}

export const registerUserF = async (email, password) => {
    const result = {statusResponse: true, error: null}
    try {
        await firebase.auth().createUserWithEmailAndPassword(email, password)
    } catch (error) {
        result.statusResponse = false;
        result.error = "This emails already is registered"
    }
    return result
}

export const uploadImage = async (image, path, imageName) => {
    const result = { statusResponse: false, error: null, url: null }
    const ref = firebase.storage().ref(path).child(imageName)
    const blob = await fileToBlob(image)

    try {
        await ref.put(blob)
        const url = await firebase.storage().ref(`${path}/${imageName}`).getDownloadURL()
        result.statusResponse = true
        result.url = url
    } catch (error) {
        result.error = error
    }
    return result
}

export const updateProfile = async (data) => {
    const result = {statusResponse: true, eror: null}

    try {
        await firebase.auth().currentUser.updateProfile(data);
    } catch (error) {
        result.statusResponse = false;
        result.eror           = error;
    }

    return result;
}


export const reauthenticate = async (password) => {
    const result = {statusResponse: true, eror: null}

    const user = getCurrentUser();
    const credentials = firebase.auth.EmailAuthProvider.credential(user.email,password);
    try {
        await user.reauthenticateWithCredential(credentials);
    } catch (error) {
        result.statusResponse = false;
        result.eror           = error;
    }

    return result;
}

export const updateEmail = async (email) => {
    const result = {statusResponse: true, eror: null}

    try {
        await firebase.auth().currentUser.updateEmail(email);
    } catch (error) {
        result.statusResponse = false;
        result.eror           = error;
    }

    return result;
}

export const updatePassword = async (password) => {
    const result = {statusResponse: true, eror: null}

    try {
        await firebase.auth().currentUser.updatePassword(password);
    } catch (error) {
        result.statusResponse = false;
        result.eror           = error;
    }

    return result;
}


export const addDocumentWithoutId = async (collection,data) => {
    const result = {statusResponse: true, eror: null}

    try {
       await db.collection(collection).add(data)
    } catch (error) {
        result.statusResponse = false;
        result.error           = error;
    }
console.log(result.error)
    return result;
}



