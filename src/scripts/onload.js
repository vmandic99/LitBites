// onload.js

// Funktion zum Laden des Addbooks-HTML
function loadAddBooks() {
    fetch('src/components/addbooks.html')  // Lade die Datei addbooks.html
        .then(response => response.text())  // Lese den Textinhalt
        .then(data => {
            document.getElementById('addbooks').innerHTML = "";  // Füge die HTML-Inhalte in den addbooks-Container ein
            document.getElementById('addbooks').innerHTML = data;  // Füge die HTML-Inhalte in den addbooks-Container ein
        })
        .catch(error => {
            console.error('Error loading addbooks.html:', error);
        });
}

// Lade addbooks.html, wenn die Seite geladen wird
window.onload = function() {
    loadAddBooks();
};
