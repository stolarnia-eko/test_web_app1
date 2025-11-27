// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
// import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js"


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
const auth = getAuth(app);

const form_signup = document.getElementById('form_signup');
const form_sign = document.getElementById('form_signin');
const check = document.getElementById('check');
const dialog = document.getElementById('dialog');
let text_dialog = document.getElementById('text-dialog');
const close_dialog = document.getElementById('close-dialog');


window.addEventListener('load', (e) => {
    if (localStorage.getItem('email') && localStorage.getItem('password')) {
        document.getElementById('email_logo').value = localStorage.getItem('email');
        document.getElementById('password_logo').value = localStorage.getItem('password');
    }

})


// form registration
check.addEventListener('click', (e) => {
    let value_check = check.checked;
    if (value_check) {
        document.getElementById('password').type = 'text';
    }
    else {
        document.getElementById('password').type = 'password';
    }
})



form_signup.onsubmit = async (e) => {
    e.preventDefault();

    const name = form_signup.name.value;
    const email = form_signup.email.value;
    const password = form_signup.password.value;

    if (!checkPass(password)) {
        open_dialog('Haslo powinno miec przynajmi 1 mala, wieka litere, cyfre i znak specialny i minimum 6 znakow!');
    } else {
        sinupUser(email, password, name);
    }
};


function sinupUser(email, password, displayName) {
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed up 
            const user = userCredential.user;
            // ...
            console.log(user)
            // updateProfile(user, {
            //     displayName: displayName
            // });
            open_dialog(`Uzytkownika ${email} zarejestrowano`)
        })
        .catch((error) => {
            open_dialog(`Uzytkownik o email ${email} juz jest`)
        });
}

// form logo
form_sign.onsubmit = async (e) => {
    e.preventDefault()
    const email = form_sign.email_logo.value;
    const password = form_sign.password_logo.value;
    if (password.length > 5) {
        singInUser(email, password)
    }
    else {
        alert('Password limit >=6')
    }
}

function singInUser(email, password) {

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            // ...
            localStorage.setItem('email', email)
            localStorage.setItem('password', password)
            window.location.href = 'htmls/home.html'
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorMessage)
        });
}

// validate password
function checkPass(input) {
    const reg = /^(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*()_+])[0-9a-zA-Z!@#$%^&*()_+]{6,}$/;
    if (reg.test(input)) {
        return true;
    }
    return false;
}

function open_dialog(text) {
    dialog.style.display = 'flex'
    text_dialog.innerText = text;
}
close_dialog.addEventListener('click', (e) => {
    dialog.style.display = 'none';
})



