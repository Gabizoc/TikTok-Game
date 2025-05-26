const express = require("express");
const router = express.Router();
const db = require("../utils/connectDB");
const authenticate = require("../utils/authenticate");

router.get("/games", authenticate, async (req, res) => {
  const user_id = req.user.id;

  try {
    const [games] = await db.query("SELECT * FROM games");

    const [favorites] = await db.query(
      `SELECT game_id FROM favorites WHERE user_id = ?`,
      [user_id]
    );

    const favoriteGameIds = new Set(favorites.map(fav => fav.game_id));

    const favoriteGames = games
      .filter(game => favoriteGameIds.has(game.id))
      .map(game => ({ ...game, is_favorite: true }));

    const nonFavoriteGames = games
      .filter(game => !favoriteGameIds.has(game.id))
      .map(game => ({ ...game, is_favorite: false }));

    const combinedGames = [
      ...favoriteGames.sort((a, b) => a.id - b.id),
      ...nonFavoriteGames.sort((a, b) => a.id - b.id)
    ];

    res.json(combinedGames);
  } catch (err) {
    console.error("Error GET : /api/game/games :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.post("/favorites", authenticate, async (req, res) => {
  const { game_id } = req.body;
  const user_id = req.user.id;
  if (!user_id || !game_id)
    return res.status(400).json({ error: "Données incomplètes." });

  try {
    await db.query(
      "INSERT INTO favorites (user_id, game_id) VALUES (?, ?)",
      [user_id, game_id]
    );
    res.status(201).json({ message: "Favori ajouté avec succès." });
  } catch (error) {
    console.error("POST /favorites :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.delete("/favorites", authenticate, async (req, res) => {
  const { game_id } = req.body;
  const user_id = req.user.id;
  if (!user_id || !game_id)
    return res.status(400).json({ error: "Données incomplètes." });

  try {
    await db.query(
      "DELETE FROM favorites WHERE user_id = ? AND game_id = ?",
      [user_id, game_id]
    );
    res.json({ message: "Favori supprimé avec succès." });
  } catch (error) {
    console.error("DELETE /favorites :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;