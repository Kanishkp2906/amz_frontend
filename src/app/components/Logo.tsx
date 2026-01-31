import { motion } from 'motion/react';

export function Logo({ size = 40 }: { size?: number }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Solid burgundy circle background */}
      <circle
        cx="50"
        cy="50"
        r="46"
        fill="#800020"
      />
      
      {/* White AMZ text - perfectly centered */}
      <text
        x="50"
        y="50"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="28"
        fontWeight="900"
        fill="white"
        fontFamily="Poppins, sans-serif"
      >
        AMZ
      </text>
    </motion.svg>
  );
}
