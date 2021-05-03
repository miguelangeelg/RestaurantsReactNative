
import { firebaseApp } from './firebase'
import firebase from 'firebase/app';
import { fileToBlob } from './helpers';
require('firebase/firestore');
require('firebase/auth');
require('firebase/storage');
import { map } from 'lodash'
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

export const getRestaurants = async (restaurantsLimit) => {
    const result = {statusResponse: true,restaurants:[], startRestaurant: null, error: null}
    try { 
      const response = await db.collection("Restaurants")
      .orderBy("createAt", "desc")
      .limit(restaurantsLimit).get();
      if (response.docs.length >0) {
        result.startRestaurant = response.docs[response.docs.length - 1]; // the last restaurant
      }
      
      response.forEach((doc) => {
        const restaurant = doc.data()
        restaurant.id = doc.id
        result.restaurants.push(restaurant)
    });
    } catch (error) {
        result.statusResponse = false;
        result.error           = error;
    }
    return result;
}

export const getMoreRestaurants = async (restaurantsLimit, startRestaurant) => {
    const result = {statusResponse: true,restaurants:[], startRestaurant: null, error: null}
    try { 
      const response = await db.collection("Restaurants")
      .orderBy("createAt", "desc")
      .startAfter(startRestaurant.data().createAt)
      .limit(restaurantsLimit).get();
      if (response.docs.length >0) {
        result.startRestaurant = response.docs[response.docs.length - 1]; // the last restaurant
      }
      
      response.forEach((doc) => {
        const restaurant = doc.data()
        restaurant.id = doc.id
        result.restaurants.push(restaurant)
    });
    } catch (error) {
        result.statusResponse = false;
        result.error           = error;
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
    return result;
}

export const getDocumentById = async (collection,id) => {
    const result = {statusResponse: true, eror: null, document: null}

    try {
      const response = await db.collection(collection).doc(id).get();
      result.document = response.data();
      result.document.id = response.id;
    } catch (error) {
        result.statusResponse = false;
        result.error           = error;
    }
    return result;
}

export const getIsFavorite = async(spotId) => {
    const result = { statusResponse: true, error: null, isFavorite: false }

    try {
        const response = await db.collection("favorites")
        .where("idRestaurant","==",spotId)
        .where("idUser","==", getCurrentUser().uid)
        .get();
        result.isFavorite = response.docs.length > 0;
    } catch (error) {
        result.error = error;
        result.statusResponse = false;
    }

    return result;
}

export const removeFavoriteAction = async(spotId) => {
    const result = { statusResponse: true, error: null }

    try {
        const response = await db.collection("favorites")
        .where("idRestaurant","==",spotId)
        .where("idUser","==",getCurrentUser().uid)
        .get();
        response.forEach(async(doc) => {
            const favoriteID = doc.id;
            await db.collection("favorites").doc(favoriteID).delete();
        });
    } catch (error) {
        result.error = error;
        result.statusResponse = false;
    }

    return result;
}


export const getFavorites = async() => {
    const result = { statusResponse: true, error: null, favorites: [] }
    try {
        const response = await db
            .collection("favorites")
            .where("idUser", "==", getCurrentUser().uid)
            .get()
        await Promise.all(
            map(response.docs, async(doc) =>{
                const favorite = doc.data()
                const response2 = await getDocumentById("Restaurants", favorite.idRestaurant)
                result.favorites.push(response2.document)
            })
        )
    } catch (error) {
        result.statusResponse=false
        result.error= error
    }
    return result 
}


export const getRestaurantReviews = async(id) => {
    const result = { statusResponse: true, error: null, reviews: [] }
    try {
        const response = await db
            .collection("reviews")
            .where("idRestaurant", "==", id)
            .get()
        response.forEach((doc) => {
            const review = doc.data()
            review.id = doc.id
            result.reviews.push(review)
        })
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result
}


export const updateDocument = async(collection, id, data) => {
    const result = { statusResponse: true, error: null }
    try {
        await db.collection(collection).doc(id).update(data)
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
}



