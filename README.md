# 🎮 Memory Match Game

A fun and addictive 3-card matching game with stunning visuals, achievement system, and endless replayability!

## 📝 Short Description

Memory Match Game is an innovative twist on the classic memory game where players match three cards (name, mood, and fun fact) for each person. Built with TypeScript and featuring beautiful themes, particle effects, combo systems, and achievement tracking, this game offers a modern, engaging experience with real-time API integration for dynamic content.

## 🛠️ Tech Stack

### Core Technologies
- **TypeScript** - Type-safe development and compilation
- **HTML5** - Semantic markup and structure
- **CSS3** - Advanced animations, gradients, and 3D transforms
- **JavaScript (ES6+)** - Async/await, Fetch API, DOM manipulation

### APIs & Storage
- **Random User API** (`https://randomuser.me/api/`) - Fetches real random user data
- **LocalStorage API** - Persistent data storage for game state and statistics

### Development Tools
- **TypeScript Compiler** - Transpiles `.ts` to `.js`
- **Modern Browser** - Chrome, Firefox, Safari, or Edge

## 🚀 How to Run the Project

### Prerequisites
- A modern web browser
- TypeScript compiler (only for development/editing)

### Installation Steps

1. **Clone the repository**
```bash
git clone https://github.com/betelhem24/Memory-Match-Game.git
cd Memory-Match-Game
```

2. **Open the game**
```bash
# Simply open index.html in your browser
# No build process required for playing!
```

### For Development (If You Want to Edit TypeScript)

1. **Install TypeScript globally**
```bash
npm install -g typescript
```

2. **Compile TypeScript**
```bash
# Single compilation
tsc

# Or watch mode for auto-compilation
tsc --watch
```

3. **Optional: Run with local server**
```bash
# Using Python
python -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server

# Then visit: http://localhost:8000
```

### Environment Variables
No environment variables or config files required! The game works out of the box.

### Project Structure
```
memory-match/
├── index.html              # Main HTML file (open this!)
├── README.md               # This file
├── tsconfig.json           # TypeScript configuration
├── style/
│   └── style.css          # All styling and animations
├── scripts/
│   ├── app.ts             # TypeScript source code
│   └── app.js             # Compiled JavaScript
└── data/
    └── moods.json         # Sample data (optional)
```

## ✨ Main Features

### Core Gameplay Features
- **3-Card Matching System** - Match name + mood + fun fact for each person
- **Dynamic Card Generation** - Each game is unique with shuffled cards
- **Visual Color Coding** - Blue (names), Purple (moods), Orange (fun facts)
- **Pause/Resume Functionality** - Take breaks without losing progress
- **Timer & Star Rating** - Get 1-3 stars based on completion speed

### Visual & Theme Features
- **3 Beautiful Themes** - Switch between Space 🚀, Ocean 🌊, and Forest 🌲 backgrounds
- **3D Card Animations** - Smooth, professional card flip effects
- **Particle Effects** - Satisfying visual explosions on successful matches
- **Animated Background** - Floating shapes with smooth animations
- **Combo Display** - Real-time combo counter with fire animations

### Progression & Statistics
- **Achievement System** - Unlock achievements for special accomplishments (Triple Combo, Mega Combo, New Record, Perfect Game)
- **Combo System** - Chain consecutive matches for epic combo multipliers
- **Stats Tracking** - Track total games played, current streak, and best times
- **High Score System** - Personal record tracking with persistent storage

### Data Management Features
- **Manual Entry** - Add custom players with name, mood, and fun fact
- **Sample Data** - Quick start with 6 pre-made entries
- **Fetch Random Players** - Get 5 real random users from API
- **LocalStorage Auto-Save** - All data persists between sessions
- **Clear Data Option** - Reset everything when needed

### Game Controls
- **Start Game** - Begin a new session
- **New Game** - Fresh start with current entries
- **Restart** - Retry the same game configuration
- **Pause/Resume** - Control game flow
- **Clear Data** - Reset all statistics and data

## 👤 Developer

**Betelhem** - Solo Developer
- GitHub: [@betelhem24](https://github.com/betelhem24)

## 📄 License

MIT License - Feel free to use in your own projects!

---

**Made with ❤️ and lots of ☕ by a solo developer**

*Enjoy the game! Try to beat your high score! 🏆*