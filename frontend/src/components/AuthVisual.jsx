import { motion } from 'framer-motion';

function AuthVisual() {
  return (
    <div className="relative flex h-64 w-full items-center justify-center">
      <svg viewBox="0 0 320 220" className="w-full max-w-xs">
        <motion.rect
          x="40"
          y="120"
          width="180"
          height="70"
          rx="14"
          fill="#ffffff"
          fillOpacity="0.06"
          stroke="#ffffff"
          strokeOpacity="0.18"
          initial={{ y: 140, opacity: 0 }}
          animate={{ y: 120, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
        <motion.rect
          x="70"
          y="95"
          width="180"
          height="70"
          rx="14"
          fill="#ffffff"
          fillOpacity="0.1"
          stroke="#ffffff"
          strokeOpacity="0.25"
          initial={{ y: 115, opacity: 0 }}
          animate={{ y: 95, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
        />
        <motion.g
          initial={{ y: 105, opacity: 0 }}
          animate={{ y: 85, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
        >
          <rect x="100" y="85" width="180" height="70" rx="14" fill="#ffffff" fillOpacity="0.95" />
          <text x="118" y="112" fill="#111114" fontSize="11" fontFamily="Inter, sans-serif" opacity="0.6">
            Available balance
          </text>
          <text x="118" y="136" fill="#111114" fontSize="20" fontWeight="600" fontFamily="Inter, sans-serif">
            42,180.00
          </text>
        </motion.g>

        <motion.path
          d="M40 55 L90 40 L130 62 L175 30 L230 48 L270 20"
          fill="none"
          stroke="#ffffff"
          strokeOpacity="0.5"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.5, ease: 'easeInOut' }}
        />
        {[
          [40, 55],
          [90, 40],
          [130, 62],
          [175, 30],
          [230, 48],
          [270, 20],
        ].map(([cx, cy], index) => (
          <motion.circle
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r="3.5"
            fill="#ffffff"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.6 + index * 0.15 }}
          />
        ))}
      </svg>
    </div>
  );
}

export default AuthVisual;
