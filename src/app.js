// app.js - Login/SignUp Logik
import { app, auth, db, provider, loggeduser, signIn, signInWithGoogle, logout, signUp } from './services/firebase.js';  // Sicherstellen, dass signIn korrekt importiert ist
import { initializeBookCarousel, searchBooks } from './components/book-carousel.js'; // Importiere die Funktionen aus book-carousel.js

// Überprüfe, ob die Benutzerdaten im localStorage gespeichert sind
const userUid = localStorage.getItem('userUid');
const userEmail = localStorage.getItem('userEmail');

// Bücher Array (global)
let books = []; // Definiere `books` global

// Google Login
const loginWithEmail = () => {
    let email = document.getElementById('email_field');
    let password = document.getElementById('password_field');

    signIn(email.value, password.value)
        .then(() => { // Das noch im OAuth entscheiden lassen
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
        .then(() => { // Das noch im OAuth entscheiden lassen
            changeContent(true);
        })
        .catch((error) => {
            alert('Error: ' + error.message);
        });
};

export const changeContent = (state) => {
    // Zeigt nur den Pfad der aktuellen Seite (z.B. "/index.html")
    console.log(window.location.pathname);
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

// Überprüfen, ob der Benutzer bereits angemeldet ist
if (userUid && userEmail) {
    // Benutzerdaten gefunden, der Benutzer ist angemeldet
    console.log('User found in localStorage:', { userUid, userEmail });
    changeContent(true);
} else {
    // Keine Benutzerdaten im localStorage, der Benutzer ist nicht angemeldet
    console.log('No user found in localStorage');
    //window.location.href = "index.html"
}


// Funktion für das Suchen von Büchern im Add Books Bereich
function searchBooksForAdd() {
    const query = document.getElementById('search-query').value;
    searchBooks(query, 'addbooks-carousel'); // Bücher für Add Books Container suchen
}

// Funktion für das Suchen von Büchern im My Books Bereich
function searchBooksForMyBooks() {
    const query = document.getElementById('mybooks_search-query').value;
    searchBooks(query, 'mybooks-carousel'); // Bücher für My Books Container suchen
}

// **Event-Listener** für die Buttons, die in `addbooks.html` vorhanden sind.
document.getElementById('search-btn-addbooks').addEventListener('click', searchBooksForAdd);
document.getElementById('search-btn-mybooks').addEventListener('click', searchBooksForMyBooks);
