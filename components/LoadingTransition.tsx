import { motion } from "framer-motion";

const LoadingTransition = () => {
    return (
        <motion.div
            className="fixed inset-0 z-[60] flex flex-col items-center justify-between p-6 md:p-12 bg-aura-gradient overflow-hidden font-sans tracking-wider text-neutral-900"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Top Text */}
            <div className="w-full flex justify-between items-start text-xs md:text-sm lg:text-base uppercase font-light opacity-80">
                <span>CAFÉ</span>
                <span>DE</span>
                <span>ORIGEN</span>
            </div>

            {/* Center Text "CERO" */}
            <div className="flex-1 flex items-center justify-center">
                <motion.h1
                    className="font-serif text-[5rem] md:text-[8rem] lg:text-[10rem] leading-none text-[#2a1c12]"
                    style={{ fontFamily: 'var(--font-abril)' }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    CERO
                </motion.h1>
            </div>

            {/* Bottom Text */}
            <div className="w-full flex justify-between items-end text-[10px] md:text-sm lg:text-base uppercase font-light opacity-80">
                <span>UNA</span>
                <span>FORMA</span>
                <span>DISTINTA</span>
                <span>DE</span>
                <span>HABITAR</span>
                <span>EL</span>
                <span>ESPACIO</span>
            </div>
        </motion.div>
    );
};

export default LoadingTransition;
