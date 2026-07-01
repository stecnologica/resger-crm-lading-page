import React from 'react';
import { motion } from 'motion/react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

export default function PrivacyPolicy({ onBack }: PrivacyPolicyProps) {
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
        <h1 className="font-display text-3xl font-black mb-10 text-[#003ec7]">Políticas de Privacidad y Tratamiento de Datos</h1>

        <section className="mb-10">
          <h2 className="font-display text-xl font-bold mb-4 uppercase tracking-wider text-[#191b25]">POLÍTICA DE TRATAMIENTO DE DATOS PERSONALES</h2>
          <p className="text-sm text-[#434656] mb-4"><strong>Responsable del tratamiento:</strong> Soluciones Tecnológicas SoftDev</p>
          <p className="text-sm text-[#434656] mb-4"><strong>Domicilio:</strong> Itagüí, Antioquia – Colombia</p>
          <p className="text-sm text-[#434656] mb-6"><strong>Identificación:</strong> 900.000.00-4</p>

          <h3 className="font-bold text-[#191b25] mb-2">1. Finalidad del tratamiento</h3>
          <p className="text-sm text-[#434656] mb-4">Los datos personales recolectados serán utilizados para:</p>
          <ul className="list-disc pl-5 mb-6 text-sm text-[#434656] space-y-1">
            <li>Crear cuentas de usuario en RESGER CRM.</li>
            <li>Gestionar clientes, proveedores y ventas.</li>
            <li>Prestar soporte técnico.</li>
            <li>Enviar notificaciones y correos automáticos.</li>
            <li>Mejorar el servicio y la seguridad.</li>
            <li>Cumplir obligaciones legales y tributarias.</li>
          </ul>

          <h3 className="font-bold text-[#191b25] mb-2">2. Datos recolectados</h3>
          <ul className="list-disc pl-5 mb-6 text-sm text-[#434656] space-y-1">
            <li>Nombres y apellidos.</li>
            <li>Documento de identidad o NIT.</li>
            <li>Dirección.</li>
            <li>Teléfono.</li>
            <li>Correo electrónico.</li>
            <li>Usuarios y credenciales cifradas.</li>
            <li>Información comercial y de facturación.</li>
            <li>Inventarios, productos, clientes y proveedores.</li>
            <li>Reportes e historial de ventas.</li>
            <li>Imágenes cargadas por el usuario.</li>
          </ul>

          <h3 className="font-bold text-[#191b25] mb-2">3. Derechos del titular</h3>
          <p className="text-sm text-[#434656] mb-4">El titular podrá:</p>
          <ul className="list-disc pl-5 mb-6 text-sm text-[#434656] space-y-1">
            <li>Conocer sus datos.</li>
            <li>Actualizar o corregir información.</li>
            <li>Solicitar eliminación cuando proceda.</li>
            <li>Revocar la autorización.</li>
            <li>Presentar consultas y reclamos.</li>
          </ul>

          <h3 className="font-bold text-[#191b25] mb-2">4. Seguridad</h3>
          <p className="text-sm text-[#434656] mb-6">SoftDev implementará medidas razonables de seguridad para proteger la confidencialidad e integridad de la información almacenada en la plataforma.</p>

          <h3 className="font-bold text-[#191b25] mb-2">5. Contacto</h3>
          <p className="text-sm text-[#434656] mb-6">Las solicitudes relacionadas con protección de datos podrán enviarse al correo que la empresa habilite para tal fin.</p>

          <h3 className="font-bold text-[#191b25] mb-2">6. Vigencia</h3>
          <p className="text-sm text-[#434656] mb-6">La presente política rige desde su publicación y podrá ser actualizada cuando sea necesario.</p>
        </section>

        <hr className="border-[#c3c5d9]/30 my-10" />

        <section>
          <h2 className="font-display text-xl font-bold mb-4 uppercase tracking-wider text-[#191b25]">POLÍTICA DE PRIVACIDAD DE RESGER CRM</h2>
          <p className="text-sm text-[#434656] mb-6 italic">Enfocada al uso de la plataforma SaaS</p>
          
          <p className="text-sm text-[#434656] mb-6">RESGER CRM es una plataforma tecnológica operada por Soluciones Tecnológicas SoftDev.</p>

          <h3 className="font-bold text-[#191b25] mb-2">¿Qué información recopilamos?</h3>
          <ul className="list-disc pl-5 mb-6 text-sm text-[#434656] space-y-1">
            <li>Información de registro.</li>
            <li>Datos de uso de la plataforma.</li>
            <li>Información comercial ingresada por el cliente.</li>
            <li>Registros de acceso y seguridad.</li>
            <li>Cookies y tecnologías similares (cuando aplique).</li>
          </ul>

          <h3 className="font-bold text-[#191b25] mb-2">¿Cómo usamos la información?</h3>
          <ul className="list-disc pl-5 mb-6 text-sm text-[#434656] space-y-1">
            <li>Prestar el servicio de CRM/POS.</li>
            <li>Autenticar usuarios.</li>
            <li>Generar reportes.</li>
            <li>Enviar comunicaciones operativas.</li>
            <li>Prevenir fraude y accesos no autorizados.</li>
          </ul>

          <h3 className="font-bold text-[#191b25] mb-2">Compartición de información</h3>
          <p className="text-sm text-[#434656] mb-6">SoftDev no venderá los datos personales. Solo podrá compartir información cuando exista obligación legal o sea necesario para operar la plataforma con proveedores tecnológicos.</p>

          <h3 className="font-bold text-[#191b25] mb-2">Conservación</h3>
          <p className="text-sm text-[#434656] mb-6">La información se conservará mientras exista la relación contractual o las obligaciones legales correspondientes.</p>

          <h3 className="font-bold text-[#191b25] mb-2">Transferencias internacionales</h3>
          <p className="text-sm text-[#434656] mb-6">Debido al uso de servicios en la nube, algunos datos podrían almacenarse en infraestructura ubicada fuera de Colombia, aplicando medidas de protección razonables.</p>

          <h3 className="font-bold text-[#191b25] mb-2">Cambios</h3>
          <p className="text-sm text-[#434656] mb-6">La política podrá modificarse y la versión vigente será la publicada en el sitio web de RESGER CRM.</p>
        </section>
      </motion.div>
    </div>
  );
}
