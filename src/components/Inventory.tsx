import React, { useState, useMemo } from 'react';
import { Product } from '../types';

interface InventoryProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onRestockProduct: (productId: string, amount: number) => void;
}

export default function Inventory({
  products,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onRestockProduct
}: InventoryProps) {
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>('all');

  // Product Add / Edit Modal States
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [cost, setCost] = useState<number | ''>('');
  const [stock, setStock] = useState<number | ''>('');
  const [minStock, setMinStock] = useState<number | ''>('');
  const [category, setCategory] = useState('');

  // 1. Unique Categories for form dropdown helper
  const existingCategories = useMemo(() => {
    const list = new Set<string>();
    products.forEach(p => list.add(p.category));
    return Array.from(list);
  }, [products]);

  // 2. Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const isLow = p.stock <= p.minStock && p.stock > 0;
      const isOut = p.stock <= 0;

      if (stockFilter === 'low') return matchesSearch && isLow;
      if (stockFilter === 'out') return matchesSearch && isOut;
      return matchesSearch;
    });
  }, [products, searchQuery, stockFilter]);

  // Open modal for adding
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setName('');
    setDescription('');
    setPrice('');
    setCost('');
    setStock('');
    setMinStock('');
    setCategory(existingCategories[0] || 'General');
    setShowModal(true);
  };

  // Open modal for editing
  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price);
    setCost(product.cost);
    setStock(product.stock);
    setMinStock(product.minStock);
    setCategory(product.category);
    setShowModal(true);
  };

  // Handle Form Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !category || price === '' || cost === '' || stock === '' || minStock === '') {
      alert("Por favor complete todos los campos obligatorios.");
      return;
    }

    const payload: Product = {
      id: editingProduct ? editingProduct.id : `P-${Date.now()}`,
      name,
      description,
      price: Number(price),
      cost: Number(cost),
      stock: Number(stock),
      minStock: Number(minStock),
      category
    };

    if (editingProduct) {
      onEditProduct(payload);
    } else {
      onAddProduct(payload);
    }

    setShowModal(false);
  };

  const handleDelete = (productId: string, productName: string) => {
    if (window.confirm(`¿Está seguro de que desea eliminar el producto "${productName}" del inventario?`)) {
      onDeleteProduct(productId);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display text-2xl font-black text-[#191b25] tracking-tight">Gestión de Inventario</h1>
          <p className="text-xs text-[#434656] mt-0.5">Controla existencias, precios de venta, costos y alertas críticas de reposición.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-[#003ec7] hover:bg-[#0052ff] text-white px-4 py-2.5 rounded-lg font-display text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">add_box</span>
          Agregar Producto
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-xl border border-[#c3c5d9]/30 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search */}
        <div className="relative w-full md:max-w-md">
          <span className="material-symbols-outlined text-[#737688] absolute left-3 top-2.5 text-lg">search</span>
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre, código o categoría..."
            className="w-full bg-[#fbf8ff] border border-[#c3c5d9]/50 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[#003ec7] transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
          {[
            { id: 'all', label: 'Todos los Productos', icon: 'list_alt' },
            { id: 'low', label: 'Stock Bajo', icon: 'warning' },
            { id: 'out', label: 'Sin Existencias', icon: 'error_outline' }
          ].map(opt => (
            <button
              key={opt.id}
              onClick={() => setStockFilter(opt.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-display flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                stockFilter === opt.id 
                  ? 'bg-[#003ec7]/10 text-[#003ec7] border border-[#003ec7]/20' 
                  : 'bg-slate-50 text-[#434656] border border-gray-100 hover:bg-slate-100'
              }`}
            >
              <span className="material-symbols-outlined text-sm">{opt.icon}</span>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Inventory Table */}
      <div className="bg-white rounded-xl border border-[#c3c5d9]/30 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fbf8ff] border-b border-[#c3c5d9]/30 text-[10px] font-bold uppercase tracking-wider text-gray-500 font-display">
                <th className="p-4">Producto</th>
                <th className="p-4">Categoría</th>
                <th className="p-4 text-right">Costo</th>
                <th className="p-4 text-right">Precio de Venta</th>
                <th className="p-4 text-center">Stock Disponible</th>
                <th className="p-4 text-center">Stock Mínimo</th>
                <th className="p-4 text-center">Estado</th>
                <th className="p-4 text-right">Acciones Rápidas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredProducts.map(prod => {
                const isOut = prod.stock <= 0;
                const isLow = prod.stock <= prod.minStock && prod.stock > 0;
                
                return (
                  <tr key={prod.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <div>
                        <div className="font-bold text-gray-900">{prod.name}</div>
                        <div className="text-[10px] text-[#434656] max-w-[200px] truncate">{prod.description || 'Sin descripción'}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-medium font-display">
                        {prod.category}
                      </span>
                    </td>
                    <td className="p-4 text-right font-mono font-medium text-[#434656]">${prod.cost.toFixed(2)}</td>
                    <td className="p-4 text-right font-mono font-bold text-gray-900">${prod.price.toFixed(2)}</td>
                    
                    <td className="p-4 text-center font-bold">
                      <div className="flex items-center justify-center gap-1.5">
                        <span className={`font-mono text-sm ${isOut ? 'text-red-600' : isLow ? 'text-amber-600' : 'text-gray-900'}`}>
                          {prod.stock}
                        </span>
                        <span className="text-gray-300">unidades</span>
                      </div>
                    </td>

                    <td className="p-4 text-center text-gray-500 font-mono">{prod.minStock} u.</td>
                    
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-display ${
                        isOut 
                          ? 'bg-red-100 text-red-800' 
                          : isLow 
                            ? 'bg-amber-100 text-amber-800' 
                            : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          isOut ? 'bg-red-600' : isLow ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}></span>
                        {isOut ? 'Agotado' : isLow ? 'Stock Bajo' : 'Al Día'}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* Quick increment buttons */}
                        <button
                          onClick={() => onRestockProduct(prod.id, 10)}
                          className="w-7 h-7 bg-emerald-50 text-[#006c4b] border border-emerald-100 hover:bg-[#3dfcb8]/20 rounded-md flex items-center justify-center font-black text-xs cursor-pointer"
                          title="Sumar +10 unidades instantáneo"
                        >
                          +10
                        </button>
                        
                        <button
                          onClick={() => handleOpenEdit(prod)}
                          className="w-7 h-7 bg-slate-50 hover:bg-[#dde1ff] text-[#434656] hover:text-[#003ec7] rounded-md flex items-center justify-center border border-gray-100 cursor-pointer"
                          title="Editar"
                        >
                          <span className="material-symbols-outlined text-sm">edit</span>
                        </button>

                        <button
                          onClick={() => handleDelete(prod.id, prod.name)}
                          className="w-7 h-7 bg-red-50 hover:bg-[#ffdad6] text-red-600 hover:text-[#ba1a1a] rounded-md flex items-center justify-center border border-transparent cursor-pointer"
                          title="Eliminar"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-gray-400 font-medium">
                    <span className="material-symbols-outlined text-4xl mb-2 block">inventory_2</span>
                    No se encontraron productos en esta categoría o filtro de stock.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT PRODUCT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#c3c5d9]/40">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
              <h3 className="font-display font-extrabold text-[#191b25] text-base">
                {editingProduct ? 'Editar Ficha de Producto' : 'Cargar Nuevo Producto'}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Product Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#434656] mb-1 font-display">Nombre del Producto *</label>
                  <input 
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="ej. Muffin de Nuez y Chocolate"
                    className="w-full bg-[#fbf8ff] border border-[#c3c5d9]/50 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#003ec7]"
                  />
                </div>

                {/* Category Selection */}
                <div>
                  <label className="block text-xs font-semibold text-[#434656] mb-1 font-display">Categoría *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#fbf8ff] border border-[#c3c5d9]/50 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#003ec7]"
                  >
                    {existingCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="General">General</option>
                  </select>
                </div>

                {/* Custom Category input */}
                <div>
                  <label className="block text-xs font-semibold text-[#434656] mb-1 font-display">O Crear Nueva Categoría</label>
                  <input 
                    type="text"
                    placeholder="ej. Promociones"
                    onChange={(e) => {
                      if (e.target.value) setCategory(e.target.value);
                    }}
                    className="w-full bg-[#fbf8ff] border border-[#c3c5d9]/50 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#003ec7]"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-xs font-semibold text-[#434656] mb-1 font-display">Precio de Venta ($) *</label>
                  <input 
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="ej. 3.50"
                    className="w-full bg-[#fbf8ff] border border-[#c3c5d9]/50 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#003ec7]"
                  />
                </div>

                {/* Cost */}
                <div>
                  <label className="block text-xs font-semibold text-[#434656] mb-1 font-display">Costo Unitario ($) *</label>
                  <input 
                    type="number"
                    step="0.01"
                    required
                    value={cost}
                    onChange={(e) => setCost(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="ej. 1.10"
                    className="w-full bg-[#fbf8ff] border border-[#c3c5d9]/50 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#003ec7]"
                  />
                </div>

                {/* Stock */}
                <div>
                  <label className="block text-xs font-semibold text-[#434656] mb-1 font-display">Stock Inicial *</label>
                  <input 
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="ej. 50"
                    className="w-full bg-[#fbf8ff] border border-[#c3c5d9]/50 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#003ec7]"
                  />
                </div>

                {/* Min Stock */}
                <div>
                  <label className="block text-xs font-semibold text-[#434656] mb-1 font-display">Mínimo para Alerta *</label>
                  <input 
                    type="number"
                    required
                    value={minStock}
                    onChange={(e) => setMinStock(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="ej. 10"
                    className="w-full bg-[#fbf8ff] border border-[#c3c5d9]/50 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#003ec7]"
                  />
                </div>

                {/* Short Description */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#434656] mb-1 font-display">Descripción breve</label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="ej. Pan dulce horneado diariamente con cobertura fina..."
                    className="w-full bg-[#fbf8ff] border border-[#c3c5d9]/50 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#003ec7] h-16 resize-none"
                  />
                </div>

              </div>

              <div className="pt-4 flex gap-3 border-t border-gray-100">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-1/2 py-2.5 border border-[#c3c5d9] text-[#434656] rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="w-1/2 py-2.5 bg-[#003ec7] hover:bg-[#0052ff] text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  {editingProduct ? 'Guardar Cambios' : 'Registrar Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
