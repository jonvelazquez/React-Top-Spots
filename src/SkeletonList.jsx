import { motion } from "framer-motion";

const SkeletonList = () => {
  return (
    <div className="skeleton-wrapper">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="skeleton-card"
          initial={{ opacity: 0.4 }}
          animate={{ opacity: 1 }}
          transition={{ repeat: Infinity, duration: 1, repeatType: "reverse" }}
        />
      ))}
    </div>
  );
};

export default SkeletonList;
