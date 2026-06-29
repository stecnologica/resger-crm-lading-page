import { Product, Customer, Employee, Sale, Branch, SaleItem } from './types';

export const INDUSTRIES = [
  { id: 'cafeteria', name: 'Cafetería', icon: 'local_cafe' },
  { id: 'ferreteria', name: 'Ferretería', icon: 'construction' },
  { id: 'restaurante', name: 'Restaurante', icon: 'restaurant' },
  { id: 'minimercado', name: 'Minimercado / Tienda', icon: 'storefront' },
  { id: 'papeleria', name: 'Papelería', icon: 'description' }
];

export const INITIAL_PRODUCTS_BY_INDUSTRY: Record<string, Product[]> = {
  cafeteria: [
    { id: 'p1', name: 'Café Espresso Doble', description: 'Intenso café espresso de grano arábica seleccionado', price: 2.50, cost: 0.60, stock: 120, minStock: 20, category: 'Bebidas Calientes' },
    { id: 'p2', name: 'Capuccino Grande', description: 'Espresso con leche vaporizada y espuma cremosa', price: 3.50, cost: 0.90, stock: 85, minStock: 15, category: 'Bebidas Calientes' },
    { id: 'p3', name: 'Croissant de Almendras', description: 'Hojaldre francés crujiente relleno de crema de almendras', price: 3.00, cost: 1.10, stock: 8, minStock: 10, category: 'Repostería' }, // LOW STOCK!
    { id: 'p4', name: 'Muffin de Arándanos', description: 'Esponjoso panqué de vainilla con arándanos frescos', price: 2.80, cost: 0.80, stock: 15, minStock: 5, category: 'Repostería' },
    { id: 'p5', name: 'Té Matcha Latte', description: 'Té verde matcha premium con leche de avena', price: 4.20, cost: 1.20, stock: 45, minStock: 10, category: 'Bebidas Calientes' },
    { id: 'p6', name: 'Sandwich Caprese', description: 'Focaccia con mozzarella, tomate fresco, albahaca y pesto', price: 6.50, cost: 2.30, stock: 3, minStock: 8, category: 'Salados' }, // LOW STOCK!
    { id: 'p7', name: 'Café Frío (Cold Brew)', description: 'Café extraído en frío por 18 horas con hielo', price: 3.80, cost: 0.70, stock: 60, minStock: 12, category: 'Bebidas Frías' }
  ],
  ferreteria: [
    { id: 'p1', name: 'Martillo Pro de 16oz', description: 'Martillo de uña con mango de fibra de vidrio', price: 14.90, cost: 6.50, stock: 24, minStock: 5, category: 'Herramientas Manuales' },
    { id: 'p2', name: 'Taladro Inalámbrico 20V', description: 'Taladro percutor con 2 baterías de litio y maletín', price: 89.90, cost: 42.00, stock: 4, minStock: 5, category: 'Herramientas Eléctricas' }, // LOW STOCK!
    { id: 'p3', name: 'Juego de Destornilladores (6 pzas)', description: 'Destornilladores planos y phillips con mango ergonómico', price: 12.50, cost: 5.00, stock: 18, minStock: 4, category: 'Herramientas Manuales' },
    { id: 'p4', name: 'Cinta Métrica 5 metros', description: 'Flexómetro de alta resistencia con seguro', price: 5.50, cost: 1.80, stock: 40, minStock: 10, category: 'Medición' },
    { id: 'p5', name: 'Caja de Tornillos para Madera 2"', description: 'Caja con 100 tornillos autorroscantes fosfatados', price: 6.20, cost: 2.10, stock: 50, minStock: 15, category: 'Fijación' },
    { id: 'p6', name: 'Pintura Acrílica Blanca 1 Galón', description: 'Pintura de alta cobertura para interiores y exteriores', price: 28.00, cost: 13.50, stock: 2, minStock: 6, category: 'Pinturas' }, // LOW STOCK!
    { id: 'p7', name: 'Lijadora Orbital 240W', description: 'Lijadora de acabado con recolección de polvo', price: 45.00, cost: 21.00, stock: 8, minStock: 3, category: 'Herramientas Eléctricas' }
  ],
  restaurante: [
    { id: 'p1', name: 'Hamburguesa RESGER Double', description: 'Doble carne de res premium, queso cheddar, tocino y aderezo especial', price: 12.90, cost: 4.80, stock: 95, minStock: 20, category: 'Platillos Fuertes' },
    { id: 'p2', name: 'Papas Fritas Trufadas', description: 'Papas fritas crujientes con aceite de trufa y parmesano', price: 5.50, cost: 1.50, stock: 110, minStock: 15, category: 'Acompañamientos' },
    { id: 'p3', name: 'Pizza Margherita Artesanal', description: 'Salsa de tomate natural, mozzarella de búfala y albahaca fresca', price: 14.00, cost: 4.20, stock: 5, minStock: 10, category: 'Platillos Fuertes' }, // LOW STOCK!
    { id: 'p4', name: 'Ensalada César con Pollo', description: 'Lechuga romana, aderezo césar, croutones, parmesano y pechuga a la parrilla', price: 9.80, cost: 3.10, stock: 35, minStock: 8, category: 'Entradas' },
    { id: 'p5', name: 'Cerveza Artesanal IPA', description: 'Cerveza local con notas cítricas e intenso lúpulo', price: 4.50, cost: 1.80, stock: 48, minStock: 12, category: 'Bebidas' },
    { id: 'p6', name: 'Pastel Volcán de Chocolate', description: 'Pastelito de chocolate tibio con centro líquido y helado de vainilla', price: 6.90, cost: 2.00, stock: 3, minStock: 8, category: 'Postres' }, // LOW STOCK!
    { id: 'p7', name: 'Limonada de Coco', description: 'Bebida refrescante licuada con crema de coco fresca', price: 3.90, cost: 0.90, stock: 80, minStock: 15, category: 'Bebidas' }
  ],
  minimercado: [
    { id: 'p1', name: 'Arroz Extra de Grano Largo 1kg', description: 'Arroz blanco seleccionado grado 1', price: 1.80, cost: 0.90, stock: 250, minStock: 50, category: 'Abarrotes' },
    { id: 'p2', name: 'Aceite Vegetal Canola 1 Litro', description: 'Aceite de cocina de alta pureza y libre de colesterol', price: 3.90, cost: 2.10, stock: 8, minStock: 20, category: 'Abarrotes' }, // LOW STOCK!
    { id: 'p3', name: 'Leche Entera de Vaca 1L', description: 'Leche pasteurizada adicionada con vitaminas A y D', price: 1.40, cost: 0.80, stock: 180, minStock: 30, category: 'Lácteos' },
    { id: 'p4', name: 'Detergente Líquido Multiusos 2L', description: 'Fórmula concentrada con aroma fresco', price: 7.50, cost: 3.60, stock: 45, minStock: 10, category: 'Limpieza' },
    { id: 'p5', name: 'Cereal de Avena Tradicional 500g', description: 'Hojuelas de avena de grano entero listas para cocinar', price: 2.90, cost: 1.30, stock: 70, minStock: 15, category: 'Desayunos' },
    { id: 'p6', name: 'Jabón Corporal Humectante 3 pzas', description: 'Barra de jabón con crema humectante', price: 3.20, cost: 1.40, stock: 4, minStock: 12, category: 'Higiene Personal' }, // LOW STOCK!
    { id: 'p7', name: 'Café Molido Gourmet 250g', description: 'Café de altura 100% arábica tostado medio', price: 5.80, cost: 2.90, stock: 65, minStock: 15, category: 'Abarrotes' }
  ],
  papeleria: [
    { id: 'p1', name: 'Cuaderno Universitario Cuadriculado', description: '100 hojas, espiral metálico doble, tapa dura', price: 3.50, cost: 1.20, stock: 150, minStock: 25, category: 'Escolar' },
    { id: 'p2', name: 'Caja de Lapiceros de Gel Negro (12 pzas)', description: 'Punta fina 0.5mm de escritura ultra suave', price: 8.90, cost: 3.20, stock: 30, minStock: 8, category: 'Escritura' },
    { id: 'p3', name: 'Resma de Papel Carta Multifuncional', description: '500 hojas de papel blanco multiusos de 75g', price: 5.90, cost: 2.80, stock: 6, minStock: 15, category: 'Papel' }, // LOW STOCK!
    { id: 'p4', name: 'Plumas de Colores Surtidos (8 pzas)', description: 'Bolígrafos con grip ergonómico y tinta viva', price: 4.20, cost: 1.50, stock: 48, minStock: 10, category: 'Escritura' },
    { id: 'p5', name: 'Juego Geométrico Profesional', description: 'Contiene regla, escuadras, transportador y compás', price: 7.50, cost: 3.00, stock: 22, minStock: 5, category: 'Escolar' },
    { id: 'p6', name: 'Calculadora Científica 240 Funciones', description: 'Pantalla de 2 líneas, ideal para secundaria y bachillerato', price: 18.50, cost: 8.00, stock: 2, minStock: 5, category: 'Electrónicos' }, // LOW STOCK!
    { id: 'p7', name: 'Caja de Colores Premium (24 Tonos)', description: 'Lápices de colores con mina resistente y suave', price: 11.90, cost: 4.80, stock: 35, minStock: 8, category: 'Arte / Oficina' }
  ]
};

