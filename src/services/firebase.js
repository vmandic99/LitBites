// firebase.js - Firebase Konfiguration und Initialisierung
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { doc, setDoc, getDoc, getDocs, getFirestore, updateDoc, Timestamp, collection, where, query, FieldValue, arrayUnion, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signInWithPopup, signOut, updatePassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js"; //von gettstarted login


import { initializeMyBooksCarousel } from '../components/mybooks-carousel.js'; // Importiere die Funktionen aus book-carousel.js


//import {changeContent} from "./app.js"

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
        //saveUserToLocalStorage(user.uid, user.email);
    } else {
        // Der Benutzer ist nicht angemeldet
        console.log("Kein Benutzer angemeldet.");

    }
});


// Registriert einen neuen Benutzer mit E-Mail und Passwort.
export const signUp = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log('User signed up:', userCredential.user);
        createAccount(userCredential.user);
        saveUserToLocalStorage(userCredential.user.uid, userCredential.user.email);
        // Erstelle das Benutzer-Dokument
        await setDoc(doc(db, "users", userCredential.user.uid), {
            email: userCredential.user.email,
        });

        return userCredential.user;
    } catch (error) {
        console.error('Error signing up:', error.message);
        throw error;
    }
};


// Funktion zum Erstellen eines Benutzerkontos
const createAccount = async (user) => {
    try {
        console.log("New User");
        console.log(user);


        // Füge eine Sub-Sammlung "myBooks" für den Benutzer hinzu
        // Hier erstellen wir ein Dokument in der Sub-Sammlung "myBooks"
        //const userBooksCollectionRef = collection(db, "users", user.uid, "myBooks"); //this doesnt work, because i need to add data first

        /*// Beispiel: Erstelle ein Buch-Dokument in der "myBooks"-Sub-Sammlung
        await addDoc(userBooksCollectionRef, {
          book_id: "book123",
          bites: [["bite1", "translation1"], ["bite2", "translation2"]],
          rating: 4,
          progress: 50
        });
    */
        alert('User account created and myBooks collection updated successfully!');
        saveUserToLocalStorage(user.uid, user.email);

        // Erstelle das Benutzer-Dokument
        await setDoc(doc(db, "users", user.uid), {
            email: user.email,
        });
    } catch (error) {
        console.error("Error creating user:", error);
        alert('Error creating user account.');
    }
};

// Meldet einen Benutzer mit E-Mail und Passwort an.
export const signIn = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('User signed in:', userCredential.user);
        saveUserToLocalStorage(userCredential.user.uid, userCredential.user.email);
        let getUserData = await getDoc(doc(db, "users", userCredential.user.uid));
        console.log(getUserData)
        if (getUserData == null) {
            // Erstelle das Benutzer-Dokument
            await setDoc(doc(db, "users", userCredential.user.uid), {
                email: userCredential.user.email,
            });
        }
        //await fetchUserBooks(userCredential.user.uid);
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
        saveUserToLocalStorage(user.uid, user.email);
        let getUserData = await getDoc(doc(db, "users", user.uid));
        console.log(getUserData)
        if (getUserData == null) {
            // Erstelle das Benutzer-Dokument
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
            });
        }
       // await fetchUserBooks(user.uid);
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
        // Lösche die Benutzerdaten aus dem localStorage
        removeUserFromLocalStorage();
    } catch (error) {
        console.error('Error signing out:', error.message);
        throw error;
    }
};

// Neues Passwort für den Benutzer, für zukunft
export const changePassword = async (newPassword) => {
    try {
        const user = result.user;  // Das Benutzerobjekt
        // Benutzerauthentifizierung ist erforderlich, um das Passwort zu ändern
        updatePassword(user, newPassword)
            .then(() => {
                // Passwort wurde erfolgreich geändert
                alert("Password updated successfully!");
            })
            .catch((error) => {
                // Fehler bei der Passwortänderung
                console.error("Error updating password:", error);
                alert("Error updating password: " + error.message);
            });
    } catch (error) {
        console.error('No User logged');
        throw error;
    }
};

