import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    updateProduct: (id: string, product: Partial<Product>) => void;
    deleteProduct: (id: string) => void;
    importProducts: (products: Product[]) => void;
    getUniqueValues: (field: keyof Product) => string[];
    getFilteredOptions: (
        field: keyof Product,
        currentSelection: Partial<Record<keyof Product, string>>
    ) => { available: string[]; unavailable: string[] };
}

export const useProductStore = create<ProductState>()(
    persist(
        (set, get) => ({
            products: [],

            addProduct: (product) =>
                set((state) => ({
                    products: [...state.products, product],
                })),

            updateProduct: (id, updates) =>
                set((state) => ({
                    products: state.products.map((p) =>
                        p.id === id ? { ...p, ...updates } : p
                    ),
                })),

            deleteProduct: (id) =>
                set((state) => ({
                    products: state.products.filter((p) => p.id !== id),
                })),

            importProducts: (newProducts) =>
                set((state) => ({
                    products: [...state.products, ...newProducts],
                })),

            getUniqueValues: (field) => {
                const products = get().products;
                const values = [...new Set(products.map((p) => String(p[field])))];
                return values.filter((v) => v && v.trim() !== '');
            },

            getFilteredOptions: (field, currentSelection) => {
                const products = get().products;

                // Get all unique values for this field
                const allValues = [...new Set(products.map((p) => String(p[field])))].filter(
                    (v) => v && v.trim() !== ''
                );

                // Filter products based on current selection (excluding the current field)
                const filteredProducts = products.filter((product) => {
                    return Object.entries(currentSelection).every(([key, value]) => {
                        if (key === field || !value) return true;
                        return String(product[key as keyof Product]) === value;
                    });
                });

                // Get available values from filtered products
                const availableValues = [
                    ...new Set(filteredProducts.map((p) => String(p[field]))),
                ].filter((v) => v && v.trim() !== '');

                // Unavailable values are those not in the filtered set
                const unavailableValues = allValues.filter(
                    (v) => !availableValues.includes(v)
                );

                return {
                    available: availableValues.sort(),
                    unavailable: unavailableValues.sort(),
                };
            },
        }),
        {
            name: 'product-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
