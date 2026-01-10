'use client';

import { motion } from "framer-motion";
import Image from "next/image";

interface FeaturedDish {
  id: string;
  name: string;
  image: string;
  price: string;
}

const featuredDishes: FeaturedDish[] = [
  {
    id: '1',
    name: 'Espresso Signature',
    image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&h=300&fit=crop',
    price: '$3.50'
  },
  {
    id: '2',
    name: 'Artisan Croissant',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=300&fit=crop',
    price: '$4.20'
  },
  {
    id: '3',
    name: 'Matcha Latte',
    image: 'https://images.unsplash.com/photo-1536257104079-aa99c6460a5a?w=400&h=300&fit=crop',
    price: '$5.80'
  },
  {
    id: '4',
    name: 'Avocado Toast',
    image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&h=300&fit=crop',
    price: '$8.90'
  },
  {
    id: '5',
    name: 'Cold Brew',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop',
    price: '$4.50'
  },
  {
    id: '6',
    name: 'Blueberry Muffin',
    image: 'https://images.unsplash.com/photo-1587668178277-295251f900ce?w=400&h=300&fit=crop',
    price: '$3.80'
  }
];

export default function FeaturedDishes() {
  return (
    <motion.section
      className="my-20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-serif font-medium text-black tracking-wide" style={{ fontFamily: 'var(--font-abril)' }}>
          Platos Destacados
        </h2>
        <div className="w-12 h-[1px] bg-black/20 mx-auto mt-4" />
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {featuredDishes.map((dish, index) => (
          <motion.div
            key={dish.id}
            className="group cursor-pointer"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={dish.image}
                alt={dish.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </div>
            <div className="mt-3 text-center">
              <h3 className="text-sm font-medium text-black tracking-wide line-clamp-2">
                {dish.name}
              </h3>
              <p className="text-xs text-black/60 mt-1 font-medium">
                {dish.price}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}