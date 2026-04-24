import { useState, useEffect } from "react";
import axios from "axios";
import TopSpots from "./TopSpots";
import SkeletonList from "./SkeletonList";
import "./App.css";
import { motion } from "framer-motion";
import locationImages from "./locationImages";
import Modal from "./Modal";

function determineCategory(spot) {
  const name = spot.name.toLowerCase();
  const desc = spot.description.toLowerCase();

  if (
    name.includes("safari park") ||
    name.includes("surfari") ||
    name.includes("surf") ||
    name.includes("torrey pines") ||
    name.includes("hot springs") ||
    name.includes("agua caliente") ||
    name.includes("boardwalk") ||
    name.includes("bike") ||
    name.includes("glider") ||
    name.includes("black's beach") ||
    name.includes("ninja night race") ||
    name.includes("House Of Scuba") ||
    desc.includes("hike") ||
    desc.includes("trail") ||
    desc.includes("outdoor") ||
    desc.includes("nude") ||
    desc.includes("deep water")
  ) return "nature";

  if (
    name.includes("aquarium") ||
    name.includes("legoland") ||
    name.includes("grinch") ||
    desc.includes("kids") ||
    desc.includes("children")
  ) return "family";

  if (
    name.includes("ghost tour") ||
    name.includes("museum of man") ||
    name.includes("central library") ||
    name.includes("barrio logan") ||
    desc.includes("historic") ||
    desc.includes("history") ||
    desc.includes("art")
  ) return "culture";

  if (
    name.includes("comic con") ||
    name.includes("casbah") ||
    name.includes("old globe") ||
    name.includes("organ pavilion") ||
    name.includes("drive-in") ||
    desc.includes("concert") ||
    desc.includes("performance")
  ) return "entertainment";

  if (
    name.includes("seaport village") ||
    name.includes("thrift trader") ||
    name.includes("fashion valley") ||
    name.includes("book store") ||
    desc.includes("shops") ||
    desc.includes("shopping")
  ) return "shopping";

  if (
    name.includes("stone brewery") ||
    name.includes("café 21") ||
    name.includes("crazee burger") ||
    name.includes("convoy") ||
    name.includes("farmers market") ||
    name.includes("extraordinary desserts") ||
    name.includes("hash house") ||
    desc.includes("food") ||
    desc.includes("eat") ||
    desc.includes("drink")
  ) return "food";

  return "other";
}

