let currentIndex = 0; // Index für das aktuelle Buch im Carousel
let books = []; // Array zum Speichern der Buchdaten

// Funktion zum Suchen von Büchern
function searchBooks() {
    const query = document.getElementById('search-query').value;
    if (!query) {
        alert('Please enter a search query.');
        return;
    }

    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`;
    console.log(url);
    // Hole die Daten von der Open Library API
    fetch(url)
        .then(response => response.json())
        .then(data => {
            books = data.docs;
            displayBooks(books);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            alert('An error occurred while fetching book data.');
        });
}

// Funktion zum Anzeigen der Bücher im Carousel
function displayBooks(books) {
    const listContainer = document.getElementById('book-list');
    listContainer.innerHTML = ''; // Lösche die bisherigen Bücher

    if (books.length === 0) {
        listContainer.innerHTML = '<p>No books found.</p>';
        return;
    }

    // Erstelle die Buch-Elemente im Carousel
    books.forEach((book, index) => {
        const bookElement = document.createElement('div');
        bookElement.classList.add('book');
        const imgSrc = book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : 'https://via.placeholder.com/100';
        const authors = book.author_name ? book.author_name.join(', ') : 'Unknown';
        console.log(book);
        bookElement.innerHTML = `
            <img src="${imgSrc}" alt="Book Cover">
            <div class="book-title">${book.title}</div>
            <div class="book-author">Author(s): ${authors}</div>
            <div class="book-description">First published: ${book.first_publish_year || 'N/A'}</div>
        `;
        
        // Klick-Event für das Buch hinzufügen, zur Detailseite weiterleiten
        bookElement.addEventListener('click', function() {
            console.log(book);
            openBookPage(book.cover_edition_key); // 'key' ist der Identifier in der Open Library API
 
        });

        listContainer.appendChild(bookElement);
    });

    // Zeige das Carousel mit den Buchdaten an
    updateCarousel();
}

// Funktion zum Anzeigen des Carousels
function updateCarousel() {
    const bookList = document.getElementById('book-list');
    const offset = -currentIndex * 220; // Position der Bücher im Carousel
    bookList.style.transform = `translateX(${offset}px)`;
}

// Funktion für das Vor- und Zurückblättern der Bücher
function moveCarousel(direction) {
    if (direction === 'next') {
        if (currentIndex < books.length - 1) {
            currentIndex++;
        }
    } else if (direction === 'prev') {
        if (currentIndex > 0) {
            currentIndex--;
        }
    }
    updateCarousel();
}

// Funktion zum Weiterleiten zur Buchseite mit dem 'key' als URL-Parameter
function openBookPage(bookKey) {
    // Weiterleitung zur Detailseite, wobei der 'key' als URL-Parameter übergeben wird
    window.location.href = `book_details.html?key=${bookKey}`;
}