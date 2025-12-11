// === CONFIG ===
const encryptedPassword = btoa("1234");   
const maxAttempts = 5;
const cooldownMinutes = 10;

// === DOM ELEMENTS ===
const loginBtn = document.getElementById("loginBtn");
const passwordInput = document.getElementById("passwordInput");
const errorBox = document.getElementById("error");

// === Load stored values ===
let attemptsLeft = parseInt(localStorage.getItem("attemptsLeft")) || maxAttempts;
let cooldownEnd = localStorage.getItem("cooldownEnd");

// === Check cooldown on page load ===
function checkCooldown() {
    if (!cooldownEnd) return;

    const now = Date.now();
    if (now < cooldownEnd) {
        lockLogin();
    } else {
        // cooldown expired
        localStorage.removeItem("cooldownEnd");
        attemptsLeft = maxAttempts;
        localStorage.setItem("attemptsLeft", attemptsLeft);
        unlockLogin();
    }
}

checkCooldown();

// === Lockout function ===
function lockLogin() {
    loginBtn.disabled = true;
    loginBtn.style.opacity = "0.5";
    loginBtn.style.cursor = "not-allowed";

    const remaining = Math.ceil((cooldownEnd - Date.now()) / 60000);
    errorBox.innerText = `Too many failed attempts. Try again in ${remaining} minute(s).`;
    errorBox.style.display = "block";

    // Update countdown every 30 seconds
    const interval = setInterval(() => {
        const now = Date.now();
        if (now >= cooldownEnd) {
            clearInterval(interval);
            unlockLogin();
            errorBox.style.display = "none";
        } else {
            const left = Math.ceil((cooldownEnd - now) / 60000);
            errorBox.innerText = `Too many failed attempts. Try again in ${left} minute(s).`;
        }
    }, 30000);
}

// === Unlock after cooldown ends ===
function unlockLogin() {
    loginBtn.disabled = false;
    loginBtn.style.opacity = "1";
    loginBtn.style.cursor = "pointer";
}

// === MAIN LOGIN HANDLER ===
loginBtn.addEventListener("click", function () {
    const correctPassword = atob(encryptedPassword);
    const userPass = passwordInput.value;

    if (loginBtn.disabled) return;

    if (userPass === correctPassword) {
        // Reset everything
        localStorage.removeItem("attemptsLeft");
        localStorage.removeItem("cooldownEnd");
        window.location.href = "2fa.html";
        return;
    }

    // Wrong password
    attemptsLeft--;
    localStorage.setItem("attemptsLeft", attemptsLeft);

    if (attemptsLeft > 0) {
        errorBox.innerText = `Incorrect password! Attempts left: ${attemptsLeft}`;
        errorBox.style.display = "block";

        // Shake animation (optional)
        errorBox.classList.add("shake");
        setTimeout(() => errorBox.classList.remove("shake"), 300);
    } else {
        // Lock out
        const cooldownEndTime = Date.now() + cooldownMinutes * 60 * 1000;
        localStorage.setItem("cooldownEnd", cooldownEndTime);
        cooldownEnd = cooldownEndTime;

        lockLogin();
    }
});

