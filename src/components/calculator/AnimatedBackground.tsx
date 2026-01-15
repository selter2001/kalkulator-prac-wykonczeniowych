import { motion } from 'framer-motion';

// Animated cartoon construction worker with paint roller
const PaintWorker = ({ delay = 0, x = 0, y = 0, scale = 1 }: { delay?: number; x?: number; y?: number; scale?: number }) => (
  <motion.g
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 1 }}
    transform={`translate(${x}, ${y}) scale(${scale})`}
  >
    {/* Body - blue overalls */}
    <motion.ellipse
      cx="50"
      cy="80"
      rx="20"
      ry="28"
      fill="#3B82F6"
    />
    {/* Head - skin color */}
    <motion.circle
      cx="50"
      cy="38"
      r="18"
      fill="#FBBF24"
    />
    {/* Eyes */}
    <circle cx="44" cy="35" r="3" fill="#1F2937" />
    <circle cx="56" cy="35" r="3" fill="#1F2937" />
    {/* Smile */}
    <path d="M42 44 Q50 52 58 44" stroke="#1F2937" strokeWidth="2" fill="none" strokeLinecap="round" />
    {/* Hard hat */}
    <motion.ellipse
      cx="50"
      cy="22"
      rx="22"
      ry="8"
      fill="#F59E0B"
    />
    <motion.rect
      x="28"
      y="18"
      width="44"
      height="8"
      fill="#F59E0B"
      rx="2"
    />
    {/* Arm with roller */}
    <motion.g
      animate={{ rotate: [-10, 20, -10] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: "70px 60px" }}
    >
      {/* Arm */}
      <motion.line
        x1="70"
        y1="60"
        x2="110"
        y2="40"
        stroke="#FBBF24"
        strokeWidth="8"
        strokeLinecap="round"
      />
      {/* Roller handle */}
      <motion.line
        x1="110"
        y1="40"
        x2="130"
        y2="25"
        stroke="#6B7280"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Roller */}
      <motion.rect
        x="120"
        y="10"
        width="35"
        height="16"
        rx="4"
        fill="#3B82F6"
      />
      {/* Paint drips from roller */}
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
    <motion.line
      x1="30"
      y1="60"
      x2="15"
      y2="80"
      stroke="#FBBF24"
      strokeWidth="8"
      strokeLinecap="round"
    />
    {/* Legs */}
    <motion.line x1="40" y1="105" x2="35" y2="130" stroke="#1F2937" strokeWidth="8" strokeLinecap="round" />
    <motion.line x1="60" y1="105" x2="65" y2="130" stroke="#1F2937" strokeWidth="8" strokeLinecap="round" />
  </motion.g>
);

// Floating paint bucket
const PaintBucket = ({ delay = 0, x = 0, y = 0, scale = 1, color = "#3B82F6" }: { delay?: number; x?: number; y?: number; scale?: number; color?: string }) => (
  <motion.g
    initial={{ opacity: 0, y: 20 }}
    animate={{ 
      opacity: 1, 
      y: [0, -15, 0],
    }}
    transition={{ 
      opacity: { delay, duration: 0.5 },
      y: { delay, duration: 3, repeat: Infinity, ease: "easeInOut" }
    }}
    transform={`translate(${x}, ${y}) scale(${scale})`}
  >
    {/* Bucket body */}
    <motion.path
      d="M10 30 L18 80 L72 80 L80 30 Z"
      fill={color}
    />
    {/* Bucket rim */}
    <motion.ellipse
      cx="45"
      cy="30"
      rx="38"
      ry="10"
      fill={color}
    />
    <motion.ellipse
      cx="45"
      cy="30"
      rx="30"
      ry="6"
      fill="#1F2937"
      opacity="0.2"
    />
    {/* Paint inside */}
    <motion.ellipse
      cx="45"
      cy="35"
      rx="28"
      ry="6"
      fill={color}
      opacity="0.8"
    />
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
    <motion.path
      d="M15 25 Q45 -10 75 25"
      stroke="#6B7280"
      strokeWidth="5"
      fill="none"
      strokeLinecap="round"
    />
  </motion.g>
);

