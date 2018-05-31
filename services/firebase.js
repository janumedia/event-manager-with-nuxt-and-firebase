import firebase from "firebase"
import "firebase/storage"
import {FIREBASE_CONFIG} from "../config"

!firebase.apps.length ? firebase.initializeApp(FIREBASE_CONFIG) : ""

export const auth = firebase.auth();
export const database = firebase.database();
export const storage = firebase.storage();
export default firebase