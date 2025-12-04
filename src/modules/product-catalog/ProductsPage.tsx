import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, MoreVertical, Edit, Trash2, Package, Tag, DollarSign, ShoppingCart } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  sku: string;
  cost: number;
  tags: string[];
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface CreateProductForm {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  sku: string;
  cost: number;
}

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [creating, setCreating] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateProductForm>();

  // Sample data
  useEffect(() => {
    const sampleProducts: Product[] = [
      {
        id: '1',
        name: 'Hydrating Facial Cream',
        description: 'Deep moisturizing cream for all skin types',
        price: 45.99,
        category: 'Skincare',
        stock: 25,
        image: '🧴',
        sku: 'SKIN-001',
        cost: 15.50,
        tags: ['moisturizing', 'sensitive skin', 'daily use']
      },
      {
        id: '2',
        name: 'Volumizing Shampoo',
        description: 'Adds volume and shine to fine hair',
        price: 32.50,
        category: 'Haircare',
        stock: 40,
        image: '🧴',
        sku: 'HAIR-001',
        cost: 10.25,
        tags: ['volume', 'shine', 'fine hair']
      },
      {
        id: '3',
        name: 'Anti-Aging Serum',
        description: 'Reduces fine lines and wrinkles',
        price: 89.99,
        category: 'Skincare',
        stock: 15,
        image: '💧',
        sku: 'SKIN-002',
        cost: 25.75,
        tags: ['anti-aging', 'wrinkles', 'premium']
      }
    ];
    setProducts(sampleProducts);
    setLoading(false);
  }, []);

  const categories = ['all', 'Skincare', 'Haircare', 'Makeup', 'Tools', 'Fragrance'];

  const onSubmit = async (data: CreateProductForm) => {
    try {
      setCreating(true);
      // In real app, call API here
      const newProduct: Product = {
        id: Date.now().toString(),
        ...data,
        image: '📦',
        tags: []
      };
      
      setProducts(prev => [newProduct, ...prev]);
      toast.success('Product added successfully!');
      setShowCreateModal(false);
      reset();
    } catch (error) {
      toast.error('Failed to add product');
    } finally {
      setCreating(false);
    }
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    toast.success('Added to cart!');
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const cartTotal = cart.reduce((sum, item) => 
    sum + (item.product.price * item.quantity), 0
  );

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Catalog</h1>
          <p className="text-gray-600">Manage your salon's products and inventory</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowCart(true)}
            className="relative btn-primary flex items-center space-x-2"
          >
            <ShoppingCart className="h-5 w-5" />
            <span>Cart</span>
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-soft p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Products</p>
              <p className="text-2xl font-bold">{products.length}</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-soft p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Low Stock</p>
              <p className="text-2xl font-bold">
                {products.filter(p => p.stock < 10).length}
              </p>
            </div>
            <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-soft p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Inventory Value</p>
              <p className="text-2xl font-bold">
                ${products.reduce((sum, p) => sum + (p.cost * p.stock), 0).toLocaleString()}
              </p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-soft p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Categories</p>
              <p className="text-2xl font-bold">{categories.length - 1}</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Tag className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-soft p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search products by name, description, or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <div key={product.id} className="bg-white rounded-xl shadow-soft overflow-hidden hover:shadow-glow transition">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-3xl mb-2">{product.image}</div>
                  <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  product.stock < 10 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                  {product.stock} in stock
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500">SKU: {product.sku}</span>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                    {product.category}
                  </span>
                  {product.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-gray-500">
                    Cost: ${product.cost.toFixed(2)}
                    <span className="ml-2 text-green-600">
                      Margin: {((product.price - product.cost) / product.cost * 100).toFixed(1)}%
                    </span>
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    className="btn-primary text-sm py-2 px-4"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Shopping Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 animate-slide-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Shopping Cart</h2>
              <button
                onClick={() => setShowCart(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">🛒</div>
                <p className="text-gray-500">Your cart is empty</p>
                <button
                  onClick={() => setShowCart(false)}
                  className="mt-4 text-pink-600 hover:text-pink-700 font-medium"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.product.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">{item.product.image}</div>
                        <div>
                          <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                          <p className="text-sm text-gray-600">${item.product.price.toFixed(2)} each</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="h-8 w-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100"
                          >
                            -
                          </button>
                          <span className="w-12 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="h-8 w-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                        
                        <div className="w-24 text-right font-medium">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </div>
                        
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-2 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 pt-6 border-t">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-lg font-medium">Total</span>
                    <span className="text-2xl font-bold">${cartTotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowCart(false)}
                      className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                      Continue Shopping
                    </button>
                    <button className="btn-primary px-6 py-2">
                      Checkout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Create Product Modal - Similar to customer modal but with product fields */}
      {/* Implement similar to Create Customer Modal with product-specific fields */}
    </div>
  );
};

export default ProductsPage;