// Drywall/gypsum board worker
const DrywallWorker = ({ delay = 0, x = 0, y = 0, scale = 1 }: { delay?: number; x?: number; y?: number; scale?: number }) => (
  <motion.g
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.5 }}
    transform={`translate(${x}, ${y}) scale(${scale})`}
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
    {/* Head */}
    <motion.circle cx="140" cy="50" r="16" fill="#FBBF24" />
    {/* Hard hat */}
    <motion.ellipse cx="140" cy="36" rx="18" ry="6" fill="#EF4444" />
    <motion.rect x="122" y="32" width="36" height="6" fill="#EF4444" rx="2" />
    {/* Eyes */}
    <circle cx="135" cy="48" r="2" fill="#1F2937" />
    <circle cx="145" cy="48" r="2" fill="#1F2937" />
    {/* Body */}
    <motion.ellipse cx="145" cy="90" rx="18" ry="24" fill="#10B981" />
    {/* Arms holding panel */}
    <motion.line x1="127" y1="75" x2="120" y2="55" stroke="#FBBF24" strokeWidth="7" strokeLinecap="round" />
    <motion.line x1="163" y1="75" x2="120" y2="75" stroke="#FBBF24" strokeWidth="7" strokeLinecap="round" />
  </motion.g>
);

// Paintbrush
const Paintbrush = ({ delay = 0, x = 0, y = 0, rotate = 0, scale = 1 }: { delay?: number; x?: number; y?: number; rotate?: number; scale?: number }) => (
  <motion.g
    initial={{ opacity: 0, rotate: rotate - 30 }}
    animate={{ 
      opacity: 1,
      rotate: [rotate, rotate + 15, rotate]
    }}
    transition={{ 
      opacity: { delay, duration: 0.5 },
      rotate: { delay, duration: 2, repeat: Infinity, ease: "easeInOut" }
    }}
    transform={`translate(${x}, ${y}) scale(${scale})`}
    style={{ transformOrigin: "center" }}
  >
    {/* Handle */}
    <motion.rect
      x="0"
      y="20"
      width="70"
      height="16"
      rx="4"
      fill="#92400E"
    />
    {/* Metal ferrule */}
    <motion.rect
      x="70"
      y="16"
      width="15"
      height="24"
      fill="#9CA3AF"
    />
    {/* Bristles */}
    <motion.rect
      x="85"
      y="10"
      width="40"
      height="36"
      rx="4"
      fill="#F59E0B"
    />
    {/* Paint on bristles */}
    <motion.rect
      x="110"
      y="12"
      width="18"
      height="32"
      rx="3"
      fill="#3B82F6"
    />
  </motion.g>
);

