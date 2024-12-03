// app.js - Login/SignUp Logik
import { app, auth, db, provider, loggeduser, signIn, signInWithGoogle, logout, signUp } from './services/firebase.js';  // Sicherstellen, dass signIn korrekt importiert ist

 // Überprüfe, ob die Benutzerdaten im localStorage gespeichert sind
 const userUid = localStorage.getItem('userUid');
 const userEmail = localStorage.getItem('userEmail');



// Google Login
const loginWithEmail = () => {
    let email = document.getElementById('email_field');
    let password = document.getElementById('password_field');

    signIn(email.value, password.value)
        .then(() => { //das noch im oauth entscheiden lassen
            changeContent(true);
        })
        .catch((error) => {
            alert('Error: ' + error.message);
        });

};

const loginWithGoogle = () => {
    signInWithGoogle()
        .then(() => {
            changeContent(true);
        })
        .catch((error) => {
            alert('Error: ' + error.message);
        });

};

// Google Login
const createAccount = () => {
    let email = document.getElementById('email_field');
    let password = document.getElementById('password_field');

    signUp(email.value, password.value)
        .then(() => { //das noch im oauth entscheiden lassen
            changeContent(true);
        })
        .catch((error) => {
            alert('Error: ' + error.message);
        });

};



export const changeContent = (state) => {
    // Zeigt nur den Pfad der aktuellen Seite (z.B. "/index.html")
    console.log(window.location.pathname);
    //window.location.href = "index.html";  // Redirect zu einer anderen Seite    
    if (state === true) {
        // Wenn der Zustand true ist, verberge das Login-Formular und zeige den Haupt-Content
        document.getElementById('login_content').style.display = 'none';
        document.getElementById('content').style.display = 'block';  // Den Content sichtbar machen

        document.getElementById('welcome_headline').innerText = "Willkommen auf LitBits " + userEmail;
        document.getElementById('taskbarnavigation').style.display = 'block';

    } else if (state === false) {
        // Wenn der Zustand false ist, zeige das Login-Formular und verberge den Haupt-Content
        document.getElementById('login_content').style.display = 'block';  // Login-Formular sichtbar machen
        document.getElementById('content').style.display = 'none';  // Haupt-Content unsichtbar machen
        document.getElementById('taskbarnavigation').style.display = 'none';
    }
};


// Event-Listener für Login und Google-Login
document.getElementById('login_btn').addEventListener('click', loginWithEmail);
document.getElementById('google-login_btn').addEventListener('click', loginWithGoogle);
document.getElementById('createAccount_btn').addEventListener('click', createAccount);


if (userUid && userEmail) {
    // Benutzerdaten gefunden, der Benutzer ist angemeldet
    console.log('User found in localStorage:', { userUid, userEmail });
    changeContent(true);
} else {
    // Keine Benutzerdaten im localStorage, der Benutzer ist nicht angemeldet
    console.log('No user found in localStorage');
    //window.location.href = "index.html"
}