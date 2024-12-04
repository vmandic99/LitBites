import { fetchUserBooks } from "../services/firebase.js"
// book-carousel.js
let currentIndex = 0;
let books = []; // Array zum Speichern der Buchdaten
export async function initializeMyBooksCarousel() {
    let myBooksData = await fetchUserBooks(localStorage.getItem("userUid"));
    console.log(myBooksData);
    console.log("UJHHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
    if(myBooksData == null || myBooksData.length == 0)
        return
    const container = document.getElementById("mybooks");
    const bookList = container.querySelector('.book-list');
    const prevBtn = container.querySelector('.prev-btn');
    const nextBtn = container.querySelector('.next-btn');

    // Speichert die Bücher, die geladen werden
    let books = myBooksData;
    let currentIndex = 0; // Setze den Startindex zurück

    // Funktion zum Rendern der Bücher
    function renderBooks() {
        bookList.innerHTML = '';  // Lösche die bisherigen Bücher

        if (books.length === 0) {
            window.alert("No books were found");
            return;
        }

        // Iteriere durch die Bücher
        books.forEach((book) => {
            if (book != null) {  // Stelle sicher, dass das Buch vorhanden ist
                const bookElement = document.createElement('div');
                bookElement.classList.add('book');

                // Hole die Buchdaten von OpenLibrary
                let url = `https://openlibrary.org/books/${book}.json`; // Verwende den Key, um die Detailseite zu laden
                fetch(url)
                    .then(response => response.json())
                    .then(data => {
                        // Zeige die Buchdetails auf der Seite an
                        console.log(data);
                        const booktitle = data.title ? data.title : "No title available";
                        const imgSrc = data.covers[0] ? `https://covers.openlibrary.org/b/id/${data.covers[0]}-L.jpg` : 'https://via.placeholder.com/150';

                        // Setze die HTML-Inhalte nach dem Fetch
                        bookElement.innerHTML = `
                            <img src="${imgSrc}" alt="Book Cover">
                            <div class="book-title">${booktitle}</div>
                        `;

                        // Klick-Event für das Buch hinzufügen, zur Detailseite weiterleiten
                        bookElement.addEventListener('click', function () {
                            openBookPage(book); // Öffne die Detailseite für dieses Buch
                        });

                        // Füge das Buch-Element zur Liste hinzu
                        bookList.appendChild(bookElement);
                    })
                    .catch(error => {
                        console.error('Error fetching book details:', error);
                        alert('An error occurred while fetching book details.');
                    });
            }
        });

        updateCarousel();  // Zeige das Carousel mit den Buchdaten an
    }



    // Funktion für das Vor- und Zurückblättern der Bücher
    function moveCarousel(direction) {
        if (direction === 'next' && currentIndex < books.length - 1) {
            currentIndex++;
        } else if (direction === 'prev' && currentIndex > 0) {
            currentIndex--;
        }
        updateCarousel();
    }

    // Funktion zum Anzeigen des Carousels
    function updateCarousel() {
        const offset = -currentIndex * 220;  // Setze die Position der Bücher im Carousel
        bookList.style.transform = `translateX(${offset}px)`;
    }

    // Funktion zum Weiterleiten zur Buchseite
    function openBookPage(bookKey) {
        window.location.href = `bookdetails.html?key=${bookKey}`;
    }

    // Button-Event-Listener
    prevBtn.addEventListener('click', () => moveCarousel('prev'));
    nextBtn.addEventListener('click', () => moveCarousel('next'));

    renderBooks();  // Bücher sofort rendern
}

export function searchMyBooks(){
    
    return
}