// Measuring tape
const MeasuringTape = ({ delay = 0, x = 0, y = 0, scale = 1 }: { delay?: number; x?: number; y?: number; scale?: number }) => (
  <motion.g
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay, duration: 0.5 }}
    transform={`translate(${x}, ${y}) scale(${scale})`}
  >
    {/* Tape body */}
    <motion.rect
      x="0"
      y="0"
      width="60"
      height="60"
      rx="12"
      fill="#FBBF24"
    />
    {/* Center circle */}
    <motion.circle
      cx="30"
      cy="30"
      r="18"
      fill="#F59E0B"
    />
    <motion.circle
      cx="30"
      cy="30"
      r="8"
      fill="#1F2937"
    />
    {/* Extended tape */}
    <motion.rect
      x="60"
      y="22"
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
        y1="22"
        x2={70 + offset}
        y2={i % 2 === 0 ? "38" : "32"}
        stroke="#EF4444"
        strokeWidth="2"
      />
    ))}
    {/* Tape end hook */}
    <motion.rect
      x="138"
      y="18"
      width="8"
      height="24"
      fill="#EF4444"
      animate={{ x: [138, 178, 138] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    />
  </motion.g>
);

// Trowel / Spatula
const Trowel = ({ delay = 0, x = 0, y = 0, rotate = 0, scale = 1 }: { delay?: number; x?: number; y?: number; rotate?: number; scale?: number }) => (
  <motion.g
    initial={{ opacity: 0 }}
    animate={{ 
      opacity: 1,
      rotate: [rotate, rotate + 20, rotate]
    }}
    transition={{ 
      opacity: { delay, duration: 0.5 },
      rotate: { delay: delay + 0.5, duration: 1.5, repeat: Infinity, ease: "easeInOut" }
    }}
    transform={`translate(${x}, ${y}) scale(${scale})`}
    style={{ transformOrigin: "30px 60px" }}
  >
    {/* Handle */}
    <motion.rect
      x="22"
      y="60"
      width="16"
      height="40"
      rx="5"
      fill="#92400E"
    />
    {/* Metal part connecting handle */}
    <motion.rect
      x="25"
      y="52"
      width="10"
      height="12"
      fill="#9CA3AF"
    />
    {/* Blade */}
    <motion.path
      d="M0 55 L30 5 L60 55 Z"
      fill="#D1D5DB"
      stroke="#9CA3AF"
      strokeWidth="2"
    />
  </motion.g>
);

// Floating paint drops
const PaintDrops = () => (
  <>
    {[
      { x: "10%", delay: 0, color: "#3B82F6", size: 8 },
      { x: "20%", delay: 1.5, color: "#10B981", size: 6 },
      { x: "35%", delay: 0.8, color: "#F59E0B", size: 10 },
      { x: "50%", delay: 2, color: "#EF4444", size: 7 },
      { x: "65%", delay: 0.5, color: "#8B5CF6", size: 9 },
      { x: "80%", delay: 1.2, color: "#3B82F6", size: 8 },
      { x: "90%", delay: 1.8, color: "#10B981", size: 6 },
    ].map((drop, i) => (
      <motion.circle
        key={i}
        cx={drop.x}
        cy="5%"
        r={drop.size}
        fill={drop.color}
        animate={{
          y: [0, 800, 0],
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
  </>
);

// Scaffold
const Scaffold = ({ x = 0, y = 0, scale = 1 }: { x?: number; y?: number; scale?: number }) => (
  <motion.g
    initial={{ opacity: 0 }}
    animate={{ opacity: 0.6 }}
    transition={{ duration: 1 }}
    transform={`translate(${x}, ${y}) scale(${scale})`}
  >
    {/* Vertical poles */}
    <rect x="0" y="0" width="8" height="150" fill="#F59E0B" rx="2" />
    <rect x="92" y="0" width="8" height="150" fill="#F59E0B" rx="2" />
    {/* Horizontal bars */}
    <rect x="0" y="0" width="100" height="6" fill="#F59E0B" rx="2" />
    <rect x="0" y="50" width="100" height="6" fill="#F59E0B" rx="2" />
    <rect x="0" y="100" width="100" height="6" fill="#F59E0B" rx="2" />
    {/* Platform */}
    <rect x="-5" y="48" width="110" height="10" fill="#92400E" rx="2" />
    {/* X bracing */}
    <line x1="4" y1="56" x2="96" y2="100" stroke="#F59E0B" strokeWidth="4" />
    <line x1="96" y1="56" x2="4" y2="100" stroke="#F59E0B" strokeWidth="4" />
  </motion.g>
);

export const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-background to-amber-50 dark:from-blue-950/20 dark:via-background dark:to-amber-950/20" />
      
      {/* Soft glow effects */}
      <motion.div 
        className="absolute top-20 right-20 w-[400px] h-[400px] bg-blue-400/20 rounded-full blur-[100px]"
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute bottom-20 left-20 w-[350px] h-[350px] bg-amber-400/20 rounded-full blur-[80px]"
        animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.25, 0.2] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* Animated SVG elements */}
      <svg 
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Paint drops falling */}
        <PaintDrops />
        
        {/* Left side - Paint worker */}
        <PaintWorker delay={0.2} x={60} y={200} scale={1.5} />
        
        {/* Left side - Paint bucket */}
        <PaintBucket delay={0.5} x={50} y={500} scale={1.2} color="#10B981" />
        
        {/* Left bottom - Scaffold */}
        <Scaffold x={180} y={650} scale={1} />
        
        {/* Right side - Drywall worker */}
        <DrywallWorker delay={0.4} x={1600} y={150} scale={1.3} />
        
        {/* Right side - Paintbrush */}
        <Paintbrush delay={0.3} x={1650} y={420} rotate={-25} scale={1.4} />
        
        {/* Right side - Measuring tape */}
        <MeasuringTape delay={0.6} x={1700} y={600} scale={1.2} />
        
        {/* Right bottom - Paint bucket */}
        <PaintBucket delay={0.8} x={1620} y={780} scale={1} color="#8B5CF6" />
        
        {/* Bottom center - Trowel */}
        <Trowel delay={0.7} x={900} y={900} rotate={15} scale={1.3} />
        
        {/* Top area decorative elements */}
        <PaintBucket delay={1} x={400} y={50} scale={0.8} color="#F59E0B" />
        <Paintbrush delay={1.2} x={1200} y={30} rotate={45} scale={1} />
      </svg>

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
