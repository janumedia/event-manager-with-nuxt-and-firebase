import Vuex from "vuex"
import {auth, database, storage} from "@/services/firebase"
import {FIREBASE_CONFIG} from "../config"

const cookieparser = require("cookieparser")
const dbEvents = "events"
const dbReservations = "reservations"
const dbUsers = "users"

const addMissingCardProps = (data) => {
    if(!data.adult) data.adult = null
    if(!data.child) data.child = null
    if(!data.donation) data.donation = null
    if(!data.maleXXXL) data.maleXXXL = null
    if(!data.maleXXL) data.maleXXL = null
    if(!data.maleXL) data.maleXL = null
    if(!data.maleL) data.maleL = null
    if(!data.maleM) data.maleM = null
    if(!data.maleS) data.maleS = null
    if(!data.femaleXXXL) data.femaleXXXL = null
    if(!data.femaleXXL) data.femaleXXL = null
    if(!data.femaleXL) data.femaleXL = null
    if(!data.femaleL) data.femaleL = null
    if(!data.femaleM) data.femaleM = null
    if(!data.femaleS) data.femaleS = null
}

const USER_NOT_REGISTERED = "User not registered!!, make sure type full name without any degree!"
const USER_NOT_FOUND = "User not found!"
const INCORRECT_PHONE_NUMBER = "Incorrect phone number!"
const EVENT_NOT_FOUND = "event not found"
const NO_EVENT_RECORDED = "No event recorded!"

