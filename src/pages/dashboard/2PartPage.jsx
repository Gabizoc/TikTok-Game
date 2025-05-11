import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeftToLine,
  Settings,
  Timer,
  ChevronsLeft,
  Gift,
  Plus,
  Check,
  Play,
  Octagon,
  Maximize,
  Minimize,
  Info,
  Filter, 
  X,
  SlidersHorizontal,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";

// API URL as a constant to avoid repeating
const API_BASE_URL = "http://localhost:3010";
const WS_URL = "ws://localhost:3010";

const MobileBattle = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Game states
  const [initialTime, setInitialTime] = useState(300);
  const [time, setTime] = useState(initialTime);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [winner, setWinner] = useState(null);

  // Loading state
  const [isLoading, setIsLoading] = useState(true);
  const [isDataReady, setIsDataReady] = useState(false);

  // Game data
  const [checkedGifts, setCheckedGifts] = useState({});
  const [gifts, setGifts] = useState([]);
  const [filteredGifts, setFilteredGifts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState('default');
  const [priceRange, setPriceRange] = useState('all');
  const [showFilters, setShowFilters] = useState(false);


  // Camp configurations
  const [blueCampConfig, setBlueCampConfig] = useState({
    name: "Team1",
    images: [],
    selectedGifts: [],
  });

  const [redCampConfig, setRedCampConfig] = useState({
    name: "Team2",
    images: [],
    selectedGifts: [],
  });

  // Game statistics
  const [blueCampPercent, setBlueCampPercent] = useState(50);
  const [redCampPercent, setRedCampPercent] = useState(50);
  const [blueIndex, setBlueIndex] = useState(0);
  const [redIndex, setRedIndex] = useState(0);

  // Refs
  const socketRef = useRef(null);
  const timerRef = useRef(null);
  const bluePointsRef = useRef(0);
  const redPointsRef = useRef(0);

  const [bluePoints, setBluePoints] = useState(0);
  const [redPoints, setRedPoints] = useState(0);

  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const fetchGifts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/gift/giftall`);
        console.log(response.data.length);
        setGifts(response.data);
        setFilteredGifts(response.data);
        setIsDataReady(true);
      } catch (error) {
        console.error("Error fetching gifts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGifts();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredGifts(gifts);
    } else {
      const filtered = gifts.filter((gift) =>
        gift.nom?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredGifts(filtered);
    }
  }, [searchQuery, gifts]);

  useEffect(() => {
    if (!gifts.length) return;

    const blueSelectedGifts = Object.entries(checkedGifts)
      .filter(([_, value]) => value.blue)
      .map(([id]) => id);

    const redSelectedGifts = Object.entries(checkedGifts)
      .filter(([_, value]) => value.red)
      .map(([id]) => id);

    const getGiftImages = (selectedIds) => {
      const images = selectedIds
        .map((id) => {
          const gift = gifts.find((g) => g.id === id);
          return gift?.imageUrl;
        })
        .filter(Boolean);

      if (images.length > 0) {
        const repeatedImages = [...images];
        while (repeatedImages.length < 20) {
          repeatedImages.push(...images);
        }
        return repeatedImages;
      }

      return [];
    };

    const blueImages = getGiftImages(blueSelectedGifts);
    const redImages = getGiftImages(redSelectedGifts);

    setBlueCampConfig((prev) => ({
      ...prev,
      images: blueImages,
      selectedGifts: blueSelectedGifts,
    }));

    setRedCampConfig((prev) => ({
      ...prev,
      images: redImages,
      selectedGifts: redSelectedGifts,
    }));
  }, [checkedGifts, gifts]);

  useEffect(() => {
    if (
      blueCampConfig.images.length === 0 &&
      redCampConfig.images.length === 0
    ) {
      return;
    }

    const autoSlide = setInterval(() => {
      setBlueIndex((prevIndex) =>
        prevIndex + 9 >= blueCampConfig.images.length ? 0 : prevIndex + 9
      );

      setRedIndex((prevIndex) =>
        prevIndex + 9 >= redCampConfig.images.length ? 0 : prevIndex + 9
      );
    }, 3000);

    return () => clearInterval(autoSlide);
  }, [blueCampConfig.images.length, redCampConfig.images.length]);

  useEffect(() => {
    if (isGameRunning) {
      const start = Date.now();
      const duration = time * 1000;

      timerRef.current = setInterval(() => {
        const elapsed = Date.now() - start;
        const remaining = Math.max(0, Math.round((duration - elapsed) / 1000));

        setTime(remaining);

        if (remaining === 0) {
          if (blueCampPercent > redCampPercent) setWinner(blueCampConfig.name);
          else if (redCampPercent > blueCampPercent)
            setWinner(redCampConfig.name);
          else setWinner("Égalité");

          if (socketRef.current) socketRef.current.close();
          setIsGameRunning(false);
          clearInterval(timerRef.current);
        }
      }, 200);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isGameRunning, blueCampPercent, redCampPercent]);

  useEffect(() => {
    if (
      isGameRunning &&
      (!socketRef.current || socketRef.current.readyState === WebSocket.CLOSED)
    ) {
      socketRef.current = new WebSocket(WS_URL);

      bluePointsRef.current = 0;
      redPointsRef.current = 0;

      socketRef.current.onopen = () => {
        socketRef.current.send(
          JSON.stringify({
            type: "game01",
            blueGifts: blueCampConfig.selectedGifts,
            redGifts: redCampConfig.selectedGifts,
          })
        );
      };

      socketRef.current.onmessage = (event) => {
        try {
          const message = event.data;
          const data = JSON.parse(message);

          if (data.type === "error") {
            console.error(`Erreur WebSocket (${data.code}): ${data.message}`);
            alert(data.message);
            setIsGameRunning(false);
            return;
          }

          if (data.type === "points") {
            const { team, points } = data;

            if (team === "bleu") {
              bluePointsRef.current += points;
              setBluePoints(bluePointsRef.current);
            } else if (team === "rouge") {
              redPointsRef.current += points;
              setRedPoints(redPointsRef.current);
            }

            updatePercentages();
          }
        } catch (err) {
          console.error("Erreur de parsing message WebSocket :", err);
        }
      };

      socketRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        setIsGameRunning(false);
      };
    }

    return () => {
      if (socketRef.current) {
        console.log("Closing WebSocket connection");
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [
    isGameRunning,
    blueCampConfig.selectedGifts,
    redCampConfig.selectedGifts,
  ]);

  const updatePercentages = useCallback(() => {
    const bluePoints = bluePointsRef.current;
    const redPoints = redPointsRef.current;
    const totalPoints = bluePoints + redPoints;

    if (totalPoints === 0) {
      setBlueCampPercent(50);
      setRedCampPercent(50);
      return;
    }

    const bluePercent = (bluePoints / totalPoints) * 100;
    const redPercent = 100 - bluePercent;

    setBlueCampPercent(bluePercent);
    setRedCampPercent(redPercent);
  }, []);

  const handleGiftCheckboxChange = useCallback((giftId, checkboxType) => {
    setCheckedGifts((prevCheckedGifts) => {
      const newCheckedGifts = { ...prevCheckedGifts };

      if (!newCheckedGifts[giftId]) {
        newCheckedGifts[giftId] = { blue: false, red: false };
      }

      if (checkboxType === "blue") {
        const isBlueChecked = !newCheckedGifts[giftId].blue;
        newCheckedGifts[giftId] = {
          blue: isBlueChecked,
          red: isBlueChecked ? false : newCheckedGifts[giftId].red,
        };
      } else if (checkboxType === "red") {
        const isRedChecked = !newCheckedGifts[giftId].red;
        newCheckedGifts[giftId] = {
          blue: isRedChecked ? false : newCheckedGifts[giftId].blue,
          red: isRedChecked,
        };
      }

      return newCheckedGifts;
    });
  }, []);

  const handleStartStop = useCallback(() => {
    if (isGameRunning) {
      if (timerRef.current) clearInterval(timerRef.current);
      if (socketRef.current) socketRef.current.close();
      setIsGameRunning(false);
      socketRef.current = null;
    } else {
      setTime(initialTime);
      setIsGameRunning(true);
      setWinner(null);
    }
  }, [isGameRunning, initialTime]);

  const formatTime = useCallback((seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  }, []);

  const handleSearch = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  const filteredAndSortedGifts = useMemo(() => {
    let filtered = filteredGifts.filter(gift => {
      if (searchQuery && !gift.nom.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      if (priceRange === 'low' && gift.prix >= 100) return false;
      if (priceRange === 'mid' && (gift.prix < 100 || gift.prix > 500)) return false;
      if (priceRange === 'high' && gift.prix <= 500) return false;
      
      return true;
    });
    
    return filtered.sort((a, b) => {
      switch (sortOrder) {
        case 'price-asc':
          return a.prix - b.prix;
        case 'price-desc':
          return b.prix - a.prix;
        case 'name-asc':
          return a.nom.localeCompare(b.nom);
        case 'name-desc':
          return b.nom.localeCompare(a.nom);
        default:
          return 0;
      }
    });
  }, [filteredGifts, searchQuery, sortOrder, priceRange]);

  const paginateImages = useCallback((images) => {
    if (images.length === 0) {
      return [[null, null, null, null, null, null, null, null, null]];
    }

    const pages = [];
    for (let i = 0; i < images.length; i += 9) {
      const page = images.slice(i, i + 9);
      while (page.length < 9) {
        page.push(null);
      }
      pages.push(page);
    }
    return pages;
  }, []);

  const toggleFullscreen = () => {
    const element = document.documentElement;
    if (!document.fullscreenElement) {
      element.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  const bluePages = useMemo(
    () => paginateImages([...new Set(blueCampConfig.images)]),
    [blueCampConfig.images, paginateImages]
  );

  const redPages = useMemo(
    () => paginateImages([...new Set(redCampConfig.images)]),
    [redCampConfig.images, paginateImages]
  );

  const blueDisplayImages = useMemo(
    () =>
      bluePages.length > 0
        ? bluePages[Math.min(Math.floor(blueIndex / 9), bluePages.length - 1)]
        : Array(9).fill(null),
    [bluePages, blueIndex]
  );

  const redDisplayImages = useMemo(
    () =>
      redPages.length > 0
        ? redPages[Math.min(Math.floor(redIndex / 9), redPages.length - 1)]
        : Array(9).fill(null),
    [redPages, redIndex]
  );

  const blueSelectedCount = useMemo(
    () => Object.values(checkedGifts).filter((v) => v.blue).length,
    [checkedGifts]
  );

  const redSelectedCount = useMemo(
    () => Object.values(checkedGifts).filter((v) => v.red).length,
    [checkedGifts]
  );

  if (isLoading || !isDataReady) {
    return (
      <div className="w-screen h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] flex items-center justify-center relative overflow-hidden">
        <div className="absolute w-[150%] h-[150%] -top-1/4 -left-1/4 animate-spin-slow rounded-full bg-gradient-to-tr from-pink-500 via-pink-400 to-pink-500 opacity-20 blur-3xl" />

        <div className="z-10 flex flex-col items-center relative">
          <div className="w-24 h-24 border-4 border-pink-500 border-dashed rounded-full animate-spin-slow shadow-[0_0_25px_#ff0099] flex items-center justify-center">
            <img
              src="/tiktok.png"
              alt="TikTok Logo"
              className="w-10 h-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
            />
          </div>

          <p className="mt-6 text-white text-xl tracking-wider font-mono uppercase">
            {t("Loading")}...
          </p>

          <p className="mt-4 text-sm text-white/70 text-center">
            {t("Stuck here")} ?{" "}
            <button
              onClick={() => window.location.reload()}
              className="underline text-pink-500 hover:text-pink-300 transition"
            >
              {t("Click here to refresh the page")}
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center overflow-hidden text-white bg-gradient-to-r from-blue-500 via-blue-600 via-red-600 to-red-500">
      <div className="bg-gray-800 bg-opacity-70 backdrop-blur-md overflow-visible shadow-lg rounded-xl border border-gray-700 md:flex flex-col gap-4 p-4 mr-20 w-[300px] h-full">
        <div className="flex items-center justify-between gap-4">
          <motion.button
            className="w-1/3 flex items-center justify-center gap-2 text-pink-400 border border-pink-500 rounded-xl px-3 py-2 transition hover:bg-pink-500 hover:bg-opacity-10 hover:text-pink-500"
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/dashboard/game")}
          >
            <ArrowLeftToLine /> {t("Back")}
          </motion.button>

          <motion.button
            onClick={handleStartStop}
            className={`w-1/3 flex items-center justify-center rounded-xl border px-3 py-2 text-white transition-colors hover:bg-pink-500 hover:bg-opacity-10 ${
              isGameRunning
                ? "hover:text-red-700 border-red-500"
                : "hover:text-green-700 border-green-500"
            }`}
            whileTap={{ scale: 0.95 }}
          >
            {isGameRunning ? (
              <Octagon className="text-red-500" />
            ) : (
              <Play className="text-green-500" />
            )}
          </motion.button>

          <motion.button
            onClick={toggleFullscreen}
            className="w-1/3 flex items-center justify-center rounded-xl border px-3 py-2 text-white transition hover:bg-pink-500 hover:bg-opacity-10 border-pink-500"
            whileTap={{ scale: 0.95 }}
          >
            {isFullscreen ? (
              <Minimize className="text-pink-400" />
            ) : (
              <Maximize className="text-pink-400" />
            )}
          </motion.button>
        </div>

        <h2 className="text-2xl font-bold mb-2 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Settings className="text-pink-500" />
            {t("Settings")}
          </span>

          <a
            href="/forum"
            className="relative group text-blue-500 hover:text-blue-600 transition"
          >
            <Info className="w-5 h-5" />
            <span className="absolute bottom-full right-1/2 translate-x-1/2 mb-2 w-max bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition pointer-events-none z-10">
              {t("Need help")} ?
            </span>
          </a>
        </h2>
        <div>
          <label className="block mb-1 flex items-center">
            <Timer className="mr-1 text-pink-500" /> {t("Time (seconds)")}
          </label>
          <input
            type="number"
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
            value={initialTime}
            onChange={(e) => {
              const newTime = parseInt(e.target.value) || 0;
              setInitialTime(newTime);
              setTime(newTime);
            }}
            disabled={isGameRunning}
          />
        </div>

        <div>
          <label className="block mb-1 flex items-center">
            <ChevronsLeft className="mr-1 text-pink-500" />{" "}
            {t("Name Blue Camp")}
          </label>
          <input
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
            value={blueCampConfig.name}
            onChange={(e) =>
              setBlueCampConfig((prev) => ({ ...prev, name: e.target.value }))
            }
            disabled={isGameRunning}
          />
        </div>

        <div>
          <label className="block mb-1 flex items-center">
            <ChevronsLeft className="mr-1 text-pink-500" /> {t("Name Red Camp")}
          </label>
          <input
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
            value={redCampConfig.name}
            onChange={(e) =>
              setRedCampConfig((prev) => ({ ...prev, name: e.target.value }))
            }
            disabled={isGameRunning}
          />
        </div>

        <div className="block mb-1 flex items-center justify-between">
          <label className="lock mb-1 flex items-center">
            <Gift className="mr-1 text-pink-500" /> {t("Gift selection")}
          </label>
          <div className="flex items-center space-x-2 text-sm font-normal">
            <span className="px-2 py-1 bg-blue-600 rounded-lg">
              {blueSelectedCount}
            </span>
            <span className="px-2 py-1 bg-pink-600 rounded-lg">
              {redSelectedCount}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4 w-full">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder={t("Find a gift") + "..."}
                value={searchQuery}
                onChange={handleSearch}
                className="w-full py-2 pl-10 pr-10 rounded-2xl bg-gray-800 border border-gray-700 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
              />
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-500 w-5 h-5" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-3 bg-gray-800 border border-gray-700 text-pink-500 font-medium text-sm py-2 px-4 rounded-2xl hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300"
            >
              <SlidersHorizontal size={18} />
            </button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <select
                    className="bg-gray-800 border border-gray-700 text-sm text-white rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    onChange={(e) => setSortOrder(e.target.value)}
                    value={sortOrder}
                  >
                    <option value="default">{t("Default order")}</option>
                    <option value="price-asc">{t("Price: Low to High")}</option>
                    <option value="price-desc">{t("Price: High to Low")}</option>
                    <option value="name-asc">{t("Name: A-Z")}</option>
                    <option value="name-desc">{t("Name: Z-A")}</option>
                  </select>

                  <div className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-xl border border-gray-700">
                    {[
                      { label: "∅", value: "all" },
                      { label: "< 100", value: "low" },
                      { label: "100-500", value: "mid" },
                      { label: "> 500", value: "high" },
                    ].map(({ label, value }) => (
                      <button
                        key={value}
                        className={`text-xs font-medium px-3 py-1 rounded-xl transition ${
                          priceRange === value
                            ? "bg-pink-600 text-white"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                        onClick={() => setPriceRange(value)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="relative h-[540px] overflow-y-auto">
          <div className="absolute top-0 right-0 w-3 h-full bg-gray-800 rounded"></div>

          <div className="h-full overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-pink-500 scrollbar-track-gray-700">
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 min-w-[258px] min-h-[258px] mb-10">
              {isLoading ? (
                <div className="col-span-2 flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-500"></div>
                </div>
              ) : filteredAndSortedGifts.length > 0 ? (
                filteredAndSortedGifts.map((gift) => (
                  <div
                    key={gift.imageUrl}
                    className="bg-gray-900 rounded-xl p-4 flex flex-col items-center justify-between shadow-md"
                  >
                    <img
                      src={gift.imageUrl}
                      alt={gift.nom}
                      className="w-8 h-8 object-contain mb-2"
                    />
                    <p className="text-sm font-semibold text-center text-white">
                      {gift.nom}
                    </p>

                    <div className="flex items-center text-yellow-400 mt-1 text-sm">
                      {gift.prix}
                      <img
                        src="https://cdn3d.iconscout.com/3d/free/thumb/free-tiktok-coin-7455382-6220601.png"
                        alt="Coin"
                        className="w-4 h-4 ml-1"
                      />
                    </div>

                    <div className="flex gap-3 mt-3">
                      <button
                        onClick={() =>
                          handleGiftCheckboxChange(gift.id, "blue")
                        }
                        className={`w-8 h-8 flex items-center justify-center rounded-full border transition-colors ${
                          checkedGifts[gift.id]?.blue
                            ? "bg-blue-600 text-white border-blue-600"
                            : "text-blue-400 border-blue-600 hover:bg-blue-800"
                        }`}
                        disabled={isGameRunning}
                      >
                        {checkedGifts[gift.id]?.blue ? (
                          <Check size={18} />
                        ) : (
                          <Plus size={18} />
                        )}
                      </button>

                      <button
                        onClick={() => handleGiftCheckboxChange(gift.id, "red")}
                        className={`w-8 h-8 flex items-center justify-center rounded-full border transition-colors ${
                          checkedGifts[gift.id]?.red
                            ? "bg-pink-600 text-white border-pink-600"
                            : "text-pink-400 border-pink-600 hover:bg-pink-800"
                        }`}
                        disabled={isGameRunning}
                      >
                        {checkedGifts[gift.id]?.red ? (
                          <Check size={18} />
                        ) : (
                          <Plus size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                ))
              ) : searchQuery.trim() !== "" ? (
                <p className="col-span-2 text-center text-gray-400">
                  {t("Aucun résultat pour")} "{searchQuery}"
                </p>
              ) : (
                <p className="col-span-2 text-center text-gray-400">
                  {t("No gifts match the selected filters")}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="aspect-[9/16] h-full max-h-screen flex flex-row relative">
        {time === 0 && winner && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/80 px-8 py-6 rounded-xl shadow-xl text-center z-50">
            <h1 className="text-2xl font-bold text-white flex items-center justify-center whitespace-nowrap">
              🎉&nbsp;{winner === "Draw" ? "Draw" : `${winner} ${t("won")} !`}
            </h1>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-pink-500 hover:bg-pink-600 rounded-lg text-white"
            >
              {t("Restart")}
            </button>
          </div>
        )}

        <div className="w-1/2 h-full bg-blue-600">
          <div className="w-full py-4 text-center font-bold text-3xl text-white mt-[40%]">
            {blueCampConfig.name.toUpperCase()}
            <p className="text-xl text-blue-300 font-mono">
              {bluePoints} points
            </p>
          </div>
        </div>

        <div className="absolute top-[40%] left-1/2 w-11/12 max-w-sm h-20 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-300 shadow-lg flex overflow-hidden z-10">
          <motion.div
            className="bg-blue-500 text-white text-sm font-bold flex items-center justify-center"
            animate={{ width: `${blueCampPercent}%` }}
            transition={{ duration: 0.5 }}
          >
            {blueCampPercent.toFixed(1)}%
          </motion.div>
          <motion.div
            className="bg-red-500 text-white text-sm font-bold flex items-center justify-center"
            animate={{ width: `${redCampPercent}%` }}
            transition={{ duration: 0.5 }}
          >
            {redCampPercent.toFixed(1)}%
          </motion.div>
        </div>

        <div className="absolute bottom-[50%] left-1/2 transform -translate-x-1/2 text-xl font-bold text-white z-20">
          1 {t("coin")} = 1 point
        </div>

        <div className="absolute top-[25%] left-1/2 transform -translate-x-1/2 text-4xl font-bold z-20">
          <motion.div
            animate={{
              color: time <= 5 ? ["#ffffff", "#ff0000", "#ffffff"] : "#ffffff",
            }}
            transition={{
              duration: 0.5,
              repeat: time <= 5 ? Infinity : 0,
              repeatType: "loop",
            }}
          >
            {formatTime(time)}
          </motion.div>
        </div>

        <div className="absolute top-[55%] left-1/2 transform -translate-x-1/2 w-full flex justify-between z-10">
          <div className="w-1/2">
            {blueDisplayImages &&
            blueDisplayImages.filter((image) => image !== null).length > 0 ? (
              <div className="grid grid-cols-3 gap-1">
                {/* Filtre d'abord les images non nulles */}
                {blueDisplayImages
                  .filter((src) => src !== null)
                  .map((src, i) => (
                    <div
                      key={`blue-${i}-${blueIndex}`}
                      className="flex justify-center"
                    >
                      <img
                        src={src}
                        alt={`blue-img-${i}`}
                        className="w-12 h-12 object-cover rounded bg-blue-800 p-1"
                        loading="lazy"
                      />
                    </div>
                  ))}
              </div>
            ) : (
              <div className="flex items-center justify-center text-center text-white text-sm p-2">
                {t("Select gifts for the blue camp")}
              </div>
            )}
          </div>
          <div className="w-1/2">
            {redDisplayImages &&
            redDisplayImages.filter((image) => image !== null).length > 0 ? (
              <div className="grid grid-cols-3 gap-1">
                {/* Filtre d'abord les images non nulles */}
                {redDisplayImages
                  .filter((src) => src !== null)
                  .map((src, i) => (
                    <div
                      key={`red-${i}-${redIndex}`}
                      className="flex justify-center"
                    >
                      <img
                        src={src}
                        alt={`red-img-${i}`}
                        className="w-12 h-12 object-cover rounded bg-red-800 p-1"
                        loading="lazy"
                      />
                    </div>
                  ))}
              </div>
            ) : (
              <div className="flex items-center justify-center text-center text-white text-sm p-2">
                {t("Select gifts for the red camp")}
              </div>
            )}
          </div>
        </div>

        <div className="w-1/2 h-full bg-red-600 flex flex-col items-center">
          <div className="w-full py-4 text-center font-bold text-3xl text-white mt-[40%]">
            {redCampConfig.name.toUpperCase()}
            <p className="text-xl text-red-300 font-mono">{redPoints} points</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileBattle;
