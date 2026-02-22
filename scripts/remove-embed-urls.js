const fs = require('fs');
const path = require('path');

// Read games.json
const gamesPath = path.join(__dirname, '../public/games.json');
const games = JSON.parse(fs.readFileSync(gamesPath, 'utf8'));

// Remove embedUrl from all games
games.forEach(game => {
  delete game.embedUrl;
});

// Write back to file
fs.writeFileSync(gamesPath, JSON.stringify(games, null, 2), 'utf8');

console.log(`✅ Đã xóa embedUrl khỏi ${games.length} games!`);
