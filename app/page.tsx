'use client'

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Settings } from "lucide-react";
import { useSession } from "next-auth/react";
import MenuButton from "@/components/MenuButton";
// import ImageGallery from "@/components/ImageGallery";
import MenuOverlay from "@/components/menu/MenuOverlay";
import UserMenu from "@/components/UserMenu";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <div className="fixed inset-0 h-[100dvh] w-full bg-aura-gradient overflow-hidden flex flex-col justify-between font-sans tracking-wider text-neutral-900 touch-none">

      {/* Top Text - UNA MANERA DIFERENTE DE HABITAR */}
      <motion.div
        className="w-full px-6 md:px-12 pt-6 md:pt-10 flex justify-between items-start text-[10px] md:text-sm lg:text-base uppercase font-light z-10 shrink-0"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <span>UNA</span>
        <span>MANERA</span>
        <span>DIFERENTE</span>
        <span>DE</span>
        <span>HABITAR</span>
      </motion.div>

      {/* Center: "O" ondulada (logo central sin texto "CERO") + Gallery */}
      <div className="flex-1 flex flex-col items-center mt-[5%] justify-center relative z-10 pointer-events-none min-h-0">
        {/* Logo central: "O" ondulada/orgánica */}
        <motion.div
          className="relative w-1/2 md:w-1/3 lg:w-[30%] max-w-[300px] mb-4 md:mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <svg
            viewBox="0 0 400 400"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto drop-shadow-lg"
          >
            <defs>
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="10%">
                {/* <stop offset="0%" stopColor="#2a1c12" />
                <stop offset="40%" stopColor="#c98a45" />
                <stop offset="70%" stopColor="#f1c27d" /> */}
                <stop offset="100%" stopColor="#251403ff" />
              </linearGradient>
            </defs>

            <path
              d="M 200 65 C 130 70, 80 140, 95 210 C 115 290, 170 335, 235 325 C 295 310, 330 245, 310 185 C 290 115, 245 55, 200 65 Z M 200 115 C 240 110, 275 145, 265 195 C 255 245, 225 275, 195 280 C 155 285, 125 245, 130 205 C 135 155, 160 120, 200 115 Z"
              fill="url(#goldGradient)"
              fillRule="evenodd"
            />
          </svg>

        </motion.div>

        {/* Image Gallery (opcional) */}
        {/* <div className="z-10 pointer-events-auto w-full max-w-2xl md:px-0 px-2 scale-90 md:scale-100 origin-center">
          <ImageGallery />
        </div> */}
      </div>

      {/* Bottom: Botón de menú centrado + CAFÉ ORIGEN debajo */}
      <div className="w-full pb-8 md:pb-12 flex flex-col items-center justify-center gap-6 md:gap-8 z-10 shrink-0">

        {/* Botón de menú centrado */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <MenuButton onClick={() => setIsMenuOpen(true)} />
        </motion.div>

        {/* CAFÉ ORIGEN debajo del botón */}
        <motion.div
          className="flex justify-center gap-8 md:gap-12 text-[10px] md:text-sm lg:text-base uppercase font-light tracking-widest"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4 }}
        >
          <span>CAFÉ</span>
          <span>DE</span>
          <span>ORIGEN</span>
        </motion.div>
      </div>

      {/* User Menu (top right, moved down to avoid overlapping "HABITAR") */}
      <div className="absolute top-16 right-6 md:top-20 md:right-12 z-50">
        <UserMenu />
      </div>

      {/* Settings Icon (solo para staff/owner) */}
      {(session?.user?.role === 'staff' || session?.user?.role === 'owner') && (
        <Link href={session?.user?.role === 'staff' ? '/caja' : '/admin'} className="absolute bottom-4 right-4 z-50">
          <Settings className="h-5 w-5 md:h-6 md:w-6 text-neutral-700 hover:text-black transition-colors" />
        </Link>
      )}

      {/* Menu Overlay */}
      <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  );
}


// <stop offset="0%" stopColor="#2a1c12" />
// <stop offset="40%" stopColor="#c98a45" />
// <stop offset="70%" stopColor="#f1c27d" />
// <stop offset="100%" stopColor="#3b2a1a" />