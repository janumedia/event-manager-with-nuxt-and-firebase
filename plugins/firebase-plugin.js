import {auth} from  "@/services/firebase"

import Cookie from "js-cookie"

const cookieparser = require("cookieparser")

export default ({store, redirect, route, req}) => {

    let getToken = () => {
        let token = null
        if(req && req.headers.cookie) {
            var parsed = cookieparser.parse(req.headers.cookie)
            if(parsed.auth) token = JSON.parse(parsed.auth)
        }
        return token
    }

    return new Promise((resolve, reject) => {
        
        auth.onAuthStateChanged(auth => {
            
            //if null try get from cookie token
            if(auth == null) auth = getToken();

            //set server coockie
            Cookie.set("auth", auth)
            store.dispatch("setAuth", auth)
                
            if(store.state.auth && (route.path == "/" || route.path == "/login")) 
            {
                redirect("/home")
            }

            resolve()
        })
    })
}