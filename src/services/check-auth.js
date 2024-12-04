function checkUserInLocalStorage() {
    // Überprüfe, ob die Benutzerdaten im localStorage gespeichert sind
    const userUid = localStorage.getItem('userUid');
    const userEmail = localStorage.getItem('userEmail');

    if (userUid) {
        // Benutzerdaten gefunden, der Benutzer ist angemeldet
        console.log('User found in localStorage:', { userUid, userEmail });
        return true;  // Benutzer ist angemeldet
    } else {
        // Keine Benutzerdaten im localStorage, der Benutzer ist nicht angemeldet
        console.log('No user found in localStorage');
        window.location.href = "index.html"
        return false;  // Benutzer ist nicht angemeldet
    }
}

checkUserInLocalStorage();