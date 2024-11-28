// app.js - Login/SignUp Logik
import { app, auth, db ,provider, loggeduser , signIn, signInWithGoogle, logout} from './firebaseinit.js';  // Sicherstellen, dass signIn korrekt importiert ist

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { doc, setDoc, getDoc, getDocs, getFirestore, updateDoc, Timestamp, collection, where, query, FieldValue, arrayUnion } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js"; //von gettstarted login

// Google Login
const loginWithEmail = () => {
  let email = document.getElementById('email_field');
  let password = document.getElementById('password_field');

  signIn(email.value, password.value)
    .then(() => { //das noch im oauth entscheiden lassen
    })
    .catch((error) => {
      alert('Error: ' + error.message);
    });

};

const loginWithGoogle = () => {
  signInWithGoogle()
    .then(() => { 
    })
    .catch((error) => {
      alert('Error: ' + error.message);
    });

};

const logoutEvent = () => {
  logout()
    .then(() => { 
    })
    .catch((error) => {
      alert('Error: ' + error.message);
    });

};


// Event-Listener für Login und Google-Login
document.getElementById('login_btn').addEventListener('click', loginWithEmail);
document.getElementById('google-login_btn').addEventListener('click', loginWithGoogle);
document.getElementById('logout_btn').addEventListener('click', logoutEvent);


