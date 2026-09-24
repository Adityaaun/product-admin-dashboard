import { useState, useEffect, useRef } from 'react';
import { getProducts, searchProducts, getProductsByCategory } from '@/api/products';
import { Product } from '@/types/product';
import axios from 'axios';
import { useProductMutations } from '@/context/ProductMutationsContext';

interface UseProductsResult {
  products: Product[];
  total: number;
  loading: boolean;
  error: string | null;
  retry: () => void;
}

export function useProductsFetch(
  query: string,
  category: string,
  sortBy: string,
  order: string,
  page: number,
  limit: number
): UseProductsResult {
  const { addedProducts, editedProducts, deletedProductIds } = useProductMutations();
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trigger, setTrigger] = useState(0);

  const requestIdRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    let isMounted = true;
    const currentRequestId = ++requestIdRef.current;

    // 4. Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const fetchData = async () => {
      // 5. New request
      setLoading(true);
      setError(null);
      try {
        const skip = (page - 1) * limit;
        let response;
        
        if (query) {
          response = await searchProducts(query, limit, skip, sortBy, order, abortController.signal);
        } else if (category) {
          response = await getProductsByCategory(category, limit, skip, sortBy, order);
        } else {
          response = await getProducts(limit, skip, sortBy, order);
        }

        // 6. Verify request identity
        if (isMounted && currentRequestId === requestIdRef.current) {
          // Apply session mutations
          let finalProducts = response.products.filter((p: Product) => !deletedProductIds[String(p.id)]);
          
          finalProducts = finalProducts.map((p: Product) => {
            const edited = editedProducts[String(p.id)];
            return edited ? { ...p, ...edited } : p;
          });

          if (page === 1 && !query && !category) {
            finalProducts = [...addedProducts, ...finalProducts];
          }

          // 7. Render only latest result
          setProducts(finalProducts);
          
          // Adjust total to account for deletions so pagination boundaries remain valid
          // A rough adjustment works for the current session
          let adjustedTotal = response.total;
          if (!query && !category) {
             adjustedTotal += addedProducts.length;
             // Try to count how many deleted items might be in the current total
             // For simplicity, we just subtract the size of deleted items if we assume they were part of the total
             adjustedTotal -= Object.keys(deletedProductIds).length;
          }
          setTotal(Math.max(0, adjustedTotal));
        }
      } catch (err) {
        if (axios.isCancel(err)) {
          // Ignored cancelled requests
        } else if (isMounted && currentRequestId === requestIdRef.current) {
          setError('Failed to load products. Please try again.');
        }
      } finally {
        if (isMounted && currentRequestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [query, category, sortBy, order, page, limit, trigger, addedProducts, deletedProductIds, editedProducts]);

  const retry = () => setTrigger(prev => prev + 1);

  return { products, total, loading, error, retry };
}
