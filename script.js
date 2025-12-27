const workQuotes = [
    "Keep going, you're on fire!",
    "Focus and conquer!",
    "Almost there, stay strong!",
    "One step at a time!",
    "You got this! Keep pushing!"
];

const breakQuotes = [
    "Take a deep breath, you deserve it!",
    "Relax, recharge, and get ready!",
    "Short break, long focus ahead!",
    "Break time! Stretch and smile!",
    "Nice work! Enjoy your rest!"
];

let pomodoroCount=0;
let timerInterval;
let isRunning = false;
let isWorkTime = true;
let workMinutes = 25;
let breakMinutes = 5;
let totalSeconds = workMinutes * 60;

const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const settingsBtn = document.getElementById('settingsBtn');
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const currentTimeDisplay = document.getElementById('currentTime');
const currentPeriodDisplay = document.getElementById('currentPeriod');
const motivationDisplay = document.getElementById('motivation');
const settingsModal = document.getElementById('settingsModal');
const saveBtn = document.getElementById('saveBtn');
const cancelBtn = document.getElementById('cancelBtn');
const workTimeInput = document.getElementById('workTime');
const breakTimeInput = document.getElementById('breakTime');
const watcher = document.getElementById('watcher');
const notificationSound = document.getElementById('notificationSound');
const rainSound = document.getElementById('rainSound');
const rainToggle = document.getElementById('rainToggle');

let isRainPlaying = false;
let quoteInterval;

function startQuoteRotation() {
    // Clear any previous interval
    clearInterval(quoteInterval);

    // Immediately show a quote
    showRandomQuote();

    // Then update every 30 seconds (30000 ms)
    quoteInterval = setInterval(showRandomQuote, 30000);
}

function showRandomQuote() {
    if (isWorkTime) {
        // During work session, show a work quote
        const randomWorkQuote = workQuotes[Math.floor(Math.random() * workQuotes.length)];
        motivationDisplay.textContent = randomWorkQuote;
    } else {
        // During break session, show a break quote
        const randomBreakQuote = breakQuotes[Math.floor(Math.random() * breakQuotes.length)];
        motivationDisplay.textContent = randomBreakQuote;
    }
}
function updateDisplay() {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    minutesDisplay.textContent = String(mins).padStart(2, '0');
    secondsDisplay.textContent = String(secs).padStart(2, '0');
}

function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be 12

    const timeString = `${hours}:${String(minutes).padStart(2, '0')}`;
    currentTimeDisplay.textContent = timeString;
    currentPeriodDisplay.textContent = ampm;
}

function startTimer() {
    if (isRunning) {
        pauseTimer();
        return;
    }
    startQuoteRotation();
    isRunning = true;
    startBtn.textContent = 'Pause';
    watcher.classList.add('active');

    timerInterval = setInterval(() => {
        if (totalSeconds > 0) {
            totalSeconds--;
            updateDisplay();
        } else {
            completeSession();
        }
    }, 1000);
}

function pauseTimer() {
    isRunning = false;
    clearInterval(quoteInterval);
    startBtn.textContent = 'Start';
    watcher.classList.remove('active');
    clearInterval(timerInterval);
}

function resetTimer() {
    pauseTimer();
    clearInterval(quoteInterval);
    isWorkTime = true;
    totalSeconds = workMinutes * 60;
    updateDisplay();
    motivationDisplay.textContent = "You're building momentum — don't stop now!";
}

function completeSession() {
    clearInterval(timerInterval);
    isRunning = false;
    startBtn.textContent = 'Start';
    watcher.classList.remove('active');

    // Play notification sound
    playNotificationSound();

    if (isWorkTime) {
        // Random break quote
        const randomBreakQuote = breakQuotes[Math.floor(Math.random() * breakQuotes.length)];
        motivationDisplay.textContent = randomBreakQuote;

        isWorkTime = false;
        totalSeconds = breakMinutes * 60;

        // Increment session counter after a work session is completed
        pomodoroCount++;
        document.getElementById('sessionCount').textContent = pomodoroCount;

    } else {
        // Random work quote
        const randomWorkQuote = workQuotes[Math.floor(Math.random() * workQuotes.length)];
        motivationDisplay.textContent = randomWorkQuote;

        isWorkTime = true;
        totalSeconds = workMinutes * 60;
    }

    updateDisplay();

    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Pomodoro Timer', {
            body: isWorkTime ? 'Time to work!' : 'Time for a break!',
            icon: '⏱️'
        });
    }
}
   
