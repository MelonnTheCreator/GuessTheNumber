let levelsUnlocked = localStorage.getItem('levelsUnlocked') ? parseInt(localStorage.getItem('levelsUnlocked')) : 1;
let level = 1, rangeEnd = 10, randomNumber = Math.floor(Math.random() * rangeEnd) + 1, attempts = 0, adminMode = false;

const bgMusic = document.getElementById('bg-music'), correctSound = document.getElementById('correct-sound'), wrongSound = document.getElementById('wrong-sound');
bgMusic.play();

const generateLevelButtons = () => {
    const levelButtonsContainer = document.getElementById('level-buttons');
    levelButtonsContainer.innerHTML = '';
    for (let i = 1; i <= 10; i++) {
        const button = document.createElement('button');
        button.innerText = 'Level ' + i;
        button.classList.add('level-button');
        button.disabled = i > levelsUnlocked;
        button.onclick = () => selectLevel(i);
        levelButtonsContainer.appendChild(button);
    }
};

const selectLevel = (selectedLevel) => {
    level = selectedLevel;
    rangeEnd = Math.pow(10, level);
    randomNumber = Math.floor(Math.random() * rangeEnd) + 1;
    document.getElementById('rangeEnd').innerText = rangeEnd;
    document.getElementById('level').innerText = level;
    document.getElementById('adminAnswer').innerText = randomNumber; // Update correct answer in real time
    document.querySelector('.menu-container').classList.remove('active');
    document.querySelector('.game-container').classList.add('active');
};

document.getElementById("guessInput").addEventListener("keypress", (event) => { if (event.key === "Enter") checkGuess(); });

const checkGuess = () => {
    let userGuess = document.getElementById("guessInput").value, result = document.getElementById("result"), lastGuess = document.getElementById("lastGuess");
    lastGuess.innerHTML = `Last Guess: ${userGuess}`;
    attempts++;
    if (userGuess == randomNumber) {
        correctSound.play();
        if (level < 10) {
            levelsUnlocked = Math.max(levelsUnlocked, level + 1);
            localStorage.setItem('levelsUnlocked', levelsUnlocked);
            generateLevelButtons();
            result.innerHTML = `Correct! You have unlocked level ${level + 1}.`;
            result.classList.remove("wrong");
            result.classList.add("correct");
            document.getElementById('adminAnswer').innerText = randomNumber; // Update correct answer in real time
            document.querySelector('.game-container').classList.remove('active');
            document.querySelector('.menu-container').classList.add('active');
        } else {
            result.innerHTML = `Congratulations! You've completed all levels.`;
            resetLevels();
            result.classList.remove("wrong");
            result.classList.add("correct");
        }
        clearInput();
    } else {
        wrongSound.play();
        result.innerHTML = userGuess < randomNumber ? "Too low! Try again." : "Too high! Try again.";
        result.classList.remove("correct");
        result.classList.add("wrong");
        clearInput();
    }
};

const clearInput = () => { document.getElementById("guessInput").value = ''; };

const resetLevels = () => {
    levelsUnlocked = 1;
    localStorage.setItem('levelsUnlocked', levelsUnlocked);
    generateLevelButtons();
    exitAdminMode(); // Exit admin mode on reset
};

const showAdminLogin = () => {
    let password = prompt("Enter admin password:");
    if (password === "Melonn") enterAdminMode();
    else alert("Incorrect password.");
};

const enterAdminMode = () => {
    document.getElementById('adminControls').classList.add('active');
    adminMode = true;
    document.getElementById('adminAnswer').innerText = randomNumber;
};

const exitAdminMode = () => {
    document.getElementById('adminControls').classList.remove('active');
    adminMode = false;
};

const setLevel = () => {
    let newLevel = parseInt(document.getElementById('newLevel').value);
    if (newLevel >= 1 && newLevel <= 10) {
        level = newLevel;
        rangeEnd = Math.pow(10, level);
        randomNumber = Math.floor(Math.random() * rangeEnd) + 1;
        document.getElementById('rangeEnd').innerText = rangeEnd;
        document.getElementById('level').innerText = level;
        document.getElementById('adminAnswer').innerText = randomNumber; // Update correct answer in real time
        alert(`Level set to ${newLevel}.`);
    } else {
        alert("Invalid level. Please enter a level between 1 and 10.");
    }
};

const setCustomAnswer = () => {
    let customAnswer = parseInt(document.getElementById('customAnswer').value);
    if (customAnswer >= 1 && customAnswer <= rangeEnd) {
        randomNumber = customAnswer;
        document.getElementById('adminAnswer').innerText = randomNumber; // Update correct answer in real time
        alert(`Answer set to ${customAnswer}.`);
    } else {
        alert(`Invalid answer. Please enter a number between 1 and ${rangeEnd}.`);
    }
};

generateLevelButtons(); // Initialize level buttons on page load
