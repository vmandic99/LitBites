// onload.js

// Funktion zum Laden der Taskleiste
function loadTaskbar() {
    fetch('src/components/taskbar.html')  // Lese die taskbar.html Datei
        .then(response => response.text())  // Hole den Textinhalt
        .then(data => {
            document.getElementById('taskbar-container').innerHTML = data;  // Füge die Taskleiste in den Container ein
        })
        .catch(error => {
            console.error('Error loading taskbar:', error);
        });
}


// Funktion zum Laden des Addbooks-HTML
function loadAddBooks() {
    fetch('src/components/addbooks.html')  // Lade die Datei addbooks.html
        .then(response => response.text())  // Lese den Textinhalt
        .then(data => {
            document.getElementById('addbooks').innerHTML = data;  // Füge die HTML-Inhalte in den addbooks-Container ein
        })
        .catch(error => {
            console.error('Error loading addbooks.html:', error);
        });
}

// Lade addbooks.html, wenn die Seite geladen wird
window.onload = function() {
    loadTaskbar();
    loadAddBooks();
};
