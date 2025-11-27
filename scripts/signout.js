import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
// import { getFirestore, getDoc, doc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js"
import { getAuth, onAuthStateChanged, signOut, updateProfile } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyC7MI_jaZfCZwGn8nzGEgDw60wjkA-Ivng",
    authDomain: "test-script-27e3c.firebaseapp.com",
    projectId: "test-script-27e3c",
    storageBucket: "test-script-27e3c.firebasestorage.app",
    messagingSenderId: "606340762693",
    appId: "1:606340762693:web:0a858eb6e6adb7dec8e72c",
    //databaseURL: "https://js-project-55157-default-rtdb.firebaseio.com/",
    //firestoreURL: "https://firestore.googleapis.com/v1/projects/js-project-55157/databases/(default)/documents"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

window.onload = (e) => {
    let email = document.getElementById('email');
    onAuthStateChanged(auth, (user) => {
        if (user) {
            email.innerText = user.email;

        } else {
        }
    });
}

const button = document.querySelector('button');
button.addEventListener('click', (e) => {
    signOut(auth).then(() => {
        
        window.location.href = '../index.html'
    }).catch((error) => {

    });
    localStorage.clear();
    
})