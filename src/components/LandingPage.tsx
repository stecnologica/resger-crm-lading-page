import React, { useState } from 'react';
import { motion } from 'motion/react';
import { supabase } from '../supabase';

interface LandingPageProps {
  onStartDemo: (industry?: string) => void;
}

export default function LandingPage({ onStartDemo }: LandingPageProps) {
  const [pilotEmail, setPilotEmail] = useState('');
  const [pilotName, setPilotName] = useState('');
  const [pilotPhone, setPilotPhone] = useState('');
  const [pilotBusiness, setPilotBusiness] = useState('cafeteria');
  const [pilotSubmitted, setPilotSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handlePilotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pilotEmail && pilotName) {
      try {
        const { error } = await supabase.from('pilot_registrations').insert([
          {
            name: pilotName,
            phone: pilotPhone,
            email: pilotEmail,
            business_type: pilotBusiness
          }
        ]);
        
        if (error) throw error;

        // Enviar correo de invitación usando Supabase Auth (Magic Link)
        // Esto enviará un email al usuario con un enlace. 
        // Nota: El correo que se envía es el predeterminado de Supabase para "Magic Link" o "Signup".
        const { error: authError } = await supabase.auth.signInWithOtp({
          email: pilotEmail,
          options: {
            emailRedirectTo: 'https://res-ger-crm-v1.vercel.app/',
          }
        });

        if (authError) {
          console.error("Error enviando el correo de invitación:", authError);
          // Opcional: mostrar un aviso si falla el correo, aunque el registro fue exitoso
        }
        
        setPilotSubmitted(true);
        setTimeout(() => {
          // Automatically start the demo with their chosen industry after registration!
          onStartDemo(pilotBusiness);
        }, 3000);
      } catch (err: any) {
        console.error("Error guardando en Supabase:", err);
        const errorMsg = err?.message || JSON.stringify(err);
        alert(`Ocurrió un error al enviar la solicitud: ${errorMsg}\nPor favor intenta de nuevo.`);
      }
    }
  };

  const faqData = [
    {
      q: "¿Necesito instalar algo?",
      a: "No, RESGER CRM es 100% en la nube. Puedes acceder desde cualquier dispositivo con un navegador web y conexión a internet sin necesidad de instalar archivos pesados o realizar configuraciones complejas."
    },
    {
      q: "¿Puedo usarlo desde mi celular?",
      a: "¡Sí, por supuesto! La interfaz de RESGER es totalmente adaptativa (responsive) y funciona de manera excelente tanto en celulares Android y iPhone como en tablets y computadores de escritorio."
    },
    {
      q: "¿Mis datos están seguros?",
      a: "Utilizamos encriptación de grado bancario (SSL) y copias de seguridad automáticas diarias. Toda la información de tus ventas, clientes e inventario está resguardada de manera confidencial."
    },
    {
      q: "¿Cómo funciona el programa piloto?",
      a: "Los primeros 10 negocios seleccionados obtienen 60 días de acceso premium gratis y soporte de configuración prioritario a cambio de sus comentarios sinceros para seguir perfeccionando el producto."
    }
  ];

  return (
    <div className="bg-[#fbf8ff] text-[#191b25] font-sans overflow-x-hidden min-h-screen">
      {/* Top Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#fbf8ff]/85 backdrop-blur-md border-b border-[#c3c5d9]/30 shadow-xs">
        <div className="flex items-center justify-between px-6 h-20 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-3xl text-[#003ec7] font-bold">bar_chart</span>
            <span className="font-display text-2xl font-black tracking-tight text-[#003ec7]">RESGER</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 font-display">
            <a href="#features" className="text-sm font-medium text-[#434656] hover:text-[#003ec7] transition-colors relative after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-[#003ec7] hover:after:w-full after:transition-all">Características</a>
            <a href="#who-it-is-for" className="text-sm font-medium text-[#434656] hover:text-[#003ec7] transition-colors relative after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-[#003ec7] hover:after:w-full after:transition-all">Sectores</a>
            <a href="#pilot" className="text-sm font-medium text-[#434656] hover:text-[#003ec7] transition-colors relative after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-[#003ec7] hover:after:w-full after:transition-all">Programa Piloto</a>
            <a href="#faq" className="text-sm font-medium text-[#434656] hover:text-[#003ec7] transition-colors relative after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-[#003ec7] hover:after:w-full after:transition-all">Preguntas Frecuentes</a>
          </div>

          <div className="flex items-center gap-4">
            <a 
              href="https://res-ger-crm-v1.vercel.app/" 
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:block font-display text-sm font-semibold text-[#434656] hover:text-[#003ec7] transition-colors px-3 py-2 cursor-pointer"
            >
              Iniciar Sesión
            </a>
            <button 
              onClick={() => onStartDemo('cafeteria')} 
              className="hidden md:block font-display text-sm font-semibold text-[#434656] hover:text-[#003ec7] transition-colors px-3 py-2 cursor-pointer"
            >
              Iniciar Demo
            </button>
            <a 
              href="#pilot" 
              className="bg-[#003ec7] text-white px-5 py-2.5 rounded-lg font-display text-sm font-semibold hover:bg-[#0038b6] hover:scale-[1.03] transition-all cursor-pointer shadow-md hover:shadow-lg active:scale-[0.98]"
            >
              Probar Gratis
            </a>
          </div>
        </div>
      </nav>

      {/* Main Hero Content */}
      <main className="pt-20">
        <section className="hero-gradient relative overflow-hidden pt-12 pb-16 md:pt-24 md:pb-32">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="z-10 text-left"
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#dde1ff] text-[#0038b6] mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0052ff] animate-pulse"></span>
                CRM en la Nube de Siguiente Generación
              </span>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 text-[#191b25] leading-tight tracking-tight">
                El centro de control para hacer crecer tu negocio.
              </h1>
              <p className="text-lg text-[#434656] mb-8 max-w-xl leading-relaxed">
                Controla ventas, inventario, clientes y empleados desde una sola plataforma fácil de usar. Sin instalaciones complicadas y accesible desde cualquier lugar.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <button
                  onClick={() => onStartDemo('cafeteria')}
                  className="bg-[#003ec7] text-white px-8 py-4 rounded-xl font-display text-base font-bold hover:bg-[#0052ff] hover:scale-[1.03] shadow-lg hover:shadow-xl transition-all text-center cursor-pointer active:scale-95 flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-xl">rocket_launch</span>
                  Probar Demo Gratis
                </button>
                <a
                  href="#features"
                  className="bg-white border border-[#c3c5d9] text-[#003ec7] px-8 py-4 rounded-xl font-display text-base font-bold hover:bg-[#f3f2ff] hover:border-[#003ec7] transition-all text-center flex items-center justify-center gap-2 shadow-xs"
                >
                  <span className="material-symbols-outlined text-xl">explore</span>
                  Conocer Más
                </a>
              </div>

              <div className="flex flex-col gap-3 font-display">
                <div className="flex items-center gap-2 text-[#006c4b] font-semibold text-sm">
                  <span className="material-symbols-outlined text-lg">check_circle</span>
                  <span>Sin instalaciones ni servidores</span>
                </div>
                <div className="flex items-center gap-2 text-[#006c4b] font-semibold text-sm">
                  <span className="material-symbols-outlined text-lg">check_circle</span>
                  <span>Acceso móvil y de escritorio 24/7</span>
                </div>
                <div className="flex items-center gap-2 text-[#006c4b] font-semibold text-sm">
                  <span className="material-symbols-outlined text-lg">check_circle</span>
                  <span>Carga de inventario automática e instantánea</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* Main dashboard mockup screenshot */}
              <div className="glass-card rounded-2xl p-2 overflow-hidden border-2 border-white shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-700">
                <img 
                  className="w-full rounded-xl shadow-inner" 
                  alt="RESGER CRM Software Dashboard Preview" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBmnN-Rd5PdAX7oAJBC2qEFo39eMrQ9M9fGX5t_L477dgsulzd2nCpG_trQGz-Na_kw3VYiTBQDiQl-FOOPklMR2u0hxCTtg3gzRssoUGs2F1SpCROBJ4O20Na36t2ZkeMvidJYiy5Ue8vWMZ2KhVtA0ajsFWTlAdLDAxbMENYGhse9JH9wz1SPkLVKn2dej0OrzYoHt9-_xjpqtBITmTQkGAdUkoIiHCADHUAHT3IY0FfJkR3-PZbbb0xdQx5Nh6HESA1Xxbq2PSl_"
                  referrerPolicy="no-referrer"
                />
                
                {/* Floating KPI Mockup */}
                <div className="absolute -top-4 -left-4 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-[#dde1ff] shadow-lg animate-bounce duration-[5000ms] hidden sm:block">
                  <div className="text-[#434656] text-xs font-bold uppercase tracking-widest mb-1 font-display">Ventas Hoy</div>
                  <div className="text-[#003ec7] font-display text-2xl font-extrabold">$1,240.50</div>
                  <div className="text-[#006c4b] text-[10px] font-bold flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[12px]">trending_up</span>
                    +12% vs ayer
                  </div>
                </div>

                {/* Notification Mockup */}
                <div className="absolute -bottom-6 -right-2 bg-white/95 backdrop-blur-md p-3 rounded-xl border border-[#ffdad6] shadow-lg flex items-center gap-3 hidden sm:flex">
                  <div className="w-8 h-8 rounded-full bg-[#ffdad6] flex items-center justify-center text-[#ba1a1a]">
                    <span className="material-symbols-outlined text-lg">warning</span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#191b25] font-display">Alerta Stock Bajo</div>
                    <div className="text-[10px] text-[#434656]">Quedan 3 u. de 'Sandwich Caprese'</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="py-20 bg-white border-y border-[#c3c5d9]/20">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="font-display text-3xl font-extrabold text-[#191b25] mb-2 tracking-tight">
              ¿Tu negocio enfrenta alguno de estos problemas?
            </h2>
            <p className="text-[#434656] text-base mb-12 max-w-xl mx-auto">
              Si te identificas con alguna de estas situaciones, es hora de dar el salto digital con RESGER.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: "query_stats", title: "No sabes cuánto vendiste hoy", desc: "Monitorea tus ingresos en tiempo real sin tener que contar facturas al final del día." },
                { icon: "running_with_errors", title: "Pierdes productos por falta de control", desc: "Mantén un registro automatizado de entradas, salidas y mermas sin esfuerzo." },
                { icon: "inventory_2", title: "Tu inventario nunca coincide", desc: "El stock se descuenta automáticamente con cada venta realizada en el punto de venta." },
                { icon: "table_chart", title: "Todavía utilizas Excel o libretas", desc: "Evita errores de registro manual y datos perdidos en hojas de cálculo difíciles de manejar." },
                { icon: "badge", title: "No sabes qué empleado vende más", desc: "Lleva el control de productividad por vendedor y premia a los mejores de tu equipo." },
                { icon: "insights", title: "Falta de datos para tomar decisiones", desc: "Obtén gráficos automáticos de productos más vendidos y márgenes de ganancia reales." }
              ].map((prob, idx) => (
                <div key={idx} className="bg-[#fbf8ff] p-6 rounded-2xl border border-[#c3c5d9]/30 hover:border-[#003ec7]/50 hover:shadow-lg transition-all group duration-300 text-left">
                  <div className="w-12 h-12 bg-[#ededfb] rounded-xl flex items-center justify-center text-[#003ec7] mb-4 group-hover:scale-110 group-hover:bg-[#003ec7] group-hover:text-white transition-all duration-300">
                    <span className="material-symbols-outlined text-2xl">{prob.icon}</span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-[#191b25] mb-2 leading-snug">{prob.title}</h3>
                  <p className="text-sm text-[#434656] leading-relaxed">{prob.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-12">
              <div className="inline-flex glass-card px-8 py-4 rounded-full border-[#003ec7]/20">
                <p className="text-[#003ec7] font-bold font-display text-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">check_circle</span>
                  RESGER CRM fue creado para resolver exactamente estos problemas.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section id="features" className="py-20 bg-[#f3f2ff]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-12">
              <span className="font-display text-xs font-bold uppercase tracking-widest text-[#003ec7]">Funciones Principales</span>
              <h2 className="font-display text-3xl font-extrabold text-[#191b25] mt-1">Todo lo que necesitas en un solo lugar.</h2>
              <p className="text-[#434656] text-sm mt-2">Módulos perfectamente integrados que actualizan tus datos al instante.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Large Bento: Dashboard */}
              <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-[#c3c5d9]/30 relative overflow-hidden group min-h-[320px] flex flex-col justify-between">
                <div>
                  <span className="bg-[#dde1ff] text-[#003ece] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest font-display">Módulo Analítico</span>
                  <h3 className="font-display text-2xl font-extrabold mt-3 text-[#191b25]">Dashboard 360°</h3>
                  <p className="text-[#434656] text-sm mt-2 max-w-sm leading-relaxed">
                    Visualiza la salud financiera y operativa de tu negocio en tiempo real con gráficos interactivos de ventas, ganancias e inventario de forma automática.
                  </p>
                </div>
                <div className="mt-6 md:mt-0 md:absolute md:bottom-0 md:right-0 md:w-1/2 w-full translate-y-4 translate-x-4 group-hover:translate-y-1 group-hover:translate-x-1 transition-transform duration-500">
                  <img 
                    className="rounded-tl-xl shadow-2xl border border-[#c3c5d9]/30" 
                    alt="Dashboard bento preview" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2djimstoQy8N2b29R39LsWJRMRi5KLAOU7lkVAs5rPMupS2PXk6yRkJUetHoKlQao7QebYwhvFllB4CPB_jAEePYovU3-EXGBhvZI2c8JhXsVm4ZG7xg8F20VckncD6kkMonvKP0cTFjmZ6hN2YEaZvwTR3v4EOnnWFbzlK8WiLh1zGPCecf5ente3BS-FTbfYqNXw5zTNSQRMi6eZoOtd6tfNFqxy_jy1c31bXo6NLz_P2dUS_32XZJm_caKZCdf6aY_FKILN-i9"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              {/* Bento: POS */}
              <div className="bg-[#003ec7] text-white rounded-3xl p-8 relative overflow-hidden group hover:shadow-xl transition-all flex flex-col justify-between min-h-[320px]">
                <div>
                  <span className="bg-white/20 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest font-display">Operación Diaria</span>
                  <h3 className="font-display text-2xl font-bold mt-3">Punto de Venta (POS)</h3>
                  <p className="text-white/80 text-sm mt-2 leading-relaxed">
                    Rápido, táctil y adaptado para cualquier pantalla. Agrega productos al carrito, selecciona clientes, aplica descuentos y factura en segundos.
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex gap-1.5">
                    <div className="h-2 w-12 bg-white/20 rounded-full"></div>
                    <div className="h-2 w-24 bg-white/40 rounded-full"></div>
                    <div className="h-2 w-8 bg-white/20 rounded-full"></div>
                  </div>
                  <span className="material-symbols-outlined text-4xl opacity-30 group-hover:opacity-100 transition-opacity">point_of_sale</span>
                </div>
              </div>
            </div>

            {/* Feature Quick Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
              {[
                { icon: "inventory", color: "text-[#394e77]", title: "Gestión de Inventario", desc: "Control de stock, avisos de escasez y categorías organizadas." },
                { icon: "groups", color: "text-[#006c4b]", title: "Base de Clientes", desc: "Fidelización, historial de compras y datos de contacto de clientes." },
                { icon: "badge", color: "text-[#003ec7]", title: "Control de Empleados", desc: "Asignación de ventas, roles de seguridad y ranking de vendedores." },
                { icon: "analytics", color: "text-[#ba1a1a]", title: "Reportes Inteligentes", desc: "Reportes de pérdidas, ganancias y tendencias de compra descargables." }
              ].map((feat, idx) => (
                <div key={idx} className="bg-white p-5 rounded-2xl border border-[#c3c5d9]/30 flex flex-col justify-between hover:bg-[#fbf8ff] hover:shadow-md transition-all cursor-pointer">
                  <span className={`material-symbols-outlined text-3xl ${feat.color} mb-3`}>{feat.icon}</span>
                  <div>
                    <h4 className="font-display text-base font-bold text-[#191b25] mb-1">{feat.title}</h4>
                    <p className="text-xs text-[#434656] leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick row bottom */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
              {[
                { icon: "history", title: "Historial Completo", desc: "Auditoría de transacciones anteriores." },
                { icon: "domain", title: "Multiempresa", desc: "Soporta múltiples sucursales." },
                { icon: "payments", title: "Múltiples Métodos", desc: "Efectivo, tarjeta y transferencias." },
                { icon: "cloud_done", title: "Respaldo en la Nube", desc: "Datos siempre seguros en línea." }
              ].map((item, idx) => (
                <div key={idx} className="bg-white/60 p-4 rounded-xl border border-[#c3c5d9]/20 flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#003ec7] text-lg">{item.icon}</span>
                  <div>
                    <h5 className="font-display text-xs font-bold text-[#191b25]">{item.title}</h5>
                    <p className="text-[10px] text-[#434656]">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Video / Demo Interactive Section */}
        <section className="py-20 bg-[#e1e1ef]">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="font-display text-3xl font-extrabold text-[#191b25] mb-4">
              ¿Listo para ver RESGER CRM en acción?
            </h2>
            <p className="text-[#434656] text-base mb-10 max-w-2xl mx-auto">
              No tienes que imaginarlo. Haz clic abajo para iniciar nuestro simulador y explora el Punto de Venta, agrega productos y completa ventas de demostración tú mismo.
            </p>

            <div 
              onClick={() => onStartDemo('cafeteria')}
              className="relative max-w-4xl mx-auto rounded-3xl overflow-hidden group shadow-2xl aspect-video cursor-pointer border-4 border-white"
            >
              <div 
                className="bg-cover bg-center w-full h-full transform group-hover:scale-105 transition-transform duration-700 flex items-center justify-center" 
                style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAtNgSxMhVe5-CdB0w6zgx9L4SolIZG9mPXQXkfrToWCldSEE5XhUWy8i87lCpZSEiNIQuXTW8pehuNWKo1wYA3IxjRO4WpkIiX9d6Q_zMxZQVasI-z5tnAdDD14vfOd06lyzt4ipNKMYkn2jiqwTv0LQR_50ozDY0HnwwmtVLx5DNSSMU-Hcdy7IZOf_fKBsE9LtDPrS--YqVOqJwTahfI9djuXJ_CUHW6iHutwbNBTPq0thQifSMu3h5kHaF-gL49hUBY261j0trl')` }}
              >
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex flex-col items-center justify-center">
                  <button className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-[#003ec7] shadow-2xl group-hover:scale-110 transition-transform active:scale-95 duration-300">
                    <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                  </button>
                  <span className="mt-4 font-display text-white font-bold text-lg tracking-wider group-hover:tracking-widest transition-all">
                    INICIAR SIMULADOR INTERACTIVO
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="font-display text-xs font-bold uppercase tracking-widest text-[#003ec7]">Beneficios Clave</span>
                <h2 className="font-display text-3xl font-extrabold mb-8 text-[#191b25] tracking-tight">La tranquilidad de tener todo bajo control.</h2>
                
                <ul className="space-y-6">
                  {[
                    { icon: "language", title: "Control desde cualquier lugar", desc: "Accede a tus finanzas y operaciones en tiempo real desde tu celular, tablet o PC, estés donde estés." },
                    { icon: "verified", title: "Reduce errores humanos", desc: "Automatiza la conciliación de caja, evita mermas inexplicables y mantén sincronizados tus canales." },
                    { icon: "timer", title: "Ahorra más de 10 horas semanales", desc: "Olvídate de hacer sumas y balances en papel. RESGER genera todos los balances contables de manera instantánea." },
                    { icon: "trending_up", title: "Toma mejores decisiones", desc: "Aprende qué días vendes más, qué productos generan mayor utilidad y a quién debes reabastecer hoy." }
                  ].map((benefit, idx) => (
                    <li key={idx} className="flex gap-4 group">
                      <div className="shrink-0 w-10 h-10 rounded-full bg-[#dde1ff] flex items-center justify-center text-[#003ec7] group-hover:bg-[#003ec7] group-hover:text-white transition-all duration-300">
                        <span className="material-symbols-outlined text-lg">{benefit.icon}</span>
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-base text-[#191b25] mb-1">{benefit.title}</h4>
                        <p className="text-sm text-[#434656] leading-relaxed">{benefit.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-[#006c4b]/5 p-8 rounded-2xl border border-[#006c4b]/10 flex flex-col items-center text-center hover:scale-[1.03] transition-transform duration-300">
                  <span className="material-symbols-outlined text-[#006c4b] text-4xl mb-4">query_stats</span>
                  <div className="text-4xl font-extrabold text-[#191b25] font-display mb-1">+35%</div>
                  <div className="text-sm font-semibold text-[#006c4b] font-display mb-2">Eficiencia Operativa</div>
                  <p className="text-xs text-[#434656]">Registrado promedio en negocios que automatizan inventario.</p>
                </div>

                <div className="bg-[#003ec7]/5 p-8 rounded-2xl border border-[#003ec7]/10 mt-0 sm:mt-8 flex flex-col items-center text-center hover:scale-[1.03] transition-transform duration-300">
                  <span className="material-symbols-outlined text-[#003ec7] text-4xl mb-4">security</span>
                  <div className="text-4xl font-extrabold text-[#191b25] font-display mb-1">100%</div>
                  <div className="text-sm font-semibold text-[#003ec7] font-display mb-2">Seguridad de Datos</div>
                  <p className="text-xs text-[#434656]">Copias de seguridad automáticas y encriptación robusta.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Who it's for (Sectores) */}
        <section id="who-it-is-for" className="py-20 bg-[#f3f2ff]">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <span className="font-display text-xs font-bold uppercase tracking-widest text-[#003ec7]">Adaptabilidad</span>
            <h2 className="font-display text-3xl font-extrabold mb-2 text-[#191b25]">¿Quién puede utilizar RESGER CRM?</h2>
            <p className="text-[#434656] text-sm mb-12 max-w-xl mx-auto">Diseñado para adaptarse a las necesidades de comercios y locales modernos.</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { id: 'cafeteria', name: 'Cafeterías', icon: "local_cafe" },
                { id: 'ferreteria', name: 'Ferreterías', icon: "construction" },
                { id: 'restaurante', name: 'Restaurantes', icon: "restaurant" },
                { id: 'minimercado', name: 'Minimercados', icon: "storefront" },
                { id: 'papeleria', name: 'Papelerías', icon: "description" },
                { id: 'drogeria', name: 'Droguerías', icon: "medical_services" },
                { id: 'tiendas', name: 'Tiendas de Ropa', icon: "apparel" },
                { id: 'distribuidores', name: 'Distribuidores', icon: "local_shipping" }
              ].map((sect, idx) => (
                <div 
                  key={idx} 
                  onClick={() => {
                    // Start demo directly with this industry if supported, else default cafeteria
                    const supported = ['cafeteria', 'ferreteria', 'restaurante', 'minimercado', 'papeleria'];
                    onStartDemo(supported.includes(sect.id) ? sect.id : 'cafeteria');
                  }}
                  className="bg-white p-5 rounded-2xl flex items-center gap-4 border border-[#c3c5d9]/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#e1e1ef] flex items-center justify-center text-[#434656] group-hover:bg-[#003ec7] group-hover:text-white transition-all duration-300">
                    <span className="material-symbols-outlined text-xl">{sect.icon}</span>
                  </div>
                  <span className="font-display text-sm font-bold text-[#191b25]">{sect.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pilot Program Section */}
        <section id="pilot" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="bg-[#191b25] rounded-[40px] p-8 md:p-16 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#003ec7] opacity-25 blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <span className="bg-[#003ec7] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6 inline-block">Cupos Limitados</span>
                  <h2 className="font-display text-4xl font-extrabold mb-4 leading-tight">Buscamos nuestros primeros 15 negocios.</h2>
                  <p className="text-white/80 text-base mb-8">Únete gratuitamente durante 60 días, implementa RESGER en tu comercio con nuestra ayuda y ayúdanos a construir el futuro del software comercial.</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#3dfcb8]">check_circle</span>
                      <span>Configuración inicial gratuita</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#3dfcb8]">check_circle</span>
                      <span>Soporte personalizado vía WhatsApp</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#3dfcb8]">check_circle</span>
                      <span>Acceso total sin límites</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#3dfcb8]">check_circle</span>
                      <span>Sin plazos forzosos ni compromisos</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/15 shadow-xl">
                  {pilotSubmitted ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12"
                    >
                      <span className="material-symbols-outlined text-5xl text-[#3dfcb8] mb-4">stars</span>
                      <h3 className="font-display text-xl font-bold mb-2">¡Solicitud Enviada con Éxito!</h3>
                      <p className="text-white/80 text-sm mb-4">Te contactaremos al teléfono brindado para agendar tu configuración personalizada.</p>
                      <span className="inline-flex items-center gap-2 text-xs text-[#3dfcb8] animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-[#3dfcb8]"></span>
                        Iniciando simulador interactivo...
                      </span>
                    </motion.div>
                  ) : (
                    <form onSubmit={handlePilotSubmit} className="space-y-4">
                      <h3 className="font-display text-lg font-bold mb-2 text-center text-white">Inscríbete al programa piloto</h3>
                      <div>
                        <label className="block text-xs font-semibold text-white/70 mb-1 font-display">Nombre Completo</label>
                        <input 
                          type="text" 
                          required
                          value={pilotName}
                          onChange={(e) => setPilotName(e.target.value)}
                          placeholder="Tu nombre y apellido" 
                          className="w-full bg-white/10 text-white placeholder-white/40 border border-white/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0052ff] focus:bg-white/15 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-white/70 mb-1 font-display">Número de Teléfono</label>
                        <input 
                          type="tel" 
                          required
                          value={pilotPhone}
                          onChange={(e) => setPilotPhone(e.target.value)}
                          placeholder="ej. +54 9 11 1234 5678" 
                          className="w-full bg-white/10 text-white placeholder-white/40 border border-white/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0052ff] focus:bg-white/15 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-white/70 mb-1 font-display">Correo Electrónico</label>
                        <input 
                          type="email" 
                          required
                          value={pilotEmail}
                          onChange={(e) => setPilotEmail(e.target.value)}
                          placeholder="ejemplo@negocio.com" 
                          className="w-full bg-white/10 text-white placeholder-white/40 border border-white/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0052ff] focus:bg-white/15 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-white/70 mb-1 font-display">Giro / Tipo de Negocio</label>
                        <select 
                          value={pilotBusiness}
                          onChange={(e) => setPilotBusiness(e.target.value)}
                          className="w-full bg-slate-800 text-white border border-white/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0052ff] transition-all"
                        >
                          <option value="cafeteria">Cafetería</option>
                          <option value="ferreteria">Ferretería</option>
                          <option value="restaurante">Restaurante</option>
                          <option value="minimercado">Minimercado / Almacén</option>
                          <option value="papeleria">Papelería</option>
                        </select>
                      </div>

                      <button 
                        type="submit" 
                        className="w-full bg-[#003ec7] hover:bg-[#0052ff] text-white font-display text-sm font-bold py-3 rounded-xl transition-all shadow-md active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 mt-4"
                      >
                        <span className="material-symbols-outlined text-sm">stars</span>
                        Quiero participar
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-20 bg-[#fbf8ff]">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <span className="font-display text-xs font-bold uppercase tracking-widest text-[#003ec7]">Testimonios</span>
            <h2 className="font-display text-3xl font-extrabold mb-12 text-[#191b25]">Historias de éxito que estamos construyendo.</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { quote: "Estamos ansiosos por ver cómo RESGER revoluciona el control de nuestra ferretería. La interfaz del simulador ya se ve increíble.", name: "Próximamente", role: "Dueño de Negocio Ferretero" },
                { quote: "El soporte durante la fase beta ha sido excelente. El sistema de inventarios automáticos es justo lo que necesitábamos para dejar de usar libretas.", name: "Próximamente", role: "Administrador de Minimercado" },
                { quote: "La facilidad de uso en tablets es lo que más nos convenció. Mis empleados del café aprendieron a facturar y registrar en minutos.", name: "Próximamente", role: "Gerente de Tienda de Café" }
              ].map((test, idx) => (
                <div key={idx} className="bg-white p-8 rounded-2xl border border-[#c3c5d9]/30 italic text-[#434656] hover:shadow-lg transition-all duration-300 text-left relative flex flex-col justify-between">
                  <span className="material-symbols-outlined text-4xl text-[#003ec7]/10 absolute top-4 right-4">format_quote</span>
                  <p className="relative z-10 leading-relaxed mb-6 font-medium text-sm">"{test.quote}"</p>
                  <div className="not-italic flex items-center gap-3 border-t border-[#c3c5d9]/20 pt-4 mt-auto">
                    <div className="w-10 h-10 rounded-full bg-[#e1e1ef] flex items-center justify-center text-[#003ec7]">
                      <span className="material-symbols-outlined text-lg">person</span>
                    </div>
                    <div>
                      <div className="font-display font-bold text-sm text-[#191b25]">{test.name}</div>
                      <div className="text-[11px] text-[#434656]">{test.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-20 bg-[#f3f2ff]">
          <div className="max-w-3xl mx-auto px-6">
            <span className="font-display text-xs font-bold uppercase tracking-widest text-[#003ec7] text-center block mb-1">Soporte</span>
            <h2 className="font-display text-3xl font-extrabold text-center mb-12 text-[#191b25]">Preguntas Frecuentes</h2>
            
            <div className="space-y-4">
              {faqData.map((faq, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div key={idx} className="bg-white rounded-2xl border border-[#c3c5d9]/30 overflow-hidden shadow-xs">
                    <button 
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      className="w-full text-left p-6 font-display font-bold text-[#191b25] flex justify-between items-center hover:bg-[#fbf8ff] transition-colors cursor-pointer"
                    >
                      <span className="text-base sm:text-lg">{faq.q}</span>
                      <span className={`material-symbols-outlined transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#003ec7]' : 'text-[#434656]'}`}>
                        expand_more
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-6 text-sm text-[#434656] leading-relaxed border-t border-[#c3c5d9]/10 pt-4 bg-[#fbf8ff]/50">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#c3c5d9]/40 py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-2xl text-[#003ec7] font-bold">bar_chart</span>
              <span className="font-display text-xl font-bold tracking-tight text-[#003ec7]">RESGER</span>
            </div>
            <p className="text-xs text-[#434656] leading-relaxed mb-2">© 2026 RESGER CRM. El centro de control definitivo para digitalizar y hacer crecer tu negocio local.</p>
            <p className="text-[10px] text-[#434656]/60">Hecho en Argentina y Latinoamérica.</p>
          </div>

          <div>
            <h4 className="font-display text-xs font-bold mb-4 uppercase tracking-wider text-[#191b25]">Producto</h4>
            <ul className="space-y-2 text-xs text-[#434656]">
              <li><a href="#features" className="hover:text-[#003ec7] transition-all">Características</a></li>
              <li><button onClick={() => onStartDemo('cafeteria')} className="hover:text-[#003ec7] transition-all text-left">Demo Interactiva</button></li>
              <li><a href="#pilot" className="hover:text-[#003ec7] transition-all">Precios Especiales</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-xs font-bold mb-4 uppercase tracking-wider text-[#191b25]">Compañía</h4>
            <ul className="space-y-2 text-xs text-[#434656]">
              <li><a href="#" className="hover:text-[#003ec7] transition-all">Política de Privacidad</a></li>
              <li><a href="#" className="hover:text-[#003ec7] transition-all">Términos de Servicio</a></li>
              <li><a href="#pilot" className="hover:text-[#003ec7] transition-all">Soporte Técnico</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-xs font-bold mb-4 uppercase tracking-wider text-[#191b25]">Sígannos</h4>
            <div className="flex gap-4 text-xs text-[#434656]">
              <a href="#" className="hover:text-[#003ec7] transition-all font-display font-medium">Instagram</a>
              <a href="#" className="hover:text-[#003ec7] transition-all font-display font-medium">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
