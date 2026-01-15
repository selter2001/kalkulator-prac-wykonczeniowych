import { motion } from 'framer-motion';

// Animated cartoon construction worker with paint roller
const PaintWorker = ({ delay = 0, x = 0, y = 0 }: { delay?: number; x?: number; y?: number }) => (
  <motion.g
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 0.15, x: 0 }}
    transition={{ delay, duration: 1 }}
    style={{ transform: `translate(${x}px, ${y}px)` }}
  >
    {/* Body */}
    <motion.ellipse
      cx="30"
      cy="45"
      rx="12"
      ry="16"
      fill="currentColor"
      className="text-primary"
    />
    {/* Head */}
    <motion.circle
      cx="30"
      cy="22"
      r="10"
      fill="currentColor"
      className="text-amber-400"
    />
    {/* Hard hat */}
    <motion.path
      d="M18 22 Q30 12 42 22"
      stroke="currentColor"
      strokeWidth="3"
      fill="none"
      className="text-yellow-500"
    />
    {/* Arm with roller */}
    <motion.g
      animate={{ rotate: [-5, 15, -5] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: "42px 35px" }}
    >
      <motion.line
        x1="42"
        y1="35"
        x2="70"
        y2="25"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        className="text-amber-400"
      />
      {/* Roller */}
      <motion.rect
        x="65"
        y="15"
        width="20"
        height="8"
        rx="2"
        fill="currentColor"
        className="text-primary"
      />
      <motion.line
        x1="75"
        y1="23"
        x2="75"
        y2="28"
        stroke="currentColor"
        strokeWidth="2"
        className="text-muted-foreground"
      />
    </motion.g>
  </motion.g>
);

// Floating paint bucket
const PaintBucket = ({ delay = 0, x = 0, y = 0 }: { delay?: number; x?: number; y?: number }) => (
  <motion.g
    initial={{ opacity: 0, y: 20 }}
    animate={{ 
      opacity: 0.12, 
      y: [0, -10, 0],
    }}
    transition={{ 
      opacity: { delay, duration: 0.5 },
      y: { delay, duration: 4, repeat: Infinity, ease: "easeInOut" }
    }}
    style={{ transform: `translate(${x}px, ${y}px)` }}
  >
    {/* Bucket body */}
    <motion.path
      d="M10 20 L15 50 L45 50 L50 20 Z"
      fill="currentColor"
      className="text-primary/80"
    />
    {/* Bucket rim */}
    <motion.ellipse
      cx="30"
      cy="20"
      rx="22"
      ry="6"
      fill="currentColor"
      className="text-primary"
    />
    {/* Paint drip */}
    <motion.path
      d="M45 25 Q52 35 48 45"
      stroke="currentColor"
      strokeWidth="4"
      fill="none"
      strokeLinecap="round"
      className="text-accent"
      animate={{ pathLength: [0, 1, 1, 0] }}
      transition={{ duration: 3, repeat: Infinity }}
    />
    {/* Handle */}
    <motion.path
      d="M12 15 Q30 -5 48 15"
      stroke="currentColor"
      strokeWidth="3"
      fill="none"
      className="text-muted-foreground"
    />
  </motion.g>
);

// Drywall/gypsum board
const DrywallPanel = ({ delay = 0, x = 0, y = 0, rotate = 0 }: { delay?: number; x?: number; y?: number; rotate?: number }) => (
  <motion.g
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ 
      opacity: 0.1,
      scale: 1,
      rotate: [rotate - 2, rotate + 2, rotate - 2]
    }}
    transition={{ 
      opacity: { delay, duration: 0.5 },
      scale: { delay, duration: 0.5 },
      rotate: { delay, duration: 6, repeat: Infinity, ease: "easeInOut" }
    }}
    style={{ transform: `translate(${x}px, ${y}px)` }}
  >
    {/* Panel */}
    <motion.rect
      x="0"
      y="0"
      width="80"
      height="50"
      rx="3"
      fill="currentColor"
      className="text-muted-foreground"
    />
    {/* Screw marks */}
    <motion.circle cx="15" cy="12" r="2" fill="currentColor" className="text-foreground/30" />
    <motion.circle cx="40" cy="12" r="2" fill="currentColor" className="text-foreground/30" />
    <motion.circle cx="65" cy="12" r="2" fill="currentColor" className="text-foreground/30" />
    <motion.circle cx="15" cy="38" r="2" fill="currentColor" className="text-foreground/30" />
    <motion.circle cx="40" cy="38" r="2" fill="currentColor" className="text-foreground/30" />
    <motion.circle cx="65" cy="38" r="2" fill="currentColor" className="text-foreground/30" />
  </motion.g>
);

