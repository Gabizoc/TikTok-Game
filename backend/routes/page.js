const express = require("express");
const router = express.Router();
const db = require("../utils/connectDB");
const axios = require("axios");
const rateLimit = require("express-rate-limit");
const authenticate = require("../utils/authenticate");

const limiterAi = rateLimit({
  windowMs: 60 * 1000,
  max: 1,
  message: "Trop de requêtes, veuillez réessayer dans une minute.",
});

async function log(type, message) {
  const chalk = (await import("chalk")).default;
  const prefix = chalk.gray(`[${chalk.blueBright("PAGE")}]`);
  switch (type) {
    case "info":
      console.log(`${prefix} ${chalk.cyan(message)}`);
      break;
    case "success":
      console.log(`${prefix} ${chalk.green(message)}`);
      break;
    case "error":
      console.error(`${prefix} ${chalk.red(message)}`);
      break;
    case "warn":
      console.warn(`${prefix} ${chalk.yellow(message)}`);
      break;
    default:
      console.log(`${prefix} ${message}`);
  }
}

router.get("/giftsended", authenticate, async (req, res) => {
  const user_id = req.user.id;

  if (!user_id) {
    return res.status(400).json({ error: "Le user_id est requis" });
  }

  try {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const [totalGifts] = await db.query(
      "SELECT COUNT(*) AS totalGifts, SUM(diamond_count) AS totalDiamonds FROM gifts WHERE user_id = ? AND MONTH(date) = ? AND YEAR(date) = ?",
      [user_id, currentMonth, currentYear]
    );

    const [mostSentGift] = await db.query(
      "SELECT gift_name, COUNT(*) AS count FROM gifts WHERE user_id = ? AND MONTH(date) = ? AND YEAR(date) = ? GROUP BY gift_name ORDER BY count DESC LIMIT 1",
      [user_id, currentMonth, currentYear]
    );

    const [gifts] = await db.query(
      "SELECT * FROM gifts WHERE user_id = ? AND MONTH(date) = ? AND YEAR(date) = ?",
      [user_id, currentMonth, currentYear]
    );

    if (gifts.length === 0) {
      return res
        .status(404)
        .json({ message: "Aucun cadeau trouvé pour cette utilisateur ce mois-ci." });
    }

    const giftsPerDay = {};
    gifts.forEach((gift) => {
      const date = new Date(gift.date);
      const day = date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
      });

      if (!giftsPerDay[day]) giftsPerDay[day] = 0;
      giftsPerDay[day]++;
    });

    const giftsPerDayArray = Object.entries(giftsPerDay).map(
      ([day, count]) => ({
        day,
        count,
      })
    );

    const estimatedEarnings = totalGifts[0].totalDiamonds
      ? (totalGifts[0].totalDiamonds * 0.0046).toFixed(2)
      : "0.00";

    const [giftsByName] = await db.query(
      "SELECT gift_name, COUNT(*) AS totalGiftName FROM gifts WHERE user_id = ? AND MONTH(date) = ? AND YEAR(date) = ? GROUP BY gift_name",
      [user_id, currentMonth, currentYear]
    );

    res.json({
      totalGifts: totalGifts[0].totalGifts,
      totalDiamonds: totalGifts[0].totalDiamonds,
      estimatedEarnings: parseFloat(estimatedEarnings),
      topGift: mostSentGift[0] ? mostSentGift[0].gift_name : null,
      gifts: gifts,
      giftsPerDay: giftsPerDayArray,
      giftsByName,
    });
  } catch (error) {
    await log("error", `GET : /api/giftsended : ${error.message}`);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.get("/dashboard", authenticate, async (req, res) => {
  const user_id = req.user.id;

  if (!user_id) {
    return res.status(400).json({ error: "Le user_id est requis" });
  }

  const [user] = await db.query("SELECT tiktok_username FROM users WHERE id = ?", [user_id]);
  const pseudo = user[0]?.tiktok_username;

  if (!pseudo) {
    return res.status(404).json({ error: "Utilisateur introuvable pour cet ID" });
  }

  if (!user_id) {
    return res.status(400).json({ error: "Le user_id est requis" });
  }

  try {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const earnings6Months = [];

    for (let i = 5; i >= 0; i--) {
      const month =
        currentMonth - i <= 0 ? 12 + (currentMonth - i) : currentMonth - i;
      const year = currentMonth - i <= 0 ? currentYear - 1 : currentYear;

      const [totalDiamonds] = await db.query(
        "SELECT SUM(diamond_count) AS totalDiamonds FROM gifts WHERE user_id = ? AND MONTH(date) = ? AND YEAR(date) = ?",
        [user_id, month, year]
      );

      const estimatedEarnings = totalDiamonds[0].totalDiamonds
        ? (totalDiamonds[0].totalDiamonds * 0.0046).toFixed(2)
        : "0.00";

      earnings6Months.push({
        month: month,
        year: year,
        estimatedEarnings: parseFloat(estimatedEarnings),
      });
    }

    const [totalDiamondsCurrent] = await db.query(
      "SELECT SUM(diamond_count) AS totalDiamonds FROM gifts WHERE user_id = ? AND MONTH(date) = ? AND YEAR(date) = ?",
      [user_id, currentMonth, currentYear]
    );

    const estimatedEarningsCurrent = totalDiamondsCurrent[0].totalDiamonds
      ? (totalDiamondsCurrent[0].totalDiamonds * 0.0046).toFixed(2)
      : "0.00";

    const [giftsByName] = await db.query(
      "SELECT gift_name, COUNT(*) AS totalGiftName FROM gifts WHERE user_id = ? AND MONTH(date) = ? AND YEAR(date) = ? GROUP BY gift_name",
      [user_id, currentMonth, currentYear]
    );

    const [sessionData] = await db.query(
      "SELECT SUM(viewer_count) AS totalViewers, SUM(gift_count) AS totalGifts, COUNT(*) AS totalSessions FROM sessionlive WHERE user_id = ? AND MONTH(start_time) = ? AND YEAR(start_time) = ?",
      [user_id, currentMonth, currentYear]
    );

    if (sessionData.length === 0) {
      return res
        .status(404)
        .json({ message: "Aucune donnée trouvée pour cette utilisateur ce mois-ci." });
    }

    res.json({
      earnings6Months,
      totalDiamonds: totalDiamondsCurrent[0].totalDiamonds,
      estimatedEarnings: parseFloat(estimatedEarningsCurrent),
      totalViewers: parseInt(sessionData[0].totalViewers, 10) || 0,
      giftsByName,
      totalSessions: parseInt(sessionData[0].totalSessions, 10) || 0,
      pseudo,
    });
  } catch (error) {
    await log("error", `GET : /api/dashboard : ${error.message}`);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.get("/dashboard/analysis", limiterAi, authenticate, async (req, res) => {
  const user_id = req.user.id;

  if (!user_id) {
    return res.status(400).json({ error: "Le user_id est requis" });
  }

  const [user] = await db.query("SELECT tiktok_username FROM users WHERE id = ?", [user_id]);
  const pseudo = user[0]?.tiktok_username;

  if (!pseudo) {
    return res.status(404).json({ error: "Utilisateur introuvable pour cet ID" });
  }

  try {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const earnings6Months = [];

    for (let i = 5; i >= 0; i--) {
      const month =
        currentMonth - i <= 0 ? 12 + (currentMonth - i) : currentMonth - i;
      const year = currentMonth - i <= 0 ? currentYear - 1 : currentYear;

      const [totalDiamonds] = await db.query(
        "SELECT SUM(diamond_count) AS totalDiamonds FROM gifts WHERE user_id = ? AND MONTH(date) = ? AND YEAR(date) = ?",
        [user_id, month, year]
      );

      const estimatedEarnings = totalDiamonds[0].totalDiamonds
        ? (totalDiamonds[0].totalDiamonds * 0.0046).toFixed(2)
        : "0.00";

      earnings6Months.push({
        month: month,
        year: year,
        estimatedEarnings: parseFloat(estimatedEarnings),
      });
    }

    const [giftsByName] = await db.query(
      "SELECT gift_name, COUNT(*) AS totalGiftName FROM gifts WHERE user_id = ? AND MONTH(date) = ? AND YEAR(date) = ? GROUP BY gift_name",
      [user_id, currentMonth, currentYear]
    );

    const [sessionData] = await db.query(
      "SELECT SUM(viewer_count) AS totalViewers, SUM(gift_count) AS totalGifts, COUNT(*) AS totalSessions FROM sessionlive WHERE user_id = ? AND MONTH(start_time) = ? AND YEAR(start_time) = ?",
      [user_id, currentMonth, currentYear]
    );

    const [sessionDates] = await db.query(
      "SELECT start_time FROM sessionlive WHERE user_id = ? AND MONTH(start_time) = ? AND YEAR(start_time) = ? ORDER BY start_time ASC",
      [user_id, currentMonth, currentYear]
    );

    const formattedSessions =
      sessionDates.length > 0
        ? sessionDates
            .map(
              (s) => `- ${new Date(s.start_time).toLocaleDateString("fr-FR")}`
            )
            .join("\n")
        : "Aucune session enregistrée";

    if (sessionData.length === 0) {
      return res
        .status(404)
        .json({ message: "Aucune donnée trouvée pour ce pseudo ce mois-ci." });
    }

    const totalViewers = sessionData?.[0]?.totalViewers ?? "Non disponible";
    const totalSessions = sessionData?.[0]?.totalSessions ?? "Non disponible";

    const earningsFormatted =
      earnings6Months.length > 0
        ? earnings6Months
            .map((e) => `${e.month}/${e.year} = ${e.estimatedEarnings}€`)
            .join(", ")
        : "Aucun gain enregistré";

    const giftsFormatted =
      giftsByName?.length > 0
        ? giftsByName
            .map((g) => `${g.gift_name} (${g.totalGiftName})`)
            .join(", ")
        : "Aucun cadeau reçu";

    const today = new Date().toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    const monthsFR = [
      "janvier",
      "février",
      "mars",
      "avril",
      "mai",
      "juin",
      "juillet",
      "août",
      "septembre",
      "octobre",
      "novembre",
      "décembre",
    ];
    const currentMonthName = monthsFR[currentMonth - 1];

    const analysisPrompt = `
      📅 **Date** : ${today}
      👤 Utilisateur TikTok : ${pseudo}
      📊 **Période analysée** : ${currentMonthName} ${currentYear}

      🎯 Objectif : Augmenter les revenus TikTok de l'utilisateur tout en améliorant l'engagement live.
      💡 Contrainte : Adopte un ton motivant et professionnel, évite les redondances inutiles.

      - **Gains (6 derniers mois)** : ${earningsFormatted}
      - **Spectateurs ce mois** : ${totalViewers}
      - **Sessions** : ${totalSessions}
      - **Dates des sessions** : ${formattedSessions}
      - **Cadeaux reçus** : ${giftsFormatted}

      ### Analyse rapide par **AI Power Up** :
      1. **Points forts** : Identifie les réussites notables de ce mois.
      2. **Axes d'amélioration** : Indique des optimisations ciblées.
      3. **Conseils pratiques** : Recommandations utiles pour booster l’impact live.
      4. **Score global** : Donne une note de performance sur 10 avec justification.

      Réponse courte, professionnelle, directe et actionnable et sans message superflue du type "Analyse rapide par AI Power Up" ou autres. Une session est 1 partie lancée mais qui peux être en un seul live.
      `;

    const aiResponse = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3-70b-instruct",
        messages: [
          {
            role: "system",
            content:
              "Tu es un assistant expert en analyse de performances TikTok en live qui s'appele AI Power Up. Un assistant pour une solutions de live TikTok interactif avec surveillance et statistiques de live.",
          },
          {
            role: "user",
            content: analysisPrompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer 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`,
          "Content-Type": "application/json",
        },
      }
    );

    const aiAnalysis = aiResponse.data.choices[0].message.content;

    res.json({
      aiAnalysis,
    });
  } catch (error) {
    await log("error", `GET : /api/dashboard/analysis : ${error.message}`);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
