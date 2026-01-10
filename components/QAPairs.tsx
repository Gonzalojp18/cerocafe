'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ChevronDown, Search } from "lucide-react";

interface QAPair {
  id: string;
  question: string;
  answer: string;
  timestamp: string;
  category: string;
}

interface QAPairsProps {
  isOpen: boolean;
  onClose: () => void;
}

const QAPairs = ({ isOpen, onClose }: QAPairsProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Mock data - In real app, this would come from your database/API
  const mockQAPairs: QAPair[] = [
    {
      id: "1",
      question: "¿Qué tipo de café tienen?",
      answer: "Tenemos café de especialidad de origen, con granos seleccionados de las mejores fincas. Contamos con opciones de filtro, espresso y métodos de preparación alternativos.",
      timestamp: "2024-01-15 10:30",
      category: "producto"
    },
    {
      id: "2", 
      question: "¿Tienen opciones veganas?",
      answer: "Sí, ofrecemos alternativas vegetales como leche de almendras, avena y soja. También tenemos opciones de comida vegana en nuestro menú de brunch.",
      timestamp: "2024-01-15 11:45",
      category: "dieta"
    },
    {
      id: "3",
      question: "¿A qué hora abren?",
      answer: "Abrimos de lunes a viernes de 8:00 a 20:00, y los fines de semana de 9:00 a 21:00. El horario puede variar en días festivos.",
      timestamp: "2024-01-15 12:20",
      category: "horario"
    },
    {
      id: "4",
      question: "¿Tienen WiFi?",
      answer: "Sí, contamos con WiFi gratuito para nuestros clientes. Solo solicita la contraseña en la barra y te la proporcionaremos con gusto.",
      timestamp: "2024-01-15 13:15",
      category: "servicios"
    }
  ];

  const categories = [
    { value: "all", label: "Todos" },
    { value: "producto", label: "Productos" },
    { value: "dieta", label: "Dieta" },
    { value: "horario", label: "Horario" },
    { value: "servicios", label: "Servicios" }
  ];

  const filteredQAPairs = mockQAPairs.filter(pair => {
    const matchesSearch = pair.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pair.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || pair.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleExpanded = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "producto": return "bg-orange-100 text-orange-800";
      case "dieta": return "bg-green-100 text-green-800";
      case "horario": return "bg-blue-100 text-blue-800";
      case "servicios": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Preguntas y Respuestas</h2>
              <p className="text-sm text-gray-600 mt-1">Consulta las preguntas frecuentes de nuestros clientes</p>
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
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar preguntas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.value
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Q&A List */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-3">
              {filteredQAPairs.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No se encontraron preguntas que coincidan con tu búsqueda.</p>
                </div>
              ) : (
                filteredQAPairs.map((pair) => (
                  <motion.div
                    key={pair.id}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <button
                      onClick={() => toggleExpanded(pair.id)}
                      className="w-full px-4 py-3 bg-white hover:bg-gray-50 transition-colors flex items-center justify-between text-left"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getCategoryColor(pair.category)}`}>
                            {categories.find(c => c.value === pair.category)?.label}
                          </span>
                          <span className="text-xs text-gray-500">{pair.timestamp}</span>
                        </div>
                        <p className="font-medium text-gray-900">{pair.question}</p>
                      </div>
                      {expandedId === pair.id ? (
                        <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      )}
                    </button>
                    
                    <AnimatePresence>
                      {expandedId === pair.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="border-t border-gray-200"
                        >
                          <div className="p-4 bg-gray-50">
                            <p className="text-gray-700 leading-relaxed">{pair.answer}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <p className="text-center text-sm text-gray-600">
              ¿No encuentras lo que buscas? <button className="text-orange-500 hover:text-orange-600 font-medium">Pregunta aquí</button>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default QAPairs;