import { app, auth, db, provider, loggeduser, signIn, signInWithGoogle, logout, signUp, addBookToCollection, fetchUserBooks, addBiteToCollection, fetchUserBites } from '../services/firebase.js';  // Sicherstellen, dass signIn korrekt importiert ist

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
            return data
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
    changeContent(true);
}

document.addEventListener('DOMContentLoaded', () => {
    const addButton = document.getElementById('addBookToCollection-btn');
    console.log("Button")
    console.log(addButton)
    checkMyBook();
    let bookKey = getBookKeyFromURL();

    if (addButton) {  // Stelle sicher, dass der Button existiert
        // Füge das Onclick-Event hinzu
        addButton.addEventListener('click', () => {
            console.log("Click");
            //changeContent(true)
            addBookToCollectionEventClick();  // Rufe die Funktion auf, wenn der Button geklickt wird
        });
    } else {
        console.error("Button with id 'addBookToCollection-btn' not found.");
    }
    const addBiteButton = document.getElementById('save-bite');
    if (addBiteButton) {
        addBiteButton.addEventListener('click', () => {
            console.log("Bite added");
            // Der Schlüssel in der URL ist 'key', wir holen den Wert des Parameters
            const bite = document.getElementById("add-bite").value;
            if(bite == null || bite == ""){
                window.alert("Didnt you bite anything from the literature? You have to get a big bite first!")
                return
            }
            console.log(bite)
            addBiteToCollection(bookKey, bite)

            fetchUserBites(bookKey).then((bitesArray) => {
                console.log("Fetched bites array:", bitesArray);
    
                initmyBites(bitesArray)
            }).catch((error) => {
                console.error("Error fetching bites:", error);
            });
        })
    }
});

function changeContent(state) {
    if (state) {
        document.getElementById('addBookToCollection-btn').style.display = 'none';
        document.getElementById('bites-container').style.display = 'block';
        document.getElementById('bite-list-container').style.display = 'block';

        fetchUserBites(bookKey).then((bitesArray) => {
            console.log("Fetched bites array:", bitesArray);

            // Verarbeite das Array
            bitesArray.forEach((bite, index) => {
                console.log(`Bite ${index + 1}: ${bite}`);
            });
            initmyBites(bitesArray)
        }).catch((error) => {
            console.error("Error fetching bites:", error);
        });
        console.log("USER HAT DIESES OBJECT");
    } else {
        document.getElementById('addBookToCollection-btn').style.display = 'block';
        document.getElementById('bites-container').style.display = 'none';
        document.getElementById('bite-list-container').style.display = 'none';
    }
}

function initmyBites(bites) {
    const biteList = document.getElementById("bite-list");

    if (!biteList) {
        console.error("Bite list element not found!");
        return;
    }

    biteList.innerHTML = ""; // Alte Inhalte entfernen

    bites.forEach(bite => {
        const listItem = document.createElement("li");
        const biteDiv = document.createElement("div");

        biteDiv.textContent = bite; // Setze den Bite-Text
        biteDiv.style.whiteSpace = "pre-wrap"; // Zeilenumbrüche anzeigen
        biteDiv.style.border = "1px solid #ccc";
        biteDiv.style.padding = "10px";
        biteDiv.style.margin = "5px auto";
        biteDiv.style.width = "98%";
        biteDiv.style.maxWidth = "800px";
        biteDiv.style.minHeight = "50px";
        biteDiv.style.borderRadius = "5px";
        biteDiv.style.backgroundColor = "#f9f9f9";

        listItem.appendChild(biteDiv);
        biteList.appendChild(listItem);
    });
}


async function checkMyBook() {
    console.log("USER UIDDDDDDDDDDDDD")
    console.log(localStorage.getItem("userUid"))
    let myBooksData = await fetchUserBooks(localStorage.getItem("userUid"));
    console.log("AYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY")

    console.log(myBooksData);
    if (myBooksData == null || myBooksData.length == 0){
        changeContent(false)
        return
    }

    let id = getBookKeyFromURL();
    console.log("KEYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY")
    console.log(myBooksData.includes(id))
    if (myBooksData.includes(id))
        changeContent(true)
    else
        changeContent(false)

}