// Paintbrush
const Paintbrush = ({ delay = 0, x = 0, y = 0, rotate = 0 }: { delay?: number; x?: number; y?: number; rotate?: number }) => (
  <motion.g
    initial={{ opacity: 0, rotate: rotate - 20 }}
    animate={{ 
      opacity: 0.12,
      rotate: [rotate, rotate + 10, rotate]
    }}
    transition={{ 
      opacity: { delay, duration: 0.5 },
      rotate: { delay, duration: 3, repeat: Infinity, ease: "easeInOut" }
    }}
    style={{ transform: `translate(${x}px, ${y}px)`, transformOrigin: "center" }}
  >
    {/* Handle */}
    <motion.rect
      x="0"
      y="15"
      width="50"
      height="10"
      rx="2"
      fill="currentColor"
      className="text-amber-600"
    />
    {/* Metal part */}
    <motion.rect
      x="50"
      y="12"
      width="8"
      height="16"
      fill="currentColor"
      className="text-muted-foreground"
    />
    {/* Bristles */}
    <motion.rect
      x="58"
      y="8"
      width="25"
      height="24"
      rx="2"
      fill="currentColor"
      className="text-primary"
    />
  </motion.g>
);

// Measuring tape
const MeasuringTape = ({ delay = 0, x = 0, y = 0 }: { delay?: number; x?: number; y?: number }) => (
  <motion.g
    initial={{ opacity: 0 }}
    animate={{ 
      opacity: 0.1,
    }}
    transition={{ delay, duration: 0.5 }}
    style={{ transform: `translate(${x}px, ${y}px)` }}
  >
    {/* Tape body */}
    <motion.rect
      x="0"
      y="0"
      width="40"
      height="40"
      rx="8"
      fill="currentColor"
      className="text-yellow-500"
    />
    {/* Center circle */}
    <motion.circle
      cx="20"
      cy="20"
      r="12"
      fill="currentColor"
      className="text-yellow-600"
    />
    {/* Extended tape */}
    <motion.rect
      x="40"
      y="15"
      width="60"
      height="10"
      fill="currentColor"
      className="text-yellow-400"
      animate={{ width: [60, 100, 60] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    />
    {/* Tape markings */}
    {[0, 15, 30, 45, 60].map((offset, i) => (
      <motion.line
        key={i}
        x1={50 + offset}
        y1="15"
        x2={50 + offset}
        y2="25"
        stroke="currentColor"
        strokeWidth="1"
        className="text-red-500"
      />
    ))}
  </motion.g>
);

// Trowel / Spatula
const Trowel = ({ delay = 0, x = 0, y = 0, rotate = 0 }: { delay?: number; x?: number; y?: number; rotate?: number }) => (
  <motion.g
    initial={{ opacity: 0 }}
    animate={{ 
      opacity: 0.1,
      rotate: [rotate, rotate + 15, rotate]
    }}
    transition={{ 
      opacity: { delay, duration: 0.5 },
      rotate: { delay: delay + 0.5, duration: 2, repeat: Infinity, ease: "easeInOut" }
    }}
    style={{ transform: `translate(${x}px, ${y}px)`, transformOrigin: "20px 40px" }}
  >
    {/* Handle */}
    <motion.rect
      x="15"
      y="40"
      width="10"
      height="25"
      rx="3"
      fill="currentColor"
      className="text-amber-700"
    />
    {/* Blade */}
    <motion.path
      d="M0 40 L20 0 L40 40 Z"
      fill="currentColor"
      className="text-muted-foreground"
    />
  </motion.g>
);

// Floating dust particles
const DustParticles = () => (
  <>
    {[...Array(15)].map((_, i) => (
      <motion.circle
        key={i}
        cx={Math.random() * 100 + "%"}
        cy={Math.random() * 100 + "%"}
        r={Math.random() * 2 + 1}
        fill="currentColor"
        className="text-primary/20"
        animate={{
          y: [0, -30, 0],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: Math.random() * 4 + 3,
          repeat: Infinity,
          delay: Math.random() * 2,
          ease: "easeInOut"
        }}
      />
    ))}
  </>
);

export const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      
      {/* Glow effects */}
      <motion.div 
        className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"
        animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"
        animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.12, 0.1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* Animated SVG elements */}
      <svg 
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Dust particles */}
        <DustParticles />
        
        {/* Left side elements */}
        <PaintWorker delay={0.2} x={50} y={150} />
        <PaintBucket delay={0.5} x={100} y={400} />
        <DrywallPanel delay={0.8} x={30} y={650} rotate={-5} />
        
        {/* Right side elements */}
        <Paintbrush delay={0.3} x={1650} y={100} rotate={-30} />
        <MeasuringTape delay={0.6} x={1700} y={350} />
        <Trowel delay={0.9} x={1750} y={600} rotate={15} />
        <PaintBucket delay={1.1} x={1680} y={800} />
        
        {/* Center floating elements (very subtle) */}
        <DrywallPanel delay={1.2} x={800} y={50} rotate={3} />
        <Paintbrush delay={1.4} x={1100} y={900} rotate={45} />
        
        {/* Additional decorative elements */}
        <DrywallPanel delay={1.5} x={200} y={850} rotate={-8} />
        <Trowel delay={1.6} x={1500} y={200} rotate={-20} />
      </svg>

      {/* Subtle grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />
    </div>
  );
};
