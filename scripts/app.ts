// Hackathon #1

// Memory Match Game  🎮✨

interface MemorySet {
    name: string;
    mood: string;
    funFact: string;
}

interface RandomUserResponse {
    results: Array<{
        name: { first: string; last: string; };
        dob: { age: number; };
        location: { city: string; };
    }>;
}

interface GameStats {
    totalGames: number;
    currentStreak: number;
    bestTime: number;
}

// DOM Elements
const gameBoard = document.querySelector<HTMLDivElement>('.game-board')!;
const addButton = document.querySelector<HTMLButtonElement>('#add-entry-btn')!;
const nameInput = document.querySelector<HTMLInputElement>('#name-input')!;
const funFactInput = document.querySelector<HTMLInputElement>('#funfact-input')!;
const moodSelect = document.querySelector<HTMLSelectElement>('#mood-select')!;
const startButton = document.querySelector<HTMLButtonElement>('#start-btn')!;
const newGameButton = document.querySelector<HTMLButtonElement>('#new-game-btn')!;
const restartButton = document.querySelector<HTMLButtonElement>('#restart-btn')!;
const pauseButton = document.querySelector<HTMLButtonElement>('#pause-btn')!;
const loadSampleButton = document.querySelector<HTMLButtonElement>('#load-sample-btn')!;
const fetchRandomButton = document.querySelector<HTMLButtonElement>('#fetch-random-btn')!;
const clearDataButton = document.querySelector<HTMLButtonElement>('#clear-data-btn')!;
const timerDisplay = document.querySelector<HTMLSpanElement>('#timer')!;
const scoreDisplay = document.querySelector<HTMLSpanElement>('#score')!;
const highScoreDisplay = document.querySelector<HTMLSpanElement>('#high-score')!;
const entriesNumber = document.querySelector<HTMLElement>('#entries-number')!;
const totalGamesDisplay = document.querySelector<HTMLElement>('#total-games')!;
const currentStreakDisplay = document.querySelector<HTMLElement>('#current-streak')!;
const starRatingDisplay = document.querySelector<HTMLElement>('#star-rating')!;
const comboDisplay = document.querySelector<HTMLElement>('#combo-display')!;
const comboCount = document.querySelector<HTMLElement>('#combo-count')!;
const achievementPopup = document.querySelector<HTMLElement>('#achievement-popup')!;
const particlesContainer = document.querySelector<HTMLElement>('#particles-container')!;

// Sample Data
const sampleData: MemorySet[] = [
    { name: "Alice", mood: "😊 Happy", funFact: "Loves painting" },
    { name: "Bob", mood: "😢 Sad", funFact: "Can solve a Rubik's cube" },
    { name: "Charlie", mood: "🎉 Excited", funFact: "Speaks 3 languages" },
    { name: "Diana", mood: "😴 Bored", funFact: "Collects vintage postcards" },
    { name: "Ethan", mood: "😲 Surprised", funFact: "Has a twin" },
    { name: "Fiona", mood: "😊 Happy", funFact: "Loves hiking" }
];

const moods = ["😊 Happy", "😢 Sad", "🎉 Excited", "😴 Bored", "😠 Angry", "😲 Surprised"];

// Storage Keys
const STORAGE_KEY = 'memoryMatchEntries';
const HIGH_SCORE_KEY = 'memoryMatchHighScore';
const STATS_KEY = 'memoryMatchStats';

// Game State
let memorySets: MemorySet[] = [];
let flippedCards: HTMLElement[] = [];
let timer: number | undefined = undefined;
let seconds = 0;
let matchedSets = 0;
let isChecking = false;
let isPaused = false;
let isGameActive = false;
let comboCounter = 0;
let consecutiveMatches = 0;
let currentTheme = 'space';

// Theme Colors
const themes: Record<string, string> = {
    space: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    ocean: 'linear-gradient(135deg, #0093E9 0%, #80D0C7 100%)',
    forest: 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)'
};

// Initialize Theme
document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const theme = btn.getAttribute('data-theme')!;
        changeTheme(theme);
    });
});

