const express = require("express");
const routes = require("./routes");
const path = require("path");
const http = require("http");
require("dotenv").config();
const mongoose = require("mongoose");
const { createWSS } = require("./utils/connectWS");
const setupWSHandlers = require("./ws/wsHandlers");

const app = express();
const server = http.createServer(app); // 👈 serveur http pour ws et express
const wss = createWSS(server);
const port = process.env.PORT || 3010;

setupWSHandlers(wss);

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
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/tiktok-live-app"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

setupWSHandlers(wss);

// Lancer le serveur HTTP (Express + WebSocket)
server.listen(port, async () => {
  const chalk = await import("chalk").then((mod) => mod.default);

  console.log(chalk.cyan.bold("\n🚀 Server is up and running !"));
  console.log(
    chalk.cyan(`🌍 URL: `) + chalk.green.underline(`http://localhost:${port}`)
  );
  console.log(chalk.cyan(`📡 Listening on port:`) + chalk.yellow(` ${port}\n`));
});

process.on("SIGINT", async () => {
  const chalk = await import("chalk").then((mod) => mod.default);
  console.log(chalk.red("[Exit] Shutting down server..."));

  await mongoose.connection.close();
  console.log(chalk.red("[Exit] MongoDB connection closed"));

  process.exit(0);
});
