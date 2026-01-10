import { motion } from "framer-motion";
import Image from "next/image";

const LoadingTransition = () => {
  return (
    <motion.div
      className="
        fixed inset-0 z-[60]
        flex flex-col items-center justify-between
        p-6 md:p-12
        bg-aura-gradient
        overflow-hidden
        text-neutral-900
        tracking-wider
      "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Top Text */}
      {/* <div className="w-full flex justify-between items-start text-xs md:text-sm lg:text-base uppercase font-light opacity-80">
        <span>CAFÉ</span>
        <span>DE</span>
        <span>ORIGEN</span>
      </div> */}

      {/* Center Logo Image */}
      <div className="flex-1 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="
            relative
            w-[240px]
            md:w-[420px]
            lg:w-[520px]
            aspect-[3/1]
          "
        >
          <Image
            src="/cerologo.png" // ⬅️ vos cambiás esta ruta
            alt="CERO Café de Origen"
            fill
            priority
            className="object-contain"
          />
        </motion.div>
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
