// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries"
// Your web app's Firebase configuration
// import { getDatabase } from "firebase/database";
import { getDatabase, ref, set, onValue, child, push } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js";
const firebaseConfig = {
    apiKey: "AIzaSyBHVMcudI8tBbj1ChnvyzT1WAfj5cWZ6wk",
    authDomain: "js-project-55157.firebaseapp.com",
    projectId: "js-project-55157",
    storageBucket: "js-project-55157.firebasestorage.app",
    messagingSenderId: "1053405817543",
    appId: "1:1053405817543:web:308c3e5d09f6ef944eace2",
    databaseURL: "https://js-project-55157-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

let username = document.getElementById('username');
let email = document.getElementById('gmail');
let res = document.getElementById('result');

function Add_data() {
    let a = username.value;
    let b = email.value;
    set(ref(database, a ), {
        username: a,
        email: b,

    });
}
window.Add_data = Add_data;

function Get_data() {
    const dbRef = ref(getDatabase());
    onValue(child(dbRef, '/test/email'), (snapshot) => {
        if (snapshot.exists()) {
            console.log(snapshot.val());
            res.innerHTML = snapshot.val();
        } else {
            console.log("No data available");
        }
    }

    )
};
window.Get_data = Get_data;