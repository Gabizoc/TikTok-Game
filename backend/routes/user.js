const express = require("express");
const router = express.Router();
const db = require("../utils/connectDB");
const authenticate = require("../utils/authenticate");
const bcrypt = require("bcrypt");

router.get("/info", authenticate, async (req, res) => {
  try {
    const [users] = await db.query(
      `SELECT id, firstname, surname, tiktok_username, email, license_category,
      notification_security_email, notification_information_email
      FROM users WHERE id = ?`,
      [req.user.id]
    );
    if (users.length === 0) return res.status(404).json({ error: "Utilisateur non trouvé." });

    const user = users[0];

    user.notification_security_email = !!user.notification_security_email;
    user.notification_information_email = !!user.notification_information_email;

    res.json({ user });
  } catch (err) {
    console.error("GET /user:", err);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

router.patch("/update", authenticate, async (req, res) => {
  const {
    firstname,
    surname,
    email,
    phone,
    tiktok_username,
  } = req.body;

  try {
    const [result] = await db.query(
      `UPDATE users SET firstname = ?, surname = ?, email = ?, phone = ?, tiktok_username = ? WHERE id = ?`,
      [
        firstname,
        surname,
        email,
        phone,
        tiktok_username,
        req.user.id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Utilisateur non trouvé ou aucune modification." });
    }

    res.json({ message: "Informations utilisateur mises à jour avec succès." });
  } catch (err) {
    console.error("PATCH /user/update:", err);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

router.post("/change-password", authenticate, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  if (!currentPassword || !newPassword)
    return res.status(400).json({ message: "Champs requis" });

  try {
    const [users] = await db.execute("SELECT password FROM users WHERE id = ?", [userId]);
    if (users.length === 0) return res.status(404).json({ message: "Utilisateur introuvable" });

    const validPassword = await bcrypt.compare(currentPassword, users[0].password);
    if (!validPassword) return res.status(401).json({ message: "Mot de passe actuel incorrect" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.execute("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, userId]);

    res.json({ message: "Mot de passe mis à jour avec succès" });
  } catch (err) {
    console.error("Erreur changement mdp:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.patch("/notifications", authenticate, async (req, res) => {
  const { notification_security_email, notification_information_email } = req.body;

  if (
    typeof notification_security_email !== "boolean" ||
    typeof notification_information_email !== "boolean"
  ) {
    return res.status(400).json({ error: "Valeurs notifications invalides." });
  }

  try {
    await db.query(
        `UPDATE users SET notification_security_email = ?, notification_information_email = ? WHERE id = ?`,
        [
          notification_security_email ? 1 : 0,
          notification_information_email ? 1 : 0,
          req.user.id,
        ]
      );      

      const [result] = await db.query(
        `UPDATE users SET notification_security_email = ?, notification_information_email = ? WHERE id = ?`,
        [
          notification_security_email ? 1 : 0,
          notification_information_email ? 1 : 0,
          req.user.id,
        ]
      );
            
      if (result.affectedRows === 0) {
        return res.status(200).json({
          message: "Rien à mettre à jour (mêmes valeurs ou ID inexistant).",
        });
      }
      
    res.json({ message: "Préférences notifications mises à jour." });
  } catch (err) {
    console.error("PATCH /user/notifications:", err);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

router.get("/license", authenticate, async (req, res) => {
  const user_id = req.user.id;

  if (!user_id) {
    return res.status(400).json({ error: "Le user_id est requis" });
  }

  try {
    const [user] = await db.query(
      "SELECT license_category FROM users WHERE id = ?",
      [user_id]
    );

    if (!user.length) {
      return res.status(404).json({ error: "Utilisateur introuvable" });
    }

    res.json({ license: user[0].license_category || null });
  } catch (error) {
    await log("error", `GET : /api/license : ${error.message}`);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.get("/connected", authenticate, async (req, res) => {
  try {
    res.json({ loggedIn: true });
  } catch (err) {
    res.status(500).json({ loggedIn: false });
  }
});

module.exports = router;