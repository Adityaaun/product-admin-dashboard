import api from '@/lib/axios';
import { ProductListResponse } from '@/types/product';

export const fetchProducts = async (limit: number, skip: number): Promise<ProductListResponse> => {
  const response = await api.get<ProductListResponse>(`/products?limit=${limit}&skip=${skip}`);
  return response.data;
};
