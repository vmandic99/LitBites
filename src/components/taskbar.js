import { logout } from '../services/firebase.js';  // Importiere die Logout-Funktion aus firebase.js

// Funktion zum Umschalten des Profils-Menüs
function toggleProfileMenu() {
    const profileMenu = document.getElementById('profile-menu');
    
    // Wenn das Menü sichtbar ist, verstecke es
    if (profileMenu.style.display === 'block') {
        profileMenu.style.display = 'none';
    } else {
        // Andernfalls zeige es an
        profileMenu.style.display = 'block';
    }
}

// Logout-Funktion
function logoutClick() {
    console.log('Logging out...');
    console.log('window.location.origin:', window.location.origin); // Gibt die Basis-URL aus (z. B. https://vmandic99.github.io)
console.log('window.location.pathname:', window.location.pathname); // Gibt den Pfad nach der Domain aus (z. B. /LitBites/)

    alert('Logged out successfully!');
    logout();
    window.location.href = 'https://vmandic99.github.io/LitBites/index.html';
}

// Event Listener für das "My Profile"-Link und den Logout-Button hinzufügen
document.addEventListener('DOMContentLoaded', function() {
    const profileLink = document.getElementById('my-profile');
    if (profileLink) {
        profileLink.addEventListener('click', toggleProfileMenu);  // Event-Listener für das Profilmenü
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logoutClick);  // Event-Listener für den Logout-Button
    }
});

// Klick außerhalb des Menüs schließen
window.onclick = function(event) {
    const profileMenu = document.getElementById('profile-menu');
    const profileLink = document.getElementById('my-profile');
    
    // Wenn der Klick nicht auf den Profil-Link oder das Menü erfolgt, schließe das Menü
    if (!profileLink.contains(event.target) && !profileMenu.contains(event.target)) {
        profileMenu.style.display = 'none';
    }
};
