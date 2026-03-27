const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const http = require('http');
const socketIo = require('socket.io');
const cron = require('node-cron');
const { exec } = require('child_process');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'marvel_agents',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

// Middleware
app.use(cors());
app.use(express.json());

// Marvel agents data
const marvelAgents = [
  {
    id: 1,
    name: 'Spider-Man',
    codename: 'Web-Slinger',
    avatar: 'https://via.placeholder.com/200x200/FF0000/FFFFFF?text=Spidey',
    status: 'active',
    level: 8,
    description: 'Friendly neighborhood hero with spider abilities',
    stats: { health: 85, energy: 90, shield: 70 },
    mission: 'Neighborhood patrol',
    lastActivity: '2024-03-27 10:30:00'
  },
  {
    id: 2,
    name: 'Iron Man',
    codename: 'Armored Avenger',
    avatar: 'https://via.placeholder.com/200x200/FF6B00/FFFFFF?text=Stark',
    status: 'mission',
    level: 9,
    description: 'Genius billionaire in advanced armor suit',
    stats: { health: 95, energy: 100, shield: 90 },
    mission: 'Deep space exploration',
    lastActivity: '2024-03-27 08:15:00'
  },
  {
    id: 3,
    name: 'Captain America',
    codename: 'First Avenger',
    avatar: 'https://via.placeholder.com/200x200/0000FF/FFFFFF?text=Cap',
    status: 'active',
    level: 9,
    description: 'Super-soldier and moral compass of the Avengers',
    stats: { health: 90, energy: 85, shield: 100 },
    mission: 'Avengers rally',
    lastActivity: '2024-03-27 11:45:00'
  },
  {
    id: 4,
    name: 'Black Widow',
    codename: 'Spy Master',
    avatar: 'https://via.placeholder.com/200x200/000000/FFFFFF?text=Widow',
    status: 'mission',
    level: 8,
    description: 'Highly trained spy and martial artist',
    stats: { health: 80, energy: 75, shield: 60 },
    mission: 'Undercover ops',
    lastActivity: '2024-03-27 07:20:00'
  },
  {
    id: 5,
    name: 'Thor',
    codename: 'God of Thunder',
    avatar: 'https://via.placeholder.com/200x200/FFD700/000000?text=Thor',
    status: 'active',
    level: 10,
    description: 'Asgardian prince with Mjolnir',
    stats: { health: 100, energy: 100, shield: 95 },
    mission: 'Asgard diplomacy',
    lastActivity: '2024-03-27 12:00:00'
  },
  {
    id: 6,
    name: 'Hulk',
    codename: 'Green Giant',
    avatar: 'https://via.placeholder.com/200x200/00FF00/000000?text=Hulk',
    status: 'standby',
    level: 9,
    description: 'Scientist with gamma-powered transformations',
    stats: { health: 98, energy: 70, shield: 85 },
    mission: 'Gamma research',
    lastActivity: '2024-03-27 09:30:00'
  },
  {
    id: 7,
    name: 'Doctor Strange',
    codename: 'Sorcerer Supreme',
    avatar: 'https://via.placeholder.com/200x200/800080/FFFFFF?text=Strange',
    status: 'mission',
    level: 10,
    description: 'Master of the mystic arts',
    stats: { health: 85, energy: 100, shield: 88 },
    mission: 'Multiverse protection',
    lastActivity: '2024-03-27 06:45:00'
  },
  {
    id: 8,
    name: 'Black Panther',
    codename: 'King of Wakanda',
    avatar: 'https://via.placeholder.com/200x200/000000/FFFFFF?text=BP',
    status: 'active',
    level: 9,
    description: 'Wakandan king with vibranium suit',
    stats: { health: 88, energy: 85, shield: 92 },
    mission: 'Wakanda security',
    lastActivity: '2024-03-27 10:15:00'
  },
  {
    id: 9,
    name: 'Captain Marvel',
    codename: 'Space Commander',
    avatar: 'https://via.placeholder.com/200x200/FF1493/FFFFFF?text=Carol',
    status: 'mission',
    level: 10,
    description: 'Former Air Force pilot with cosmic powers',
    stats: { health: 95, energy: 100, shield: 90 },
    mission: 'Galactic defense',
    lastActivity: '2024-03-27 05:30:00'
  },
  {
    id: 10,
    name: 'Ant-Man',
    codename: 'Size Shifter',
    avatar: 'https://via.placeholder.com/200x200/B22222/FFFFFF?text=Ant',
    status: 'active',
    level: 7,
    description: 'Can shrink and grow at will',
    stats: { health: 75, energy: 80, shield: 65 },
    mission: 'Quantum realm research',
    lastActivity: '2024-03-27 11:20:00'
  },
  {
    id: 11,
    name: 'Wanda Maximoff',
    codename: 'Scarlet Witch',
    avatar: 'https://via.placeholder.com/200x200/FF4500/FFFFFF?text=Wanda',
    status: 'repair',
    level: 10,
    description: 'Reality-altering witch',
    stats: { health: 65, energy: 90, shield: 75 },
    mission: 'Recovery training',
    lastActivity: '2024-03-27 08:00:00'
  },
  {
    id: 12,
    name: 'Vision',
    codename: 'Synthezoid',
    avatar: 'https://via.placeholder.com/200x200/708090/FFFFFF?text=Vision',
    status: 'repair',
    level: 9,
    description: 'Android with infinity stone powers',
    stats: { health: 70, energy: 85, shield: 80 },
    mission: 'System diagnostics',
    lastActivity: '2024-03-27 07:00:00'
  },
  {
    id: 13,
    name: 'Falcon',
    codename: 'Airborne Avenger',
    avatar: 'https://via.placeholder.com/200x200/1E90FF/FFFFFF?text=Falcon',
    status: 'active',
    level: 7,
    description: 'Master of aerial combat',
    stats: { health: 82, energy: 88, shield: 78 },
    mission: 'Air patrol',
    lastActivity: '2024-03-27 11:50:00'
  },
  {
    id: 14,
    name: 'Winter Soldier',
    codename: 'White Wolf',
    avatar: 'https://via.placeholder.com/200x200/2F4F4F/FFFFFF?text=Bucky',
    status: 'standby',
    level: 8,
    description: 'Enhanced super-soldier',
    stats: { health: 90, energy: 80, shield: 85 },
    mission: 'Shadow ops ready',
    lastActivity: '2024-03-27 09:45:00'
  },
  {
    id: 15,
    name: 'Scarlet Spider',
    codename: 'Clone Warrior',
    avatar: 'https://via.placeholder.com/200x200/8B0000/FFFFFF?text=Kaine',
    status: 'standby',
    level: 8,
    description: 'Spider clone with enhanced abilities',
    stats: { health: 87, energy: 85, shield: 75 },
    mission: 'Clone training',
    lastActivity: '2024-03-27 10:05:00'
  }
];

