// book-carousel.js
let currentIndex = 0;
let books = []; // Array zum Speichern der Buchdaten

// Diese Funktion wird verwendet, um das Carousel auf jeder Seite zu initialisieren
export function initializeBookCarousel(containerId, booksData) {
    const container = document.getElementById(containerId);
    const bookList = container.querySelector('.book-list');
    const prevBtn = container.querySelector('.prev-btn');
    const nextBtn = container.querySelector('.next-btn');

    // Speichert die Bücher, die geladen werden
    books = booksData;
    currentIndex = 0; // Setze den Startindex zurück

    // Funktion zum Rendern der Bücher
    function renderBooks() {
        bookList.innerHTML = '';  // Lösche die bisherigen Bücher

        if (books.length === 0) {
            //bookList.innerHTML = '<p>No books found.</p>';
            window.alert("No books were found")
            return;
        }

        books.forEach((book) => {
            if (book.cover_i) { // Stelle sicher, dass das Buch ein Cover hat
                const bookElement = document.createElement('div');
                bookElement.classList.add('book');
                const imgSrc = `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;  // Link zum Cover-Bild
                const authors = book.author_name ? book.author_name.join(', ') : 'Unknown';
                bookElement.innerHTML = `
                    <img src="${imgSrc}" alt="Book Cover">
                    <div class="book-title">${book.title}</div>
                    <div class="book-author">Author(s): ${authors}</div>
                    <div class="book-description">First published: ${book.first_publish_year || 'N/A'}</div>
                `;
                console.log(book)
                // Klick-Event für das Buch hinzufügen, zur Detailseite weiterleiten
                bookElement.addEventListener('click', function () {
                    openBookPage(book.cover_edition_key); // Öffne die Detailseite für dieses Buch
                });

                bookList.appendChild(bookElement);
            }
        });

        // Zeige das Carousel mit den Buchdaten an
        updateCarousel();
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

    renderBooks(); // Bücher sofort rendern
}

// Funktion zum Suchen von Büchern
export function searchBooks(query, containerId) {
    if (!query) {
        alert('Please enter a search query.');
        return;
    }

    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`;
    console.log(url);
    fetch(url)
        .then(response => response.json())
        .then(data => {
            books = data.docs;
            initializeBookCarousel(containerId, books);  // Initialisiere das Carousel mit den Buchdaten
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            alert('An error occurred while fetching book data.');
        });
}
