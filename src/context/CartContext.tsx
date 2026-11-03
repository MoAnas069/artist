import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  id: string; // product id + frame id
  productId: string;
  title: string;
  slug: string;
  price: number;
  currency: string;
  currencySymbol: string;
  image: string;
  editionSize: number;
  frameOption: {
    id: string;
    name: string;
    priceDelta: number;
  };
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: any, frameOptionId?: string) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  totalCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const CART_STORAGE_KEY = 'chintwo_dusk_cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to save cart to localStorage:', e);
    }
  }, [items]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);

  const addItem = (product: any, frameOptionId: string = 'unframed') => {
    const frameOptions = product.framingOptions || [
      { id: 'unframed', name: 'Unframed (Rolled in archival casing)', priceDelta: 0 },
      { id: 'walnut', name: 'Solid American Walnut Frame', priceDelta: 110 },
      { id: 'black-oak', name: 'Stained Black Oak Frame', priceDelta: 95 },
      { id: 'natural-ash', name: 'Natural White Ash Frame', priceDelta: 105 },
    ];
    const chosenFrame = frameOptions.find((f: any) => f.id === frameOptionId) || frameOptions[0];
    const itemId = `${product.id}-${chosenFrame.id}`;
    const unitPrice = (product.price || 95) + chosenFrame.priceDelta;

    setItems((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing) {
        return prev.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: itemId,
          productId: product.id,
          title: product.title,
          slug: product.slug,
          price: unitPrice,
          currency: product.currency || 'GBP',
          currencySymbol: product.currency === 'GBP' ? '£' : (product.currencySymbol || '£'),
          image: (product.images && product.images[0]) || product.coverImage || '',
          editionSize: product.editionSize || 50,
          frameOption: chosenFrame,
          quantity: 1,
        },
      ];
    });

    setIsOpen(true);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const clearCart = () => setItems([]);

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart,
        closeCart,
        toggleCart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
