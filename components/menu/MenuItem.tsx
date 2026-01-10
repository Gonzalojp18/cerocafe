import { motion } from "framer-motion";

interface MenuItemProps {
  name: string;
  description: string;
  price: number | string;
  delay?: number;
}

const MenuItem = ({ name, description, price, delay = 0 }: MenuItemProps) => {
  return (
    <motion.div
      className="group relative"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <div className="flex justify-between items-baseline gap-4">
        <h4 className="text-lg font-medium text-black group-hover:text-black/80 transition-colors duration-200">
          {name}
        </h4>

        {/* Dotted line filler - optional, but nice for menus */}
        <div className="flex-1 border-b border-dotted border-black/20 mx-2 mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <span className="text-lg font-semibold text-[#FB732F] whitespace-nowrap">
          ${parseInt(price.toString()).toLocaleString('es-AR')}
        </span>
      </div>

      {description && (
        <p className="text-sm text-black/60 mt-1 font-light leading-relaxed max-w-[85%]">
          {description}
        </p>
      )}
    </motion.div>
  );
};

export default MenuItem;
