import { motion } from "framer-motion";
import { useState } from "react";
import QAPairs from "./QAPairs";
import ImageSearch from "./ImageSearch";
import VideoSearch from "./VideoSearch";
import NewsSearch from "./NewsSearch";
import { MessageCircle, Image, Youtube, Newspaper } from "lucide-react";

const WelcomeText = () => {
  const [showQA, setShowQA] = useState(false);
  const [showImages, setShowImages] = useState(false);
  const [showVideos, setShowVideos] = useState(false);
  const [showNews, setShowNews] = useState(false);

  return (
    <>
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <p className="text-sm md:text-base text-black/80 max-w-md mx-auto px-6 leading-relaxed mb-6">
          Luz natural, texturas crudas y el aroma de especialidad.
          <br />
        </p>
        
        {/* Search Options */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <button
            onClick={() => setShowQA(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white/80 hover:text-white transition-all duration-200 backdrop-blur-sm border border-white/20"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm">Preguntas</span>
          </button>
          
          <button
            onClick={() => setShowImages(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white/80 hover:text-white transition-all duration-200 backdrop-blur-sm border border-white/20"
          >
            <Image className="w-4 h-4" />
            <span className="text-sm">Imágenes</span>
          </button>
          
          <button
            onClick={() => setShowVideos(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white/80 hover:text-white transition-all duration-200 backdrop-blur-sm border border-white/20"
          >
            <Youtube className="w-4 h-4" />
            <span className="text-sm">Videos</span>
          </button>
          
          <button
            onClick={() => setShowNews(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white/80 hover:text-white transition-all duration-200 backdrop-blur-sm border border-white/20"
          >
            <Newspaper className="w-4 h-4" />
            <span className="text-sm">Noticias</span>
          </button>
        </motion.div>
      </motion.div>

      {/* Modals */}
      <QAPairs isOpen={showQA} onClose={() => setShowQA(false)} />
      <ImageSearch isOpen={showImages} onClose={() => setShowImages(false)} />
      <VideoSearch isOpen={showVideos} onClose={() => setShowVideos(false)} />
      <NewsSearch isOpen={showNews} onClose={() => setShowNews(false)} />
    </>
  );
};

export default WelcomeText;
