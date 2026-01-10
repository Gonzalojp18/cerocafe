'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, ExternalLink, Calendar, Building2, Clock } from "lucide-react";

interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  imageUrl: string;
  source: {
    name: string;
    url: string;
  };
  author: string;
  publishedAt: string;
  category: string;
}

interface NewsSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewsSearch = ({ isOpen, onClose }: NewsSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Mock news search function - In real app, this would call a news API
  const searchNews = async (query: string, category: string = "all"): Promise<NewsArticle[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock news data
    const mockArticles: NewsArticle[] = [
      {
        id: "1",
        title: "Nuevo récord en precio del café de especialidad",
        description: "El mercado del café de especialidad alcanza precios históricos debido a la creciente demanda y las condiciones climáticas adversas en las principales regiones productoras.",
        content: "El mercado global del café de especialidad está experimentando una transformación sin precedentes. Según los expertos del sector, los precios han alcanzado niveles récord este trimestre, impulsados por una combinación de factores que incluyen el cambio climático, la creciente demanda de consumidores conscientes y las nuevas técnicas de procesamiento que han revolucionado la industria...",
        url: "https://example.com/news/coffee-prices-record",
        imageUrl: "https://picsum.photos/400/250?random=1",
        source: {
          name: "El Economista",
          url: "https://eleconomista.com"
        },
        author: "María González",
        publishedAt: "2024-01-15T08:00:00Z",
        category: "economía"
      },
      {
        id: "2",
        title: "Tecnología revoluciona la producción de café",
        description: "Nuevas tecnologías de IA y machine learning están optimizando el proceso de producción y calidad del café, desde la siembra hasta la taza final.",
        content: "La industria del café está siendo transformada por la tecnología. Fincas cafetaleras de todo el mundo están implementando sistemas de inteligencia artificial que pueden predecir enfermedades en las plantas, optimizar el riego y determinar el momento perfecto para la cosecha. Estas innovaciones no solo mejoran la calidad del producto final, sino que también contribuyen a la sostenibilidad del sector...",
        url: "https://example.com/news/technology-coffee",
        imageUrl: "https://picsum.photos/400/250?random=2",
        source: {
          name: "Tech Insider",
          url: "https://techinsider.com"
        },
        author: "Carlos Rodríguez",
        publishedAt: "2024-01-14T14:30:00Z",
        category: "tecnología"
      },
      {
        id: "3",
        title: "Sostenibilidad: El futuro del café orgánico",
        description: "Cada vez más consumidores eligen café orgánico y de comercio justo, impulsando cambios significativos en las prácticas agrícolas globales.",
        content: "La tendencia hacia el consumo sostenible está redefiniendo la industria cafetalera. Los consumidores modernos no solo buscan calidad en su taza, sino también garantías de prácticas éticas y ambientales responsables. Este cambio ha provocado que miles de productores transicionen hacia métodos orgánicos y certificaciones de comercio justo...",
        url: "https://example.com/news/sustainable-coffee",
        imageUrl: "https://picsum.photos/400/250?random=3",
        source: {
          name: "Ambiente Sostenible",
          url: "https://ambientesostenible.com"
        },
        author: "Ana Martínez",
        publishedAt: "2024-01-13T10:15:00Z",
        category: "sostenibilidad"
      },
      {
        id: "4",
        title: "Guía de cafeterías emergentes en 2024",
        description: "Conoce las nuevas cafeterías que están revolucionando la escena del café especialidad con propuestas innovadoras y espacios únicos.",
        content: "El año 2024 ha traído consigo una ola de nuevas cafeterías que están cambiando el panorama urbano. Desde espacios minimalistas nórdicos hasta conceptos fusion que combinan el café con arte local, estos nuevos establecimientos están ofreciendo experiencias únicas que van más allá de simplemente servir una buena taza de café...",
        url: "https://example.com/news/coffee-shops-2024",
        imageUrl: "https://picsum.photos/400/250?random=4",
        source: {
          name: "Gastronomía Hoy",
          url: "https://gastronomiahoy.com"
        },
        author: "Pedro López",
        publishedAt: "2024-01-12T16:45:00Z",
        category: "tendencias"
      },
      {
        id: "5",
        title: "Salud: Los beneficios científicos del café",
        description: "Nuevos estudios confirman los múltiples beneficios para la salud del consumo moderado de café, desde la prevención de enfermedades hasta la mejora cognitiva.",
        content: "La ciencia continúa descubriendo los sorprendentes beneficios del café para la salud humana. Un reciente estudio publicado en la Revista Médica Internacional ha encontrado que el consumo moderado de café está asociado con una reducción significativa en el riesgo de desarrollar enfermedades neurodegenerativas, diabetes tipo 2 y ciertos tipos de cáncer...",
        url: "https://example.com/news/coffee-health-benefits",
        imageUrl: "https://picsum.photos/400/250?random=5",
        source: {
          name: "Salud y Bienestar",
          url: "https://saludybienestar.com"
        },
        author: "Dra. Laura Sánchez",
        publishedAt: "2024-01-11T12:00:00Z",
        category: "salud"
      }
    ];

    let filteredArticles = mockArticles.filter(article =>
      article.title.toLowerCase().includes(query.toLowerCase()) ||
      article.description.toLowerCase().includes(query.toLowerCase()) ||
      article.content.toLowerCase().includes(query.toLowerCase())
    );

    if (category !== "all") {
      filteredArticles = filteredArticles.filter(article => article.category === category);
    }

    return filteredArticles;
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const results = await searchNews(searchQuery, selectedCategory);
      setArticles(results);
    } catch (error) {
      console.error("Error searching news:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('es-ES', options);
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      return `hace ${diffHours} horas`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `hace ${diffDays} días`;
    }
  };

  const categories = [
    { value: "all", label: "Todas" },
    { value: "economía", label: "Economía" },
    { value: "tecnología", label: "Tecnología" },
    { value: "sostenibilidad", label: "Sostenibilidad" },
    { value: "tendencias", label: "Tendencias" },
    { value: "salud", label: "Salud" }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "economía": return "bg-blue-100 text-blue-800";
      case "tecnología": return "bg-purple-100 text-purple-800";
      case "sostenibilidad": return "bg-green-100 text-green-800";
      case "tendencias": return "bg-orange-100 text-orange-800";
      case "salud": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
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
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Búsqueda de Noticias</h2>
              <p className="text-sm text-gray-600 mt-1">Explora las últimas noticias sobre café y temas relacionados</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Search and Filter */}
          <div className="p-6 border-b border-gray-200 space-y-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar noticias..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={loading || !searchQuery.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Buscando..." : "Buscar"}
              </button>
            </div>
            
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.value
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : articles.length > 0 ? (
              <div className="p-6 space-y-4">
                {articles.map((article, index) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.1 }}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedArticle(article)}
                  >
                    <div className="flex gap-4 p-4">
                      {/* Image */}
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-32 h-20 object-cover rounded-lg flex-shrink-0"
                      />
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getCategoryColor(article.category)}`}>
                            {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                          </span>
                          <span className="text-xs text-gray-500">{getTimeAgo(article.publishedAt)}</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{article.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">{article.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Building2 className="w-3 h-3" />
                              {article.source.name}
                            </span>
                            <span>Por {article.author}</span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(article.url, '_blank');
                            }}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            Leer más
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : searchQuery ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <p className="text-gray-500">No se encontraron noticias para "{searchQuery}"</p>
                  <p className="text-sm text-gray-400 mt-1">Intenta con otra búsqueda o categoría</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Ingresa una búsqueda para encontrar noticias</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Article Preview Modal */}
        <AnimatePresence>
          {selectedArticle && (
            <motion.div
              className="fixed inset-0 z-60 bg-black/95 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedArticle(null)}
            >
              <motion.div
                className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-white rounded-xl"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                  <div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getCategoryColor(selectedArticle.category)}`}>
                      {selectedArticle.category.charAt(0).toUpperCase() + selectedArticle.category.slice(1)}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                </div>

                {/* Article Content */}
                <div className="p-6">
                  <img
                    src={selectedArticle.imageUrl}
                    alt={selectedArticle.title}
                    className="w-full h-64 object-cover rounded-lg mb-6"
                  />
                  
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">{selectedArticle.title}</h1>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      {selectedArticle.source.name}
                    </span>
                    <span>Por {selectedArticle.author}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(selectedArticle.publishedAt)}
                    </span>
                  </div>
                  
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed mb-4">{selectedArticle.description}</p>
                    <p className="text-gray-700 leading-relaxed mb-4">{selectedArticle.content}</p>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => window.open(selectedArticle.url, '_blank')}
                      className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Leer artículo completo
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

export default NewsSearch;