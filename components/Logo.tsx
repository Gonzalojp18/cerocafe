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
        {/* Curved Text removed as it is now in main layout */}
      </div>
    </motion.div>
  );
};

export default Logo;
