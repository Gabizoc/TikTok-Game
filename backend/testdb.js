require("dotenv").config();
const db = require("./utils/connectDB");

(async () => {
  try {
    const [rows] = await db.query("SELECT 1 + 1 AS result");
    console.log("✅ Connexion réussie ! Résultat de test :", rows[0].result);
    process.exit(0);
  } catch (err) {
    console.error("❌ Erreur de connexion à la base de données :", err);
    process.exit(1);
  }
})();
