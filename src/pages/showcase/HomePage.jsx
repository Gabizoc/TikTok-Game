import React, { useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  Activity,
  BarChart3,
  Gamepad2,
  CheckCircle,
  ArrowRight,
  Play,
  Zap,
  Shield,
  Globe,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  Rocket,
  Users,
  TrendingUp,
  Award,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";

import Header from "../../components/showcase/commun/Header";
import Footer from "../../components/showcase/commun/Footer";

// SEO Component
const SEOHead = () => {
  const { t, i18n } = useTranslation();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: t("seo.appName"),
    description: t("seo.description"),
    applicationCategory: "LiveStreamingApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    creator: {
      "@type": "Organization",
      name: "Animated Live",
    },
    featureList: [
      t("seo.features.realTime"),
      t("seo.features.analytics"),
      t("seo.features.games"),
      t("seo.features.tiktokIntegration"),
    ],
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{t("seo.title")}</title>
      <meta name="title" content={t("seo.title")} />
      <meta name="description" content={t("seo.description")} />
      <meta name="keywords" content={t("seo.keywords")} />
      <meta name="author" content="Animated Live" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content={i18n.language} />

      {/* Canonical URL */}
      <link rel="canonical" href="https://animatedlive.com" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://animatedlive.com" />
      <meta property="og:title" content={t("seo.ogTitle")} />
      <meta property="og:description" content={t("seo.ogDescription")} />
      <meta
        property="og:image"
        content="https://animatedlive.com/og-image.png"
      />
      <meta property="og:image:alt" content={t("seo.ogImageAlt")} />
      <meta property="og:site_name" content="Animated Live" />
      <meta
        property="og:locale"
        content={i18n.language === "fr" ? "fr_FR" : "en_US"}
      />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="https://animatedlive.com" />
      <meta property="twitter:title" content={t("seo.twitterTitle")} />
      <meta
        property="twitter:description"
        content={t("seo.twitterDescription")}
      />
      <meta
        property="twitter:image"
        content="https://animatedlive.com/twitter-image.png"
      />
      <meta property="twitter:creator" content="@AnimatedLive" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>

      {/* Hreflang for multilingual */}
      <link rel="alternate" hrefLang="en" href="https://animatedlive.com/en" />
      <link rel="alternate" hrefLang="fr" href="https://animatedlive.com/fr" />
      <link
        rel="alternate"
        hrefLang="x-default"
        href="https://animatedlive.com"
      />
    </Helmet>
  );
};

