import { useState } from "react";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";

const Modal = ({ spot, onClose, favorites, toggleFavorite }) => {
    const { name, description, location, imageUrl } = spot;
    const [lat, lng] = location;

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;

    // Swipeable gallery
    const images = [imageUrl];
    const [galleryIndex, setGalleryIndex] = useState(0);
    const [touchStart, setTouchStart] = useState(null);

    // Swipe-down-to-close states
    const [touchStartY, setTouchStartY] = useState(null);
    const [touchEndY, setTouchEndY] = useState(null);

    // Horizontal swipe (gallery)
    const handleTouchStart = (e) => {
        setTouchStart(e.changedTouches[0].clientX);
    };

    const handleTouchEnd = (e) => {
        if (touchStart === null) return;
        const end = e.changedTouches[0].clientX;
        const diff = end - touchStart;

        if (diff > 50) {
            setGalleryIndex((i) => (i === 0 ? images.length - 1 : i - 1));
        } else if (diff < -50) {
            setGalleryIndex((i) => (i === images.length - 1 ? 0 : i + 1));
        }

        setTouchStart(null);
    };

    // Vertical swipe (close modal)
    const handleTouchStartY = (e) => {
        setTouchStartY(e.changedTouches[0].clientY);
    };

    const handleTouchMoveY = (e) => {
        setTouchEndY(e.changedTouches[0].clientY);
    };

    const handleTouchEndY = () => {
        if (!touchStartY || !touchEndY) return;

        const diff = touchEndY - touchStartY;

        if (diff > 80) {
            document.querySelector(".modal-content").classList.add("swipe-down");
            setTimeout(onClose, 150);
        }

        setTouchStartY(null);
        setTouchEndY(null);
    };

    return createPortal(
        <div
            className="modal-overlay"
            onClick={() => setTimeout(onClose, 10)}
        >
            <motion.div
                className="modal-content"
                initial={{ opacity: 0, scale: 0.85, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                onClick={(e) => e.stopPropagation()}
                onTouchStart={handleTouchStartY}
                onTouchMove={handleTouchMoveY}
                onTouchEnd={handleTouchEndY}
            >
                <h3 className="modal-title">{name}</h3>

                {/* Swipeable Gallery */}
                <div
                    className="modal-gallery"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    <img
                        src={images[galleryIndex]}
                        alt={name}
                        className="modal-image"
                        loading="lazy"
                        decoding="async"
                    />
                </div>

                {/* Map */}
                <img
                    src={`https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&size=600x300&scale=2&markers=color:red|${lat},${lng}&key=${import.meta.env.VITE_GOOGLE_MAPS_KEY}`}
                    alt="Map"
                    loading="lazy"
                    decoding="async"
                    className="modal-map"
                />


                <p className="map-caption">Location on map</p>

                <div className="modal-actions-row">
                    <a
                        className="btn-maps-pill small"
                        href={`https://maps.google.com/?q=${lat},${lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        📍 Maps
                    </a>

                    <a
                        className="btn-maps-pill btn-directions small"
                        href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        🚗 Directions
                    </a>

                    <button
                        className="modal-favorite-btn small"
                        aria-pressed={favorites.includes(String(spot.id))}
                        onClick={() => toggleFavorite(spot.id)}
                    >
                        {favorites.includes(String(spot.id)) ? "Favorited ★" : "Favorite ☆"}
                    </button>
                </div>

                <button className="modal-close full" onClick={onClose}>
                    Close
                </button>

            </motion.div>
        </div>,
        document.body
    );
};

export default Modal;
