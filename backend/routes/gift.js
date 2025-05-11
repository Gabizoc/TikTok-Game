const express = require("express");
const router = express.Router();
const cron = require("node-cron");
const puppeteer = require("puppeteer");
const db = require("../utils/connectDB");

async function log(type, message) {
  const chalk = (await import("chalk")).default;
  const prefix = chalk.gray(`[${chalk.blueBright("GIFT")}]`);
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

async function getAllGifts() {
  try {
    const [rows] = await db.query("SELECT * FROM giftslist");
    return rows;
  } catch (error) {
    await log("error", `Erreur MySQL (getAllGifts) : ${error.message}`);
    return [];
  }
}

async function scrapeData() {
  const countryCodes = [
    "au",
    "rb",
    "br",
    "ca",
    "eg",
    "fr",
    "hk",
    "in",
    "jp",
    "it",
    "kr",
    "mx",
    "pl",
    "sr",
    "sg",
    "sp",
    "tr",
    "uae",
    "uk",
    "ua",
    "usa",
    "vt",
  ];

  const maxConcurrency = 5;
  const allData = [];
  const browser = await puppeteer.launch({ headless: true });

  const scrapeCountry = async (code) => {
    const page = await browser.newPage();
    const countryUrl = `https://streamdps.com/tiktok-widgets/gifts/${
      code ? `?${code}=1` : ""
    }`;
    await log("info", `Scraping pays: ${code || "all"}...`);

    for (let currentPage = 1; currentPage <= 4; currentPage++) {
      const url = `${countryUrl}${
        countryUrl.includes("?") ? "&" : "?"
      }PAGEN_4=${currentPage}`;
      try {
        await page.goto(url, { timeout: 20000 });
        await page.waitForSelector("div.column.width-1.center", {
          timeout: 10000,
        });
      } catch {
        break;
      }

      const elements = await page.$$("div.column.width-1.center");
      if (!elements.length) break;

      const pageData = [];

      for (const element of elements) {
        try {
          const imageUrl = await element.$eval("img", (img) => img.src);
          const prix = await element.$eval("span.color-white", (span) =>
            span.innerText.trim()
          );
          const inputValues = await element.$$eval("input", (inputs) =>
            inputs.map((input) => input.value)
          );

          const gift = {
            id: inputValues[0] || "",
            nom: inputValues[1] || "",
            prix,
            imageUrl,
          };

          if (gift.id && gift.nom) {
            pageData.push(gift);
          }
        } catch {}
      }

      if (pageData.length) {
        allData.push(...pageData);
        await log(
          "success",
          `Données extraites pour ${code} - page ${currentPage} (${pageData.length} gifts)`
        );
      }
    }

    await page.close();
  };

  const runWithConcurrencyLimit = async () => {
    const queue = [...countryCodes];
    const promises = [];

    while (queue.length) {
      if (promises.length >= maxConcurrency) {
        await Promise.race(promises);
      }

      const code = queue.shift();
      const promise = scrapeCountry(code).finally(() => {
        const index = promises.indexOf(promise);
        if (index > -1) promises.splice(index, 1);
      });

      promises.push(promise);
    }

    await Promise.all(promises);
  };

  await runWithConcurrencyLimit();
  await browser.close();

  const uniqueData = Object.values(
    allData.reduce((acc, curr) => {
      if (curr.id && curr.nom && !acc[curr.id]) acc[curr.id] = curr;
      return acc;
    }, {})
  );

  try {
    await db.query("DELETE FROM giftslist");
    const insertQuery =
      "INSERT INTO giftslist (id, nom, prix, imageUrl) VALUES ?";
    const values = uniqueData.map((g) => [g.id, g.nom, g.prix, g.imageUrl]);
    await db.query(insertQuery, [values]);
    await log(
      "success",
      `Base MySQL mise à jour avec ${uniqueData.length} gifts`
    );
  } catch (error) {
    await log("error", `Erreur MySQL (insertion gifts) : ${error.message}`);
  }
}

cron.schedule("0 0 * * *", async () => {
  await log("info", "Cron scraping TikTok lancé...");
  scrapeData();
});

router.get("/giftall", async (req, res) => {
  try {
    const gifts = await getAllGifts();
    res.json(gifts);
  } catch (error) {
    await log("error", `GET : /api/gift/giftall : ${error.message}`);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