export const INITIAL_CUSTOMERS: Customer[] = [
  { id: 'c1', name: 'Alejandro Morales', email: 'ale.morales@mail.com', phone: '555-0192', totalSpent: 450.80, registrationDate: '2026-03-15' },
  { id: 'c2', name: 'Patricia Sánchez', email: 'patty.s@gmail.com', phone: '555-0481', totalSpent: 289.40, registrationDate: '2026-04-02' },
  { id: 'c3', name: 'Mauricio Restrepo', email: 'restrepo.m@outlook.com', phone: '555-0329', totalSpent: 830.00, registrationDate: '2026-01-10' },
  { id: 'c4', name: 'Beatriz Gómez', email: 'gomez.bea@mail.com', phone: '555-0744', totalSpent: 125.50, registrationDate: '2026-05-20' },
  { id: 'c5', name: 'Carlos Villamil', email: 'cvillamil@tech.com', phone: '555-0918', totalSpent: 1120.00, registrationDate: '2026-02-18' }
];

export const INITIAL_EMPLOYEES: Employee[] = [
  { id: 'e1', name: 'Laura Beltrán', role: 'Gerente', totalSales: 1850.50, active: true },
  { id: 'e2', name: 'Diego Torres', role: 'Vendedor', totalSales: 2450.80, active: true },
  { id: 'e3', name: 'Sofía Castro', role: 'Vendedor', totalSales: 1320.40, active: true },
  { id: 'e4', name: 'Andrés López', role: 'Administrador', totalSales: 0.00, active: true }
];

