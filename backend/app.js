const express = require("express");
const routes = require("./routes");
const path = require("path");
const http = require("http");
require("dotenv").config();
const { createWSS } = require("./utils/connectWS");
const setupWSHandlers = require("./ws/wsHandlers");
const db = require("./utils/connectDB")
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
const server = http.createServer(app);
const wss = createWSS(server);
const port = process.env.PORT || 3010;

app.set("trust proxy", 1);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(cookieParser());

// Inject db into req
app.use((req, res, next) => {
  req.db = db;
  next();
});

app.use(routes);

setupWSHandlers(wss);

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
  
  if (db && db.end) {
    await db.end();
    console.log(chalk.red("[Exit] MySQL pool closed"));
  } else {
    console.warn(chalk.yellow("[Exit] No DB pool to close"));
  }
  process.exit(0);
});