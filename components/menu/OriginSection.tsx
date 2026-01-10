import { motion } from "framer-motion";
import { Instagram, Wifi, MessageCircle, Clock, MapPin } from "lucide-react";

const OriginSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-[#D7C1F1]/20 rounded-3xl p-6 md:p-10 mt-16"
    >
      <div className="text-center mb-8 md:mb-10">
        <h3 className="text-xl md:text-2xl font-serif text-black tracking-wider">VISITANOS</h3>
        <div className="w-12 h-[1px] bg-black/20 mx-auto mt-4" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
        {/* Left Column: Contact & Social */}
        <div className="space-y-6 md:space-y-8">
          {/* Instagram */}
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-[#FB732F]/20 flex items-center justify-center shrink-0 text-black">
              <Instagram size={20} />
            </div>
            <div>
              <h4 className="font-medium text-black mb-1">Instagram</h4>
              <a
                href="https://www.instagram.com/cerocafedeorigen/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black/70 hover:text-black transition-colors"
              >
                @cerocafedeorigen
              </a>
            </div>
          </div>

          {/* WhatsApp */}
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-[#FB732F]/20 flex items-center justify-center shrink-0 text-black">
              <MessageCircle size={20} />
            </div>
            <div>
              <h4 className="font-medium text-black mb-1">WhatsApp</h4>
              <a 
                href="https://wa.me/5491168009047"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black/70 hover:text-black transition-colors"
              >
                11 6800-9047
              </a>
            </div>
          </div>

          {/* WiFi */}
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-[#FB732F]/20 flex items-center justify-center shrink-0 text-black">
              <Wifi size={20} />
            </div>
            <div>
              <h4 className="font-medium text-black mb-1">WiFi</h4>
              <div className="text-black/70 text-sm space-y-0.5">
                <p><span className="font-medium">Red:</span> Cero Cafe</p>
                <p><span className="font-medium">Clave:</span> cafeunico</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Hours & Location */}
        <div className="space-y-6 md:space-y-8">
          {/* Horarios */}
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-[#FB732F]/20 flex items-center justify-center shrink-0 text-black">
              <Clock size={20} />
            </div>
            <div>
              <h4 className="font-medium text-black mb-1">Horarios</h4>
              <div className="text-black/70 text-sm space-y-1">
                <p>Lunes a Viernes: 8:00 a 20:00</p>
                <p>Sábado, Domingo y Feriados: 9:00 a 21:00</p>
              </div>
            </div>
          </div>

          {/* Ubicación */}
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-[#FB732F]/20 flex items-center justify-center shrink-0 text-black">
              <MapPin size={20} />
            </div>
            <div>
              <h4 className="font-medium text-black mb-1">Ubicación</h4>
              <a
                href="https://maps.google.com/?q=Av+Congreso+5080,+Villa+Urquiza,+Buenos+Aires,+Argentina"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black/70 hover:text-black transition-colors text-sm block leading-relaxed"
              >
                Av Congreso 5080<br />
                Villa Urquiza, Buenos Aires<br />
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
