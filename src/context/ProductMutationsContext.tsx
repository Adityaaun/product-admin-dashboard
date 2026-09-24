'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '@/types/product';

interface MutationsContextType {
  addedProducts: Product[];
  editedProducts: Record<string, Product>;
  deletedProductIds: Record<string, boolean>;
  addLocalProduct: (p: Product) => void;
  editLocalProduct: (id: string | number, p: Product) => void;
  deleteLocalProduct: (id: string | number) => void;
}

const MutationsContext = createContext<MutationsContextType | undefined>(undefined);

export function ProductMutationsProvider({ children }: { children: ReactNode }) {
  const [addedProducts, setAddedProducts] = useState<Product[]>([]);
  const [editedProducts, setEditedProducts] = useState<Record<string, Product>>({});
  const [deletedProductIds, setDeletedProductIds] = useState<Record<string, boolean>>({});

  const addLocalProduct = (p: Product) => {
    setAddedProducts((prev) => [p, ...prev]);
  };

  const editLocalProduct = (id: string | number, p: Product) => {
    setEditedProducts((prev) => ({ ...prev, [String(id)]: p }));
  };

  const deleteLocalProduct = (id: string | number) => {
    setDeletedProductIds((prev) => ({ ...prev, [String(id)]: true }));
  };

  return (
    <MutationsContext.Provider value={{
      addedProducts, editedProducts, deletedProductIds,
      addLocalProduct, editLocalProduct, deleteLocalProduct
    }}>
      {children}
    </MutationsContext.Provider>
  );
}

export function useProductMutations() {
  const context = useContext(MutationsContext);
  if (context === undefined) {
    throw new Error('useProductMutations must be used within a ProductMutationsProvider');
  }
  return context;
}
