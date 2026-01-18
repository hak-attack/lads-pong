# Ping Pong Rankings

A mobile-first table tennis scorekeeping web app built with React, TypeScript, Vite, Tailwind CSS, shadcn/ui, and Firebase.

## Features

- 📊 **Leaderboard** - View player rankings with W-L record, win percentage, Elo rating, and odds
- 🏓 **Match Tracking** - Record wins/losses and view match history
- 👥 **Player Management** - Add players with avatars and manage active status
- 🌓 **Dark Mode** - Light/dark theme toggle with localStorage persistence
- 📱 **Mobile-First** - Optimized for 360px+ mobile devices
- 🔥 **Firebase Integration** - Real-time data sync with Firestore and anonymous authentication

## Tech Stack

- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS** for styling
- **shadcn/ui** components
- **Firebase** (Firestore + Anonymous Auth)
- **React Router** (HashRouter for GitHub Pages compatibility)
- **date-fns** for date formatting

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Firebase:**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Firestore Database
   - Enable Anonymous Authentication
   - Copy your Firebase config values

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Add your Firebase config to `.env`:**
   ```env
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

6. **Build for production:**
   ```bash
   npm run build
   ```

## Firebase Collections

### `players`
- `name` (string, required)
- `nickname` (string, optional)
- `avatar` (string, optional - URL)
- `active` (boolean, default: true)
- `createdAt` (timestamp)

### `matches`
- `winnerId` (string, required)
- `loserId` (string, required)
- `winnerScore` (number, default: 3) - Games won by winner
- `loserScore` (number, default: 0) - Games won by loser
- `playedAt` (timestamp)
- `createdBy` (string - user ID)
- `status` (string, default: "completed")

## Features in Detail

### Leaderboard
- Displays players sorted by Elo rating
- Shows W-L record, win percentage, Elo, current streak, and odds vs field average
- Tap a player to open bottom sheet with actions: Add Win, Add Loss, View Stats

### Matches
- Reverse chronological list of all matches
- Shows winner, loser, final score, and time since match
- Edit game scores for any match
- Delete matches to support undo functionality
- Score changes automatically update leaderboard statistics

### Players
- Add new players with name, nickname, and avatar URL
- Toggle active/inactive status
- Only active players appear in leaderboard

## Stats Calculation

- **Elo Rating**: Starts at 1500, updates after each match using standard Elo formula (K=32)
- **Win Percentage**: (Games Won / Total Games Played) × 100 - Calculated based on individual game scores, not just match wins
- **Streak**: Current consecutive match wins (positive) or losses (negative)
- **Odds**: Player Elo / Average Elo (simplified calculation)

## Deployment

The app uses HashRouter for GitHub Pages compatibility. To deploy:

1. Build the app: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Ensure your Firebase environment variables are set in your hosting platform

## License

MIT

