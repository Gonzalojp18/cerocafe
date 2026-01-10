import { motion } from "framer-motion";

const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <motion.div
      className={`relative flex flex-col items-center justify-center p-4 ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="relative flex items-center justify-center">
        {/* Main Text "Cero" */}
        <h1 className="font-serif pt-4 text-[4rem] md:text-[7rem] leading-none text-gray-800 relative z-10" style={{ fontFamily: 'var(--font-abril)' }}>
          Cero
        </h1>
        {/* Curved Text "Café de especialidad" */}
        <div className="absolute top-[10%] -right-[10%] md:-right-[15%] w-[120px] h-[120px] md:w-[150px] md:h-[150px] pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
            <path
              id="curve"
              d="M 10,50 A 40,40 0 0,1 90,50"
              fill="none"
              stroke="none"
            />
            <text className="text-[4px] md:text-[6px] uppercase tracking-widest font-medium fill-black">
              <textPath href="#curve" startOffset="60%" textAnchor="middle">
                Café de Origen
              </textPath>
            </text>
          </svg>
        </div>
      </div>
    </motion.div>
  );
};

export default Logo;
