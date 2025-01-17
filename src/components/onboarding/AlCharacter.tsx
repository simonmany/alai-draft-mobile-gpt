import { motion } from "framer-motion";

interface AlCharacterProps {
  isNodding?: boolean;
}

const AlCharacter = ({ isNodding = false }: AlCharacterProps) => {
  return (
    <motion.div
      className="w-32 h-32 mx-auto mb-8"
      animate={isNodding ? {
        rotate: [0, 10, 0, -10, 0],
        y: [0, -5, 0, -5, 0]
      } : {}}
      transition={{
        duration: 2,
        ease: "easeInOut",
        times: [0, 0.2, 0.5, 0.8, 1],
        repeat: isNodding ? 1 : 0,
      }}
    >
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full"
      >
        {/* Simple friendly robot face */}
        <circle cx="100" cy="100" r="90" fill="#2D87C9" /> {/* Body */}
        <circle cx="70" cy="80" r="15" fill="white" /> {/* Left eye */}
        <circle cx="130" cy="80" r="15" fill="white" /> {/* Right eye */}
        <circle cx="70" cy="80" r="8" fill="#333" /> {/* Left pupil */}
        <circle cx="130" cy="80" r="8" fill="#333" /> {/* Right pupil */}
        <path
          d="M 60 120 Q 100 150 140 120"
          stroke="white"
          strokeWidth="8"
          fill="none"
        /> {/* Smile */}
        <circle cx="100" cy="50" r="10" fill="#34B3B3" /> {/* Antenna */}
      </svg>
    </motion.div>
  );
};

export default AlCharacter;