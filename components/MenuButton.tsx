import { motion } from "framer-motion";

interface MenuButtonProps {
  onClick: () => void;
}

const MenuButton = ({ onClick }: MenuButtonProps) => {
  return (
    <motion.button
      onClick={onClick}
      className="menu-button group flex items-center gap-2 text-lg md:text-xl font-light tracking-widest text-[#2a1c12] hover:opacity-70 transition-opacity"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <span className="border-b border-[#2a1c12] pb-1">VER MENÚ</span>
    </motion.button>
  );
};

export default MenuButton;
