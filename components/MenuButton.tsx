import { motion } from "framer-motion";

interface MenuButtonProps {
  onClick: () => void;
}

const MenuButton = ({ onClick }: MenuButtonProps) => {
  return (
    <motion.button
      onClick={onClick}
      className="menu-button text-xl font-medium bg-[#FB732F] text-white p-4 rounded-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      Ver Menú
    </motion.button>
  );
};

export default MenuButton;
