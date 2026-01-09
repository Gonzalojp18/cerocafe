import { motion } from "framer-motion";

const WelcomeText = () => {
  return (
    <motion.p
      className="text-center text-sm md:text-base text-muted-foreground max-w-md mx-auto px-6 leading-relaxed"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.8 }}
    >
      Luz natural, texturas crudas y el aroma de especialidad.
      <br />
    </motion.p>
  );
};

export default WelcomeText;
