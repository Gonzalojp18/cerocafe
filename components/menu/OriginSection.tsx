import { motion } from "framer-motion";
import { Instagram, Wifi, MessageCircle, Clock, MapPin } from "lucide-react";

const OriginSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-[#1A3C34]/5 rounded-3xl p-6 md:p-10 mt-16"
    >
      <div className="text-center mb-8 md:mb-10">
        <h3 className="text-xl md:text-2xl font-serif text-[#1A3C34] tracking-wider">VISITANOS</h3>
        <div className="w-12 h-[1px] bg-[#1A3C34]/20 mx-auto mt-4" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
        {/* Left Column: Contact & Social */}
        <div className="space-y-6 md:space-y-8">
          {/* Instagram */}
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-[#1A3C34]/10 flex items-center justify-center shrink-0 text-[#1A3C34]">
              <Instagram size={20} />
            </div>
            <div>
              <h4 className="font-medium text-[#1A3C34] mb-1">Instagram</h4>
              <a 
                href="https://instagram.com/juliette_cafe_" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#1A3C34]/70 hover:text-[#1A3C34] transition-colors"
              >
                @juliette_cafe_
              </a>
            </div>
          </div>

          {/* WhatsApp */}
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-[#1A3C34]/10 flex items-center justify-center shrink-0 text-[#1A3C34]">
              <MessageCircle size={20} />
            </div>
            <div>
              <h4 className="font-medium text-[#1A3C34] mb-1">WhatsApp</h4>
              <a 
                href="https://wa.me/5491168009047"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1A3C34]/70 hover:text-[#1A3C34] transition-colors"
              >
                11 6800-9047
              </a>
            </div>
          </div>

          {/* WiFi */}
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-[#1A3C34]/10 flex items-center justify-center shrink-0 text-[#1A3C34]">
              <Wifi size={20} />
            </div>
            <div>
              <h4 className="font-medium text-[#1A3C34] mb-1">WiFi</h4>
              <div className="text-[#1A3C34]/70 text-sm space-y-0.5">
                <p><span className="font-medium">Red:</span> Juliette Cafe</p>
                <p><span className="font-medium">Clave:</span> cafeunico</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Hours & Location */}
        <div className="space-y-6 md:space-y-8">
          {/* Horarios */}
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-[#1A3C34]/10 flex items-center justify-center shrink-0 text-[#1A3C34]">
              <Clock size={20} />
            </div>
            <div>
              <h4 className="font-medium text-[#1A3C34] mb-1">Horarios</h4>
              <div className="text-[#1A3C34]/70 text-sm space-y-1">
                <p>Lunes: 15:30 a 20:00</p>
                <p>Martes a Sábado: 9:30 a 20:00</p>
                <p>Domingo: Cerrado</p>
              </div>
            </div>
          </div>

          {/* Ubicación */}
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-[#1A3C34]/10 flex items-center justify-center shrink-0 text-[#1A3C34]">
              <MapPin size={20} />
            </div>
            <div>
              <h4 className="font-medium text-[#1A3C34] mb-1">Ubicación</h4>
              <a 
                href="https://maps.google.com/?q=Mendez+de+Andes+900,+CABA"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1A3C34]/70 hover:text-[#1A3C34] transition-colors text-sm block leading-relaxed"
              >
                Mendez de Andes 900<br />
                CABA, Buenos Aires<br />
                Argentina
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OriginSection;
