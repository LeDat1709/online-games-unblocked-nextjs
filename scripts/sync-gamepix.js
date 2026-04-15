// Script tự động đồng bộ games từ GamePix API
// Cách dùng: node scripts/sync-gamepix.js

const fs = require('fs');
const path = require('path');
const https = require('https');

// Cấu hình GamePix API
// ⚠️ QUAN TRỌNG: Thay SID bên dưới bằng SID thực của bạn từ GamePix Partner Dashboard
// Vào https://partners.gamepix.com/ → Properties → Copy SID của property bạn
const GAMEPIX_CONFIG = {
  sid: 'CELX7', // ← THAY ĐỔI GIÁ TRỊ NÀY (ví dụ: 'CELX7')
  limit: 100,
  order: 'q', // 'q' = quality (most played), 'd' = date (newest)
  maxPages: 100 // Sync tất cả games (tối đa 10,000 games)
};

function createSlug(title) {
  return title.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function fetchGamePixGames(offset = 0) {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams({
      sid: GAMEPIX_CONFIG.sid,
      limit: GAMEPIX_CONFIG.limit,
      offset: offset,
      order: GAMEPIX_CONFIG.order
    });
    
    const url = `https://games.gamepix.com/games?${params.toString()}`;
    
    console.log(`📡 Fetching: offset=${offset}, limit=${GAMEPIX_CONFIG.limit}`);
    
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode !== 200) {
          console.error(`❌ HTTP ${res.statusCode}`);
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }
        
        try {
          const json = JSON.parse(data);
          resolve(json);
        } catch (error) {
          console.error('❌ Failed to parse JSON');
          reject(new Error('Failed to parse JSON response'));
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

function mapGamePixToLocal(gamePixGame) {
  const slug = createSlug(gamePixGame.title);
  
  // Map category
  let category = 'Action';
  if (gamePixGame.category) {
    category = gamePixGame.category.charAt(0).toUpperCase() + gamePixGame.category.slice(1);
  }
  
  return {
    id: slug,
    gamePixId: gamePixGame.id,
    title: gamePixGame.title,
    thumbnail: gamePixGame.thumbnailUrl || gamePixGame.thumbnailUrl100,
    embedUrl: gamePixGame.url,
    category: category,
    categories: gamePixGame.categories || [],
    orientation: gamePixGame.orientation,
    width: gamePixGame.width,
    height: gamePixGame.height,
    responsive: gamePixGame.responsive,
    touch: gamePixGame.touch,
    hwcontrols: gamePixGame.hwcontrols,
    rkScore: gamePixGame.rkScore,
    featured: gamePixGame.featured,
    creation: gamePixGame.creation,
    lastUpdate: gamePixGame.lastUpdate,
    content: gamePixGame.description || `Play ${gamePixGame.title} online for free! An exciting ${category.toLowerCase()} game with great gameplay and fun challenges.`
  };
}

async function syncGames() {
  console.log('🎮 Starting GamePix sync...\n');
  
  // Kiểm tra SID
  if (GAMEPIX_CONFIG.sid === 'YOUR_SID_HERE') {
    console.error('❌ Error: Please update your SID in the script!');
    console.error('   Open scripts/sync-gamepix.js and change sid: "YOUR_SID_HERE"');
    console.error('   Get your SID from: https://partners.gamepix.com/');
    process.exit(1);
  }
  
  try {
    // Đọc games.json hiện tại
    const gamesPath = path.join(process.cwd(), 'public', 'games.json');
    let existingGames = [];
    
    if (fs.existsSync(gamesPath)) {
      const data = fs.readFileSync(gamesPath, 'utf8');
      existingGames = JSON.parse(data);
    }
    
    // Tạo map để check duplicate
    const existingGamePixIds = new Set(
      existingGames
        .filter(g => g.gamePixId)
        .map(g => g.gamePixId)
    );
    
    const existingSlugs = new Set(existingGames.map(g => g.id));
    
    let added = 0;
    let updated = 0;
    let skipped = 0;
    let offset = 0;
    let page = 1;
    
    while (page <= GAMEPIX_CONFIG.maxPages) {
      const response = await fetchGamePixGames(offset);
      
      // Debug: xem cấu trúc response
      console.log('\n🔍 Response structure:', Object.keys(response));
      
      // GamePix API trả về object với key 'data' hoặc trực tiếp array
      const games = Array.isArray(response) ? response : (response.data || response.games || []);
      
      if (!games || games.length === 0) {
        console.log('\n✅ No more games to fetch');
        break;
      }
      
      console.log(`\n📄 Processing page ${page} (${games.length} games)...\n`);
      
      for (const gamePixGame of games) {
        const newGame = mapGamePixToLocal(gamePixGame);
        
        // Check nếu game đã tồn tại (theo gamePixId hoặc slug)
        const existingIndex = existingGames.findIndex(
          g => g.gamePixId === newGame.gamePixId || g.id === newGame.id
        );
        
        if (existingIndex !== -1) {
          // Update game hiện tại
          const oldGame = existingGames[existingIndex];
          existingGames[existingIndex] = {
            ...oldGame,
            ...newGame,
            // Giữ lại content custom nếu có
            content: oldGame.content && oldGame.content.length > newGame.content.length 
              ? oldGame.content 
              : newGame.content
          };
          console.log(`🔄 Updated: ${newGame.title}`);
          updated++;
        } else if (!existingGamePixIds.has(newGame.gamePixId) && !existingSlugs.has(newGame.id)) {
          // Thêm game mới
          existingGames.push(newGame);
          existingGamePixIds.add(newGame.gamePixId);
          existingSlugs.add(newGame.id);
          console.log(`✅ Added: ${newGame.title}`);
          added++;
        } else {
          console.log(`⏭️  Skipped: ${newGame.title} (duplicate)`);
          skipped++;
        }
      }
      
      offset += GAMEPIX_CONFIG.limit;
      page++;
      
      // Delay nhỏ giữa các request
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Sắp xếp theo rkScore (cao nhất trước)
    existingGames.sort((a, b) => {
      const scoreA = a.rkScore || 0;
      const scoreB = b.rkScore || 0;
      return scoreB - scoreA;
    });
    
    // Ghi file
    fs.writeFileSync(gamesPath, JSON.stringify(existingGames, null, 2), 'utf8');
    
    console.log(`\n✨ Sync complete!`);
    console.log(`   Added: ${added} games`);
    console.log(`   Updated: ${updated} games`);
    console.log(`   Skipped: ${skipped} games`);
    console.log(`   Total: ${existingGames.length} games`);
    console.log(`\n💡 Tip: Run this script regularly to keep games updated!`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

syncGames();
