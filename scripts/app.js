// Memory Match Game - ULTIMATE EDITION! 🎮✨
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
// DOM Elements
var gameBoard = document.querySelector('.game-board');
var addButton = document.querySelector('#add-entry-btn');
var nameInput = document.querySelector('#name-input');
var funFactInput = document.querySelector('#funfact-input');
var moodSelect = document.querySelector('#mood-select');
var startButton = document.querySelector('#start-btn');
var newGameButton = document.querySelector('#new-game-btn');
var restartButton = document.querySelector('#restart-btn');
var pauseButton = document.querySelector('#pause-btn');
var loadSampleButton = document.querySelector('#load-sample-btn');
var fetchRandomButton = document.querySelector('#fetch-random-btn');
var clearDataButton = document.querySelector('#clear-data-btn');
var timerDisplay = document.querySelector('#timer');
var scoreDisplay = document.querySelector('#score');
var highScoreDisplay = document.querySelector('#high-score');
var entriesNumber = document.querySelector('#entries-number');
var totalGamesDisplay = document.querySelector('#total-games');
var currentStreakDisplay = document.querySelector('#current-streak');
var starRatingDisplay = document.querySelector('#star-rating');
var comboDisplay = document.querySelector('#combo-display');
var comboCount = document.querySelector('#combo-count');
var achievementPopup = document.querySelector('#achievement-popup');
var particlesContainer = document.querySelector('#particles-container');
// Sample Data
var sampleData = [
    { name: "Alice", mood: "😊 Happy", funFact: "Loves painting" },
    { name: "Bob", mood: "😢 Sad", funFact: "Can solve a Rubik's cube" },
    { name: "Charlie", mood: "🎉 Excited", funFact: "Speaks 3 languages" },
    { name: "Diana", mood: "😴 Bored", funFact: "Collects vintage postcards" },
    { name: "Ethan", mood: "😲 Surprised", funFact: "Has a twin" },
    { name: "Fiona", mood: "😊 Happy", funFact: "Loves hiking" }
];
var moods = ["😊 Happy", "😢 Sad", "🎉 Excited", "😴 Bored", "😠 Angry", "😲 Surprised"];
// Storage Keys
var STORAGE_KEY = 'memoryMatchEntries';
var HIGH_SCORE_KEY = 'memoryMatchHighScore';
var STATS_KEY = 'memoryMatchStats';
// Game State
var memorySets = [];
var flippedCards = [];
var timer = undefined;
var seconds = 0;
var matchedSets = 0;
var isChecking = false;
var isPaused = false;
var isGameActive = false;
var comboCounter = 0;
var consecutiveMatches = 0;
var currentTheme = 'space';
// Theme Colors
var themes = {
    space: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    ocean: 'linear-gradient(135deg, #0093E9 0%, #80D0C7 100%)',
    forest: 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)'
};
// Initialize Theme
document.querySelectorAll('.theme-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
        var theme = btn.getAttribute('data-theme');
        changeTheme(theme);
    });
});
function changeTheme(theme) {
    var _a;
    currentTheme = theme;
    document.body.style.background = themes[theme];
    document.querySelectorAll('.theme-btn').forEach(function (btn) {
        btn.classList.remove('active');
    });
    (_a = document.querySelector("[data-theme=\"".concat(theme, "\"]"))) === null || _a === void 0 ? void 0 : _a.classList.add('active');
}
// Utility Functions
function shuffleArray(array) {
    var _a;
    var copy = __spreadArray([], array, true);
    for (var i = copy.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        _a = [copy[j], copy[i]], copy[i] = _a[0], copy[j] = _a[1];
    }
    return copy;
}
// Storage Functions
function saveToLocalStorage() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(memorySets));
        console.log('✅ Data saved');
    }
    catch (error) {
        console.error('Error:', error);
    }
}
function loadFromLocalStorage() {
    try {
        var saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            memorySets = JSON.parse(saved);
            updateEntriesCount();
            console.log('✅ Data loaded');
        }
    }
    catch (error) {
        console.error('Error:', error);
    }
}
function saveHighScore(time) {
    try {
        var current = localStorage.getItem(HIGH_SCORE_KEY);
        if (!current || time < parseInt(current)) {
            localStorage.setItem(HIGH_SCORE_KEY, time.toString());
            highScoreDisplay.textContent = "".concat(time, "s");
            console.log("\uD83C\uDFC6 New record: ".concat(time, "s"));
            return true;
        }
        return false;
    }
    catch (error) {
        return false;
    }
}
function loadHighScore() {
    try {
        var score = localStorage.getItem(HIGH_SCORE_KEY);
        if (score) {
            highScoreDisplay.textContent = "".concat(score, "s");
        }
    }
    catch (error) {
        console.error('Error:', error);
    }
}
function loadStats() {
    try {
        var saved = localStorage.getItem(STATS_KEY);
        return saved ? JSON.parse(saved) : { totalGames: 0, currentStreak: 0, bestTime: 0 };
    }
    catch (_a) {
        return { totalGames: 0, currentStreak: 0, bestTime: 0 };
    }
}
function saveStats(stats) {
    try {
        localStorage.setItem(STATS_KEY, JSON.stringify(stats));
        updateStatsDisplay(stats);
    }
    catch (error) {
        console.error('Error:', error);
    }
}
function updateStatsDisplay(stats) {
    totalGamesDisplay.textContent = stats.totalGames.toString();
    currentStreakDisplay.textContent = stats.currentStreak.toString();
}
// Fetch Random Players
function fetchRandomPlayers() {
    fetchRandomButton.disabled = true;
    fetchRandomButton.textContent = '⏳ Fetching...';
    fetch('https://randomuser.me/api/?results=5&nat=us')
        .then(function (response) {
        if (!response.ok)
            throw new Error('Network error');
        return response.json();
    })
        .then(function (data) {
        var newPlayers = data.results.map(function (user) { return ({
            name: "".concat(user.name.first, " ").concat(user.name.last),
            mood: moods[Math.floor(Math.random() * moods.length)],
            funFact: "".concat(user.dob.age, " years old from ").concat(user.location.city)
        }); });
        if (memorySets.length > 0) {
            if (!confirm("Replace ".concat(memorySets.length, " entries with 5 random players?"))) {
                fetchRandomButton.disabled = false;
                fetchRandomButton.textContent = '🌐 Fetch Random';
                return;
            }
        }
        memorySets = newPlayers;
        saveToLocalStorage();
        updateEntriesCount();
        alert("\uD83C\uDF89 Fetched ".concat(newPlayers.length, " random players!"));
        fetchRandomButton.disabled = false;
        fetchRandomButton.textContent = '🌐 Fetch Random';
    })
        .catch(function (error) {
        console.error('Error:', error);
        alert('❌ Failed to fetch. Check your connection.');
        fetchRandomButton.disabled = false;
        fetchRandomButton.textContent = '🌐 Fetch Random';
    });
}
// Particle Effects
function createParticles(x, y) {
    var colors = ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f7931e'];
    var _loop_1 = function (i) {
        var particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = "".concat(x, "px");
        particle.style.top = "".concat(y, "px");
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.transform = "translate(".concat((Math.random() - 0.5) * 100, "px, ").concat((Math.random() - 0.5) * 100, "px)");
        particlesContainer.appendChild(particle);
        setTimeout(function () { return particle.remove(); }, 1000);
    };
    for (var i = 0; i < 15; i++) {
        _loop_1(i);
    }
}
// Achievement System
function showAchievement(text) {
    var achievementText = achievementPopup.querySelector('.achievement-text');
    achievementText.textContent = text;
    achievementPopup.classList.remove('achievement-hidden');
    setTimeout(function () {
        achievementPopup.classList.add('achievement-hidden');
    }, 3000);
}
// Combo System
function updateCombo(isMatch) {
    if (isMatch) {
        consecutiveMatches++;
        if (consecutiveMatches >= 2) {
            comboCounter = consecutiveMatches;
            comboCount.textContent = comboCounter.toString();
            comboDisplay.classList.remove('combo-hidden');
            if (consecutiveMatches === 3) {
                showAchievement('🔥 TRIPLE COMBO!');
            }
            else if (consecutiveMatches === 5) {
                showAchievement('⚡ MEGA COMBO!');
            }
        }
    }
    else {
        consecutiveMatches = 0;
        comboDisplay.classList.add('combo-hidden');
    }
}
// Star Rating
function calculateStarRating(time, totalSets) {
    var avgTimePerSet = time / totalSets;
    if (avgTimePerSet <= 5)
        return '⭐⭐⭐';
    if (avgTimePerSet <= 10)
        return '⭐⭐☆';
    return '⭐☆☆';
}
function updateEntriesCount() {
    entriesNumber.textContent = memorySets.length.toString();
}
function toggleGameControls(gameStarted) {
    if (gameStarted) {
        startButton.style.display = 'none';
        newGameButton.style.display = 'inline-block';
        restartButton.style.display = 'inline-block';
        pauseButton.style.display = 'inline-block';
    }
    else {
        startButton.style.display = 'inline-block';
        newGameButton.style.display = 'none';
        restartButton.style.display = 'none';
        pauseButton.style.display = 'none';
    }
}
function startGame() {
    if (memorySets.length === 0) {
        alert('⚠️ Add entries, load sample, or fetch random players!');
        return;
    }
    gameBoard.innerHTML = '';
    flippedCards = [];
    seconds = 0;
    matchedSets = 0;
    consecutiveMatches = 0;
    comboCounter = 0;
    isChecking = false;
    isPaused = false;
    isGameActive = true;
    clearInterval(timer);
    timerDisplay.textContent = '0';
    scoreDisplay.textContent = '0';
    pauseButton.textContent = '⏸️ Pause';
    gameBoard.classList.remove('paused');
    comboDisplay.classList.add('combo-hidden');
    toggleGameControls(true);
    var cards = [];
    memorySets.forEach(function (set, index) {
        var nameCard = document.createElement('div');
        nameCard.classList.add('card');
        nameCard.dataset.type = 'name';
        nameCard.dataset.index = index.toString();
        nameCard.dataset.content = set.name;
        cards.push(nameCard);
        var moodCard = document.createElement('div');
        moodCard.classList.add('card');
        moodCard.dataset.type = 'mood';
        moodCard.dataset.index = index.toString();
        moodCard.dataset.content = set.mood;
        cards.push(moodCard);
        var factCard = document.createElement('div');
        factCard.classList.add('card');
        factCard.dataset.type = 'funFact';
        factCard.dataset.index = index.toString();
        factCard.dataset.content = set.funFact;
        cards.push(factCard);
    });
    var shuffled = shuffleArray(cards);
    shuffled.forEach(function (card) {
        gameBoard.appendChild(card);
        card.addEventListener('click', function () { return handleCardClick(card); });
    });
    timer = setInterval(function () {
        if (!isPaused) {
            seconds++;
            timerDisplay.textContent = seconds.toString();
        }
    }, 1000);
    console.log('🎮 Game started!');
}
function newGame() {
    if (confirm('🆕 Start a new game? (Current progress will be lost)')) {
        startGame();
        showAchievement('✨ NEW GAME STARTED!');
    }
}
function restartGame() {
    if (confirm('🔄 Restart current game?')) {
        startGame();
    }
}
function togglePause() {
    isPaused = !isPaused;
    if (isPaused) {
        pauseButton.textContent = '▶️ Resume';
        gameBoard.classList.add('paused');
    }
    else {
        pauseButton.textContent = '⏸️ Pause';
        gameBoard.classList.remove('paused');
    }
}
function handleCardClick(card) {
    if (isPaused || isChecking || !isGameActive)
        return;
    if (card.classList.contains('matched'))
        return;
    if (flippedCards.indexOf(card) !== -1 || flippedCards.length >= 3)
        return;
    card.classList.add('flipped');
    card.textContent = card.dataset.content || '';
    flippedCards.push(card);
    if (flippedCards.length === 3) {
        isChecking = true;
        var indices_1 = flippedCards.map(function (c) { return c.dataset.index; });
        var types = flippedCards.map(function (c) { return c.dataset.type; });
        var allSameSet = indices_1.every(function (idx) { return idx === indices_1[0]; });
        var allDifferentTypes = types.indexOf('name') !== -1 &&
            types.indexOf('mood') !== -1 &&
            types.indexOf('funFact') !== -1;
        if (allSameSet && allDifferentTypes) {
            flippedCards.forEach(function (c) {
                c.classList.add('matched');
                var rect = c.getBoundingClientRect();
                createParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
            });
            matchedSets++;
            scoreDisplay.textContent = matchedSets.toString();
            updateCombo(true);
            flippedCards = [];
            isChecking = false;
            if (matchedSets === memorySets.length) {
                clearInterval(timer);
                isGameActive = false;
                setTimeout(function () {
                    var stars = calculateStarRating(seconds, memorySets.length);
                    starRatingDisplay.textContent = stars;
                    var isNewRecord = saveHighScore(seconds);
                    var stats = loadStats();
                    stats.totalGames++;
                    stats.currentStreak++;
                    if (!stats.bestTime || seconds < stats.bestTime) {
                        stats.bestTime = seconds;
                    }
                    saveStats(stats);
                    var message = "\uD83C\uDF89 YOU WON! \uD83C\uDF89\n\n\u23F1\uFE0F Time: ".concat(seconds, "s\n").concat(stars, " Rating!");
                    if (isNewRecord) {
                        message += '\n\n🏆 NEW RECORD! 🏆';
                        showAchievement('🏆 NEW RECORD!');
                    }
                    if (consecutiveMatches >= 3) {
                        message += '\n🔥 Amazing combos!';
                    }
                    alert(message);
                    toggleGameControls(false);
                }, 500);
            }
        }
        else {
            updateCombo(false);
            setTimeout(function () {
                flippedCards.forEach(function (c) {
                    c.classList.remove('flipped');
                    c.textContent = '';
                });
                flippedCards = [];
                isChecking = false;
            }, 1500);
        }
    }
}
function addMemorySet() {
    var name = nameInput.value.trim();
    var mood = moodSelect.value;
    var funFact = funFactInput.value.trim();
    if (!name || !mood || !funFact) {
        alert('⚠️ Fill all fields!');
        return;
    }
    memorySets.push({ name: name, mood: mood, funFact: funFact });
    saveToLocalStorage();
    nameInput.value = '';
    funFactInput.value = '';
    moodSelect.value = '';
    updateEntriesCount();
    nameInput.focus();
}
function loadSampleData() {
    if (memorySets.length > 0) {
        if (!confirm('⚠️ Replace current entries?'))
            return;
    }
    memorySets = __spreadArray([], sampleData, true);
    saveToLocalStorage();
    updateEntriesCount();
    alert("\u2705 Loaded ".concat(memorySets.length, " sample players!"));
}
function clearAllData() {
    if (confirm('⚠️ Clear ALL data? Cannot be undone!')) {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(HIGH_SCORE_KEY);
        localStorage.removeItem(STATS_KEY);
        memorySets = [];
        updateEntriesCount();
        highScoreDisplay.textContent = '--';
        totalGamesDisplay.textContent = '0';
        currentStreakDisplay.textContent = '0';
        starRatingDisplay.textContent = '☆☆☆';
        alert('🗑️ All data cleared!');
    }
}
// Event Listeners
addButton.addEventListener('click', addMemorySet);
startButton.addEventListener('click', startGame);
newGameButton.addEventListener('click', newGame);
restartButton.addEventListener('click', restartGame);
pauseButton.addEventListener('click', togglePause);
loadSampleButton.addEventListener('click', loadSampleData);
fetchRandomButton.addEventListener('click', fetchRandomPlayers);
clearDataButton.addEventListener('click', clearAllData);
nameInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter')
        addMemorySet();
});
funFactInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter')
        addMemorySet();
});
// Initialize
function initialize() {
    console.log('🎮 Memory Match - Ultimate Edition');
    loadFromLocalStorage();
    loadHighScore();
    var stats = loadStats();
    updateStatsDisplay(stats);
    console.log('✅ Ready!');
}
initialize();