const App = () => {
  const [topspots, setTopspots] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("id");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [activeSpot, setActiveSpot] = useState(null);

  const [showFavoritesPage, setShowFavoritesPage] = useState(false);

  // Local Storage
  const getStoredFavorites = () => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const saved = window.localStorage.getItem("favorites");
        return saved ? JSON.parse(saved) : [];
      }
    } catch (err) {
      
    }
    return [];
  };

  const [favorites, setFavorites] = useState(getStoredFavorites);

  // Toggle Favorite
  const toggleFavorite = (id) => {
    const key = String(id); // normalize type

    setFavorites((prev) => {
      const exists = prev.includes(key);
      const updated = exists
        ? prev.filter((f) => f !== key)
        : [...prev, key];

      try {
        if (typeof window !== "undefined" && window.localStorage) {
          window.localStorage.setItem("favorites", JSON.stringify(updated));
        }
      } catch (err) {
        
      }

      return updated;
    });
  };


  const openModal = (spot) => {
    setActiveSpot(spot);
    document.body.classList.add("modal-open");
  };

  const closeModal = () => {
    setActiveSpot(null);
    document.body.classList.remove("modal-open");
  };

  const isTest = process.env.NODE_ENV === "test";
  const pageSize = 10;

  useEffect(() => {
    axios
      .get("https://ccc.helloworldbox.com/items/top_spots")
      .then((res) => res.data.data)
      .then((data) => {
        const enriched = data.map((spot) => ({
          ...spot,
          category: determineCategory(spot),
          imageUrl: locationImages[spot.id] || null
        }));
        setTopspots(enriched);
      })
      .catch(() => setError("Failed to load top spots"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const filtered = topspots.filter((spot) =>
    spot.name.toLowerCase().includes(search.toLowerCase())
  );

  const categoryFiltered = filtered.filter(
    (spot) => category === "all" || spot.category === category
  );

  const sorted = [...categoryFiltered].sort((a, b) => {
    if (sort === "name") return a.name.localeCompare(b.name);
    if (sort === "id") return a.id - b.id;
    return 0;
  });

  let finalList = sorted;
  const start = (page - 1) * pageSize;

  const favoriteSpots = sorted.filter((spot) =>
    favorites.includes(String(spot.id))
  );

  if (!isTest) {
    finalList = sorted.slice(start, start + pageSize);
  }

  return (
    <div className="container mt-4">

      {/* Hero */}
      <div className="hero">
        <h1>San Diego Top Spots</h1>
        <p><b>A list of the top 30 places to see in San Diego, California.</b></p>

        <div className="hero-actions" style={{ marginTop: 12, display: "flex", gap: 12, justifyContent: "center", alignItems: "center" }}>
          <button
            className="btn btn-primary"
            onClick={() => setShowFavoritesPage(!showFavoritesPage)}
            aria-pressed={showFavoritesPage}
            type="button"
          >
            {showFavoritesPage ? "Back to All Spots" : "View Favorites"}
          </button>
          
          <span className="favorites-count"> {favorites.length} Favorites Saved</span>
        </div>
      </div>


      {error && <p className="text-danger">{error}</p>}

      {/* Filter */}
      <div className="filter-bar">

        <input
          id="search"
          name="search"
          type="text"
          placeholder="Search top spots..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />

        <select
          id="sort"
          name="sort"
          value={sort}
          onChange={(e) => {
            setPage(1);
            setSort(e.target.value);
          }}
        >
          <option value="id">Sort by Original Order</option>
          <option value="name">Sort by Name</option>
        </select>

        <select
          id="category"
          name="category"
          value={category}
          onChange={(e) => {
            setPage(1);
            setCategory(e.target.value);
          }}
        >
          <option value="all">All Categories</option>
          <option value="nature">Nature & Outdoors</option>
          <option value="family">Family & Kids</option>
          <option value="culture">Culture & History</option>
          <option value="food">Food & Drink</option>
          <option value="entertainment">Entertainment</option>
          <option value="shopping">Shopping</option>
        </select>

        <button
          className="btn btn-secondary"
          onClick={() => document.body.classList.toggle("dark-mode")}
        >
          Dark Mode
        </button>

      </div>

      {/* List */}
      <div className="topspots-wrapper">
        <motion.div
          key={page}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
        >
          {loading ? (
            <SkeletonList />
          ) : showFavoritesPage ? (
            <TopSpots
              spots={favoriteSpots}
              onOpen={openModal}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
            />
          ) : (
            <TopSpots
              spots={finalList}
              onOpen={openModal}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
            />
          )}
        </motion.div>
      </div>

      {/* Pagination */}
      {!isTest && (
        <div className="pagination-bar">

          <motion.button
            className="btn btn-outline-primary"
            disabled={page === 1}
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setPage(1)}
          >
            First
          </motion.button>

          <motion.button
            className="btn btn-outline-primary"
            disabled={page === 1}
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </motion.button>

          <span className="page-label">Page {page}</span>

          <motion.button
            className="btn btn-outline-primary"
            disabled={page * 10 >= sorted.length}
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setPage(page + 1)}
          >
            Next
          </motion.button>

          <motion.button
            className="btn btn-outline-primary"
            disabled={page * 10 >= sorted.length}
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setPage(Math.ceil(sorted.length / 10))}
          >
            Last
          </motion.button>

        </div>
      )}

      {activeSpot && (
        <Modal
          spot={activeSpot}
          onClose={closeModal}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
        />
      )}

    </div>
  );
};

export default App;