// Initialize database and table
async function initDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS marvel_agents (
        id INTEGER PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        codename VARCHAR(50),
        avatar VARCHAR(255),
        status VARCHAR(20),
        level INTEGER,
        description TEXT,
        health INTEGER,
        energy INTEGER,
        shield INTEGER,
        mission VARCHAR(100),
        last_activity TIMESTAMP
      )
    `);

    const result = await pool.query('SELECT COUNT(*) FROM marvel_agents');
    if (parseInt(result.rows[0].count) === 0) {
      for (const agent of marvelAgents) {
        await pool.query(`
          INSERT INTO marvel_agents (id, name, codename, avatar, status, level, description, health, energy, shield, mission, last_activity)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        `, [
          agent.id, agent.name, agent.codename, agent.avatar, agent.status,
          agent.level, agent.description, agent.stats.health, agent.stats.energy,
          agent.stats.shield, agent.mission, new Date(agent.lastActivity)
        ]);
      }
    }
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

// Routes
app.get('/api/agents', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM marvel_agents ORDER BY id');
    const agents = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      codename: row.codename,
      avatar: row.avatar,
      status: row.status,
      level: row.level,
      description: row.description,
      stats: {
        health: row.health,
        energy: row.energy,
        shield: row.shield
      },
      mission: row.mission,
      lastActivity: row.last_activity
    }));
    res.json(agents);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.put('/api/agents/:id', async (req, res) => {
  const { id } = req.params;
  const { status, stats, mission } = req.body;
  
  try {
    await pool.query(`
      UPDATE marvel_agents 
      SET status = COALESCE($1, status),
          health = COALESCE($2, health),
          energy = COALESCE($3, energy),
          shield = COALESCE($4, shield),
          mission = COALESCE($5, mission),
          last_activity = NOW()
      WHERE id = $6
    `, [status, stats?.health, stats?.energy, stats?.shield, mission, id]);
    
    const result = await pool.query('SELECT * FROM marvel_agents WHERE id = $1', [id]);
    const updatedAgent = {
      id: result.rows[0].id,
      name: result.rows[0].name,
      codename: result.rows[0].codename,
      avatar: result.rows[0].avatar,
      status: result.rows[0].status,
      level: result.rows[0].level,
      description: result.rows[0].description,
      stats: {
        health: result.rows[0].health,
        energy: result.rows[0].energy,
        shield: result.rows[0].shield
      },
      mission: result.rows[0].mission,
      lastActivity: result.rows[0].last_activity
    };
    
    io.emit('agentUpdate', updatedAgent);
    res.json(updatedAgent);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

// WebSocket handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('getAgents', async () => {
    try {
      const result = await pool.query('SELECT * FROM marvel_agents ORDER BY id');
      const agents = result.rows.map(row => ({
        id: row.id,
        name: row.name,
        codename: row.codename,
        avatar: row.avatar,
        status: row.status,
        level: row.level,
        description: row.description,
        stats: {
          health: row.health,
          energy: row.energy,
          shield: row.shield
        },
        mission: row.mission,
        lastActivity: row.last_activity
      }));
      socket.emit('syncAgents', agents);
    } catch (error) {
      console.error('Error syncing agents:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Telegram notifications
async function sendTelegramNotification(message) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  
  if (!botToken || !chatId) {
    console.log('Telegram bot token or chat ID not configured');
    return;
  }

  try {
    const axios = require('axios');
    await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML'
    });
  } catch (error) {
    console.error('Error sending Telegram notification:', error);
  }
}

// GitHub auto-commit every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  console.log('Running auto-commit...');
  
  try {
    const commitMessage = `Auto-update: $(date) - Agent data sync`;
    exec(`git add . && git commit -m "${commitMessage}" && git push origin main`, (error, stdout, stderr) => {
      if (error) {
        console.error('Git commit error:', error);
        return;
      }
      if (stdout) {
        console.log('Git commit output:', stdout);
        sendTelegramNotification(`✅ Auto-commit successful: ${new Date().toLocaleString()}`);
      }
    });
  } catch (error) {
    console.error('Git auto-commit error:', error);
  }
});

// Simulate agent updates periodically
setInterval(async () => {
  try {
    const agents = await pool.query('SELECT id, name, health, energy, shield FROM marvel_agents');
    const randomAgent = agents.rows[Math.floor(Math.random() * agents.rows.length)];
    
    const newHealth = Math.max(50, Math.min(100, randomAgent.health + Math.floor(Math.random() * 21) - 10));
    const newEnergy = Math.max(50, Math.min(100, randomAgent.energy + Math.floor(Math.random() * 21) - 10));
    const newShield = Math.max(50, Math.min(100, randomAgent.shield + Math.floor(Math.random() * 21) - 10));
    
    await pool.query(`
      UPDATE marvel_agents 
      SET health = $1, energy = $2, shield = $3, last_activity = NOW()
      WHERE id = $4
    `, [newHealth, newEnergy, newShield, randomAgent.id]);
    
    const updatedAgent = {
      id: randomAgent.id,
      name: randomAgent.name,
      stats: { health: newHealth, energy: newEnergy, shield: newShield }
    };
    
    io.emit('agentUpdate', updatedAgent);
    
    const notification = {
      message: `${randomAgent.name} updated stats: ⚡${newEnergy} 🛡️${newShield} ❤️${newHealth}`,
      timestamp: new Date().toLocaleString()
    };
    io.emit('newNotification', notification);
    
    // Chance to change status
    if (Math.random() < 0.1) {
      const statuses = ['active', 'standby', 'mission', 'repair'];
      const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
      
      await pool.query('UPDATE marvel_agents SET status = $1 WHERE id = $2', [newStatus, randomAgent.id]);
      
      const statusNotification = {
        message: `${randomAgent.name} status changed to ${newStatus.toUpperCase()}`,
        timestamp: new Date().toLocaleString()
      };
      io.emit('newNotification', statusNotification);
      
      if (newStatus === 'repair') {
        sendTelegramNotification(`🚨 ${randomAgent.name} needs repairs! Status: ${newStatus.toUpperCase()}`);
      }
    }
    
  } catch (error) {
    console.error('Agent update simulation error:', error);
  }
}, 30000); // Every 30 seconds

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

const PORT = process.env.PORT || 5000;

// Initialize and start server
initDatabase().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('WebSocket server ready for real-time updates');
    console.log('GitHub auto-commit enabled every 5 minutes');
    console.log('Telegram notifications configured if tokens available');
  });
});