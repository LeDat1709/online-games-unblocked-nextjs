// Script tự động crawl games từ GameDistribution bằng Puppeteer
// Cách dùng: node scripts/auto-crawl.js [số_games]

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const maxGames = parseInt(process.argv[2]) || 20;

function createSlug(title) {
  return title.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function generateContent(title, category) {
  const templates = [
    `${title} is an exciting ${category.toLowerCase()} game that you can play for free online. Master the controls using your keyboard and mouse to navigate through challenging levels. The game features intuitive gameplay mechanics that are easy to learn but difficult to master. Collect power-ups and bonuses to boost your score and unlock new abilities. Whether you're looking for a quick gaming session or hours of entertainment, ${title} delivers an engaging experience. Tips for success: stay focused, practice regularly, and learn from each attempt. The game offers smooth performance and responsive controls that make it enjoyable for both casual and hardcore gamers. Perfect for players who love ${category.toLowerCase()} games with challenging gameplay and rewarding progression systems!`,
    
    `Play ${title}, one of the best ${category.toLowerCase()} games available online! This game combines exciting gameplay with stunning visuals and smooth controls. Use your skills to overcome obstacles, defeat enemies, and achieve high scores. The game features multiple levels, each with unique challenges and rewards. Collect coins, power-ups, and special items to enhance your abilities. ${title} is designed for players of all skill levels, from beginners to experts. Tips: take your time to learn the mechanics, watch for patterns, and don't give up! The game offers endless replayability with its dynamic gameplay and competitive scoring system. Join thousands of players worldwide who enjoy ${title} every day!`,
    
    `${title} brings you an amazing ${category.toLowerCase()} gaming experience right in your browser. No downloads required - just click and play! The game features responsive controls, engaging mechanics, and hours of fun. Challenge yourself to beat your high score and compete with friends. Collect special items and unlock achievements as you progress through the game. ${title} is optimized for both desktop and mobile devices, ensuring smooth gameplay wherever you are. Pro tips: practice makes perfect, stay alert, and use power-ups strategically. This game is perfect for quick breaks or extended gaming sessions. Experience the thrill of ${category.toLowerCase()} gaming at its finest with ${title}!`
  ];
  
  return templates[Math.floor(Math.random() * templates.length)];
}

async function crawlGames() {
  console.log(`🚀 Starting auto-crawl (max ${maxGames} games)...\n`);
  
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  try {
    console.log('📄 Loading GameDistribution...');
    await page.goto('https://gamedistribution.com/games/', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    // Scroll để load thêm games
    console.log('📜 Scrolling to load more games...');
    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    // Lấy tất cả game IDs từ thumbnails
    console.log('🔍 Extracting game data...\n');
    const games = await page.evaluate(() => {
      const gameData = [];
      const images = document.querySelectorAll('img[src*="img.gamedistribution.com"]');
      
      images.forEach(img => {
        const match = img.src.match(/img\.gamedistribution\.com\/([a-f0-9]{32})/);
        if (match) {
          const gameId = match[1];
          
          // Tìm title từ alt hoặc parent elements
          let title = img.alt || '';
          if (!title) {
            const parent = img.closest('a, div');
            if (parent) {
              const titleEl = parent.querySelector('h2, h3, h4, .title, [class*="title"]');
              if (titleEl) title = titleEl.textContent.trim();
            }
          }
          
          // Tìm category
          let category = 'Action';
          const parent = img.closest('a, div, article');
          if (parent) {
            const categoryEl = parent.querySelector('.category, [class*="category"]');
            if (categoryEl) {
              category = categoryEl.textContent.trim();
              category = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
            }
          }
          
          if (title && gameId) {
            gameData.push({ id: gameId, title, category });
          }
        }
      });
      
      return gameData;
    });
    
    await browser.close();
    
    console.log(`✅ Found ${games.length} games\n`);
    
    // Đọc games.json hiện tại
    const gamesPath = path.join(process.cwd(), 'public', 'games.json');
    let existingGames = [];
    
    if (fs.existsSync(gamesPath)) {
      const data = fs.readFileSync(gamesPath, 'utf8');
      existingGames = JSON.parse(data);
    }
    
    const existingIds = new Set(existingGames.map(g => g.id));
    let added = 0;
    let skipped = 0;
    
    // Giới hạn số games
    const gamesToAdd = games.slice(0, maxGames);
    
    for (const game of gamesToAdd) {
      const slug = createSlug(game.title);
      
      if (existingIds.has(slug)) {
        console.log(`⏭️  Skipped: ${game.title} (already exists)`);
        skipped++;
        continue;
      }
      
      const newGame = {
        id: slug,
        title: game.title,
        thumbnail: `https://img.gamedistribution.com/${game.id}-512x384.jpg`,
        embedUrl: `https://html5.gamedistribution.com/${game.id}/`,
        category: game.category,
        content: generateContent(game.title, game.category)
      };
      
      existingGames.push(newGame);
      console.log(`✅ Added: ${game.title}`);
      added++;
    }
    
    // Ghi file
    fs.writeFileSync(gamesPath, JSON.stringify(existingGames, null, 2), 'utf8');
    
    console.log(`\n✨ Crawl complete!`);
    console.log(`   Added: ${added} games`);
    console.log(`   Skipped: ${skipped} games`);
    console.log(`   Total: ${existingGames.length} games`);
    console.log(`\n⚠️  Remember to edit games.json to improve descriptions for better SEO!`);
    
  } catch (error) {
    await browser.close();
    throw error;
  }
}

crawlGames().catch(error => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
