import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          "Dashboard": "Dashboard",
          "Total Spectateurs": "Total Viewers",
          "Total Stream": "Total Streams",
          "Total Gain": "Total Gains",
          "Total Viewers": "Total Viewers",
          "Gain Overview": "Gain Overview",
          "Gift Repartition": "Gift Repartition",
          "Viewers Repartition": "Viewers Repartition",
        },
      },
      fr: {
        translation: {
          "Dashboard": "Tableau de bord",
          "Total Gain": "Total des Gains",
          "Total Viewers": "Total des Spectateurs",
          "Total Spectateurs": "Total des Spectateurs",
          "Total Stream": "Total des Streams",
          "Gain Overview": "Aperçu des Gains",
          "Gift Repartition": "Répartition des Cadeaux",
          "Viewers Repartition": "Répartition des Spectateurs",
        },
      },
    },
    lng: "fr",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;