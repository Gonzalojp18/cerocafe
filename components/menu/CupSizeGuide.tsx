import { motion } from "framer-motion";

const CupSizeGuide = () => {
    return (
        <div className="w-full flex flex-col items-center justify-center gap-4 py-6 text-neutral-800">
            {/* Elegant minimal cup icon */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <svg
                    width="44"
                    height="44"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="opacity-80"
                >
                    <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
                    <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
                    <line x1="6" y1="2" x2="6" y2="4" />
                    <line x1="10" y1="2" x2="10" y2="4" />
                    <line x1="14" y1="2" x2="14" y2="4" />
                </svg>
            </motion.div>

            <div className="text-center px-8">
                <p className="text-[10px] uppercase tracking-[0.2em] font-light opacity-60 leading-relaxed">
                    Nuestros cafés se sirven a 70°C
                    <br />
                    Avisanos si lo querés más caliente
                </p>
            </div>
        </div>
    );
};

export default CupSizeGuide;
