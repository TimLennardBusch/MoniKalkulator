import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
  id: string;
  behandlung: string;
  produkt: string;
  typ: string;
  laenge: string;
  artikelId: string;
  preis: number;
  info: string;
}

interface ProductState {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, data: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  importProducts: (products: Product[]) => void;
  getUniqueValues: (field: keyof Product) => string[];
  getFilteredOptions: (
    field: 'behandlung' | 'produkt' | 'typ' | 'laenge',
    currentSelection: Record<string, string>
  ) => { available: string[]; unavailable: string[] };
}

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      products: [],

      addProduct: (product) =>
        set((state) => ({ products: [...state.products, product] })),

      updateProduct: (id, data) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...data } : p
          ),
        })),

      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),

      importProducts: (newProducts) =>
        set((state) => ({ products: [...state.products, ...newProducts] })),

      getUniqueValues: (field) => {
        const values = get().products.map((p) => String(p[field]));
        return [...new Set(values)].filter(Boolean);
      },

      getFilteredOptions: (field, currentSelection) => {
        const products = get().products;
        const allValues = [...new Set(products.map((p) => p[field]))].filter(Boolean);

        const matchingProducts = products.filter((p) => {
          if (currentSelection.behandlung && p.behandlung !== currentSelection.behandlung) return false;
          if (currentSelection.produkt && p.produkt !== currentSelection.produkt) return false;
          if (currentSelection.typ && p.typ !== currentSelection.typ) return false;
          if (currentSelection.laenge && p.laenge !== currentSelection.laenge) return false;
          return true;
        });

        const availableValues = [...new Set(matchingProducts.map((p) => p[field]))].filter(Boolean);
        const unavailableValues = allValues.filter((v) => !availableValues.includes(v));

        return {
          available: availableValues.sort((a, b) => a.localeCompare(b, 'de')),
          unavailable: unavailableValues.sort((a, b) => a.localeCompare(b, 'de')),
        };
      },
    }),
    {
      name: 'moni-products',
    }
  )
);
