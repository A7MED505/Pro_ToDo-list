const dotenv = require('dotenv');
const dns = require('dns');
const app = require('./app');
const connectDB = require('./config/db');

dotenv.config();

if (process.env.DNS_SERVERS) {
  const servers = process.env.DNS_SERVERS.split(',').map((item) => item.trim()).filter(Boolean);
  if (servers.length > 0) {
    dns.setServers(servers);
  }
}

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
