import { motion } from 'framer-motion';

// Animated cartoon construction worker with paint roller
const PaintWorker = ({ delay = 0, className = "" }: { delay?: number; className?: string }) => (
  <motion.svg
    viewBox="0 0 160 140"
    className={className}
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 1 }}
  >
    {/* Body - blue overalls */}
    <motion.ellipse cx="50" cy="80" rx="20" ry="28" fill="#3B82F6" />
    {/* Head - skin color */}
    <motion.circle cx="50" cy="38" r="18" fill="#FBBF24" />
    {/* Eyes */}
    <circle cx="44" cy="35" r="3" fill="#1F2937" />
    <circle cx="56" cy="35" r="3" fill="#1F2937" />
    {/* Smile */}
    <path d="M42 44 Q50 52 58 44" stroke="#1F2937" strokeWidth="2" fill="none" strokeLinecap="round" />
    {/* Hard hat */}
    <motion.ellipse cx="50" cy="22" rx="22" ry="8" fill="#F59E0B" />
    <motion.rect x="28" y="18" width="44" height="8" fill="#F59E0B" rx="2" />
    {/* Arm with roller */}
    <motion.g
      animate={{ rotate: [-10, 20, -10] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: "70px 60px" }}
    >
      <motion.line x1="70" y1="60" x2="110" y2="40" stroke="#FBBF24" strokeWidth="8" strokeLinecap="round" />
      <motion.line x1="110" y1="40" x2="130" y2="25" stroke="#6B7280" strokeWidth="4" strokeLinecap="round" />
      <motion.rect x="120" y="10" width="35" height="16" rx="4" fill="#3B82F6" />
      <motion.circle
        cx="128"
        cy="30"
        r="4"
        fill="#3B82F6"
        animate={{ y: [0, 20, 0], opacity: [1, 0, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.g>
    {/* Other arm */}
    <motion.line x1="30" y1="60" x2="15" y2="80" stroke="#FBBF24" strokeWidth="8" strokeLinecap="round" />
    {/* Legs */}
    <motion.line x1="40" y1="105" x2="35" y2="130" stroke="#1F2937" strokeWidth="8" strokeLinecap="round" />
    <motion.line x1="60" y1="105" x2="65" y2="130" stroke="#1F2937" strokeWidth="8" strokeLinecap="round" />
  </motion.svg>
);

// Floating paint bucket
const PaintBucket = ({ delay = 0, color = "#3B82F6", className = "" }: { delay?: number; color?: string; className?: string }) => (
  <motion.svg
    viewBox="0 0 100 100"
    className={className}
    initial={{ opacity: 0, y: 20 }}
    animate={{ 
      opacity: 1, 
      y: [0, -10, 0],
    }}
    transition={{ 
      opacity: { delay, duration: 0.5 },
      y: { delay, duration: 4, repeat: Infinity, ease: "easeInOut" }
    }}
  >
    {/* Bucket body */}
    <motion.path d="M10 30 L18 80 L72 80 L80 30 Z" fill={color} />
    {/* Bucket rim */}
    <motion.ellipse cx="45" cy="30" rx="38" ry="10" fill={color} />
    <motion.ellipse cx="45" cy="30" rx="30" ry="6" fill="#1F2937" opacity="0.2" />
    {/* Paint drip */}
    <motion.path
      d="M72 40 Q85 55 78 70 Q75 80 80 90"
      stroke={color}
      strokeWidth="8"
      fill="none"
      strokeLinecap="round"
      animate={{ pathLength: [0, 1, 1, 0] }}
      transition={{ duration: 4, repeat: Infinity }}
    />
    {/* Handle */}
    <motion.path d="M15 25 Q45 -10 75 25" stroke="#6B7280" strokeWidth="5" fill="none" strokeLinecap="round" />
  </motion.svg>
);

// Paintbrush
const Paintbrush = ({ delay = 0, rotate = 0, className = "" }: { delay?: number; rotate?: number; className?: string }) => (
  <motion.svg
    viewBox="0 0 140 60"
    className={className}
    initial={{ opacity: 0, rotate: rotate - 30 }}
    animate={{ 
      opacity: 1,
      rotate: [rotate, rotate + 10, rotate]
    }}
    transition={{ 
      opacity: { delay, duration: 0.5 },
      rotate: { delay, duration: 3, repeat: Infinity, ease: "easeInOut" }
    }}
  >
    {/* Handle */}
    <motion.rect x="0" y="20" width="70" height="16" rx="4" fill="#92400E" />
    {/* Metal ferrule */}
    <motion.rect x="70" y="16" width="15" height="24" fill="#9CA3AF" />
    {/* Bristles */}
    <motion.rect x="85" y="10" width="40" height="36" rx="4" fill="#F59E0B" />
    {/* Paint on bristles */}
    <motion.rect x="110" y="12" width="18" height="32" rx="3" fill="#3B82F6" />
  </motion.svg>
);

// Measuring tape
const MeasuringTape = ({ delay = 0, className = "" }: { delay?: number; className?: string }) => (
  <motion.svg
    viewBox="0 0 200 70"
    className={className}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay, duration: 0.5 }}
  >
    {/* Tape body */}
    <motion.rect x="0" y="5" width="60" height="60" rx="12" fill="#FBBF24" />
    <motion.circle cx="30" cy="35" r="18" fill="#F59E0B" />
    <motion.circle cx="30" cy="35" r="8" fill="#1F2937" />
    {/* Extended tape */}
    <motion.rect
      x="60"
      y="27"
      width="80"
      height="16"
      fill="#FEF3C7"
      animate={{ width: [80, 110, 80] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    />
    {/* Tape markings */}
    {[0, 20, 40, 60, 80].map((offset, i) => (
      <motion.line
        key={i}
        x1={70 + offset}
        y1="27"
        x2={70 + offset}
        y2={i % 2 === 0 ? "43" : "37"}
        stroke="#EF4444"
        strokeWidth="2"
      />
    ))}
    {/* Tape end hook */}
    <motion.rect
      x="138"
      y="23"
      width="8"
      height="24"
      fill="#EF4444"
      animate={{ x: [138, 168, 138] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    />
  </motion.svg>
);

// Trowel / Spatula
const Trowel = ({ delay = 0, rotate = 0, className = "" }: { delay?: number; rotate?: number; className?: string }) => (
  <motion.svg
    viewBox="0 0 70 110"
    className={className}
    initial={{ opacity: 0 }}
    animate={{ 
      opacity: 1,
      rotate: [rotate, rotate + 15, rotate]
    }}
    transition={{ 
      opacity: { delay, duration: 0.5 },
      rotate: { delay: delay + 0.5, duration: 2, repeat: Infinity, ease: "easeInOut" }
    }}
  >
    {/* Handle */}
    <motion.rect x="27" y="60" width="16" height="40" rx="5" fill="#92400E" />
    {/* Metal part connecting handle */}
    <motion.rect x="30" y="52" width="10" height="12" fill="#9CA3AF" />
    {/* Blade */}
    <motion.path d="M5 55 L35 5 L65 55 Z" fill="#D1D5DB" stroke="#9CA3AF" strokeWidth="2" />
  </motion.svg>
);

// Subtle floating paint drops
const PaintDrops = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[
      { left: "8%", delay: 0, color: "#3B82F6" },
      { left: "25%", delay: 2, color: "#10B981" },
      { left: "45%", delay: 1, color: "#F59E0B" },
      { left: "65%", delay: 3, color: "#EF4444" },
      { left: "82%", delay: 1.5, color: "#8B5CF6" },
      { left: "92%", delay: 2.5, color: "#3B82F6" },
    ].map((drop, i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 md:w-3 md:h-3 rounded-full"
        style={{ left: drop.left, top: "-20px", backgroundColor: drop.color }}
        animate={{
          y: [0, typeof window !== 'undefined' ? window.innerHeight + 40 : 1000, 0],
          opacity: [0, 0.6, 0.6, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          delay: drop.delay,
          ease: "easeIn",
        }}
      />
    ))}
  </div>
);

export const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/60 via-background to-amber-100/60 dark:from-blue-900/20 dark:via-background dark:to-amber-900/20" />
      
      {/* Soft glow effects */}
      <motion.div 
        className="absolute -top-10 -right-10 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-blue-400/20 rounded-full blur-[80px] md:blur-[120px]"
        animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute -bottom-10 -left-10 w-[250px] h-[250px] md:w-[400px] md:h-[400px] bg-amber-400/20 rounded-full blur-[60px] md:blur-[100px]"
        animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.2, 0.15] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* Paint drops falling */}
      <PaintDrops />

      {/* === MOBILE ELEMENTS - visible at edges === */}
      <div className="block md:hidden">
        {/* Top left corner - worker */}
        <PaintWorker 
          delay={0.2} 
          className="absolute top-4 -left-6 w-24 h-24 opacity-50"
        />
        
        {/* Top right corner - bucket */}
        <PaintBucket 
          delay={0.5} 
          color="#10B981" 
          className="absolute top-20 -right-3 w-16 h-16 opacity-45"
        />
        
        {/* Middle left - paintbrush */}
        <Paintbrush 
          delay={0.7} 
          rotate={-30}
          className="absolute top-[40%] -left-8 w-24 h-12 opacity-40"
        />
        
        {/* Middle right - measuring tape */}
        <MeasuringTape 
          delay={0.4}
          className="absolute top-[55%] -right-16 w-32 h-12 opacity-40"
        />
        
        {/* Bottom left - trowel */}
        <Trowel 
          delay={0.6} 
          rotate={-20}
          className="absolute bottom-40 -left-3 w-12 h-18 opacity-40"
        />
        
        {/* Bottom right - bucket */}
        <PaintBucket 
          delay={0.8} 
          color="#8B5CF6" 
          className="absolute bottom-24 -right-4 w-14 h-14 opacity-40"
        />
      </div>

      {/* === DESKTOP ELEMENTS === */}
      <div className="hidden md:block">
        {/* Left side - Paint worker */}
        <PaintWorker 
          delay={0.2} 
          className="absolute top-28 left-2 lg:left-8 w-36 lg:w-48 h-36 lg:h-48 opacity-60"
        />
        
        {/* Left side - Paint bucket */}
        <PaintBucket 
          delay={0.5} 
          color="#10B981" 
          className="absolute top-[48%] left-4 lg:left-12 w-24 lg:w-32 h-24 lg:h-32 opacity-50"
        />
        
        {/* Left bottom - Trowel */}
        <Trowel 
          delay={0.7} 
          rotate={-15}
          className="absolute bottom-28 left-4 lg:left-12 w-16 lg:w-24 h-24 lg:h-32 opacity-50"
        />
        
        {/* Right side - Paintbrush */}
        <Paintbrush 
          delay={0.3} 
          rotate={-20}
          className="absolute top-36 right-2 lg:right-8 w-32 lg:w-40 h-14 lg:h-18 opacity-55"
        />
        
        {/* Right side - Measuring tape */}
        <MeasuringTape 
          delay={0.6}
          className="absolute top-[52%] right-0 lg:right-4 w-40 lg:w-48 h-16 lg:h-20 opacity-50"
        />
        
        {/* Right bottom - Paint bucket */}
        <PaintBucket 
          delay={0.8} 
          color="#8B5CF6" 
          className="absolute bottom-24 right-4 lg:right-12 w-24 lg:w-28 h-24 lg:h-28 opacity-45"
        />
      </div>

      {/* Very subtle dot pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />
    </div>
  );
};
