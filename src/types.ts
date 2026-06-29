export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  category: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalSpent: number;
  registrationDate: string;
}

export interface Employee {
  id: string;
  name: string;
  role: 'Administrador' | 'Vendedor' | 'Gerente';
  totalSales: number;
  active: boolean;
}

export interface SaleItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

export interface Sale {
  id: string;
  date: string;
  items: SaleItem[];
  subtotal: number;
  discount: number; // percentage
  total: number;
  customerId?: string;
  customerName?: string;
  employeeId: string;
  employeeName: string;
  branch: string;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
}