export const addBookToCollection = async (book) => {
    const user = localStorage.getItem("userUid");  // Hole die Benutzer-ID aus dem LocalStorage
    if (!user) {
        console.error('User is not logged in');
        return;
    }

    try {
        // Referenz zur "myBooks" Subcollection des Benutzers
        // Verwende `doc()` für das Dokument mit einer benutzerdefinierten ID (book.id)
        const bookRef = doc(db, "users", user, "myBooks", book);

        // Füge das Buch als Dokument hinzu
        await setDoc(bookRef, {
            bites: arrayUnion()  // Bites (z. B. Array oder JSON-Daten)
        });

    } catch (error) {
        console.error("Error adding book to collection:", error);
    }
};


export const addBiteToCollection = async (book, bite) => {
    const user = localStorage.getItem("userUid"); // Hole die Benutzer-ID aus dem LocalStorage
    if (!user) {
        console.error('User is not logged in');
        return;
    }

    try {
        // Referenz zur "myBooks" Subcollection des Benutzers
        const bookRef = doc(db, "users", user, "myBooks", book);

        // Aktualisiere das Dokument und füge den neuen Bite zum Array hinzu
        await updateDoc(bookRef, {
            bites: arrayUnion(bite) // arrayUnion fügt den neuen Bite hinzu, wenn er noch nicht existiert
        });

        console.log("Bite successfully added to collection");

    } catch (error) {
        console.error("Error adding bite to collection:", error);
    }
};




export const fetchUserBites = async (book) => {
    const user = localStorage.getItem("userUid"); // Hole die Benutzer-ID aus dem LocalStorage
    if (!user) {
        console.error('User is not logged in');
        return null; // Rückgabe von null, falls kein Benutzer eingeloggt ist
    }

    try {
        // Referenz zur "myBooks"-Subcollection des Benutzers
        const bookRef = doc(db, "users", user, "myBooks", book);

        // Abrufen der Dokumentdaten
        const docSnap = await getDoc(bookRef);

        if (docSnap.exists()) {
            // Daten aus dem Dokument
            const data = docSnap.data();
            console.log("Fetched Bites:", data.bites); // Prüfe die Bites im Dokument
            return data.bites; // Rückgabe des Bites-Arrays
        } else {
            console.warn("No such document found for book:", book);
            return null; // Kein Dokument gefunden
        }

    } catch (error) {
        console.error("Error fetching bites from collection:", error);
        return null; // Rückgabe von null bei Fehler
    }
};

export { app, auth, db, provider, loggeduser };


function saveUserToLocalStorage(uid, email) {
    // Speichern der Benutzerinformationen im localStorage
    localStorage.setItem('userUid', uid);
    localStorage.setItem('userEmail', email);
    console.log('User data saved to localStorage:', { uid, email });
}

function removeUserFromLocalStorage() {
    localStorage.removeItem('userUid');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('mybooks')
    console.log('User data removed from localStorage');
}

// Beispiel für Logout
const logoutUser = async () => {
    try {
        await signOut(auth);
        removeUserFromLocalStorage(); // Benutzerdaten entfernen

        console.log('User logged out');
    } catch (error) {
        console.error('Error signing out:', error.message);
    }
};


// Funktion zum Laden der Bücher eines Benutzers
export const fetchUserBooks = async (userId) => {
    try {
        // Erstelle eine Referenz zur "myBooks" Subcollection des Benutzers
        const myBooksRef = collection(db, "users", userId, "myBooks");
        // Hole die Dokumente (Bücher) aus der Subcollection
        const querySnapshot = await getDocs(
            query(myBooksRef)
        )

        await querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data())
        });

        console.log("AYOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO")
        console.log(querySnapshot)
        // Array zum Speichern der IDs der Bücher
        const bookIds = [];

        // Iteriere durch die Dokumente und hole die ID jedes Buches
        await querySnapshot.forEach(doc => {
            bookIds.push(doc.id);  // Die ID jedes Buches (Dokumenten-ID)
        });

        // Speichern des Arrays im localStorage
        await localStorage.setItem("mybooks", JSON.stringify(bookIds));  // Buch-IDs als Array speichern
        // Zeige die Buch-IDs in der Konsole
        console.log("User's books IDs:", bookIds);
        console.log("LOCAL STORAGGGGGGGGGGGGGGGGGGGGGGGGGGEEEEEEEEEEEEEEEEEEEEEEEEEEE")
        console.log(localStorage.getItem("mybooks"))
        return bookIds;
    } catch (error) {
        //console.error("Error fetching user's books:", error);
        console.log("No Books");
    }
};