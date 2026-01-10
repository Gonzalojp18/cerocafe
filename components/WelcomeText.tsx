import { motion } from "framer-motion";

const WelcomeText = () => {

  return (
    <>
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <p className="text-sm md:text-base text-black/80 max-w-md mx-auto px-6 leading-relaxed mb-6">
          UNA MANERA DIFERENTE DE HABITAR
          <br />
        </p>

        {/* Search Options */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
        </motion.div>
      </motion.div>

    </>
  );
};

export default WelcomeText;
