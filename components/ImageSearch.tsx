'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, ChevronLeft, ChevronRight, Download, ExternalLink } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

interface ImageResult {
  id: string;
  url: string;
  thumbnail: string;
  title: string;
  source: string;
  width: number;
  height: number;
}

interface ImageSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const ImageSearch = ({ isOpen, onClose }: ImageSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [images, setImages] = useState<ImageResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageResult | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Mock image search function - In real app, this would call an image search API
  const searchImages = async (query: string): Promise<ImageResult[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data based on search query
    const mockImages: ImageResult[] = [
      {
        id: "1",
        url: "https://picsum.photos/800/600?random=1",
        thumbnail: "https://picsum.photos/200/150?random=1",
        title: "Café especialidad - Taza fresca",
        source: "Coffee Gallery",
        width: 800,
        height: 600
      },
      {
        id: "2", 
        url: "https://picsum.photos/800/600?random=2",
        thumbnail: "https://picsum.photos/200/150?random=2",
        title: "Máquina de café espresso",
        source: "Coffee Equipment",
        width: 800,
        height: 600
      },
      {
        id: "3",
        url: "https://picsum.photos/800/600?random=3", 
        thumbnail: "https://picsum.photos/200/150?random=3",
        title: "Granos de café tostados",
        source: "Coffee Beans Co",
        width: 800,
        height: 600
      },
      {
        id: "4",
        url: "https://picsum.photos/800/600?random=4",
        thumbnail: "https://picsum.photos/200/150?random=4", 
        title: "Latte art - Café decorado",
        source: "Barista Academy",
        width: 800,
        height: 600
      },
      {
        id: "5",
        url: "https://picsum.photos/800/600?random=5",
        thumbnail: "https://picsum.photos/200/150?random=5",
        title: "Cafetería interior acogedor",
        source: "Cafe Design",
        width: 800,
        height: 600
      },
      {
        id: "6",
        url: "https://picsum.photos/800/600?random=6",
        thumbnail: "https://picsum.photos/200/150?random=6",
        title: "Pastelería fresca",
        source: "Bakery Fresh",
        width: 800,
        height: 600
      }
    ];

    return mockImages.filter(img => 
      img.title.toLowerCase().includes(query.toLowerCase()) ||
      img.source.toLowerCase().includes(query.toLowerCase())
    );
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const results = await searchImages(searchQuery);
      setImages(results);
      setCarouselIndex(0);
    } catch (error) {
      console.error("Error searching images:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleImageClick = (image: ImageResult, index: number) => {
    setSelectedImage(image);
    setCarouselIndex(index);
  };

  const downloadImage = (imageUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Búsqueda de Imágenes</h2>
              <p className="text-sm text-gray-600 mt-1">Busca y explora imágenes relacionadas con tu consulta</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar imágenes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={loading || !searchQuery.trim()}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Buscando..." : "Buscar"}
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              </div>
            ) : images.length > 0 ? (
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <motion.div
                      key={image.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.1 }}
                      className="cursor-pointer group"
                      onClick={() => handleImageClick(image, index)}
                    >
                      <div className="relative overflow-hidden rounded-lg aspect-video bg-gray-100">
                        <img
                          src={image.thumbnail}
                          alt={image.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                          <ExternalLink className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-900 truncate">{image.title}</p>
                        <p className="text-xs text-gray-500">{image.source}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : searchQuery ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <p className="text-gray-500">No se encontraron imágenes para "{searchQuery}"</p>
                  <p className="text-sm text-gray-400 mt-1">Intenta con otra búsqueda</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Ingresa una búsqueda para encontrar imágenes</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Image Preview Modal */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              className="fixed inset-0 z-60 bg-black/95 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
            >
              <motion.div
                className="relative max-w-4xl w-full"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute -top-12 right-0 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>

                {/* Carousel */}
                <Carousel className="w-full">
                  <CarouselContent>
                    {images.map((img) => (
                      <CarouselItem key={img.id}>
                        <div className="relative">
                          <img
                            src={img.url}
                            alt={img.title}
                            className="w-full h-auto max-h-[60vh] object-contain rounded-lg"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
                            <h3 className="text-white font-semibold text-lg mb-1">{img.title}</h3>
                            <p className="text-white/80 text-sm">{img.source} • {img.width} × {img.height}px</p>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-2" />
                  <CarouselNext className="right-2" />
                </Carousel>

                {/* Action Buttons */}
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={() => downloadImage(selectedImage.url, `${selectedImage.title}.jpg`)}
                    className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <Download className="w-4 h-4 text-white" />
                  </button>
                  <button
                    onClick={() => window.open(selectedImage.url, '_blank')}
                    className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-white" />
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImageSearch;