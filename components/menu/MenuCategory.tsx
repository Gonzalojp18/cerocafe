import { motion } from "framer-motion";
import MenuItem from "./MenuItem";
import { LucideIcon } from "lucide-react";

interface Product {
  name: string;
  description: string;
  price: number | string;
}

interface MenuCategoryProps {
  title: string;
  products: Product[];
  index: number;
  icon?: LucideIcon;
  id?: string;
}

const MenuCategory = ({ title, products, index, icon: Icon, id }: MenuCategoryProps) => {
  return (
    <motion.div
      id={id}
      className="mb-8 scroll-mt-24" // scroll-mt ensures header doesn't cover title
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
    >
      <div className="flex items-center gap-3 mb-6">
        {Icon && (
          // <div className="p-2 rounded-full bg-[#1A3C34]/5 text-[#1A3C34]">
          <div className="p-2 rounded-full bg-[#1A3C34] text-white">
            <Icon size={20} strokeWidth={1.5} />
          </div>
        )}
        <h3 className="text-2xl font-serif text-[#1A3C34] tracking-wide" style={{ fontFamily: 'var(--font-abril)' }}>
          {title.toLowerCase()}
        </h3>
        <div className="h-[1px] flex-1 bg-[#1A3C34]/10 ml-4 opacity-50"></div>
      </div>

      <div className="space-y-6">
        {products.map((product, productIndex) => (
          <MenuItem
            key={productIndex}
            name={product.name}
            description={product.description}
            price={product.price}
            delay={productIndex * 0.05}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default MenuCategory;
