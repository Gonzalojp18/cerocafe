import { motion } from "framer-motion";

const CupIcon = ({
    type,
    scale = 1,
    className = ""
}: {
    type: 'cup' | 'bowl' | 'togo';
    scale?: number;
    className?: string; // added to satisfy linter if needed, though we use currentcolor
}) => {
    const baseColor = "currentColor";
    const strokeWidth = 2; // Thicker lines like the image

    if (type === 'cup') {
        return (
            <svg viewBox="0 0 40 30" width={40 * scale} height={30 * scale} className={className} fill="none" stroke={baseColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
                {/* Bowl */}
                <path d="M5 5  C 5 25, 30 25, 30 5 Z" />
                {/* Handle */}
                <path d="M30 8 C 35 6, 36 18, 30 18" />
                {/* Top rim (simulated line) */}
                <line x1="5" y1="5" x2="30" y2="5" />
            </svg>
        );
    }

    if (type === 'bowl') {
        return (
            <svg viewBox="0 0 40 30" width={40 * scale} height={30 * scale} className={className} fill="none" stroke={baseColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
                {/* Rounded Bowl Shape */}
                <path d="M8 5 C 2 15, 2 25, 20 25 C 38 25, 38 15, 32 5 Z" />
                {/* Top rim */}
                <ellipse cx="20" cy="5" rx="12" ry="2" />
            </svg>
        );
    }

    if (type === 'togo') {
        return (
            <svg viewBox="0 0 30 40" width={30 * scale} height={40 * scale} className={className} fill="none" stroke={baseColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
                {/* Cup body */}
                <path d="M7 10 L 10 38 L 20 38 L 23 10 " />
                {/* Lid */}
                <path d="M5 10 L 25 10 L 23 5 L 7 5 Z" />
                <path d="M10 5 L 10 3 L 20 3 L 20 5" />
                {/* Sleeve */}
                <path d="M8 20 L 22 20" />
                <path d="M9 28 L 21 28" />
                {/* Tiny logo mark on sleeve */}
                <path d="M14 22 L 14 26 L 16 26" strokeWidth={1.5} />
            </svg>
        );
    }

    return null;
};

const CupSizeGuide = () => {
    return (
        <div className="w-full flex flex-wrap justify-center items-end gap-x-6 gap-y-8 py-8 text-[#1A3C34]">
            {/* 150ml */}
            <div className="flex flex-col items-center gap-2">
                <CupIcon type="cup" scale={1} />
                <span className="text-[10px] font-medium tracking-wider">150 ml</span>
            </div>

            {/* 200ml */}
            <div className="flex flex-col items-center gap-2">
                <CupIcon type="cup" scale={1.2} />
                <span className="text-[10px] font-medium tracking-wider">200 ml</span>
            </div>

            {/* 250ml */}
            <div className="flex flex-col items-center gap-2">
                <CupIcon type="cup" scale={1.4} />
                <span className="text-[10px] font-medium tracking-wider">250 ml</span>
            </div>

            {/* 400ml Bowl */}
            <div className="flex flex-col items-center gap-2">
                <CupIcon type="bowl" scale={1.5} />
                <span className="text-[10px] font-medium tracking-wider">400 ml</span>
            </div>

            {/* 240ml ToGo */}
            <div className="flex flex-col items-center gap-2">
                <CupIcon type="togo" scale={1.1} />
                <span className="text-[10px] font-medium tracking-wider">240 ml</span>
            </div>

            {/* 320ml ToGo */}
            <div className="flex flex-col items-center gap-2">
                <CupIcon type="togo" scale={1.3} />
                <span className="text-[10px] font-medium tracking-wider">320 ml</span>
            </div>
            <div>
                <p className="text-[10px] font-medium tracking-wider">NUESTROS CAFÉS SE SIRVEN A 70°C AVISANOS SI LO QUERES MAS CALIENTE</p>
            </div>
        </div>
    );
};

export default CupSizeGuide;
