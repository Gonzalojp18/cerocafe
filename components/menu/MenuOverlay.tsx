'use client';

import { motion, AnimatePresence } from "framer-motion";
import { X, Coffee, CupSoda, Leaf, Snowflake, GlassWater, Zap, Citrus, Egg, Utensils, Sandwich, Croissant } from "lucide-react";
import MenuCategory from "./MenuCategory";
import OriginSection from "./OriginSection";
import CupSizeGuide from "./CupSizeGuide";
import MenuBottomNav from "./MenuBottomNav";
import { useEffect, useState } from "react";

interface Product {
  name: string;
  description: string;
  price: number | string;
}

interface CategoryData {
  title: string;
  description: string;
  products: Product[];
}

interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const MenuOverlay = ({ isOpen, onClose }: MenuOverlayProps) => {
  const [menuData, setMenuData] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);

  // Icon mapping for categories
  const getCategoryIcon = (categoryName: string) => {
    const normalized = categoryName.toLowerCase();
    if (normalized.includes('just coffee') || normalized.includes('cafe puro')) return Coffee;
    if (normalized.includes('milk') || normalized.includes('leche')) return CupSoda;
    if (normalized.includes('otros') || normalized.includes('te')) return Leaf;
    if (normalized.includes('cold') || normalized.includes('fria')) return Snowflake;
    if (normalized.includes('alcohol')) return GlassWater;
    if (normalized.includes('licuado')) return Zap;
    if (normalized.includes('jugo')) return Citrus;
    if (normalized.includes('brunch')) return Egg;
    if (normalized.includes('morfi')) return Utensils;
    if (normalized.includes('all day')) return Sandwich;
    if (normalized.includes('pastries') || normalized.includes('pasteleria')) return Croissant;
    return Coffee; // Default
  };

  const handleScrollToCategory = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // Offset for fixed header if needed, but 'scroll-mt' in CSS usually handles it.
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    if (isOpen) {
      const fetchMenu = async () => {
        try {
          const res = await fetch('/api/menu');
          const data = await res.json();
          setMenuData(data);
        } catch (error) {
          console.error('Error cargando menú:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchMenu();
    }
  }, [isOpen]);

  if (loading) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div className="fixed inset-0 z-50 bg-background flex items-center justify-center">
            <p className="text-lg text-[#1A3C34]">Cargando menú...</p>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-[#Fdfbf7] overflow-y-auto pb-28"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <motion.header
            className="sticky top-0 z-10 bg-[#Fdfbf7]/95 backdrop-blur-sm border-b border-[#1A3C34]/10"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="flex items-center justify-between px-6 py-4 max-w-2xl mx-auto">
              <div>
                <h2 className="text-lg font-serif font-medium tracking-[0.1em] text-[#1A3C34]">MENÚ</h2>
                <p className="text-xs text-[#1A3C34]/70 tracking-wider">JULIETTE</p>
              </div>

              <motion.button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-[#1A3C34]/5 flex items-center justify-center 
                         hover:bg-[#1A3C34] hover:text-white transition-colors duration-200 text-[#1A3C34]"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={20} />
              </motion.button>
            </div>
          </motion.header>

          {/* Menu Content */}
          <main className="max-w-2xl mx-auto px-6 py-10">
            {/* Welcome Banner */}
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="w-12 h-[2px] bg-[#1A3C34]/20 mx-auto mb-6" />
              <p className="text-sm text-[#1A3C34]/80 leading-relaxed max-w-sm mx-auto font-medium">
                Luz natural, texturas crudas y el aroma de especialidad.
                Disfruta de la calma de nuestro jardín interior o de la energía de nuestra barra naranja.
              </p>
              <div className="w-12 h-[2px] bg-[#1A3C34]/20 mx-auto mt-6" />
            </motion.div>

            {/* Cup Size Guide */}
            <motion.div
              className="mb-12 border-b border-[#1A3C34]/10 pb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <CupSizeGuide />
            </motion.div>

            {/* Categories */}
            <div className="space-y-16">
              {menuData.map((category, index) => {
                const Icon = getCategoryIcon(category.title);
                const categoryId = `category-${index}`;

                return (
                  <MenuCategory
                    key={category.title}
                    id={categoryId}
                    title={category.title}
                    products={category.products}
                    index={index}
                    icon={Icon}
                  />
                );
              })}
            </div>

            {/* Origin Section */}
            <div className="mt-20">
              <OriginSection />
            </div>
          </main>

          {/* Bottom Navigation */}
          <MenuBottomNav
            categories={menuData.map((cat, idx) => ({
              id: `category-${idx}`,
              label: cat.title.split(' ')[0], // Short name (first word)
              icon: getCategoryIcon(cat.title)
            }))}
            onSelect={handleScrollToCategory}
          />

          {/* Footer */}
          <footer className="text-center py-6 text-xs text-[#1A3C34]/60 tracking-wider mb-8">
            © 2024 JULIETTE · Café de Especialidad
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MenuOverlay;