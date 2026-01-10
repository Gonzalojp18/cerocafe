import { Coffee, Croissant, Leaf, Bean, UtensilsCrossed, ChefHat } from "lucide-react";

const BackgroundIcons = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {/* Top Left - Croissant */}
            <div className="absolute top-[10%] left-[5%] text-black opacity-[0.06] rotate-[-15deg]">
                <Croissant size={120} strokeWidth={1} />
            </div>

            {/* Top Right - Coffee Bean */}
            <div className="absolute top-[15%] right-[8%] text-black opacity-[0.06] rotate-[30deg]">
                <Bean size={80} strokeWidth={1} />
            </div>

            {/* Mid Left - Leaf */}
            <div className="absolute top-[45%] left-[-2%] text-black opacity-[0.06] rotate-[45deg]">
                <Leaf size={150} strokeWidth={0.8} />
            </div>

            {/* Mid Right - Coffee */}
            <div className="absolute top-[50%] right-[2%] text-black opacity-[0.06] rotate-[-10deg]">
                <Coffee size={100} strokeWidth={1} />
            </div>

            {/* Bottom Left - Chef Hat (Kitchen hint) */}
            <div className="absolute bottom-[10%] left-[10%] text-black opacity-[0.06] rotate-[10deg]">
                <ChefHat size={90} strokeWidth={1} />
            </div>

            {/* Bottom Right - Utensils */}
            <div className="absolute bottom-[20%] right-[15%] text-black opacity-[0.06] rotate-[-25deg]">
                <UtensilsCrossed size={110} strokeWidth={0.8} />
            </div>
        </div>
    );
};

export default BackgroundIcons;