// Main Component
const MainPage = () => {
  const { t } = useTranslation("showcase-mainpage");
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -50]);

  const features = [
    {
      icon: Activity,
      title: t("features.realTime.title"),
      description: t("features.realTime.description"),
      gradient: "from-amber-400 to-rose-500",
    },
    {
      icon: BarChart3,
      title: t("features.analytics.title"),
      description: t("features.analytics.description"),
      gradient: "from-emerald-400 to-cyan-500",
    },
    {
      icon: Gamepad2,
      title: t("features.interactive.title"),
      description: t("features.interactive.description"),
      gradient: "from-indigo-500 to-fuchsia-500",
    },
  ];

  const solutions = [
    {
      title: t("solutions.gameEngine.title"),
      description: t("solutions.gameEngine.description"),
      features: [
        t("solutions.gameEngine.features.sync"),
        t("solutions.gameEngine.features.rewards"),
        t("solutions.gameEngine.features.detection"),
        t("solutions.gameEngine.features.integration"),
      ],
    },
    {
      title: t("solutions.analytics.title"),
      description: t("solutions.analytics.description"),
      features: [
        t("solutions.analytics.features.tracking"),
        t("solutions.analytics.features.data"),
        t("solutions.analytics.features.detection"),
        t("solutions.analytics.features.insights"),
      ],
    },
  ];

  const stats = [
    { icon: Users, value: "10K+", label: t("stats.users") },
    { icon: TrendingUp, value: "99.9%", label: t("stats.availability") },
    { icon: Zap, value: "2ms", label: t("stats.responseTime") },
    { icon: Award, value: "150+", label: t("stats.countries") },
  ];

  const faqs = [
    {
      question: t("faq.interactions.question"),
      answer: t("faq.interactions.answer"),
    },
    {
      question: t("faq.customize.question"),
      answer: t("faq.customize.answer"),
    },
    {
      question: t("faq.tiktok.question"),
      answer: t("faq.tiktok.answer"),
    },
    {
      question: t("faq.support.question"),
      answer: t("faq.support.answer"),
    },
  ];

  return (
    <>
      <SEOHead />
      <div className="bg-black text-white font-sans overflow-x-hidden w-full">
        <Header />

        {/* Hero Section */}
        <section
          className="relative min-h-screen flex items-center justify-center px-6"
          role="banner"
          aria-label={t("hero.ariaLabel")}
        >
          {/* Background Gradient */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-pink-900/30 via-purple-900/20 to-black/50"
            aria-hidden="true"
          ></div>

          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-10" aria-hidden="true">
            <div className="h-full w-full bg-grid-pattern"></div>
          </div>

          <div className="relative z-10 text-center max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="mb-6"
            >
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-sm font-medium mb-8">
                <Sparkles className="w-4 h-4 mr-2" aria-hidden="true" />
                <span>{t("hero.badge.text")}</span>
                <span className="underline mx-1">{t("hero.badge.brand")}</span>
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight"
            >
              {t("hero.title.start")}{" "}
              <span className="bg-gradient-to-r from-pink-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                {t("hero.title.highlight")}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              {t("hero.description")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(219, 39, 119, 0.4)",
                }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 px-8 py-4 rounded-full font-semibold text-lg flex items-center space-x-2 shadow-2xl transition-all duration-300"
                aria-label={t("hero.cta.primary.aria")}
              >
                <span>{t("hero.cta.primary.text")}</span>
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="border border-white/20 hover:border-white/40 px-8 py-4 rounded-full font-semibold text-lg flex items-center space-x-2 backdrop-blur-sm transition-all duration-300"
                aria-label={t("hero.cta.secondary.aria")}
              >
                <Play className="w-5 h-5" aria-hidden="true" />
                <span>{t("hero.cta.secondary.text")}</span>
              </motion.button>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            aria-label={t("hero.scroll.aria")}
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="flex flex-col items-center text-gray-400"
            >
              <span className="text-sm mb-2">{t("hero.scroll.text")}</span>
              <ChevronDown className="w-5 h-5" aria-hidden="true" />
            </motion.div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="py-32 px-6 relative"
          aria-label={t("features.section.aria")}
        >
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-20"
            >
              <h2 className="text-4xl md:text-6xl font-bold mb-6">
                {t("features.title.main")}{" "}
                <span className="bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
                  {t("features.title.highlight")}
                </span>
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                {t("features.subtitle")}
              </p>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-8 items-stretch">
              {features.map((feature, i) => (
                <motion.article
                  key={feature.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.2 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="relative group h-full flex"
                >
                  <div
                    className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-2xl blur-xl"
                    aria-hidden="true"
                  />
                  <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 hover:border-gray-700 p-8 rounded-2xl transition-all duration-500 flex flex-col flex-1">
                    <div
                      className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.gradient} mb-6 w-fit`}
                      aria-hidden="true"
                    >
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                    <p className="text-gray-400 leading-relaxed mb-6 flex-grow">
                      {feature.description}
                    </p>
                    {/* Feature visual placeholder */}
                    <div
                      className="h-48 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center border border-gray-700"
                      aria-hidden="true"
                    >
                      <div className="flex items-center space-x-2 text-gray-500">
                        <feature.icon className="w-8 h-8" />
                        <span>{t("features.demo")}</span>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
          className="w-1/2 h-1 mx-auto bg-gradient-to-r from-pink-500 to-purple-500 rounded-full opacity-30 origin-center"
          aria-hidden="true"
        />

        {/* Solutions Section */}
        <section
          id="solutions"
          className="py-32 px-6 relative"
          aria-label={t("solutions.section.aria")}
        >
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-20"
            >
              <h2 className="text-4xl md:text-6xl font-bold mb-6">
                {t("solutions.title.main")}{" "}
                <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                  {t("solutions.title.highlight")}
                </span>
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                {t("solutions.subtitle")}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12">
              {solutions.map((solution, i) => (
                <motion.article
                  key={solution.title}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: i * 0.2 }}
                  className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 p-8 rounded-2xl"
                >
                  <h3 className="text-3xl font-bold mb-4">{solution.title}</h3>
                  <p className="text-gray-400 mb-6 leading-relaxed">
                    {solution.description}
                  </p>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {solution.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center space-x-2"
                      >
                        <CheckCircle
                          className="w-4 h-4 text-green-400"
                          aria-hidden="true"
                        />
                        <span className="text-sm text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Solution visual */}
                  <div
                    className="h-64 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center border border-gray-700"
                    aria-hidden="true"
                  >
                    <div className="text-center">
                      <Rocket className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                      <span className="text-gray-400">
                        {t("solutions.preview")}
                      </span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
          className="w-1/2 h-1 mx-auto bg-gradient-to-r from-pink-500 to-purple-500 rounded-full opacity-30 origin-center"
          aria-hidden="true"
        />

        {/* Stats Section */}
        <section
          className="px-6 my-32 relative"
          aria-label={t("stats.section.aria")}
        >
          <div className="max-w-7xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-5xl font-bold mb-16"
            >
              {t("stats.title.main")}{" "}
              <span className="bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
                {t("stats.title.highlight")}
              </span>
            </motion.h2>

            <div className="relative p-8 rounded-3xl border border-white/20 bg-gray-900/40 backdrop-blur-sm overflow-hidden">
              {/* Separator lines */}
              <div
                className="absolute left-1/4 top-10 bottom-10 w-0.5 bg-white/20 rounded-full transform -translate-x-1/2"
                aria-hidden="true"
              />
              <div
                className="absolute left-2/4 top-10 bottom-10 w-0.5 bg-white/20 rounded-full transform -translate-x-1/2"
                aria-hidden="true"
              />
              <div
                className="absolute left-3/4 top-10 bottom-10 w-0.5 bg-white/20 rounded-full transform -translate-x-1/2"
                aria-hidden="true"
              />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    className="text-center"
                  >
                    <stat.icon
                      className="w-8 h-8 text-pink-400 mx-auto mb-4"
                      aria-hidden="true"
                    />
                    <div className="text-3xl md:text-4xl font-bold mb-2">
                      {stat.value}
                    </div>
                    <div className="text-gray-400">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section
          id="faq"
          className="py-32 px-6 relative bg-gray-900/30"
          aria-label={t("faq.section.aria")}
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16 "
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                {t("faq.title.main")}{" "}
                <span className="bg-gradient-to-r from-pink-400 to-blue-500 bg-clip-text text-transparent">
                  {t("faq.title.highlight")}
                </span>
              </h2>
              <p className="text-xl text-gray-400">{t("faq.subtitle")}</p>
            </motion.div>

            <div className="space-y-6">
              {faqs.map((faq, i) => (
                <motion.article
                  key={faq.question}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 hover:border-gray-700 transition-colors duration-300"
                >
                  <h3 className="text-xl font-semibold mb-4 text-white">
                    {faq.question}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section
          className="py-32 px-6 relative"
          aria-label={t("cta.section.aria")}
        >
          <div
            className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"
            aria-hidden="true"
          ></div>
          <div className="relative max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                {t("cta.title.main")}{" "}
                <span className="bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
                  {t("cta.title.highlight")}
                </span>
              </h2>
              <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto">
                {t("cta.description")}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 20px 40px rgba(219, 39, 119, 0.4)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 px-10 py-4 rounded-full font-semibold text-lg flex items-center space-x-2 shadow-2xl transition-all duration-300"
                  aria-label={t("cta.primary.aria")}
                >
                  <span>{t("cta.primary.text")}</span>
                  <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="border border-white/20 hover:border-white/40 px-10 py-4 rounded-full font-semibold text-lg transition-all duration-300"
                  aria-label={t("cta.secondary.aria")}
                >
                  {t("cta.secondary.text")}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <div className="bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-black relative">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default MainPage;
