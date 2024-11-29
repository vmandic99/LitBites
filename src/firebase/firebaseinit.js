// firebase.js - Firebase Konfiguration und Initialisierung
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { doc, setDoc, getDoc, getDocs, getFirestore, updateDoc, Timestamp, collection, where, query, FieldValue, arrayUnion } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js"; //von gettstarted login


// Deine Firebase-Konfiguration
const firebaseConfig = {
  apiKey: "AIzaSyAdHop1Apzt0bL9LjQInL_p3dMXECv4VaA",
  authDomain: "litbites-d485b.firebaseapp.com",
  projectId: "litbites-d485b",
  storageBucket: "litbites-d485b.firebasestorage.app",
  messagingSenderId: "615495624935",
  appId: "1:615495624935:web:0d120496f71ff44c559a42"
};

// Initialisiere Firebase
const app = initializeApp(firebaseConfig);

// Firebase-Dienste
const auth = getAuth(app); // Authentifizierung
const db = getFirestore(app); // Firestore
const provider = new GoogleAuthProvider(); // Google Auth Provider für Google Login


let loggeduser;
// Überprüfen, ob der Benutzer angemeldet ist
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Der Benutzer ist angemeldet
    console.log("Aktueller Benutzer:", user);
    // Zugriff auf Benutzerinformationen wie z.B. UID und E-Mail
    console.log("Benutzer ID:", user.uid);
    console.log("Benutzer E-Mail:", user.email);
    loggeduser = user;

    changeContent(true)
  } else {
    // Der Benutzer ist nicht angemeldet
    console.log("Kein Benutzer angemeldet.");
    changeContent(false)
  }
});


// Registriert einen neuen Benutzer mit E-Mail und Passwort.
export const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('User signed up:', userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error('Error signing up:', error.message);
    throw error;
  }
};

// Meldet einen Benutzer mit E-Mail und Passwort an.
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('User signed in:', userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error('Error signing in:', error.message);
    throw error;
  }
};

// Meldet den Benutzer über Google an (OAuth).
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;  // Das Benutzerobjekt
    console.log('User signed in with Google:', user);
    return user;
  } catch (error) {
    console.error('Error signing in with Google:', error.message);
    throw error;
  }
};

// Meldet den aktuellen Benutzer ab.
export const logout = async () => {
  try {
    await signOut(auth);
    console.log('User signed out');
  } catch (error) {
    console.error('Error signing out:', error.message);
    throw error;
  }
};

export { app, auth, db, provider, loggeduser };

const changeContent = (state) => {
  if (state === true) {
    // Wenn der Zustand true ist, verberge das Login-Formular und zeige den Haupt-Content
    document.getElementById('login_content').style.display = 'none';
    document.getElementById('content').style.display = 'block';  // Den Content sichtbar machen

    document.getElementById('welcome_headline').innerText = "Willkommen auf LitBits " + loggeduser.email;
    document.getElementById('taskbarnavigation').style.display = 'block';
 
  } else if (state === false) {
    // Wenn der Zustand false ist, zeige das Login-Formular und verberge den Haupt-Content
    document.getElementById('login_content').style.display = 'block';  // Login-Formular sichtbar machen
    document.getElementById('content').style.display = 'none';  // Haupt-Content unsichtbar machen
    document.getElementById('taskbarnavigation').style.display = 'none';
  }
};