function playNotificationSound() {
    try {
        // Reset and play the audio
        notificationSound.currentTime = 0;
        notificationSound.play().catch(error => {
            console.error('Error playing notification sound:', error);
        });
        console.log('Notification sound played');
    } catch (error) {
        console.error('Error playing notification sound:', error);
    }
}

function toggleRainSound() {
    if (isRainPlaying) {
        rainSound.pause();
        rainSound.currentTime = 0;
        rainToggle.classList.remove('active');
        isRainPlaying = false;
    } else {
        rainSound.play().catch(error => {
            console.error('Error playing rain sound:', error);
        });
        rainToggle.classList.add('active');
        isRainPlaying = true;
    }
}

function openSettings() {
    workTimeInput.value = workMinutes;
    breakTimeInput.value = breakMinutes;
    settingsModal.classList.add('active');
}

function closeSettings() {
    settingsModal.classList.remove('active');
}

function saveSettings() {
    workMinutes = parseInt(workTimeInput.value) || 25;
    breakMinutes = parseInt(breakTimeInput.value) || 5;
    resetTimer();
    closeSettings();
}

startBtn.addEventListener('click', startTimer);
resetBtn.addEventListener('click', resetTimer);
settingsBtn.addEventListener('click', openSettings);
saveBtn.addEventListener('click', saveSettings);
cancelBtn.addEventListener('click', closeSettings);
rainToggle.addEventListener('click', toggleRainSound);

if ('Notification' in window) {
    Notification.requestPermission();
}

// Update clock immediately and then every second
updateClock();
setInterval(updateClock, 1000);

updateDisplay();
const sunToggle = document.getElementById('sunToggle');
let isSunny = false;

function toggleSunnyMode() {
    if (isSunny) {
        // Revert to default background (rain mode or original)
        document.body.style.background = "url('background.png') center/cover no-repeat fixed";
        sunToggle.classList.remove('active');
        isSunny = false;
    } else {
        // Set sunny background
        document.body.style.background = "url('sunny.jpeg') center/cover no-repeat fixed";
        sunToggle.classList.add('active');
        if(isRainPlaying)toggleRainSound();
        // If rain is on, keep it optional or pause rain
        // rainSound.pause(); 
        // rainToggle.classList.remove('active');
        // isRainPlaying = false;

        isSunny = true;
    }
}

sunToggle.addEventListener('click', toggleSunnyMode);
const notesToggle = document.getElementById('notesToggle');
const notesModal = document.getElementById('notesModal');
const closeNotes = document.getElementById('closeNotes');
const notesHeader = document.getElementById('notesHeader');

notesToggle.addEventListener('click', () => {
    notesModal.style.display = notesModal.style.display === 'flex' ? 'none' : 'flex';
});

closeNotes.addEventListener('click', () => {
    notesModal.style.display = 'none';
});

// Drag functionality
let isDragging = false;
let offsetX = 0;
let offsetY = 0;

notesHeader.addEventListener('pointerdown', (e) => {
    // If close button clicked, don't drag
    if (e.target.closest('#closeNotes')) return;

    isDragging = true;
    offsetX = e.clientX - notesModal.offsetLeft;
    offsetY = e.clientY - notesModal.offsetTop;
});

document.addEventListener('pointermove', (e) => {
    if (!isDragging) return;

    notesModal.style.left = `${e.clientX - offsetX}px`;
    notesModal.style.top = `${e.clientY - offsetY}px`;
});

document.addEventListener('pointerup', () => {
    isDragging = false;
});
const notesTextarea = document.getElementById('notesTextarea');

// Load saved notes on page load
notesTextarea.value = localStorage.getItem('pomodoroNotes') || '';

// Save notes in localStorage as user types
notesTextarea.addEventListener('input', () => {
    localStorage.setItem('pomodoroNotes', notesTextarea.value);
});

// Add Download button
const downloadBtn = document.createElement('button');
downloadBtn.textContent = 'Download';
downloadBtn.style.marginTop = '5px';
downloadBtn.style.padding = '5px 10px';
downloadBtn.style.border = 'none';
downloadBtn.style.borderRadius = '5px';
downloadBtn.style.background ='#7d166cff';
downloadBtn.style.color = 'white';
downloadBtn.style.cursor = 'pointer';
notesModal.appendChild(downloadBtn);

downloadBtn.addEventListener('click', () => {
    const blob = new Blob([notesTextarea.value], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Pomodoro_Notes.txt';
    a.click();
    URL.revokeObjectURL(url);
});