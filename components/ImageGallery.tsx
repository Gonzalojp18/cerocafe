import { motion } from "framer-motion";
import Image from "next/image";
import coffeeHero1 from "@/assets/coffee-hero-1.jpg";
import pastryHero from "@/assets/pastry-hero.jpg";
import coffeeHero2 from "@/assets/coffee-hero-2.jpg";

const ImageGallery = () => {
  const images = [
    { src: coffeeHero1, alt: "Latte art", delay: 0.2 },
    { src: pastryHero, alt: "Croissant artesanal", delay: 0.4 },
    { src: coffeeHero2, alt: "Pour over", delay: 0.6 },
  ];

  return (
    <div className="flex items-center justify-center gap-4 md:gap-6 px-4">
      {images.map((image, index) => (
        <motion.div
          key={index}
          className="relative overflow-hidden rounded-2xl shadow-lg"
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ 
            duration: 0.7, 
            delay: image.delay,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        >
          <motion.div
            className="w-24 h-32 md:w-36 md:h-48 lg:w-44 lg:h-56"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover"
              width={176}
              height={224}
            />
          </motion.div>
          
          {/* Subtle overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        </motion.div>
      ))}
    </div>
  );
};

export default ImageGallery;
