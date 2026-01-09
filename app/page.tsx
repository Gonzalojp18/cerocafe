'use client'

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Settings } from "lucide-react";
import { useSession } from "next-auth/react";
import Logo from "@/components/Logo";
import MenuButton from "@/components/MenuButton";
import ImageGallery from "@/components/ImageGallery";
import WelcomeText from "@/components/WelcomeText";
import MenuOverlay from "@/components/menu/MenuOverlay";
import BackgroundIcons from "@/components/BackgroundIcons";
import UserMenu from "@/components/UserMenu";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <div className="fixed inset-0 h-[100dvh] w-full bg-background overflow-hidden flex flex-col items-center justify-between py-8 md:py-12 touch-none">
      {/* Background Pattern */}
      <BackgroundIcons />

      {/* Top: Logo */}
      <Logo />

      {/* Center: Image Gallery */}
      <motion.div
        className="flex-1 flex flex-col items-center justify-center gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <ImageGallery />
        <WelcomeText />
      </motion.div>

      {/* Bottom: Menu Button */}
      <div className="pb-4">
        <MenuButton onClick={() => setIsMenuOpen(true)} />
      </div>

      {/* User Menu - Top Right */}
      <UserMenu />
      {/* Settings Icon - Bottom Right - Solo visible para staff u owner */}
      {(session?.user?.role === 'staff' || session?.user?.role === 'owner') && (
        <Link href={session?.user?.role === 'staff' ? '/caja' : '/admin'} className="absolute bottom-4 right-4 md:bottom-6 md:right-6">
          <Settings className="h-5 w-5 md:h-6 md:w-6 text-gray-400 hover:text-gray-600 cursor-pointer opacity-70 hover:opacity-100 transition-opacity" />
        </Link>
      )}

      {/* Menu Overlay */}
      <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  );
}