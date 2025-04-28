const express = require('express');
const routes = require('./routes');
const path = require("path");
const { WebcastPushConnection } = require('tiktok-live-connector');
require("dotenv").config();
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3010;

app.set("trust proxy", 1);

//app.use(express.static(path.join(__dirname, 'dist')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Utilisation des routes définies dans routes.js
app.use(routes);

// Servir le fichier index.html pour toutes les autres routes (celles de React Router)
/*app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});*/

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tiktok-live-app')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB:', err));

app.listen(port, async () => {
  const chalk = await import('chalk').then(mod => mod.default);

  console.log(chalk.cyan.bold("\n🚀 Server is up and running !"));
  console.log(chalk.cyan(`🌍 URL: `) + chalk.green.underline(`http://localhost:${port}`));
  console.log(chalk.cyan(`📡 Listening on port:`) + chalk.yellow(` ${port}\n`));
});


process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  
  const tiktokLiveRoutes = require('./routes/tiktokLive');
  
  await mongoose.connection.close();
  console.log('MongoDB connection closed');
  
  process.exit(0);
});