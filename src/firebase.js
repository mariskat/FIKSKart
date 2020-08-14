/** file firebase.js
 *  Firebase functionality to log in, create user and save information from user
 *  Authors: Thea Tokstad and Marie Skatvedt
 */

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import { isLoggedIn, user } from "./store.js";

var firebaseConfig = {
  apiKey: "AIzaSyDcxVZbm-Moyvchzma1WqvZlh7p3Rq3Q5I",
  authDomain: "norkartsommer.firebaseapp.com",
  databaseURL: "https://norkartsommer.firebaseio.com",
  projectId: "norkartsommer",
  storageBucket: "norkartsommer.appspot.com",
  messagingSenderId: "1027679165820",
  appId: "1:1027679165820:web:3ba029a7fe23b35b20d8f9",
  measurementId: "G-WBYDLGWWCP",
};

// Initialize
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const db = firebase.database();

export function signUp(email, password) {
  return firebase.auth().createUserWithEmailAndPassword(email, password);
}

export function login(username, password) {
  return firebase.auth().signInWithEmailAndPassword(username, password);
}

export function signOut() {
  return firebase.auth().signOut();
}

export function logInAnonymous() {
  return firebase.auth().signInAnonymously();
}

export function writeUserData(
  userID,
  firstName,
  lastName,
  email,
  telephone,
  role
) {
  firebase
    .database()
    .ref("users/" + userID)
    .set({
      name: firstName + " " + lastName,
      email: email,
      telephone: telephone,
      role: role,
    });
}

/** Function for adding information about discrepency-report
 *  param userID - user ID
 *  param polygon - rdrawn or selected/edited polygon
 *  param property_details - details about the property
 *  param address - address for registered discrepency
 *  param comment - comment created by user
 */
export function writeNewMapError(
  userID,
  polygon,
  property_details,
  address,
  comment
) {
  let mapData = {
    user_id: userID,
    polygon: polygon,
    property_details,
    address: address,
    comment: comment,
    date: new Date().toString(),
    status: "SUBMITTED",
  };

  // Get a new key for a new map error
  var newMapErrorKey = firebase.database().ref().child("map-error").push().key;

  return firebase
    .database()
    .ref("map-error/" + newMapErrorKey)
    .set(mapData);
}

firebase.auth().onAuthStateChanged(function (firebaseUser) {
  // Authorization of user when logging in
  if (firebaseUser) {
    isLoggedIn.update((n) => (n = true));
    user.update((n) => (n = firebaseUser));
  } else {
    // Error handling
  }
});