function changeTheme(theme: string) {
    currentTheme = theme;
    document.body.style.background = themes[theme];
    
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-theme="${theme}"]`)?.classList.add('active');
}

// Utility Functions
function shuffleArray<T>(array: T[]): T[] {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

// Storage Functions
function saveToLocalStorage() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(memorySets));
        console.log('✅ Data saved');
    } catch (error) {
        console.error('Error:', error);
    }
}

function loadFromLocalStorage() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            memorySets = JSON.parse(saved);
            updateEntriesCount();
            console.log('✅ Data loaded');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function saveHighScore(time: number): boolean {
    try {
        const current = localStorage.getItem(HIGH_SCORE_KEY);
        if (!current || time < parseInt(current)) {
            localStorage.setItem(HIGH_SCORE_KEY, time.toString());
            highScoreDisplay.textContent = `${time}s`;
            console.log(`🏆 New record: ${time}s`);
            return true;
        }
        return false;
    } catch (error) {
        return false;
    }
}

function loadHighScore() {
    try {
        const score = localStorage.getItem(HIGH_SCORE_KEY);
        if (score) {
            highScoreDisplay.textContent = `${score}s`;
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function loadStats(): GameStats {
    try {
        const saved = localStorage.getItem(STATS_KEY);
        return saved ? JSON.parse(saved) : { totalGames: 0, currentStreak: 0, bestTime: 0 };
    } catch {
        return { totalGames: 0, currentStreak: 0, bestTime: 0 };
    }
}

function saveStats(stats: GameStats) {
    try {
        localStorage.setItem(STATS_KEY, JSON.stringify(stats));
        updateStatsDisplay(stats);
    } catch (error) {
        console.error('Error:', error);
    }
}

function updateStatsDisplay(stats: GameStats) {
    totalGamesDisplay.textContent = stats.totalGames.toString();
    currentStreakDisplay.textContent = stats.currentStreak.toString();
}

// Fetch Random Players
function fetchRandomPlayers() {
    fetchRandomButton.disabled = true;
    fetchRandomButton.textContent = '⏳ Fetching...';
    
    fetch('https://randomuser.me/api/?results=5&nat=us')
        .then(response => {
            if (!response.ok) throw new Error('Network error');
            return response.json();
        })
        .then((data: RandomUserResponse) => {
            const newPlayers: MemorySet[] = data.results.map(user => ({
                name: `${user.name.first} ${user.name.last}`,
                mood: moods[Math.floor(Math.random() * moods.length)],
                funFact: `${user.dob.age} years old from ${user.location.city}`
            }));
            
            if (memorySets.length > 0) {
                if (!confirm(`Replace ${memorySets.length} entries with 5 random players?`)) {
                    fetchRandomButton.disabled = false;
                    fetchRandomButton.textContent = '🌐 Fetch Random';
                    return;
                }
            }
            
            memorySets = newPlayers;
            saveToLocalStorage();
            updateEntriesCount();
            alert(`🎉 Fetched ${newPlayers.length} random players!`);
            
            fetchRandomButton.disabled = false;
            fetchRandomButton.textContent = '🌐 Fetch Random';
        })
        .catch(error => {
            console.error('Error:', error);
            alert('❌ Failed to fetch. Check your connection.');
            
            fetchRandomButton.disabled = false;
            fetchRandomButton.textContent = '🌐 Fetch Random';
        });
}

// Particle Effects
function createParticles(x: number, y: number) {
    const colors = ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f7931e'];
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.transform = `translate(${(Math.random() - 0.5) * 100}px, ${(Math.random() - 0.5) * 100}px)`;
        particlesContainer.appendChild(particle);
        
        setTimeout(() => particle.remove(), 1000);
    }
}

// Achievement System
function showAchievement(text: string) {
    const achievementText = achievementPopup.querySelector('.achievement-text')!;
    achievementText.textContent = text;
    achievementPopup.classList.remove('achievement-hidden');
    
    setTimeout(() => {
        achievementPopup.classList.add('achievement-hidden');
    }, 3000);
}

// Combo System
function updateCombo(isMatch: boolean) {
    if (isMatch) {
        consecutiveMatches++;
        if (consecutiveMatches >= 2) {
            comboCounter = consecutiveMatches;
            comboCount.textContent = comboCounter.toString();
            comboDisplay.classList.remove('combo-hidden');
            
            if (consecutiveMatches === 3) {
                showAchievement('🔥 TRIPLE COMBO!');
            } else if (consecutiveMatches === 5) {
                showAchievement('⚡ MEGA COMBO!');
            }
        }
    } else {
        consecutiveMatches = 0;
        comboDisplay.classList.add('combo-hidden');
    }
}

// Star Rating
function calculateStarRating(time: number, totalSets: number): string {
    const avgTimePerSet = time / totalSets;
    if (avgTimePerSet <= 5) return '⭐⭐⭐';
    if (avgTimePerSet <= 10) return '⭐⭐☆';
    return '⭐☆☆';
}

function updateEntriesCount() {
    entriesNumber.textContent = memorySets.length.toString();
}

function toggleGameControls(gameStarted: boolean) {
    if (gameStarted) {
        startButton.style.display = 'none';
        newGameButton.style.display = 'inline-block';
        restartButton.style.display = 'inline-block';
        pauseButton.style.display = 'inline-block';
    } else {
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

    const cards: HTMLElement[] = [];

    memorySets.forEach((set, index) => {
        const nameCard = document.createElement('div');
        nameCard.classList.add('card');
        nameCard.dataset.type = 'name';
        nameCard.dataset.index = index.toString();
        nameCard.dataset.content = set.name;
        cards.push(nameCard);

        const moodCard = document.createElement('div');
        moodCard.classList.add('card');
        moodCard.dataset.type = 'mood';
        moodCard.dataset.index = index.toString();
        moodCard.dataset.content = set.mood;
        cards.push(moodCard);

        const factCard = document.createElement('div');
        factCard.classList.add('card');
        factCard.dataset.type = 'funFact';
        factCard.dataset.index = index.toString();
        factCard.dataset.content = set.funFact;
        cards.push(factCard);
    });

    const shuffled = shuffleArray(cards);

    shuffled.forEach(card => {
        gameBoard.appendChild(card);
        card.addEventListener('click', () => handleCardClick(card));
    });

    timer = setInterval(() => {
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
    } else {
        pauseButton.textContent = '⏸️ Pause';
        gameBoard.classList.remove('paused');
    }
}

function handleCardClick(card: HTMLElement) {
    if (isPaused || isChecking || !isGameActive) return;
    if (card.classList.contains('matched')) return;
    if (flippedCards.indexOf(card) !== -1 || flippedCards.length >= 3) return;

    card.classList.add('flipped');
    card.textContent = card.dataset.content || '';
    flippedCards.push(card);

    if (flippedCards.length === 3) {
        isChecking = true;
        
        const indices = flippedCards.map(c => c.dataset.index);
        const types = flippedCards.map(c => c.dataset.type);

        const allSameSet = indices.every(idx => idx === indices[0]);
        const allDifferentTypes = types.indexOf('name') !== -1 && 
                                   types.indexOf('mood') !== -1 && 
                                   types.indexOf('funFact') !== -1;

        if (allSameSet && allDifferentTypes) {
            flippedCards.forEach(c => {
                c.classList.add('matched');
                const rect = c.getBoundingClientRect();
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
                
                setTimeout(() => {
                    const stars = calculateStarRating(seconds, memorySets.length);
                    starRatingDisplay.textContent = stars;
                    
                    const isNewRecord = saveHighScore(seconds);
                    
                    const stats = loadStats();
                    stats.totalGames++;
                    stats.currentStreak++;
                    if (!stats.bestTime || seconds < stats.bestTime) {
                        stats.bestTime = seconds;
                    }
                    saveStats(stats);
                    
                    let message = `🎉 YOU WON! 🎉\n\n⏱️ Time: ${seconds}s\n${stars} Rating!`;
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
        } else {
            updateCombo(false);
            setTimeout(() => {
                flippedCards.forEach(c => {
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
    const name = nameInput.value.trim();
    const mood = moodSelect.value;
    const funFact = funFactInput.value.trim();

    if (!name || !mood || !funFact) {
        alert('⚠️ Fill all fields!');
        return;
    }

    memorySets.push({ name, mood, funFact });
    saveToLocalStorage();

    nameInput.value = '';
    funFactInput.value = '';
    moodSelect.value = '';

    updateEntriesCount();
    nameInput.focus();
}

function loadSampleData() {
    if (memorySets.length > 0) {
        if (!confirm('⚠️ Replace current entries?')) return;
    }
    
    memorySets = [...sampleData];
    saveToLocalStorage();
    updateEntriesCount();
    alert(`✅ Loaded ${memorySets.length} sample players!`);
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

nameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addMemorySet();
});

funFactInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addMemorySet();
});

// Initialize
function initialize() {
    console.log('🎮 Memory Match - Ultimate Edition');
    loadFromLocalStorage();
    loadHighScore();
    const stats = loadStats();
    updateStatsDisplay(stats);
    console.log('✅ Ready!');
}

initialize();