import React from 'react';
import { motion } from 'motion/react';

interface TermsOfServiceProps {
  onBack: () => void;
}

export default function TermsOfService({ onBack }: TermsOfServiceProps) {
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
        <h1 className="font-display text-3xl font-black mb-10 text-[#003ec7]">Términos y Condiciones de Uso</h1>

        <section className="mb-10">
          <p className="text-sm text-[#434656] mb-6 italic">Contrato básico de uso SaaS - RESGER CRM</p>

          <h3 className="font-bold text-[#191b25] mb-2">1. Aceptación</h3>
          <p className="text-sm text-[#434656] mb-6">Al registrarse y utilizar RESGER CRM, el usuario acepta estos términos y condiciones.</p>

          <h3 className="font-bold text-[#191b25] mb-2">2. Licencia de uso</h3>
          <p className="text-sm text-[#434656] mb-6">SoftDev otorga una licencia limitada, no exclusiva, intransferible y revocable para usar la plataforma.</p>

          <h3 className="font-bold text-[#191b25] mb-2">3. Propiedad intelectual</h3>
          <p className="text-sm text-[#434656] mb-6">Todo el software, código fuente, diseños, marcas y funcionalidades de RESGER CRM son propiedad de Soluciones Tecnológicas SoftDev.</p>

          <h3 className="font-bold text-[#191b25] mb-2">4. Obligaciones del usuario</h3>
          <ul className="list-disc pl-5 mb-6 text-sm text-[#434656] space-y-1">
            <li>Usar la plataforma de manera lícita.</li>
            <li>Proteger sus credenciales.</li>
            <li>No intentar acceder sin autorización.</li>
            <li>No copiar ni revender el software.</li>
            <li>No realizar ingeniería inversa.</li>
          </ul>

          <h3 className="font-bold text-[#191b25] mb-2">5. Disponibilidad del servicio</h3>
          <p className="text-sm text-[#434656] mb-6">SoftDev procurará mantener la plataforma disponible, pero no garantiza disponibilidad ininterrumpida debido a mantenimientos, fallas técnicas o servicios de terceros.</p>

          <h3 className="font-bold text-[#191b25] mb-2">6. Limitación de responsabilidad</h3>
          <p className="text-sm text-[#434656] mb-6">SoftDev no será responsable por pérdidas indirectas, lucro cesante o interrupciones ocasionadas por terceros, proveedores de nube o eventos fuera de su control razonable.</p>

          <h3 className="font-bold text-[#191b25] mb-2">7. Suspensión de cuentas</h3>
          <p className="text-sm text-[#434656] mb-6">La empresa podrá suspender cuentas por incumplimiento de estos términos, uso fraudulento o actividades que comprometan la seguridad.</p>

          <h3 className="font-bold text-[#191b25] mb-2">8. Terminación</h3>
          <p className="text-sm text-[#434656] mb-6">El usuario podrá cancelar el servicio en cualquier momento y SoftDev podrá terminar la relación por incumplimiento contractual.</p>

          <h3 className="font-bold text-[#191b25] mb-2">9. Ley aplicable</h3>
          <p className="text-sm text-[#434656] mb-6">Estos términos se rigen por las leyes de la República de Colombia.</p>
        </section>
      </motion.div>
    </div>
  );
}
