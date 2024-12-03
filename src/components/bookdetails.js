import { app, auth, db, provider, loggeduser, signIn, signInWithGoogle, logout, signUp, addBookToCollection } from '../services/firebase.js';  // Sicherstellen, dass signIn korrekt importiert ist

let currentBook;





// Funktion, um den Wert eines Parameters aus der URL zu extrahieren
function getBookKeyFromURL() {
    // Die URL der aktuellen Seite
    const urlParams = new URLSearchParams(window.location.search);

    // Der Schlüssel in der URL ist 'key', wir holen den Wert des Parameters
    const bookKey = urlParams.get('key');

    return bookKey;
}


// Funktion, um die Buchdetails mit dem Buch-Key zu holen
function getBookDetails(bookKey) {
    const url = `https://openlibrary.org/books/${bookKey}.json`; // Verwende den Key, um die Detailseite zu laden
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Zeige die Buchdetails auf der Seite an
            console.log(data)
            displayBookDetails(data);
        })
        .catch(error => {
            console.error('Error fetching book details:', error);
            alert('An error occurred while fetching book details.');
        });
}

// Funktion, um die Buchdetails anzuzeigen
function displayBookDetails(bookData) {

    // Zeige die Buchdetails auf der Seite an, z.B. Titel, Autoren, Beschreibung
    const title = bookData.title ? bookData.title : 'No titel available';

    let authors = [];//= bookData.authors ? bookData.authors.map(author => author.name).join(', ') : 'Unknown';

    const coverImg = bookData.covers[0] ? `https://covers.openlibrary.org/b/id/${bookData.covers[0]}-L.jpg` : 'https://via.placeholder.com/150';
    console.log(`https://covers.openlibrary.org/b/id/${bookData.covers[0]}-M.jpg`)
    /*const coverImg = bookData.cover ? `https://covers.openlibrary.org/b/olid/${bookKey}-M.jpg` : 'https://via.placeholder.com/150';
    console.log(`https://covers.openlibrary.org/b/olid/${bookKey}-M.jpg`)
    */
    let keys = bookData.author ? bookData.authors.map((author) => author.key) : "No Author(s) available";
    let authorsString = '';
    console.log(keys)
    if (bookData.author != null) {
        // Erstelle ein Array von Promises für die Fetch-Anfragen
        let promises = keys.map((key, index) => {
            const auth_url = `https://openlibrary.org${key}.json`;

            return fetch(auth_url)
                .then(response => response.json())
                .then(data => {
                    console.log(data.name);
                    // Wenn nicht der erste Autor, füge ein Komma hinzu
                    if (index > 0) {
                        authorsString += ', ';
                    }
                    // Füge den Namen des Autors zum String hinzu
                    authorsString += data.name;
                })
                .catch(error => {
                    console.error('Error fetching author details:', error);
                    alert('An error occurred while fetching author details.');
                });
        });
        // Verwende Promise.all, um sicherzustellen, dass alle fetch-Anfragen abgeschlossen sind
        Promise.all(promises)
            .then(() => {
                // Dieser Code wird ausgeführt, nachdem alle fetch-Anfragen abgeschlossen sind
                console.log("----------------------------");
                console.log(authorsString);  // Zeigt die gesammelten Autorennamen im String-Format an

                document.getElementById('book-authors').textContent = `Authors: ${authorsString}`;

            });
    } else {
        document.getElementById('book-authors').textContent = `No Author(s) available`;
    }

    document.getElementById('book-cover').src = coverImg;
    document.getElementById('book-title').textContent = title;
    console.log(authors);  // Zeigt die gesammelten Autorennamen nach der Fetch-Aktion an
}

// Holen der Buchdetails, nachdem der Key extrahiert wurde
const bookKey = getBookKeyFromURL();
if (bookKey) {
    getBookDetails(bookKey);
} else {
    console.error('Book key not found in URL.');
}




function addBookToCollectionEventClick() {
    console.log("The book was added to your collection!");
    // Die URL der aktuellen Seite
    const urlParams = new URLSearchParams(window.location.search);

    // Der Schlüssel in der URL ist 'key', wir holen den Wert des Parameters
    const bookKey = urlParams.get('key')
    console.log("CLICK");
    addBookToCollection(bookKey)
    // Zeigt das Element wieder an, wenn es mit display: none versteckt wurde
   // document.getElementById("bites").style.display = "block";  // Für Block-Level-Elemente
   // document.getElementById("addBookToCollection-btn").style.display = "none"
}

document.addEventListener('DOMContentLoaded', () => {
    const addButton = document.getElementById('addBookToCollection-btn');
    console.log("Button")
    console.log(addButton)
    if (addButton) {  // Stelle sicher, dass der Button existiert
        // Füge das Onclick-Event hinzu
        addButton.addEventListener('click', () => {
            console.log("Click");
            addBookToCollectionEventClick();  // Rufe die Funktion auf, wenn der Button geklickt wird
        });
    } else {
        console.error("Button with id 'addBookToCollection-btn' not found.");
    }
});