const createStore = () => {
    const state = {
        appName: "Meetup",
        config: null,
        home: "/",
        error: null,
        auth: null,
        loading: false,
        alert: false,
        message: "",
        events: [],
        eventDetail: null,
        reservations: [],
        classList: [],
        rates: null,
        tshirtSizes: null,
        sponsorship: null
    }

    const getters = {
        
    }

    const mutations = {
        
        SET_AUTH(state, payload) {
            state.auth = payload
            state.home = payload ? "/home" : "/"
        },

        // INFO
        SET_LOADING(state, payload) {
            state.loading = payload
        },
        SET_MESSAGE(state, payload) {
            state.message = payload
        },
        SET_ALERT(state, payload) {
            state.alert = payload
        },
        SET_ERROR(state, payload) {
            state.error = payload
        },
        CLEAR_ERROR(state) {
            state.error = null
        },

        // EVENTS
        SET_EVENTS(state, payload) {
            state.events = payload
        },
        UPDATE_EVENTS(state, payload) {
            let key = payload.data.key
            let data = payload.data.val()
            let newData = {id: key, lat:null, long:null, ...data}
            switch(payload.event) {
                case "add":
                    if(!state.events.find(item => item.id == key))
                    { 
                        state.events.push(newData)
                    }
                    break
                case "change":
                    state.events = state.events.map(item => item.id === key ? newData : item)
                    break
                case "remove":
                    state.events = state.events.filter(item => item.id !== key) 
                    break
            }
        },

        //DETAIL EVENT
        SET_EVENT_DETAIL(state, payload) {
            state.eventDetail = payload
        },
        UPDATE_EVENT_DETAIL(state, payload) {
            if(state.eventDetail) state.eventDetail[payload.key] = payload.value
        },
        
        // RESERVATIONS
        SET_RESERVATIONS(state, payload) {
            state.reservations = Object.keys(payload).map(key => {
                let item = payload[key]
                return {eventID: key, ...item}
            })
        },
        UPDATE_RESERVATIONS(state, payload) {
            let key = payload.data.key
            let data = payload.data.val()
            switch (payload.event)
            {
                case "add":
                    if(!state.reservations.find(item => item.key == key))
                    {
                        state.reservations.push({key: key, ...data})
                    }
                    break
                case "change":
                    state.reservations = state.reservations.map(item => {
                        if(item.id == key) return {key: key, ...data}
                        return item
                    })
                    break
                case "remove":
                    state.reservations = state.reservations.filter(item => item.key !== key)
                    break
            }
        },
        CLEAR_RESERVATIONS(state, payload) {
            state.reservations = []
        }
    }

    const actions = {
        // auto login
        nuxtServerInit({commit, state}, {req, env}) {
            let token = state.auth
            if(!token && req.headers.coockie) {
                var parsed = cookieparser.parse(req.headers.coockie)
                if(parsed.auth) token = JSON.parse(parsed.auth)
            }
            //update states
            state.classList = env.classList.concat()
            state.rates = env.rates
            state.tshirtSizes = env.tshirtSizes
            state.sponsorship = env.sponsorship
            commit("SET_AUTH", token)
        },

        // CONFIG
        getConfig({commit}) {
            return new Promise((resolve, reject) => {
                let data
                database.ref("setup").once("value")
                .then(res => {
                    if(res) {
                        data = {...res.val()}
                        return database.ref(dbEvents).orderByKey()
                        .equalTo(res.val().activeEventID).once("value")
                    } else {
                        reject(EVENT_NOT_FOUND)
                    }
                })
                .then(res => {
                    if(res)
                    {
                        data.eventDetail = res.val()[data.activeEventID]
                        resolve(data)
                    } else 
                    {
                        reject(EVENT_NOT_FOUND)
                    }
                })
                .catch(error => {
                    reject(error)
                })
            })
        },

        // AUTH
        setAuth({commit}, payload) {
            commit("SET_AUTH", payload)
        },
        login({commit}, payload) {
            commit("SET_ERROR", null)
            return new Promise((resolve, reject) => {
                auth.signInWithEmailAndPassword(payload.email, payload.password)
                .then(user => {
                    commit("SET_AUTH", user)
                    resolve()
                })
                .catch(error => {
                    commit("SET_ERROR", error)
                    reject()
                })
            })
           
        },
        logout({commit, dispatch}, payload) {
            auth.signOut()
            .then(() => {
                commit("SET_AUTH", null)

            })
            .catch(error => {
                commit("SET_ERROR", error);
                console.log("error", error)
            })
        },

        setLoading({commit}, payload) {
            commit("SET_LOADING", payload)
        },

        setError({commit}, payload) {
            commit("SET_ERROR", payload)
        },
        
        /** EVENTS */
        loadEvents({commit, dispatch}) {
            commit("SET_LOADING", true)
            database.ref(dbEvents).once("value")
            .then(data => {
                var items = Object.keys(data.val()).map(key => {
                    return { id: key, lat:null, long:null, ...data.val()[key] }
                });
                commit("SET_EVENTS", items);
                commit("SET_LOADING", false)
                dispatch("setEventsSync")
            })
            .catch(() => {
                commit("SET_ERROR", {message: NO_EVENT_RECORDED})
                commit("SET_LOADING", false)
            })
        },
        detailEvent({commit}, payload) {
            return new Promise((resolve, reject) => {
                database.ref(dbEvents + "/" + payload).once("value")
                .then(data => {
                    if(data.val())
                    {
                        let res = {
                            id: data.key,
                            joinedCount: null,
                            joinLocked: false,
                            lat: null, 
                            long: null,
                            ...data.val()
                        }
                        commit("SET_EVENT_DETAIL", res)
                        resolve(res)
                    } else 
                    {
                        reject("event not found!")
                    }
                })
                .catch(error => {
                    reject(error)
                })
            })
        },
        createEvent({commit}, payload) {
            return new Promise((resolve, reject) => {
                database.ref(dbEvents).push({...payload, joinedCount:0})
                .then(data => {
                    resolve()
                })
                .catch(error => {
                    reject(error)
                })
            })
        },
        updateEvent({commit}, payload) {
            let {id, ...event} = payload
            return new Promise((resolve, reject) => {
                database.ref(dbEvents).child(payload.id).update(event)
                .then(data => {
                    resolve()
                })
                .catch(error => {
                    console.log(error)
                    reject()
                })
            })
        },
        increaseEventCounter({commit}, payload) {
            //to avoid concurent update use transaction
            database.ref(dbEvents+ "/" + payload + "/joinedCount")
            .transaction((currentJoined) => {
                return currentJoined + 1
            })
            .then(data => {
                //TODO: manage increaseEventCounter
                //console.log("increaseEventCounter", data.snapshot.val())
            })
            .catch(error => {
                console.log(error)
            })
        },
        decreaseEventCounter({commit}, payload) {
            //to avoid concurent update use transaction
            database.ref(dbEvents+ "/" + payload + "/joinedCount")
            .transaction((currentJoined) => {
                return currentJoined - 1
            })
            .then(data => {})
            .catch(error => {
                console.log(error)
            })
        },

        /** USERS */
        verifyUser({commit}, payload) {
            commit("SET_LOADING", true)
            return new Promise ((resolve, reject) => {
                let user, errorUserNotRegistered = USER_NOT_REGISTERED
                //01. check if user exist
                database.ref(dbUsers).orderByChild("lowercaseName")
                .equalTo(payload.fullName.toLowerCase().split(" ").join(""))
                .once("value")
                .then(data =>{
                    if(data.val()) {
                        user = Object.keys(data.val()).map(key => {
                            return {id:key, ...data.val()[key]}
                        })
                        .find(item => item.className == payload.className)
                        if(user) {
                            
                            //02. check if user has registered to related event
                            return database.ref(dbReservations).child(payload.eventID)
                            .orderByChild("id").equalTo(user.id).once("value")
                        } else {
                            reject(errorUserNotRegistered)
                            commit("SET_LOADING", false)
                        }
                    } else 
                    {
                        reject(errorUserNotRegistered)
                        commit("SET_LOADING", false)
                    }
                })
                .then(data => {
                    let res = data.val()
                    if(res)
                    {
                        Object.keys(res).map(key => {
                            res = res[key]
                            res.key = key
                        })
                        addMissingCardProps(res)
                        resolve({registered: true, ...res, ...user})
                    } else 
                    {
                        resolve(user)
                    }
                    commit("SET_LOADING", false)
                })
                .catch(error => {
                    if(user) resolve(user)
                    else reject(error)
                    commit("SET_LOADING", false)
                })
            })
            
        },

        verifyUserPhone({commit}, payload) {
            return new Promise((resolve, reject) => {
                database.ref(dbUsers).orderByKey().equalTo(payload.key).once("value")
                .then(data => {
                    if(data) {
                       if(data.val()[payload.key].phone == payload.phone) {
                           resolve()
                       }  else {
                           reject(INCORRECT_PHONE_NUMBER)
                       }
                    } else {
                        reject(USER_NOT_FOUND)
                    }
                })
                .catch(error => {
                    reject(error)
                })
            })
        },
      
        updateUser({commit}, payload) {
            let {id, ...user} = payload
            return new Promise((resolve, reject) => {
                database.ref(dbUsers).child(payload.id).update(user)
                .then(() => {
                    resolve()
                })
                .catch(error => {
                    console.log(error)
                    reject()
                })
            })
        },
        
        /** RESERVATION */
        loadReservations({commit, dispatch}, payload) {
            commit("CLEAR_RESERVATIONS")
            commit("SET_LOADING", true)
            return new Promise((resolve, reject) => {
                database.ref(dbReservations + "/" + payload).once("value")
                .then(data => {
                    if(data.val())
                    {
                        //we not commit now but wait for sync and avoid doubled data
                        dispatch("setReservationsSync", payload)
                        resolve();
                    } else {
                        commit("SET_LOADING", false)
                        reject("No reservation found!")
                    }
                })
                .catch(error => {
                    commit("SET_LOADING", false)
                    reject(error)
                })
            })
        },
        clearReservations({commit, dispatch}, payload) {
            commit("CLEAR_RESERVATIONS")
            dispatch("removeReservationsSync", payload)
        },
        joinEventAlready({commit}, payload) {
            commit("SET_LOADING", true)
            return new Promise((resolve, reject) => {
                database.ref(dbReservations + "/" + payload.eventID).orderByChild("id")
                .equalTo(payload.id).once("value")
                .then(data => {
                    let obj = data.val()
                    if(obj)
                    {
                        Object.keys(obj).map(key => {
                            obj = obj[key]
                            obj.key = key
                        })
                        addMissingCardProps(obj)
                        resolve(obj)
                    } else 
                    {
                        reject()
                    }
                    commit("SET_LOADING", false)
                })
                .catch(error => {
                    console.log(error)
                    
                    commit("SET_LOADING", false)
                })
            })
        },
        joinEvent({commit, dispatch}, payload) {
            commit("SET_LOADING", true)
            let {eventID, id, name, className, address, phone, ...regData} = payload
            return new Promise((resolve, reject) => {
                //update user data first
                dispatch("updateUser", {id, name, className, address, phone})
                .then(() => {
                    database.ref(dbReservations + "/" + eventID)
                    .push({id: id, name, className, ...regData})
                    .then(data => {
                        // update counter
                        dispatch("increaseEventCounter", eventID)
                        commit("SET_LOADING", false)
                        resolve(data.key)
                    })
                    .catch(error => {
                        console.log("error", error)
                        commit("SET_LOADING", false)
                        reject()
                    })
                })
                .catch(error => {
                    console.log("error", error)
                    commit("SET_LOADING", false)
                    reject()
                })
            })
        },
        confirmUserPaymentToEvent({commit}, payload) {
            return new Promise((resolve, reject) => {
                database.ref(dbReservations).child(payload.eventID)
                .child(payload.key).child("totalPayment")
                .transaction(() => {
                    return payload.totalPayment
                })
                .then(data => {
                    resolve()
                })
                .catch(error => {
                    reject(error)
                })
            })
        },
        unregisterUserFromEvent({commit, dispatch}, payload) {
            return new Promise((resolve, reject) => {
                database.ref(dbReservations).child(payload.eventID).child(payload.key)
                .remove()
                .then(() => {
                    // update counter
                    dispatch("decreaseEventCounter", payload.eventID)
                    resolve()
                })
                .catch(error => {
                    reject(error)
                })
            })
        },
        loadReservationCard({commit}, payload) {
            commit("SET_LOADING", true)
            return new Promise((resolve, reject) => {
                database.ref(dbReservations).child(payload.event)
                .orderByKey().equalTo(payload.id).once("value")
                .then(data => {
                    if(data) {
                        let obj = data.val()[payload.id]
                        addMissingCardProps(obj)
                        resolve({
                            ...obj,
                            eventID: data.key
                        })
                    } else {
                        reject()
                    } 
                    commit("SET_LOADING", false)
                })
                .catch(error => {
                    console.log(error)
                    commit("SET_LOADING", false)
                    reject(error)
                })
            })
        },
        loadSponsors({commit}, payload) {
            //commit("SET_LOADING", true)
            return new Promise((resolve, reject) => {
                database.ref(dbReservations).child(payload)
                .orderByChild("donation").startAt(1500000).once("value")
                .then(data => {
                    if(data.val()) {
                        let list = Object.keys(data.val()).map(key => {
                            return {
                                key,
                                ...data.val()[key]
                            }
                        })
                        resolve(list)
                    } else {
                        reject("no record found!")
                    }
                })
                .catch(error => {
                    reject(error)
                })
            })
        },
        updateSponsorLogo({commit, dispatch}, payload) {
            return payload.imageFile ? dispatch("updateSponsorLogoFile", payload) : dispatch("updateSponsorLogoURL", payload)
        },
        updateSponsorLogoURL({commit, dispatch}, payload) {
            commit("SET_LOADING", true)
            return new Promise((resolve, reject) => {
                database.ref(dbReservations).child(payload.eventID)
                .child(payload.key).update({
                    tagline: payload.tagline == "" ? null : payload.tagline ? payload.tagline : null,
                    webURL: payload.webURL == "" ? null : payload.webURL ? payload.webURL : null,
                    imageURL: payload.imageURL == "" ? null : payload.imageURL ? payload.imageURL : null
                })
                .then(() => {
                    resolve(payload.imageURL)
                    commit("SET_LOADING", false)
                })
                .catch(error => {
                    reject(error)
                    commit("SET_LOADING", false)
                })
            })
        },
        updateSponsorLogoFile({commit, dispatch}, payload) {
            commit("SET_LOADING", true)
            let imageURL, oldImageURL
            const fileName = payload.imageFile.name
            const extensionFile = fileName.slice(fileName.lastIndexOf("."))
            return new Promise((resolve, reject) => {
                //get previous imageURL
                database.ref(dbReservations).child(payload.eventID)
                .orderByKey().equalTo(payload.key).once("value")
                .then(data => {
                    oldImageURL = data.val()[payload.key].imageURL
                    return storage.ref(dbReservations + "/" + payload.eventID + "/" + payload.key + "." + extensionFile).put(payload.imageFile)
                })
                .then(fileInfo => {
                    imageURL = fileInfo.metadata.downloadURLs[0]
                    if(fileInfo.state == "success")
                    {
                        return database.ref(dbReservations).child(payload.eventID)
                        .child(payload.key).update({
                            tagline: payload.tagline == "" ? null : payload.tagline ? payload.tagline : null,
                            webURL: payload.webURL == "" ? null : payload.webURL ? payload.webURL : null,
                            imageURL: imageURL
                        })
                    } else 
                    {
                        reject("upload file error")   
                        commit("SET_LOADING", false)
                    }
                })
                .then(() => {
                    if(oldImageURL && imageURL.split("?")[0] != oldImageURL.split("?")[0] && oldImageURL.indexOf(FIREBASE_CONFIG.storageBucket) > -1) {
                        let oldExt = oldImageURL.slice(oldImageURL.lastIndexOf(".")).split("?")[0]
                        storage.ref(dbReservations + "/" + payload.eventID + "/" + payload.key + "." + oldExt).delete()
                        .then()
                        .catch(error => {})
                    }
                    resolve(imageURL)
                    commit("SET_LOADING", false)
                })
                .catch(error => {
                    reject(error)
                    commit("SET_LOADING", false)
                })
            })
        },

        /** FIREBASE SYNC */
        setEventsSync({commit, dispatch}) {
            //remove sync first
            database.ref(dbEvents).off()
            //add listener to firebase events
            database.ref(dbEvents).on("child_added", data => { dispatch("onEventsSync", {event: "add", data: data})} )
            database.ref(dbEvents).on("child_changed", data => { dispatch("onEventsSync", {event: "change", data: data})} )
            database.ref(dbEvents).on("child_removed", data => { dispatch("onEventsSync", {event: "remove", data: data})} )
        },
        onEventsSync({commit}, payload) {
            commit("UPDATE_EVENTS", payload)
        },

        setCurrentEventSync({commit, dispatch}, payload) {
            //remove current sync
            dispatch("removeCurrentEventSync", payload)
            //
            let path = dbEvents + "/" + payload
            database.ref(path).on("child_changed", data => { dispatch("onCurrentEventSync", {event: "change", data: data})} )
        },
        removeCurrentEventSync({commit}, payload) {
            database.ref(dbEvents + "/" + payload).off()
        },
        onCurrentEventSync({commit}, payload) {
            commit("UPDATE_EVENT_DETAIL", {key: payload.data.key, value:payload.data.val()})
        },

        setReservationsSync({commit, dispatch}, payload) {
            let path = dbReservations + "/" + payload
            //remove sync first
            database.ref(path).off()
            //add listener to firebase events
            database.ref(path).on("child_added", data => { dispatch("onReservationsSync", {event: "add", data: data})} )
            database.ref(path).on("child_changed", data => { dispatch("onReservationsSync", {event: "change", data: data})} )
            database.ref(path).on("child_removed", data => { dispatch("onReservationsSync", {event: "remove", data: data})} )    
        },
        removeReservationsSync({commit}, payload) {
            database.ref(dbReservations + "/" + payload).off()
        },
        onReservationsSync({commit}, payload) {
            commit("SET_LOADING", false)
            commit("UPDATE_RESERVATIONS", payload)
        },

    }

    return new Vuex.Store ({
        state,
        getters,
        mutations,
        actions
    })
}

export default createStore