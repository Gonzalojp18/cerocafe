import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface CategoryNavItem {
    id: string;
    label: string;
    icon: LucideIcon;
}

interface MenuBottomNavProps {
    categories: CategoryNavItem[];
    onSelect: (id: string) => void;
}

const MenuBottomNav = ({ categories, onSelect }: MenuBottomNavProps) => {
    return (
        <motion.div
            className="fixed bottom-0 left-0 w-full bg-[#1A3C34] border-t border-[#1A3C34]/10 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pb-safe"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 100, damping: 20 }}
        >
            <div className="flex overflow-x-auto py-2 px-4 hide-scrollbar gap-2 md:justify-center">
                {categories.map((cat) => {
                    const Icon = cat.icon;
                    return (
                        <button
                            key={cat.id}
                            onClick={() => onSelect(cat.id)}
                            className="flex flex-col items-center gap-1 min-w-[72px] p-2 rounded-xl active:bg-[#1A3C34]/5 transition-colors duration-200"
                        >
                            <div className="w-10 h-8 rounded-full flex items-center justify-center text-white">
                                <Icon size={30} strokeWidth={1.5} />
                            </div>
                            <span className="text-[12px] font-medium text-white whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                                {cat.label}
                            </span>
                        </button>
                    )
                })}
            </div>
            {/* Safe area padding helper */}
            <div className="h-[env(safe-area-inset-bottom)] bg-[#Fdfbf7]" />
        </motion.div>
    );
};

export default MenuBottomNav;