export const INITIAL_BRANCHES: Branch[] = [
  { id: 'b1', name: 'Sucursal Centro', address: 'Av. Principal #450, Sector Comercial' },
  { id: 'b2', name: 'Sucursal Norte', address: 'Plaza Las Flores, Local 12' },
  { id: 'b3', name: 'Sucursal Sur', address: 'Bulevar Sur #890, Zona Industrial' }
];

// Generates dynamic mock sales distributed over the last 7 days to populate graphs
export const generateInitialSales = (products: Product[]): Sale[] => {
  const sales: Sale[] = [];
  const employees = INITIAL_EMPLOYEES.filter(e => e.role === 'Vendedor' || e.role === 'Gerente');
  const customers = INITIAL_CUSTOMERS;
  const branches = INITIAL_BRANCHES;
  
  const today = new Date();
  
  // Create 15-20 sales spread over the last 7 days
  for (let i = 25; i >= 0; i--) {
    const saleDate = new Date();
    saleDate.setDate(today.getDate() - Math.floor(i / 3.5)); // distributed backwards
    
    // Pick random products
    const numItems = Math.floor(Math.random() * 3) + 1;
    const items: SaleItem[] = [];
    let subtotal = 0;
    
    for (let j = 0; j < numItems; j++) {
      const prod = products[Math.floor(Math.random() * products.length)];
      // avoid duplicates in same sale
      if (items.some(item => item.productId === prod.id)) continue;
      
      const qty = Math.floor(Math.random() * 3) + 1;
      const total = prod.price * qty;
      items.push({
        productId: prod.id,
        name: prod.name,
        price: prod.price,
        quantity: qty,
        total: parseFloat(total.toFixed(2))
      });
      subtotal += total;
    }
    
    if (items.length === 0) continue;
    
    const hasDiscount = Math.random() > 0.7;
    const discount = hasDiscount ? (Math.random() > 0.5 ? 10 : 15) : 0;
    const total = parseFloat((subtotal * (1 - discount / 100)).toFixed(2));
    
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const employee = employees[Math.floor(Math.random() * employees.length)];
    const branch = branches[Math.floor(Math.random() * branches.length)];
    
    sales.push({
      id: `S-${1000 + sales.length}`,
      date: saleDate.toISOString().split('T')[0],
      items,
      subtotal: parseFloat(subtotal.toFixed(2)),
      discount,
      total,
      customerId: customer.id,
      customerName: customer.name,
      employeeId: employee.id,
      employeeName: employee.name,
      branch: branch.name
    });
  }
  
  return sales;
};

// CRM Local Storage State Interface
export interface CRMState {
  industry: string;
  products: Product[];
  customers: Customer[];
  employees: Employee[];
  sales: Sale[];
  branches: Branch[];
  activeBranch: string;
}

export const loadCRMState = (): CRMState => {
  const saved = localStorage.getItem('resger_crm_state');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Error parsing saved CRM state, using defaults", e);
    }
  }
  
  // Default is 'cafeteria'
  const defaultIndustry = 'cafeteria';
  const products = INITIAL_PRODUCTS_BY_INDUSTRY[defaultIndustry];
  const sales = generateInitialSales(products);
  
  const state: CRMState = {
    industry: defaultIndustry,
    products,
    customers: INITIAL_CUSTOMERS,
    employees: INITIAL_EMPLOYEES,
    sales,
    branches: INITIAL_BRANCHES,
    activeBranch: 'Todas las Sucursales'
  };
  
  saveCRMState(state);
  return state;
};

export const saveCRMState = (state: CRMState): void => {
  localStorage.setItem('resger_crm_state', JSON.stringify(state));
};
