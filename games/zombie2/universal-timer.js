/**
 * Universal Session Timer
 * 
 * This script manages a session countdown timer based on an expiration
 * timestamp stored in localStorage. It handles user authentication checks,
 * updates a UI element, and redirects on session expiry.
 */
document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration ---
    const timerElement = document.getElementById("sessionTimer");
    const authExpires = localStorage.getItem("authExpires");

    // --- Authentication Check ---
    if (!localStorage.getItem("authenticated") || !authExpires || Date.now() > authExpires) {
        // Clear stale auth data just in case
        localStorage.removeItem("authenticated");
        localStorage.removeItem("authExpires");
        alert("Session expired or not logged in.");
        window.location.href = "index.html";
        return; // Stop script execution if not authenticated
    }

    // --- Timer Logic ---
    function updateTimer() {
        const remainingMs = authExpires - Date.now();
        const remainingSeconds = Math.max(0, Math.floor(remainingMs / 1000));

        if (remainingSeconds <= 0) {
            localStorage.removeItem("authenticated");
            localStorage.removeItem("authExpires");
            alert("Session expired!");
            window.location.href = "index.html";
            clearInterval(timerInterval); // Stop the timer
            return;
        }

        const minutes = Math.floor(remainingSeconds / 60).toString().padStart(2, '0');
        const seconds = (remainingSeconds % 60).toString().padStart(2, '0');
        timerElement.textContent = `${minutes}:${seconds}`;
    }

    // --- Initialization ---
    updateTimer(); // Run once immediately
    const timerInterval = setInterval(updateTimer, 1000); // Then update every second
});