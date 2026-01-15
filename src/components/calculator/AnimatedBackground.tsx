import { motion } from 'framer-motion';

// Animated cartoon construction worker with paint roller
const PaintWorker = ({ delay = 0, scale = 1, className = "" }: { delay?: number; scale?: number; className?: string }) => (
  <motion.svg
    viewBox="0 0 160 140"
    className={className}
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 1 }}
    style={{ transform: `scale(${scale})` }}
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
      y: [0, -15, 0],
    }}
    transition={{ 
      opacity: { delay, duration: 0.5 },
      y: { delay, duration: 3, repeat: Infinity, ease: "easeInOut" }
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

// Drywall/gypsum board worker
const DrywallWorker = ({ delay = 0, className = "" }: { delay?: number; className?: string }) => (
  <motion.svg
    viewBox="0 0 180 120"
    className={className}
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.5 }}
  >
    {/* Drywall panel */}
    <motion.rect
      x="0"
      y="20"
      width="120"
      height="80"
      rx="4"
      fill="#E5E7EB"
      stroke="#9CA3AF"
      strokeWidth="2"
      animate={{ rotate: [-2, 2, -2] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: "60px 60px" }}
    />
    {/* Screw marks */}
    <circle cx="20" cy="40" r="3" fill="#6B7280" />
    <circle cx="60" cy="40" r="3" fill="#6B7280" />
    <circle cx="100" cy="40" r="3" fill="#6B7280" />
    <circle cx="20" cy="80" r="3" fill="#6B7280" />
    <circle cx="60" cy="80" r="3" fill="#6B7280" />
    <circle cx="100" cy="80" r="3" fill="#6B7280" />
    
    {/* Worker behind the panel */}
    <motion.circle cx="140" cy="50" r="16" fill="#FBBF24" />
    <motion.ellipse cx="140" cy="36" rx="18" ry="6" fill="#EF4444" />
    <motion.rect x="122" y="32" width="36" height="6" fill="#EF4444" rx="2" />
    <circle cx="135" cy="48" r="2" fill="#1F2937" />
    <circle cx="145" cy="48" r="2" fill="#1F2937" />
    <motion.ellipse cx="145" cy="90" rx="18" ry="24" fill="#10B981" />
    <motion.line x1="127" y1="75" x2="120" y2="55" stroke="#FBBF24" strokeWidth="7" strokeLinecap="round" />
    <motion.line x1="163" y1="75" x2="120" y2="75" stroke="#FBBF24" strokeWidth="7" strokeLinecap="round" />
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
      rotate: [rotate, rotate + 15, rotate]
    }}
    transition={{ 
      opacity: { delay, duration: 0.5 },
      rotate: { delay, duration: 2, repeat: Infinity, ease: "easeInOut" }
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
      animate={{ width: [80, 120, 80] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
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
      animate={{ x: [138, 178, 138] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
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
      rotate: [rotate, rotate + 20, rotate]
    }}
    transition={{ 
      opacity: { delay, duration: 0.5 },
      rotate: { delay: delay + 0.5, duration: 1.5, repeat: Infinity, ease: "easeInOut" }
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

// Floating paint drops - responsive
const PaintDrops = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[
      { left: "5%", delay: 0, color: "#3B82F6", size: "w-3 h-3 md:w-4 md:h-4" },
      { left: "15%", delay: 1.5, color: "#10B981", size: "w-2 h-2 md:w-3 md:h-3" },
      { left: "30%", delay: 0.8, color: "#F59E0B", size: "w-4 h-4 md:w-5 md:h-5" },
      { left: "50%", delay: 2, color: "#EF4444", size: "w-3 h-3 md:w-4 md:h-4" },
      { left: "70%", delay: 0.5, color: "#8B5CF6", size: "w-3 h-3 md:w-4 md:h-4" },
      { left: "85%", delay: 1.2, color: "#3B82F6", size: "w-2 h-2 md:w-3 md:h-3" },
      { left: "95%", delay: 1.8, color: "#10B981", size: "w-2 h-2 md:w-3 md:h-3" },
    ].map((drop, i) => (
      <motion.div
        key={i}
        className={`absolute rounded-full ${drop.size}`}
        style={{ left: drop.left, top: "-20px", backgroundColor: drop.color }}
        animate={{
          y: [0, typeof window !== 'undefined' ? window.innerHeight + 40 : 1000, 0],
          opacity: [0, 1, 1, 0],
        }}
        transition={{
          duration: 6,
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
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-background to-amber-50 dark:from-blue-950/20 dark:via-background dark:to-amber-950/20" />
      
      {/* Soft glow effects */}
      <motion.div 
        className="absolute top-10 right-5 md:top-20 md:right-20 w-[200px] h-[200px] md:w-[400px] md:h-[400px] bg-blue-400/20 rounded-full blur-[60px] md:blur-[100px]"
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute bottom-10 left-5 md:bottom-20 md:left-20 w-[180px] h-[180px] md:w-[350px] md:h-[350px] bg-amber-400/20 rounded-full blur-[50px] md:blur-[80px]"
        animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.25, 0.2] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* Paint drops falling */}
      <PaintDrops />

      {/* === MOBILE ELEMENTS (visible on small screens) === */}
      <div className="block md:hidden">
        {/* Top left - Paint worker */}
        <PaintWorker 
          delay={0.2} 
          className="absolute top-20 -left-4 w-28 h-28 opacity-70"
        />
        
        {/* Top right - Paint bucket */}
        <PaintBucket 
          delay={0.4} 
          color="#10B981" 
          className="absolute top-32 -right-2 w-20 h-20 opacity-70"
        />
        
        {/* Middle left - Paintbrush */}
        <Paintbrush 
          delay={0.6} 
          rotate={-20}
          className="absolute top-1/3 -left-6 w-24 h-16 opacity-60"
        />
        
        {/* Middle right - Trowel */}
        <Trowel 
          delay={0.5} 
          rotate={15}
          className="absolute top-1/2 -right-3 w-16 h-24 opacity-60"
        />
        
        {/* Bottom left - Measuring tape */}
        <MeasuringTape 
          delay={0.7}
          className="absolute bottom-40 -left-8 w-32 h-14 opacity-60"
        />
        
        {/* Bottom right - Another bucket */}
        <PaintBucket 
          delay={0.8} 
          color="#8B5CF6" 
          className="absolute bottom-28 -right-4 w-18 h-18 opacity-60"
        />
        
        {/* Very bottom - Drywall worker (smaller) */}
        <DrywallWorker 
          delay={1}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 w-36 h-24 opacity-50"
        />
      </div>

      {/* === DESKTOP ELEMENTS (visible on medium+ screens) === */}
      <div className="hidden md:block">
        {/* Left side - Paint worker */}
        <PaintWorker 
          delay={0.2} 
          className="absolute top-40 left-4 lg:left-12 w-40 lg:w-52 h-40 lg:h-52 opacity-80"
        />
        
        {/* Left side - Paint bucket */}
        <PaintBucket 
          delay={0.5} 
          color="#10B981" 
          className="absolute top-[55%] left-8 lg:left-20 w-28 lg:w-36 h-28 lg:h-36 opacity-75"
        />
        
        {/* Left bottom - Trowel */}
        <Trowel 
          delay={0.7} 
          rotate={-10}
          className="absolute bottom-32 left-4 lg:left-16 w-20 lg:w-24 h-28 lg:h-36 opacity-70"
        />
        
        {/* Right side - Drywall worker */}
        <DrywallWorker 
          delay={0.4}
          className="absolute top-32 right-4 lg:right-12 w-44 lg:w-56 h-32 lg:h-40 opacity-80"
        />
        
        {/* Right side - Paintbrush */}
        <Paintbrush 
          delay={0.3} 
          rotate={-25}
          className="absolute top-[45%] right-8 lg:right-16 w-32 lg:w-40 h-16 lg:h-20 opacity-75"
        />
        
        {/* Right side - Measuring tape */}
        <MeasuringTape 
          delay={0.6}
          className="absolute top-[60%] right-4 lg:right-20 w-40 lg:w-52 h-16 lg:h-20 opacity-70"
        />
        
        {/* Right bottom - Paint bucket */}
        <PaintBucket 
          delay={0.8} 
          color="#8B5CF6" 
          className="absolute bottom-28 right-8 lg:right-24 w-24 lg:w-32 h-24 lg:h-32 opacity-70"
        />
        
        {/* Top center decorative */}
        <PaintBucket 
          delay={1} 
          color="#F59E0B" 
          className="absolute top-12 left-1/4 w-20 h-20 opacity-50"
        />
        <Paintbrush 
          delay={1.2} 
          rotate={45}
          className="absolute top-8 right-1/3 w-28 h-12 opacity-50"
        />
      </div>

      {/* Subtle dot pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />
    </div>
  );
};
