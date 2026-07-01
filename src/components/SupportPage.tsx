import React from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Mail, Globe } from 'lucide-react';

interface SupportPageProps {
  onBack: () => void;
}

export default function SupportPage({ onBack }: SupportPageProps) {
  return (
    <div className="bg-[#fbf8ff] text-[#191b25] font-sans min-h-screen pt-24 pb-20 px-6 max-w-4xl mx-auto">
      <button 
        onClick={onBack}
        className="mb-8 flex items-center gap-2 text-sm font-semibold text-[#003ec7] hover:text-[#002f96] transition-colors"
      >
        <span className="material-symbols-outlined text-base">arrow_back</span>
        Volver
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="p-8">
            {/* Header branding */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
              <div>
                <span className="px-2.5 py-1 bg-[#003ec7]/10 text-[#003ec7] text-[10px] font-black uppercase tracking-widest rounded-md">Desarrollador Oficial</span>
                <h3 className="text-2xl font-black text-[#091426] mt-2 font-display">Soporte Técnico SoftBootDev</h3>
                <p className="text-sm text-slate-500 font-medium mt-1">Estamos aquí para ayudarte a resolver dudas o inconvenientes con tu plataforma RESGER.</p>
              </div>
              <div className="flex items-center gap-2 bg-[#091426] text-white py-2.5 px-4 rounded-xl shadow-lg shrink-0">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></div>
                <span className="text-[11px] font-mono uppercase tracking-wider font-bold">Servicio Activo</span>
              </div>
            </div>

            {/* Grid of contact channels */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
              {/* WhatsApp */}
              <a
                href="https://wa.me/573007159393"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col justify-between p-5 bg-emerald-50/40 border border-emerald-100 hover:bg-emerald-50 hover:shadow-md rounded-2xl transition-all group cursor-pointer"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-black text-slate-800">Chat de WhatsApp</h4>
                  <p className="text-xs text-slate-500 font-medium mt-1">Soporte rápido e interactivo directo con un técnico.</p>
                </div>
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-6 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  Iniciar Chat &rarr;
                </span>
              </a>

              {/* Correo Electrónico */}
              <a
                href="mailto:stecnologicas97@gmail.com"
                className="flex flex-col justify-between p-5 bg-blue-50/40 border border-blue-100 hover:bg-blue-50 hover:shadow-md rounded-2xl transition-all group cursor-pointer"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-black text-slate-800">Correo de Soporte</h4>
                  <p className="text-xs text-slate-500 font-medium mt-1">Para reportes de fallos detallados o solicitudes formales.</p>
                </div>
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-6 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  Enviar Email &rarr;
                </span>
              </a>

              {/* Horario de Atención */}
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#091426] text-white flex items-center justify-center mb-4 shadow-md">
                    <Globe className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-black text-slate-800">Horarios de Soporte</h4>
                  <div className="text-xs text-slate-500 font-medium mt-1 space-y-1">
                    <p>Lunes a Viernes: 8:00 AM - 6:00 PM</p>
                    <p>Sábados: 9:00 AM - 1:00 PM</p>
                    <p>Zona horaria: Bogotá/Colombia</p>
                  </div>
                </div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-6">
                  Soporte no urgente 24h por Email
                </span>
              </div>
            </div>

            {/* Developer Info & Redes */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mt-8">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-2">Sobre SoftBootDev</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Somos una empresa dedicada a crear soluciones de software de alta calidad, ágiles e intuitivas para optimizar la administración y potenciar las ventas de tu negocio. Conoce más sobre nuestros servicios y proyectos en nuestras redes sociales y canal web.
              </p>

              {/* Social media links bar */}
              <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-slate-200/60">
                <a
                  href="https://www.facebook.com/profile.php?id=61590511572273"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-all shadow-sm"
                >
                  Facebook
                </a>
                <a
                  href="https://www.instagram.com/softbootdev/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-all shadow-sm"
                >
                  Instagram
                </a>
                <a
                  href="https://www.youtube.com/@softbootdev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-all shadow-sm"
                >
                  YouTube
                </a>
                <a
                  href="https://www.linkedin.com/in/soluciones-tecnologicas-1b0830415/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-all shadow-sm"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
