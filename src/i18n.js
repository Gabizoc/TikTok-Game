import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import des fichiers JSON par page/namespace
import dashboardPage1En from "./language/en/dashboard/en.json";
import dashboardPage1Fr from "./language/fr/dashboard/fr.json";

import showcaseMainPageEn from "./language/en/showcase/MainPage.json";
import showcaseMainPageFr from "./language/fr/showcase/MainPage.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        "dashboard-page1": dashboardPage1En,
        "showcase-mainpage": showcaseMainPageEn,
      },
      fr: {
        "dashboard-page1": dashboardPage1Fr,
        "showcase-mainpage": showcaseMainPageFr,
      },
    },
    supportedLngs: ["en", "fr"],
    fallbackLng: "en",
    defaultNS: "dashboard-page1",
    ns: [
      "dashboard-page1",
      "dashboard-page2",
      "showcase-pageA",
      "showcase-pageB",
    ],
    detection: {
      order: ["localStorage", "cookie", "navigator"],
      caches: ["localStorage"],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
