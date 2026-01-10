'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Play, Youtube, ExternalLink, Clock, Eye } from "lucide-react";

interface VideoResult {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  url: string;
  channelTitle: string;
  publishedAt: string;
  duration: string;
  viewCount: string;
}

interface VideoSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const VideoSearch = ({ isOpen, onClose }: VideoSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [videos, setVideos] = useState<VideoResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoResult | null>(null);

  // Mock YouTube search function - In real app, this would call YouTube API
  const searchYouTubeVideos = async (query: string): Promise<VideoResult[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Mock video data
    const mockVideos: VideoResult[] = [
      {
        id: "dQw4w9WgXcQ",
        title: "Cómo preparar el café perfecto - Tutorial completo",
        description: "Aprende a preparar el café perfecto en casa con este tutorial completo. Desde la selección de granos hasta la preparación final.",
        thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        channelTitle: "Café Masters",
        publishedAt: "2024-01-10T10:00:00Z",
        duration: "12:34",
        viewCount: "45,234"
      },
      {
        id: "abc123def456",
        title: "Latte Art para principiantes - Curso básico",
        description: "Aprende las técnicas básicas de latte art. En este video te enseñamos a crear diseños simples pero impresionantes.",
        thumbnail: "https://img.youtube.com/vi/abc123def456/hqdefault.jpg",
        url: "https://www.youtube.com/watch?v=abc123def456",
        channelTitle: "Barista Academy",
        publishedAt: "2024-01-08T15:30:00Z",
        duration: "8:15",
        viewCount: "23,567"
      },
      {
        id: "xyz789uvw012",
        title: "Tipos de café y sus características",
        description: "Conoce los diferentes tipos de café: arábica, robusta, y sus variedades. Aprende a distinguir sabores y aromas.",
        thumbnail: "https://img.youtube.com/vi/xyz789uvw012/hqdefault.jpg",
        url: "https://www.youtube.com/watch?v=xyz789uvw012",
        channelTitle: "Coffee Experts",
        publishedAt: "2024-01-05T09:00:00Z",
        duration: "15:42",
        viewCount: "67,890"
      },
      {
        id: "mno345pqr678",
        title: "Máquinas de café: Guía de compra 2024",
        description: "Analizamos las mejores máquinas de café del mercado. Desde espresso domésticas hasta cafeteras de goteo.",
        thumbnail: "https://img.youtube.com/vi/mno345pqr678/hqdefault.jpg",
        url: "https://www.youtube.com/watch?v=mno345pqr678",
        channelTitle: "Tech Coffee",
        publishedAt: "2024-01-03T18:00:00Z",
        duration: "18:20",
        viewCount: "34,123"
      },
      {
        id: "stu901vwx234",
        title: "Cultura del café alrededor del mundo",
        description: "Un viaje por las diferentes culturas del café en Italia, Colombia, Etiopía y Japón. Descubre tradiciones únicas.",
        thumbnail: "https://img.youtube.com/vi/stu901vwx234/hqdefault.jpg",
        url: "https://www.youtube.com/watch?v=stu901vwx234",
        channelTitle: "World Coffee",
        publishedAt: "2024-01-01T12:00:00Z",
        duration: "22:15",
        viewCount: "89,456"
      }
    ];

    return mockVideos.filter(video =>
      video.title.toLowerCase().includes(query.toLowerCase()) ||
      video.description.toLowerCase().includes(query.toLowerCase()) ||
      video.channelTitle.toLowerCase().includes(query.toLowerCase())
    );
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const results = await searchYouTubeVideos(searchQuery);
      setVideos(results);
    } catch (error) {
      console.error("Error searching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const formatViewCount = (count: string) => {
    const num = parseInt(count.replace(/,/g, ''));
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return count;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "hace 1 día";
    if (diffDays < 7) return `hace ${diffDays} días`;
    if (diffDays < 30) return `hace ${Math.floor(diffDays / 7)} semanas`;
    if (diffDays < 365) return `hace ${Math.floor(diffDays / 30)} meses`;
    return `hace ${Math.floor(diffDays / 365)} años`;
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
          className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Youtube className="w-6 h-6 text-red-600" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Búsqueda de Videos</h2>
                <p className="text-sm text-gray-600 mt-1">Busca videos de YouTube relacionados con tu consulta</p>
              </div>
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
                  placeholder="Buscar videos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={loading || !searchQuery.trim()}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <Youtube className="w-4 h-4" />
                {loading ? "Buscando..." : "Buscar"}
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              </div>
            ) : videos.length > 0 ? (
              <div className="p-6 space-y-4">
                {videos.map((video, index) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.1 }}
                    className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => setSelectedVideo(video)}
                  >
                    {/* Thumbnail */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-48 h-27 object-cover rounded-lg"
                      />
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1 rounded">
                        {video.duration}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                          <Play className="w-6 h-6 text-white ml-1" />
                        </div>
                      </div>
                    </div>

                    {/* Video Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">{video.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">{video.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="font-medium">{video.channelTitle}</span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {formatViewCount(video.viewCount)} vistas
                        </span>
                        <span>{formatDate(video.publishedAt)}</span>
                      </div>
                    </div>

                    {/* External Link */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(video.url, '_blank');
                      }}
                      className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 text-gray-600" />
                    </button>
                  </motion.div>
                ))}
              </div>
            ) : searchQuery ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Youtube className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No se encontraron videos para "{searchQuery}"</p>
                  <p className="text-sm text-gray-400 mt-1">Intenta con otra búsqueda</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Youtube className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Ingresa una búsqueda para encontrar videos</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Video Preview Modal */}
        <AnimatePresence>
          {selectedVideo && (
            <motion.div
              className="fixed inset-0 z-60 bg-black/95 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedVideo(null)}
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
                  onClick={() => setSelectedVideo(null)}
                  className="absolute -top-12 right-0 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>

                {/* Video Embed */}
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  <iframe
                    src={`https://www.youtube.com/embed/${selectedVideo.id}`}
                    title={selectedVideo.title}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>

                {/* Video Info */}
                <div className="mt-4 p-4 bg-white rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">{selectedVideo.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{selectedVideo.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="font-medium">{selectedVideo.channelTitle}</span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {formatViewCount(selectedVideo.viewCount)} vistas
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {selectedVideo.duration}
                      </span>
                    </div>
                    <button
                      onClick={() => window.open(selectedVideo.url, '_blank')}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                    >
                      <Youtube className="w-4 h-4" />
                      Ver en YouTube
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

export default VideoSearch;