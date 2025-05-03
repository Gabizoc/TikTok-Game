const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const cron = require('node-cron');
const puppeteer = require('puppeteer');
const axios = require('axios');

const discordWebhookUrl = 'https://discord.com/api/webhooks/1226508538394705940/lbt85EnjLaP_ri-lPtuyizHIeWaM1J5Vgv4mlQv7AK1aCGesi9BidPNRxjzJ1T0RfcxD';

const dataFilePath = path.resolve(__dirname, '../data.json');

async function log(type, message) {
  const chalk = (await import('chalk')).default;
  const prefix = chalk.gray(`[${chalk.blueBright('GIFT')}]`);
  switch (type) {
    case 'info': console.log(`${prefix} ${chalk.cyan(message)}`); break;
    case 'success': console.log(`${prefix} ${chalk.green(message)}`); break;
    case 'error': console.error(`${prefix} ${chalk.red(message)}`); break;
    case 'warn': console.warn(`${prefix} ${chalk.yellow(message)}`); break;
    default: console.log(`${prefix} ${message}`);
  }
}

async function readJson() {
  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    await log('error', `Erreur lecture JSON : ${error.message}`);
    throw new Error("Erreur lecture fichier data.json");
  }
}

async function writeJson(data) {
  try {
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
    await log('success', `Fichier data.json mis à jour`);
  } catch (error) {
    await log('error', `Erreur écriture JSON : ${error.message}`);
  }
}

async function getGiftData(giftId) {
  const data = await readJson();
  return data.find(gift => gift.id === giftId.toString()) || null;
}

async function getAllGifts() {
  return await readJson();
}

async function sendDiscordWebhook(embed) {
  try {
    await axios.post(discordWebhookUrl, { embeds: [embed] });
    await log('success', 'Webhook Discord envoyé');
  } catch (error) {
    await log('error', `Erreur webhook Discord : ${error.message}`);
  }
}

async function scrapeData() {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('https://streamdps.com/tiktok-widgets/gifts');
    await page.waitForSelector('button[data-tracking="cookieDeclined"]', { visible: true });
    await page.click('button[data-tracking="cookieDeclined"]');

    const data = [];

    for (let currentPage = 1; currentPage <= 6; currentPage++) {
      await page.goto(`https://streamdps.com/tiktok-widgets/gifts/?PAGEN_6=${currentPage}`);
      const elements = await page.$$('div.column.width-1.center');

      for (const element of elements) {
        const imageUrl = await element.$eval('img', img => img.src);
        const prix = await element.$eval('span.color-white', span => span.innerText.trim());
        const inputValues = await element.$$eval('input', inputs => inputs.map(input => input.value));

        const gift = {
          id: inputValues[0] || "",
          nom: inputValues[1] || "",
          prix,
          imageUrl
        };

        data.push(gift);
        await log('success', `Données récupérées pour : ${gift.nom}`);
      }
    }

    await browser.close();
    const uniqueData = Object.values(
      data.reduce((acc, curr) => {
        acc[curr.id] = curr;
        return acc;
      }, {})
    );

    await writeJson(uniqueData);

    sendDiscordWebhook({
      title: "Api Tiktok Live",
      description: "Le scraping est terminé ✅",
      color: 16027057,
      author: {
        name: "Gabizoc",
        icon_url: "https://i.postimg.cc/1tFh2LpZ/Sans-titre.png"
      },
      footer: {
        text: "by Gabizoc",
        icon_url: "https://i.postimg.cc/Jnt45Z4W/image-2024-08-26-205034675.png"
      },
      thumbnail: {
        url: "https://i.postimg.cc/Jnt45Z4W/image-2024-08-26-205034675.png"
      }
    });

  } catch (error) {
    await log('error', `Erreur scraping : ${error.message}`);
    sendDiscordWebhook({
      title: "Erreur Scraping",
      description: `Une erreur est survenue: ${error.message}`,
      color: 15158332,
      author: { name: "Gabizoc", icon_url: "https://i.postimg.cc/1tFh2LpZ/Sans-titre.png" },
      footer: { text: "by Gabizoc", icon_url: "https://i.postimg.cc/Jnt45Z4W/image-2024-08-26-205034675.png" },
      thumbnail: { url: "https://i.postimg.cc/Jnt45Z4W/image-2024-08-26-205034675.png" }
    });
  }
}

cron.schedule('0 0 * * *', async () => {
  await log('info', 'Cron scraping TikTok lancé...');
  scrapeData();
});

router.get('/gift', async (req, res) => {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: "Gift ID requis" });

  try {
    const gift = await getGiftData(id);
    gift ? res.json(gift) : res.status(404).json({ error: "Gift non trouvé" });
  } catch (error) {
    await log('error', `GET /gift : ${error.message}`);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.get('/giftall', async (req, res) => {
  try {
    const gifts = await getAllGifts();
    res.json(gifts);
  } catch (error) {
    await log('error', `GET /giftall : ${error.message}`);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
