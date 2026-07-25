import { motion } from "framer-motion";

const categoryIcons = {
  nature: "🌿",
  family: "👨‍👩‍👧",
  culture: "🏛️",
  food: "🍽️",
  entertainment: "🎭",
  shopping: "🛍️",
  other: "📍"
};

const TopSpot = ({ spot, onOpen, favorites, toggleFavorite }) => {
  const { name, description, location, category, imageUrl } = spot;
  const [lat, lng] = location;

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;

  return (
    <motion.div
      data-testid="topspot"
      className="topspot-card"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* Title and Category */}
      <div className="d-flex justify-content-between align-items-start mb-2">
        <h4 className="topspot-title">{name}</h4>

        <span className={`topspot-category ${category}`}>
          {categoryIcons[category]} {category.toUpperCase()}
        </span>
      </div>

      {/* Thumbnail and overlay star */}
      <div
        className="thumb-wrapper"
        onClick={() => onOpen(spot)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter") onOpen(spot); }}
      >
        {imageUrl ? (
          <motion.img
            src={imageUrl}
            alt={name}
            className="topspot-thumb loaded"
            loading="lazy"
            decoding="async"
            whileHover={{ scale: 1.02 }}
            style={{ pointerEvents: "none" }}
          />
        ) : (
          <img
            src="/images/fallback.jpg"
            alt="No image available"
            className="topspot-thumb"
            loading="lazy"
            decoding="async"
            style={{ pointerEvents: "none" }}
          />
        )}

        <button
          type="button"
          className="favorite-overlay-star plain-star"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(spot.id);
          }}
          aria-pressed={favorites.includes(String(spot.id))}
          aria-label={favorites.includes(String(spot.id)) ? "Unfavorite" : "Favorite"}
        >
          {favorites.includes(String(spot.id)) ? "★" : "☆"}
        </button>

      </div>


      {/* Description */}
      <p className="topspot-description">{description}</p>

      {/* Map preview */}
      <motion.img
        loading="lazy"
        decoding="async"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        src={`https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=600&height=200&scaleFactor=2&center=lonlat:${lng},${lat}&zoom=12&marker=lonlat:${lng},${lat};color:%23ff0000;size:medium&apiKey=${import.meta.env.VITE_GEOAPIFY_KEY}`}
        alt={name}
        className="topspot-map"
      />

      {/* Footer */}
      <div className="card-footer" style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
        <a
          className="btn btn-maps-pill"
          href={`https://maps.google.com/?q=${lat},${lng}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>📍</span> Open in Google Maps
        </a>
      </div>
    </motion.div>
  );
};

export default TopSpot;
