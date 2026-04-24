import { motion, AnimatePresence } from "framer-motion";
import TopSpot from "./TopSpot";

const TopSpots = ({ spots, onOpen, favorites, toggleFavorite }) => {
  return (
    <motion.div
      data-testid="topspots"
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: { staggerChildren: 0.08 }
        }
      }}
    >
      <AnimatePresence>
        {spots.map((spot) => (
          <motion.div
            key={spot.id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: -20 }
            }}
            layout
          >
            <TopSpot
              spot={spot}
              name={spot.name}
              description={spot.description}
              imageUrl={spot.imageUrl}
              onOpen={onOpen}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default TopSpots;
