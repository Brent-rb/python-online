import React from "react"
import firebaseui from "firebaseui"
import firebase from "firebase"

import "firebaseui/dist/firebaseui.css"

// Your web app's Firebase configuration
var firebaseConfig = {
	apiKey: "AIzaSyCbMBnIuJ5-oFoP_q7jWPscokgzX_hXsak",
	authDomain: "python-online-383ea.firebaseapp.com",
	databaseURL: "https://python-online-383ea.firebaseio.com",
	projectId: "python-online-383ea",
	storageBucket: "",
	messagingSenderId: "466518515290",
	appId: "1:466518515290:web:a827fb78644ff72f"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const uiConfig = {
    signInSuccessUrl: '/',
    signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ]
}

const ui = new firebaseui.auth.AuthUI(firebase.auth())

class Login extends React.Component {
    constructor() {
        super()
    }

    render() {
        return (
            <div className="Login" id="login-container">

            </div>
        )
    }

    componentDidMount() {
        ui.start("#login-container", uiConfig)
        console.log("Mounted")
    }
}

export default Login