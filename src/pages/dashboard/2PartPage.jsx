import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
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
  const [initialTime, setInitialTime] = useState(60);
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

  // Camp configurations
  const [blueCampConfig, setBlueCampConfig] = useState({
    name: "Canoe",
    images: [],
    selectedGifts: [],
  });

  const [redCampConfig, setRedCampConfig] = useState({
    name: "Kayak",
    images: [],
    selectedGifts: [],
  });

  // Game statistics
  const [blueCampPercent, setBlueCampPercent] = useState(43);
  const [redCampPercent, setRedCampPercent] = useState(57);
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

  // Fetch gifts data on component mount
  useEffect(() => {
    const fetchGifts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/gift/giftall`);
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

  // Handle search filtering
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

  // Calculate and update camp images based on selected gifts
  useEffect(() => {
    if (!gifts.length) return;

    // Get selected gifts for each camp
    const blueSelectedGifts = Object.entries(checkedGifts)
      .filter(([_, value]) => value.blue)
      .map(([id]) => id);

    const redSelectedGifts = Object.entries(checkedGifts)
      .filter(([_, value]) => value.red)
      .map(([id]) => id);

    // Get gift images for each camp
    const getGiftImages = (selectedIds) => {
      const images = selectedIds
        .map((id) => {
          const gift = gifts.find((g) => g.id === id);
          return gift?.imageUrl;
        })
        .filter(Boolean);

      // Repeat images if needed for animation
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

    // Update camp configurations
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

  // Auto slide camp images
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

  // Game timer logic
  useEffect(() => {
    if (isGameRunning) {
      const start = Date.now();
      const duration = time * 1000; // time en secondes -> ms

      timerRef.current = setInterval(() => {
        const elapsed = Date.now() - start;
        const remaining = Math.max(0, Math.round((duration - elapsed) / 1000));

        setTime(remaining);

        if (remaining === 0) {
          // Déterminer le gagnant
          if (blueCampPercent > redCampPercent) setWinner(blueCampConfig.name);
          else if (redCampPercent > blueCampPercent)
            setWinner(redCampConfig.name);
          else setWinner("Égalité");

          // Clean-up
          if (socketRef.current) socketRef.current.close();
          setIsGameRunning(false);
          clearInterval(timerRef.current);
        }
      }, 200); // tick plus fréquent pour meilleure précision
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isGameRunning, blueCampPercent, redCampPercent]);

  // WebSocket connection management
  useEffect(() => {
    if (
      isGameRunning &&
      (!socketRef.current || socketRef.current.readyState === WebSocket.CLOSED)
    ) {
      // Initialize WebSocket connection
      socketRef.current = new WebSocket(WS_URL);

      // Reset points
      bluePointsRef.current = 0;
      redPointsRef.current = 0;

      // Send selected gift IDs to WebSocket
      socketRef.current.onopen = () => {
        socketRef.current.send(
          JSON.stringify({
            type: "game01",
            tiktokUsername: "ellioxce3ds",
            blueGifts: blueCampConfig.selectedGifts,
            redGifts: redCampConfig.selectedGifts,
          })
        );
      };

      // Set up WebSocket message handler
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

      // Handle WebSocket errors
      socketRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        setIsGameRunning(false);
      };
    }

    // Cleanup: close WebSocket when game stops or component unmounts
    return () => {
      if (socketRef.current) {
        console.log("Closing WebSocket connection");
        socketRef.current.close();
        socketRef.current = null; // Réinitialiser la référence pour éviter les doubles connexions
      }
    };
  }, [
    isGameRunning,
    blueCampConfig.selectedGifts,
    redCampConfig.selectedGifts,
  ]);

  // Utility function to calculate gauge percentages
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

  // Gift checkbox handler with optimized state updates
  const handleGiftCheckboxChange = useCallback((giftId, checkboxType) => {
    setCheckedGifts((prevCheckedGifts) => {
      const newCheckedGifts = { ...prevCheckedGifts };

      // Initialize gift selection state if needed
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

  // Start/stop game handler
  const handleStartStop = useCallback(() => {
    if (isGameRunning) {
      // Stop game
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

  // Format time display as "MM:SS"
  const formatTime = useCallback((seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  }, []);

  // Search input handler
  const handleSearch = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  // Utility for creating paginated image grids
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

  // Memoize paginated images to prevent unnecessary recalculations
  const bluePages = useMemo(
    () => paginateImages([...new Set(blueCampConfig.images)]),
    [blueCampConfig.images, paginateImages]
  );

  const redPages = useMemo(
    () => paginateImages([...new Set(redCampConfig.images)]),
    [redCampConfig.images, paginateImages]
  );

  // Current pages to display
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

  // Count selected gifts for each camp
  const blueSelectedCount = useMemo(
    () => Object.values(checkedGifts).filter((v) => v.blue).length,
    [checkedGifts]
  );

  const redSelectedCount = useMemo(
    () => Object.values(checkedGifts).filter((v) => v.red).length,
    [checkedGifts]
  );

  // Show loading screen until all data is ready
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
      {/* Configuration Panel */}
      <div className="bg-gray-800 bg-opacity-70 backdrop-blur-md overflow-visible shadow-lg rounded-xl border border-gray-700 md:flex flex-col gap-4 p-4 mr-20 w-[300px] h-full">
        <div className="flex items-center justify-between gap-4">
          <motion.button
            className="w-1/3 flex items-center justify-center gap-2 text-pink-400 border border-pink-500 rounded-xl px-3 py-2 transition hover:bg-pink-500 hover:bg-opacity-10 hover:text-pink-500"
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/dashboard")}
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

        <h2 className="text-2xl font-bold mb-2 flex items-center">
          <Settings className="mr-2 text-pink-500" /> {t("Settings")}
        </h2>

        {/* Time Config */}
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

        {/* Blue Camp Name */}
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

        {/* Red Camp Name */}
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

        {/* Gift Selection Title */}
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

        {/* Search Bar */}
        <div>
          <input
            type="text"
            placeholder={t("Find a gift") + "..."}
            value={searchQuery}
            onChange={handleSearch}
            className="w-full p-2 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
          />
        </div>

        {/* Gift List */}
        <div className="relative h-[600px] overflow-y-auto">
          <div className="absolute top-0 right-0 w-3 h-full bg-gray-800 rounded"></div>

          <div className="h-full overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-pink-500 scrollbar-track-gray-700">
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 min-w-[258px] mb-4">
              {filteredGifts.length > 0 ? (
                filteredGifts.map((gift) => (
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

                    {/* Price */}
                    <div className="flex items-center text-yellow-400 mt-1 text-sm">
                      {gift.prix}
                      <img
                        src="https://cdn3d.iconscout.com/3d/free/thumb/free-tiktok-coin-7455382-6220601.png"
                        alt="Coin"
                        className="w-4 h-4 mr-1"
                      />
                    </div>

                    {/* Selection Buttons */}
                    <div className="flex gap-3 mt-3">
                      {/* Blue Camp */}
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

                      {/* Red Camp */}
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
                  {t("Loading gifts")}...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Game View */}
      <div className="aspect-[9/16] h-full max-h-screen flex flex-row relative">
        {/* Winner Overlay */}
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

        {/* Blue Camp Side */}
        <div className="w-1/2 h-full bg-blue-600">
          <div className="w-full py-4 text-center font-bold text-xl text-white mt-5">
            {blueCampConfig.name.toUpperCase()}
            <p className="text-lg text-blue-300 font-mono">
              {bluePoints} points
            </p>
          </div>
        </div>

        {/* Progress Bar */}
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

        {/* Point Information */}
        <div className="absolute bottom-[50%] left-1/2 transform -translate-x-1/2 text-xl font-bold text-white z-20">
          1 {t("coins")} = 1 point
        </div>

        {/* Timer */}
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

        {/* Gift Displays */}
        <div className="absolute bottom-[10%] left-1/2 transform -translate-x-1/2 w-full flex justify-between z-10">
          {/* Blue Camp Gifts */}
          <div className="w-1/2 grid grid-cols-3 gap-1">
            {blueDisplayImages &&
            blueDisplayImages.filter((image) => image !== null).length > 0 ? (
              blueDisplayImages.map((src, i) =>
                src !== null ? (
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
                ) : null
              )
            ) : (
              <div className="col-span-3 flex items-center justify-center text-center text-white text-sm p-2">
                {t("Select gifts for the blue camp")}
              </div>
            )}
          </div>

          {/* Red Camp Gifts */}
          <div className="w-1/2 grid grid-cols-3 gap-1">
            {redDisplayImages &&
            redDisplayImages.filter((image) => image !== null).length > 0 ? (
              redDisplayImages.map((src, i) =>
                src !== null ? (
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
                ) : null
              )
            ) : (
              <div className="col-span-3 flex items-center justify-center text-center text-white text-sm p-2">
                {t("Select gifts for the red camp")}
              </div>
            )}
          </div>
        </div>

        {/* Red Camp Side */}
        <div className="w-1/2 h-full bg-red-600 flex flex-col items-center">
          <div className="w-full py-4 text-center font-bold text-xl text-white mt-5">
            {redCampConfig.name.toUpperCase()}
            <p className="text-lg text-red-300 font-mono">{redPoints} points</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileBattle;
